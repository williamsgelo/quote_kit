import "dotenv/config";

import assert from "node:assert/strict";
import { after, before, test } from "node:test";

import { QuoteActivityType, QuoteStatus } from "../../generated/prisma/client";
import { EmailDeliveryError, type QuoteEmailMessage } from "../../lib/email/resend";
import { prisma } from "../../lib/prisma";
import {
  ensureQuotePublicTokenForOrganization,
  getPublicQuoteAndMarkViewed,
  PublicQuoteExpiredError,
  QuoteSendError,
  respondToPublicQuote,
  sendQuoteForOrganization,
} from "../../lib/quotes/delivery-service";
import { getQuoteForOrganization } from "../../lib/quotes/queries";
import { createDraftQuoteForOrganization } from "../../lib/quotes/service";
import { QuoteTransitionError } from "../../lib/quotes/transitions";

const marker = `quote-delivery-${Date.now()}-${Math.random()
  .toString(36)
  .slice(2)}`;

let organizationAId = "";
let organizationBId = "";
let customerAId = "";
let customerWithoutEmailId = "";
let customerBId = "";
let sentQuoteId = "";
let sentPublicToken = "";
const deliveredMessages: QuoteEmailMessage[] = [];

function quoteInput(customerId: string, expiryDate = "2026-09-07") {
  return {
    customerId,
    issueDate: "2026-08-24",
    expiryDate,
    currency: "ZAR",
    discountType: "NONE",
    discountValue: "0.00",
    customerMessage: "Customer-visible delivery message",
    notes: "SECRET INTERNAL DELIVERY NOTE",
    terms: "Delivery test terms",
    items: [
      {
        catalogItemId: null,
        name: "Delivery service",
        description: "Quote delivery integration test",
        unit: "hour",
        quantity: "1.5000",
        unitPrice: "100.00",
        taxRate: "15.00",
      },
    ],
  };
}

async function createDraft(
  organizationId: string,
  customerId: string,
  expiryDate?: string,
) {
  return createDraftQuoteForOrganization(
    organizationId,
    quoteInput(customerId, expiryDate),
  );
}

async function fakeEmailSender(message: QuoteEmailMessage) {
  deliveredMessages.push(message);
  return { id: `email-${deliveredMessages.length}` };
}

async function sendForTest(organizationId: string, quoteId: string) {
  return sendQuoteForOrganization(organizationId, quoteId, {
    appUrl: "http://localhost:3000",
    emailSender: fakeEmailSender,
    now: new Date("2026-08-25T08:00:00.000Z"),
  });
}

before(async () => {
  const [organizationA, organizationB] = await Promise.all([
    prisma.organization.create({
      data: { name: `${marker} Organisation A` },
      select: { id: true },
    }),
    prisma.organization.create({
      data: { name: `${marker} Organisation B` },
      select: { id: true },
    }),
  ]);
  organizationAId = organizationA.id;
  organizationBId = organizationB.id;

  const [customerA, customerWithoutEmail, customerB] = await Promise.all([
    prisma.customer.create({
      data: {
        organizationId: organizationAId,
        name: "Delivery Customer A",
        companyName: "Delivery Company A",
        email: "delivery-a@example.test",
      },
      select: { id: true },
    }),
    prisma.customer.create({
      data: {
        organizationId: organizationAId,
        name: "Customer Without Email",
      },
      select: { id: true },
    }),
    prisma.customer.create({
      data: {
        organizationId: organizationBId,
        name: "Delivery Customer B",
        email: "delivery-b@example.test",
      },
      select: { id: true },
    }),
  ]);
  customerAId = customerA.id;
  customerWithoutEmailId = customerWithoutEmail.id;
  customerBId = customerB.id;
});

after(async () => {
  await prisma.organization.deleteMany({
    where: { id: { in: [organizationAId, organizationBId].filter(Boolean) } },
  });
  await prisma.$disconnect();
});

test("public token generation is stable, unique, tenant-scoped, and does not expose a draft", async () => {
  const [quoteA, quoteB] = await Promise.all([
    createDraft(organizationAId, customerAId),
    createDraft(organizationBId, customerBId),
  ]);
  const [tokenA, tokenB] = await Promise.all([
    ensureQuotePublicTokenForOrganization(organizationAId, quoteA.id),
    ensureQuotePublicTokenForOrganization(organizationBId, quoteB.id),
  ]);

  assert.notEqual(tokenA, tokenB);
  assert.equal(tokenA.length, 43);
  assert.equal(
    await ensureQuotePublicTokenForOrganization(organizationAId, quoteA.id),
    tokenA,
  );
  await assert.rejects(
    ensureQuotePublicTokenForOrganization(organizationAId, quoteB.id),
    QuoteSendError,
  );
  assert.equal(await getPublicQuoteAndMarkViewed(tokenA), null);
  assert.equal(await getPublicQuoteAndMarkViewed(quoteA.id), null);
  assert.equal(await getPublicQuoteAndMarkViewed("invalid-token"), null);
});

test("successful delivery sends snapshots, then records SENT atomically", async () => {
  const draft = await createDraft(organizationAId, customerAId);
  const sent = await sendForTest(organizationAId, draft.id);
  sentQuoteId = sent.id;
  sentPublicToken = sent.publicToken;

  assert.equal(sent.status, QuoteStatus.SENT);
  assert.equal(sent.publicUrl, `http://localhost:3000/q/${sent.publicToken}`);
  assert.equal(deliveredMessages.at(-1)?.to, "delivery-a@example.test");
  assert.match(deliveredMessages.at(-1)?.text ?? "", /Q-\d{6}/);
  assert.doesNotMatch(
    deliveredMessages.at(-1)?.html ?? "",
    /SECRET INTERNAL DELIVERY NOTE/,
  );

  const quote = await prisma.quote.findUniqueOrThrow({
    where: { id: draft.id },
    include: { activities: true },
  });
  assert.equal(quote.status, QuoteStatus.SENT);
  assert.equal(quote.sentAt?.toISOString(), "2026-08-25T08:00:00.000Z");
  assert.equal(
    quote.activities.filter((activity) => activity.type === QuoteActivityType.SENT)
      .length,
    1,
  );
});

test("first public view is idempotent and terminal states never downgrade", async () => {
  const firstView = await getPublicQuoteAndMarkViewed(
    sentPublicToken,
    new Date("2026-08-25T09:00:00.000Z"),
  );
  const refreshed = await getPublicQuoteAndMarkViewed(
    sentPublicToken,
    new Date("2026-08-25T10:00:00.000Z"),
  );
  assert.equal(firstView?.status, QuoteStatus.VIEWED);
  assert.equal(refreshed?.status, QuoteStatus.VIEWED);

  let quote = await prisma.quote.findUniqueOrThrow({
    where: { id: sentQuoteId },
    include: { activities: true },
  });
  assert.equal(
    quote.firstViewedAt?.toISOString(),
    "2026-08-25T09:00:00.000Z",
  );
  assert.equal(
    quote.activities.filter((activity) => activity.type === QuoteActivityType.VIEWED)
      .length,
    1,
  );

  const acceptedAt = new Date("2026-08-25T11:00:00.000Z");
  assert.equal(
    (await respondToPublicQuote(sentPublicToken, "ACCEPT", acceptedAt))?.status,
    QuoteStatus.ACCEPTED,
  );
  assert.equal(
    (await respondToPublicQuote(sentPublicToken, "ACCEPT", acceptedAt))?.changed,
    false,
  );
  assert.equal(
    (await getPublicQuoteAndMarkViewed(sentPublicToken))?.status,
    QuoteStatus.ACCEPTED,
  );

  quote = await prisma.quote.findUniqueOrThrow({
    where: { id: sentQuoteId },
    include: { activities: true },
  });
  assert.equal(quote.status, QuoteStatus.ACCEPTED);
  assert.equal(quote.acceptedAt?.toISOString(), acceptedAt.toISOString());
  assert.equal(
    quote.activities.filter(
      (activity) => activity.type === QuoteActivityType.ACCEPTED,
    ).length,
    1,
  );
  await assert.rejects(
    respondToPublicQuote(sentPublicToken, "DECLINE"),
    QuoteTransitionError,
  );
});

test("a SENT quote may be declined directly and repeated decline is idempotent", async () => {
  const draft = await createDraft(organizationAId, customerAId);
  const sent = await sendForTest(organizationAId, draft.id);
  const declinedAt = new Date("2026-08-25T12:00:00.000Z");

  assert.equal(
    (await respondToPublicQuote(sent.publicToken, "DECLINE", declinedAt))?.status,
    QuoteStatus.DECLINED,
  );
  assert.equal(
    (await respondToPublicQuote(sent.publicToken, "DECLINE", declinedAt))?.changed,
    false,
  );
  await assert.rejects(
    respondToPublicQuote(sent.publicToken, "ACCEPT"),
    QuoteTransitionError,
  );

  const quote = await prisma.quote.findUniqueOrThrow({
    where: { id: draft.id },
    include: { activities: true },
  });
  assert.equal(quote.declinedAt?.toISOString(), declinedAt.toISOString());
  assert.equal(
    quote.activities.filter(
      (activity) => activity.type === QuoteActivityType.DECLINED,
    ).length,
    1,
  );
});

test("a SENT quote may be accepted before separate view tracking", async () => {
  const draft = await createDraft(organizationAId, customerAId);
  const sent = await sendForTest(organizationAId, draft.id);
  const result = await respondToPublicQuote(sent.publicToken, "ACCEPT");
  assert.equal(result?.status, QuoteStatus.ACCEPTED);
});

test("email failure and missing email never falsely mark a quote SENT", async () => {
  const failedDraft = await createDraft(organizationAId, customerAId);
  await assert.rejects(
    sendQuoteForOrganization(organizationAId, failedDraft.id, {
      appUrl: "http://localhost:3000",
      emailSender: async () => {
        throw new Error("simulated provider failure");
      },
    }),
    EmailDeliveryError,
  );

  const failed = await prisma.quote.findUniqueOrThrow({
    where: { id: failedDraft.id },
    include: { activities: true },
  });
  assert.equal(failed.status, QuoteStatus.DRAFT);
  assert.equal(failed.sentAt, null);
  assert.equal(
    failed.activities.some((activity) => activity.type === QuoteActivityType.SENT),
    false,
  );

  const noEmailDraft = await createDraft(
    organizationAId,
    customerWithoutEmailId,
  );
  await assert.rejects(
    sendForTest(organizationAId, noEmailDraft.id),
    QuoteSendError,
  );
  const noEmail = await prisma.quote.findUniqueOrThrow({
    where: { id: noEmailDraft.id },
  });
  assert.equal(noEmail.status, QuoteStatus.DRAFT);
  assert.equal(noEmail.publicToken, null);
});

test("send and activity access remain organisation-scoped", async () => {
  const tenantBQuote = await createDraft(organizationBId, customerBId);
  await assert.rejects(
    sendForTest(organizationAId, tenantBQuote.id),
    QuoteSendError,
  );
  assert.equal(
    await getQuoteForOrganization(organizationBId, sentQuoteId),
    null,
  );
  await assert.rejects(
    sendForTest(organizationAId, sentQuoteId),
    QuoteTransitionError,
  );
});

test("expired quote acceptance is rejected without changing SENT status", async () => {
  const draft = await createDraft(
    organizationAId,
    customerAId,
    "2026-08-24",
  );
  const sent = await sendForTest(organizationAId, draft.id);
  await assert.rejects(
    respondToPublicQuote(
      sent.publicToken,
      "ACCEPT",
      new Date("2026-08-25T12:00:00.000Z"),
    ),
    PublicQuoteExpiredError,
  );
  const quote = await prisma.quote.findUniqueOrThrow({
    where: { id: draft.id },
  });
  assert.equal(quote.status, QuoteStatus.SENT);
  assert.equal(quote.acceptedAt, null);
});

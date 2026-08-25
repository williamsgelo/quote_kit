import "dotenv/config";

import assert from "node:assert/strict";
import { after, before, test } from "node:test";

import { QuoteStatus } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { getQuoteForOrganization } from "../../lib/quotes/queries";
import {
  createDraftQuoteForOrganization,
  QuoteNotEditableError,
  QuoteNotFoundError,
  updateDraftQuoteForOrganization,
} from "../../lib/quotes/service";
import { QuoteReferenceError } from "../../lib/quotes/snapshots";

const marker = `quote-persistence-${Date.now()}-${Math.random()
  .toString(36)
  .slice(2)}`;

let organizationAId = "";
let organizationBId = "";
let customerAId = "";
let customerBId = "";
let catalogItemAId = "";
let catalogItemBId = "";
let quoteAId = "";
let quoteANumber = 0;
let quoteBId = "";

function draftInput(
  customerId: string,
  catalogItemId: string | null = catalogItemAId,
) {
  return {
    customerId,
    issueDate: "2026-08-24",
    expiryDate: "2026-09-07",
    currency: "ZAR",
    discountType: "PERCENTAGE",
    discountValue: "10.00",
    customerMessage: "Thank you for the opportunity.",
    notes: "Internal persistence test note",
    terms: "Valid for fourteen days.",
    items: [
      {
        catalogItemId,
        name: "Customised consulting snapshot",
        description: "Quote-specific consulting scope",
        unit: "hour",
        quantity: "1.5000",
        unitPrice: "850.00",
        taxRate: "15.00",
      },
      {
        catalogItemId: null,
        name: "Custom workshop",
        description: "Ad hoc item not stored in Catalog",
        unit: "project",
        quantity: "2.0000",
        unitPrice: "100.00",
        taxRate: "0.00",
      },
    ],
    subtotal: "0.01",
    discountAmount: "0.01",
    taxTotal: "0.01",
    total: "0.01",
    organizationId: organizationBId,
    status: "ACCEPTED",
    quoteNumber: 999999,
  };
}

before(async () => {
  const [organizationA, organizationB] = await Promise.all([
    prisma.organization.create({
      data: { name: `${marker} organisation A` },
      select: { id: true },
    }),
    prisma.organization.create({
      data: { name: `${marker} organisation B` },
      select: { id: true },
    }),
  ]);
  organizationAId = organizationA.id;
  organizationBId = organizationB.id;

  const [customerA, customerB] = await Promise.all([
    prisma.customer.create({
      data: {
        organizationId: organizationAId,
        name: "Persistence Customer A",
        companyName: "Original Company A",
        email: "quote-a@example.test",
      },
      select: { id: true },
    }),
    prisma.customer.create({
      data: {
        organizationId: organizationBId,
        name: "Persistence Customer B",
      },
      select: { id: true },
    }),
  ]);
  customerAId = customerA.id;
  customerBId = customerB.id;

  const [catalogItemA, catalogItemB] = await Promise.all([
    prisma.catalogItem.create({
      data: {
        organizationId: organizationAId,
        name: "Persistence Service A",
        description: "Original Catalog A description",
        unit: "hour",
        unitPrice: "850.00",
        taxRate: "15.00",
      },
      select: { id: true },
    }),
    prisma.catalogItem.create({
      data: {
        organizationId: organizationBId,
        name: "Persistence Service B",
        description: "Other tenant service",
        unit: "hour",
        unitPrice: "500.00",
        taxRate: "15.00",
      },
      select: { id: true },
    }),
  ]);
  catalogItemAId = catalogItemA.id;
  catalogItemBId = catalogItemB.id;
});

after(async () => {
  await prisma.organization.deleteMany({
    where: { id: { in: [organizationAId, organizationBId].filter(Boolean) } },
  });
  await prisma.$disconnect();
});

test("creates a draft and persists canonical pricing and snapshots atomically", async () => {
  const created = await createDraftQuoteForOrganization(
    organizationAId,
    draftInput(customerAId),
  );
  quoteAId = created.id;
  quoteANumber = created.quoteNumber;

  const quote = await prisma.quote.findFirstOrThrow({
    where: { id: quoteAId, organizationId: organizationAId },
    include: { items: { orderBy: { position: "asc" } } },
  });

  assert.equal(quote.status, QuoteStatus.DRAFT);
  assert.equal(quote.quoteNumber, 1);
  assert.equal(quote.customerName, "Persistence Customer A");
  assert.equal(quote.customerCompanyName, "Original Company A");
  assert.equal(quote.subtotal.toFixed(2), "1475.00");
  assert.equal(quote.discountAmount.toFixed(2), "147.50");
  assert.equal(quote.taxTotal.toFixed(2), "172.13");
  assert.equal(quote.total.toFixed(2), "1499.63");
  assert.equal(quote.items.length, 2);
  assert.equal(quote.items[0].catalogItemId, catalogItemAId);
  assert.equal(quote.items[0].name, "Customised consulting snapshot");
  assert.equal(quote.items[0].quantity.toFixed(4), "1.5000");
  assert.equal(quote.items[1].catalogItemId, null);
  assert.equal(quote.items[1].name, "Custom workshop");

  await Promise.all([
    prisma.customer.update({
      where: { id: customerAId },
      data: { companyName: "Changed Company A" },
    }),
    prisma.catalogItem.update({
      where: { id: catalogItemAId },
      data: { name: "Changed Catalog A", unitPrice: "999.99" },
    }),
  ]);

  const historical = await prisma.quote.findUniqueOrThrow({
    where: { id: quoteAId },
    include: { items: { orderBy: { position: "asc" } } },
  });
  assert.equal(historical.customerCompanyName, "Original Company A");
  assert.equal(historical.items[0].name, "Customised consulting snapshot");
  assert.equal(historical.items[0].unitPrice.toFixed(2), "850.00");
});

test("uses an independent quote-number sequence for each organisation", async () => {
  const input = draftInput(customerBId, null);
  input.discountType = "FIXED";
  input.discountValue = "25.00";
  input.items = [
    {
      catalogItemId: null,
      name: "Tenant B custom item",
      description: "Independent numbering",
      unit: "each",
      quantity: "1.0000",
      unitPrice: "100.00",
      taxRate: "15.00",
    },
  ];

  const created = await createDraftQuoteForOrganization(organizationBId, input);
  quoteBId = created.id;
  assert.equal(created.quoteNumber, 1);
  assert.equal(quoteANumber, 1);
});

test("tenant-scoped reads hide another organisation quote", async () => {
  assert.equal(
    await getQuoteForOrganization(organizationAId, quoteBId),
    null,
  );
  assert.equal(
    await getQuoteForOrganization(organizationBId, quoteAId),
    null,
  );
});

test("rejects customer and Catalog references from another organisation", async () => {
  await assert.rejects(
    createDraftQuoteForOrganization(
      organizationAId,
      draftInput(customerBId, null),
    ),
    QuoteReferenceError,
  );
  await assert.rejects(
    createDraftQuoteForOrganization(
      organizationAId,
      draftInput(customerAId, catalogItemBId),
    ),
    QuoteReferenceError,
  );
});

test("edits a draft atomically, recalculates totals, and preserves its number", async () => {
  const input = draftInput(customerAId, null);
  input.discountType = "FIXED";
  input.discountValue = "100.00";
  input.items = [
    {
      catalogItemId: null,
      name: "Edited fractional service",
      description: "Replacement item set",
      unit: "day",
      quantity: "2.2500",
      unitPrice: "400.00",
      taxRate: "15.00",
    },
  ];

  const updated = await updateDraftQuoteForOrganization(
    organizationAId,
    quoteAId,
    input,
  );
  assert.equal(updated.quoteNumber, quoteANumber);

  const quote = await prisma.quote.findUniqueOrThrow({
    where: { id: quoteAId },
    include: { items: true },
  });
  assert.equal(quote.quoteNumber, quoteANumber);
  assert.equal(quote.subtotal.toFixed(2), "900.00");
  assert.equal(quote.discountAmount.toFixed(2), "100.00");
  assert.equal(quote.taxTotal.toFixed(2), "120.00");
  assert.equal(quote.total.toFixed(2), "920.00");
  assert.equal(quote.items.length, 1);
  assert.equal(quote.items[0].name, "Edited fractional service");
});

test("cross-tenant and non-draft edits are rejected server-side", async () => {
  await assert.rejects(
    updateDraftQuoteForOrganization(
      organizationAId,
      quoteBId,
      draftInput(customerAId, null),
    ),
    QuoteNotFoundError,
  );

  await prisma.quote.update({
    where: { id: quoteAId },
    data: { status: QuoteStatus.SENT },
  });
  await assert.rejects(
    updateDraftQuoteForOrganization(
      organizationAId,
      quoteAId,
      draftInput(customerAId, null),
    ),
    QuoteNotEditableError,
  );
});

test("invalid input and references do not consume a quote number or persist a partial quote", async () => {
  const beforeState = await prisma.organization.findUniqueOrThrow({
    where: { id: organizationAId },
    select: { nextQuoteNumber: true, _count: { select: { quotes: true } } },
  });

  const invalidInputs: unknown[] = [
    { ...draftInput(customerAId, null), items: [] },
    {
      ...draftInput(customerAId, null),
      items: [
        {
          ...draftInput(customerAId, null).items[0],
          catalogItemId: null,
          quantity: "0.0000",
        },
      ],
    },
    {
      ...draftInput(customerAId, null),
      items: [
        {
          ...draftInput(customerAId, null).items[0],
          catalogItemId: null,
          taxRate: "100.01",
        },
      ],
    },
    {
      ...draftInput(customerAId, null),
      discountType: "PERCENTAGE",
      discountValue: "100.01",
    },
  ];

  for (const input of invalidInputs) {
    await assert.rejects(
      createDraftQuoteForOrganization(organizationAId, input),
    );
  }

  const afterState = await prisma.organization.findUniqueOrThrow({
    where: { id: organizationAId },
    select: { nextQuoteNumber: true, _count: { select: { quotes: true } } },
  });
  assert.deepEqual(afterState, beforeState);
});

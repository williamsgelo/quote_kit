import "dotenv/config";

import assert from "node:assert/strict";
import { after, before, test } from "node:test";

import { QuoteStatus } from "../../generated/prisma/client";
import {
  allocateNextQuoteNumber,
  formatQuoteNumber,
} from "../../lib/quotes/numbering";
import { prepareQuoteDraftForOrganization } from "../../lib/quotes/service";
import { QuoteReferenceError } from "../../lib/quotes/snapshots";
import { prisma } from "../../lib/prisma";

const marker = `quote-foundation-${Date.now()}-${Math.random()
  .toString(36)
  .slice(2)}`;
let organizationAId: string;
let organizationBId: string;
let customerAId: string;
let customerBId: string;
let catalogItemAId: string;
let catalogItemBId: string;

function quoteInput(customerId: string, catalogItemId: string | null) {
  return {
    customerId,
    issueDate: "2026-08-24",
    expiryDate: "2026-09-07",
    currency: "ZAR",
    discountType: "PERCENTAGE",
    discountValue: "10.00",
    customerMessage: "Prepared for integration testing",
    notes: "Internal note",
    terms: "Valid for fourteen days",
    items: [
      {
        catalogItemId,
        name: "Untrusted browser name",
        description: "Untrusted browser description",
        unit: "each",
        quantity: "1.5000",
        unitPrice: "0.01",
        taxRate: "0.00",
      },
    ],
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
        name: "Alpha Customer",
        companyName: "Alpha Company",
        email: "alpha@example.test",
        phone: "+27 82 100 0001",
        taxNumber: "ALPHA-TAX",
        addressLine1: "1 Alpha Street",
        city: "Cape Town",
        postalCode: "8001",
        country: "South Africa",
      },
      select: { id: true },
    }),
    prisma.customer.create({
      data: {
        organizationId: organizationBId,
        name: "Beta Customer",
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
        name: "Alpha Consulting",
        description: "Original catalog description",
        sku: "ALPHA-QUOTE",
        unit: "hour",
        unitPrice: "850.00",
        taxRate: "15.00",
      },
      select: { id: true },
    }),
    prisma.catalogItem.create({
      data: {
        organizationId: organizationBId,
        name: "Beta Service",
        description: "Other organisation service",
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

test("draft preparation snapshots trusted customer and catalog values", async () => {
  const prepared = await prepareQuoteDraftForOrganization(
    organizationAId,
    quoteInput(customerAId, catalogItemAId),
  );

  assert.equal(prepared.quote.customerName, "Alpha Customer");
  assert.equal(prepared.quote.customerCompanyName, "Alpha Company");
  assert.equal(prepared.quote.customerTaxNumber, "ALPHA-TAX");
  assert.equal(prepared.items[0].name, "Alpha Consulting");
  assert.equal(prepared.items[0].description, "Original catalog description");
  assert.equal(prepared.items[0].unit, "hour");
  assert.equal(prepared.items[0].unitPrice, "850.00");
  assert.equal(prepared.items[0].taxRate, "15.00");
  assert.equal(prepared.items[0].quantity, "1.5000");
  assert.equal(prepared.quote.subtotal, "1275.00");
  assert.equal(prepared.quote.discountAmount, "127.50");
  assert.equal(prepared.quote.taxTotal, "172.13");
  assert.equal(prepared.quote.total, "1319.63");

  const created = await prisma.$transaction(async (transaction) => {
    const quoteNumber = await allocateNextQuoteNumber(
      transaction,
      organizationAId,
    );

    return transaction.quote.create({
      data: {
        organizationId: organizationAId,
        customerId: prepared.quote.customerId,
        quoteNumber,
        status: QuoteStatus.DRAFT,
        issueDate: new Date(`${prepared.quote.issueDate}T00:00:00.000Z`),
        expiryDate: new Date(`${prepared.quote.expiryDate}T00:00:00.000Z`),
        currency: prepared.quote.currency,
        discountType: prepared.quote.discountType,
        discountValue: prepared.quote.discountValue,
        subtotal: prepared.quote.subtotal,
        discountAmount: prepared.quote.discountAmount,
        taxTotal: prepared.quote.taxTotal,
        total: prepared.quote.total,
        customerName: prepared.quote.customerName,
        customerCompanyName: prepared.quote.customerCompanyName,
        customerEmail: prepared.quote.customerEmail,
        customerPhone: prepared.quote.customerPhone,
        customerTaxNumber: prepared.quote.customerTaxNumber,
        customerAddressLine1: prepared.quote.customerAddressLine1,
        customerAddressLine2: prepared.quote.customerAddressLine2,
        customerCity: prepared.quote.customerCity,
        customerProvince: prepared.quote.customerProvince,
        customerPostalCode: prepared.quote.customerPostalCode,
        customerCountry: prepared.quote.customerCountry,
        customerMessage: prepared.quote.customerMessage,
        notes: prepared.quote.notes,
        terms: prepared.quote.terms,
        items: {
          create: prepared.items.map((item) => ({
            catalogItemId: item.catalogItemId,
            name: item.name,
            description: item.description,
            unit: item.unit,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            taxRate: item.taxRate,
            position: item.position,
            lineSubtotal: item.lineSubtotal,
            discountAmount: item.discountAmount,
            taxAmount: item.taxAmount,
            total: item.total,
          })),
        },
      },
      include: { items: true },
    });
  });

  assert.equal(created.quoteNumber, 1);
  assert.equal(formatQuoteNumber(created.quoteNumber), "Q-000001");
  assert.equal(created.items[0].quantity.toFixed(4), "1.5000");
  assert.equal(created.items[0].unitPrice.toFixed(2), "850.00");

  await Promise.all([
    prisma.customer.update({
      where: { id: customerAId },
      data: { name: "Changed Customer", companyName: "Changed Company" },
    }),
    prisma.catalogItem.update({
      where: { id: catalogItemAId },
      data: { name: "Changed Catalog Item", unitPrice: "999.99" },
    }),
  ]);
  const historicalQuote = await prisma.quote.findUniqueOrThrow({
    where: { id: created.id },
    include: { items: true },
  });

  assert.equal(historicalQuote.customerName, "Alpha Customer");
  assert.equal(historicalQuote.customerCompanyName, "Alpha Company");
  assert.equal(historicalQuote.items[0].name, "Alpha Consulting");
  assert.equal(historicalQuote.items[0].unitPrice.toFixed(2), "850.00");
});

test("custom quote items remain independent of Catalog", async () => {
  const input = quoteInput(customerAId, null);
  input.items[0] = {
    ...input.items[0],
    name: "Custom workshop",
    description: "A one-off workshop",
    unit: "project",
    unitPrice: "1200.00",
    taxRate: "0.00",
  };
  const prepared = await prepareQuoteDraftForOrganization(
    organizationAId,
    input,
  );

  assert.equal(prepared.items[0].catalogItemId, null);
  assert.equal(prepared.items[0].name, "Custom workshop");
  assert.equal(prepared.items[0].unitPrice, "1200.00");
});

test("another organisation customer is rejected without disclosure", async () => {
  await assert.rejects(
    prepareQuoteDraftForOrganization(
      organizationAId,
      quoteInput(customerBId, null),
    ),
    QuoteReferenceError,
  );
});

test("another organisation catalog item is rejected without disclosure", async () => {
  await assert.rejects(
    prepareQuoteDraftForOrganization(
      organizationAId,
      quoteInput(customerAId, catalogItemBId),
    ),
    QuoteReferenceError,
  );
});

test("organisation quote counters allocate unique numbers concurrently", async () => {
  const [numberingA, numberingB] = await Promise.all([
    prisma.organization.create({
      data: { name: `${marker} numbering A` },
      select: { id: true },
    }),
    prisma.organization.create({
      data: { name: `${marker} numbering B` },
      select: { id: true },
    }),
  ]);

  try {
    const numbersA = await Promise.all(
      Array.from({ length: 5 }, () =>
        prisma.$transaction((transaction) =>
          allocateNextQuoteNumber(transaction, numberingA.id),
        ),
      ),
    );
    const numberB = await prisma.$transaction((transaction) =>
      allocateNextQuoteNumber(transaction, numberingB.id),
    );

    assert.deepEqual(numbersA.sort((left, right) => left - right), [1, 2, 3, 4, 5]);
    assert.equal(new Set(numbersA).size, 5);
    assert.equal(numberB, 1);
  } finally {
    await prisma.organization.deleteMany({
      where: { id: { in: [numberingA.id, numberingB.id] } },
    });
  }
});

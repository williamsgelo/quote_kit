import assert from "node:assert/strict";
import test from "node:test";

import { quoteSchema } from "../../lib/validation/quote";

function validQuote() {
  return {
    customerId: "customer-1",
    issueDate: "2026-08-24",
    expiryDate: "2026-09-07",
    currency: "zar",
    discountType: "NONE",
    discountValue: "0",
    customerMessage: " Thank you for the opportunity. ",
    notes: "",
    terms: " Payment due on acceptance. ",
    items: [
      {
        catalogItemId: "",
        name: " Consulting ",
        description: " Discovery workshop ",
        unit: "hour",
        quantity: "1.5",
        unitPrice: "850",
        taxRate: "15",
      },
    ],
  };
}

test("quote validation normalises dates, decimals, currency, and optional text", () => {
  const quote = quoteSchema.parse(validQuote());

  assert.equal(quote.currency, "ZAR");
  assert.equal(quote.discountValue, "0.00");
  assert.equal(quote.customerMessage, "Thank you for the opportunity.");
  assert.equal(quote.notes, null);
  assert.equal(quote.terms, "Payment due on acceptance.");
  assert.equal(quote.items[0].catalogItemId, null);
  assert.equal(quote.items[0].name, "Consulting");
  assert.equal(quote.items[0].quantity, "1.5000");
  assert.equal(quote.items[0].unitPrice, "850.00");
  assert.equal(quote.items[0].taxRate, "15.00");
});

test("quote validation rejects expiry before issue date and empty items", () => {
  const invalid = quoteSchema.safeParse({
    ...validQuote(),
    expiryDate: "2026-08-23",
    items: [],
  });

  assert.equal(invalid.success, false);
  assert.ok(invalid.error?.flatten().fieldErrors.expiryDate?.length);
  assert.ok(invalid.error?.flatten().fieldErrors.items?.length);
});

test("quote validation rejects invalid dates and unsupported currency", () => {
  const invalid = quoteSchema.safeParse({
    ...validQuote(),
    issueDate: "2026-02-30",
    currency: "USD",
  });

  assert.equal(invalid.success, false);
  assert.ok(invalid.error?.flatten().fieldErrors.issueDate?.length);
  assert.ok(invalid.error?.flatten().fieldErrors.currency?.length);
});

test("quote validation rejects percentage discounts above 100", () => {
  const invalid = quoteSchema.safeParse({
    ...validQuote(),
    discountType: "PERCENTAGE",
    discountValue: "100.01",
  });

  assert.equal(invalid.success, false);
  assert.ok(invalid.error?.flatten().fieldErrors.discountValue?.length);
});

test("quote item validation rejects zero quantity and excess precision", () => {
  const zeroQuantity = quoteSchema.safeParse({
    ...validQuote(),
    items: [{ ...validQuote().items[0], quantity: "0" }],
  });
  const excessPrecision = quoteSchema.safeParse({
    ...validQuote(),
    items: [
      {
        ...validQuote().items[0],
        quantity: "1.00001",
        unitPrice: "10.001",
        taxRate: "15.001",
      },
    ],
  });

  assert.equal(zeroQuantity.success, false);
  assert.ok(zeroQuantity.error?.flatten().fieldErrors.items?.length);
  assert.equal(excessPrecision.success, false);
  assert.ok(excessPrecision.error?.flatten().fieldErrors.items?.length);
});

test("no-discount quotes require a zero discount value", () => {
  const invalid = quoteSchema.safeParse({
    ...validQuote(),
    discountValue: "1.00",
  });

  assert.equal(invalid.success, false);
  assert.ok(invalid.error?.flatten().fieldErrors.discountValue?.length);
});

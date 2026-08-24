import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateQuotePricing,
  QuotePricingError,
} from "../../lib/quotes/pricing";
import type { QuoteItemInput } from "../../lib/validation/quote";

function line(overrides: Partial<QuoteItemInput> = {}): QuoteItemInput {
  return {
    catalogItemId: null,
    name: "Service",
    description: "Test service",
    unit: "each",
    quantity: "1.0000",
    unitPrice: "100.00",
    taxRate: "15.00",
    ...overrides,
  };
}

function price({
  items,
  discountType = "NONE",
  discountValue = "0.00",
}: {
  items: QuoteItemInput[];
  discountType?: "NONE" | "PERCENTAGE" | "FIXED";
  discountValue?: string;
}) {
  return calculateQuotePricing({ items, discountType, discountValue });
}

test("calculates one R100 line with 15% tax", () => {
  const result = price({ items: [line()] });

  assert.equal(result.subtotal, "100.00");
  assert.equal(result.discountAmount, "0.00");
  assert.equal(result.taxTotal, "15.00");
  assert.equal(result.total, "115.00");
  assert.deepEqual(result.lines[0], {
    lineIndex: 0,
    lineSubtotal: "100.00",
    discountAmount: "0.00",
    taxableAmount: "100.00",
    taxAmount: "15.00",
    total: "115.00",
  });
});

test("supports multiple and fractional quantities", () => {
  const multiple = price({
    items: [line({ quantity: "2.0000", taxRate: "0.00" })],
  });
  const fractional = price({
    items: [
      line({
        quantity: "1.5000",
        unitPrice: "850.00",
        taxRate: "0.00",
      }),
    ],
  });

  assert.equal(multiple.subtotal, "200.00");
  assert.equal(multiple.total, "200.00");
  assert.equal(fractional.subtotal, "1275.00");
  assert.equal(fractional.total, "1275.00");
});

test("sums multiple line items without tax", () => {
  const result = price({
    items: [
      line({ quantity: "2.0000", taxRate: "0.00" }),
      line({
        quantity: "3.0000",
        unitPrice: "50.00",
        taxRate: "0.00",
      }),
    ],
  });

  assert.equal(result.subtotal, "350.00");
  assert.equal(result.taxTotal, "0.00");
  assert.equal(result.total, "350.00");
});

test("calculates mixed tax rates per discounted taxable line", () => {
  const result = price({
    items: [line(), line({ taxRate: "0.00" })],
  });

  assert.equal(result.subtotal, "200.00");
  assert.equal(result.taxTotal, "15.00");
  assert.equal(result.total, "215.00");
});

test("applies a percentage discount before tax", () => {
  const result = price({
    items: [line()],
    discountType: "PERCENTAGE",
    discountValue: "10.00",
  });

  assert.equal(result.subtotal, "100.00");
  assert.equal(result.discountAmount, "10.00");
  assert.equal(result.lines[0].taxableAmount, "90.00");
  assert.equal(result.taxTotal, "13.50");
  assert.equal(result.total, "103.50");
});

test("allocates a fixed discount proportionally before mixed-rate tax", () => {
  const result = price({
    items: [
      line(),
      line({ unitPrice: "300.00", taxRate: "0.00" }),
    ],
    discountType: "FIXED",
    discountValue: "40.00",
  });

  assert.equal(result.subtotal, "400.00");
  assert.equal(result.discountAmount, "40.00");
  assert.equal(result.lines[0].discountAmount, "10.00");
  assert.equal(result.lines[1].discountAmount, "30.00");
  assert.equal(result.taxTotal, "13.50");
  assert.equal(result.total, "373.50");
});

test("supports a maximum 100% percentage discount", () => {
  const result = price({
    items: [line()],
    discountType: "PERCENTAGE",
    discountValue: "100.00",
  });

  assert.equal(result.discountAmount, "100.00");
  assert.equal(result.taxTotal, "0.00");
  assert.equal(result.total, "0.00");
});

test("rejects a fixed discount greater than the subtotal", () => {
  assert.throws(
    () =>
      price({
        items: [line()],
        discountType: "FIXED",
        discountValue: "100.01",
      }),
    QuotePricingError,
  );
});

test("rounds line bases and tax deterministically with ROUND_HALF_UP", () => {
  const result = price({
    items: [line({ quantity: "0.3333", unitPrice: "10.00" })],
  });

  assert.equal(result.subtotal, "3.33");
  assert.equal(result.taxTotal, "0.50");
  assert.equal(result.total, "3.83");
});

test("allocates fractional discount cents without a negative last line", () => {
  const items = Array.from({ length: 4 }, () =>
    line({ unitPrice: "0.01", taxRate: "0.00" }),
  );
  const result = price({
    items,
    discountType: "FIXED",
    discountValue: "0.02",
  });

  assert.deepEqual(
    result.lines.map((item) => item.discountAmount),
    ["0.01", "0.01", "0.00", "0.00"],
  );
  assert.equal(result.total, "0.02");
});

test("retains precision for large supported monetary values", () => {
  const result = price({
    items: [
      line({
        quantity: "2.0000",
        unitPrice: "999999999999999.99",
        taxRate: "0.00",
      }),
    ],
  });

  assert.equal(result.subtotal, "1999999999999999.98");
  assert.equal(result.total, "1999999999999999.98");
});

import "server-only";

import { Prisma } from "@/generated/prisma/client";
import { MAX_MONEY_VALUE } from "@/lib/money";
import type { QuoteInput } from "@/lib/validation/quote";

const HUNDRED = new Prisma.Decimal(100);
const MAX_MONEY = new Prisma.Decimal(MAX_MONEY_VALUE);
const ZERO_CENTS = BigInt(0);
const ONE_CENT = BigInt(1);
const CENTS_PER_UNIT = BigInt(100);

type PricingInput = Pick<QuoteInput, "discountType" | "discountValue" | "items">;

export type QuoteLineCalculation = {
  lineIndex: number;
  lineSubtotal: string;
  discountAmount: string;
  taxableAmount: string;
  taxAmount: string;
  total: string;
};

export type QuotePricing = {
  lines: QuoteLineCalculation[];
  subtotal: string;
  discountAmount: string;
  taxTotal: string;
  total: string;
};

export class QuotePricingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "QuotePricingError";
  }
}

function roundMoney(value: Prisma.Decimal) {
  return value.toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);
}

function assertMoneyRange(label: string, value: Prisma.Decimal) {
  if (value.isNegative() || value.greaterThan(MAX_MONEY)) {
    throw new QuotePricingError(`${label} is outside the supported money range.`);
  }
}

function decimalToCents(value: Prisma.Decimal) {
  return BigInt(value.toFixed(2).replace(".", ""));
}

function centsToDecimal(cents: bigint) {
  const whole = cents / CENTS_PER_UNIT;
  const fraction = (cents % CENTS_PER_UNIT).toString().padStart(2, "0");
  return new Prisma.Decimal(`${whole}.${fraction}`);
}

/**
 * Allocates a quote-level discount proportionally using integer cents.
 *
 * Each exact allocation is floored to cents, then remaining cents are assigned
 * by largest remainder with line order as the stable tie-breaker. This ensures
 * line allocations always equal the quote discount without binary floating
 * point or a rounding-dependent "last line" adjustment.
 */
function allocateDiscount(
  lineSubtotals: Prisma.Decimal[],
  subtotal: Prisma.Decimal,
  discountAmount: Prisma.Decimal,
) {
  const discountCents = decimalToCents(discountAmount);

  if (discountCents === ZERO_CENTS) {
    return lineSubtotals.map(() => new Prisma.Decimal(0));
  }

  const subtotalCents = decimalToCents(subtotal);
  if (subtotalCents === ZERO_CENTS) {
    throw new QuotePricingError("A discount cannot be applied to a zero subtotal.");
  }

  const allocations = lineSubtotals.map((lineSubtotal, lineIndex) => {
    const numerator = discountCents * decimalToCents(lineSubtotal);
    return {
      lineIndex,
      cents: numerator / subtotalCents,
      remainder: numerator % subtotalCents,
    };
  });
  const allocatedCents = allocations.reduce(
    (sum, allocation) => sum + allocation.cents,
    ZERO_CENTS,
  );
  let remainingCents = discountCents - allocatedCents;
  const remainderOrder = [...allocations].sort((left, right) => {
    if (left.remainder === right.remainder) {
      return left.lineIndex - right.lineIndex;
    }
    return left.remainder > right.remainder ? -1 : 1;
  });

  for (const allocation of remainderOrder) {
    if (remainingCents === ZERO_CENTS) {
      break;
    }
    allocations[allocation.lineIndex].cents += ONE_CENT;
    remainingCents -= ONE_CENT;
  }

  return allocations.map((allocation) => centsToDecimal(allocation.cents));
}

function calculateDiscountAmount(
  input: PricingInput,
  subtotal: Prisma.Decimal,
) {
  if (input.discountType === "NONE") {
    return new Prisma.Decimal(0);
  }

  const discountValue = new Prisma.Decimal(input.discountValue);
  const discountAmount =
    input.discountType === "PERCENTAGE"
      ? roundMoney(subtotal.mul(discountValue).div(HUNDRED))
      : roundMoney(discountValue);

  if (discountAmount.greaterThan(subtotal)) {
    throw new QuotePricingError("Discount cannot exceed the quote subtotal.");
  }

  return discountAmount;
}

/**
 * Canonical MVP calculation order:
 * line base -> proportional quote discount -> line tax -> final total.
 *
 * Line bases, allocated discounts, and tax are rounded to currency precision
 * with ROUND_HALF_UP. Percentage and fixed discounts are allocated across line
 * subtotals before tax, so mixed tax rates remain mathematically valid.
 */
export function calculateQuotePricing(input: PricingInput): QuotePricing {
  if (input.items.length === 0) {
    throw new QuotePricingError("At least one quote item is required.");
  }

  const lineSubtotals = input.items.map((item) => {
    const lineSubtotal = roundMoney(
      new Prisma.Decimal(item.quantity).mul(item.unitPrice),
    );
    assertMoneyRange("Line subtotal", lineSubtotal);
    return lineSubtotal;
  });
  const subtotal = lineSubtotals.reduce(
    (sum, lineSubtotal) => sum.plus(lineSubtotal),
    new Prisma.Decimal(0),
  );
  assertMoneyRange("Quote subtotal", subtotal);

  const discountAmount = calculateDiscountAmount(input, subtotal);
  const allocatedDiscounts = allocateDiscount(
    lineSubtotals,
    subtotal,
    discountAmount,
  );
  const calculatedLines = input.items.map((item, lineIndex) => {
    const lineSubtotal = lineSubtotals[lineIndex];
    const allocatedDiscount = allocatedDiscounts[lineIndex];
    const taxableAmount = lineSubtotal.minus(allocatedDiscount);
    const taxAmount = roundMoney(
      taxableAmount.mul(item.taxRate).div(HUNDRED),
    );
    const total = taxableAmount.plus(taxAmount);

    assertMoneyRange("Line tax", taxAmount);
    assertMoneyRange("Line total", total);

    return {
      lineIndex,
      lineSubtotal: lineSubtotal.toFixed(2),
      discountAmount: allocatedDiscount.toFixed(2),
      taxableAmount: taxableAmount.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      total: total.toFixed(2),
    };
  });
  const taxTotal = calculatedLines.reduce(
    (sum, line) => sum.plus(line.taxAmount),
    new Prisma.Decimal(0),
  );
  const total = subtotal.minus(discountAmount).plus(taxTotal);

  assertMoneyRange("Quote tax", taxTotal);
  assertMoneyRange("Quote total", total);

  return {
    lines: calculatedLines,
    subtotal: subtotal.toFixed(2),
    discountAmount: discountAmount.toFixed(2),
    taxTotal: taxTotal.toFixed(2),
    total: total.toFixed(2),
  };
}

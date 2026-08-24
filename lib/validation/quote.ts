import { z } from "zod";

import { MAX_MONEY_VALUE, isDecimalAtMost } from "@/lib/money";
import { catalogUnits } from "@/lib/validation/catalog-item";
import { decimalString } from "@/lib/validation/decimal";

export const quoteStatuses = [
  "DRAFT",
  "SENT",
  "VIEWED",
  "ACCEPTED",
  "DECLINED",
  "EXPIRED",
  "CANCELLED",
] as const;

export const discountTypes = ["NONE", "PERCENTAGE", "FIXED"] as const;
export const supportedCurrencies = ["ZAR"] as const;

const optionalText = (label: string, maximum: number) =>
  z
    .preprocess(
      (value) =>
        typeof value === "string" && value.trim() === "" ? null : value,
      z
        .string()
        .trim()
        .max(maximum, `${label} must be no more than ${maximum} characters.`)
        .nullable()
        .optional(),
    )
    .transform((value) => value ?? null);

const recordId = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .max(100, `${label} is invalid.`);

const optionalRecordId = (label: string) =>
  z
    .preprocess(
      (value) =>
        typeof value === "string" && value.trim() === "" ? null : value,
      z
        .string()
        .trim()
        .max(100, `${label} is invalid.`)
        .nullable()
        .optional(),
    )
    .transform((value) => value ?? null);

const isoDate = (label: string) =>
  z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, `${label} must be a valid date.`)
    .refine((value) => {
      const date = new Date(`${value}T00:00:00.000Z`);
      return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
    }, `${label} must be a valid date.`);

export const quoteItemSchema = z.object({
  catalogItemId: optionalRecordId("Catalog item"),
  name: z
    .string()
    .trim()
    .min(1, "Item name is required.")
    .max(120, "Item name must be no more than 120 characters."),
  description: z
    .string()
    .trim()
    .max(1_000, "Description must be no more than 1000 characters.")
    .default(""),
  unit: z.enum(catalogUnits, "Select a valid unit."),
  quantity: decimalString({
    label: "Quantity",
    maximum: "999999999999999.9999",
    scale: 4,
    greaterThanZero: true,
  }),
  unitPrice: decimalString({
    label: "Unit price",
    maximum: MAX_MONEY_VALUE,
  }),
  taxRate: decimalString({ label: "Tax rate", maximum: "100.00" }),
});

export const quoteSchema = z
  .object({
    customerId: recordId("Customer"),
    issueDate: isoDate("Issue date"),
    expiryDate: isoDate("Expiry date"),
    currency: z.preprocess(
      (value) =>
        typeof value === "string" ? value.trim().toUpperCase() : value,
      z.enum(supportedCurrencies, "Select a supported currency."),
    ),
    discountType: z.enum(discountTypes, "Select a valid discount type."),
    discountValue: decimalString({
      label: "Discount value",
      maximum: MAX_MONEY_VALUE,
    }),
    customerMessage: optionalText("Customer message", 2_000),
    notes: optionalText("Notes", 5_000),
    terms: optionalText("Terms", 5_000),
    items: z
      .array(quoteItemSchema)
      .min(1, "Add at least one quote item.")
      .max(100, "A quote may contain no more than 100 items."),
  })
  .superRefine((quote, context) => {
    if (quote.expiryDate < quote.issueDate) {
      context.addIssue({
        code: "custom",
        path: ["expiryDate"],
        message: "Expiry date cannot be before the issue date.",
      });
    }

    if (
      quote.discountType === "PERCENTAGE" &&
      !isDecimalAtMost(quote.discountValue, "100.00")
    ) {
      context.addIssue({
        code: "custom",
        path: ["discountValue"],
        message: "Percentage discount must be between 0 and 100.",
      });
    }

    if (quote.discountType === "NONE" && quote.discountValue !== "0.00") {
      context.addIssue({
        code: "custom",
        path: ["discountValue"],
        message: "Discount value must be zero when no discount is selected.",
      });
    }
  });

export type QuoteItemInput = z.infer<typeof quoteItemSchema>;
export type QuoteInput = z.infer<typeof quoteSchema>;

import { z } from "zod";

import {
  isDecimalAtMost,
  normalizeDecimalString,
} from "@/lib/money";

const DECIMAL_PATTERN = /^\d+(?:\.\d{1,2})?$/;
const MAX_UNIT_PRICE = "99999999999999999.99";

const decimalField = (label: string, maximum: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .regex(DECIMAL_PATTERN, `${label} must have no more than 2 decimal places.`)
    .refine(
      (value) => isDecimalAtMost(value, maximum),
      `${label} is too large.`,
    )
    .transform((value) => normalizeDecimalString(value));

const optionalSku = z
  .preprocess(
    (value) =>
      typeof value === "string" && value.trim() === "" ? null : value,
    z
      .string()
      .trim()
      .max(64, "SKU must be no more than 64 characters.")
      .regex(
        /^[A-Za-z0-9][A-Za-z0-9._/-]*$/,
        "SKU may contain letters, numbers, dots, underscores, slashes, and hyphens.",
      )
      .nullable()
      .optional(),
  )
  .transform((value) => value ?? null);

export const catalogUnits = [
  "each",
  "hour",
  "day",
  "week",
  "month",
  "project",
] as const;

export const catalogItemSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Item name must be at least 2 characters.")
    .max(120, "Item name must be no more than 120 characters."),
  description: z
    .string()
    .trim()
    .min(2, "Description must be at least 2 characters.")
    .max(1_000, "Description must be no more than 1000 characters."),
  sku: optionalSku,
  unit: z.enum(catalogUnits, "Select a valid unit."),
  unitPrice: decimalField("Unit price", MAX_UNIT_PRICE),
  taxRate: decimalField("Tax rate", "100.00"),
});

export type CatalogItemInput = z.infer<typeof catalogItemSchema>;

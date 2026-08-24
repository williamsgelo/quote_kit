import { z } from "zod";

import { MAX_MONEY_VALUE } from "@/lib/money";
import { decimalString } from "@/lib/validation/decimal";

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
  unitPrice: decimalString({
    label: "Unit price",
    maximum: MAX_MONEY_VALUE,
  }),
  taxRate: decimalString({ label: "Tax rate", maximum: "100.00" }),
});

export type CatalogItemInput = z.infer<typeof catalogItemSchema>;

import { z } from "zod";

import {
  isDecimalAtMost,
  isDecimalGreaterThanZero,
  normalizeDecimalString,
} from "@/lib/money";

export function decimalString({
  label,
  maximum,
  scale = 2,
  greaterThanZero = false,
}: {
  label: string;
  maximum: string;
  scale?: number;
  greaterThanZero?: boolean;
}) {
  const pattern = new RegExp(`^\\d+(?:\\.\\d{1,${scale}})?$`);

  return z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .regex(
      pattern,
      `${label} must have no more than ${scale} decimal places.`,
    )
    .refine(
      (value) => !pattern.test(value) || isDecimalAtMost(value, maximum, scale),
      `${label} is too large.`,
    )
    .refine(
      (value) =>
        !greaterThanZero ||
        !pattern.test(value) ||
        isDecimalGreaterThanZero(value, scale),
      `${label} must be greater than zero.`,
    )
    .transform((value) => normalizeDecimalString(value, scale));
}

import "server-only";

import { Prisma } from "@/generated/prisma/client";

export function toDatabaseDecimal(value: string) {
  return new Prisma.Decimal(value);
}

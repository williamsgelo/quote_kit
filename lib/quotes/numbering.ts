import "server-only";

import type { Prisma } from "@/generated/prisma/client";

/**
 * Atomically increments the organisation-owned counter and returns the number
 * reserved by the current transaction. Call this inside the same transaction
 * that inserts the Quote so a failed insert also rolls back the allocation.
 * PostgreSQL serializes concurrent updates to the organisation row, while the
 * Quote database unique constraint remains the final collision safeguard.
 */
export async function allocateNextQuoteNumber(
  transaction: Prisma.TransactionClient,
  organizationId: string,
) {
  const organization = await transaction.organization.update({
    where: { id: organizationId, isActive: true },
    data: { nextQuoteNumber: { increment: 1 } },
    select: { nextQuoteNumber: true },
  });

  return organization.nextQuoteNumber - 1;
}

export function formatQuoteNumber(quoteNumber: number) {
  return `Q-${quoteNumber.toString().padStart(6, "0")}`;
}

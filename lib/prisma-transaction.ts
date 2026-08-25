import "server-only";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const MAX_TRANSACTION_ATTEMPTS = 3;
const TRANSACTION_MAX_WAIT_MS = 10_000;
const TRANSACTION_TIMEOUT_MS = 15_000;

function isRetryableTransactionError(error: unknown) {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    ["P1017", "P2028", "P2034"].includes(error.code)
  ) {
    return true;
  }

  if (typeof error !== "object" || error === null) {
    return false;
  }

  const adapterError = error as {
    name?: unknown;
    cause?: { kind?: unknown; originalCode?: unknown };
  };

  return (
    adapterError.name === "DriverAdapterError" &&
    (adapterError.cause?.kind === "ConnectionClosed" ||
      adapterError.cause?.kind === "TransactionWriteConflict" ||
      adapterError.cause?.originalCode === "40001")
  );
}

export async function runSerializableTransaction<T>(
  operation: (transaction: Prisma.TransactionClient) => Promise<T>,
) {
  for (let attempt = 1; attempt <= MAX_TRANSACTION_ATTEMPTS; attempt += 1) {
    try {
      return await prisma.$transaction(operation, {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        maxWait: TRANSACTION_MAX_WAIT_MS,
        timeout: TRANSACTION_TIMEOUT_MS,
      });
    } catch (error) {
      if (
        !isRetryableTransactionError(error) ||
        attempt === MAX_TRANSACTION_ATTEMPTS
      ) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, attempt * 100));
    }
  }

  throw new Error("Database transaction retry limit exceeded.");
}

import "server-only";

import { Prisma } from "@/generated/prisma/client";

const MAX_READ_ATTEMPTS = 3;

function isTransientReadError(error: unknown) {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    ["P1017", "P2024"].includes(error.code)
  ) {
    return true;
  }

  if (typeof error !== "object" || error === null) {
    return false;
  }

  const adapterError = error as {
    name?: unknown;
    cause?: { kind?: unknown };
  };

  return (
    adapterError.name === "DriverAdapterError" &&
    adapterError.cause?.kind === "ConnectionClosed"
  );
}

export async function retryTransientDatabaseRead<T>(
  operation: () => Promise<T>,
) {
  for (let attempt = 1; attempt <= MAX_READ_ATTEMPTS; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      if (!isTransientReadError(error) || attempt === MAX_READ_ATTEMPTS) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, attempt * 100));
    }
  }

  throw new Error("Database read retry limit exceeded.");
}

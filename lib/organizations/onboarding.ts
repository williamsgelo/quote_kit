import "server-only";

import { MembershipRole, Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const MAX_TRANSACTION_ATTEMPTS = 3;
const TRANSACTION_MAX_WAIT_MS = 10_000;
const TRANSACTION_TIMEOUT_MS = 10_000;

export type CreateFirstOrganizationResult =
  | { status: "created"; organizationId: string }
  | { status: "already-onboarded" };

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

export async function createFirstOrganizationForUser(
  userId: string,
  organizationName: string,
): Promise<CreateFirstOrganizationResult> {
  for (let attempt = 1; attempt <= MAX_TRANSACTION_ATTEMPTS; attempt += 1) {
    try {
      return await prisma.$transaction(
        async (transaction) => {
          const existingMembership = await transaction.membership.findFirst({
            where: {
              userId,
              organization: {
                isActive: true,
              },
            },
            orderBy: [{ createdAt: "asc" }, { id: "asc" }],
            select: { id: true },
          });

          if (existingMembership) {
            return { status: "already-onboarded" } as const;
          }

          const organization = await transaction.organization.create({
            data: {
              name: organizationName,
              memberships: {
                create: {
                  userId,
                  role: MembershipRole.OWNER,
                },
              },
            },
            select: { id: true },
          });

          return {
            status: "created",
            organizationId: organization.id,
          } as const;
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
          maxWait: TRANSACTION_MAX_WAIT_MS,
          timeout: TRANSACTION_TIMEOUT_MS,
        },
      );
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

  throw new Error("Onboarding transaction retry limit exceeded.");
}

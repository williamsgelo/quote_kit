import "server-only";

import { MembershipRole } from "@/generated/prisma/client";
import { runSerializableTransaction } from "@/lib/prisma-transaction";

export type CreateFirstOrganizationResult =
  | { status: "created"; organizationId: string }
  | { status: "already-onboarded" };

export async function createFirstOrganizationForUser(
  userId: string,
  organizationName: string,
): Promise<CreateFirstOrganizationResult> {
  return runSerializableTransaction(async (transaction) => {
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
  });
}

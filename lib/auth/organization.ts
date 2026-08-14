import "server-only";

import { prisma } from "@/lib/prisma";
import { retryTransientDatabaseRead } from "@/lib/prisma-retry";

export function getActiveOrganizationMembership(userId: string) {
  return retryTransientDatabaseRead(() =>
    prisma.membership.findFirst({
      where: {
        userId,
        organization: {
          isActive: true,
        },
      },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      select: {
        id: true,
        role: true,
        createdAt: true,
        organization: {
          select: {
            id: true,
            name: true,
            isActive: true,
          },
        },
      },
    }),
  );
}

export function getOrganizationMembership(
  userId: string,
  organizationId: string,
) {
  return retryTransientDatabaseRead(() =>
    prisma.membership.findUnique({
      where: {
        userId_organizationId: {
          userId,
          organizationId,
        },
        organization: {
          isActive: true,
        },
      },
      select: {
        id: true,
        role: true,
        organization: {
          select: {
            id: true,
            name: true,
            isActive: true,
          },
        },
      },
    }),
  );
}

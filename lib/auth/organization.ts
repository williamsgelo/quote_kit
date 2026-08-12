import "server-only";

import { prisma } from "@/lib/prisma";

export function getActiveOrganizationMembership(userId: string) {
  return prisma.membership.findFirst({
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
  });
}

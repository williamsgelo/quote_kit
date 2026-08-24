import "server-only";

import { prisma } from "@/lib/prisma";
import { retryTransientDatabaseRead } from "@/lib/prisma-retry";

const catalogItemDetailSelect = {
  id: true,
  name: true,
  description: true,
  sku: true,
  unit: true,
  unitPrice: true,
  taxRate: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const;

export function listCatalogItemsForOrganization(
  organizationId: string,
  search: string,
) {
  const normalizedSearch = search.trim().slice(0, 100);

  return retryTransientDatabaseRead(() =>
    prisma.catalogItem.findMany({
      where: {
        organizationId,
        isActive: true,
        ...(normalizedSearch
          ? {
              OR: [
                {
                  name: {
                    contains: normalizedSearch,
                    mode: "insensitive" as const,
                  },
                },
                {
                  description: {
                    contains: normalizedSearch,
                    mode: "insensitive" as const,
                  },
                },
                {
                  sku: {
                    contains: normalizedSearch,
                    mode: "insensitive" as const,
                  },
                },
              ],
            }
          : {}),
      },
      orderBy: [{ name: "asc" }, { id: "asc" }],
      take: 100,
      select: catalogItemDetailSelect,
    }),
  );
}

export function getCatalogItemForOrganization(
  organizationId: string,
  catalogItemId: string,
) {
  return retryTransientDatabaseRead(() =>
    prisma.catalogItem.findFirst({
      where: {
        id: catalogItemId,
        organizationId,
      },
      select: catalogItemDetailSelect,
    }),
  );
}

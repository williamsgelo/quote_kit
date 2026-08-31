import "server-only";

import { prisma } from "@/lib/prisma";
import { retryTransientDatabaseRead } from "@/lib/prisma-retry";

const customerDetailSelect = {
  id: true,
  name: true,
  companyName: true,
  email: true,
  phone: true,
  taxNumber: true,
  addressLine1: true,
  addressLine2: true,
  city: true,
  province: true,
  postalCode: true,
  country: true,
  notes: true,
  isArchived: true,
  createdAt: true,
  updatedAt: true,
} as const;

export function listCustomersForOrganization(
  organizationId: string,
  search: string,
) {
  const normalizedSearch = search.trim().slice(0, 100);

  return retryTransientDatabaseRead(() =>
    prisma.customer.findMany({
      where: {
        organizationId,
        isArchived: false,
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
                  companyName: {
                    contains: normalizedSearch,
                    mode: "insensitive" as const,
                  },
                },
                {
                  email: {
                    contains: normalizedSearch,
                    mode: "insensitive" as const,
                  },
                },
                {
                  phone: {
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
      select: {
        id: true,
        name: true,
        companyName: true,
        email: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { quotes: true } },
      },
    }),
  );
}

export function getCustomerForOrganization(
  organizationId: string,
  customerId: string,
) {
  return retryTransientDatabaseRead(() =>
    prisma.customer.findFirst({
      where: {
        id: customerId,
        organizationId,
      },
      select: {
        ...customerDetailSelect,
        quotes: {
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          take: 5,
          select: {
            id: true,
            quoteNumber: true,
            status: true,
            issueDate: true,
            expiryDate: true,
            total: true,
          },
        },
      },
    }),
  );
}

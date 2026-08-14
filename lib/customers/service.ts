import "server-only";

import { prisma } from "@/lib/prisma";
import type { CustomerInput } from "@/lib/validation/customer";

const customerMutationSelect = {
  id: true,
  organizationId: true,
  name: true,
  isArchived: true,
} as const;

export function createCustomerForOrganization(
  organizationId: string,
  input: CustomerInput,
) {
  return prisma.customer.create({
    data: {
      organizationId,
      ...input,
    },
    select: customerMutationSelect,
  });
}

export async function updateCustomerForOrganization(
  organizationId: string,
  customerId: string,
  input: CustomerInput,
) {
  const result = await prisma.customer.updateMany({
    where: {
      id: customerId,
      organizationId,
      isArchived: false,
    },
    data: input,
  });

  if (result.count !== 1) {
    return null;
  }

  return prisma.customer.findFirst({
    where: { id: customerId, organizationId },
    select: customerMutationSelect,
  });
}

export async function archiveCustomerForOrganization(
  organizationId: string,
  customerId: string,
) {
  const result = await prisma.customer.updateMany({
    where: {
      id: customerId,
      organizationId,
      isArchived: false,
    },
    data: { isArchived: true },
  });

  return result.count === 1;
}

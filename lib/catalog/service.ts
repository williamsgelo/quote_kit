import "server-only";

import { toDatabaseDecimal } from "@/lib/money/server";
import { prisma } from "@/lib/prisma";
import type { CatalogItemInput } from "@/lib/validation/catalog-item";

const catalogItemMutationSelect = {
  id: true,
  organizationId: true,
  name: true,
  unitPrice: true,
  taxRate: true,
  isActive: true,
} as const;

function catalogItemData(input: CatalogItemInput) {
  return {
    name: input.name,
    description: input.description,
    sku: input.sku,
    unit: input.unit,
    unitPrice: toDatabaseDecimal(input.unitPrice),
    taxRate: toDatabaseDecimal(input.taxRate),
  };
}

export function createCatalogItemForOrganization(
  organizationId: string,
  input: CatalogItemInput,
) {
  return prisma.catalogItem.create({
    data: {
      organizationId,
      ...catalogItemData(input),
    },
    select: catalogItemMutationSelect,
  });
}

export async function updateCatalogItemForOrganization(
  organizationId: string,
  catalogItemId: string,
  input: CatalogItemInput,
) {
  const result = await prisma.catalogItem.updateMany({
    where: {
      id: catalogItemId,
      organizationId,
      isActive: true,
    },
    data: catalogItemData(input),
  });

  if (result.count !== 1) {
    return null;
  }

  return prisma.catalogItem.findFirst({
    where: { id: catalogItemId, organizationId },
    select: catalogItemMutationSelect,
  });
}

export async function archiveCatalogItemForOrganization(
  organizationId: string,
  catalogItemId: string,
) {
  const result = await prisma.catalogItem.updateMany({
    where: {
      id: catalogItemId,
      organizationId,
      isActive: true,
    },
    data: { isActive: false },
  });

  return result.count === 1;
}

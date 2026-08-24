import "server-only";

import { prisma } from "@/lib/prisma";
import { catalogUnits } from "@/lib/validation/catalog-item";
import type { QuoteInput } from "@/lib/validation/quote";

export class QuoteReferenceError extends Error {
  constructor(message = "A quote reference is unavailable.") {
    super(message);
    this.name = "QuoteReferenceError";
  }
}

const customerSnapshotSelect = {
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
} as const;

const catalogSnapshotSelect = {
  id: true,
  name: true,
  description: true,
  unit: true,
  unitPrice: true,
  taxRate: true,
} as const;

function isCatalogUnit(value: string): value is (typeof catalogUnits)[number] {
  return catalogUnits.some((unit) => unit === value);
}

function getValidatedCatalogUnit(value: string) {
  if (!isCatalogUnit(value)) {
    throw new QuoteReferenceError();
  }
  return value;
}

/**
 * Resolves customer and optional CatalogItem references using the trusted
 * active organisation. Catalog-backed line values are copied from PostgreSQL;
 * custom lines retain their validated submitted values. Returned snapshots are
 * plain strings and remain independent of later Customer or CatalogItem edits.
 */
export async function getQuoteSnapshotsForOrganization(
  organizationId: string,
  input: QuoteInput,
) {
  const catalogItemIds = [
    ...new Set(
      input.items
        .map((item) => item.catalogItemId)
        .filter((id): id is string => Boolean(id)),
    ),
  ];
  const [customer, catalogItems] = await Promise.all([
    prisma.customer.findFirst({
      where: {
        id: input.customerId,
        organizationId,
        isArchived: false,
      },
      select: customerSnapshotSelect,
    }),
    catalogItemIds.length
      ? prisma.catalogItem.findMany({
          where: {
            id: { in: catalogItemIds },
            organizationId,
            isActive: true,
          },
          select: catalogSnapshotSelect,
        })
      : Promise.resolve([]),
  ]);

  if (!customer || catalogItems.length !== catalogItemIds.length) {
    throw new QuoteReferenceError();
  }

  const catalogById = new Map(catalogItems.map((item) => [item.id, item]));
  const items = input.items.map((item, index) => {
    const catalogItem = item.catalogItemId
      ? catalogById.get(item.catalogItemId)
      : null;
    const catalogUnit = catalogItem?.unit;

    if (item.catalogItemId && !catalogItem) {
      throw new QuoteReferenceError();
    }

    const unit = catalogUnit
      ? getValidatedCatalogUnit(catalogUnit)
      : item.unit;

    return {
      catalogItemId: catalogItem?.id ?? null,
      name: catalogItem?.name ?? item.name,
      description: catalogItem?.description ?? item.description,
      unit,
      quantity: item.quantity,
      unitPrice: catalogItem?.unitPrice.toFixed(2) ?? item.unitPrice,
      taxRate: catalogItem?.taxRate.toFixed(2) ?? item.taxRate,
      position: index + 1,
    };
  });

  return {
    customer: {
      customerId: customer.id,
      customerName: customer.name,
      customerCompanyName: customer.companyName,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      customerTaxNumber: customer.taxNumber,
      customerAddressLine1: customer.addressLine1,
      customerAddressLine2: customer.addressLine2,
      customerCity: customer.city,
      customerProvince: customer.province,
      customerPostalCode: customer.postalCode,
      customerCountry: customer.country,
    },
    items,
  };
}

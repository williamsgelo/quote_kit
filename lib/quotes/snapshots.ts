import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
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
} as const;

type SnapshotDatabase = Pick<
  Prisma.TransactionClient,
  "customer" | "catalogItem"
>;

type QuoteSnapshotOptions = {
  database?: SnapshotDatabase;
  allowArchivedCustomerId?: string;
  allowInactiveCatalogItemIds?: readonly string[];
};

/**
 * Resolves customer and optional CatalogItem references using the trusted
 * active organisation. Catalog-backed lines retain their validated,
 * quote-specific editable values after the Catalog reference is verified.
 * Returned snapshots are plain strings and remain independent of later
 * Customer or CatalogItem edits.
 */
export async function getQuoteSnapshotsForOrganization(
  organizationId: string,
  input: QuoteInput,
  options: QuoteSnapshotOptions = {},
) {
  const database = options.database ?? prisma;
  const allowedInactiveCatalogIds = [
    ...new Set(options.allowInactiveCatalogItemIds ?? []),
  ];
  const catalogItemIds = [
    ...new Set(
      input.items
        .map((item) => item.catalogItemId)
        .filter((id): id is string => Boolean(id)),
    ),
  ];
  const [customer, catalogItems] = await Promise.all([
    database.customer.findFirst({
      where: {
        id: input.customerId,
        organizationId,
        ...(input.customerId === options.allowArchivedCustomerId
          ? {}
          : { isArchived: false }),
      },
      select: customerSnapshotSelect,
    }),
    catalogItemIds.length
      ? database.catalogItem.findMany({
          where: {
            id: { in: catalogItemIds },
            organizationId,
            ...(allowedInactiveCatalogIds.length
              ? {
                  OR: [
                    { isActive: true },
                    { id: { in: allowedInactiveCatalogIds } },
                  ],
                }
              : { isActive: true }),
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

    if (item.catalogItemId && !catalogItem) {
      throw new QuoteReferenceError();
    }

    return {
      catalogItemId: catalogItem?.id ?? null,
      name: item.name,
      description: item.description,
      unit: item.unit,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      taxRate: item.taxRate,
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

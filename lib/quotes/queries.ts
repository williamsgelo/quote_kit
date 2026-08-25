import "server-only";

import { QuoteStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { retryTransientDatabaseRead } from "@/lib/prisma-retry";

function parsedQuoteNumber(search: string) {
  const match = search.match(/^(?:qk?-?)?0*(\d+)$/i);
  if (!match) {
    return null;
  }

  const value = Number(match[1]);
  return Number.isSafeInteger(value) && value <= 2_147_483_647 ? value : null;
}

export function listQuotesForOrganization(
  organizationId: string,
  {
    search,
    status,
  }: {
    search: string;
    status?: QuoteStatus;
  },
) {
  const normalizedSearch = search.trim().slice(0, 100);
  const quoteNumber = parsedQuoteNumber(normalizedSearch);

  return retryTransientDatabaseRead(() =>
    prisma.quote.findMany({
      where: {
        organizationId,
        ...(status ? { status } : {}),
        ...(normalizedSearch
          ? {
              OR: [
                ...(quoteNumber === null ? [] : [{ quoteNumber }]),
                {
                  customerName: {
                    contains: normalizedSearch,
                    mode: "insensitive" as const,
                  },
                },
                {
                  customerCompanyName: {
                    contains: normalizedSearch,
                    mode: "insensitive" as const,
                  },
                },
              ],
            }
          : {}),
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: 100,
      select: {
        id: true,
        quoteNumber: true,
        customerName: true,
        customerCompanyName: true,
        status: true,
        issueDate: true,
        expiryDate: true,
        currency: true,
        total: true,
      },
    }),
  );
}

export function getQuoteForOrganization(
  organizationId: string,
  quoteId: string,
) {
  return retryTransientDatabaseRead(() =>
    prisma.quote.findFirst({
      where: { id: quoteId, organizationId },
      select: {
        id: true,
        customerId: true,
        quoteNumber: true,
        status: true,
        issueDate: true,
        expiryDate: true,
        currency: true,
        discountType: true,
        discountValue: true,
        subtotal: true,
        discountAmount: true,
        taxTotal: true,
        total: true,
        customerName: true,
        customerCompanyName: true,
        customerEmail: true,
        customerPhone: true,
        customerTaxNumber: true,
        customerAddressLine1: true,
        customerAddressLine2: true,
        customerCity: true,
        customerProvince: true,
        customerPostalCode: true,
        customerCountry: true,
        customerMessage: true,
        notes: true,
        terms: true,
        createdAt: true,
        updatedAt: true,
        items: {
          orderBy: [{ position: "asc" }, { id: "asc" }],
          select: {
            id: true,
            catalogItemId: true,
            name: true,
            description: true,
            unit: true,
            quantity: true,
            unitPrice: true,
            taxRate: true,
            position: true,
            lineSubtotal: true,
            discountAmount: true,
            taxAmount: true,
            total: true,
          },
        },
      },
    }),
  );
}

export function getQuoteBuilderOptionsForOrganization(
  organizationId: string,
  currentCustomerId?: string,
) {
  return retryTransientDatabaseRead(async () => {
    const [customers, catalogItems] = await Promise.all([
      prisma.customer.findMany({
        where: {
          organizationId,
          ...(currentCustomerId
            ? { OR: [{ isArchived: false }, { id: currentCustomerId }] }
            : { isArchived: false }),
        },
        orderBy: [{ name: "asc" }, { id: "asc" }],
        take: 500,
        select: {
          id: true,
          name: true,
          companyName: true,
          isArchived: true,
        },
      }),
      prisma.catalogItem.findMany({
        where: { organizationId, isActive: true },
        orderBy: [{ name: "asc" }, { id: "asc" }],
        take: 500,
        select: {
          id: true,
          name: true,
          description: true,
          sku: true,
          unit: true,
          unitPrice: true,
          taxRate: true,
        },
      }),
    ]);

    return {
      customers,
      catalogItems: catalogItems.map((item) => ({
        ...item,
        unitPrice: item.unitPrice.toFixed(2),
        taxRate: item.taxRate.toFixed(2),
      })),
    };
  });
}

export async function getDraftQuoteForEditing(
  organizationId: string,
  quoteId: string,
) {
  const quote = await getQuoteForOrganization(organizationId, quoteId);

  if (!quote || quote.status !== QuoteStatus.DRAFT) {
    return null;
  }

  return {
    id: quote.id,
    quoteNumber: quote.quoteNumber,
    customerId: quote.customerId,
    issueDate: quote.issueDate.toISOString().slice(0, 10),
    expiryDate: quote.expiryDate.toISOString().slice(0, 10),
    currency: quote.currency,
    discountType: quote.discountType,
    discountValue: quote.discountValue.toFixed(2),
    customerMessage: quote.customerMessage ?? "",
    notes: quote.notes ?? "",
    terms: quote.terms ?? "",
    items: quote.items.map((item) => ({
      id: item.id,
      catalogItemId: item.catalogItemId,
      name: item.name,
      description: item.description,
      unit: item.unit,
      quantity: item.quantity.toFixed(4),
      unitPrice: item.unitPrice.toFixed(2),
      taxRate: item.taxRate.toFixed(2),
    })),
  };
}

export function getQuoteDashboardForOrganization(organizationId: string) {
  return retryTransientDatabaseRead(async () => {
    const [totalQuotes, draftQuotes, acceptedQuotes, value, recentQuotes] =
      await Promise.all([
        prisma.quote.count({ where: { organizationId } }),
        prisma.quote.count({
          where: { organizationId, status: QuoteStatus.DRAFT },
        }),
        prisma.quote.count({
          where: { organizationId, status: QuoteStatus.ACCEPTED },
        }),
        prisma.quote.aggregate({
          where: { organizationId },
          _sum: { total: true },
        }),
        prisma.quote.findMany({
          where: { organizationId },
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          take: 4,
          select: {
            id: true,
            quoteNumber: true,
            customerName: true,
            customerCompanyName: true,
            status: true,
            total: true,
          },
        }),
      ]);

    return {
      totalQuotes,
      draftQuotes,
      acceptedQuotes,
      totalValue: value._sum.total?.toFixed(2) ?? "0.00",
      recentQuotes,
    };
  });
}

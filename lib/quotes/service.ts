import "server-only";

import {
  QuoteActivityType,
  QuoteStatus,
  type Prisma,
} from "@/generated/prisma/client";
import { toDatabaseDecimal } from "@/lib/money/server";
import { runSerializableTransaction } from "@/lib/prisma-transaction";
import { allocateNextQuoteNumber } from "@/lib/quotes/numbering";
import { calculateQuotePricing } from "@/lib/quotes/pricing";
import { getQuoteSnapshotsForOrganization } from "@/lib/quotes/snapshots";
import { quoteSchema } from "@/lib/validation/quote";

type PrepareQuoteDraftOptions = {
  database?: Pick<Prisma.TransactionClient, "customer" | "catalogItem">;
  allowArchivedCustomerId?: string;
  allowInactiveCatalogItemIds?: readonly string[];
};

export class QuoteNotFoundError extends Error {
  constructor() {
    super("The quote is unavailable.");
    this.name = "QuoteNotFoundError";
  }
}

export class QuoteNotEditableError extends Error {
  constructor() {
    super("Only draft quotes may be edited.");
    this.name = "QuoteNotEditableError";
  }
}

export function assertQuoteEditable(quote: { status: QuoteStatus }) {
  if (quote.status !== QuoteStatus.DRAFT) {
    throw new QuoteNotEditableError();
  }
}

/**
 * Validates untrusted draft input, verifies every related record against the
 * trusted organisation, snapshots commercial values, and calculates canonical
 * totals. No browser-supplied totals, status, number, or organisation ID are
 * accepted.
 */
export async function prepareQuoteDraftForOrganization(
  organizationId: string,
  untrustedInput: unknown,
  options: PrepareQuoteDraftOptions = {},
) {
  const input = quoteSchema.parse(untrustedInput);
  const snapshots = await getQuoteSnapshotsForOrganization(
    organizationId,
    input,
    options,
  );
  const pricing = calculateQuotePricing({
    discountType: input.discountType,
    discountValue: input.discountValue,
    items: snapshots.items,
  });

  return {
    quote: {
      ...snapshots.customer,
      status: QuoteStatus.DRAFT,
      issueDate: input.issueDate,
      expiryDate: input.expiryDate,
      currency: input.currency,
      discountType: input.discountType,
      discountValue: input.discountValue,
      subtotal: pricing.subtotal,
      discountAmount: pricing.discountAmount,
      taxTotal: pricing.taxTotal,
      total: pricing.total,
      customerMessage: input.customerMessage,
      notes: input.notes,
      terms: input.terms,
    },
    items: snapshots.items.map((item, index) => ({
      ...item,
      lineSubtotal: pricing.lines[index].lineSubtotal,
      discountAmount: pricing.lines[index].discountAmount,
      taxAmount: pricing.lines[index].taxAmount,
      total: pricing.lines[index].total,
    })),
  };
}

type PreparedDraft = Awaited<
  ReturnType<typeof prepareQuoteDraftForOrganization>
>;

function quoteData(prepared: PreparedDraft) {
  return {
    customerId: prepared.quote.customerId,
    status: QuoteStatus.DRAFT,
    issueDate: new Date(`${prepared.quote.issueDate}T00:00:00.000Z`),
    expiryDate: new Date(`${prepared.quote.expiryDate}T00:00:00.000Z`),
    currency: prepared.quote.currency,
    discountType: prepared.quote.discountType,
    discountValue: toDatabaseDecimal(prepared.quote.discountValue),
    subtotal: toDatabaseDecimal(prepared.quote.subtotal),
    discountAmount: toDatabaseDecimal(prepared.quote.discountAmount),
    taxTotal: toDatabaseDecimal(prepared.quote.taxTotal),
    total: toDatabaseDecimal(prepared.quote.total),
    customerName: prepared.quote.customerName,
    customerCompanyName: prepared.quote.customerCompanyName,
    customerEmail: prepared.quote.customerEmail,
    customerPhone: prepared.quote.customerPhone,
    customerTaxNumber: prepared.quote.customerTaxNumber,
    customerAddressLine1: prepared.quote.customerAddressLine1,
    customerAddressLine2: prepared.quote.customerAddressLine2,
    customerCity: prepared.quote.customerCity,
    customerProvince: prepared.quote.customerProvince,
    customerPostalCode: prepared.quote.customerPostalCode,
    customerCountry: prepared.quote.customerCountry,
    customerMessage: prepared.quote.customerMessage,
    notes: prepared.quote.notes,
    terms: prepared.quote.terms,
  };
}

function quoteItemsData(prepared: PreparedDraft) {
  return prepared.items.map((item) => ({
    catalogItemId: item.catalogItemId,
    name: item.name,
    description: item.description,
    unit: item.unit,
    quantity: toDatabaseDecimal(item.quantity),
    unitPrice: toDatabaseDecimal(item.unitPrice),
    taxRate: toDatabaseDecimal(item.taxRate),
    position: item.position,
    lineSubtotal: toDatabaseDecimal(item.lineSubtotal),
    discountAmount: toDatabaseDecimal(item.discountAmount),
    taxAmount: toDatabaseDecimal(item.taxAmount),
    total: toDatabaseDecimal(item.total),
  }));
}

export function createDraftQuoteForOrganization(
  organizationId: string,
  untrustedInput: unknown,
) {
  return runSerializableTransaction(async (transaction) => {
    const prepared = await prepareQuoteDraftForOrganization(
      organizationId,
      untrustedInput,
      { database: transaction },
    );
    const quoteNumber = await allocateNextQuoteNumber(
      transaction,
      organizationId,
    );

    return transaction.quote.create({
      data: {
        organizationId,
        quoteNumber,
        ...quoteData(prepared),
        items: { create: quoteItemsData(prepared) },
        activities: { create: { type: QuoteActivityType.CREATED } },
      },
      select: { id: true, quoteNumber: true },
    });
  });
}

export function updateDraftQuoteForOrganization(
  organizationId: string,
  quoteId: string,
  untrustedInput: unknown,
) {
  return runSerializableTransaction(async (transaction) => {
    const existingQuote = await transaction.quote.findFirst({
      where: { id: quoteId, organizationId },
      select: {
        id: true,
        status: true,
        customerId: true,
        items: { select: { catalogItemId: true } },
      },
    });

    if (!existingQuote) {
      throw new QuoteNotFoundError();
    }
    assertQuoteEditable(existingQuote);

    const prepared = await prepareQuoteDraftForOrganization(
      organizationId,
      untrustedInput,
      {
        database: transaction,
        allowArchivedCustomerId: existingQuote.customerId,
        allowInactiveCatalogItemIds: existingQuote.items
          .map((item) => item.catalogItemId)
          .filter((id): id is string => Boolean(id)),
      },
    );

    return transaction.quote.update({
      where: { id: quoteId, organizationId },
      data: {
        ...quoteData(prepared),
        items: {
          deleteMany: {},
          create: quoteItemsData(prepared),
        },
        activities: { create: { type: QuoteActivityType.UPDATED } },
      },
      select: { id: true, quoteNumber: true },
    });
  });
}

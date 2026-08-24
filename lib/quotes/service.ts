import "server-only";

import { calculateQuotePricing } from "@/lib/quotes/pricing";
import { getQuoteSnapshotsForOrganization } from "@/lib/quotes/snapshots";
import { quoteSchema } from "@/lib/validation/quote";

/**
 * Validates and prepares trusted draft data without inserting a Quote. Sprint
 * 8B can pass this output into one transaction with quote-number allocation and
 * Quote/QuoteItem creation, keeping validation, tenancy, snapshots, and pricing
 * out of the Server Action.
 */
export async function prepareQuoteDraftForOrganization(
  organizationId: string,
  untrustedInput: unknown,
) {
  const input = quoteSchema.parse(untrustedInput);
  const snapshots = await getQuoteSnapshotsForOrganization(
    organizationId,
    input,
  );
  const pricing = calculateQuotePricing({
    discountType: input.discountType,
    discountValue: input.discountValue,
    items: snapshots.items,
  });

  return {
    quote: {
      ...snapshots.customer,
      status: "DRAFT" as const,
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

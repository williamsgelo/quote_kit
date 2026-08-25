import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { QuoteBuilder } from "@/components/quotes/quote-builder";
import { PageHeader } from "@/components/shared/page-header";
import { requireOrganization } from "@/lib/auth/access";
import { formatQuoteNumber } from "@/lib/quotes/numbering";
import {
  getDraftQuoteForEditing,
  getQuoteBuilderOptionsForOrganization,
} from "@/lib/quotes/queries";

export default async function EditQuotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { organization } = await requireOrganization();
  const quote = await getDraftQuoteForEditing(organization.id, id);

  if (!quote) {
    notFound();
  }

  const options = await getQuoteBuilderOptionsForOrganization(
    organization.id,
    quote.customerId,
  );

  return (
    <div className="space-y-6">
      <Link
        href={`/quotes/${quote.id}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to quote
      </Link>
      <PageHeader
        title={`Edit ${formatQuoteNumber(quote.quoteNumber)}`}
        description="Update this draft. Its quote number will remain unchanged."
      />
      <QuoteBuilder
        mode="edit"
        customers={options.customers}
        catalogItems={options.catalogItems}
        initialData={{
          id: quote.id,
          customerId: quote.customerId,
          issueDate: quote.issueDate,
          expiryDate: quote.expiryDate,
          currency: quote.currency,
          discountType: quote.discountType,
          discountValue: quote.discountValue,
          customerMessage: quote.customerMessage,
          notes: quote.notes,
          terms: quote.terms,
          items: quote.items,
        }}
      />
    </div>
  );
}

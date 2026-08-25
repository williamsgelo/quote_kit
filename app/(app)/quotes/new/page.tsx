import Link from "next/link";
import { ArrowLeft, UserRoundPlus } from "lucide-react";

import { QuoteBuilder } from "@/components/quotes/quote-builder";
import { PageHeader } from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import { requireOrganization } from "@/lib/auth/access";
import { getQuoteBuilderOptionsForOrganization } from "@/lib/quotes/queries";

function dateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default async function NewQuotePage() {
  const { organization } = await requireOrganization();
  const options = await getQuoteBuilderOptionsForOrganization(organization.id);
  const issueDate = new Date();
  const expiryDate = new Date(issueDate);
  expiryDate.setUTCDate(expiryDate.getUTCDate() + 14);

  return (
    <div className="space-y-6">
      <Link
        href="/quotes"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to quotes
      </Link>
      <PageHeader
        title="Create draft quote"
        description="Build a customer quote with reusable Catalog services or custom line items."
      />

      {options.customers.length === 0 && (
        <div className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-950 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold">Add an active customer first</p>
            <p className="mt-1 text-xs text-amber-800">
              A draft quote must belong to a customer in this organisation.
            </p>
          </div>
          <Link
            href="/customers/new"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            <UserRoundPlus className="size-4" aria-hidden="true" />
            Add customer
          </Link>
        </div>
      )}

      <QuoteBuilder
        mode="create"
        customers={options.customers}
        catalogItems={options.catalogItems}
        initialData={{
          customerId: "",
          issueDate: dateInputValue(issueDate),
          expiryDate: dateInputValue(expiryDate),
          currency: "ZAR",
          discountType: "NONE",
          discountValue: "0.00",
          customerMessage: "",
          notes: "",
          terms: "",
          items: [],
        }}
      />
    </div>
  );
}

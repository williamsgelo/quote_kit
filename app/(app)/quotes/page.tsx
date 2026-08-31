import Link from "next/link";
import { FilePlus2, MoreHorizontal, Plus } from "lucide-react";

import { QuoteStatus } from "@/generated/prisma/client";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { SearchInput } from "@/components/shared/search-input";
import { StatusBadge } from "@/components/shared/status-badge";
import { TableShell, tableStyles } from "@/components/shared/table-shell";
import { buttonVariants } from "@/components/ui/button";
import { requireOrganization } from "@/lib/auth/access";
import { formatCurrency } from "@/lib/money";
import { formatQuoteNumber } from "@/lib/quotes/numbering";
import { listQuotesForOrganization } from "@/lib/quotes/queries";
import { isQuoteExpired } from "@/lib/quotes/transitions";
import { cn } from "@/lib/utils";

const selectStyles =
  "h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20";
const statusFilters = [
  QuoteStatus.DRAFT,
  QuoteStatus.SENT,
  QuoteStatus.VIEWED,
  QuoteStatus.ACCEPTED,
  QuoteStatus.DECLINED,
] as const;

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function selectedStatus(value: unknown) {
  return typeof value === "string" && statusFilters.includes(value as never)
    ? (value as QuoteStatus)
    : undefined;
}

function displayStatus(status: QuoteStatus, expiryDate: Date) {
  return (status === QuoteStatus.SENT || status === QuoteStatus.VIEWED) &&
    isQuoteExpired(expiryDate)
    ? QuoteStatus.EXPIRED
    : status;
}

export default async function QuotesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { organization } = await requireOrganization();
  const params = await searchParams;
  const search = typeof params.q === "string" ? params.q.trim().slice(0, 100) : "";
  const status = selectedStatus(params.status);
  const quotes = await listQuotesForOrganization(organization.id, {
    search,
    status,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quotes"
        description="Create, send, and track customer quotes from draft to response."
        actions={
          <Link
            href="/quotes/new"
            className={cn(buttonVariants({ size: "lg" }), "h-9 px-3")}
          >
            <Plus className="size-4" aria-hidden="true" />
            Create quote
          </Link>
        }
      />

      <form
        action="/quotes"
        method="get"
        className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
      >
        <SearchInput
          name="q"
          defaultValue={search}
          placeholder="Search by quote or customer..."
          label="Search quotes"
          className="sm:max-w-sm"
        />
        <div className="flex flex-wrap items-center gap-2">
          <select
            name="status"
            defaultValue={status ?? ""}
            className={selectStyles}
            aria-label="Quote status"
          >
            <option value="">All statuses</option>
            {statusFilters.map((value) => (
              <option key={value} value={value}>
                {value.charAt(0) + value.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
          <button type="submit" className={buttonVariants({ variant: "outline" })}>
            Apply filters
          </button>
        </div>
      </form>

      {quotes.length ? (
        <TableShell>
          <table className={tableStyles.table}>
            <caption className="sr-only">Quote list</caption>
            <thead className={tableStyles.header}>
              <tr>
                <th className={tableStyles.heading}>Quote</th>
                <th className={tableStyles.heading}>Customer</th>
                <th className={tableStyles.heading}>Status</th>
                <th className={tableStyles.heading}>Issue date</th>
                <th className={tableStyles.heading}>Expires</th>
                <th className={`${tableStyles.heading} text-right`}>Total</th>
                <th className={`${tableStyles.heading} w-12`}>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((quote) => (
                <tr key={quote.id} className={tableStyles.row}>
                  <td className={tableStyles.cell}>
                    <Link
                      href={`/quotes/${quote.id}`}
                      className="font-medium hover:text-primary hover:underline"
                    >
                      {formatQuoteNumber(quote.quoteNumber)}
                    </Link>
                  </td>
                  <td className={tableStyles.cell}>
                    <p className="font-medium">{quote.customerName}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {quote.customerCompanyName || "Individual customer"}
                    </p>
                  </td>
                  <td className={tableStyles.cell}>
                    <StatusBadge
                      status={displayStatus(quote.status, quote.expiryDate)}
                    />
                  </td>
                  <td className={`${tableStyles.cell} text-muted-foreground`}>
                    {formatDate(quote.issueDate)}
                  </td>
                  <td className={`${tableStyles.cell} text-muted-foreground`}>
                    {formatDate(quote.expiryDate)}
                  </td>
                  <td className={`${tableStyles.cell} text-right font-medium`}>
                    {formatCurrency(quote.total.toString(), {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className={tableStyles.cell}>
                    <Link
                      href={`/quotes/${quote.id}`}
                      className={buttonVariants({ variant: "ghost", size: "icon" })}
                      aria-label={`View ${formatQuoteNumber(quote.quoteNumber)}`}
                    >
                      <MoreHorizontal aria-hidden="true" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>
      ) : (
        <EmptyState
          icon={FilePlus2}
          title={search || status ? "No quotes found" : "No quotes yet"}
          description={
            search || status
              ? "No organisation quotes match the current search and status filters."
              : "Create your first draft quote for an active customer."
          }
          action={search || status ? "Clear filters" : "Create quote"}
          actionHref={search || status ? "/quotes" : "/quotes/new"}
        />
      )}
    </div>
  );
}

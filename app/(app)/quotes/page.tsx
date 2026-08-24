import Link from "next/link";
import { Filter, MoreHorizontal, Plus, SlidersHorizontal } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { SearchInput } from "@/components/shared/search-input";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  TableShell,
  tableStyles,
} from "@/components/shared/table-shell";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/money";
import { quotes } from "@/lib/mock-data";

export default function QuotesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Quotes"
        description="Create, send, and track every customer quote from one place."
        actions={
          <Button type="button" size="lg" className="h-9 px-3">
            <Plus className="size-4" aria-hidden="true" />
            Create quote
          </Button>
        }
      />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <SearchInput
          placeholder="Search by quote or customer..."
          label="Search quotes"
          className="sm:max-w-sm"
        />
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" size="lg" className="h-9">
            <Filter className="size-4" aria-hidden="true" />
            All statuses
          </Button>
          <Button type="button" variant="outline" size="lg" className="h-9">
            <SlidersHorizontal className="size-4" aria-hidden="true" />
            Filters
          </Button>
        </div>
      </div>

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
                    {quote.number}
                  </Link>
                </td>
                <td className={tableStyles.cell}>
                  <p className="font-medium">{quote.customer}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {quote.company}
                  </p>
                </td>
                <td className={tableStyles.cell}>
                  <StatusBadge status={quote.status} />
                </td>
                <td className={`${tableStyles.cell} text-muted-foreground`}>
                  {quote.issueDate}
                </td>
                <td className={`${tableStyles.cell} text-muted-foreground`}>
                  {quote.expiryDate}
                </td>
                <td className={`${tableStyles.cell} text-right font-medium`}>
                  {formatCurrency(quote.total)}
                </td>
                <td className={tableStyles.cell}>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Actions for ${quote.number}`}
                  >
                    <MoreHorizontal aria-hidden="true" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableShell>
    </div>
  );
}

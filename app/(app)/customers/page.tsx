import { Filter, MoreHorizontal, Plus, UserRoundPlus } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { SearchInput } from "@/components/shared/search-input";
import {
  TableShell,
  tableStyles,
} from "@/components/shared/table-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { customers } from "@/lib/mock-data";

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Keep customer details and quote history in one place."
        actions={
          <Button type="button" size="lg" className="h-9 px-3">
            <Plus className="size-4" aria-hidden="true" />
            Add customer
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          placeholder="Search customers..."
          label="Search customers"
        />
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="lg" className="h-9">
            <Filter className="size-4" aria-hidden="true" />
            Filter
          </Button>
          <Badge variant="secondary" className="h-7 rounded-lg px-2.5">
            {customers.length} customers
          </Badge>
        </div>
      </div>

      {customers.length > 0 ? (
        <TableShell>
          <table className={tableStyles.table}>
            <caption className="sr-only">Customer list</caption>
            <thead className={tableStyles.header}>
              <tr>
                <th className={tableStyles.heading}>Customer</th>
                <th className={tableStyles.heading}>Contact</th>
                <th className={tableStyles.heading}>Quotes</th>
                <th className={tableStyles.heading}>Recent activity</th>
                <th className={`${tableStyles.heading} w-12`}>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className={tableStyles.row}>
                  <td className={tableStyles.cell}>
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-700">
                        {customer.initials}
                      </span>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {customer.company}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className={tableStyles.cell}>
                    <p>{customer.email}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {customer.phone}
                    </p>
                  </td>
                  <td className={tableStyles.cell}>
                    <Badge variant="outline">{customer.quotes} quotes</Badge>
                  </td>
                  <td className={`${tableStyles.cell} text-muted-foreground`}>
                    {customer.activity}
                  </td>
                  <td className={tableStyles.cell}>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Actions for ${customer.name}`}
                    >
                      <MoreHorizontal aria-hidden="true" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>
      ) : (
        <EmptyState
          icon={UserRoundPlus}
          title="No customers yet"
          description="Add your first customer to start creating quotes."
          action="Add customer"
        />
      )}
    </div>
  );
}

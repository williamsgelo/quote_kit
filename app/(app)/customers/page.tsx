import Link from "next/link";
import { Filter, MoreHorizontal, Plus, UserRoundPlus } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { SearchInput } from "@/components/shared/search-input";
import { TableShell, tableStyles } from "@/components/shared/table-shell";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { requireOrganization } from "@/lib/auth/access";
import { listCustomersForOrganization } from "@/lib/customers/queries";
import { cn } from "@/lib/utils";

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function activityLabel(createdAt: Date, updatedAt: Date) {
  const changed = updatedAt.getTime() - createdAt.getTime() > 1_000;
  const date = new Intl.DateTimeFormat("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(changed ? updatedAt : createdAt);

  return `${changed ? "Updated" : "Added"} ${date}`;
}

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { organization } = await requireOrganization();
  const { q } = await searchParams;
  const search = typeof q === "string" ? q.trim().slice(0, 100) : "";
  const customers = await listCustomersForOrganization(
    organization.id,
    search,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Keep customer details and quote history in one place."
        actions={
          <Link
            href="/customers/new"
            className={cn(buttonVariants({ size: "lg" }), "h-9 px-3")}
          >
            <Plus className="size-4" aria-hidden="true" />
            Add customer
          </Link>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form action="/customers" method="get" className="w-full sm:max-w-xs">
          <SearchInput
            name="q"
            defaultValue={search}
            placeholder="Search customers..."
            label="Search customers"
            className="sm:max-w-none"
          />
          <button type="submit" className="sr-only">
            Search
          </button>
        </form>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-9"
            disabled
            title="Archived customer filters are not available yet"
          >
            <Filter className="size-4" aria-hidden="true" />
            Filter
          </Button>
          <Badge variant="secondary" className="h-7 rounded-lg px-2.5">
            {customers.length} {customers.length === 1 ? "customer" : "customers"}
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
                        {initials(customer.name)}
                      </span>
                      <div>
                        <Link
                          href={`/customers/${customer.id}`}
                          className="font-medium hover:underline"
                        >
                          {customer.name}
                        </Link>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {customer.companyName || "Individual customer"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className={tableStyles.cell}>
                    <p>{customer.email || "No email address"}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {customer.phone || "No phone number"}
                    </p>
                  </td>
                  <td className={tableStyles.cell}>
                    <Badge variant="outline">0 quotes</Badge>
                  </td>
                  <td className={`${tableStyles.cell} text-muted-foreground`}>
                    {activityLabel(customer.createdAt, customer.updatedAt)}
                  </td>
                  <td className={tableStyles.cell}>
                    <Link
                      href={`/customers/${customer.id}`}
                      className={buttonVariants({ variant: "ghost", size: "icon" })}
                      aria-label={`View ${customer.name}`}
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
          icon={UserRoundPlus}
          title={search ? "No customers found" : "No customers yet"}
          description={
            search
              ? `No active customers match “${search}”.`
              : "Add your first customer to start creating quotes."
          }
          action={search ? "Clear search" : "Add customer"}
          actionHref={search ? "/customers" : "/customers/new"}
        />
      )}
    </div>
  );
}

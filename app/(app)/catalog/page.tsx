import Link from "next/link";
import { Filter, MoreHorizontal, PackagePlus, Plus } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { SearchInput } from "@/components/shared/search-input";
import { TableShell, tableStyles } from "@/components/shared/table-shell";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { requireOrganization } from "@/lib/auth/access";
import { listCatalogItemsForOrganization } from "@/lib/catalog/queries";
import { formatCurrency, formatDecimalPercentage } from "@/lib/money";
import { cn } from "@/lib/utils";

function unitLabel(unit: string) {
  return unit.charAt(0).toUpperCase() + unit.slice(1);
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { organization } = await requireOrganization();
  const { q } = await searchParams;
  const search = typeof q === "string" ? q.trim().slice(0, 100) : "";
  const catalogItems = await listCatalogItemsForOrganization(
    organization.id,
    search,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Catalog"
        description="Build a reusable library of products and services for faster quoting."
        actions={
          <Link
            href="/catalog/new"
            className={cn(buttonVariants({ size: "lg" }), "h-9 px-3")}
          >
            <Plus className="size-4" aria-hidden="true" />
            Add item
          </Link>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form action="/catalog" method="get" className="w-full sm:max-w-xs">
          <SearchInput
            name="q"
            defaultValue={search}
            placeholder="Search catalog..."
            label="Search catalog items"
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
            title="Additional catalog filters are not available yet"
          >
            <Filter className="size-4" aria-hidden="true" />
            Filter
          </Button>
          <Badge variant="secondary" className="h-7 rounded-lg px-2.5">
            {catalogItems.length} {catalogItems.length === 1 ? "item" : "items"}
          </Badge>
        </div>
      </div>

      {catalogItems.length > 0 ? (
        <TableShell>
          <table className={tableStyles.table}>
            <caption className="sr-only">Catalog items</caption>
            <thead className={tableStyles.header}>
              <tr>
                <th className={tableStyles.heading}>Item</th>
                <th className={tableStyles.heading}>Unit</th>
                <th className={tableStyles.heading}>Unit price</th>
                <th className={tableStyles.heading}>Tax</th>
                <th className={tableStyles.heading}>Status</th>
                <th className={`${tableStyles.heading} w-12`}>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {catalogItems.map((item) => (
                <tr key={item.id} className={tableStyles.row}>
                  <td className={tableStyles.cell}>
                    <Link
                      href={`/catalog/${item.id}/edit`}
                      className="font-medium hover:underline"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-0.5 max-w-md truncate text-xs text-muted-foreground">
                      {item.description}
                    </p>
                    {item.sku && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        SKU: {item.sku}
                      </p>
                    )}
                  </td>
                  <td className={tableStyles.cell}>
                    <Badge variant="outline">{unitLabel(item.unit)}</Badge>
                  </td>
                  <td className={`${tableStyles.cell} font-medium`}>
                    {formatCurrency(item.unitPrice.toString(), {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className={tableStyles.cell}>
                    {formatDecimalPercentage(item.taxRate.toString())}
                  </td>
                  <td className={tableStyles.cell}>
                    <span className="text-emerald-700">Active</span>
                  </td>
                  <td className={tableStyles.cell}>
                    <Link
                      href={`/catalog/${item.id}/edit`}
                      className={buttonVariants({
                        variant: "ghost",
                        size: "icon",
                      })}
                      aria-label={`Edit ${item.name}`}
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
          icon={PackagePlus}
          title={search ? "No catalog items found" : "Your catalog is empty"}
          description={
            search
              ? `No active catalog items match “${search}”.`
              : "Add a product or service to reuse it in future quotes."
          }
          action={search ? "Clear search" : "Add item"}
          actionHref={search ? "/catalog" : "/catalog/new"}
        />
      )}
    </div>
  );
}

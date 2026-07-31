import { Filter, MoreHorizontal, PackagePlus, Plus } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { SearchInput } from "@/components/shared/search-input";
import {
  TableShell,
  tableStyles,
} from "@/components/shared/table-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { catalogItems, formatCurrency } from "@/lib/mock-data";

export default function CatalogPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Catalog"
        description="Build a reusable library of products and services for faster quoting."
        actions={
          <Button type="button" size="lg" className="h-9 px-3">
            <Plus className="size-4" aria-hidden="true" />
            Add item
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          placeholder="Search catalog..."
          label="Search catalog items"
        />
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="lg" className="h-9">
            <Filter className="size-4" aria-hidden="true" />
            Category
          </Button>
          <Badge variant="secondary" className="h-7 rounded-lg px-2.5">
            {catalogItems.length} items
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
                <th className={tableStyles.heading}>Category</th>
                <th className={tableStyles.heading}>Unit price</th>
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
                    <p className="font-medium">{item.name}</p>
                    <p className="mt-0.5 max-w-md truncate text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </td>
                  <td className={tableStyles.cell}>
                    <Badge variant="outline">{item.category}</Badge>
                  </td>
                  <td className={`${tableStyles.cell} font-medium`}>
                    {formatCurrency(item.price)}
                  </td>
                  <td className={tableStyles.cell}>
                    <span
                      className={
                        item.status === "Active"
                          ? "text-emerald-700"
                          : "text-muted-foreground"
                      }
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className={tableStyles.cell}>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Actions for ${item.name}`}
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
          icon={PackagePlus}
          title="Your catalog is empty"
          description="Add a product or service to reuse it in future quotes."
          action="Add item"
        />
      )}
    </div>
  );
}

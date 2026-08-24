import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { ArchiveCatalogItemButton } from "@/components/catalog/archive-catalog-item-button";
import { CatalogItemForm } from "@/components/catalog/catalog-item-form";
import { PageHeader } from "@/components/shared/page-header";
import { requireOrganization } from "@/lib/auth/access";
import { getCatalogItemForOrganization } from "@/lib/catalog/queries";

export default async function EditCatalogItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { organization } = await requireOrganization();
  const item = await getCatalogItemForOrganization(organization.id, id);

  if (!item || !item.isActive) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to catalog
        </Link>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <PageHeader
          title={`Edit ${item.name}`}
          description="Update item details, pricing, and tax information."
        />
        <ArchiveCatalogItemButton
          catalogItemId={item.id}
          itemName={item.name}
        />
      </div>
      <div className="max-w-4xl">
        <CatalogItemForm
          mode="edit"
          item={{
            id: item.id,
            name: item.name,
            description: item.description,
            sku: item.sku,
            unit: item.unit as
              | "each"
              | "hour"
              | "day"
              | "week"
              | "month"
              | "project",
            unitPrice: item.unitPrice.toFixed(2),
            taxRate: item.taxRate.toFixed(2),
          }}
        />
      </div>
    </div>
  );
}

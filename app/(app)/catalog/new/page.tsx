import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { CatalogItemForm } from "@/components/catalog/catalog-item-form";
import { PageHeader } from "@/components/shared/page-header";

export default function NewCatalogItemPage() {
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
      <PageHeader
        title="Add catalog item"
        description="Create a reusable product or service for future quotes."
      />
      <div className="max-w-4xl">
        <CatalogItemForm mode="create" />
      </div>
    </div>
  );
}

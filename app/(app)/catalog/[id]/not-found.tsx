import Link from "next/link";
import { PackageSearch } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";

export default function CatalogItemNotFound() {
  return (
    <div className="space-y-4">
      <EmptyState
        icon={PackageSearch}
        title="Catalog item not found"
        description="This catalog item is unavailable or you do not have access to it."
      />
      <div className="text-center">
        <Link href="/catalog" className="text-sm font-medium hover:underline">
          Return to catalog
        </Link>
      </div>
    </div>
  );
}

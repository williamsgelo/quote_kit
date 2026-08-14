import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { CustomerForm } from "@/components/customers/customer-form";
import { PageHeader } from "@/components/shared/page-header";

export default function NewCustomerPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/customers"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to customers
        </Link>
      </div>
      <PageHeader
        title="Add customer"
        description="Create a customer record for quotes and future activity."
      />
      <div className="max-w-4xl">
        <CustomerForm mode="create" />
      </div>
    </div>
  );
}

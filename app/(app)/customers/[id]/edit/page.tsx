import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { CustomerForm } from "@/components/customers/customer-form";
import { PageHeader } from "@/components/shared/page-header";
import { requireOrganization } from "@/lib/auth/access";
import { getCustomerForOrganization } from "@/lib/customers/queries";

export default async function EditCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { organization } = await requireOrganization();
  const customer = await getCustomerForOrganization(organization.id, id);

  if (!customer || customer.isArchived) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/customers/${customer.id}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to customer
        </Link>
      </div>
      <PageHeader
        title={`Edit ${customer.name}`}
        description="Update customer contact, address, and internal details."
      />
      <div className="max-w-4xl">
        <CustomerForm
          mode="edit"
          customer={{
            id: customer.id,
            name: customer.name,
            companyName: customer.companyName,
            email: customer.email,
            phone: customer.phone,
            taxNumber: customer.taxNumber,
            addressLine1: customer.addressLine1,
            addressLine2: customer.addressLine2,
            city: customer.city,
            province: customer.province,
            postalCode: customer.postalCode,
            country: customer.country,
            notes: customer.notes,
          }}
        />
      </div>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Edit3,
  Mail,
  MapPin,
  Phone,
  ReceiptText,
} from "lucide-react";

import { ArchiveCustomerButton } from "@/components/customers/archive-customer-button";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireOrganization } from "@/lib/auth/access";
import { getCustomerForOrganization } from "@/lib/customers/queries";
import { cn } from "@/lib/utils";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { organization } = await requireOrganization();
  const customer = await getCustomerForOrganization(organization.id, id);

  if (!customer) {
    notFound();
  }

  const address = [
    customer.addressLine1,
    customer.addressLine2,
    customer.city,
    customer.province,
    customer.postalCode,
    customer.country,
  ].filter(Boolean);

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
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-sm font-semibold text-blue-700">
              {initials(customer.name)}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight">
                  {customer.name}
                </h1>
                {customer.isArchived && (
                  <Badge variant="secondary">Archived</Badge>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {customer.companyName || "Individual customer"}
              </p>
            </div>
          </div>
          {!customer.isArchived && (
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/customers/${customer.id}/edit`}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-9",
                )}
              >
                <Edit3 className="size-4" aria-hidden="true" />
                Edit
              </Link>
              <ArchiveCustomerButton
                customerId={customer.id}
                customerName={customer.name}
              />
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact details</CardTitle>
              <CardDescription>
                Customer and company information used on quotes.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">Email address</p>
                {customer.email ? (
                  <a
                    href={`mailto:${customer.email}`}
                    className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
                  >
                    <Mail className="size-3.5" aria-hidden="true" />
                    {customer.email}
                  </a>
                ) : (
                  <p className="mt-1 text-sm">Not provided</p>
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Phone number</p>
                {customer.phone ? (
                  <a
                    href={`tel:${customer.phone}`}
                    className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
                  >
                    <Phone className="size-3.5" aria-hidden="true" />
                    {customer.phone}
                  </a>
                ) : (
                  <p className="mt-1 text-sm">Not provided</p>
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Company</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-medium">
                  <Building2 className="size-3.5" aria-hidden="true" />
                  {customer.companyName || "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tax number</p>
                <p className="mt-1 text-sm font-medium">
                  {customer.taxNumber || "Not provided"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Address</CardTitle>
              <CardDescription>
                Billing and document address for this customer.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {address.length ? (
                <div className="flex items-start gap-2 text-sm leading-6">
                  <MapPin
                    className="mt-1 size-4 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <address className="not-italic">
                    {address.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No address has been added.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Internal notes</CardTitle>
              <CardDescription>
                Private context visible only to your organisation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                {customer.notes || "No notes have been added."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quote history</CardTitle>
              <CardDescription>
                Quotes associated with this customer will appear here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon={ReceiptText}
                title="No database quotes yet"
                description="Quotes created for this customer will appear in the Quotes workspace."
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Record details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Created</p>
                <p className="mt-1 font-medium">
                  {formatDate(customer.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Last updated</p>
                <p className="mt-1 font-medium">
                  {formatDate(customer.updatedAt)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Customer ID</p>
                <p className="mt-1 break-all font-mono text-xs">
                  {customer.id}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

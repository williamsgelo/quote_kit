import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Copy, Download, Edit3, MapPin } from "lucide-react";

import { QuoteStatus } from "@/generated/prisma/client";
import { QuoteDeliveryActions } from "@/components/quotes/quote-delivery-actions";
import { QuoteLineItems } from "@/components/quotes/quote-line-items";
import { QuoteSummary } from "@/components/quotes/quote-summary";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { requireOrganization } from "@/lib/auth/access";
import { quoteActivityLabel } from "@/lib/quotes/activity";
import { buildPublicQuoteUrl } from "@/lib/quotes/delivery-service";
import { formatQuoteNumber } from "@/lib/quotes/numbering";
import { getQuoteForOrganization } from "@/lib/quotes/queries";
import { cn } from "@/lib/utils";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-ZA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { organization } = await requireOrganization();
  const quote = await getQuoteForOrganization(organization.id, id);

  if (!quote) {
    notFound();
  }

  const number = formatQuoteNumber(quote.quoteNumber);
  let publicUrl: string | null = null;
  if (quote.publicToken && quote.status !== QuoteStatus.DRAFT) {
    try {
      publicUrl = buildPublicQuoteUrl(quote.publicToken);
    } catch {
      publicUrl = null;
    }
  }
  const address = [
    quote.customerAddressLine1,
    quote.customerAddressLine2,
    quote.customerCity,
    quote.customerProvince,
    quote.customerPostalCode,
    quote.customerCountry,
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/quotes"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to quotes
        </Link>
        <div className="mt-4 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">
                Quote {number}
              </h1>
              <StatusBadge status={quote.status} />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Prepared for {quote.customerCompanyName || quote.customerName}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-9"
              disabled
              title="Quote duplication is planned for a later sprint"
            >
              <Copy className="size-4" aria-hidden="true" />
              Duplicate
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-9"
              disabled
              title="PDF generation is planned for a later sprint"
            >
              <Download className="size-4" aria-hidden="true" />
              Download PDF
            </Button>
            {quote.status === QuoteStatus.DRAFT && (
              <Link
                href={`/quotes/${quote.id}/edit`}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-9",
                )}
              >
                <Edit3 className="size-4" aria-hidden="true" />
                Edit
              </Link>
            )}
            <QuoteDeliveryActions
              quoteId={quote.id}
              canSend={quote.status === QuoteStatus.DRAFT}
              initialPublicUrl={publicUrl}
            />
          </div>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="grid gap-8 border-b p-5 sm:p-7 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white">
                {organization.name
                  .split(/\s+/)
                  .slice(0, 2)
                  .map((part) => part.charAt(0).toUpperCase())
                  .join("")}
              </div>
              <h2 className="mt-4 text-lg font-semibold">{organization.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Organisation quote
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-x-10 gap-y-4 text-sm lg:min-w-80">
              <div>
                <dt className="text-xs text-muted-foreground">Quote number</dt>
                <dd className="mt-1 font-medium">{number}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Status</dt>
                <dd className="mt-1 font-medium">
                  <StatusBadge status={quote.status} />
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Issue date</dt>
                <dd className="mt-1 font-medium">{formatDate(quote.issueDate)}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Expiry date</dt>
                <dd className="mt-1 font-medium">{formatDate(quote.expiryDate)}</dd>
              </div>
            </dl>
          </div>

          <div className="grid gap-6 border-b bg-muted/15 p-5 sm:p-7 md:grid-cols-2">
            <div>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Prepared for
              </p>
              <h2 className="mt-2 font-semibold">{quote.customerName}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {quote.customerCompanyName || "Individual customer"}
              </p>
              {quote.customerEmail && <p className="mt-3 text-sm">{quote.customerEmail}</p>}
              {quote.customerPhone && <p className="mt-1 text-sm">{quote.customerPhone}</p>}
              {quote.customerTaxNumber && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Tax number: {quote.customerTaxNumber}
                </p>
              )}
            </div>
            <div className="md:text-right">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Billing address
              </p>
              {address.length ? (
                <address className="mt-2 text-sm leading-6 not-italic text-muted-foreground">
                  <MapPin className="mr-1 inline size-3.5" aria-hidden="true" />
                  {address.join(", ")}
                </address>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">
                  No billing address provided
                </p>
              )}
            </div>
          </div>

          <QuoteLineItems
            items={quote.items.map((item) => ({
              id: item.id,
              name: item.name,
              description: item.description,
              unit: item.unit,
              quantity: item.quantity.toFixed(4),
              unitPrice: item.unitPrice.toFixed(2),
              taxRate: item.taxRate.toFixed(2),
              total: item.total.toFixed(2),
            }))}
          />
          <div className="border-t bg-muted/10">
            <QuoteSummary
              subtotal={quote.subtotal.toFixed(2)}
              discountAmount={quote.discountAmount.toFixed(2)}
              taxTotal={quote.taxTotal.toFixed(2)}
              total={quote.total.toFixed(2)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <h2 className="text-sm font-semibold">Customer message</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
              {quote.customerMessage || "No customer message was added."}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <h2 className="text-sm font-semibold">Internal notes</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
              {quote.notes || "No internal notes were added."}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <h2 className="text-sm font-semibold">Terms</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
              {quote.terms || "No terms were added."}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-5">
          <h2 className="text-sm font-semibold">Activity history</h2>
          {quote.activities.length ? (
            <ol className="mt-4 space-y-4">
              {quote.activities.map((activity) => (
                <li key={activity.id} className="flex items-start gap-3 text-sm">
                  <span
                    className="mt-1.5 size-2 shrink-0 rounded-full bg-primary"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-medium">
                      {quoteActivityLabel(activity.type)}
                    </p>
                    <time className="text-xs text-muted-foreground">
                      {formatDateTime(activity.createdAt)}
                    </time>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              No activity has been recorded for this quote yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

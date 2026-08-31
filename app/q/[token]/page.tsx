import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";

import { PublicQuoteResponse } from "@/components/quotes/public-quote-response";
import { QuoteLineItems } from "@/components/quotes/quote-line-items";
import { QuoteSummary } from "@/components/quotes/quote-summary";
import { Logo } from "@/components/shared/logo";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { QuoteStatus } from "@/generated/prisma/client";
import { formatCurrency } from "@/lib/money";
import { formatQuoteNumber } from "@/lib/quotes/numbering";
import { getPublicQuoteAndMarkViewed } from "@/lib/quotes/delivery-service";
import { isQuoteExpired } from "@/lib/quotes/transitions";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export default async function PublicQuotePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const quote = await getPublicQuoteAndMarkViewed(token);
  if (!quote) {
    notFound();
  }

  const terminal =
    quote.status === QuoteStatus.ACCEPTED ||
    quote.status === QuoteStatus.DECLINED;
  const expired = !terminal && isQuoteExpired(quote.expiryDate);
  const displayStatus = expired ? QuoteStatus.EXPIRED : quote.status;
  const address = [
    quote.customerAddressLine1,
    quote.customerAddressLine2,
    quote.customerCity,
    quote.customerProvince,
    quote.customerPostalCode,
    quote.customerCountry,
  ].filter(Boolean);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-5xl space-y-5">
        <div className="flex items-center justify-between gap-4">
          <Logo href="/" />
          <p className="text-xs text-muted-foreground">Secure customer quote</p>
        </div>

        <Card className="overflow-hidden shadow-sm">
          <CardContent className="p-0">
            <div className="grid gap-8 border-b p-5 sm:p-8 lg:grid-cols-[1fr_auto]">
              <div className="min-w-0">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white">
                  {quote.organization.name
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((part) => part.charAt(0).toUpperCase())
                    .join("")}
                </div>
                <h1 className="mt-4 break-words text-xl font-semibold">
                  {quote.organization.name}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Quote {formatQuoteNumber(quote.quoteNumber)}
                </p>
              </div>
              <dl className="grid grid-cols-2 gap-x-10 gap-y-4 text-sm lg:min-w-80">
                <div>
                  <dt className="text-xs text-muted-foreground">Status</dt>
                  <dd className="mt-1">
                    <StatusBadge status={displayStatus} />
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Total</dt>
                  <dd className="mt-1 font-semibold tabular-nums">
                    {formatCurrency(quote.total.toFixed(2), {
                      minimumFractionDigits: 2,
                    })}
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

            <div className="grid gap-6 border-b bg-muted/15 p-5 sm:p-8 md:grid-cols-2">
              <div>
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Prepared for
                </p>
                <h2 className="mt-2 break-words font-semibold">
                  {quote.customerName}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {quote.customerCompanyName || "Individual customer"}
                </p>
                {quote.customerTaxNumber && (
                  <p className="mt-2 text-xs text-muted-foreground">
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
              items={quote.items.map((item, index) => ({
                id: `line-${index + 1}`,
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

        {(quote.customerMessage || quote.terms) && (
          <div className="grid gap-4 md:grid-cols-2">
            {quote.customerMessage && (
              <Card>
                <CardContent className="p-5">
                  <h2 className="text-sm font-semibold">Message</h2>
                  <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-muted-foreground">
                    {quote.customerMessage}
                  </p>
                </CardContent>
              </Card>
            )}
            {quote.terms && (
              <Card>
                <CardContent className="p-5">
                  <h2 className="text-sm font-semibold">Terms</h2>
                  <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-muted-foreground">
                    {quote.terms}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <PublicQuoteResponse
          token={token}
          status={quote.status as "SENT" | "VIEWED" | "ACCEPTED" | "DECLINED"}
          expired={expired}
        />
        <p className="pb-4 text-center text-xs text-muted-foreground">
          This secure link grants access only to this quote.
        </p>
      </div>
    </main>
  );
}

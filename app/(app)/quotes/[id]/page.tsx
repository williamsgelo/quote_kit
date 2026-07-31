import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Copy,
  Download,
  Edit3,
  Mail,
  MapPin,
} from "lucide-react";

import { QuoteLineItems } from "@/components/quotes/quote-line-items";
import { QuoteSummary } from "@/components/quotes/quote-summary";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { quotes } from "@/lib/mock-data";

export default async function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const quote = quotes.find((item) => item.id === id);

  if (!quote) {
    notFound();
  }

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
                Quote {quote.number}
              </h1>
              <StatusBadge status={quote.status} />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Prepared for {quote.company}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="lg" className="h-9">
              <Copy className="size-4" aria-hidden="true" />
              Duplicate
            </Button>
            <Button type="button" variant="outline" size="lg" className="h-9">
              <Download className="size-4" aria-hidden="true" />
              Download PDF
            </Button>
            <Button type="button" variant="outline" size="lg" className="h-9">
              <Edit3 className="size-4" aria-hidden="true" />
              Edit
            </Button>
            <Button type="button" size="lg" className="h-9">
              <Mail className="size-4" aria-hidden="true" />
              Send quote
            </Button>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="grid gap-8 border-b p-5 sm:p-7 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white">
                NS
              </div>
              <h2 className="mt-4 text-lg font-semibold">Northstar Studio</h2>
              <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
                Digital products and brand systems for ambitious businesses.
              </p>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="size-3.5" aria-hidden="true" />
                41 Bree Street, Cape Town, 8001
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-x-10 gap-y-4 text-sm lg:min-w-80">
              <div>
                <dt className="text-xs text-muted-foreground">Quote number</dt>
                <dd className="mt-1 font-medium">{quote.number}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Status</dt>
                <dd className="mt-1 font-medium">{quote.status}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Issue date</dt>
                <dd className="mt-1 font-medium">{quote.issueDate}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Expiry date</dt>
                <dd className="mt-1 font-medium">{quote.expiryDate}</dd>
              </div>
            </dl>
          </div>

          <div className="grid gap-6 border-b bg-muted/15 p-5 sm:p-7 md:grid-cols-2">
            <div>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Prepared for
              </p>
              <h2 className="mt-2 font-semibold">{quote.customer}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {quote.company}
              </p>
              <p className="mt-3 text-sm">amelia@hartandfinch.co.za</p>
              <p className="mt-1 text-sm">+27 82 441 0932</p>
            </div>
            <div className="md:text-right">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Project
              </p>
              <h2 className="mt-2 font-semibold">
                Brand and website refresh
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Reference HF-2026-07
              </p>
            </div>
          </div>

          <QuoteLineItems />
          <div className="border-t bg-muted/10">
            <QuoteSummary />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <h2 className="text-sm font-semibold">Notes</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Thank you for the opportunity to work together. This quote covers
              the agreed discovery, design, and content scope.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <h2 className="text-sm font-semibold">Terms</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              A 50% deposit is required to begin. The remaining balance is due
              on completion. This quote is valid until {quote.expiryDate}.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

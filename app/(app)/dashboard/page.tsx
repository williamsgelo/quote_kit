import Link from "next/link";
import {
  CheckCircle2,
  DollarSign,
  FilePlus2,
  FileText,
  Plus,
  Send,
  UserPlus,
} from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { requireOrganization } from "@/lib/auth/access";
import { formatCurrency } from "@/lib/money";
import { formatQuoteNumber } from "@/lib/quotes/numbering";
import { quoteActivityLabel } from "@/lib/quotes/activity";
import { getQuoteDashboardForOrganization } from "@/lib/quotes/queries";
import { isQuoteExpired } from "@/lib/quotes/transitions";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  const { organization, user } = await requireOrganization();
  const dashboard = await getQuoteDashboardForOrganization(organization.id);
  const firstName = user.name?.trim().split(/\s+/)[0] || "there";

  return (
    <div className="space-y-7">
      <PageHeader
        title={`Welcome back, ${firstName}`}
        description="Here’s the latest activity across your quotes and customers."
        actions={
          <Link
            href="/quotes/new"
            className={cn(buttonVariants({ size: "lg" }), "h-9 px-3")}
          >
            <Plus className="size-4" aria-hidden="true" />
            Create quote
          </Link>
        }
      />

      <section
        aria-label="Quote summary"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatCard
          label="Total quotes"
          value={dashboard.totalQuotes.toString()}
          change="Organisation quote records"
          icon={FileText}
        />
        <StatCard
          label="Awaiting response"
          value={dashboard.awaitingResponse.toString()}
          change="Sent or viewed quotes"
          icon={Send}
          iconClassName="bg-amber-50 text-amber-700"
        />
        <StatCard
          label="Accepted quotes"
          value={dashboard.acceptedQuotes.toString()}
          change={`${dashboard.conversionRate}% decided conversion`}
          icon={CheckCircle2}
          iconClassName="bg-emerald-50 text-emerald-700"
        />
        <StatCard
          label="Accepted value"
          value={formatCurrency(dashboard.acceptedValue, {
            minimumFractionDigits: 2,
          })}
          change="Accepted commercial value"
          icon={DollarSign}
          iconClassName="bg-violet-50 text-violet-700"
        />
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(18rem,0.75fr)]">
        <Card className="overflow-hidden">
          <CardHeader className="flex-row items-start justify-between gap-4 border-b">
            <div>
              <CardTitle>Recent quotes</CardTitle>
              <CardDescription className="mt-1">
                Your latest customer quotes
              </CardDescription>
            </div>
            <Link
              href="/quotes"
              className="text-xs font-medium text-primary hover:underline"
            >
              View all
            </Link>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full min-w-145 text-left text-sm">
              <caption className="sr-only">Recent quotes</caption>
              <thead className="border-b bg-muted/30 text-xs text-muted-foreground">
                <tr>
                  <th className="h-10 px-5 font-medium">Quote</th>
                  <th className="h-10 px-4 font-medium">Customer</th>
                  <th className="h-10 px-4 font-medium">Status</th>
                  <th className="h-10 px-5 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.recentQuotes.map((quote) => (
                  <tr
                    key={quote.id}
                    className="border-b last:border-0 hover:bg-muted/25"
                  >
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/quotes/${quote.id}`}
                        className="font-medium hover:text-primary hover:underline"
                      >
                        {formatQuoteNumber(quote.quoteNumber)}
                      </Link>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-medium">{quote.customerName}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {quote.customerCompanyName || "Individual customer"}
                      </p>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge
                        status={
                          (quote.status === "SENT" || quote.status === "VIEWED") &&
                          isQuoteExpired(quote.expiryDate)
                            ? "EXPIRED"
                            : quote.status
                        }
                      />
                    </td>
                    <td className="px-5 py-3.5 text-right font-medium">
                      {formatCurrency(quote.total.toString(), {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))}
                {dashboard.recentQuotes.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-10 text-center text-sm text-muted-foreground"
                    >
                      No quotes yet. Create the first draft for this organisation.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
              <CardDescription>Jump back into your workflow</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Link
                href="/quotes/new"
                className="flex items-center gap-3 rounded-lg border p-3 text-sm font-medium transition-colors hover:bg-muted/50"
              >
                <span className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                  <FilePlus2 className="size-4" aria-hidden="true" />
                </span>
                Create a quote
              </Link>
              <Link
                href="/customers/new"
                className="flex items-center gap-3 rounded-lg border p-3 text-sm font-medium transition-colors hover:bg-muted/50"
              >
                <span className="flex size-8 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
                  <UserPlus className="size-4" aria-hidden="true" />
                </span>
                Add a customer
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
          <CardDescription>Latest Quote workflow events</CardDescription>
        </CardHeader>
        <CardContent>
          {dashboard.recentActivities.length ? (
            <ol className="space-y-4">
              {dashboard.recentActivities.map((activity) => (
                <li key={activity.id} className="flex items-start gap-3 text-sm">
                  <span
                    className="mt-1.5 size-2 shrink-0 rounded-full bg-primary"
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <Link
                      href={`/quotes/${activity.quote.id}`}
                      className="font-medium hover:text-primary hover:underline"
                    >
                      {quoteActivityLabel(activity.type)} ·{" "}
                      {formatQuoteNumber(activity.quote.quoteNumber)}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {activity.quote.customerName} ·{" "}
                      {new Intl.DateTimeFormat("en-ZA", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(activity.createdAt)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-muted-foreground">
              Quote activity will appear after the first draft is created.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

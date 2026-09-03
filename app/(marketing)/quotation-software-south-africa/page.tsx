import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Clock3,
  Eye,
  FileText,
  MailCheck,
  Send,
  ShieldCheck,
} from "lucide-react";

import { PublicPageFooter } from "@/components/marketing/public-page-footer";
import { PublicPageHeader } from "@/components/marketing/public-page-header";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SITE_NAME } from "@/lib/seo";
import { cn } from "@/lib/utils";

const title = "Quotation Software for South African Businesses";
const description =
  "Create and send professional quotes in rand, track customer views, and collect online decisions with QuoteVia quotation software for South African service businesses.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/quotation-software-south-africa",
  },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: "/quotation-software-south-africa",
    siteName: SITE_NAME,
    title: `${title} | ${SITE_NAME}`,
    description,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "QuoteVia quotation software for South African businesses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | ${SITE_NAME}`,
    description,
    images: ["/opengraph-image"],
  },
};

const localNeeds = [
  {
    icon: Building2,
    title: "Price services in rand",
    text: "Present line items and totals in South African rand so customers can review a familiar, clear quotation.",
  },
  {
    icon: FileText,
    title: "Keep tax and discounts visible",
    text: "Show the pricing breakdown, discount, tax, and final total without rebuilding spreadsheet formulas for every quote.",
  },
  {
    icon: MailCheck,
    title: "Send a secure customer link",
    text: "Email the live quote instead of relying on attachments that become difficult to track across conversations.",
  },
  {
    icon: Eye,
    title: "Follow the customer response",
    text: "See whether a quote is sent, viewed, accepted, declined, or past its validity date from your workspace.",
  },
];

const workflow = [
  {
    icon: FileText,
    title: "Create a detailed quote",
    text: "Select the customer, add service line items, and confirm quantities, pricing, tax, and terms.",
  },
  {
    icon: Send,
    title: "Email it from QuoteVia",
    text: "Your customer receives a message with their own secure public quote link.",
  },
  {
    icon: Eye,
    title: "Know when it is viewed",
    text: "The status changes when the customer opens the secure quote, giving you a clearer follow-up signal.",
  },
  {
    icon: CheckCircle2,
    title: "Record the decision",
    text: "The customer accepts or declines online and the response is visible to your business.",
  },
];

const serviceBusinesses = [
  "Freelancers and independent consultants",
  "Creative, marketing, and digital agencies",
  "Builders, contractors, and specialist trades",
  "Cleaning and facilities service providers",
  "Installers and repair businesses",
  "Property and general maintenance teams",
];

const questions = [
  {
    question: "What is quotation software?",
    answer:
      "Quotation software gives a business a consistent way to prepare pricing, send quotes, and manage customer responses. QuoteVia connects those steps so you do not have to reconcile documents, emails, and a separate status list.",
  },
  {
    question: "Does QuoteVia support South African rand?",
    answer:
      "Yes. QuoteVia displays quote pricing and totals in South African rand for the current product workflow.",
  },
  {
    question: "Can I add tax to a quotation?",
    answer:
      "Yes. You can include tax and a quote-level discount. The quote shows the pricing breakdown and final total to the customer.",
  },
  {
    question: "How does a customer respond?",
    answer:
      "The customer follows their secure emailed link, reviews the quote online, and chooses to accept or decline it. Your business sees the resulting status in QuoteVia.",
  },
];

export default function QuotationSoftwareSouthAfricaPage() {
  return (
    <div className="min-h-dvh bg-[#fbfbfc]">
      <PublicPageHeader />

      <main>
        <section className="surface-grid border-b">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-18 sm:px-6 sm:py-24 lg:grid-cols-[1fr_0.8fr] lg:items-center lg:px-8 lg:py-28">
            <div>
              <p className="text-sm font-medium text-primary">
                Quotation software South Africa
              </p>
              <h1 className="mt-4 max-w-4xl text-4xl leading-[1.08] font-semibold tracking-[-0.035em] text-balance sm:text-5xl lg:text-6xl">
                Quotation Software Built for South African Service Businesses
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Create professional quotes in rand, send each customer a secure
                online link, and follow the quote through to an accepted or
                declined decision. QuoteVia gives small service businesses a
                focused alternative to scattered documents and manual status
                tracking.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/signup"
                  className={cn(buttonVariants({ size: "lg" }), "h-11 px-5")}
                >
                  Create your QuoteVia account
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/online-quote-maker"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "h-11 px-5",
                  )}
                >
                  Explore the quote maker
                </Link>
              </div>
            </div>

            <Card className="border-slate-200 bg-background shadow-xl shadow-slate-900/8">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center justify-between gap-4 border-b pb-5">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">QUOTE STATUS</p>
                    <p className="mt-2 text-lg font-semibold">A clearer follow-up view</p>
                  </div>
                  <span className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <ShieldCheck className="size-5" aria-hidden="true" />
                  </span>
                </div>
                <ol className="mt-6 space-y-5">
                  {["Draft created", "Quote sent", "Customer viewed", "Decision recorded"].map(
                    (item, index) => (
                      <li key={item} className="flex items-center gap-4">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-700">
                          {index + 1}
                        </span>
                        <span className="text-sm font-medium">{item}</span>
                        {index < 3 ? (
                          <Clock3
                            className="ml-auto size-4 text-muted-foreground"
                            aria-hidden="true"
                          />
                        ) : (
                          <CheckCircle2
                            className="ml-auto size-4 text-emerald-600"
                            aria-hidden="true"
                          />
                        )}
                      </li>
                    ),
                  )}
                </ol>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-primary">Made for the local workflow</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Keep every quotation clear from price to approval
            </h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              Small South African businesses often need something more useful
              than a reusable document but less complicated than a broad sales
              platform. QuoteVia focuses on the daily work of preparing,
              sending, and following up on customer quotations.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {localNeeds.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="bg-background">
                  <CardContent className="p-6">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-5 font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {item.text}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="border-y bg-slate-950 text-white">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-blue-400">How QuoteVia works</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Four visible steps, one quotation record
              </h2>
            </div>
            <ol className="mt-10 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
              {workflow.map((item, index) => {
                const Icon = item.icon;
                return (
                  <li key={item.title} className="bg-slate-950 p-6">
                    <div className="flex items-center justify-between">
                      <Icon className="size-5 text-blue-400" aria-hidden="true" />
                      <span className="font-mono text-xs text-slate-600">0{index + 1}</span>
                    </div>
                    <h3 className="mt-7 font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {item.text}
                    </p>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8">
          <div>
            <p className="text-sm font-medium text-primary">Who it is for</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Practical quote software for businesses that sell services
            </h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              QuoteVia is best suited to teams that quote projects, expertise,
              labour, installations, maintenance, or repeatable services and
              want a simple online path to customer approval.
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {serviceBusinesses.map((business) => (
              <li
                key={business}
                className="flex gap-3 rounded-xl border bg-background p-4 text-sm leading-6"
              >
                <Check
                  className="mt-1 size-4 shrink-0 text-emerald-600"
                  aria-hidden="true"
                />
                {business}
              </li>
            ))}
          </ul>
        </section>

        <section className="border-y bg-white">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
            <div>
              <p className="text-sm font-medium text-primary">Common questions</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                South African quotation software questions
              </h2>
            </div>
            <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
              {questions.map((item) => (
                <article key={item.question}>
                  <h3 className="font-semibold">{item.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.answer}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-medium text-primary">Start your next quote online</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Give every customer a clearer path to a decision
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-muted-foreground">
            Create a QuoteVia workspace, add a customer and your services, then
            send a professional quotation through a secure online link.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className={cn(buttonVariants({ size: "lg" }), "h-11 px-5")}
            >
              Create an account
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-11 px-5",
              )}
            >
              Back to QuoteVia home
            </Link>
          </div>
        </section>
      </main>

      <PublicPageFooter />
    </div>
  );
}

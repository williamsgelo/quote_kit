import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  Eye,
  FileCheck2,
  FileText,
  Hammer,
  ListChecks,
  Send,
  Wrench,
} from "lucide-react";

import { PublicPageFooter } from "@/components/marketing/public-page-footer";
import { PublicPageHeader } from "@/components/marketing/public-page-header";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SITE_NAME } from "@/lib/seo";
import { cn } from "@/lib/utils";

const title = "Online Quote Maker for Service Businesses";
const description =
  "Create clear customer quotations, send secure quote links, track views, and collect accept or decline decisions with QuoteVia's online quote maker.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/online-quote-maker",
  },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: "/online-quote-maker",
    siteName: SITE_NAME,
    title: `${title} | ${SITE_NAME}`,
    description,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "QuoteVia online quote maker",
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

const workflow = [
  {
    icon: FileText,
    step: "Create",
    text: "Choose a customer, add your services, and set quantities, prices, discounts, and tax.",
  },
  {
    icon: Send,
    step: "Send",
    text: "Email a secure online quote link without exporting and reattaching another document.",
  },
  {
    icon: Eye,
    step: "Track",
    text: "Follow the quote from draft to sent and see when your customer has viewed it.",
  },
  {
    icon: CheckCircle2,
    step: "Get approval",
    text: "Let the customer accept or decline online, with the decision reflected in your workspace.",
  },
];

const quoteChecklist = [
  "Your business and customer details",
  "A specific scope, service, or deliverable",
  "Quantities and transparent line-item prices",
  "Discount and tax where they apply",
  "A total amount and clear validity date",
  "Terms and a simple path to a decision",
];

const businessTypes = [
  {
    icon: BriefcaseBusiness,
    title: "Freelancers and consultants",
    text: "Turn a discussed scope into a structured quote while the opportunity is still active.",
  },
  {
    icon: Hammer,
    title: "Contractors and trades",
    text: "Lay out labour, materials, quantities, and the final amount in one customer-ready view.",
  },
  {
    icon: Wrench,
    title: "Installers and maintenance teams",
    text: "Reuse common services while keeping each customer's scope and pricing accurate.",
  },
  {
    icon: FileCheck2,
    title: "Agencies and service businesses",
    text: "Keep proposals moving with clear pricing, secure delivery, and a visible response status.",
  },
];

const questions = [
  {
    question: "What does an online quote maker do?",
    answer:
      "It helps you turn customer details, services, quantities, and prices into a professional quotation. QuoteVia also sends the quote through a secure link and records whether it was viewed, accepted, or declined.",
  },
  {
    question: "Can a customer accept a quote online?",
    answer:
      "Yes. The customer opens their secure quote link and can accept or decline from the quote page. Your QuoteVia workspace then shows the updated status.",
  },
  {
    question: "Can I add tax and discounts?",
    answer:
      "Yes. QuoteVia supports quote-level discounts and tax, and calculates totals consistently on the server.",
  },
  {
    question: "Who is QuoteVia designed for?",
    answer:
      "QuoteVia is designed for small service businesses such as freelancers, agencies, consultants, contractors, trades, cleaners, installers, and maintenance teams.",
  },
];

export default function OnlineQuoteMakerPage() {
  return (
    <div className="min-h-dvh bg-[#fbfbfc]">
      <PublicPageHeader />

      <main>
        <section className="surface-grid border-b">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-18 sm:px-6 sm:py-24 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:px-8 lg:py-28">
            <div>
              <p className="text-sm font-medium text-primary">
                A practical online quote maker
              </p>
              <h1 className="mt-4 max-w-3xl text-4xl leading-[1.08] font-semibold tracking-[-0.035em] text-balance sm:text-5xl lg:text-6xl">
                Make and Send Professional Quotes Online
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Build a clear quotation from saved customer and service details,
                email it as a secure link, and know when the customer views or
                responds. QuoteVia keeps the whole quoting process in one
                straightforward workspace.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/signup"
                  className={cn(buttonVariants({ size: "lg" }), "h-11 px-5")}
                >
                  Create an account
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/#how-it-works"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "h-11 px-5",
                  )}
                >
                  See how QuoteVia works
                </Link>
              </div>
            </div>

            <Card className="border-slate-200 bg-background shadow-xl shadow-slate-900/8">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <ListChecks className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-semibold">A complete quote, not a blank page</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Keep the details that help a customer decide.
                    </p>
                  </div>
                </div>
                <ul className="mt-6 space-y-3">
                  {quoteChecklist.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-6">
                      <Check
                        className="mt-1 size-4 shrink-0 text-emerald-600"
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-primary">One connected process</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              From customer request to recorded decision
            </h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              A quote maker should remove repetitive admin without hiding the
              information your customer needs. QuoteVia keeps creation,
              delivery, tracking, and approval connected.
            </p>
          </div>
          <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {workflow.map((item, index) => {
              const Icon = item.icon;
              return (
                <li key={item.step} className="rounded-xl border bg-background p-6">
                  <div className="flex items-center justify-between">
                    <Icon className="size-5 text-blue-700" aria-hidden="true" />
                    <span className="font-mono text-xs text-muted-foreground">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-7 font-semibold">{item.step}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.text}
                  </p>
                </li>
              );
            })}
          </ol>
        </section>

        <section className="border-y bg-slate-950 text-white">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-blue-400">
                Built around real service work
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Useful quoting software for small businesses
              </h2>
              <p className="mt-4 leading-7 text-slate-400">
                QuoteVia suits businesses that sell expertise, labour, projects,
                installations, and recurring services—without requiring a
                complicated sales system.
              </p>
            </div>
            <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
              {businessTypes.map((business) => {
                const Icon = business.icon;
                return (
                  <article key={business.title} className="bg-slate-950 p-6">
                    <Icon className="size-5 text-blue-400" aria-hidden="true" />
                    <h3 className="mt-6 font-semibold">{business.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {business.text}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-b bg-white">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
            <div>
              <p className="text-sm font-medium text-primary">Common questions</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Choosing an online quote maker
              </h2>
              <p className="mt-4 leading-7 text-muted-foreground">
                Start with the workflow you need to improve, from preparing the
                price to seeing the customer&apos;s decision.
              </p>
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
          <p className="text-sm font-medium text-primary">Made for local service businesses</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Need quotation software for a South African business?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-muted-foreground">
            Learn how QuoteVia supports rand-based service quotes and a simpler
            online customer approval process.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/quotation-software-south-africa"
              className={cn(buttonVariants({ size: "lg" }), "h-11 px-5")}
            >
              Quotation software South Africa
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

import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Check,
  CheckCircle2,
  FileText,
  Hammer,
  LayoutDashboard,
  Mail,
  Send,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { StatusBadge } from "@/components/shared/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  homepageStructuredData,
  serializeJsonLd,
} from "@/lib/homepage-structured-data";
import { HOMEPAGE_DESCRIPTION, HOMEPAGE_TITLE, SITE_NAME } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: { absolute: HOMEPAGE_TITLE },
  description: HOMEPAGE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: "/",
    siteName: SITE_NAME,
    title: HOMEPAGE_TITLE,
    description: HOMEPAGE_DESCRIPTION,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "QuoteVia online quotation software",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: HOMEPAGE_TITLE,
    description: HOMEPAGE_DESCRIPTION,
    images: ["/opengraph-image"],
  },
};

const features = [
  {
    icon: FileText,
    title: "Build accurate quotations",
    description:
      "Add reusable services, quantities, prices, discounts, and tax to a clear customer quote.",
  },
  {
    icon: Send,
    title: "Send a secure online quote",
    description:
      "Email a customer-ready link instead of managing changing Word documents and PDF attachments.",
  },
  {
    icon: LayoutDashboard,
    title: "Track every quote status",
    description:
      "See when a quote is sent, viewed, accepted, declined, or past its validity date.",
  },
];

const workflow = [
  {
    icon: Users,
    step: "01",
    title: "1. Add your customer",
    text: "Keep the contact and billing details needed for a professional quotation together.",
  },
  {
    icon: FileText,
    step: "02",
    title: "2. Create the quote",
    text: "Choose services, set quantities and prices, then calculate discount and tax consistently.",
  },
  {
    icon: Send,
    step: "03",
    title: "3. Send it online",
    text: "Share a secure customer link by email without attaching another version of the document.",
  },
  {
    icon: CheckCircle2,
    step: "04",
    title: "4. Get a decision",
    text: "The customer can view, accept, or decline while you follow the quote status from QuoteVia.",
  },
];

const businessTypes = [
  {
    icon: BriefcaseBusiness,
    title: "Freelancers and consultants",
    text: "Turn a discussed scope into a clear quotation while the opportunity is still warm.",
  },
  {
    icon: Building2,
    title: "Agencies and studios",
    text: "Quote repeatable services while keeping customer-specific scope and pricing visible.",
  },
  {
    icon: Hammer,
    title: "Trades and contractors",
    text: "Present labour, materials, quantities, tax, and the final amount in one online quote.",
  },
  {
    icon: Wrench,
    title: "Cleaning and maintenance teams",
    text: "Build consistent service quotes from a reusable catalog and track each customer response.",
  },
];

const questions = [
  {
    question: "What is an online quote tool?",
    answer:
      "An online quote tool helps a business prepare pricing, send a quotation through a secure link, and track the customer's response from one workspace.",
  },
  {
    question: "What happens after I send a quote?",
    answer:
      "QuoteVia emails the customer a secure link. You can see when the quote is viewed, and the customer can accept or decline it online.",
  },
  {
    question: "Can I include tax and discounts?",
    answer:
      "Yes. QuoteVia calculates line totals, quote-level discounts, tax, and the final amount using decimal-safe server-side calculations.",
  },
  {
    question: "Is QuoteVia suitable for South African businesses?",
    answer:
      "Yes. The current product supports South African rand pricing and is designed for small service businesses that need a practical quotation workflow.",
  },
];

const CONTACT_EMAIL = "hello@quotevia.co.za";

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-[#fbfbfc]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(homepageStructuredData),
        }}
      />

      <header className="sticky top-0 z-40 border-b bg-[#fbfbfc]/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo />
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-7 text-sm text-muted-foreground md:flex"
          >
            <a href="#features" className="hover:text-foreground">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-foreground">
              How it works
            </a>
            <a href="#for-businesses" className="hover:text-foreground">
              Who it is for
            </a>
            <a href="#questions" className="hover:text-foreground">
              Questions
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "ghost", size: "lg" }),
                "hidden sm:inline-flex",
              )}
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className={cn(buttonVariants({ size: "lg" }), "px-3")}
            >
              Create an account
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="surface-grid overflow-hidden border-b">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-18 sm:px-6 sm:py-24 lg:grid-cols-[1fr_0.95fr] lg:items-center lg:px-8 lg:py-28">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium shadow-xs">
                <Sparkles
                  className="size-3.5 text-blue-600"
                  aria-hidden="true"
                />
                Online quoting software for service businesses
              </div>
              <h1 className="mt-6 max-w-2xl text-4xl leading-[1.08] font-semibold tracking-[-0.035em] text-balance sm:text-5xl lg:text-6xl">
                Create Professional Quotes Online in Minutes
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                QuoteVia helps small service businesses create accurate customer
                quotations, send them through a secure online link, and track
                every view, acceptance, or decline. Keep pricing, tax,
                discounts, and quote status together instead of chasing Word
                files and PDF attachments.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/signup"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-11 px-5 text-sm",
                  )}
                >
                  Create your workspace
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/login"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "h-11 px-5 text-sm",
                  )}
                >
                  Log in to QuoteVia
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                {[
                  "Reusable service catalog",
                  "Secure customer links",
                  "Quote status tracking",
                ].map((item) => (
                  <span key={item} className="flex items-center gap-1.5">
                    <Check
                      className="size-3.5 text-emerald-600"
                      aria-hidden="true"
                    />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative lg:pl-6">
              <div className="absolute -inset-8 -z-10 rounded-full bg-blue-100/50 blur-3xl" />
              <Card
                className="overflow-hidden border-slate-200 shadow-xl shadow-slate-900/8"
                aria-label="Example customer quote"
              >
                <div className="flex items-center justify-between border-b bg-slate-950 px-5 py-4 text-white">
                  <div>
                    <p className="text-xs text-slate-400">QUOTE</p>
                    <p className="mt-1 text-sm font-semibold">QK-1048</p>
                  </div>
                  <StatusBadge status="Viewed" />
                </div>
                <CardContent className="p-0">
                  <div className="flex items-start justify-between gap-6 border-b p-5">
                    <div>
                      <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-white">
                        NS
                      </div>
                      <p className="mt-3 text-sm font-semibold">
                        Northstar Studio
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Brand and website refresh
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        Prepared for
                      </p>
                      <p className="mt-1 text-sm font-medium">Hart & Finch</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Expires 30 Sep 2026
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4 p-5">
                    {[
                      ["Brand strategy workshop", "R 8,500"],
                      ["Website design", "R 28,000"],
                      ["Copywriting", "R 8,400"],
                    ].map(([name, price]) => (
                      <div
                        key={name}
                        className="flex items-center justify-between gap-4 text-sm"
                      >
                        <span className="text-muted-foreground">{name}</span>
                        <span className="font-medium tabular-nums">
                          {price}
                        </span>
                      </div>
                    ))}
                    <div className="flex items-end justify-between border-t pt-4">
                      <span className="text-sm font-medium">
                        Total incl. VAT
                      </span>
                      <span className="text-2xl font-semibold tracking-tight tabular-nums">
                        R 51,635
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="absolute -right-2 -bottom-6 flex items-center gap-3 rounded-xl border bg-background p-3 shadow-lg sm:right-6">
                <span className="flex size-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                  <CheckCircle2 className="size-4.5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-medium">Quote viewed</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    Customer opened it 2m ago
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6 lg:px-8"
        >
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-primary">
              One practical quotation workflow
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance">
              Create and send quotes faster
            </h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              Move from customer details to a clear online quotation without
              rebuilding documents, copying totals, or wondering which version
              was sent.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="bg-background">
                  <CardContent className="p-6">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-5 font-semibold">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section
          id="how-it-works"
          className="scroll-mt-20 border-y bg-slate-950 text-white"
        >
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-blue-400">
                A clearer workflow
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                How QuoteVia works
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-400">
                Keep each step visible from the first customer conversation to a
                recorded decision.
              </p>
            </div>
            <ol className="mt-10 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
              {workflow.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.step} className="bg-slate-950 p-6">
                    <div className="flex items-center justify-between">
                      <Icon
                        className="size-5 text-blue-400"
                        aria-hidden="true"
                      />
                      <span className="font-mono text-xs text-slate-600">
                        {item.step}
                      </span>
                    </div>
                    <h3 className="mt-8 font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {item.text}
                    </p>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        <section
          id="for-businesses"
          className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6 lg:px-8"
        >
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-primary">
              Designed around service work
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Built for small service businesses
            </h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              QuoteVia is focused quoting software for businesses that sell
              expertise, labour, projects, and recurring services rather than
              complex inventory.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {businessTypes.map((business) => {
              const Icon = business.icon;
              return (
                <Card key={business.title} className="bg-background">
                  <CardContent className="p-6">
                    <Icon className="size-5 text-blue-700" aria-hidden="true" />
                    <h3 className="mt-5 font-semibold">{business.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {business.text}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section id="questions" className="scroll-mt-20 border-y bg-white">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-primary">
                Common questions
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Online quotation software questions
              </h2>
            </div>
            <div className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-2">
              {questions.map((item) => (
                <div key={item.question}>
                  <h3 className="font-semibold">{item.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-primary">
              Explore the quotation workflow
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Find the right starting point for your business
            </h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              Learn more about creating customer-ready quotes online and how
              QuoteVia fits the needs of South African service businesses.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/online-quote-maker"
              className="group rounded-xl border bg-background p-6 transition-colors hover:border-blue-300"
            >
              <p className="font-semibold">Online quote maker</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                See how to create, send, track, and collect a customer decision
                on a professional quote.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary">
                Explore the online quote maker
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
            </Link>
            <Link
              href="/quotation-software-south-africa"
              className="group rounded-xl border bg-background p-6 transition-colors hover:border-blue-300"
            >
              <p className="font-semibold">
                Quotation software for South Africa
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Explore a focused quoting workflow for local freelancers,
                agencies, contractors, trades, and service teams.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary">
                Explore South African quotation software
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
            </Link>
            <Link
              href="/free-quotation-template"
              className="group rounded-xl border bg-background p-6 transition-colors hover:border-blue-300"
            >
              <p className="font-semibold">Free quotation template</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Edit and print a complete professional quotation template, with
                guidance for validity, tax, terms, and acceptance.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary">
                Use the free template
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
            </Link>
          </div>
        </section>

        <section className="border-t bg-white">
          <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
            <p className="text-sm font-medium text-primary">Start simply</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Create your next professional quote with QuoteVia
            </h2>
            <p className="mx-auto mt-4 max-w-xl leading-7 text-muted-foreground">
              Set up a workspace, add a customer, and build a quotation with
              clear pricing and an online path to a decision.
            </p>
            <Link
              href="/signup"
              className={cn(
                buttonVariants({ size: "lg" }),
                "mt-7 h-11 px-5",
              )}
            >
              Create an account
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      <a
        href={`mailto:${CONTACT_EMAIL}`}
        aria-label={`Email QuoteVia at ${CONTACT_EMAIL}`}
        className="fixed right-4 bottom-4 z-30 inline-flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-1 ring-black/5 transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:right-6 sm:bottom-6 sm:h-11 sm:w-auto sm:gap-2 sm:px-4"
      >
        <Mail className="size-5" aria-hidden="true" />
        <span className="hidden text-sm font-medium sm:inline">Email us</span>
      </a>

      <footer className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <Logo />
            <p className="mt-2">
              Online quotation software for service businesses.
            </p>
          </div>
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-5">
            <Link href="/online-quote-maker" className="hover:text-foreground">
              Online quote maker
            </Link>
            <Link
              href="/quotation-software-south-africa"
              className="hover:text-foreground"
            >
              Quotation software South Africa
            </Link>
            <Link href="/login" className="hover:text-foreground">
              Log in
            </Link>
            <Link href="/signup" className="hover:text-foreground">
              Create an account
            </Link>
          </nav>
          <p>© 2026 QuoteVia · quotevia.co.za</p>
        </div>
      </footer>
    </div>
  );
}

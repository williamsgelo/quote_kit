import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  Check,
  CircleDollarSign,
  FileCheck2,
  FileText,
  Info,
  ListChecks,
  ReceiptText,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { EditableQuotationTemplate } from "@/components/marketing/editable-quotation-template";
import { PrintTemplateButton } from "@/components/marketing/print-template-button";
import { PublicPageFooter } from "@/components/marketing/public-page-footer";
import { PublicPageHeader } from "@/components/marketing/public-page-header";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SITE_NAME } from "@/lib/seo";
import { cn } from "@/lib/utils";

const title = "Free Quotation Template for Small Businesses";
const description =
  "Use this free editable quotation template for a professional small-business quote, with line items, totals, VAT or tax, terms, and acceptance fields.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/free-quotation-template",
  },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: "/free-quotation-template",
    siteName: SITE_NAME,
    title: `${title} | ${SITE_NAME}`,
    description,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Free QuoteVia quotation template for small businesses",
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

const quotationSections = [
  {
    icon: Building2,
    title: "Your business details",
    text: "Add the business name, contact details, and any registration or VAT information that is relevant to your business.",
  },
  {
    icon: UserRound,
    title: "Customer details",
    text: "Identify the person or company receiving the quote, with useful contact and address information.",
  },
  {
    icon: FileText,
    title: "Quote reference and dates",
    text: "Use a unique quotation number, an issue date, and a clearly stated expiry or validity date.",
  },
  {
    icon: ListChecks,
    title: "Scope and line items",
    text: "Describe each service or product, then show its quantity, unit price, and line amount.",
  },
  {
    icon: CircleDollarSign,
    title: "Commercial totals",
    text: "Show the subtotal, any discount, applicable tax or VAT, and the final total in a consistent currency.",
  },
  {
    icon: ShieldCheck,
    title: "Terms and acceptance",
    text: "Explain important payment, lead-time, scope, and acceptance conditions before work begins.",
  },
];

const validityOptions = [
  {
    period: "7 days",
    use: "Useful when material costs, availability, or scheduling may change quickly.",
  },
  {
    period: "14 days",
    use: "A practical middle ground for many routine service quotations.",
  },
  {
    period: "30 days",
    use: "Useful where pricing is stable and customers need a longer approval process.",
  },
];

// Add /free-quotation-generator here only when that route and functionality exist.
const relatedResources = [
  {
    href: "/",
    title: "QuoteVia home",
    text: "See the complete create, send, track, and approval workflow.",
  },
  {
    href: "/online-quote-maker",
    title: "Online quote maker",
    text: "Learn how online quoting replaces repeated document and email admin.",
  },
  {
    href: "/quotation-software-south-africa",
    title: "Quotation software South Africa",
    text: "Explore QuoteVia for local service businesses working in rand.",
  },
];

export default function FreeQuotationTemplatePage() {
  return (
    <div className="min-h-dvh bg-[#fbfbfc]">
      <PublicPageHeader />

      <main>
        <section className="surface-grid border-b print:hidden">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-18 sm:px-6 sm:py-24 lg:grid-cols-[1fr_0.72fr] lg:items-center lg:px-8 lg:py-28">
            <div>
              <p className="text-sm font-medium text-primary">
                Free, editable, and ready to print
              </p>
              <h1 className="mt-4 max-w-4xl text-4xl leading-[1.08] font-semibold tracking-[-0.035em] text-balance sm:text-5xl lg:text-6xl">
                Free Quotation Template for Small Businesses
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Use this professional quotation template to organise customer
                details, line items, pricing, validity, terms, and acceptance.
                Edit the highlighted fields directly on this page, then print
                the result or save it as a PDF—no account required.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="#quotation-template"
                  className={cn(buttonVariants({ size: "lg" }), "h-11 px-5")}
                >
                  Use the free template
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  href="#quotation-guide"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "h-11 px-5",
                  )}
                >
                  Read the quotation guide
                </Link>
              </div>
            </div>

            <Card className="border-slate-200 bg-background shadow-xl shadow-slate-900/8">
              <CardContent className="p-6 sm:p-8">
                <FileCheck2 className="size-7 text-blue-700" aria-hidden="true" />
                <h2 className="mt-5 text-xl font-semibold">
                  Useful before you sign up
                </h2>
                <ul className="mt-5 space-y-3 text-sm leading-6 text-muted-foreground">
                  {[
                    "Edit every highlighted template field",
                    "Use a complete quotation structure",
                    "Print a clean customer copy",
                    "Save a local PDF through your browser",
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
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

        <section className="quotation-print-area bg-slate-100 px-4 py-16 sm:px-6 lg:px-8 print:bg-white">
          <div className="mx-auto mb-8 flex max-w-4xl flex-col gap-5 sm:flex-row sm:items-end sm:justify-between print:hidden">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-primary">Your editable template</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Click the highlighted fields to replace the example text
              </h2>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                Calculate and enter totals manually, then print when ready. Your
                edits stay only in this browser tab and are not sent to or
                stored by QuoteVia.
              </p>
            </div>
            <PrintTemplateButton />
          </div>

          <EditableQuotationTemplate />

          <div className="mx-auto mt-6 max-w-4xl rounded-xl border bg-background p-4 text-sm leading-6 text-muted-foreground print:hidden">
            <div className="flex gap-3">
              <Info className="mt-0.5 size-5 shrink-0 text-blue-700" aria-hidden="true" />
              <p>
                In the print window, choose your printer or select
                <strong className="font-semibold text-foreground">
                  {" "}Save as PDF
                </strong>
                . The resulting file is saved by your browser to the location
                you choose; QuoteVia does not upload or keep it.
              </p>
            </div>
          </div>
        </section>

        <section
          id="quotation-guide"
          className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6 lg:px-8 print:hidden"
        >
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-primary">Quotation checklist</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              What a professional quotation should include
            </h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              A useful quote makes it easy for the customer to understand who
              is quoting, what is included, what it costs, how long the price is
              valid, and what happens next.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quotationSections.map((item) => {
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

        <section className="border-y bg-white print:hidden">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <div className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <CalendarDays className="size-5" aria-hidden="true" />
                </div>
                <h2 className="mt-5 text-3xl font-semibold tracking-tight">
                  How long should a quotation remain valid?
                </h2>
                <p className="mt-4 leading-7 text-muted-foreground">
                  There is no single validity period that suits every business.
                  Choose a period that reflects price stability, supplier costs,
                  workload, and how long you can reasonably hold the quoted
                  terms. Always state the expiry date clearly.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {validityOptions.map((option) => (
                  <article key={option.period} className="rounded-xl border p-5">
                    <p className="text-lg font-semibold text-primary">
                      {option.period}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {option.use}
                    </p>
                  </article>
                ))}
              </div>
            </div>
            <p className="mt-8 rounded-xl bg-slate-100 p-4 text-sm leading-6 text-muted-foreground">
              These periods are practical examples, not rules. Adjust the
              validity period to suit the quote, your commercial terms, and any
              professional or contractual requirements that apply.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 print:hidden">
          <article>
            <p className="text-sm font-medium text-primary">Tax and VAT fields</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Show tax separately when it applies
            </h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              A quotation should make the relationship between the subtotal,
              discount, tax or VAT, and final total easy to follow. If tax
              applies, state whether line prices include or exclude it and show
              the amount consistently.
            </p>
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
              <p className="font-semibold">Important</p>
              <p className="mt-1">
                This template does not determine whether your business must
                charge VAT or which rate applies. Use the field only when
                appropriate and confirm your obligations with SARS guidance or
                a qualified tax professional. This is general template guidance,
                not tax or legal advice.
              </p>
            </div>
          </article>

          <article>
            <p className="text-sm font-medium text-primary">Quotation vs invoice</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Similar details, different purpose
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border bg-background p-5">
                <FileText className="size-5 text-blue-700" aria-hidden="true" />
                <h3 className="mt-4 font-semibold">Quotation</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Sets out proposed scope, pricing, validity, and terms before
                  the customer decides whether to proceed. It is not itself a
                  request for payment.
                </p>
              </div>
              <div className="rounded-xl border bg-background p-5">
                <ReceiptText className="size-5 text-blue-700" aria-hidden="true" />
                <h3 className="mt-4 font-semibold">Invoice</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Requests payment for agreed or supplied work and normally
                  includes payment instructions and a due date.
                </p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-6 text-muted-foreground">
              Your contracts, industry, and local requirements may affect when
              each document is issued and what it must contain.
            </p>
          </article>
        </section>

        <section className="border-y bg-slate-950 text-white print:hidden">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-medium text-blue-400">
                When a reusable template is no longer enough
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Create, send, and track quotations with QuoteVia
              </h2>
              <p className="mt-4 leading-7 text-slate-400">
                Templates are useful when you are getting started. If you send
                quotations regularly, QuoteVia lets you create them online,
                email secure customer links, track when they are viewed, and
                collect accept or decline responses.
              </p>
            </div>
            <Link
              href="/signup"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 bg-white px-5 text-slate-950 hover:bg-slate-200",
              )}
            >
              Create your first quote
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 print:hidden">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-primary">Related resources</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Learn more about online quotations
            </h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {relatedResources.map((resource) => (
              <Link
                key={resource.href}
                href={resource.href}
                className="group rounded-xl border bg-background p-6 transition-colors hover:border-blue-300"
              >
                <h3 className="font-semibold">{resource.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {resource.text}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary">
                  Read more
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <PublicPageFooter />
    </div>
  );
}

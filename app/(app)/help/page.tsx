import Link from "next/link";
import { ArrowRight, CircleHelp, Mail } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSupportEmail } from "@/lib/support";

const steps = [
  "Create your organisation during onboarding.",
  "Add a customer with an email address.",
  "Add reusable products or services to the catalog.",
  "Create and save a draft quote.",
  "Send the quote by email or share its secure public link.",
  "Track when the customer views, accepts, or declines it.",
];

const questions = [
  {
    question: "Why can’t I edit a sent quote?",
    answer:
      "Sending freezes the customer and pricing snapshot so the quote the customer received stays unchanged. Only draft quotes can be edited.",
  },
  {
    question: "How does a customer receive a quote?",
    answer:
      "QuoteKit emails the customer a secure View quote link when you use Send quote. You can also copy the same link from the quote detail page.",
  },
  {
    question: "Does the customer need a QuoteKit account?",
    answer:
      "No. The secure public link opens the customer-facing quote without login.",
  },
  {
    question: "How do I resend or share the public link?",
    answer:
      "Open the sent quote and use Copy public link. Automatic email resending is not included in the MVP.",
  },
  {
    question: "What happens when a quote expires?",
    answer:
      "The quote remains readable, but it can no longer be accepted. The customer can still decline it, and your internal activity remains available.",
  },
];

export default function HelpPage() {
  const supportEmail = getSupportEmail();
  const supportHref = `mailto:${supportEmail}?subject=${encodeURIComponent(
    "QuoteKit support request",
  )}`;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Help & support"
        description="A practical guide to the QuoteKit private-pilot workflow."
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Getting started</CardTitle>
            <CardDescription>
              Follow the core workflow from setup to customer response.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              {steps.map((step, index) => (
                <li key={step} className="flex items-start gap-3 text-sm">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {index + 1}
                  </span>
                  <span className="pt-0.5 leading-6">{step}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quote statuses</CardTitle>
            <CardDescription>What each customer quote state means.</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4 text-sm">
              <div>
                <dt><StatusBadge status="DRAFT" /></dt>
                <dd className="mt-1.5 text-muted-foreground">Saved internally and still editable.</dd>
              </div>
              <div>
                <dt><StatusBadge status="SENT" /></dt>
                <dd className="mt-1.5 text-muted-foreground">Email delivery succeeded and the secure link is active.</dd>
              </div>
              <div>
                <dt><StatusBadge status="VIEWED" /></dt>
                <dd className="mt-1.5 text-muted-foreground">The secure public quote has been opened.</dd>
              </div>
              <div>
                <dt><StatusBadge status="ACCEPTED" /></dt>
                <dd className="mt-1.5 text-muted-foreground">The customer accepted the quote. This response is final.</dd>
              </div>
              <div>
                <dt><StatusBadge status="DECLINED" /></dt>
                <dd className="mt-1.5 text-muted-foreground">The customer declined the quote. This response is final.</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Common questions</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-x-8 gap-y-6 md:grid-cols-2">
            {questions.map((item) => (
              <div key={item.question}>
                <dt className="text-sm font-semibold">{item.question}</dt>
                <dd className="mt-1.5 text-sm leading-6 text-muted-foreground">
                  {item.answer}
                </dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      <Card className="border-blue-200 bg-blue-50/40">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-700 shadow-xs">
              <CircleHelp className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-semibold">Still need help?</h2>
              <p className="mt-1 break-words text-sm text-muted-foreground">
                Email {supportEmail} and include the quote number when relevant.
              </p>
            </div>
          </div>
          <Link href={supportHref} className={buttonVariants()}>
            <Mail className="size-4" aria-hidden="true" />
            Contact support
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

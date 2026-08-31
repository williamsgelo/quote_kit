import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  FileText,
  LayoutDashboard,
  Send,
  Sparkles,
  Users,
} from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { StatusBadge } from "@/components/shared/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: FileText,
    title: "Polished quotes, quickly",
    description:
      "Turn reusable products and services into clear, professional quotes in minutes.",
  },
  {
    icon: Users,
    title: "Customers stay organised",
    description:
      "Keep contact details, quote history, and the next step together in one workspace.",
  },
  {
    icon: LayoutDashboard,
    title: "Know what’s moving",
    description:
      "See when quotes are sent, viewed, accepted, or need your attention at a glance.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-[#fbfbfc]">
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
            <a href="#pricing" className="hover:text-foreground">
              Pricing
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
              Start free
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
                Simple quoting for growing teams
              </div>
              <h1 className="mt-6 max-w-2xl text-4xl leading-[1.08] font-semibold tracking-[-0.035em] text-balance sm:text-5xl lg:text-6xl">
                Turn good conversations into accepted work.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                QuoteKit helps service businesses create polished quotes, follow
                every opportunity, and give customers an easy path to yes.
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
                  href="/dashboard"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "h-11 px-5 text-sm",
                  )}
                >
                  Log in to your workspace
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                {["No credit card", "Set up in minutes", "Cancel anytime"].map(
                  (item) => (
                    <span key={item} className="flex items-center gap-1.5">
                      <Check
                        className="size-3.5 text-emerald-600"
                        aria-hidden="true"
                      />
                      {item}
                    </span>
                  ),
                )}
              </div>
            </div>

            <div className="relative lg:pl-6">
              <div className="absolute -inset-8 -z-10 rounded-full bg-blue-100/50 blur-3xl" />
              <Card className="overflow-hidden border-slate-200 shadow-xl shadow-slate-900/8">
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
                      <p className="text-xs text-muted-foreground">Prepared for</p>
                      <p className="mt-1 text-sm font-medium">Hart & Finch</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Expires 11 Aug 2026
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
                        <span className="font-medium">{price}</span>
                      </div>
                    ))}
                    <div className="flex items-end justify-between border-t pt-4">
                      <span className="text-sm font-medium">Total incl. VAT</span>
                      <span className="text-2xl font-semibold tracking-tight">
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
                    Amelia opened it 2m ago
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
        >
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-primary">Everything in reach</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance">
              Less admin between the work you win and the work you do.
            </h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              A focused workspace for the moments that matter before a project
              begins.
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

        <section id="how-it-works" className="border-y bg-slate-950 text-white">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
              <div>
                <p className="text-sm font-medium text-blue-400">
                  A clearer workflow
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                  From first draft to accepted.
                </h2>
                <p className="mt-4 max-w-md text-sm leading-6 text-slate-400">
                  QuoteKit keeps each step visible, so you always know what to do
                  next.
                </p>
              </div>
              <ol className="grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-3">
                {[
                  {
                    icon: FileText,
                    step: "01",
                    title: "Build",
                    text: "Choose a customer, add your items, and tailor the scope.",
                  },
                  {
                    icon: Send,
                    step: "02",
                    title: "Send",
                    text: "Share a polished customer-ready quote in a few clicks.",
                  },
                  {
                    icon: Clock3,
                    step: "03",
                    title: "Follow",
                    text: "See activity and keep the right opportunity moving.",
                  },
                ].map((item) => {
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
          </div>
        </section>

        <section
          id="pricing"
          className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8"
        >
          <p className="text-sm font-medium text-primary">Start simply</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Make your next quote your best one.
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-7 text-muted-foreground">
            Create a workspace and build your first customer quote in minutes.
          </p>
          <Link
            href="/signup"
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-7 h-11 px-5",
            )}
          >
            Start free
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <Logo />
          <p>© 2026 QuoteKit. Built for better business.</p>
        </div>
      </footer>
    </div>
  );
}

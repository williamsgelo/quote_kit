import Link from "next/link";
import { ArrowRight, Check, ImagePlus } from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const selectStyles =
  "h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20";

export default function OnboardingPage() {
  return (
    <main className="min-h-dvh bg-slate-50">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex size-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <Check className="size-3" aria-hidden="true" />
            </span>
            Account created
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-sm font-medium text-primary">One last step</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            Tell us about your business
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            We’ll use these details to shape your workspace and prepare your
            quote templates.
          </p>
        </div>

        <Card className="mt-8">
          <CardContent className="p-5 sm:p-7">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <label
                  htmlFor="onboarding-business"
                  className="text-sm font-medium"
                >
                  Business name
                </label>
                <Input
                  id="onboarding-business"
                  placeholder="e.g. Northstar Studio"
                  autoFocus
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="industry" className="text-sm font-medium">
                  Industry
                </label>
                <select
                  id="industry"
                  defaultValue=""
                  className={selectStyles}
                >
                  <option value="" disabled>
                    Select an industry
                  </option>
                  <option>Creative services</option>
                  <option>Consulting</option>
                  <option>Construction & trades</option>
                  <option>Technology</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="team-size" className="text-sm font-medium">
                  Team size
                </label>
                <select
                  id="team-size"
                  defaultValue="1-5"
                  className={selectStyles}
                >
                  <option value="1-5">1–5 people</option>
                  <option value="6-20">6–20 people</option>
                  <option value="21-50">21–50 people</option>
                  <option value="51+">51+ people</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="onboarding-email"
                  className="text-sm font-medium"
                >
                  Business email{" "}
                  <span className="font-normal text-muted-foreground">
                    (optional)
                  </span>
                </label>
                <Input
                  id="onboarding-email"
                  type="email"
                  placeholder="hello@company.com"
                />
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="onboarding-phone"
                  className="text-sm font-medium"
                >
                  Phone number{" "}
                  <span className="font-normal text-muted-foreground">
                    (optional)
                  </span>
                </label>
                <Input
                  id="onboarding-phone"
                  type="tel"
                  placeholder="+27 00 000 0000"
                />
              </div>
              <div className="sm:col-span-2">
                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-xl border border-dashed bg-muted/15 p-4 text-left transition-colors hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-background shadow-xs">
                    <ImagePlus
                      className="size-4.5 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </span>
                  <span>
                    <span className="block text-sm font-medium">
                      Add your logo{" "}
                      <span className="font-normal text-muted-foreground">
                        (optional)
                      </span>
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      You can always do this later in settings
                    </span>
                  </span>
                </button>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="mt-7 flex h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              Create workspace
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </CardContent>
        </Card>
        <p className="mt-5 text-center text-xs text-muted-foreground">
          You can update all business details later in Settings.
        </p>
      </div>
    </main>
  );
}

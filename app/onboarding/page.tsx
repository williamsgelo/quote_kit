import type { Metadata } from "next";
import { Check } from "lucide-react";
import { redirect } from "next/navigation";

import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import { Logo } from "@/components/shared/logo";
import { requireUser } from "@/lib/auth/access";
import { getActiveOrganizationMembership } from "@/lib/auth/organization";
import { NO_INDEX_ROBOTS } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Set up your business",
  robots: NO_INDEX_ROBOTS,
};

export default async function OnboardingPage() {
  const user = await requireUser({ callbackUrl: "/onboarding" });
  const activeMembership = await getActiveOrganizationMembership(user.id);

  if (activeMembership) {
    redirect("/dashboard");
  }

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
            Choose the business name customers should see on your quotes.
          </p>
        </div>

        <OnboardingForm />

        <p className="mt-5 text-center text-xs text-muted-foreground">
          You can start adding customers and catalog items as soon as your
          workspace is ready.
        </p>
      </div>
    </main>
  );
}

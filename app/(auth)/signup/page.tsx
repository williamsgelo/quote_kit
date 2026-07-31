import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { Input } from "@/components/ui/input";

export default function SignupPage() {
  return (
    <div className="w-full">
      <p className="text-sm font-medium text-primary">Get started</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        Create your account
      </h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Set up your QuoteKit workspace in just a few minutes.
      </p>

      <div className="mt-8 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="first-name" className="text-sm font-medium">
              First name
            </label>
            <Input
              id="first-name"
              placeholder="Gabriel"
              autoComplete="given-name"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="last-name" className="text-sm font-medium">
              Last name
            </label>
            <Input
              id="last-name"
              placeholder="Mokoena"
              autoComplete="family-name"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="signup-email" className="text-sm font-medium">
            Work email
          </label>
          <Input
            id="signup-email"
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="signup-password" className="text-sm font-medium">
            Password
          </label>
          <Input
            id="signup-password"
            type="password"
            placeholder="At least 8 characters"
            autoComplete="new-password"
          />
          <p className="flex items-center gap-1.5 pt-1 text-xs text-muted-foreground">
            <Check className="size-3.5 text-emerald-600" aria-hidden="true" />
            Use 8 or more characters
          </p>
        </div>
        <Link
          href="/onboarding"
          className="flex h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Create account
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>

      <p className="mt-5 text-xs leading-5 text-muted-foreground">
        By continuing, you agree to the QuoteKit Terms of Service and Privacy
        Policy.
      </p>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}

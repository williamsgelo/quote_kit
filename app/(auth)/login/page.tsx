import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Input } from "@/components/ui/input";

export default function LoginPage() {
  return (
    <div className="w-full">
      <p className="text-sm font-medium text-primary">Welcome back</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        Log in to QuoteKit
      </h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Pick up where you left off and keep your quotes moving.
      </p>

      <div className="mt-8 space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            Email address
          </label>
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
          />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <button
              type="button"
              className="text-xs font-medium text-primary hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
          />
        </div>
        <Link
          href="/dashboard"
          className="flex h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Log in
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>

      <p className="mt-7 text-center text-sm text-muted-foreground">
        New to QuoteKit?{" "}
        <Link href="/signup" className="font-medium text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}

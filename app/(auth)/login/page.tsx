import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { getAuthenticatedAppPath } from "@/lib/auth/access";
import { getSafeRedirectPath } from "@/lib/auth/redirect";

export const metadata: Metadata = {
  title: "Log in",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    callbackUrl?: string | string[];
    registered?: string | string[];
  }>;
}) {
  const authenticatedAppPath = await getAuthenticatedAppPath();

  if (authenticatedAppPath) {
    redirect(authenticatedAppPath);
  }

  const params = await searchParams;
  const callbackUrl = getSafeRedirectPath(
    typeof params.callbackUrl === "string" ? params.callbackUrl : undefined,
  );
  const registrationSucceeded = params.registered === "1";

  return (
    <div className="w-full">
      <p className="text-sm font-medium text-primary">Welcome back</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        Log in to QuoteVia
      </h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Pick up where you left off and keep your quotes moving.
      </p>

      <LoginForm
        callbackUrl={callbackUrl}
        registrationSucceeded={registrationSucceeded}
      />

      <p className="mt-7 text-center text-sm text-muted-foreground">
        New to QuoteVia?{" "}
        <Link href="/signup" className="font-medium text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}

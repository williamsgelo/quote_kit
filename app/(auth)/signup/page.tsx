import Link from "next/link";
import { redirect } from "next/navigation";

import { SignupForm } from "@/components/auth/signup-form";
import { getAuthenticatedAppPath } from "@/lib/auth/access";

export default async function SignupPage() {
  const authenticatedAppPath = await getAuthenticatedAppPath();

  if (authenticatedAppPath) {
    redirect(authenticatedAppPath);
  }

  return (
    <div className="w-full">
      <p className="text-sm font-medium text-primary">Get started</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        Create your account
      </h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Set up your QuoteKit workspace in just a few minutes.
      </p>

      <SignupForm />

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

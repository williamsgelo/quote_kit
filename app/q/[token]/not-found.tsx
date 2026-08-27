import Link from "next/link";

import { Logo } from "@/components/shared/logo";
import { buttonVariants } from "@/components/ui/button";

export default function PublicQuoteNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md text-center">
        <Logo href="/" className="mx-auto justify-center" />
        <h1 className="mt-8 text-2xl font-semibold">Quote unavailable</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          This public quote link is invalid, inactive, or no longer available.
        </p>
        <Link href="/" className={`${buttonVariants()} mt-6`}>
          Return to QuoteKit
        </Link>
      </div>
    </main>
  );
}

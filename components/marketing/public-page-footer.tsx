import Link from "next/link";

import { Logo } from "@/components/shared/logo";

export function PublicPageFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 text-sm text-muted-foreground sm:px-6 md:grid-cols-[1fr_auto] md:items-end lg:px-8">
        <div>
          <Logo />
          <p className="mt-2 max-w-md leading-6">
            Online quotation software for South African service businesses.
          </p>
        </div>
        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap gap-x-5 gap-y-3 md:justify-end"
        >
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <Link href="/online-quote-maker" className="hover:text-foreground">
            Online quote maker
          </Link>
          <Link
            href="/quotation-software-south-africa"
            className="hover:text-foreground"
          >
            Quotation software South Africa
          </Link>
          <Link href="/signup" className="hover:text-foreground">
            Create an account
          </Link>
        </nav>
      </div>
      <div className="border-t">
        <p className="mx-auto max-w-7xl px-4 py-5 text-xs text-muted-foreground sm:px-6 lg:px-8">
          © 2026 QuoteVia · quotevia.co.za
        </p>
      </div>
    </footer>
  );
}

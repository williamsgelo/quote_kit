import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const acquisitionLinks = [
  { href: "/", label: "Home" },
  { href: "/online-quote-maker", label: "Online quote maker" },
  {
    href: "/quotation-software-south-africa",
    label: "For South Africa",
  },
  { href: "/free-quotation-template", label: "Free template" },
];

export function PublicPageHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-[#fbfbfc]/90 backdrop-blur print:hidden">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-6 text-sm text-muted-foreground lg:flex"
        >
          {acquisitionLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-foreground">
              {link.label}
            </Link>
          ))}
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
            Create an account
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </header>
  );
}

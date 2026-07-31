import Link from "next/link";
import { FileCheck2 } from "lucide-react";

import { cn } from "@/lib/utils";

export function Logo({
  compact = false,
  className,
  href = "/",
}: {
  compact?: boolean;
  className?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      aria-label="QuoteKit home"
      className={cn(
        "inline-flex items-center gap-2 font-semibold tracking-tight",
        className,
      )}
    >
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
        <FileCheck2 className="size-4.5" aria-hidden="true" />
      </span>
      {!compact && <span className="text-lg">QuoteKit</span>}
    </Link>
  );
}

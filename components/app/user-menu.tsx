import Link from "next/link";
import { ChevronDown, CircleHelp, LogOut, Settings } from "lucide-react";

import { cn } from "@/lib/utils";

export function UserMenu({ compact = false }: { compact?: boolean }) {
  return (
    <details className="group relative">
      <summary
        aria-label="Open user menu"
        className={cn(
          "flex cursor-pointer list-none items-center rounded-lg outline-none transition-colors marker:hidden hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden",
          compact ? "gap-2 p-1" : "w-full gap-2.5 p-2",
        )}
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
          GM
        </span>
        {!compact && (
          <>
            <span className="min-w-0 flex-1 text-left">
              <span className="block truncate text-xs font-medium">
                Gabriel Mokoena
              </span>
              <span className="block truncate text-[11px] text-muted-foreground">
                Owner
              </span>
            </span>
            <ChevronDown
              className="size-3.5 text-muted-foreground transition-transform group-open:rotate-180"
              aria-hidden="true"
            />
          </>
        )}
      </summary>
      <div
        className={cn(
          "absolute z-50 w-52 rounded-lg border bg-popover p-1 text-popover-foreground shadow-lg",
          compact ? "top-11 right-0" : "right-0 bottom-12 left-0",
        )}
      >
        <div className="border-b px-2 py-2">
          <p className="text-xs font-medium">Gabriel Mokoena</p>
          <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
            gabriel@northstar.co.za
          </p>
        </div>
        <Link
          href="/settings"
          className="mt-1 flex items-center gap-2 rounded-md px-2 py-2 text-xs hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Settings className="size-3.5" aria-hidden="true" />
          Account settings
        </Link>
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-xs hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <CircleHelp className="size-3.5" aria-hidden="true" />
          Help & support
        </button>
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-xs text-destructive hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <LogOut className="size-3.5" aria-hidden="true" />
          Sign out
        </button>
      </div>
    </details>
  );
}

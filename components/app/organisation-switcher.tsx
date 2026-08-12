import { Building2, Check, ChevronsUpDown, Plus } from "lucide-react";

import { cn } from "@/lib/utils";

export function OrganisationSwitcher({
  name,
  inverted = false,
}: {
  name: string;
  inverted?: boolean;
}) {
  const initial = name.trim().charAt(0).toUpperCase() || "O";

  return (
    <details className="group relative">
      <summary
        className={cn(
          "flex h-10 cursor-pointer list-none items-center gap-2 rounded-lg border px-2.5 text-left text-sm transition-colors marker:hidden [&::-webkit-details-marker]:hidden",
          inverted
            ? "border-white/10 bg-white/5 text-white hover:bg-white/10"
            : "bg-background hover:bg-muted",
        )}
      >
        <span
          className={cn(
            "flex size-6 shrink-0 items-center justify-center rounded-md",
            inverted ? "bg-white text-slate-950" : "bg-primary text-white",
          )}
        >
          <Building2 className="size-3.5" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-xs font-medium">
            {name}
          </span>
          <span
            className={cn(
              "block truncate text-[10px]",
              inverted ? "text-slate-400" : "text-muted-foreground",
            )}
          >
            Business workspace
          </span>
        </span>
        <ChevronsUpDown className="size-3.5 opacity-60" aria-hidden="true" />
      </summary>
      <div className="absolute right-0 bottom-12 left-0 z-50 rounded-lg border bg-popover p-1 text-popover-foreground shadow-lg">
        <p className="px-2 py-1.5 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
          Workspaces
        </p>
        <button
          type="button"
          disabled
          className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-xs hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="flex size-6 items-center justify-center rounded bg-primary text-white">
            {initial}
          </span>
          <span className="flex-1 truncate font-medium">{name}</span>
          <Check className="size-3.5 text-primary" aria-hidden="true" />
        </button>
        <button
          type="button"
          disabled
          title="Additional workspaces are not available yet"
          className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-xs text-muted-foreground opacity-60"
        >
          <Plus className="size-4" aria-hidden="true" />
          Create workspace
        </button>
      </div>
    </details>
  );
}

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function TableShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border bg-card shadow-xs",
        className,
      )}
    >
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export const tableStyles = {
  table: "w-full min-w-180 text-left text-sm",
  header: "border-b bg-muted/35 text-xs font-medium text-muted-foreground",
  heading: "h-11 px-4 font-medium whitespace-nowrap",
  row: "border-b transition-colors last:border-b-0 hover:bg-muted/25",
  cell: "px-4 py-3.5 align-middle whitespace-nowrap",
};

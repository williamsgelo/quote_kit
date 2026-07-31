import { Circle } from "lucide-react";

import type { QuoteStatus } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const styles: Record<QuoteStatus, string> = {
  Draft: "border-slate-200 bg-slate-50 text-slate-700",
  Sent: "border-blue-200 bg-blue-50 text-blue-700",
  Viewed: "border-violet-200 bg-violet-50 text-violet-700",
  Accepted: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Rejected: "border-rose-200 bg-rose-50 text-rose-700",
  Expired: "border-amber-200 bg-amber-50 text-amber-800",
};

export function StatusBadge({
  status,
  className,
}: {
  status: QuoteStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium",
        styles[status],
        className,
      )}
    >
      <Circle className="size-1.5 fill-current" aria-hidden="true" />
      {status}
    </span>
  );
}

import { Circle } from "lucide-react";

import { cn } from "@/lib/utils";

type StatusValue =
  | "DRAFT"
  | "SENT"
  | "VIEWED"
  | "ACCEPTED"
  | "DECLINED"
  | "EXPIRED"
  | "CANCELLED";

type DisplayStatus =
  | StatusValue
  | "Draft"
  | "Sent"
  | "Viewed"
  | "Accepted"
  | "Rejected"
  | "Expired"
  | "Cancelled";

const styles: Record<StatusValue, string> = {
  DRAFT: "border-slate-200 bg-slate-50 text-slate-700",
  SENT: "border-blue-200 bg-blue-50 text-blue-700",
  VIEWED: "border-violet-200 bg-violet-50 text-violet-700",
  ACCEPTED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  DECLINED: "border-rose-200 bg-rose-50 text-rose-700",
  EXPIRED: "border-amber-200 bg-amber-50 text-amber-800",
  CANCELLED: "border-slate-300 bg-slate-100 text-slate-600",
};

function normalizedStatus(status: DisplayStatus): StatusValue {
  if (status === "Rejected") {
    return "DECLINED";
  }
  return status.toUpperCase() as StatusValue;
}

function statusLabel(status: StatusValue) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

export function StatusBadge({
  status,
  className,
}: {
  status: DisplayStatus;
  className?: string;
}) {
  const normalized = normalizedStatus(status);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        styles[normalized],
        className,
      )}
    >
      <Circle className="size-1.5 fill-current" aria-hidden="true" />
      {statusLabel(normalized)}
    </span>
  );
}

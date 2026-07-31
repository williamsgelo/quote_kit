import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  change,
  icon: Icon,
  iconClassName,
}: {
  label: string;
  value: string;
  change: string;
  icon: LucideIcon;
  iconClassName?: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
          </div>
          <div
            className={cn(
              "flex size-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700",
              iconClassName,
            )}
          >
            <Icon className="size-4.5" aria-hidden="true" />
          </div>
        </div>
        <p className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
          <ArrowUpRight
            className="size-3.5 text-emerald-600"
            aria-hidden="true"
          />
          {change}
        </p>
      </CardContent>
    </Card>
  );
}

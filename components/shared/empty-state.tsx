import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  actionHref,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: string;
  actionHref?: string;
}) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 px-6 py-12 text-center">
      <div className="flex size-11 items-center justify-center rounded-xl border bg-background shadow-xs">
        <Icon className="size-5 text-muted-foreground" aria-hidden="true" />
      </div>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
        {description}
      </p>
      {action && actionHref ? (
        <Link href={actionHref} className={`${buttonVariants()} mt-5`}>
          {action}
        </Link>
      ) : action ? (
        <Button type="button" className="mt-5">
          {action}
        </Button>
      ) : null}
    </div>
  );
}

import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ErrorState({
  onRetry,
}: {
  onRetry?: () => void;
}) {
  return (
    <div className="flex min-h-[55vh] items-center justify-center">
      <div className="max-w-md text-center">
        <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
          <AlertTriangle className="size-5" aria-hidden="true" />
        </div>
        <h1 className="mt-4 text-xl font-semibold">
          We couldn&apos;t load this page
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Something unexpected happened. Your data is safe—try loading the page
          again.
        </p>
        {onRetry && (
          <Button type="button" className="mt-5" onClick={onRetry}>
            Try again
          </Button>
        )}
      </div>
    </div>
  );
}

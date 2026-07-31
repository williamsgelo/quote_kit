import Link from "next/link";
import { FileQuestion } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function QuoteNotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center text-center">
      <div>
        <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <FileQuestion className="size-5" aria-hidden="true" />
        </div>
        <h1 className="mt-4 text-xl font-semibold">Quote not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This quote may have been removed or the link may be incorrect.
        </p>
        <Link
          href="/quotes"
          className={cn(buttonVariants(), "mt-5")}
        >
          Back to quotes
        </Link>
      </div>
    </div>
  );
}

"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Check, Copy, ExternalLink, Loader2, Mail } from "lucide-react";

import {
  sendQuoteAction,
  type QuoteDeliveryActionState,
} from "@/app/(app)/quotes/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const INITIAL_STATE: QuoteDeliveryActionState = { status: "idle" };

export function QuoteDeliveryActions({
  quoteId,
  canSend,
  initialPublicUrl,
}: {
  quoteId: string;
  canSend: boolean;
  initialPublicUrl: string | null;
}) {
  const [state, action, pending] = useActionState(
    sendQuoteAction.bind(null, quoteId),
    INITIAL_STATE,
  );
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">(
    "idle",
  );
  const publicUrl = state.publicUrl ?? initialPublicUrl;

  async function copyPublicUrl() {
    if (!publicUrl) return;
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopyStatus("copied");
      window.setTimeout(() => setCopyStatus("idle"), 2_000);
    } catch {
      setCopyStatus("error");
    }
  }

  return (
    <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:items-end">
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
        {canSend && (
          <form action={action}>
            <Button type="submit" size="lg" className="h-9" disabled={pending}>
              {pending ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Mail className="size-4" aria-hidden="true" />
              )}
              {pending ? "Sending…" : "Send quote"}
            </Button>
          </form>
        )}

        {publicUrl && (
          <>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-9"
              onClick={copyPublicUrl}
            >
              {copyStatus === "copied" ? (
                <Check className="size-4" aria-hidden="true" />
              ) : (
                <Copy className="size-4" aria-hidden="true" />
              )}
              {copyStatus === "copied" ? "Copied" : "Copy public link"}
            </Button>
            <Link
              href={publicUrl}
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-9",
              )}
            >
              <ExternalLink className="size-4" aria-hidden="true" />
              Open public quote
            </Link>
          </>
        )}
      </div>

      {state.message && (
        <p
          role={state.status === "error" ? "alert" : "status"}
          className={
            state.status === "error"
              ? "max-w-lg text-right text-xs text-destructive"
              : "max-w-lg text-right text-xs text-emerald-700"
          }
        >
          {state.message}
        </p>
      )}
      {copyStatus === "error" && (
        <p role="alert" className="text-xs text-destructive sm:text-right">
          The link could not be copied. Open the public quote and copy its URL
          from your browser.
        </p>
      )}
    </div>
  );
}

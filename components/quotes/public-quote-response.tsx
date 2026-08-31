"use client";

import { useActionState } from "react";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

import {
  acceptPublicQuoteAction,
  declinePublicQuoteAction,
  type PublicQuoteActionState,
} from "@/app/q/[token]/actions";
import { Button } from "@/components/ui/button";

const INITIAL_STATE: PublicQuoteActionState = { status: "idle" };

export function PublicQuoteResponse({
  token,
  status,
  expired,
}: {
  token: string;
  status: "SENT" | "VIEWED" | "ACCEPTED" | "DECLINED";
  expired: boolean;
}) {
  const [acceptState, acceptAction, accepting] = useActionState(
    acceptPublicQuoteAction.bind(null, token),
    INITIAL_STATE,
  );
  const [declineState, declineAction, declining] = useActionState(
    declinePublicQuoteAction.bind(null, token),
    INITIAL_STATE,
  );
  const successfulState =
    acceptState.status === "success"
      ? acceptState
      : declineState.status === "success"
        ? declineState
        : null;
  const errorMessage =
    acceptState.status === "error"
      ? acceptState.message
      : declineState.status === "error"
        ? declineState.message
        : null;

  if (successfulState || status === "ACCEPTED" || status === "DECLINED") {
    const accepted =
      successfulState?.response === "ACCEPTED" || status === "ACCEPTED";
    return (
      <div
        role="status"
        className={
          accepted
            ? "rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950"
            : "rounded-xl border border-slate-200 bg-slate-50 p-5 text-slate-900"
        }
      >
        <div className="flex items-start gap-3">
          {accepted ? (
            <CheckCircle2 className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          ) : (
            <XCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          )}
          <div>
            <p className="font-semibold">
              {accepted ? "Quote accepted" : "Quote declined"}
            </p>
            <p className="mt-1 text-sm">
              {successfulState?.message ||
                (accepted
                  ? "Your acceptance has been recorded."
                  : "Your decline response has been recorded.")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <h2 className="font-semibold">Respond to this quote</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {expired
          ? "This quote has expired and can no longer be accepted."
          : "Review the details above, then accept or decline this quote."}
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {!expired && (
          <form
            action={acceptAction}
            className="w-full sm:w-auto"
            onSubmit={(event) => {
              if (!window.confirm("Accept this quote? This response is final.")) {
                event.preventDefault();
              }
            }}
          >
            <Button
              type="submit"
              size="lg"
              className="w-full sm:w-auto"
              disabled={accepting || declining}
            >
              {accepting && (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              )}
              {accepting ? "Accepting…" : "Accept quote"}
            </Button>
          </form>
        )}
        <form
          action={declineAction}
          className="w-full sm:w-auto"
          onSubmit={(event) => {
            if (!window.confirm("Decline this quote? This response is final.")) {
              event.preventDefault();
            }
          }}
        >
          <Button
            type="submit"
            size="lg"
            variant="destructive"
            className="w-full sm:w-auto"
            disabled={accepting || declining}
          >
            {declining && (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            )}
            {declining ? "Declining…" : "Decline quote"}
          </Button>
        </form>
      </div>
      {errorMessage && (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

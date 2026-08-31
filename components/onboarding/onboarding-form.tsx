"use client";

import { useActionState } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";

import {
  createOrganizationAction,
  type OnboardingActionState,
} from "@/app/onboarding/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const INITIAL_STATE: OnboardingActionState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-7 flex h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-60"
    >
      {pending ? (
        <>
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          Creating workspace...
        </>
      ) : (
        <>
          Create workspace
          <ArrowRight className="size-4" aria-hidden="true" />
        </>
      )}
    </button>
  );
}

export function OnboardingForm() {
  const [state, formAction] = useActionState(
    createOrganizationAction,
    INITIAL_STATE,
  );
  const nameErrors = state.fieldErrors?.organizationName;

  return (
    <Card className="mt-8">
      <CardContent className="p-5 sm:p-7">
        <form action={formAction} noValidate>
          {state.status === "error" && state.message && (
            <p
              role="alert"
              className="mb-5 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive"
            >
              {state.message}
            </p>
          )}

          <div className="space-y-1.5">
            <label
              htmlFor="onboarding-business"
              className="text-sm font-medium"
            >
              Business name
            </label>
            <Input
              id="onboarding-business"
              name="organizationName"
              placeholder="e.g. Northstar Studio"
              autoComplete="organization"
              autoFocus
              required
              aria-invalid={Boolean(nameErrors)}
              aria-describedby={
                nameErrors
                  ? "onboarding-business-error"
                  : "onboarding-business-help"
              }
            />
            {nameErrors?.[0] && (
              <p
                id="onboarding-business-error"
                className="text-xs text-destructive"
              >
                {nameErrors[0]}
              </p>
            )}
            <p
              id="onboarding-business-help"
              className="text-xs leading-5 text-muted-foreground"
            >
              This name identifies your business on customer-facing quotes.
            </p>
          </div>

          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}

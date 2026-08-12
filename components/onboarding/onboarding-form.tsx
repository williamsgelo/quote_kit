"use client";

import { useActionState } from "react";
import { ArrowRight, ImagePlus, LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";

import {
  createOrganizationAction,
  type OnboardingActionState,
} from "@/app/onboarding/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const INITIAL_STATE: OnboardingActionState = { status: "idle" };

const selectStyles =
  "h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20";

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

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
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
                  nameErrors ? "onboarding-business-error" : undefined
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
            </div>
            <div className="space-y-1.5">
              <label htmlFor="industry" className="text-sm font-medium">
                Industry
              </label>
              <select id="industry" defaultValue="" className={selectStyles}>
                <option value="" disabled>
                  Select an industry
                </option>
                <option>Creative services</option>
                <option>Consulting</option>
                <option>Construction & trades</option>
                <option>Technology</option>
                <option>Other</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="team-size" className="text-sm font-medium">
                Team size
              </label>
              <select
                id="team-size"
                defaultValue="1-5"
                className={selectStyles}
              >
                <option value="1-5">1–5 people</option>
                <option value="6-20">6–20 people</option>
                <option value="21-50">21–50 people</option>
                <option value="51+">51+ people</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="onboarding-email"
                className="text-sm font-medium"
              >
                Business email{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </label>
              <Input
                id="onboarding-email"
                type="email"
                placeholder="hello@company.com"
              />
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="onboarding-phone"
                className="text-sm font-medium"
              >
                Phone number{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </label>
              <Input
                id="onboarding-phone"
                type="tel"
                placeholder="+27 00 000 0000"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-xl border border-dashed bg-muted/15 p-4 text-left transition-colors hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-background shadow-xs">
                  <ImagePlus
                    className="size-4.5 text-muted-foreground"
                    aria-hidden="true"
                  />
                </span>
                <span>
                  <span className="block text-sm font-medium">
                    Add your logo{" "}
                    <span className="font-normal text-muted-foreground">
                      (optional)
                    </span>
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    You can always do this later in settings
                  </span>
                </span>
              </button>
            </div>
          </div>

          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}

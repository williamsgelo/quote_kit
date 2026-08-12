"use client";

import { useActionState, useEffect } from "react";
import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";

import {
  registerAction,
  type RegistrationActionState,
} from "@/app/(auth)/actions";
import { Input } from "@/components/ui/input";

const INITIAL_STATE: RegistrationActionState = { status: "idle" };

function FieldError({ id, errors }: { id: string; errors?: string[] }) {
  if (!errors?.length) {
    return null;
  }

  return (
    <p id={id} className="text-xs text-destructive">
      {errors[0]}
    </p>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-60"
    >
      {pending ? (
        <>
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          Creating account...
        </>
      ) : (
        <>
          Create account
          <ArrowRight className="size-4" aria-hidden="true" />
        </>
      )}
    </button>
  );
}

export function SignupForm() {
  const router = useRouter();
  const [state, formAction] = useActionState(registerAction, INITIAL_STATE);

  useEffect(() => {
    if (state.status === "success") {
      router.replace("/login?registered=1");
    }
  }, [router, state.status]);

  return (
    <form action={formAction} className="mt-8 space-y-5" noValidate>
      {state.status === "error" && state.message && (
        <p
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive"
        >
          {state.message}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="first-name" className="text-sm font-medium">
            First name
          </label>
          <Input
            id="first-name"
            name="firstName"
            placeholder="Gabriel"
            autoComplete="given-name"
            required
            aria-invalid={Boolean(state.fieldErrors?.firstName)}
            aria-describedby={
              state.fieldErrors?.firstName ? "first-name-error" : undefined
            }
          />
          <FieldError
            id="first-name-error"
            errors={state.fieldErrors?.firstName}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="last-name" className="text-sm font-medium">
            Last name
          </label>
          <Input
            id="last-name"
            name="lastName"
            placeholder="Mokoena"
            autoComplete="family-name"
            required
            aria-invalid={Boolean(state.fieldErrors?.lastName)}
            aria-describedby={
              state.fieldErrors?.lastName ? "last-name-error" : undefined
            }
          />
          <FieldError
            id="last-name-error"
            errors={state.fieldErrors?.lastName}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <label htmlFor="signup-email" className="text-sm font-medium">
          Work email
        </label>
        <Input
          id="signup-email"
          name="email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          required
          aria-invalid={Boolean(state.fieldErrors?.email)}
          aria-describedby={
            state.fieldErrors?.email ? "signup-email-error" : undefined
          }
        />
        <FieldError
          id="signup-email-error"
          errors={state.fieldErrors?.email}
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="signup-password" className="text-sm font-medium">
          Password
        </label>
        <Input
          id="signup-password"
          name="password"
          type="password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          required
          aria-invalid={Boolean(state.fieldErrors?.password)}
          aria-describedby={
            state.fieldErrors?.password
              ? "signup-password-error"
              : "signup-password-help"
          }
        />
        <FieldError
          id="signup-password-error"
          errors={state.fieldErrors?.password}
        />
        <p
          id="signup-password-help"
          className="flex items-center gap-1.5 pt-1 text-xs text-muted-foreground"
        >
          <Check className="size-3.5 text-emerald-600" aria-hidden="true" />
          Use 8 or more characters
        </p>
      </div>
      <SubmitButton />
    </form>
  );
}

"use client";

import { useActionState } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";

import {
  loginAction,
  type LoginActionState,
} from "@/app/(auth)/actions";
import { Input } from "@/components/ui/input";

const INITIAL_STATE: LoginActionState = { status: "idle" };

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
          Logging in...
        </>
      ) : (
        <>
          Log in
          <ArrowRight className="size-4" aria-hidden="true" />
        </>
      )}
    </button>
  );
}

export function LoginForm({
  callbackUrl,
  registrationSucceeded,
}: {
  callbackUrl: string;
  registrationSucceeded: boolean;
}) {
  const [state, formAction] = useActionState(loginAction, INITIAL_STATE);

  return (
    <form action={formAction} className="mt-8 space-y-5" noValidate>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      {registrationSucceeded && state.status !== "error" && (
        <p
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800"
        >
          Account created. Log in to continue.
        </p>
      )}

      {state.status === "error" && state.message && (
        <p
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive"
        >
          {state.message}
        </p>
      )}

      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium">
          Email address
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          required
        />
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <button
            type="button"
            disabled
            title="Password reset is not available yet"
            className="text-xs font-medium text-muted-foreground"
          >
            Forgot password?
          </button>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          required
        />
      </div>
      <SubmitButton />
    </form>
  );
}

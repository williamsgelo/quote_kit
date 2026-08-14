"use client";

import { useActionState, useEffect } from "react";
import { Archive, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";

import {
  archiveCustomer,
  type CustomerActionState,
} from "@/app/(app)/customers/actions";
import { Button } from "@/components/ui/button";

const INITIAL_STATE: CustomerActionState = { status: "idle" };

function ArchiveSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="destructive"
      size="lg"
      className="h-9"
      disabled={pending}
    >
      {pending ? (
        <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
      ) : (
        <Archive className="size-4" aria-hidden="true" />
      )}
      {pending ? "Archiving..." : "Archive"}
    </Button>
  );
}

export function ArchiveCustomerButton({
  customerId,
  customerName,
}: {
  customerId: string;
  customerName: string;
}) {
  const router = useRouter();
  const action = archiveCustomer.bind(null, customerId);
  const [state, formAction] = useActionState(action, INITIAL_STATE);

  useEffect(() => {
    if (state.status === "success") {
      router.replace("/customers");
      router.refresh();
    }
  }, [router, state.status]);

  return (
    <div>
      <form
        action={formAction}
        onSubmit={(event) => {
          if (!window.confirm(`Archive ${customerName}?`)) {
            event.preventDefault();
          }
        }}
      >
        <ArchiveSubmitButton />
      </form>
      {state.status === "error" && state.message && (
        <p role="alert" className="mt-2 text-xs text-destructive">
          {state.message}
        </p>
      )}
    </div>
  );
}

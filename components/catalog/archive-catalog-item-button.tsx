"use client";

import { useActionState, useEffect } from "react";
import { Archive, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";

import {
  archiveCatalogItem,
  type CatalogItemActionState,
} from "@/app/(app)/catalog/actions";
import { Button } from "@/components/ui/button";

const INITIAL_STATE: CatalogItemActionState = { status: "idle" };

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
      {pending ? "Archiving..." : "Archive item"}
    </Button>
  );
}

export function ArchiveCatalogItemButton({
  catalogItemId,
  itemName,
}: {
  catalogItemId: string;
  itemName: string;
}) {
  const router = useRouter();
  const action = archiveCatalogItem.bind(null, catalogItemId);
  const [state, formAction] = useActionState(action, INITIAL_STATE);

  useEffect(() => {
    if (state.status === "success") {
      router.replace("/catalog");
      router.refresh();
    }
  }, [router, state.status]);

  return (
    <div>
      <form
        action={formAction}
        onSubmit={(event) => {
          if (!window.confirm(`Archive ${itemName}?`)) {
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

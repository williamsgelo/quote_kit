"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireOrganization } from "@/lib/auth/access";
import { QuotePricingError } from "@/lib/quotes/pricing";
import {
  createDraftQuoteForOrganization,
  QuoteNotEditableError,
  QuoteNotFoundError,
  updateDraftQuoteForOrganization,
} from "@/lib/quotes/service";
import { QuoteReferenceError } from "@/lib/quotes/snapshots";
import { quoteSchema } from "@/lib/validation/quote";

export type QuoteActionState = {
  status: "idle" | "error" | "success";
  message?: string;
  quoteId?: string;
  fieldErrors?: Record<string, string[]>;
};

function parsedPayload(formData: FormData) {
  const value = formData.get("quotePayload");
  if (typeof value !== "string") {
    return null;
  }

  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

function validationError(error: z.ZodError): QuoteActionState {
  const fieldErrors: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const path = issue.path.join(".") || "form";
    fieldErrors[path] = [...(fieldErrors[path] ?? []), issue.message];
  }

  return {
    status: "error",
    message: "Check the highlighted fields and try again.",
    fieldErrors,
  };
}

function safeQuoteError(error: unknown): QuoteActionState | null {
  if (error instanceof z.ZodError) {
    return validationError(error);
  }
  if (error instanceof QuoteNotEditableError) {
    return { status: "error", message: "Only draft quotes may be edited." };
  }
  if (error instanceof QuoteNotFoundError) {
    return { status: "error", message: "The quote is unavailable." };
  }
  if (error instanceof QuoteReferenceError) {
    return {
      status: "error",
      message:
        "A selected customer or catalog item is unavailable. Refresh and try again.",
    };
  }
  if (error instanceof QuotePricingError) {
    return { status: "error", message: error.message };
  }
  return null;
}

function reportQuoteError(operation: string, error: unknown) {
  console.error(
    `[quotes] ${operation} failed: ${
      error instanceof Error ? error.name : "UnknownError"
    }`,
  );
}

export async function createDraftQuoteAction(
  _previousState: QuoteActionState,
  formData: FormData,
): Promise<QuoteActionState> {
  const { organization } = await requireOrganization({ behavior: "throw" });
  const payload = parsedPayload(formData);
  const parsedQuote = quoteSchema.safeParse(payload);

  if (!parsedQuote.success) {
    return validationError(parsedQuote.error);
  }

  try {
    const quote = await createDraftQuoteForOrganization(
      organization.id,
      parsedQuote.data,
    );

    revalidatePath("/dashboard");
    revalidatePath("/quotes");

    return {
      status: "success",
      message: "Draft quote created.",
      quoteId: quote.id,
    };
  } catch (error) {
    const safeError = safeQuoteError(error);
    if (safeError) {
      return safeError;
    }
    reportQuoteError("create", error);
    return {
      status: "error",
      message: "We could not save the draft quote. Please try again.",
    };
  }
}

export async function updateDraftQuoteAction(
  quoteId: string,
  _previousState: QuoteActionState,
  formData: FormData,
): Promise<QuoteActionState> {
  const { organization } = await requireOrganization({ behavior: "throw" });
  const payload = parsedPayload(formData);
  const parsedQuote = quoteSchema.safeParse(payload);

  if (!parsedQuote.success) {
    return validationError(parsedQuote.error);
  }

  try {
    const quote = await updateDraftQuoteForOrganization(
      organization.id,
      quoteId,
      parsedQuote.data,
    );

    revalidatePath("/dashboard");
    revalidatePath("/quotes");
    revalidatePath(`/quotes/${quote.id}`);
    revalidatePath(`/quotes/${quote.id}/edit`);

    return {
      status: "success",
      message: "Draft quote updated.",
      quoteId: quote.id,
    };
  } catch (error) {
    const safeError = safeQuoteError(error);
    if (safeError) {
      return safeError;
    }
    reportQuoteError("update", error);
    return {
      status: "error",
      message: "We could not update the draft quote. Please try again.",
    };
  }
}

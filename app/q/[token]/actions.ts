"use server";

import { revalidatePath } from "next/cache";

import {
  PublicQuoteExpiredError,
  respondToPublicQuote,
} from "@/lib/quotes/delivery-service";
import { QuoteTransitionError } from "@/lib/quotes/transitions";

export type PublicQuoteActionState = {
  status: "idle" | "error" | "success";
  message?: string;
  response?: "ACCEPTED" | "DECLINED";
};

async function respond(
  token: string,
  response: "ACCEPT" | "DECLINE",
): Promise<PublicQuoteActionState> {
  try {
    const result = await respondToPublicQuote(token, response);
    if (!result) {
      return { status: "error", message: "This quote is unavailable." };
    }

    revalidatePath(`/q/${token}`);
    const accepted = result.status === "ACCEPTED";
    return {
      status: "success",
      response: accepted ? "ACCEPTED" : "DECLINED",
      message: accepted
        ? "Thank you. The quote has been accepted."
        : "Your response has been recorded. The quote was declined.",
    };
  } catch (error) {
    if (
      error instanceof PublicQuoteExpiredError ||
      error instanceof QuoteTransitionError
    ) {
      return { status: "error", message: error.message };
    }
    console.error(
      `[public-quote] response failed: ${
        error instanceof Error ? error.name : "UnknownError"
      }`,
    );
    return {
      status: "error",
      message: "We could not record your response. Please try again.",
    };
  }
}

export async function acceptPublicQuoteAction(
  token: string,
  _previousState: PublicQuoteActionState,
) {
  void _previousState;
  return respond(token, "ACCEPT");
}

export async function declinePublicQuoteAction(
  token: string,
  _previousState: PublicQuoteActionState,
) {
  void _previousState;
  return respond(token, "DECLINE");
}

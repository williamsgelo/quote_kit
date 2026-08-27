import { QuoteStatus } from "@/generated/prisma/client";

export type QuoteTransitionEvent = "SEND" | "VIEW" | "ACCEPT" | "DECLINE";

export class QuoteTransitionError extends Error {
  constructor(message = "This quote status change is not allowed.") {
    super(message);
    this.name = "QuoteTransitionError";
  }
}

export function transitionQuoteStatus(
  currentStatus: QuoteStatus,
  event: QuoteTransitionEvent,
) {
  if (event === "SEND") {
    if (currentStatus !== QuoteStatus.DRAFT) {
      throw new QuoteTransitionError("Only draft quotes may be sent.");
    }
    return { status: QuoteStatus.SENT, changed: true } as const;
  }

  if (event === "VIEW") {
    if (currentStatus === QuoteStatus.SENT) {
      return { status: QuoteStatus.VIEWED, changed: true } as const;
    }
    if (
      currentStatus === QuoteStatus.VIEWED ||
      currentStatus === QuoteStatus.ACCEPTED ||
      currentStatus === QuoteStatus.DECLINED
    ) {
      return { status: currentStatus, changed: false } as const;
    }
    throw new QuoteTransitionError("This quote is not available for viewing.");
  }

  if (event === "ACCEPT") {
    if (
      currentStatus === QuoteStatus.SENT ||
      currentStatus === QuoteStatus.VIEWED
    ) {
      return { status: QuoteStatus.ACCEPTED, changed: true } as const;
    }
    if (currentStatus === QuoteStatus.ACCEPTED) {
      return { status: currentStatus, changed: false } as const;
    }
    if (currentStatus === QuoteStatus.DECLINED) {
      throw new QuoteTransitionError(
        "A declined quote cannot be accepted through the public page.",
      );
    }
    throw new QuoteTransitionError("This quote cannot be accepted.");
  }

  if (
    currentStatus === QuoteStatus.SENT ||
    currentStatus === QuoteStatus.VIEWED
  ) {
    return { status: QuoteStatus.DECLINED, changed: true } as const;
  }
  if (currentStatus === QuoteStatus.DECLINED) {
    return { status: currentStatus, changed: false } as const;
  }
  if (currentStatus === QuoteStatus.ACCEPTED) {
    throw new QuoteTransitionError(
      "An accepted quote cannot be declined through the public page.",
    );
  }
  throw new QuoteTransitionError("This quote cannot be declined.");
}

export function isQuoteExpired(expiryDate: Date, now = new Date()) {
  return expiryDate.toISOString().slice(0, 10) < now.toISOString().slice(0, 10);
}

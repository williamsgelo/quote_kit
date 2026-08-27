import "server-only";

import { resendConfig } from "@/lib/email/config";

export type QuoteEmailMessage = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

export type QuoteEmailSender = (
  message: QuoteEmailMessage,
) => Promise<{ id: string }>;

export class EmailDeliveryError extends Error {
  constructor(message = "The quote email could not be delivered.") {
    super(message);
    this.name = "EmailDeliveryError";
  }
}

export const sendResendEmail: QuoteEmailSender = async (message) => {
  const { apiKey, from } = resendConfig();
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, ...message }),
  });

  const result = (await response.json().catch(() => null)) as
    | { id?: unknown; message?: unknown }
    | null;

  if (!response.ok || typeof result?.id !== "string") {
    throw new EmailDeliveryError(
      typeof result?.message === "string"
        ? `The email provider rejected the request: ${result.message}`
        : undefined,
    );
  }

  return { id: result.id };
};

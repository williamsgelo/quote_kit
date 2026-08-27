import "server-only";

export class EmailConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EmailConfigurationError";
  }
}

export function trustedAppOrigin(value = process.env.APP_URL) {
  if (!value) {
    throw new EmailConfigurationError("APP_URL is not configured.");
  }

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new EmailConfigurationError("APP_URL must be a valid absolute URL.");
  }

  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new EmailConfigurationError(
      "APP_URL must contain only a trusted http or https origin.",
    );
  }

  if (process.env.NODE_ENV === "production" && url.protocol !== "https:") {
    throw new EmailConfigurationError("APP_URL must use HTTPS in production.");
  }

  return url.origin;
}

export function resendConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    throw new EmailConfigurationError(
      "Quote email is not configured. Set RESEND_API_KEY and EMAIL_FROM.",
    );
  }

  return { apiKey, from };
}

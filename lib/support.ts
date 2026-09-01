import "server-only";

const DEFAULT_SUPPORT_EMAIL = "support@quotevia.co.za";

export function getSupportEmail() {
  return process.env.SUPPORT_EMAIL?.trim() || DEFAULT_SUPPORT_EMAIL;
}

import "server-only";

const DEFAULT_SUPPORT_EMAIL = "support@quotekit.app";

export function getSupportEmail() {
  return process.env.SUPPORT_EMAIL?.trim() || DEFAULT_SUPPORT_EMAIL;
}

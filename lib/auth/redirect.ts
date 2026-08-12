const DEFAULT_AUTH_REDIRECT = "/onboarding";
const AUTH_PAGE_PATHS = new Set(["/login", "/signup"]);

export function getSafeRedirectPath(
  value: FormDataEntryValue | string | null | undefined,
  fallback = DEFAULT_AUTH_REDIRECT,
) {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\") ||
    value.length > 2_048
  ) {
    return fallback;
  }

  try {
    const baseUrl = new URL("https://quotekit.local");
    const redirectUrl = new URL(value, baseUrl);

    if (
      redirectUrl.origin !== baseUrl.origin ||
      AUTH_PAGE_PATHS.has(redirectUrl.pathname)
    ) {
      return fallback;
    }

    return `${redirectUrl.pathname}${redirectUrl.search}${redirectUrl.hash}`;
  } catch {
    return fallback;
  }
}


const FALLBACK_SITE_ORIGIN = "https://quotevia.co.za";

export const SITE_NAME = "QuoteKit";
export const HOMEPAGE_TITLE =
  "Online Quote Tool for Small Businesses | QuoteKit";
export const HOMEPAGE_DESCRIPTION =
  "Create professional quotes, send them online, track when customers view them, and get approvals faster with QuoteKit.";

function resolveSiteOrigin(value = process.env.APP_URL) {
  const candidate = value?.trim() || FALLBACK_SITE_ORIGIN;
  let url: URL;

  try {
    url = new URL(candidate);
  } catch {
    throw new Error("APP_URL must be a valid absolute URL for SEO metadata.");
  }

  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error("APP_URL must contain only an HTTP or HTTPS origin.");
  }

  if (process.env.NODE_ENV === "production" && url.protocol !== "https:") {
    throw new Error("APP_URL must use HTTPS in production.");
  }

  return url.origin;
}

export const SITE_ORIGIN = resolveSiteOrigin();
export const SITE_URL = new URL(`${SITE_ORIGIN}/`);

export const NO_INDEX_ROBOTS = {
  index: false,
  follow: false,
  googleBot: {
    index: false,
    follow: false,
    noimageindex: true,
  },
} as const;

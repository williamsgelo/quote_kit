import {
  HOMEPAGE_DESCRIPTION,
  HOMEPAGE_TITLE,
  SITE_NAME,
  SITE_ORIGIN,
} from "@/lib/seo";

const organizationId = `${SITE_ORIGIN}/#organization`;
const websiteId = `${SITE_ORIGIN}/#website`;
const webpageId = `${SITE_ORIGIN}/#webpage`;
const softwareId = `${SITE_ORIGIN}/#software`;

export const homepageStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": organizationId,
      name: SITE_NAME,
      url: `${SITE_ORIGIN}/`,
      description: HOMEPAGE_DESCRIPTION,
      logo: {
        "@type": "ImageObject",
        "@id": `${SITE_ORIGIN}/#logo`,
        url: `${SITE_ORIGIN}/apple-icon`,
        contentUrl: `${SITE_ORIGIN}/apple-icon`,
        width: 180,
        height: 180,
        caption: SITE_NAME,
      },
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: `${SITE_ORIGIN}/`,
      name: SITE_NAME,
      description: HOMEPAGE_DESCRIPTION,
      inLanguage: "en-ZA",
      publisher: { "@id": organizationId },
    },
    {
      "@type": "WebPage",
      "@id": webpageId,
      url: `${SITE_ORIGIN}/`,
      name: HOMEPAGE_TITLE,
      description: HOMEPAGE_DESCRIPTION,
      inLanguage: "en-ZA",
      isPartOf: { "@id": websiteId },
      about: { "@id": organizationId },
      mainEntity: { "@id": softwareId },
      primaryImageOfPage: {
        "@type": "ImageObject",
        "@id": `${SITE_ORIGIN}/#primaryimage`,
        url: `${SITE_ORIGIN}/opengraph-image`,
        contentUrl: `${SITE_ORIGIN}/opengraph-image`,
        width: 1200,
        height: 630,
        caption: "QuoteVia online quotation software",
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": softwareId,
      name: SITE_NAME,
      url: `${SITE_ORIGIN}/`,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description: HOMEPAGE_DESCRIPTION,
      provider: { "@id": organizationId },
      mainEntityOfPage: { "@id": webpageId },
    },
  ],
} as const;

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

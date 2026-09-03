import type { MetadataRoute } from "next";

import { SITE_ORIGIN } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-09-03T00:00:00.000Z");

  return [
    {
      url: `${SITE_ORIGIN}/`,
      lastModified,
    },
    {
      url: `${SITE_ORIGIN}/online-quote-maker`,
      lastModified,
    },
    {
      url: `${SITE_ORIGIN}/quotation-software-south-africa`,
      lastModified,
    },
  ];
}

import type { MetadataRoute } from "next";

import { SITE_ORIGIN } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_ORIGIN}/`,
      lastModified: new Date("2026-08-31T00:00:00.000Z"),
    },
  ];
}

// app/robots.ts — robots.txt (docs/SEO.md §6).
// Allow every public page, explicitly disallow /admin, publish the sitemap.

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
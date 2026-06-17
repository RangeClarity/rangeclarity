import type { MetadataRoute } from "next";

/**
 * sitemap.xml (served at /sitemap.xml).
 * Only the public marketing homepage is listed. Internal compare/guide routes
 * are intentionally excluded (they are noindex).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://rangeclarity.com";
  return [
    {
      url: `${base}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}

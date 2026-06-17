import type { MetadataRoute } from "next";

/**
 * robots.txt (served at /robots.txt).
 * Public homepage is indexable; internal/compare routes are kept out of search
 * (they are already noindex via per-page metadata; this is belt-and-braces).
 */
export default function robots(): MetadataRoute.Robots {
  const base = "https://rangeclarity.com";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/designs", "/indicator-guide"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}

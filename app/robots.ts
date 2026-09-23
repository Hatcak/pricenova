import type { MetadataRoute } from "next";
import appConfig from "@/app.config";

/**
 * Keep crawlers out of the signed-in app and the demo redirect. None of it is
 * reachable without a session anyway, so indexing it would only produce a pile
 * of login-page duplicates in the results.
 */
export default function robots(): MetadataRoute.Robots {
  const base = `https://${appConfig.domain}`;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/products",
        "/competitors",
        "/matches",
        "/changes",
        "/rules",
        "/approvals",
        "/reports",
        "/marketplaces",
        "/settings",
        "/demo",
        "/auth/",
      ],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}

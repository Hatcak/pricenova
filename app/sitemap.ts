import type { MetadataRoute } from "next";
import appConfig from "@/app.config";

/**
 * Only public pages belong here. The dashboard sits behind auth and the demo
 * door is a redirect, so neither would help a crawler — and listing them would
 * just spend crawl budget on 307s.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = `https://${appConfig.domain}`;
  const now = new Date();

  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${base}/rakip-fiyat-takip-programi`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${base}/trendyol-fiyat-takip-sistemi`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${base}/shopify-otomatik-fiyatlandirma`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    { url: `${base}/gizlilik`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/login`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/signup`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
  ];
}

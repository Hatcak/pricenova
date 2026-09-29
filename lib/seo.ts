import type { Metadata } from "next";
import appConfig from "@/app.config";

type OpenGraph = NonNullable<Metadata["openGraph"]>;

/**
 * Next.js replaces a parent's `openGraph` wholesale when a page sets its own,
 * so the shared image, site name and locale from app/layout.tsx silently drop
 * off every page that customises its title. Pages build theirs through here.
 */
export function openGraph(page: { title: string; description?: string; url: string }): OpenGraph {
  return {
    type: "website",
    locale: "tr_TR",
    siteName: appConfig.name,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${appConfig.name}: rakip fiyat takibi` }],
    ...page,
  };
}

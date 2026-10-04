import type { Metadata } from "next";
import appConfig from "@/app.config";
import { openGraph } from "@/lib/seo";
import { BlogContent } from "@/components/marketing/company-pages";

const url = `https://${appConfig.domain}/blog`;

export const metadata: Metadata = {
  title: "Blog",
  description: "Rakip fiyat takibi ve otomatik fiyatlandırma üzerine Trendyol, Hepsiburada, n11 ve Shopify rehberleri.",
  alternates: { canonical: url },
  openGraph: openGraph({ title: `Blog | ${appConfig.name}`, description: "Rakip fiyat takibi ve otomatik fiyatlandırma üzerine Trendyol, Hepsiburada, n11 ve Shopify rehberleri.", url }),
};

export default function Page() {
  return <BlogContent />;
}

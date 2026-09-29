import type { Metadata } from "next";
import appConfig from "@/app.config";
import { Landing } from "@/components/marketing/landing";
import { openGraph } from "@/lib/seo";

const title = `${appConfig.name} · Rakip fiyat takibi ve otomatik fiyatlandırma`;
const description =
  "Trendyol, Hepsiburada, n11, Amazon, Shopify ve WooCommerce'teki rakip fiyatlarını izle, geride kaldığında uyarı al, kendi kurallarınla fiyatını güncelle. 3 gün ücretsiz, kart istemiyoruz.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/" },
  openGraph: openGraph({ title, description, url: "/" }),
};

/**
 * Thin server wrapper so the homepage can export metadata. The page itself is
 * a client component because the TR/EN toggle resolves copy in the browser.
 */
export default function Page() {
  return <Landing />;
}

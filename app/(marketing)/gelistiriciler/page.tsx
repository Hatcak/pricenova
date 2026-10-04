import type { Metadata } from "next";
import appConfig from "@/app.config";
import { openGraph } from "@/lib/seo";
import { DevelopersContent } from "@/components/marketing/developers";

const url = `https://${appConfig.domain}/gelistiriciler`;
const description = "PriceNova entegrasyonları (Shopify, WooCommerce, Slack), planlanan API ve webhook'lar ve teknik altyapı.";

export const metadata: Metadata = {
  title: "Geliştiriciler",
  description,
  alternates: { canonical: url },
  openGraph: openGraph({ title: `Geliştiriciler | ${appConfig.name}`, description, url }),
};

export default function Page() {
  return <DevelopersContent />;
}

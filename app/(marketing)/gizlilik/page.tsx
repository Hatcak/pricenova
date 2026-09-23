import type { Metadata } from "next";
import appConfig from "@/app.config";
import { PrivacyContent } from "@/components/marketing/privacy-content";

export const metadata: Metadata = {
  title: "Gizlilik Politikası | PriceNova",
  description:
    "PriceNova hangi verileri topluyor, neden topluyor, nerede saklıyor ve siz bu veriler üzerinde hangi haklara sahipsiniz.",
  alternates: { canonical: `https://${appConfig.domain}/gizlilik` },
  // A policy page has no business in search results for product keywords.
  robots: { index: true, follow: true },
};

export default function Page() {
  return <PrivacyContent />;
}

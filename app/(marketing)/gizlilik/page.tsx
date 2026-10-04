import type { Metadata } from "next";
import appConfig from "@/app.config";
import { openGraph } from "@/lib/seo";
import { PrivacyContent } from "@/components/marketing/legal/privacy";

const url = `https://${appConfig.domain}/gizlilik`;

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description: "PriceNova hangi verileri topluyor, neden işliyor, kimlerle paylaşıyor ve nerede saklıyor; çerezler ve haklarınız.",
  alternates: { canonical: url },
  openGraph: openGraph({ title: `Gizlilik Politikası | ${appConfig.name}`, description: "PriceNova hangi verileri topluyor, neden işliyor, kimlerle paylaşıyor ve nerede saklıyor; çerezler ve haklarınız.", url }),
};

export default function Page() {
  return <PrivacyContent />;
}

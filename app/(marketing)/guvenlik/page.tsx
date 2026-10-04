import type { Metadata } from "next";
import appConfig from "@/app.config";
import { openGraph } from "@/lib/seo";
import { SecurityContent } from "@/components/marketing/legal/security";

const url = `https://${appConfig.domain}/guvenlik`;

export const metadata: Metadata = {
  title: "Güvenlik",
  description: "PriceNova verilerinizi ve fiyatlarınızı nasıl korur: satır bazlı güvenlik, şifreleme, fiyat frenleri ve güvenlik açığı bildirimi.",
  alternates: { canonical: url },
  openGraph: openGraph({ title: `Güvenlik | ${appConfig.name}`, description: "PriceNova verilerinizi ve fiyatlarınızı nasıl korur: satır bazlı güvenlik, şifreleme, fiyat frenleri ve güvenlik açığı bildirimi.", url }),
};

export default function Page() {
  return <SecurityContent />;
}

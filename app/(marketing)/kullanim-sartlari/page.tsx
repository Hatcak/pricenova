import type { Metadata } from "next";
import appConfig from "@/app.config";
import { openGraph } from "@/lib/seo";
import { TermsContent } from "@/components/marketing/legal/terms";

const url = `https://${appConfig.domain}/kullanim-sartlari`;

export const metadata: Metadata = {
  title: "Kullanım Şartları",
  description: "PriceNova kullanım şartları: ücretsiz deneme, paketler, otomatik fiyatlandırmada sorumluluk, kabul edilebilir kullanım ve uygulanacak hukuk.",
  alternates: { canonical: url },
  openGraph: openGraph({ title: `Kullanım Şartları | ${appConfig.name}`, description: "PriceNova kullanım şartları: ücretsiz deneme, paketler, otomatik fiyatlandırmada sorumluluk, kabul edilebilir kullanım ve uygulanacak hukuk.", url }),
};

export default function Page() {
  return <TermsContent />;
}

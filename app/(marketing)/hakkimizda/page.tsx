import type { Metadata } from "next";
import appConfig from "@/app.config";
import { openGraph } from "@/lib/seo";
import { AboutContent } from "@/components/marketing/company-pages";

const url = `https://${appConfig.domain}/hakkimizda`;

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "PriceNova nedir, neden var ve hangi ilkelerle çalışır. Şirket ve iletişim bilgileri.",
  alternates: { canonical: url },
  openGraph: openGraph({ title: `Hakkımızda | ${appConfig.name}`, description: "PriceNova nedir, neden var ve hangi ilkelerle çalışır. Şirket ve iletişim bilgileri.", url }),
};

export default function Page() {
  return <AboutContent />;
}

import type { Metadata } from "next";
import appConfig from "@/app.config";
import { openGraph } from "@/lib/seo";
import { CareersContent } from "@/components/marketing/company-pages";

const url = `https://${appConfig.domain}/kariyer`;

export const metadata: Metadata = {
  title: "Kariyer",
  description: "PriceNova'da çalışmak: açık pozisyonlar ve açık başvuru.",
  alternates: { canonical: url },
  openGraph: openGraph({ title: `Kariyer | ${appConfig.name}`, description: "PriceNova'da çalışmak: açık pozisyonlar ve açık başvuru.", url }),
};

export default function Page() {
  return <CareersContent />;
}

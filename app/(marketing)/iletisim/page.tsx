import type { Metadata } from "next";
import appConfig from "@/app.config";
import { openGraph } from "@/lib/seo";
import { ContactContent } from "@/components/marketing/company-pages";

const url = `https://${appConfig.domain}/iletisim`;

export const metadata: Metadata = {
  title: "İletişim",
  description: "PriceNova'ya ulaşın: satış, gizlilik ve KVKK başvuruları, güvenlik bildirimleri ve şirket bilgileri.",
  alternates: { canonical: url },
  openGraph: openGraph({ title: `İletişim | ${appConfig.name}`, description: "PriceNova'ya ulaşın: satış, gizlilik ve KVKK başvuruları, güvenlik bildirimleri ve şirket bilgileri.", url }),
};

export default function Page() {
  return <ContactContent />;
}

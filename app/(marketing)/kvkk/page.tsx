import type { Metadata } from "next";
import appConfig from "@/app.config";
import { openGraph } from "@/lib/seo";
import { KvkkContent } from "@/components/marketing/legal/kvkk";

const url = `https://${appConfig.domain}/kvkk`;

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
  description: "6698 sayılı KVKK m.10 uyarınca aydınlatma metni: veri sorumlusu, işleme amaçları, hukuki sebepler, aktarım ve başvuru yolları.",
  alternates: { canonical: url },
  openGraph: openGraph({ title: `KVKK Aydınlatma Metni | ${appConfig.name}`, description: "6698 sayılı KVKK m.10 uyarınca aydınlatma metni: veri sorumlusu, işleme amaçları, hukuki sebepler, aktarım ve başvuru yolları.", url }),
};

export default function Page() {
  return <KvkkContent />;
}

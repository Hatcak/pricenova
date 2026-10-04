import type { Metadata } from "next";
import appConfig from "@/app.config";
import { openGraph } from "@/lib/seo";
import { RetentionContent } from "@/components/marketing/legal/retention";

const url = `https://${appConfig.domain}/veri-saklama`;

export const metadata: Metadata = {
  title: "Veri Saklama Politikası",
  description: "PriceNova hangi veriyi ne kadar süre saklar, hesabınızı ve verilerinizi nasıl kalıcı olarak siler.",
  alternates: { canonical: url },
  openGraph: openGraph({ title: `Veri Saklama Politikası | ${appConfig.name}`, description: "PriceNova hangi veriyi ne kadar süre saklar, hesabınızı ve verilerinizi nasıl kalıcı olarak siler.", url }),
};

export default function Page() {
  return <RetentionContent />;
}

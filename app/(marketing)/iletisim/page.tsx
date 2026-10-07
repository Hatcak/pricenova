import type { Metadata } from "next";
import appConfig from "@/app.config";
import { openGraph } from "@/lib/seo";
import { ContactContent } from "@/components/marketing/company-pages";
import { isPlan } from "@/lib/leads";

const url = `https://${appConfig.domain}/iletisim`;

export const metadata: Metadata = {
  title: "İletişim",
  description: "PriceNova paketleri için teklif alın: formu doldurun, sizi telefonla ya da e-postayla arayalım. Gizlilik, KVKK ve güvenlik iletişim adresleri.",
  alternates: { canonical: url },
  openGraph: openGraph({ title: `Teklif al | ${appConfig.name}`, description: "PriceNova paketleri için teklif alın: formu doldurun, sizi telefonla ya da e-postayla arayalım.", url }),
};

export default async function Page({ searchParams }: PageProps<"/iletisim">) {
  // "Teklif al" on a pricing card links here with ?paket=Growth to preselect the plan.
  const { paket } = await searchParams;
  return <ContactContent initialPlan={isPlan(paket) ? paket : ""} />;
}

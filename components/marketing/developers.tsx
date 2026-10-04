"use client";

import Link from "next/link";
import { Code2, Database, FileSpreadsheet, Globe, Mail, Server, Webhook } from "lucide-react";
import appConfig from "@/app.config";
import { BrandGlyph } from "@/components/marketing/marks";
import { useLang } from "@/components/i18n/language-provider";
import { hostingL } from "@/lib/company";
import type { L } from "@/lib/i18n/config";

/**
 * Developers page. The homepage keeps one "API & Webhooks" card that links
 * here; the technical detail lives on this page instead. There is no public
 * API in this codebase yet, so it's described as planned, with no endpoint
 * names or SDK snippets that would read as documentation for something real.
 */

type Item = { icon?: typeof Code2; brand?: string; title: L; body: L };

const AVAILABLE: Item[] = [
  {
    brand: "Shopify",
    title: { tr: "Shopify Admin API", en: "Shopify Admin API" },
    body: { tr: "Kataloğun çekilir, onaylanan ya da otomatik uygulanan fiyat ürün varyantına yazılır.", en: "Your catalog is pulled in, and approved or automatic prices are written to the product variant." },
  },
  {
    brand: "WooCommerce",
    title: { tr: "WooCommerce REST API", en: "WooCommerce REST API" },
    body: { tr: "Shopify ile aynı akış: ürünleri okur, yeni fiyatı mağazana yazar.", en: "Same flow as Shopify: reads products, writes the new price back to your store." },
  },
  {
    brand: "Slack",
    title: { tr: "Slack gelen webhook", en: "Slack incoming webhook" },
    body: { tr: "Fiyat düşüşü ve konum kaybı uyarıları seçtiğin kanala gönderilir.", en: "Price-drop and lost-position alerts are posted to the channel you choose." },
  },
  {
    icon: FileSpreadsheet,
    title: { tr: "CSV ve Excel dışa aktarma", en: "CSV and Excel export" },
    body: { tr: "Raporlar ekranından fiyat endeksi, kazanılan/kaybedilen ürünler ve değişiklikler dışa aktarılır.", en: "Price index, won/lost products and changes export from the Reports screen." },
  },
];

const PLANNED: L[] = [
  { tr: "Ürünlerini, rakiplerini, eşleşmeleri ve fiyat geçmişini okuyan bir REST API", en: "A REST API to read your products, rivals, matches and price history" },
  { tr: "Kuralları ve onay kuyruğunu programla yönetme", en: "Managing rules and the approval queue programmatically" },
  { tr: "Rakip fiyat değişikliği, konum kaybı ve uygulanan fiyat için webhook olayları", en: "Webhook events for rival price changes, lost position and applied prices" },
  { tr: "ERP ve stok sistemleriyle maliyet ve stok senkronu", en: "Cost and stock sync with ERP and inventory systems" },
];

const STACK: Item[] = [
  {
    icon: Database,
    title: { tr: "Supabase (PostgreSQL + Auth)", en: "Supabase (PostgreSQL + Auth)" },
    body: { tr: "Veritabanı ve kimlik doğrulama. Her tablo satır bazlı güvenlikle (RLS) sahibine kilitlidir.", en: "Database and authentication. Every table is locked to its owner with row-level security." },
  },
  {
    icon: Globe,
    title: { tr: "Scrapingdog", en: "Scrapingdog" },
    body: { tr: "Rakiplerin herkese açık ürün sayfalarını okuyan veri sağlayıcı. Yalnızca sayfa adresleri gönderilir.", en: "The data provider that reads rivals' public product pages. Only page URLs are sent." },
  },
  {
    icon: Server,
    title: { tr: "Next.js uygulaması", en: "Next.js application" },
    body: {
      tr: `Web uygulaması ${hostingL.tr} üzerinde çalışır. Mağaza erişim anahtarları yalnızca sunucuda tutulur.`,
      en: `The web app runs on ${hostingL.en}. Store access tokens are kept on the server only.`,
    },
  },
];

function Card({ item }: { item: Item }) {
  const { t } = useLang();
  return (
    <li className="rounded-2xl border border-border bg-card p-5">
      <span className="flex items-center gap-2.5">
        {item.brand ? (
          <BrandGlyph name={item.brand} className="h-5 w-5 text-primary" />
        ) : item.icon ? (
          <item.icon className="h-5 w-5 text-primary" aria-hidden />
        ) : null}
        <h3 className="font-semibold tracking-tight">{t(item.title)}</h3>
      </span>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(item.body)}</p>
    </li>
  );
}

export function DevelopersContent() {
  const { t, lang } = useLang();
  const tr = lang === "tr";
  const email = appConfig.company.emails.hello;

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <header className="max-w-3xl">
        <p className="label-mono text-primary">{tr ? "Geliştiriciler" : "Developers"}</p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl sm:leading-[1.1]">
          {tr ? "PriceNova'yı kendi sistemlerine bağla" : "Connect PriceNova to your own systems"}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground text-pretty">
          {tr
            ? "Bu sayfa teknik ekipler için: bugün hangi entegrasyonların çalıştığı, API ve webhook tarafında ne planladığımız ve ürünün hangi altyapı üzerinde çalıştığı."
            : "This page is for technical teams: which integrations work today, what we're planning on the API and webhook side, and the infrastructure the product runs on."}
        </p>
      </header>

      <section aria-labelledby="api-title" className="mt-12 rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Webhook className="h-5 w-5" aria-hidden />
          </span>
          <h2 id="api-title" className="text-xl font-bold tracking-tight">{tr ? "API ve webhook'lar" : "API and webhooks"}</h2>
          <span className="rounded-full border border-border bg-card px-2.5 py-0.5 text-xs font-semibold">{tr ? "Yakında" : "Coming soon"}</span>
        </div>
        <p className="mt-4 max-w-prose text-base leading-relaxed text-muted-foreground">
          {tr
            ? "Herkese açık API henüz yayında değil. Planladığımız kapsam aşağıda; ayrıntılar kesinleştikçe değişebilir. Erken erişim listesine girmek ya da kullanım senaryonu anlatmak için bize yaz."
            : "The public API isn't live yet. The scope we're planning is below and may change as details settle. Write to us to join early access or tell us your use case."}
        </p>
        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {PLANNED.map((p) => (
            <li key={p.en} className="flex items-start gap-2 text-sm">
              <Code2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              {t(p)}
            </li>
          ))}
        </ul>
        <a
          href={`mailto:${email}?subject=${encodeURIComponent("API erken erişim")}`}
          className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Mail className="h-4 w-4" aria-hidden />
          {tr ? "Erken erişim iste" : "Request early access"}
        </a>
      </section>

      <section aria-labelledby="available-title" className="mt-14">
        <h2 id="available-title" className="font-display text-2xl font-bold tracking-tight">{tr ? "Bugün çalışan entegrasyonlar" : "Integrations that work today"}</h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {AVAILABLE.map((i) => (
            <Card key={i.title.en} item={i} />
          ))}
        </ul>
      </section>

      <section aria-labelledby="stack-title" className="mt-14">
        <h2 id="stack-title" className="font-display text-2xl font-bold tracking-tight">{tr ? "Teknik altyapı" : "Technical stack"}</h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {STACK.map((i) => (
            <Card key={i.title.en} item={i} />
          ))}
        </ul>
        <p className="mt-6 text-sm text-muted-foreground">
          {tr ? "Veri işleme ve koruma ayrıntıları: " : "Data handling and protection in detail: "}
          <Link href="/guvenlik" className="font-medium text-primary hover:underline">{tr ? "Güvenlik" : "Security"}</Link>
          {" · "}
          <Link href="/gizlilik" className="font-medium text-primary hover:underline">{tr ? "Gizlilik Politikası" : "Privacy Policy"}</Link>
        </p>
      </section>
    </div>
  );
}

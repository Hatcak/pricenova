"use client";

import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  Check,
  Code2,
  Database,
  FlaskConical,
  History,
  LockKeyhole,
  Mail,
  Minus,
  Plus,
  Radar,
  WandSparkles,
} from "lucide-react";
import appConfig from "@/app.config";
import { FlowDemo } from "@/components/marketing/flow-demo";
import { BrandGlyph, ProductPreview } from "@/components/marketing/marks";
import { Reviews } from "@/components/marketing/reviews";
import { useLang } from "@/components/i18n/language-provider";
import { cn } from "@/lib/utils";
import type { L } from "@/lib/i18n/config";

/* ─────────────────────────────────────────────────────────────────────────────
   Homepage copy that doesn't belong in app.config.ts. Everything is { tr, en }.
   House rules for editing: no invented numbers or customers, and nothing on
   this page may promise a feature that isn't built. Unbuilt things carry a
   "Yakında" tag.

   Order: hero → interactive example → 3 features → integrations → social
   proof → pricing → FAQ → CTA. Keep each section short; technical detail
   (stack, API) lives on /gelistiriciler, not here.

   Sales-led: every primary button leads to the plans, and each plan's button
   opens the quote form on /iletisim with that plan preselected. The demo stays
   a separate, clearly labelled door.

   Visual direction from the ui-ux-pro-max skill: a dark "ink" hero with a
   glass product frame, a bento grid for features, the featured plan as a dark
   premium card, one warm `cta` colour for every call to action.
   ───────────────────────────────────────────────────────────────────────────── */

/** Turkish VAT rate used to show the VAT-inclusive price next to the list price. */
const KDV_RATE = 0.2;

const FEATURES: { icon: typeof Radar; title: L; body: L }[] = [
  {
    icon: Radar,
    title: { tr: "Rakip fiyat takibi", en: "Competitor price tracking" },
    body: {
      tr: "Planına göre günde birkaç kezden dakikada bire kadar: fiyat, stok ve kargo. Ürünler barkod ve model koduyla eşleşir, emin olunmayanı sen onaylarsın.",
      en: "From a few times a day up to every minute, depending on your plan: price, stock and shipping. Products match on barcode and model code; you approve anything uncertain.",
    },
  },
  {
    icon: BellRing,
    title: { tr: "Anında uyarı", en: "Instant alerts" },
    body: {
      tr: "Rakibin fiyat düşürdüğünde veya fiyat avantajını kaybettiğinde e-posta ve Slack'e haber gelir. Fiyat geçmişi grafikle saklanır.",
      en: "An email and Slack alert when a rival cuts a price or you lose your price advantage. Price history is kept and charted.",
    },
  },
  {
    icon: WandSparkles,
    title: { tr: "Otomatik fiyatlandırma", en: "Automatic repricing" },
    body: {
      tr: "\"En düşüğü %1 geç, maliyet +%10'un altına inme\" gibi kurallar yaz; yeni fiyat Shopify ya da WooCommerce mağazana yazılır.",
      en: "Write rules like \"beat the lowest by 1%, never below cost +10%\"; the new price is written to your Shopify or WooCommerce store.",
    },
  },
];

/** Safety controls around automatic repricing. `soon` = on the roadmap, not built. */
const SAFETY: { title: L; body: L; soon?: boolean }[] = [
  {
    title: { tr: "Önce öneri olarak göster", en: "Suggest first" },
    body: { tr: "Manuel onay modu: kural fiyatı değiştirmez, onay kuyruğuna yeni marjıyla birlikte öneri bırakır.", en: "Manual approval mode: the rule leaves a suggestion with its new margin instead of changing the price." },
  },
  {
    title: { tr: "Taban ve tavan fiyat", en: "Floor and ceiling" },
    body: { tr: "Hiçbir kural belirlediğin sınırın dışına çıkamaz; rakip tabanının altına inerse takip etmez, haber verir.", en: "No rule can leave your limits; if a rival dives under your floor it doesn't follow, it tells you." },
  },
  {
    title: { tr: "Günlük değişiklik sınırı", en: "Daily change cap" },
    body: { tr: "Bir günde yapılabilecek otomatik fiyat değişikliği sayısını sen belirlersin.", en: "You set how many automatic price changes can happen in a day." },
  },
  {
    title: { tr: "Değişiklik geçmişi ve geri alma", en: "Change log and undo" },
    body: { tr: "Her değişiklik eski ve yeni fiyatıyla kayıtlıdır; tek tıkla geri alırsın.", en: "Every change is logged with its old and new price; undo it in one click." },
  },
  {
    title: { tr: "Her şeyi durdur", en: "Stop everything" },
    body: { tr: "Her ekrandaki düğmeyle fiyat yazımı anında durur; takip ve uyarılar sürer.", en: "A button on every screen halts price writing at once; tracking and alerts keep running." },
  },
  {
    title: { tr: "Günde en fazla %X değişim", en: "Max X% change per day" },
    body: { tr: "Bir ürünün fiyatının bir günde en fazla yüzde kaç oynayabileceğine sınır.", en: "A cap on how far, in percent, a product's price can move in one day." },
    soon: true,
  },
];

type Integration = { name: string; icon?: typeof Mail; role: L; soon?: boolean; href?: string };
const INTEGRATIONS: Integration[] = [
  { name: "Shopify", role: { tr: "Katalog + fiyat yazma", en: "Catalog + price write-back" } },
  { name: "WooCommerce", role: { tr: "Katalog + fiyat yazma", en: "Catalog + price write-back" } },
  { name: "Trendyol", role: { tr: "Rakip fiyat takibi", en: "Rival price tracking" } },
  { name: "Hepsiburada", role: { tr: "Rakip fiyat takibi", en: "Rival price tracking" } },
  { name: "n11", role: { tr: "Rakip fiyat takibi", en: "Rival price tracking" } },
  { name: "Slack", role: { tr: "Uyarılar", en: "Alerts" } },
  { name: "E-posta", icon: Mail, role: { tr: "Uyarılar ve özetler", en: "Alerts and digests" } },
  { name: "ERP", icon: Database, role: { tr: "Stok ve maliyet senkronu", en: "Stock and cost sync" }, soon: true },
  { name: "API & Webhooks", icon: Code2, role: { tr: "Geliştiriciler için", en: "For developers" }, soon: true, href: "/gelistiriciler" },
];

/** "₺1.990" → "₺2.388" (VAT included). Returns null for anything that isn't a lira amount. */
function withKdv(price: string): string | null {
  if (!price.startsWith("₺")) return null;
  const n = Number(price.replace(/[^\d]/g, ""));
  if (!n) return null;
  return `₺${Math.round(n * (1 + KDV_RATE)).toLocaleString("tr-TR")}`;
}

/* ── Small shared pieces ─────────────────────────────────────────────────────── */

function SectionHead({ eyebrow, title, sub, center = true }: { eyebrow?: string; title: string; sub?: string; center?: boolean }) {
  return (
    <div className={cn("max-w-2xl", center && "mx-auto text-center")}>
      {eyebrow && (
        <p className={cn("inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary")}>
          {eyebrow}
        </p>
      )}
      <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance sm:text-[2.75rem] sm:leading-[1.08]">{title}</h2>
      {sub && <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">{sub}</p>}
    </div>
  );
}

/** Main call to action: takes the visitor to the plans. Warm `cta` colour on every background. */
function PrimaryCta({ label, sub }: { label: string; sub: string }) {
  return (
    <Link
      href="/#pricing"
      className="group flex min-h-14 cursor-pointer flex-col items-center justify-center rounded-2xl bg-cta px-6 py-3 text-center shadow-[0_8px_24px_-8px_rgb(249_115_22/0.6)] transition-[filter,transform] duration-200 hover:brightness-95 active:translate-y-px"
    >
      <span className="inline-flex items-center gap-2 text-base font-semibold text-cta-foreground">
        {label} <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
      </span>
      <span className="mt-0.5 text-xs font-medium text-cta-foreground">{sub}</span>
    </Link>
  );
}

/** The demo door. `onInk` styles it as a glass button for the dark bands. */
function DemoCta({ label, sub, onInk = false }: { label: string; sub: string; onInk?: boolean }) {
  return (
    <Link
      href="/demo"
      className={cn(
        "flex min-h-14 cursor-pointer flex-col items-center justify-center rounded-2xl px-6 py-3 text-center transition-colors duration-200",
        onInk ? "glass text-ink-foreground hover:bg-white/10" : "border border-border bg-card hover:bg-muted",
      )}
    >
      <span className="inline-flex items-center gap-2 text-base font-semibold">
        <FlaskConical className={cn("h-4 w-4", onInk ? "text-ink-accent" : "text-primary")} aria-hidden />
        {label}
      </span>
      <span className={cn("mt-0.5 text-xs", onInk ? "text-ink-muted" : "text-muted-foreground")}>{sub}</span>
    </Link>
  );
}

function SoonTag({ tr }: { tr: boolean }) {
  return (
    <span className="rounded-full border border-border px-2 py-0.5 text-xs font-medium text-muted-foreground">{tr ? "Yakında" : "Soon"}</span>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────────── */

const MARKETPLACES = ["Trendyol", "Hepsiburada", "n11", "Shopify", "WooCommerce"];

export function Landing() {
  const { t, lang } = useLang();
  const m = appConfig.marketing;
  const tr = lang === "tr";

  const pricingSub = tr ? "3 paket · teklif formu" : "3 plans · quote form";
  // Two different offers: say plainly the demo never turns into a paid account.
  const demoSub = tr ? "Ücretli hesap oluşturmaz · kayıt yok" : "Never creates a paid account · no signup";
  const lowest = m.pricing[0];
  const [trackF, alertF, repriceF] = FEATURES;

  const ctas = (onInk: boolean) => (
    <div className="grid gap-3 sm:max-w-lg sm:grid-cols-2">
      <PrimaryCta label={t(m.heroCtaPrimary)} sub={pricingSub} />
      <DemoCta label={t(m.heroCtaSecondary)} sub={demoSub} onInk={onInk} />
    </div>
  );

  return (
    <>
      {/* ── 1. HERO: dark ink panel, glass product frame ────────────── */}
      <section className="px-3 pt-3 sm:px-4">
        <div className="mesh relative isolate mx-auto max-w-360 overflow-hidden rounded-4xl text-ink-foreground">
          <div className="grid-lines pointer-events-none absolute inset-0 -z-10" aria-hidden />
          <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] items-center gap-14 px-5 pb-14 pt-16 sm:px-8 sm:pt-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:pb-20">
            <div className="animate-float-up">
              <p className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold text-ink-foreground">
                <span className="relative grid h-2 w-2 place-items-center" aria-hidden>
                  <span className="pulse-ring absolute h-2 w-2 rounded-full bg-cta" />
                  <span className="h-2 w-2 rounded-full bg-cta" />
                </span>
                {tr ? "Türkiye'deki pazaryerleri ve mağazalar için" : "Built for Turkish marketplaces and stores"}
              </p>
              <h1 className="mt-6 max-w-xl font-display text-[2.6rem] font-bold leading-[1.04] tracking-tight text-balance sm:text-6xl">
                {t(m.heroTitle)} <span className="text-cta">{t(m.heroAccent)}</span>
              </h1>
              <p className="mt-6 max-w-prose text-lg leading-relaxed text-ink-muted text-pretty">{t(m.heroSubtitle)}</p>
              <div className="mt-9">{ctas(true)}</div>
              <p className="mt-5 text-sm text-ink-muted">
                {tr
                  ? <>Paketler <span className="tnum font-semibold text-ink-foreground">{t(lowest.price)}</span>/ay + KDV&apos;den başlar · aylık faturalandırılır</>
                  : <>Plans from <span className="tnum font-semibold text-ink-foreground">{t(lowest.price)}</span>/mo · billed monthly</>}
              </p>
            </div>

            <figure className="relative animate-fade-in">
              <div className="glow-shift pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] bg-[radial-gradient(closest-side,rgb(37_99_235/0.55),transparent)] blur-2xl" aria-hidden />
              {/* The preview is a picture of the dashboard, so screen readers get the caption instead of a mock table. */}
              {/* text-foreground: the preview is a light card, so it must not inherit the hero's white text. */}
              <div className="glass rounded-[1.75rem] p-2.5 text-foreground sm:p-3" aria-hidden>
                <ProductPreview />
              </div>
              <figcaption className="sr-only">
                {tr
                  ? "PriceNova panelinden bir görünüm: her ürün için senin fiyatın, rakip fiyatları ve pazardaki konumun."
                  : "A view of the PriceNova dashboard: your price, rival prices and your market position for each product."}
              </figcaption>
            </figure>
          </div>

          {/* Where it works: the real integrations, not customer logos. */}
          <div className="border-t border-white/10">
            <ul
              aria-label={tr ? "Desteklenen pazaryerleri ve mağazalar" : "Supported marketplaces and stores"}
              className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-5 py-6 sm:justify-between sm:px-8"
            >
              {MARKETPLACES.map((name) => (
                <li key={name} className="flex items-center gap-2 text-sm font-semibold text-ink-muted">
                  <BrandGlyph name={name} className="h-5 w-5 text-ink-accent" />
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── 2. INTERACTIVE EXAMPLE ──────────────────────────────────── */}
      <section id="how" className="scroll-mt-24">
        <div className="reveal mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-2">
          <SectionHead
            center={false}
            eyebrow={tr ? "Canlı örnek" : "Live example"}
            title={tr ? "Bir rakip fiyat düşürünce ne olur?" : "What happens when a rival cuts a price?"}
            sub={
              tr
                ? "Rakip indirir, en ucuz olmaktan çıkarsın, kuralın devreye girer ve konumunu geri alırsın. Örnek mağaza verisiyle çalışır; bir adıma tıklayıp durdurabilirsin."
                : "A rival cuts, you stop being cheapest, your rule fires and you win the spot back. Runs on sample store data; click any step to stop there."
            }
          />
          <div className="rounded-[1.75rem] border border-border bg-muted p-2.5 sm:p-3">
            <FlowDemo />
          </div>
        </div>
      </section>

      {/* ── 3. FEATURES: bento grid ─────────────────────────────────── */}
      <section id="features" className="scroll-mt-24 bg-muted">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <div className="reveal">
            <SectionHead eyebrow={tr ? "Özellikler" : "Features"} title={tr ? "Takip et, haberin olsun, fiyatla" : "Track, get alerted, reprice"} />
          </div>

          <ul className="mt-14 grid gap-4 lg:grid-cols-6">
            {/* Tracking: the wide lead tile. */}
            <li className="reveal lift flex flex-col justify-between gap-8 rounded-[1.75rem] border border-border bg-card p-7 lg:col-span-4">
              <div>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
                  <trackF.icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-5 font-display text-2xl font-bold tracking-tight">{t(trackF.title)}</h3>
                <p className="mt-2 max-w-prose leading-relaxed text-muted-foreground">{t(trackF.body)}</p>
              </div>
              <ul className="flex flex-wrap gap-2" aria-label={tr ? "İzlenen bilgiler" : "What's tracked"}>
                {(tr ? ["Fiyat", "Stok", "Kargo", "Barkod eşleşmesi"] : ["Price", "Stock", "Shipping", "Barcode match"]).map((c) => (
                  <li key={c} className="rounded-full border border-border bg-muted px-3 py-1 text-sm font-medium">
                    {c}
                  </li>
                ))}
              </ul>
            </li>

            {/* Alerts: the dark accent tile. */}
            <li className="reveal lift relative flex flex-col overflow-hidden rounded-[1.75rem] bg-ink p-7 text-ink-foreground lg:col-span-2">
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cta/25 blur-3xl" aria-hidden />
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-cta text-cta-foreground">
                <alertF.icon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-5 font-display text-2xl font-bold tracking-tight">{t(alertF.title)}</h3>
              <p className="mt-2 leading-relaxed text-ink-muted">{t(alertF.body)}</p>
            </li>

            {/* Repricing, with the rule written out like the product does. */}
            <li className="reveal lift flex flex-col rounded-[1.75rem] border border-border bg-card p-7 lg:col-span-2">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                <repriceF.icon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-5 font-display text-2xl font-bold tracking-tight">{t(repriceF.title)}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{t(repriceF.body)}</p>
            </li>

            {/* Safety brakes: the wide closing tile. */}
            <li id="control" className="reveal scroll-mt-24 rounded-[1.75rem] border border-primary/25 bg-card p-7 lg:col-span-4">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <History className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <h3 className="font-display text-xl font-bold tracking-tight">{tr ? "Otomatik ama kontrolsüz değil" : "Automatic, never unchecked"}</h3>
                  <p className="text-sm text-muted-foreground">{tr ? "Fiyatına dokunan her şeyin freni sende." : "You hold the brakes on anything that touches your price."}</p>
                </div>
              </div>
              <ul className="mt-6 grid gap-x-6 gap-y-4 sm:grid-cols-2">
                {SAFETY.map((s) => (
                  <li key={s.title.en} className="flex items-start gap-3">
                    {s.soon ? (
                      <Minus className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                    ) : (
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" strokeWidth={3} aria-hidden />
                    )}
                    <span className="text-sm leading-relaxed">
                      <span className="flex flex-wrap items-center gap-2 font-semibold">
                        {t(s.title)} {s.soon && <SoonTag tr={tr} />}
                      </span>
                      <span className="text-muted-foreground">{t(s.body)}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </div>
      </section>

      {/* ── 4. INTEGRATIONS ─────────────────────────────────────────── */}
      <section id="integrations" className="scroll-mt-24">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <div className="reveal">
            <SectionHead
              eyebrow={tr ? "Entegrasyonlar" : "Integrations"}
              title={tr ? "Kullandığın sistemlerle çalışır" : "Works with the tools you use"}
              sub={
                tr
                  ? "Mağazanı bağla, pazaryerlerindeki rakiplerini izle. PriceNova rakibin fiyat düşürdüğünde veya fiyat avantajını kaybettiğinde seni uyarır."
                  : "Connect your store and watch your rivals on the marketplaces. PriceNova alerts you when a rival cuts a price or you lose your price advantage."
              }
            />
          </div>
          <ul className="reveal mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {INTEGRATIONS.map((i) => {
              const body = (
                <>
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-muted">
                    {i.icon ? <i.icon className="h-5 w-5 text-primary" aria-hidden /> : <BrandGlyph name={i.name} className="h-5 w-5 text-primary" />}
                  </span>
                  <span className="mt-3 font-semibold tracking-tight">{i.name}</span>
                  <span className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                    {t(i.role)} {i.soon && <SoonTag tr={tr} />}
                  </span>
                </>
              );
              return (
                <li key={i.name}>
                  {i.href ? (
                    <Link href={i.href} className="lift flex h-full min-h-11 flex-col rounded-2xl border border-dashed border-border bg-card p-4 hover:border-primary">
                      {body}
                    </Link>
                  ) : (
                    <div className={cn("lift flex h-full flex-col rounded-2xl border bg-card p-4", i.soon ? "border-dashed border-border" : "border-border")}>{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ── 5. SOCIAL PROOF (real reviews once there are any; until then, why we don't name customers) ── */}
      {m.reviews.length > 0 ? (
        <Reviews reviews={m.reviews} />
      ) : (
        <section aria-labelledby="privacy-title" className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <div className="reveal mx-auto flex max-w-3xl flex-col gap-4 rounded-[1.75rem] border border-border bg-muted p-7 sm:flex-row sm:items-start">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-card text-primary shadow-soft">
              <LockKeyhole className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h2 id="privacy-title" className="font-display text-lg font-bold tracking-tight">
                {tr ? "Müşteri yorumları ve gizlilik" : "Customer reviews and privacy"}
              </h2>
              <p className="mt-1.5 leading-relaxed text-muted-foreground">
                {tr
                  ? "Fiyat stratejisi bir mağazanın en hassas bilgisidir ve bu sayfayı rakipleri de okuyabilir. Bu yüzden müşterilerimizin adlarını, mağazalarını ve yorumlarını izinleri olmadan paylaşmıyoruz. Kendin görmek için ücretsiz demoyu aç."
                  : "Pricing strategy is a store's most sensitive information, and their competitors can read this page too. So we don't share customer names, stores or reviews without permission. Open the free demo to see for yourself."}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── 6. PRICING: each plan opens the quote form ──────────────── */}
      <section id="pricing" className="scroll-mt-24 bg-muted">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <div className="reveal">
            <SectionHead
              eyebrow={tr ? "Fiyatlar" : "Pricing"}
              title={tr ? "Ürün sayısına göre 3 paket" : "3 plans, by product count"}
              sub={
                tr
                  ? "Sana uyan paketi seç ve formu doldur; seni telefonla ya da e-postayla arayıp kurulumu birlikte planlayalım."
                  : "Pick the plan that fits and fill in the form; we'll call or email you and plan the setup together."
              }
            />
          </div>

          <ul className="mt-14 grid gap-5 lg:grid-cols-3 lg:items-stretch">
            {m.pricing.map((tier) => {
              const inclusive = tr ? withKdv(tier.price.tr) : null;
              const dark = !!tier.featured;
              return (
                <li
                  key={tier.name}
                  className={cn(
                    "reveal lift relative flex flex-col overflow-hidden rounded-[1.75rem] p-8",
                    dark ? "mesh text-ink-foreground shadow-pop lg:-my-4 lg:py-12" : "border border-border bg-card",
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-display text-xl font-bold tracking-tight">{tier.name}</h3>
                    {dark && (
                      <span className="rounded-full bg-cta px-3 py-1 text-xs font-semibold text-cta-foreground">
                        {tr ? "Önerilen" : "Recommended"}
                      </span>
                    )}
                  </div>
                  <p className={cn("mt-2 text-sm", dark ? "text-ink-muted" : "text-muted-foreground")}>{t(tier.tagline)}</p>
                  <p className="mt-6 flex items-baseline gap-1">
                    <span className="tnum text-5xl font-bold tracking-tight">{t(tier.price)}</span>
                    {tier.period && <span className={cn("text-sm", dark ? "text-ink-muted" : "text-muted-foreground")}>{t(tier.period)}</span>}
                  </p>
                  <p className={cn("mt-1.5 text-xs", dark ? "text-ink-muted" : "text-muted-foreground")}>
                    {inclusive ? (
                      <>
                        KDV dahil <span className={cn("tnum font-semibold", dark ? "text-ink-foreground" : "text-foreground")}>{inclusive}</span>/ay · aylık faturalandırılır
                      </>
                    ) : tr ? (
                      "Aylık faturalandırılır"
                    ) : (
                      "Billed monthly · taxes may apply"
                    )}
                  </p>
                  <ul className={cn("mt-7 flex-1 space-y-3 border-t pt-7 text-sm", dark ? "border-white/15" : "border-border")}>
                    {tier.features.map((f) => (
                      <li key={f.en} className="flex items-start gap-2.5">
                        <span className={cn("mt-px grid h-5 w-5 shrink-0 place-items-center rounded-full", dark ? "bg-cta text-cta-foreground" : "bg-success/10 text-success")}>
                          <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
                        </span>
                        {t(f)}
                      </li>
                    ))}
                    {tier.soon?.map((f) => (
                      <li key={f.en} className={cn("flex items-start gap-2.5", dark ? "text-ink-muted" : "text-muted-foreground")}>
                        <Minus className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                        <span>
                          {t(f)} <SoonTag tr={tr} />
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/iletisim?paket=${tier.name}#teklif`}
                    aria-label={tr ? `${tier.name} paketi için teklif al` : `Get a quote for the ${tier.name} plan`}
                    className={cn(
                      "mt-8 inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-2xl text-sm font-semibold transition-[filter,background-color] duration-200",
                      dark ? "bg-cta text-cta-foreground hover:brightness-95" : "bg-ink text-ink-foreground hover:brightness-125",
                    )}
                  >
                    {t(tier.cta)}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Billing facts, stated once, where the decision is made. */}
          <ul className="mx-auto mt-12 grid max-w-4xl gap-x-8 gap-y-2 text-sm text-muted-foreground sm:grid-cols-2">
            {[
              { tr: "Fiyatlar Türk lirasıdır, %20 KDV hariçtir; KDV dahil tutar her planın altında yazar.", en: "Prices in USD; local taxes may apply." },
              { tr: "Aylık peşin faturalandırılır, faturan şirketin adına kesilir.", en: "Billed monthly in advance, invoiced to your company." },
              { tr: "İstediğin an iptal edersin; iptal dönem sonunda geçerli olur.", en: "Cancel any time; it takes effect at the end of the period." },
              { tr: "Teklif formu seni hiçbir ödemeye bağlamaz.", en: "The quote form doesn't commit you to anything." },
            ].map((p) => (
              <li key={p.en} className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={3} aria-hidden />
                {t(p)}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 7. FAQ: heading left, answers right ─────────────────────── */}
      <section id="faq" className="scroll-mt-24">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-24 sm:px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div className="reveal lg:sticky lg:top-28 lg:self-start">
            <SectionHead
              center={false}
              eyebrow="S.S.S."
              title={tr ? "Sıkça sorulanlar" : "Frequently asked"}
              sub={tr ? `Cevabını bulamazsan ${appConfig.company.emails.hello} adresine yaz.` : `Can't find your answer? Write to ${appConfig.company.emails.hello}.`}
            />
          </div>
          <div className="space-y-3">
            {m.faq.map((f) => (
              <details key={f.q.en} className="group rounded-2xl border border-border bg-card transition-colors duration-200 open:border-primary/40 open:bg-muted">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold [&::-webkit-details-marker]:hidden">
                  {t(f.q)}
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-colors duration-200 group-open:border-primary group-open:bg-primary group-open:text-primary-foreground" aria-hidden>
                    <Plus className="h-4 w-4 group-open:hidden" />
                    <Minus className="hidden h-4 w-4 group-open:block" />
                  </span>
                </summary>
                <p className="max-w-prose px-5 pb-5 leading-relaxed text-muted-foreground">{t(f.a)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. CTA: dark closing band ───────────────────────────────── */}
      <section className="px-3 pb-6 sm:px-4">
        <div className="mesh reveal relative isolate mx-auto max-w-360 overflow-hidden rounded-4xl text-ink-foreground">
          <div className="grid-lines pointer-events-none absolute inset-0 -z-10" aria-hidden />
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-8 px-5 py-16 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <h2 className="font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
                {tr ? "Fiyat kararını tahminle değil, veriyle ver." : "Make pricing calls on data, not guesses."}
              </h2>
              <p className="mt-3 text-lg text-ink-muted">
                {tr ? "Paketini seç, formu doldur; gerisini birlikte kuralım." : "Pick a plan, fill in the form; we'll set up the rest together."}
              </p>
            </div>
            <div className="w-full lg:w-auto lg:min-w-[30rem]">{ctas(true)}</div>
          </div>
        </div>
      </section>
    </>
  );
}

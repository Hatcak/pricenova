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
import { TRIAL_DAYS } from "@/lib/trial";

/* ─────────────────────────────────────────────────────────────────────────────
   Homepage copy that doesn't belong in app.config.ts. Everything is { tr, en }.
   House rules for editing: no invented numbers or customers, and nothing on
   this page may promise a feature that isn't built. Unbuilt things carry a
   "Yakında" tag.

   Order: hero → interactive example → 3 features → integrations → social
   proof → pricing → FAQ → CTA. Keep each section short; technical detail
   (stack, API) lives on /gelistiriciler, not here.
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
  { name: "Amazon", role: { tr: "Rakip fiyat takibi", en: "Rival price tracking" } },
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
      {eyebrow && <p className="label-mono text-primary">{eyebrow}</p>}
      <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">{title}</h2>
      {sub && <p className="mt-3 text-base leading-relaxed text-muted-foreground text-pretty">{sub}</p>}
    </div>
  );
}

function PrimaryCta({ label, sub }: { label: string; sub: string }) {
  return (
    <Link href="/signup" className="flex min-h-14 flex-col items-center justify-center rounded-xl bg-primary px-5 py-3 text-center transition-opacity hover:opacity-90">
      <span className="inline-flex items-center gap-2 text-base font-semibold text-primary-foreground">
        {label} <ArrowRight className="h-4 w-4" aria-hidden />
      </span>
      <span className="mt-0.5 text-xs text-primary-foreground">{sub}</span>
    </Link>
  );
}

function DemoCta({ label, sub }: { label: string; sub: string }) {
  return (
    <Link href="/demo" className="flex min-h-14 flex-col items-center justify-center rounded-xl border border-border bg-card px-5 py-3 text-center transition-colors hover:bg-muted">
      <span className="inline-flex items-center gap-2 text-base font-semibold">
        <FlaskConical className="h-4 w-4 text-primary" aria-hidden />
        {label}
      </span>
      <span className="mt-0.5 text-xs text-muted-foreground">{sub}</span>
    </Link>
  );
}

function SoonTag({ tr }: { tr: boolean }) {
  return (
    <span className="rounded-full border border-border px-2 py-0.5 text-xs font-medium text-muted-foreground">{tr ? "Yakında" : "Soon"}</span>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────────── */

export function Landing() {
  const { t, lang } = useLang();
  const m = appConfig.marketing;
  const tr = lang === "tr";

  const signupSub = tr ? "Kart istemiyoruz · istediğin an bırak" : "No card · stop any time";
  // Two different offers: say plainly the demo never turns into a paid account.
  const demoSub = tr ? "Ücretli hesap oluşturmaz · kayıt yok" : "Never creates a paid account · no signup";
  const lowest = m.pricing[0];

  const ctas = (
    <div className="grid gap-3 sm:max-w-lg sm:grid-cols-2">
      <PrimaryCta label={t(m.heroCtaPrimary)} sub={signupSub} />
      <DemoCta label={t(m.heroCtaSecondary)} sub={demoSub} />
    </div>
  );

  return (
    <>
      {/* ── 1. HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10" style={{ background: "var(--grad-hero)" }} aria-hidden />
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
              {tr ? `${TRIAL_DAYS} gün ücretsiz deneme · kart gerekmez` : `${TRIAL_DAYS}-day free trial · no card needed`}
            </p>
            <h1 className="mt-5 max-w-xl font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl sm:leading-[1.1]">
              {t(m.heroTitle)} <span className="text-primary">{t(m.heroAccent)}</span>
            </h1>
            <p className="mt-5 max-w-prose text-lg leading-relaxed text-muted-foreground text-pretty">{t(m.heroSubtitle)}</p>
            <div className="mt-8">{ctas}</div>
            <p className="mt-4 text-sm text-muted-foreground">
              {tr
                ? <>Planlar <span className="tnum font-semibold text-foreground">{t(lowest.price)}</span>/ay + KDV&apos;den başlar · aylık faturalandırılır</>
                : <>Plans from <span className="tnum font-semibold text-foreground">{t(lowest.price)}</span>/mo · billed monthly</>}
            </p>
          </div>

          <figure>
            {/* The preview is a picture of the dashboard, so screen readers get the caption instead of a mock table. */}
            <div aria-hidden>
              <ProductPreview />
            </div>
            <figcaption className="sr-only">
              {tr
                ? "PriceNova panelinden bir görünüm: her ürün için senin fiyatın, rakip fiyatları ve pazardaki konumun."
                : "A view of the PriceNova dashboard: your price, rival prices and your market position for each product."}
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ── 2. INTERACTIVE EXAMPLE ──────────────────────────────────── */}
      <section id="how" className="scroll-mt-20 border-y border-border bg-muted">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
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
          <FlowDemo />
        </div>
      </section>

      {/* ── 3. THREE FEATURES + SAFETY ──────────────────────────────── */}
      <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6">
        <SectionHead title={tr ? "Takip et, haberin olsun, fiyatla" : "Track, get alerted, reprice"} />
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {FEATURES.map((f) => (
            <li key={f.title.en} className="rounded-2xl border border-border bg-card p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">{t(f.title)}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{t(f.body)}</p>
            </li>
          ))}
        </ul>

        <div id="control" className="mt-5 scroll-mt-20 rounded-2xl border border-primary/30 bg-primary/5 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground">
              <History className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h3 className="text-lg font-semibold tracking-tight">{tr ? "Otomatik ama kontrolsüz değil" : "Automatic, never unchecked"}</h3>
              <p className="text-sm text-muted-foreground">{tr ? "Fiyatına dokunan her şeyin freni sende." : "You hold the brakes on anything that touches your price."}</p>
            </div>
          </div>
          <ul className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {SAFETY.map((s) => (
              <li key={s.title.en} className="flex items-start gap-3">
                {s.soon ? (
                  <Minus className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                ) : (
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" strokeWidth={3} aria-hidden />
                )}
                <span className="text-sm leading-relaxed">
                  <span className="flex flex-wrap items-center gap-2 font-medium">
                    {t(s.title)} {s.soon && <SoonTag tr={tr} />}
                  </span>
                  <span className="text-muted-foreground">{t(s.body)}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 4. INTEGRATIONS ─────────────────────────────────────────── */}
      <section id="integrations" className="scroll-mt-20 border-y border-border bg-muted">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <SectionHead
            title={tr ? "Kullandığın sistemlerle çalışır" : "Works with the tools you use"}
            sub={
              tr
                ? "Mağazanı bağla, pazaryerlerindeki rakiplerini izle. PriceNova rakibin fiyat düşürdüğünde veya fiyat avantajını kaybettiğinde seni uyarır."
                : "Connect your store and watch your rivals on the marketplaces. PriceNova alerts you when a rival cuts a price or you lose your price advantage."
            }
          />
          <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {INTEGRATIONS.map((i) => {
              const body = (
                <>
                  <span className="flex items-center gap-2">
                    {i.icon ? <i.icon className="h-5 w-5 shrink-0 text-primary" aria-hidden /> : <BrandGlyph name={i.name} className="h-5 w-5 shrink-0 text-primary" />}
                    <span className="font-semibold tracking-tight">{i.name}</span>
                  </span>
                  <span className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                    {t(i.role)} {i.soon && <SoonTag tr={tr} />}
                  </span>
                </>
              );
              return (
                <li key={i.name}>
                  {i.href ? (
                    <Link href={i.href} className="flex h-full min-h-11 flex-col rounded-xl border border-dashed border-border bg-card p-4 transition-colors hover:border-primary">
                      {body}
                    </Link>
                  ) : (
                    <div className={cn("flex h-full flex-col rounded-xl border bg-card p-4", i.soon ? "border-dashed border-border" : "border-border")}>{body}</div>
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
        <section aria-labelledby="privacy-title" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-start">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <LockKeyhole className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h2 id="privacy-title" className="font-semibold tracking-tight">
                {tr ? "Müşteri yorumları ve gizlilik" : "Customer reviews and privacy"}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {tr
                  ? "Fiyat stratejisi bir mağazanın en hassas bilgisidir ve bu sayfayı rakipleri de okuyabilir. Bu yüzden müşterilerimizin adlarını, mağazalarını ve yorumlarını izinleri olmadan paylaşmıyoruz. Kendin görmek için ücretsiz demoyu aç."
                  : "Pricing strategy is a store's most sensitive information, and their competitors can read this page too. So we don't share customer names, stores or reviews without permission. Open the free demo to see for yourself."}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── 6. PRICING ──────────────────────────────────────────────── */}
      <section id="pricing" className="scroll-mt-20 border-t border-border bg-muted">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <SectionHead
            title={tr ? "Ürün sayısına göre basit fiyat" : "Simple pricing by product count"}
            sub={
              tr
                ? `Her plan ${TRIAL_DAYS} gün ücretsiz başlar. Kart istemiyoruz; süre dolunca otomatik ücret alınmaz.`
                : `Every plan starts with ${TRIAL_DAYS} free days. No card; nothing is charged automatically when it ends.`
            }
          />

          <ul className="mt-10 grid gap-5 lg:grid-cols-3">
            {m.pricing.map((tier) => {
              const inclusive = tr ? withKdv(tier.price.tr) : null;
              return (
                <li
                  key={tier.name}
                  className={cn(
                    "flex flex-col rounded-2xl border bg-card p-7",
                    tier.featured ? "border-primary shadow-pop ring-1 ring-primary" : "border-border",
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold tracking-tight">{tier.name}</h3>
                    {tier.featured && (
                      <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
                        {tr ? "Önerilen" : "Recommended"}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 flex items-baseline gap-1">
                    <span className="tnum text-4xl font-bold tracking-tight">{t(tier.price)}</span>
                    {tier.period && <span className="text-sm text-muted-foreground">{t(tier.period)}</span>}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {inclusive ? (
                      <>
                        KDV dahil <span className="tnum font-semibold text-foreground">{inclusive}</span>/ay · aylık faturalandırılır
                      </>
                    ) : tr ? (
                      "Aylık faturalandırılır"
                    ) : (
                      "Billed monthly · taxes may apply"
                    )}
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground">{t(tier.tagline)}</p>
                  <ul className="mt-6 flex-1 space-y-3 text-sm">
                    {tier.features.map((f) => (
                      <li key={f.en} className="flex items-start gap-2.5">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" strokeWidth={3} aria-hidden />
                        {t(f)}
                      </li>
                    ))}
                    {tier.soon?.map((f) => (
                      <li key={f.en} className="flex items-start gap-2.5 text-muted-foreground">
                        <Minus className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                        <span>
                          {t(f)} <SoonTag tr={tr} />
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/signup"
                    className={cn(
                      "mt-7 inline-flex h-12 items-center justify-center rounded-xl text-sm font-semibold transition-opacity",
                      tier.featured
                        ? "bg-primary text-primary-foreground hover:opacity-90"
                        : "border border-border bg-card hover:bg-muted",
                    )}
                  >
                    {t(tier.cta)}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Billing facts, stated once, where the decision is made. */}
          <ul className="mx-auto mt-8 grid max-w-4xl gap-x-8 gap-y-2 text-sm text-muted-foreground sm:grid-cols-2">
            {[
              { tr: "Fiyatlar Türk lirasıdır, %20 KDV hariçtir; KDV dahil tutar her planın altında yazar.", en: "Prices in USD; local taxes may apply." },
              { tr: "Aylık peşin faturalandırılır, faturan şirketin adına kesilir.", en: "Billed monthly in advance, invoiced to your company." },
              { tr: "İstediğin an iptal edersin; iptal dönem sonunda geçerli olur.", en: "Cancel any time; it takes effect at the end of the period." },
              { tr: "Deneme bitince panel kilitlenir, verilerin silinmez.", en: "When the trial ends the panel locks; nothing is deleted." },
            ].map((p) => (
              <li key={p.en} className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={3} aria-hidden />
                {t(p)}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 7. FAQ ──────────────────────────────────────────────────── */}
      <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-16 sm:px-6">
        <SectionHead
          title={tr ? "Sıkça sorulanlar" : "Frequently asked"}
          sub={tr ? `Cevabını bulamazsan ${appConfig.company.emails.hello} adresine yaz.` : `Can't find your answer? Write to ${appConfig.company.emails.hello}.`}
        />
        <div className="mt-10 space-y-3">
          {m.faq.map((f) => (
            <details key={f.q.en} className="group rounded-xl border border-border bg-card">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-3 font-medium [&::-webkit-details-marker]:hidden">
                {t(f.q)}
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-border text-muted-foreground group-open:border-primary group-open:bg-primary group-open:text-primary-foreground" aria-hidden>
                  <Plus className="h-4 w-4 group-open:hidden" />
                  <Minus className="hidden h-4 w-4 group-open:block" />
                </span>
              </summary>
              <p className="max-w-prose px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{t(f.a)}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── 8. CTA ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-12 sm:px-10">
          <div className="pointer-events-none absolute inset-0" style={{ background: "var(--grad-hero)" }} aria-hidden />
          <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-balance sm:text-3xl">
                {tr ? "Fiyat kararını tahminle değil, veriyle ver." : "Make pricing calls on data, not guesses."}
              </h2>
              <p className="mt-2 text-muted-foreground">
                {tr ? `${TRIAL_DAYS} gün ücretsiz, kart istemiyoruz.` : `${TRIAL_DAYS} days free, no card.`}
              </p>
            </div>
            <div className="w-full lg:w-auto lg:min-w-[30rem]">{ctas}</div>
          </div>
        </div>
      </section>
    </>
  );
}

"use client";

import Link from "next/link";
import {
  ArrowRight,
  Barcode,
  Check,
  FlaskConical,
  Handshake,
  Minus,
  MousePointerClick,
  OctagonX,
  Plus,
  Quote,
  SearchCheck,
  Tags,
  Undo2,
} from "lucide-react";
import appConfig from "@/app.config";
import { Icon } from "@/components/ui/icon";
import { FlowDemo } from "@/components/marketing/flow-demo";
import { ProductPreview, CompanyMark } from "@/components/marketing/marks";
import { Reviews } from "@/components/marketing/reviews";
import { ProductTour } from "@/components/marketing/product-tour";
import { useLang } from "@/components/i18n/language-provider";
import { cn } from "@/lib/utils";
import type { L } from "@/lib/i18n/config";
import { TRIAL_DAYS } from "@/lib/trial";

/* ─────────────────────────────────────────────────────────────────────────────
   Homepage copy that doesn't belong in app.config.ts. Everything is { tr, en }.
   House rules for editing: no em dashes, no invented numbers or customers, and
   nothing on this page may promise a feature that isn't built.
   ───────────────────────────────────────────────────────────────────────────── */

/** Platforms PriceNova connects to. Real product names, not customers. */
const PLATFORMS = ["Shopify", "WooCommerce", "Amazon", "Trendyol", "Hepsiburada", "n11", "Slack"];

const HOW_STEPS: { icon: string; title: L; body: L }[] = [
  {
    icon: "package-plus",
    title: { tr: "Ürünlerini ekle", en: "Add your products" },
    body: { tr: "Kataloğunu Shopify ya da WooCommerce'ten içe aktar, ya da SKU ve maliyetlerle elle ekle.", en: "Import your catalog from Shopify or WooCommerce, or add SKUs and costs by hand." },
  },
  {
    icon: "radar",
    title: { tr: "Rakipleri eşleştir", en: "Match competitors" },
    body: { tr: "Barkod ve model koduna göre eşleştirme önerileri gelir; emin olmadıklarımızı sen onaylarsın.", en: "Match suggestions arrive by barcode and model code; you approve the ones we're unsure of." },
  },
  {
    icon: "activity",
    title: { tr: "İzle", en: "Monitor" },
    body: { tr: "PriceNova fiyatları paketinin sıklığında tarar; geride kaldığında ya da bir rakip indirdiğinde uyarır.", en: "PriceNova scans at your plan's frequency and alerts you when you fall behind or a rival cuts." },
  },
  {
    icon: "wand-sparkles",
    title: { tr: "Fiyatlandır", en: "Reprice" },
    body: { tr: "Kuralın devreye girer ve yeni fiyatı mağazana yazar (Shopify, WooCommerce). Taban ve tavan sınırının dışına çıkmaz.", en: "Your rule fires and writes the new price to your store (Shopify, WooCommerce), never outside your floor and ceiling." },
  },
];

/**
 * The four ways a competitor listing gets tied to one of your products, in the
 * order we try them. Only the third one is a guess, and it's the only one that
 * waits for a human.
 */
const MATCH_LADDER: { key: string; icon: typeof Barcode; title: L; body: L; certainty: L; needsYou?: boolean }[] = [
  {
    key: "gtin",
    icon: Barcode,
    title: { tr: "Barkod", en: "Barcode" },
    body: { tr: "İki ilanda da aynı barkod (GTIN/EAN) varsa bu aynı üründür. Tartışmaya gerek yok.", en: "If both listings carry the same barcode (GTIN/EAN), it's the same product. Nothing to debate." },
    certainty: { tr: "Kesin", en: "Certain" },
  },
  {
    key: "model",
    icon: Tags,
    title: { tr: "Marka + model kodu", en: "Brand + model code" },
    body: { tr: "Barkod yoksa üreticinin model koduna bakarız. Renk ve beden varyantlarını ayrı tutarız.", en: "With no barcode we look for the manufacturer's model code, keeping colour and size variants apart." },
    certainty: { tr: "Çok güçlü", en: "Very strong" },
  },
  {
    key: "title",
    icon: SearchCheck,
    title: { tr: "Ürün adı benzerliği", en: "Title similarity" },
    body: { tr: "Son çare: ad, varyant ve fiyat aralığı karşılaştırılır. Yanılabilir, bu yüzden doğrudan uygulanmaz.", en: "Last resort: title, variant and price range are compared. It can be wrong, so it's never applied directly." },
    certainty: { tr: "Onayını bekler", en: "Waits for your approval" },
    needsYou: true,
  },
  {
    key: "manual",
    icon: MousePointerClick,
    title: { tr: "Senin elinle", en: "By your own hand" },
    body: { tr: "Rakip ürünün bağlantısını kendin yapıştırırsın. Hiçbir şey tahmin edilmez.", en: "You paste the rival's product link yourself. Nothing is guessed." },
    certainty: { tr: "Kesin", en: "Certain" },
  },
];

/** The three brakes on automatic repricing. */
const SAFETY: { icon: typeof Handshake; title: L; body: L }[] = [
  {
    icon: Handshake,
    title: { tr: "Önce bana sor", en: "Ask me first" },
    body: {
      tr: "Her kuralı \"önce öner, ben onaylayayım\" moduna alabilirsin. PriceNova önerisini yeni kâr marjınla birlikte onay kuyruğuna bırakır; sen onaylamadan hiçbir şey değişmez.",
      en: "Any rule can suggest instead of act. PriceNova leaves its proposal in your approval queue with the margin it would leave you, and nothing changes until you say yes.",
    },
  },
  {
    icon: Undo2,
    title: { tr: "Tek tıkla eski fiyat", en: "One click back" },
    body: {
      tr: "Otomatik yapılan her değişiklikte önceki fiyat saklanır. Bir hata fark edersen tek tek ya da hepsini birden geri alırsın.",
      en: "Every automatic change keeps the price it replaced. Spot a mistake and restore it, one at a time or all at once.",
    },
  },
  {
    icon: OctagonX,
    title: { tr: "Her şeyi durdur", en: "Stop everything" },
    body: {
      tr: "Panelin üst barında, her ekranda duran bir durdurma düğmesi. Bastığın an hiçbir kural fiyatına dokunamaz; takip ve uyarılar çalışmaya devam eder.",
      en: "A stop button in the top bar of every screen. Press it and no rule can touch a price; tracking and alerts keep running.",
    },
  },
];

/**
 * Typical ways the product is used. These are illustrations of the product,
 * not customer stories, and the section says so on screen. No names, no
 * results we can't back up.
 */
const SCENARIOS: { icon: string; who: L; situation: L; setup: L; outcome: L }[] = [
  {
    icon: "store",
    who: { tr: "Pazaryeri satıcısı", en: "Marketplace seller" },
    situation: { tr: "Trendyol ve Hepsiburada'da 200 ürün satıyor. Aynı ürünü satan onlarca satıcı var.", en: "Sells 200 products on Trendyol and Hepsiburada, with dozens of sellers on the same listings." },
    setup: { tr: "Her ürün için en ucuz rakibi izliyor; en ucuz konumu kaybedince e-posta uyarısı alıyor.", en: "Watches the cheapest rival on each product and gets an email when the cheapest spot is lost." },
    outcome: { tr: "Pazaryerinde fiyatı yine kendisi giriyor, ama ne zaman ve ne kadar değiştireceğini artık tahmin etmiyor.", en: "Still enters marketplace prices by hand, but no longer guesses when or by how much." },
  },
  {
    icon: "shopping-cart",
    who: { tr: "Kendi markasını satan mağaza", en: "Brand with its own store" },
    situation: { tr: "Shopify'da kendi sitesinden satıyor. Birkaç büyük rakip sık sık kampanya yapıyor.", en: "Sells from its own Shopify site. A few large rivals run frequent campaigns." },
    setup: { tr: "\"En düşüğü %1 geç\" kuralı, maliyet +%15 tabanıyla, otomatik uygula modunda.", en: "A \"beat lowest by 1%\" rule with a cost +15% floor, set to apply automatically." },
    outcome: { tr: "Rakip indirdiğinde fiyat tabanın altına inmeden güncelleniyor. Taban delinirse kural durup haber veriyor.", en: "When a rival cuts, the price updates without crossing the floor. If the floor would break, the rule stops and says so." },
  },
  {
    icon: "package",
    who: { tr: "Geniş kataloglu distribütör", en: "Distributor with a large catalog" },
    situation: { tr: "Yedek parça gibi birbirine çok benzeyen binlerce ürün satıyor.", en: "Sells thousands of near-identical products, like spare parts." },
    setup: { tr: "Eşleştirme barkodla yapılıyor; bütün kurallar \"önce bana sor\" modunda.", en: "Matching runs on barcodes; every rule is on \"ask me first\"." },
    outcome: { tr: "Sabahları onay kuyruğundaki önerileri yeni marjıyla birlikte görüyor, onaylıyor ya da reddediyor.", en: "Each morning reviews the suggestions in the approval queue with their new margin, and approves or rejects them." },
  },
];

/**
 * Comparison table, grouped by the job being done. Every PriceNova value is a
 * feature shown elsewhere on this page; keep it that way when editing.
 * `true` = check, `false` = dash, text = a concrete answer.
 */
type CompareValue = boolean | L;
type CompareRow = { feature: L; hint: L; manual: CompareValue; sheets: CompareValue; pw: CompareValue };
const COMPARE_GROUPS: { title: L; rows: CompareRow[] }[] = [
  {
    title: { tr: "Veriyi toplamak", en: "Collecting the data" },
    rows: [
      { feature: { tr: "Rakip fiyatlarını toplama", en: "Collecting rival prices" }, hint: { tr: "Her rakip sayfası, her ürün için", en: "Every rival page, for every product" }, manual: { tr: "Sekme sekme", en: "Tab by tab" }, sheets: { tr: "Kopyala-yapıştır", en: "Copy-paste" }, pw: { tr: "Otomatik, dakikada bire kadar", en: "Automatic, up to every minute" } },
      { feature: { tr: "Doğru ürünü eşleştirme", en: "Matching the right product" }, hint: { tr: "Aksesuar ya da farklı varyant karışmasın", en: "No accessories or wrong variants" }, manual: { tr: "Göz kararı", en: "By eye" }, sheets: { tr: "Göz kararı", en: "By eye" }, pw: { tr: "Barkod + model kodu", en: "Barcode + model code" } },
      { feature: { tr: "Fiyat geçmişi", en: "Price history" }, hint: { tr: "Kim, ne zaman, ne kadar indirdi", en: "Who cut, when, and by how much" }, manual: false, sheets: { tr: "Elle tutulursa", en: "If you log it" }, pw: { tr: "Grafikli", en: "Charted" } },
    ],
  },
  {
    title: { tr: "Harekete geçmek", en: "Acting on it" },
    rows: [
      { feature: { tr: "Geride kalınca uyarı", en: "Alert when you're undercut" }, hint: { tr: "Rakip indirim yaptığı an", en: "The moment a rival cuts" }, manual: false, sheets: false, pw: { tr: "E-posta + Slack", en: "Email + Slack" } },
      { feature: { tr: "Otomatik yeniden fiyatlandırma", en: "Automatic repricing" }, hint: { tr: "Senin kurallarınla", en: "Within your rules" }, manual: false, sheets: false, pw: true },
      { feature: { tr: "Yeni fiyatı mağazaya yazma", en: "Writing the new price to your store" }, hint: { tr: "Tek tek güncellemeden", en: "Without editing prices one by one" }, manual: { tr: "Tek tek", en: "One by one" }, sheets: { tr: "Tek tek", en: "One by one" }, pw: { tr: "Shopify · WooCommerce", en: "Shopify · WooCommerce" } },
    ],
  },
  {
    title: { tr: "Kontrolü elde tutmak", en: "Staying in control" },
    rows: [
      { feature: { tr: "Marj koruması", en: "Margin protection" }, hint: { tr: "Zararına satışı engeller", en: "Stops you selling at a loss" }, manual: { tr: "Akılda", en: "In your head" }, sheets: { tr: "Formülle", en: "With a formula" }, pw: { tr: "Taban + tavan kuralı", en: "Floor + ceiling rule" } },
      { feature: { tr: "Önce bana sor modu", en: "Ask-me-first mode" }, hint: { tr: "Değişiklik onayınla uygulanır", en: "Changes wait for your approval" }, manual: false, sheets: false, pw: true },
      { feature: { tr: "Hatalı değişikliği geri alma", en: "Undoing a bad change" }, hint: { tr: "Yanlış kural, yanlış fiyat", en: "Wrong rule, wrong price" }, manual: { tr: "Hatırlarsan", en: "If you remember" }, sheets: { tr: "Hatırlarsan", en: "If you remember" }, pw: { tr: "Tek tıkla", en: "One click" } },
    ],
  },
];

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

/* ── Page ────────────────────────────────────────────────────────────────────── */

export function Landing() {
  const { t, lang } = useLang();
  const m = appConfig.marketing;
  const tr = lang === "tr";

  const signupSub = tr ? `${TRIAL_DAYS} gün ücretsiz · kart istemiyoruz` : `Free for ${TRIAL_DAYS} days · no card`;
  const demoSub = tr ? "Örnek mağaza · kayıt gerekmez" : "Sample store · no signup";

  return (
    <>
      {/* ── 1. HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10" style={{ background: "var(--grad-hero)" }} aria-hidden />
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
              {t(m.badge)}
            </p>
            <h1 className="mt-5 max-w-xl font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl sm:leading-[1.1]">
              {t(m.heroTitle)} <span className="text-primary">{t(m.heroAccent)}</span>
            </h1>
            <p className="mt-5 max-w-prose text-lg leading-relaxed text-muted-foreground text-pretty">{t(m.heroSubtitle)}</p>

            {/* Two doors, deliberately different: an account of your own, or the sample workspace without one. */}
            <div className="mt-8 grid gap-3 sm:max-w-lg sm:grid-cols-2">
              <PrimaryCta label={t(m.heroCtaPrimary)} sub={signupSub} />
              <DemoCta label={t(m.heroCtaSecondary)} sub={demoSub} />
            </div>
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

      {/* ── 2. PLATFORMS ────────────────────────────────────────────── */}
      <section aria-labelledby="platforms-title" className="border-y border-border bg-muted">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <h2 id="platforms-title" className="text-center text-sm font-medium text-muted-foreground">
            {tr
              ? "Bu platformlardaki ürünlerini izler, uyarıları e-posta ve Slack'e gönderir"
              : "Watches your products on these platforms and sends alerts to email and Slack"}
          </h2>
          <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 sm:gap-x-10">
            {PLATFORMS.map((p) => (
              <li key={p}>
                <CompanyMark name={p} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 3. SCENARIO ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHead
              center={false}
              eyebrow={tr ? "Nasıl işler" : "In action"}
              title={tr ? "Bir rakip fiyat düşürünce ne olur?" : "What happens when a rival drops a price?"}
              sub={
                tr
                  ? "Rakip indirir, sen en ucuz olmaktan çıkarsın, kuralın devreye girer ve konumunu geri alırsın. Sağdaki canlandırma örnek mağaza verisiyle çalışır; bir adıma tıklayarak durdurabilirsin."
                  : "A rival cuts, you stop being cheapest, your rule fires and you win the spot back. The walkthrough on the right runs on sample store data; click any step to stop it there."
              }
            />
          </div>
          <FlowDemo />
        </div>
      </section>

      {/* ── SCREEN TOUR ─────────────────────────────────────────────── */}
      <ProductTour />

      {/* ── 4. FEATURES ─────────────────────────────────────────────── */}
      <section id="features" className="scroll-mt-20 border-t border-border bg-muted">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHead
            title={tr ? "Takipten fiyatlandırmaya, tek panel" : "From tracking to repricing, one panel"}
            sub={tr ? "Rakip fiyatını bilmek, geride kaldığını fark etmek ve buna göre davranmak için gerekenler." : "What it takes to know rival prices, notice when you fall behind, and act on it."}
          />
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {m.features.map((f) => (
              <li key={f.title.en} className="rounded-2xl border border-border bg-card p-6">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon name={f.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg font-semibold tracking-tight">{t(f.title)}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{t(f.body)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 5. MATCHING ─────────────────────────────────────────────── */}
      <section id="matching" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
        <SectionHead
          eyebrow={tr ? "Eşleştirme" : "Matching"}
          title={tr ? "Doğru ürünü doğru rakiple karşılaştırırız" : "The right product, compared with the right rival"}
          sub={
            tr
              ? "Yanlış eşleşme, ona dayanan her fiyat kararını bozar. Bu yüzden dört yöntemi sırayla deneriz ve tahmine dayananı sana sormadan kullanmayız."
              : "A wrong match corrupts every pricing decision built on it. So we try four methods in order, and never use a guess without asking you."
          }
        />
        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MATCH_LADDER.map((step, i) => (
            <li key={step.key} className={cn("rounded-2xl border bg-card p-5", step.needsYou ? "border-warning" : "border-border")}>
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <step.icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="tnum text-xs font-bold text-muted-foreground">{`0${i + 1}`}</span>
              </div>
              <h3 className="mt-4 font-semibold tracking-tight">{t(step.title)}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{t(step.body)}</p>
              <span
                className={cn(
                  "mt-3 inline-block rounded-full px-2.5 py-1 text-xs font-semibold",
                  step.needsYou ? "bg-warning/10 text-warning" : "bg-success/10 text-success",
                )}
              >
                {t(step.certainty)}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* ── 6. CONTROL ──────────────────────────────────────────────── */}
      <section id="control" className="scroll-mt-20 border-t border-border bg-muted">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHead
            eyebrow={tr ? "Kontrol" : "Control"}
            title={tr ? "Son söz her zaman sende" : "You always have the last word"}
            sub={
              tr
                ? "Otomatik fiyatlandırmayı açmak kontrolü devretmek demek değil. Üç güvenlik düğmesi her zaman elinin altında."
                : "Turning on automatic repricing doesn't mean handing over the keys. Three safety controls are always within reach."
            }
          />
          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {SAFETY.map((s) => (
              <li key={s.title.en} className="rounded-2xl border border-border bg-card p-6">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                  <s.icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-lg font-semibold tracking-tight">{t(s.title)}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{t(s.body)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 7. HOW IT WORKS ─────────────────────────────────────────── */}
      <section id="how" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
        <SectionHead
          title={tr ? "Dört adımda başla" : "Up and running in four steps"}
          sub={tr ? "Ekle, eşleştir, izle, fiyatlandır." : "Add, match, monitor, reprice."}
        />
        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {HOW_STEPS.map((s, i) => (
            <li key={s.title.en} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon name={s.icon} className="h-5 w-5" />
                </span>
                <span className="tnum text-2xl font-bold text-muted-foreground" aria-hidden>{`0${i + 1}`}</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">{t(s.title)}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{t(s.body)}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── 8. USAGE SCENARIOS (+ real customer stories, once there are any) ── */}
      <section className="border-t border-border bg-muted">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHead
            eyebrow={tr ? "Örnek kullanım" : "Example setups"}
            title={tr ? "PriceNova'yı kimler, nasıl kullanır?" : "Who uses PriceNova, and how?"}
            sub={
              tr
                ? "Bunlar müşteri hikâyesi değil; ürünün tipik kullanım biçimleri. Sana en yakın olanı demo panelinde deneyebilirsin."
                : "These aren't customer stories; they're typical ways the product is set up. Try the one closest to you in the demo panel."
            }
          />
          <ul className="mt-12 grid gap-5 lg:grid-cols-3">
            {SCENARIOS.map((s) => (
              <li key={s.who.en} className="flex flex-col rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon name={s.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-semibold tracking-tight">{t(s.who)}</h3>
                </div>
                <dl className="mt-5 space-y-4 text-sm leading-relaxed">
                  <div>
                    <dt className="label-mono text-muted-foreground">{tr ? "Durum" : "Situation"}</dt>
                    <dd className="mt-1">{t(s.situation)}</dd>
                  </div>
                  <div>
                    <dt className="label-mono text-muted-foreground">{tr ? "Ayar" : "Setup"}</dt>
                    <dd className="mt-1">{t(s.setup)}</dd>
                  </div>
                  <div>
                    <dt className="label-mono text-primary">{tr ? "Sonuç" : "Outcome"}</dt>
                    <dd className="mt-1">{t(s.outcome)}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>

          {m.caseStudies.length > 0 && (
            <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {m.caseStudies.map((cs) => (
                <li key={cs.brand}>
                  <figure className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-display font-bold tracking-tight">{cs.brand}</span>
                      <span className="tnum rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">{t(cs.result)}</span>
                    </div>
                    <Quote className="mt-5 h-5 w-5 text-primary" aria-hidden />
                    <blockquote className="mt-3 flex-1 text-sm leading-relaxed">{t(cs.quote)}</blockquote>
                    <figcaption className="mt-5 border-t border-border pt-4 text-sm">
                      <span className="font-semibold">{cs.author}</span>
                      <span className="text-muted-foreground"> · {t(cs.role)} · {cs.brand}</span>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* ── REVIEWS (hidden until there are real ones) ──────────────── */}
      <Reviews reviews={m.reviews} />

      {/* ── 9. COMPARISON ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <SectionHead
          title={tr ? "Neden PriceNova?" : "Why PriceNova?"}
          sub={tr ? "Rakip fiyatını takip etmenin üç yolu, yan yana." : "Three ways to keep up with rival prices, side by side."}
        />
        <div className="mt-12 overflow-hidden rounded-2xl border border-border bg-card">
          {/* Phones: one card per row so the PriceNova answer is never off-screen. */}
          <div className="sm:hidden">
            {COMPARE_GROUPS.map((group) => (
              <div key={group.title.en}>
                <h3 className="label-mono border-b border-border bg-muted px-4 py-2 text-muted-foreground">{t(group.title)}</h3>
                {group.rows.map((row) => (
                  <div key={row.feature.en} className="border-b border-border px-4 py-4">
                    <p className="font-medium">{t(row.feature)}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{t(row.hint)}</p>
                    <dl className="mt-3 grid grid-cols-[1fr_1fr_1.4fr] gap-2 text-center">
                      <div className="rounded-lg bg-muted px-1.5 py-2">
                        <dt className="text-xs text-muted-foreground">{tr ? "Elle" : "Manual"}</dt>
                        <dd className="mt-1"><CompareMark value={row.manual} tr={tr} /></dd>
                      </div>
                      <div className="rounded-lg bg-muted px-1.5 py-2">
                        <dt className="text-xs text-muted-foreground">{tr ? "Tablo" : "Sheets"}</dt>
                        <dd className="mt-1"><CompareMark value={row.sheets} tr={tr} /></dd>
                      </div>
                      <div className="rounded-lg bg-primary/10 px-1.5 py-2">
                        <dt className="text-xs font-semibold text-primary">{appConfig.name}</dt>
                        <dd className="mt-1"><CompareMark value={row.pw} tr={tr} highlight /></dd>
                      </div>
                    </dl>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full min-w-[36rem] text-sm">
              <caption className="sr-only">{tr ? "Rakip fiyat takibinin üç yolu" : "Three ways to track rival prices"}</caption>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="w-[34%] px-5 py-4 text-left">
                    <span className="sr-only">{tr ? "Özellik" : "Feature"}</span>
                  </th>
                  <th scope="col" className="w-[20%] px-4 py-4 text-center align-bottom">
                    <span className="block font-semibold">{tr ? "Elle kontrol" : "Manual checking"}</span>
                    <span className="mt-0.5 block text-xs font-normal text-muted-foreground">{tr ? "Tarayıcı sekmeleri" : "Browser tabs"}</span>
                  </th>
                  <th scope="col" className="w-[20%] px-4 py-4 text-center align-bottom">
                    <span className="block font-semibold">{tr ? "Tablolar" : "Spreadsheets"}</span>
                    <span className="mt-0.5 block text-xs font-normal text-muted-foreground">Excel · Sheets</span>
                  </th>
                  <th scope="col" className="w-[26%] border-t-2 border-t-primary bg-primary/10 px-4 py-4 text-center align-bottom">
                    <span className="block font-semibold text-primary">{appConfig.name}</span>
                    <span className="mt-0.5 block text-xs font-normal text-primary">{tr ? "Otomatik" : "Automatic"}</span>
                  </th>
                </tr>
              </thead>
              {COMPARE_GROUPS.map((group) => (
                <tbody key={group.title.en}>
                  <tr className="border-b border-border bg-muted">
                    <th scope="colgroup" colSpan={4} className="px-5 py-2 text-left">
                      <span className="label-mono text-muted-foreground">{t(group.title)}</span>
                    </th>
                  </tr>
                  {group.rows.map((row) => (
                    <tr key={row.feature.en} className="border-b border-border">
                      <th scope="row" className="px-5 py-3.5 text-left font-normal">
                        <span className="block font-medium">{t(row.feature)}</span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">{t(row.hint)}</span>
                      </th>
                      <td className="px-4 py-3.5 text-center"><CompareMark value={row.manual} tr={tr} /></td>
                      <td className="px-4 py-3.5 text-center"><CompareMark value={row.sheets} tr={tr} /></td>
                      <td className="bg-primary/10 px-4 py-3.5 text-center"><CompareMark value={row.pw} tr={tr} highlight /></td>
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
        </div>
      </section>

      {/* ── 10. PRICING ─────────────────────────────────────────────── */}
      <section id="pricing" className="scroll-mt-20 border-t border-border bg-muted">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHead
            title={tr ? "Ürün sayısına göre basit fiyat" : "Simple pricing by product count"}
            sub={tr ? "Sadece izlediğin ürünler için ödersin." : "You only pay for the products you track."}
          />
          <ul className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            {[
              { tr: `${TRIAL_DAYS} gün ücretsiz, tüm özellikler açık`, en: `Free for ${TRIAL_DAYS} days, every feature on` },
              { tr: "Kart istemiyoruz", en: "No card needed" },
              { tr: "Süre dolunca panel kilitlenir, verilerin silinmez", en: "When it ends the panel locks; nothing is deleted" },
            ].map((p) => (
              <li key={p.en} className="inline-flex items-center gap-1.5">
                <Check className="h-4 w-4 shrink-0 text-primary" strokeWidth={3} aria-hidden />
                {t(p)}
              </li>
            ))}
          </ul>

          <ul className="mt-10 grid gap-5 lg:grid-cols-3">
            {m.pricing.map((tier) => (
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
                <p className="mt-1.5 text-sm text-muted-foreground">{t(tier.tagline)}</p>
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
                        {t(f)}{" "}
                        <span className="ml-1 rounded-full border border-border px-2 py-0.5 text-xs font-medium">
                          {tr ? "Yakında" : "Soon"}
                        </span>
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
            ))}
          </ul>
          {tr && <p className="mt-6 text-center text-sm text-muted-foreground">TL fiyatlara KDV dahil değildir.</p>}
        </div>
      </section>

      {/* ── 11. FAQ ─────────────────────────────────────────────────── */}
      <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-20 sm:px-6">
        <SectionHead
          title={tr ? "Sıkça sorulanlar" : "Frequently asked"}
          sub={tr ? `Cevabını bulamazsan hello@${appConfig.domain} adresine yaz.` : `Can't find your answer? Write to hello@${appConfig.domain}.`}
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

      {/* ── 12. FINAL CTA ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-16 text-center sm:px-8">
          <div className="pointer-events-none absolute inset-0" style={{ background: "var(--grad-hero)" }} aria-hidden />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              {tr ? "Fiyat kararını tahminle değil, veriyle ver." : "Make pricing calls on data, not guesses."}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground">
              {tr
                ? "Örnek mağazayla hemen dene ya da kendi ürünlerinle ücretsiz başla."
                : "Try it on the sample store right now, or start free with your own products."}
            </p>
            <div className="mx-auto mt-8 grid max-w-lg gap-3 sm:grid-cols-2">
              <PrimaryCta label={t(m.heroCtaPrimary)} sub={signupSub} />
              <DemoCta label={t(m.heroCtaSecondary)} sub={demoSub} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/** The check / dash / text inside a comparison cell, shared by the table and the phone cards. */
function CompareMark({ value, tr, highlight = false }: { value: CompareValue; tr: boolean; highlight?: boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <span className={cn("mx-auto grid h-6 w-6 place-items-center rounded-full", highlight ? "bg-primary text-primary-foreground" : "bg-success/10 text-success")}>
        <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
        <span className="sr-only">{tr ? "Var" : "Yes"}</span>
      </span>
    ) : (
      <span className="mx-auto grid h-6 w-6 place-items-center rounded-full bg-muted text-muted-foreground">
        <Minus className="h-3.5 w-3.5" aria-hidden />
        <span className="sr-only">{tr ? "Yok" : "No"}</span>
      </span>
    );
  }
  const text = tr ? value.tr : value.en;
  return highlight ? (
    <span className="text-sm font-semibold leading-snug text-primary [overflow-wrap:anywhere]">{text}</span>
  ) : (
    <span className="text-sm leading-snug text-muted-foreground">{text}</span>
  );
}

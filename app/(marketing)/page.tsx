"use client";

import Link from "next/link";
import {
  ArrowRight,
  Check,
  Minus,
  Plus,
  Quote,
  Star,
  Radar,
  BellRing,
  Wand2,
  ShieldCheck,
  Zap,
  Lock,
  ArrowDown,
  ArrowUp,
  Trophy,
  FlaskConical,
  Handshake,
  Undo2,
  OctagonX,
  Barcode,
  Tags,
  SearchCheck,
  MousePointerClick,
} from "lucide-react";
import appConfig from "@/app.config";
import { Icon } from "@/components/ui/icon";
import { FlowDemo } from "@/components/marketing/flow-demo";
import { ProductPreview, CompanyMark } from "@/components/marketing/marks";
import { useLang } from "@/components/i18n/language-provider";
import { cn, formatPrice } from "@/lib/utils";
import type { L } from "@/lib/i18n/config";
import { TRIAL_DAYS } from "@/lib/trial";

/* ─────────────────────────────────────────────────────────────────────────────
   Local bilingual copy that doesn't belong in app.config.ts. Everything here is
   { tr, en } and resolved through the active language via tt().
   ───────────────────────────────────────────────────────────────────────────── */

const HERO_BENEFITS: L[] = [
  { tr: "Paketine göre günde birkaç kez ya da dakikada bir fiyat kontrolü", en: "Prices checked a few times a day, or once a minute — your plan decides" },
  { tr: "Sen düşük kaldığında e-posta ve Slack'e anında uyarı", en: "Get an instant email + Slack alert the moment you're undercut" },
  { tr: "Kurallarınla otomatik yeniden fiyatlandır, marjını koru", en: "Auto-reprice within your rules and protect your margin" },
];

/** Platforms this kit integrates with — real names, not invented customers. */
const TRUSTED = ["Shopify", "WooCommerce", "Amazon", "Trendyol", "Hepsiburada", "n11", "Slack", "Supabase"];

const HOW_STEPS: { n: string; icon: string; title: L; body: L }[] = [
  {
    n: "01",
    icon: "package-plus",
    title: { tr: "Ürünlerini ekle", en: "Add your products" },
    body: { tr: "Kataloğunu Shopify ya da WooCommerce'ten içe aktar; ya da SKU ve maliyetlerle elle ekle.", en: "Import your catalog from Shopify or WooCommerce, or add SKUs and costs by hand." },
  },
  {
    n: "02",
    icon: "radar",
    title: { tr: "Rakipleri eşleştir", en: "Match competitors" },
    body: { tr: "Her ürün için rakip URL'lerini bağla. Otomatik eşleştirme önerileri saniyeler içinde gelir.", en: "Link competitor URLs to each product. Auto-match suggestions arrive in seconds." },
  },
  {
    n: "03",
    icon: "activity",
    title: { tr: "İzle", en: "Monitor" },
    body: { tr: "PriceNova fiyatları sürekli tarar; sen düşük kaldığında ya da bir rakip indirdiğinde uyarır.", en: "PriceNova scans continuously and alerts you when you're undercut or a rival drops." },
  },
  {
    n: "04",
    icon: "wand-sparkles",
    title: { tr: "Yeniden fiyatlandır", en: "Reprice" },
    body: { tr: "Kuralların devreye girer; yeni fiyatı mağazana yazar — taban ve tavan sınırlarına saygıyla.", en: "Your rules fire and write the new price back to your store — respecting your floor and ceiling." },
  },
];

/**
 * Comparison table, grouped by the job being done. Every PriceNova value is a
 * feature shown elsewhere on this page — keep it that way when editing.
 * `true` = check, `false` = dash, text = a concrete answer (a check is added
 * in front of it in the PriceNova column).
 */
type CompareValue = boolean | L | string;
type CompareRow = { feature: L; hint: L; manual: CompareValue; sheets: CompareValue; pw: CompareValue };
const COMPARE_GROUPS: { title: L; rows: CompareRow[] }[] = [
  {
    title: { tr: "Veriyi toplamak", en: "Collecting the data" },
    rows: [
      {
        feature: { tr: "Rakip fiyatlarını toplama", en: "Collecting rival prices" },
        hint: { tr: "Her rakip sayfası, her ürün için", en: "Every rival page, for every product" },
        manual: { tr: "Sekme sekme", en: "Tab by tab" },
        sheets: { tr: "Kopyala-yapıştır", en: "Copy-paste" },
        pw: { tr: "Otomatik, dakikada bire kadar", en: "Automatic, up to every minute" },
      },
      {
        feature: { tr: "Doğru ürünü eşleştirme", en: "Matching the right product" },
        hint: { tr: "Aksesuar ya da farklı varyant karışmasın", en: "No accessories or wrong variants" },
        manual: { tr: "Göz kararı", en: "By eye" },
        sheets: { tr: "Göz kararı", en: "By eye" },
        pw: { tr: "Barkod + model kodu", en: "Barcode + model code" },
      },
      {
        feature: { tr: "Fiyat geçmişi", en: "Price history" },
        hint: { tr: "Kim, ne zaman, ne kadar indirdi", en: "Who cut, when, and by how much" },
        manual: false,
        sheets: { tr: "Elle tutulursa", en: "If you log it" },
        pw: { tr: "Grafikli", en: "Charted" },
      },
    ],
  },
  {
    title: { tr: "Harekete geçmek", en: "Acting on it" },
    rows: [
      {
        feature: { tr: "Ucuzluğu kaybedince uyarı", en: "Alert when you're undercut" },
        hint: { tr: "Rakip indirim yaptığı an", en: "The moment a rival cuts" },
        manual: false,
        sheets: false,
        pw: { tr: "E-posta + Slack", en: "Email + Slack" },
      },
      {
        feature: { tr: "Otomatik yeniden fiyatlandırma", en: "Automatic repricing" },
        hint: { tr: "Senin kurallarınla", en: "Within your rules" },
        manual: false,
        sheets: false,
        pw: true,
      },
      {
        feature: { tr: "Yeni fiyatı mağazaya yazma", en: "Writing the new price to your store" },
        hint: { tr: "Panele girip tek tek güncellemeden", en: "Without editing prices one by one" },
        manual: { tr: "Tek tek", en: "One by one" },
        sheets: { tr: "Tek tek", en: "One by one" },
        pw: { tr: "Shopify · WooCommerce", en: "Shopify · WooCommerce" },
      },
    ],
  },
  {
    title: { tr: "Kontrolü elde tutmak", en: "Staying in control" },
    rows: [
      {
        feature: { tr: "Marj koruması", en: "Margin protection" },
        hint: { tr: "Zararına satışı engeller", en: "Stops you selling at a loss" },
        manual: { tr: "Akılda", en: "In your head" },
        sheets: { tr: "Formülle", en: "With a formula" },
        pw: { tr: "Taban + tavan kuralı", en: "Floor + ceiling rule" },
      },
      {
        feature: { tr: "Önce bana sor modu", en: "Ask-me-first mode" },
        hint: { tr: "Değişiklik onayınla uygulanır", en: "Changes wait for your approval" },
        manual: false,
        sheets: false,
        pw: true,
      },
      {
        feature: { tr: "Hatalı değişikliği geri alma", en: "Undoing a bad change" },
        hint: { tr: "Yanlış kural, yanlış fiyat", en: "Wrong rule, wrong price" },
        manual: { tr: "Hatırlarsan", en: "If you remember" },
        sheets: { tr: "Hatırlarsan", en: "If you remember" },
        pw: { tr: "Tek tıkla", en: "One click" },
      },
    ],
  },
  {
    title: { tr: "Harcanan zaman", en: "Time it takes" },
    rows: [
      {
        feature: { tr: "Haftalık iş yükü", en: "Weekly workload" },
        hint: { tr: "100 ürün, 5 rakip için tahmini", en: "Rough estimate, 100 products × 5 rivals" },
        manual: { tr: "8–10 saat", en: "8–10 hours" },
        sheets: { tr: "4–6 saat", en: "4–6 hours" },
        pw: { tr: "Yalnızca onaylar", en: "Just approvals" },
      },
    ],
  },
];

/**
 * Customer stories live in app.config.ts (`marketing.caseStudies`).
 *
 * The entries currently in that array are invented placeholders and the
 * on-page "demo content" note has been removed at the owner's request, so
 * this section now reads as genuine customer feedback. Replace every entry
 * with a real, permitted customer before this site goes public.
 */

/**
 * The four ways a competitor listing gets tied to one of your products, in the
 * order we try them. Only the third one is a guess — and it's the only one that
 * waits for a human, which is the whole point of showing this publicly.
 */
const MATCH_LADDER: { key: string; icon: typeof Barcode; title: L; body: L; certainty: L; needsYou?: boolean }[] = [
  {
    key: "gtin",
    icon: Barcode,
    title: { tr: "Barkod", en: "Barcode" },
    body: {
      tr: "İki ilanda da aynı barkod (GTIN/EAN) varsa, bu aynı üründür. Tartışmaya gerek yok.",
      en: "If both listings carry the same barcode (GTIN/EAN), it's the same product. Nothing to debate.",
    },
    certainty: { tr: "Kesin", en: "Certain" },
  },
  {
    key: "model",
    icon: Tags,
    title: { tr: "Marka + model kodu", en: "Brand + model code" },
    body: {
      tr: "Barkod yoksa üreticinin model kodunu ararız. Renk ve beden varyantlarını ayrı tutarız.",
      en: "With no barcode we look for the manufacturer's model code, keeping colour and size variants apart.",
    },
    certainty: { tr: "Çok güçlü", en: "Very strong" },
  },
  {
    key: "title",
    icon: SearchCheck,
    title: { tr: "Ürün adı benzerliği", en: "Title similarity" },
    body: {
      tr: "Son çare: ad, varyant ve fiyat aralığı karşılaştırılır. Burası yanılabilir — bu yüzden doğrudan uygulanmaz.",
      en: "Last resort: we compare title, variant and price range. This is where mistakes live — so it's never applied directly.",
    },
    certainty: { tr: "Onayını bekler", en: "Waits for your approval" },
    needsYou: true,
  },
  {
    key: "manual",
    icon: MousePointerClick,
    title: { tr: "Senin elinle", en: "By your own hand" },
    body: {
      tr: "Rakip ürünün bağlantısını kendin yapıştırırsın. Hiçbir tahmin yapılmaz, hiçbir şey varsayılmaz.",
      en: "You paste the rival's product link yourself. Nothing is guessed and nothing is assumed.",
    },
    certainty: { tr: "Kesin", en: "Certain" },
  },
];

/** The three brakes on automatic repricing. */
const SAFETY: { icon: typeof Handshake; title: L; body: L }[] = [
  {
    icon: Handshake,
    title: { tr: "Önce bana sor", en: "Ask me first" },
    body: {
      tr: "Her kuralı \"önce öner, ben onaylayayım\" moduna alabilirsin. PriceNova fiyatına dokunmaz; önerisini yeni kâr marjınla birlikte onay kuyruğuna bırakır. Sen onaylamadan hiçbir şey değişmez.",
      en: "Any rule can be set to suggest instead of act. PriceNova leaves its proposal in your approval queue, with the margin it would leave you, and nothing changes until you say yes.",
    },
  },
  {
    icon: Undo2,
    title: { tr: "Tek tıkla eski fiyat", en: "One click back" },
    body: {
      tr: "Otomatik yapılan her değişiklikte önceki fiyat saklanır. Bir hata fark edersen tek tek ya da hepsini birden geri alırsın — eski fiyat mağazana yeniden yazılır.",
      en: "Every automatic change keeps the price it replaced. Spot a mistake and you restore it — one at a time or all at once — and the old price goes back to your store.",
    },
  },
  {
    icon: OctagonX,
    title: { tr: "Her şeyi durdur", en: "Stop everything" },
    body: {
      tr: "Panelin üst barında, her ekranda duran bir durdurma düğmesi. Bastığın an hiçbir kural fiyatına dokunamaz. Rakip takibi ve uyarılar çalışmaya devam eder — sadece yazma durur.",
      en: "A stop button in the top bar of every screen. Press it and no rule can touch a price. Tracking and alerts keep running — only writing stops.",
    },
  },
];

const SECURITY: { icon: typeof ShieldCheck; title: L; body: L }[] = [
  { icon: Lock, title: { tr: "Verilerin gizli", en: "Your data is private" }, body: { tr: "Fiyatların ve kuralların sana özel kalır; rakiplerine asla görünmez.", en: "Your prices and rules stay private, never visible to your competitors." } },
  { icon: ShieldCheck, title: { tr: "Yalnızca herkese açık veri", en: "Public data only" }, body: { tr: "Sadece herkese açık listelenmiş fiyatları senin adına okuruz.", en: "We only read publicly listed prices on your behalf." } },
  { icon: Zap, title: { tr: "Gerçek-zamanlı uyarılar", en: "Real-time alerts" }, body: { tr: "Bir fiyat değiştiğinde e-posta ve Slack'e dakikalar içinde bildirim.", en: "When a price moves, email and Slack fire within minutes." } },
];

/* Who PriceNova is for — use-case cards. */
const USE_CASES: { icon: string; title: L; body: L }[] = [
  { icon: "shopping-cart", title: { tr: "DTC markaları", en: "DTC brands" }, body: { tr: "Kendi mağazanda rakiplerinin önünde kal; marjını taban kurallarıyla koru.", en: "Stay ahead of rivals on your own store and protect margin with floor rules." } },
  { icon: "store", title: { tr: "Pazaryeri satıcıları", en: "Marketplace sellers" }, body: { tr: "Amazon, Trendyol, Hepsiburada ve n11'de Buy Box ve en-ucuz konumunu takip et.", en: "Track the Buy Box and cheapest position on Amazon, Trendyol, Hepsiburada and n11." } },
  { icon: "package", title: { tr: "Toptan & dağıtıcılar", en: "Wholesale & distributors" }, body: { tr: "Geniş kataloglarda fiyat erozyonunu yakala, segmentlere göre kural ver.", en: "Catch price erosion across large catalogs and set rules per segment." } },
  { icon: "line-chart", title: { tr: "Fiyatlandırma ekipleri", en: "Pricing teams" }, body: { tr: "Fiyat endeksi ve geçmişle veriye dayalı kararlar al; haftalık raporlar gelsin.", en: "Make data-driven calls with price index and history; get weekly reports." } },
];

/* Deep-dive feature blocks (alternating). */
const DEEP_DIVE: { eyebrow: L; title: L; body: L; points: L[]; reverse?: boolean }[] = [
  {
    eyebrow: { tr: "Takip", en: "Tracking" },
    title: { tr: "Her rakip, her fiyat, her gün", en: "Every rival, every price, every day" },
    body: { tr: "Her ürünün için rakip URL'lerini eşleştir; PriceNova fiyat, stok ve kargo durumunu sürekli tarar ve tek tabloda toplar.", en: "Match competitor URLs to each product; PriceNova continuously scans price, stock and shipping and gathers it all in one table." },
    points: [
      { tr: "Otomatik eşleştirme önerileri", en: "Auto-match suggestions" },
      { tr: "Stok ve kargo durumu takibi", en: "Stock and shipping tracking" },
      { tr: "Dakikada bir taramaya kadar", en: "Up to per-minute scans" },
    ],
  },
  {
    eyebrow: { tr: "Yeniden fiyatlandırma", en: "Repricing" },
    title: { tr: "Kurallar marjını korur", en: "Rules that protect your margin" },
    body: { tr: "\"En düşüğü -%1 geç\", \"taban = maliyet +%10\" gibi kurallar tanımla. Bir rakip hamle yaptığında PriceNova fiyatını taban ve tavan içinde otomatik ayarlar.", en: "Define rules like \"match lowest -1%\" and \"floor = cost +10%\". When a rival moves, PriceNova adjusts your price automatically, within your floor and ceiling." },
    points: [
      { tr: "Taban (maliyet) ve tavan sınırları", en: "Floor (cost) and ceiling limits" },
      { tr: "Kategori ve SKU bazlı kapsam", en: "Category and SKU-level scope" },
      { tr: "Mağazaya geri yazma", en: "Write-back to your store" },
    ],
    reverse: true,
  },
  {
    eyebrow: { tr: "Geçmiş", en: "History" },
    title: { tr: "Geleceği geçmişten oku", en: "Read the future in the history" },
    body: { tr: "Her rakip için fiyatın zaman içindeki seyrini çok-çizgili bir grafikte gör. Sezonsal hamleleri ve indirim döngülerini onlar sana zarar vermeden yakala.", en: "See each competitor's price over time on a multi-line chart. Catch seasonal moves and discount cycles before they hurt you." },
    points: [
      { tr: "Rakip başına fiyat çizgisi", en: "One line per competitor" },
      { tr: "Fiyat endeksi (pazar = 100)", en: "Price index (market = 100)" },
      { tr: "CSV dışa aktarım ve raporlar", en: "CSV export and reports" },
    ],
  },
];

/* Integration logos for the strip. */
const INTEGRATIONS: { name: string; glyph: "db" | "scrape" | "store" | "slack"; sub: L }[] = [
  { name: "Supabase", glyph: "db", sub: { tr: "Veritabanı & auth", en: "Database & auth" } },
  { name: "Scrapingdog", glyph: "scrape", sub: { tr: "Fiyat verisi", en: "Price data" } },
  { name: "Shopify", glyph: "store", sub: { tr: "Katalog & geri yazma", en: "Catalog & write-back" } },
  { name: "Slack", glyph: "slack", sub: { tr: "Uyarılar", en: "Alerts" } },
];

/* Repricing rule examples for the deep-dive panel. */
const RULE_EXAMPLES: { name: L; formula: string; tone: string }[] = [
  { name: { tr: "En düşüğü -%1 geç", en: "Beat lowest by 1%" }, formula: "lowest − 1%", tone: "var(--color-success)" },
  { name: { tr: "Taban = maliyet +%10", en: "Floor = cost +10%" }, formula: "max(rule, cost × 1.10)", tone: "var(--color-primary)" },
  { name: { tr: "İkinci en ucuza eşle", en: "Match 2nd cheapest" }, formula: "2nd lowest", tone: "var(--color-comp-3)" },
  { name: { tr: "Tavan = ÖSF", en: "Ceiling = MSRP" }, formula: "min(rule, msrp)", tone: "var(--color-warning)" },
];

export default function LandingPage() {
  const { t, lang } = useLang();
  const m = appConfig.marketing;
  const tt = (v: L) => v[lang];

  const sectionCopy = {
    demoTitle: { tr: "Bir rakip fiyat düşürünce ne olur?", en: "What happens when a rival drops a price?" } as L,
    demoSub: { tr: "Rakip indirir, sen en ucuz olmaktan çıkarsın, kuralın devreye girer ve konumunu geri alırsın — sen hiçbir şey yapmadan.", en: "A rival cuts, you stop being cheapest, your rule fires, and you recover the position — without lifting a finger." } as L,
    featuresTitle: { tr: "Fiyat zekâsı için ihtiyacın olan her şey", en: "Everything you need for price intelligence" } as L,
    featuresSub: { tr: "Takipten uyarıya, yeniden fiyatlandırmaya kadar tek panel.", en: "From tracking to alerts to repricing, in one panel." } as L,
    howTitle: { tr: "Dört adımda kontrol", en: "Control in four steps" } as L,
    howSub: { tr: "Ekle, eşleştir, izle, yeniden fiyatlandır. PriceNova aradaki her şeyi halleder.", en: "Add, match, monitor, reprice. PriceNova handles everything in between." } as L,
    useCasesTitle: { tr: "PriceNova kimler için?", en: "Who PriceNova is for" } as L,
    useCasesSub: { tr: "Rakip fiyatlarına karşı pozisyon alan her ekip için bir akış.", en: "A flow for every team that competes on price." } as L,
    deepTitle: { tr: "Tabloyu derinlemesine", en: "Under the hood" } as L,
    deepSub: { tr: "Üç katman, tek panel: izle, yeniden fiyatlandır, geçmişi oku.", en: "Three layers, one panel: monitor, reprice, read the history." } as L,
    rulesTitle: { tr: "Yeniden fiyatlandırma kuralları", en: "Repricing rules" } as L,
    rulesSub: { tr: "Birkaç sözcükle stratejini tanımla; gerisini PriceNova otomatik uygular.", en: "Describe your strategy in a few words; PriceNova applies the rest automatically." } as L,
    integrationsTitle: { tr: "Sevdiğin araçlarla çalışır", en: "Works with the tools you love" } as L,
    integrationsSub: { tr: "Supabase, fiyat-verisi sağlayıcın, Shopify/WooCommerce ve Slack'i dakikalar içinde bağla.", en: "Wire Supabase, your price-data provider, Shopify/WooCommerce and Slack in minutes." } as L,
    compareTitle: { tr: "Neden PriceNova?", en: "Why PriceNova?" } as L,
    compareSub: { tr: "Rakip fiyatını takip etmenin üç yolu, yan yana.", en: "Three ways to keep up with rival prices, side by side." } as L,
    securityTitle: { tr: "Gizli ve dürüst", en: "Private and fair" } as L,
    securitySub: { tr: "Yalnızca herkese açık fiyatları okuruz; verilerin sana özel kalır.", en: "We only read public prices; your data stays yours." } as L,
    testimonialsTitle: { tr: "Mağazalar PriceNova'ı seviyor", en: "Stores love PriceNova" } as L,
    testimonialsSub: { tr: "Fiyatla rekabet eden işletmelerden.", en: "From businesses competing on price." } as L,
    pricingTitle: { tr: "Ürün sayısına göre basit fiyatlandırma", en: "Simple pricing by product count" } as L,
    pricingSub: { tr: "Sadece izlediğin ürünler için öde.", en: "Pay only for the products you track." } as L,
    popular: { tr: "En popüler", en: "Most popular" } as L,
    faqTitle: { tr: "Sıkça sorulanlar", en: "Frequently asked" } as L,
    faqSub: { tr: "Cevabını bulamadın mı? Ekibimize yaz.", en: "Can't find an answer? Reach our team." } as L,
    ctaTitle: { tr: "Bir daha asla bir fiyatı kaçırma", en: "Never miss a price again" } as L,
    ctaSub: { tr: "Anahtarsız demo modda aç; hazır olunca Supabase, fiyat sağlayıcın ve mağazanı bağla.", en: "Open the keyless demo; wire Supabase, your price provider and your store when you're ready." } as L,
  };

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10" style={{ background: "var(--grad-hero)" }} aria-hidden />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:py-24 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Left copy */}
          <div className="stagger">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-pill">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary pulse-ring" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              {t(m.badge)}
            </span>
            <h1 className="mt-5 max-w-xl font-display text-[40px] font-bold leading-[1.04] tracking-[-0.03em] sm:text-[54px]">
              {t(m.heroTitle)}{" "}
              <span className="bg-linear-to-br from-[oklch(60%_0.13_205)] to-[oklch(50%_0.14_232)] bg-clip-text text-transparent">
                {t(m.heroAccent)}
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-muted-foreground">{t(m.heroSubtitle)}</p>

            <ul className="mt-6 space-y-2.5">
              {HERO_BENEFITS.map((b) => (
                <li key={tt(b)} className="flex items-start gap-2.5 text-[15px]">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-success/12 text-success">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {tt(b)}
                </li>
              ))}
            </ul>

            {/*
              Two doors, deliberately different: the first opens an account of
              your own, the second drops you into the sample workspace without
              one. The sub-labels exist so nobody has to guess which is which.
            */}
            <div className="mt-8 grid gap-3 sm:max-w-lg sm:grid-cols-2">
              <Link
                href="/signup"
                className="group flex flex-col items-center rounded-xl bg-primary px-5 py-3 text-center shadow-sm transition-opacity hover:opacity-90"
              >
                <span className="inline-flex items-center gap-2 text-[15px] font-semibold text-primary-foreground">
                  {t(m.heroCtaPrimary)} <ArrowRight className="h-4 w-4" />
                </span>
                <span className="mt-0.5 text-[11.5px] text-primary-foreground/75">
                  {lang === "tr" ? `${TRIAL_DAYS} gün ücretsiz · kart istemiyoruz` : `Free for ${TRIAL_DAYS} days · no card`}
                </span>
              </Link>
              <Link
                href="/demo"
                className="flex flex-col items-center rounded-xl border border-border bg-card px-5 py-3 text-center shadow-pill transition-colors hover:bg-muted"
              >
                <span className="inline-flex items-center gap-2 text-[15px] font-semibold text-foreground">
                  <FlaskConical className="h-4 w-4 text-primary" />
                  {t(m.heroCtaSecondary)}
                </span>
                <span className="mt-0.5 text-[11.5px] text-muted-foreground">
                  {lang === "tr" ? "Örnek mağaza · kayıt gerekmez" : "Sample store · no signup"}
                </span>
              </Link>
            </div>
          </div>

          {/* Right floating product preview */}
          <div className="relative animate-float-up lg:pl-4">
            <div className="absolute -left-6 -top-6 -z-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl drift" aria-hidden />
            <div className="absolute -bottom-8 -right-4 -z-10 h-44 w-44 rounded-full bg-[oklch(60%_0.13_205)]/10 blur-3xl" aria-hidden />
            <ProductPreview />
          </div>
        </div>

        {/* Trusted-by row */}
        <div className="border-y border-border bg-card/50">
          <div className="mx-auto max-w-6xl px-5 py-6">
            <p className="text-center text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {lang === "tr" ? "Kataloğunu ve uyarılarını bu platformlara bağla" : "Connect your catalog and alerts to these platforms"}
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 sm:gap-x-12">
              {TRUSTED.map((c) => (
                <CompanyMark key={c} name={c} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAND ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border shadow-soft sm:grid-cols-4">
          {[
            { value: "4", label: { tr: "mağaza & pazaryeri entegrasyonu", en: "store & marketplace integrations" } as L },
            { value: "1 dk", label: { tr: "en sık fiyat kontrolü", en: "fastest price check" } as L },
            { value: "∞", label: { tr: "ürün başına rakip", en: "competitors per product" } as L },
            { value: "2", label: { tr: "uyarı kanalı: e-posta + Slack", en: "alert channels: email + Slack" } as L },
          ].map((s) => (
            <div key={s.value} className="bg-card px-5 py-8 text-center">
              <p className="font-display text-3xl font-bold tracking-tight">{s.value}</p>
              <p className="mt-1.5 text-xs text-muted-foreground">{tt(s.label)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── INTERACTIVE DEMO ──────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="label-mono text-primary">{lang === "tr" ? "Canlı senaryo" : "Live scenario"}</p>
            <h2 className="mt-2 max-w-md font-display text-3xl font-bold tracking-tight sm:text-4xl">{tt(sectionCopy.demoTitle)}</h2>
            <p className="mt-3 max-w-md text-muted-foreground">{tt(sectionCopy.demoSub)}</p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {m.stats.slice(0, 3).map((s) => (
                <div key={s.value} className="rounded-xl border border-border bg-card p-3 shadow-soft">
                  <p className="tnum text-xl font-bold leading-none">{s.value}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{t(s.label)}</p>
                </div>
              ))}
            </div>
          </div>
          <FlowDemo />
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────── */}
      <section id="features" className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{tt(sectionCopy.featuresTitle)}</h2>
            <p className="mt-3 text-muted-foreground">{tt(sectionCopy.featuresSub)}</p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {m.features.map((f) => (
              <div key={tt(f.title)} className="group rounded-2xl border border-border bg-card p-6 shadow-soft transition-shadow hover:shadow-pop">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon name={f.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-semibold tracking-tight">{t(f.title)}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{t(f.body)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW MATCHING WORKS ────────────────────────────────────── */}
      <section id="matching" className="mx-auto max-w-6xl px-5 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="label-mono text-primary">{lang === "tr" ? "Eşleştirme" : "Matching"}</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {lang === "tr" ? "Rakip ürün nasıl bulunuyor?" : "How we find the rival product"}
          </h2>
          <p className="mt-3 text-muted-foreground">
            {lang === "tr"
              ? "Yanlış eşleşme, ona dayanan her karşılaştırmayı ve her fiyat kararını bozar. O yüzden sırayla dört yöntem deneriz ve tahmine dayanan hiçbirini sana sormadan kullanmayız."
              : "A wrong match corrupts every comparison and every pricing decision built on it. So we try four methods in order — and never use a guess without asking you."}
          </p>
        </div>

        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MATCH_LADDER.map((step, i) => (
            <li
              key={step.key}
              className={cn(
                "relative rounded-2xl border bg-card p-5 shadow-soft",
                step.needsYou ? "border-warning/40" : "border-border",
              )}
            >
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
                  <step.icon className="h-[18px] w-[18px]" />
                </span>
                <span className="tnum text-[11px] font-bold text-muted-foreground">0{i + 1}</span>
              </div>
              <h3 className="mt-3.5 font-semibold tracking-tight">{tt(step.title)}</h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">{tt(step.body)}</p>
              <span
                className={cn(
                  "mt-3 inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold",
                  step.needsYou ? "bg-warning/15 text-warning" : "bg-success/10 text-success",
                )}
              >
                {tt(step.certainty)}
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-muted/40 p-5">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-card text-primary shadow-pill">
            <SearchCheck className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold tracking-tight">
              {lang === "tr" ? "Son söz her zaman sende" : "You always get the last word"}
            </p>
            <p className="mt-1 max-w-2xl text-[13.5px] leading-relaxed text-muted-foreground">
              {lang === "tr"
                ? "Her eşleşmeyi, ne kadar emin olduğumuzu ve neden öyle düşündüğümüzü tek ekranda görürsün. \"Bu benim ürünüm değil\" dediğin an o rakip fiyat hesaplardan çıkar — aksesuar, yenilenmiş ürün veya farklı bir varyant fiyatını takip etme riskin kalmaz."
                : "You see every match, how sure we are and why, on one screen. The moment you say \"that's not my product\", that price leaves your comparisons — no chasing the price of an accessory, a refurbished unit or a different variant."}
            </p>
          </div>
          <Link
            href="/demo"
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border border-border bg-card px-4 text-[13px] font-semibold text-foreground shadow-pill transition-colors hover:bg-card/60"
          >
            {lang === "tr" ? "Eşleşme ekranını gör" : "See the matches screen"} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── SAFETY / WHO IS IN CONTROL ────────────────────────────── */}
      <section id="control" className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="label-mono text-primary">{lang === "tr" ? "Kontrol" : "Control"}</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {lang === "tr" ? "Fiyatların üzerinde son söz senin" : "Your prices stay yours"}
            </h2>
            <p className="mt-3 text-muted-foreground">
              {lang === "tr"
                ? "Otomatik fiyatlandırmayı açmak, kontrolü devretmek demek değil. Üç güvenlik düğmesi her zaman elinin altında."
                : "Turning on automatic repricing doesn't mean handing over the keys. Three safety controls stay within reach."}
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {SAFETY.map((s) => (
              <div key={tt(s.title)} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                  <s.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-semibold tracking-tight">{tt(s.title)}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{tt(s.body)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEEP-DIVE FEATURE BLOCKS ──────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{tt(sectionCopy.deepTitle)}</h2>
          <p className="mt-3 text-muted-foreground">{tt(sectionCopy.deepSub)}</p>
        </div>
        <div className="mt-14 space-y-16">
          {DEEP_DIVE.map((d, idx) => (
            <div
              key={tt(d.title)}
              className={cn("grid items-center gap-10 lg:grid-cols-2", d.reverse && "lg:[&>*:first-child]:order-2")}
            >
              <div>
                <p className="label-mono text-primary">{tt(d.eyebrow)}</p>
                <h3 className="mt-2 max-w-md font-display text-2xl font-bold tracking-tight sm:text-3xl">{tt(d.title)}</h3>
                <p className="mt-3 max-w-md text-muted-foreground">{tt(d.body)}</p>
                <ul className="mt-5 space-y-2.5">
                  {d.points.map((p) => (
                    <li key={tt(p)} className="flex items-start gap-2.5 text-[15px]">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      {tt(p)}
                    </li>
                  ))}
                </ul>
              </div>
              {/* a small illustrative panel */}
              <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                {idx === 0 && (
                  <div className="space-y-2.5">
                    {[
                      { name: "MegaShop", price: 81.5, delta: "+3.2%", tone: "text-success" },
                      { name: "ValueMart", price: 84.0, delta: "+6.3%", tone: "text-success" },
                      { name: "QuickBuy", price: 79.9, delta: "+1.1%", tone: "text-success" },
                      { name: "PrimeGoods", price: 89.99, delta: "+13.9%", tone: "text-success" },
                    ].map((r) => (
                      <div key={r.name} className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-3">
                        <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-[10px] font-bold text-primary">{r.name.slice(0, 2).toUpperCase()}</span>
                        <span className="flex-1 text-[13px] font-medium">{r.name}</span>
                        <span className="tnum text-[13px] font-semibold">{formatPrice(r.price)}</span>
                        <span className={cn("tnum text-[11px] font-semibold", r.tone)}>{r.delta}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/4 p-3">
                      <Trophy className="h-4 w-4 text-primary" />
                      <span className="flex-1 text-[13px] font-semibold text-primary">{lang === "tr" ? "Sen — en ucuz" : "You — cheapest"}</span>
                      <span className="tnum text-[13px] font-bold text-primary">{formatPrice(79.0)}</span>
                    </div>
                  </div>
                )}
                {idx === 1 && (
                  <div className="space-y-3">
                    {RULE_EXAMPLES.slice(0, 3).map((r) => (
                      <div key={r.formula} className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-3">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ background: r.tone }} />
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] font-semibold leading-tight">{tt(r.name)}</p>
                          <p className="tnum text-[11px] text-muted-foreground">{r.formula}</p>
                        </div>
                        <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">{lang === "tr" ? "aktif" : "active"}</span>
                      </div>
                    ))}
                  </div>
                )}
                {idx === 2 && (
                  <div className="space-y-2.5">
                    {[
                      { who: "MegaShop", from: 178.0, to: 174.99, down: true },
                      { who: "ValueMart", from: 133.0, to: 131.0, down: true },
                      { who: "PrimeGoods", from: 334.0, to: 329.99, down: true },
                    ].map((r) => (
                      <div key={r.who} className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-3 text-[13px]">
                        <span className="font-semibold">{r.who}</span>
                        <span className="tnum ml-auto text-muted-foreground line-through">{formatPrice(r.from)}</span>
                        <span className="tnum inline-flex items-center gap-0.5 font-semibold text-success">
                          {r.down ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />}
                          {formatPrice(r.to)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────── */}
      <section id="how" className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{tt(sectionCopy.howTitle)}</h2>
            <p className="mt-3 text-muted-foreground">{tt(sectionCopy.howSub)}</p>
          </div>
          <div className="relative mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {HOW_STEPS.map((s, i) => (
              <div key={s.n} className="relative rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon name={s.icon} className="h-5 w-5" />
                  </span>
                  <span className="font-display text-3xl font-bold text-primary/15">{s.n}</span>
                </div>
                <h3 className="mt-4 font-semibold tracking-tight">{tt(s.title)}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{tt(s.body)}</p>
                {i < HOW_STEPS.length - 1 && (
                  <span className="absolute -right-3 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 place-items-center rounded-full border border-border bg-card text-muted-foreground lg:grid">
                    <ArrowRight className="h-3 w-3" />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── USE CASES ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{tt(sectionCopy.useCasesTitle)}</h2>
          <p className="mt-3 text-muted-foreground">{tt(sectionCopy.useCasesSub)}</p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {USE_CASES.map((u) => (
            <div key={tt(u.title)} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon name={u.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-semibold tracking-tight">{tt(u.title)}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{tt(u.body)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── REPRICING-RULES DEEP-DIVE ─────────────────────────────── */}
      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <p className="label-mono text-primary">{lang === "tr" ? "Otomasyon" : "Automation"}</p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">{tt(sectionCopy.rulesTitle)}</h2>
              <p className="mt-3 max-w-md text-muted-foreground">{tt(sectionCopy.rulesSub)}</p>
              <ul className="mt-6 space-y-2.5">
                {[
                  { tr: "Taban kuralı marjını korur — maliyetin altına asla inmez", en: "A floor rule protects margin — never drops below cost" },
                  { tr: "Kategori, marka ya da tek SKU bazında uygula", en: "Apply by category, brand or a single SKU" },
                  { tr: "Yeni fiyat mağazana otomatik yazılır", en: "The new price writes back to your store automatically" },
                ].map((p) => (
                  <li key={p.en} className="flex items-start gap-2.5 text-[15px]">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    {lang === "tr" ? p.tr : p.en}
                  </li>
                ))}
              </ul>
            </div>
            {/* rules panel mock */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-pop">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="inline-flex items-center gap-2 text-sm font-semibold">
                  <Wand2 className="h-4 w-4 text-primary" />
                  {lang === "tr" ? "Kurallarım" : "My rules"}
                </span>
                <span className="rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success">
                  3 {lang === "tr" ? "aktif" : "active"}
                </span>
              </div>
              <div className="mt-3 space-y-2.5">
                {RULE_EXAMPLES.map((r, i) => (
                  <div key={r.formula} className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: r.tone }} />
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold leading-tight">{tt(r.name)}</p>
                      <p className="tnum text-[11px] text-muted-foreground">{r.formula}</p>
                    </div>
                    <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold", i < 3 ? "bg-success/10 text-success" : "bg-muted text-muted-foreground")}>
                      {i < 3 ? (lang === "tr" ? "aktif" : "active") : (lang === "tr" ? "taslak" : "draft")}
                    </span>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full rounded-lg border border-dashed border-border py-2.5 text-[13px] font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                + {lang === "tr" ? "Kural ekle" : "Add a rule"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ──────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-5 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{tt(sectionCopy.compareTitle)}</h2>
          <p className="mt-3 text-muted-foreground">{tt(sectionCopy.compareSub)}</p>
        </div>
        <div className="mt-12 overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          {/* phones: one card per row so the PriceNova answer is never off-screen */}
          <div className="sm:hidden">
            {COMPARE_GROUPS.map((group) => (
              <div key={tt(group.title)}>
                <p className="label-mono border-b border-border/60 bg-muted/40 px-4 py-2 text-[10.5px] text-muted-foreground">{tt(group.title)}</p>
                {group.rows.map((row) => (
                  <div key={tt(row.feature)} className="border-b border-border/60 px-4 py-4">
                    <p className="font-medium text-foreground">{tt(row.feature)}</p>
                    <p className="mt-0.5 text-[12px] leading-snug text-muted-foreground">{tt(row.hint)}</p>
                    <dl className="mt-3 grid grid-cols-[1fr_1fr_1.5fr] gap-2 text-center">
                      <div className="rounded-lg bg-muted/40 px-1.5 py-2">
                        <dt className="text-[10.5px] text-muted-foreground">{lang === "tr" ? "Elle" : "Manual"}</dt>
                        <dd className="mt-1"><CompareMark value={row.manual} lang={lang} /></dd>
                      </div>
                      <div className="rounded-lg bg-muted/40 px-1.5 py-2">
                        <dt className="text-[10.5px] text-muted-foreground">{lang === "tr" ? "Tablo" : "Sheets"}</dt>
                        <dd className="mt-1"><CompareMark value={row.sheets} lang={lang} /></dd>
                      </div>
                      <div className="rounded-lg bg-primary/8 px-1.5 py-2 ring-1 ring-primary/20">
                        <dt className="text-[10.5px] font-semibold text-primary">{appConfig.name}</dt>
                        <dd className="mt-1"><CompareMark value={row.pw} lang={lang} highlight /></dd>
                      </div>
                    </dl>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full min-w-[600px] text-sm">
              <caption className="sr-only">{tt(sectionCopy.compareSub)}</caption>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="sticky left-0 z-10 w-[34%] bg-card px-5 py-4 text-left">
                    <span className="sr-only">{lang === "tr" ? "Özellik" : "Feature"}</span>
                  </th>
                  <th scope="col" className="w-[20%] px-4 py-4 text-center align-bottom">
                    <span className="block font-semibold text-foreground">{lang === "tr" ? "Elle kontrol" : "Manual checking"}</span>
                    <span className="mt-0.5 block text-[11.5px] font-normal text-muted-foreground">{lang === "tr" ? "Tarayıcı sekmeleri" : "Browser tabs"}</span>
                  </th>
                  <th scope="col" className="w-[20%] px-4 py-4 text-center align-bottom">
                    <span className="block font-semibold text-foreground">{lang === "tr" ? "Tablolar" : "Spreadsheets"}</span>
                    <span className="mt-0.5 block text-[11.5px] font-normal text-muted-foreground">Excel · Sheets</span>
                  </th>
                  <th scope="col" className="w-[26%] border-x border-t-2 border-x-primary/15 border-t-primary bg-primary/5 px-4 py-4 text-center align-bottom">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-primary">
                      <Radar className="h-4 w-4" />
                      {appConfig.name}
                    </span>
                    <span className="mt-0.5 block text-[11.5px] font-normal text-primary/70">{lang === "tr" ? "Otomatik" : "Automatic"}</span>
                  </th>
                </tr>
              </thead>
              {COMPARE_GROUPS.map((group) => (
                <tbody key={tt(group.title)}>
                  <tr className="border-b border-border/60 bg-muted/40">
                    <th scope="colgroup" colSpan={3} className="sticky left-0 bg-muted/40 px-5 py-2 text-left">
                      <span className="label-mono text-[10.5px] text-muted-foreground">{tt(group.title)}</span>
                    </th>
                    <td className="border-x border-x-primary/15 bg-primary/5" />
                  </tr>
                  {group.rows.map((row) => (
                    <tr key={tt(row.feature)} className="border-b border-border/60">
                      <th scope="row" className="sticky left-0 z-10 bg-card px-5 py-3.5 text-left font-normal">
                        <span className="block font-medium text-foreground">{tt(row.feature)}</span>
                        <span className="mt-0.5 block text-[12px] leading-snug text-muted-foreground">{tt(row.hint)}</span>
                      </th>
                      <CompareCell value={row.manual} lang={lang} />
                      <CompareCell value={row.sheets} lang={lang} />
                      <CompareCell value={row.pw} lang={lang} highlight />
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border bg-muted/30 px-5 py-4">
            <p className="text-[13.5px] text-muted-foreground">
              {lang === "tr"
                ? "Farkı en iyi örnek mağazada görürsün — kayıt gerekmez."
                : "The difference is clearest in the sample store — no signup needed."}
            </p>
            <Link
              href="/demo"
              className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg bg-primary px-4 text-[13px] font-semibold text-primary-foreground shadow-pill transition-opacity hover:opacity-90"
            >
              {lang === "tr" ? "Demoyu aç" : "Open the demo"} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECURITY STRIP ────────────────────────────────────────── */}
      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{tt(sectionCopy.securityTitle)}</h2>
            <p className="mt-3 text-muted-foreground">{tt(sectionCopy.securitySub)}</p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {SECURITY.map((s) => {
              const I = s.icon;
              return (
                <div key={tt(s.title)} className="rounded-2xl border border-border bg-card p-6 text-center shadow-soft">
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                    <I className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-semibold tracking-tight">{tt(s.title)}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{tt(s.body)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── INTEGRATIONS ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{tt(sectionCopy.integrationsTitle)}</h2>
          <p className="mt-2 text-muted-foreground">{tt(sectionCopy.integrationsSub)}</p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {INTEGRATIONS.map((it) => (
            <div key={it.name} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-5 shadow-soft">
              <IntegrationGlyph glyph={it.glyph} />
              <div className="min-w-0">
                <p className="font-semibold tracking-tight">{it.name}</p>
                <p className="truncate text-xs text-muted-foreground">{tt(it.sub)}</p>
              </div>
              <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                {lang === "tr" ? "Hazır" : "Ready"}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CUSTOMER STORIES (renders only when you have real ones) ─── */}
      {m.caseStudies.length > 0 && (
        <section className="border-t border-border bg-muted/30">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{tt(sectionCopy.testimonialsTitle)}</h2>
              <p className="mt-3 text-muted-foreground">{tt(sectionCopy.testimonialsSub)}</p>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {m.caseStudies.map((cs) => (
                <figure key={cs.brand} className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-soft">
                  <div className="flex items-center justify-between gap-3">
                    {cs.logo ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={cs.logo} alt={cs.brand} className="h-7 w-auto max-w-30 object-contain" />
                    ) : (
                      <span className="font-display text-[15px] font-bold tracking-tight">{cs.brand}</span>
                    )}
                    <span className="tnum shrink-0 rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-semibold text-success">
                      {tt(cs.result)}
                    </span>
                  </div>
                  <Quote className="mt-5 h-5 w-5 text-primary/30" />
                  <blockquote className="mt-3 flex-1 text-[14.5px] leading-relaxed text-foreground/90">
                    {tt(cs.quote)}
                  </blockquote>
                  <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-xs font-bold text-white" style={{ backgroundImage: "var(--grad-brand)" }}>
                      {cs.initials}
                    </span>
                    <div className="min-w-0">
                      <figcaption className="text-sm font-semibold leading-tight">{cs.author}</figcaption>
                      <p className="truncate text-xs text-muted-foreground">
                        {tt(cs.role)} · {cs.brand}
                      </p>
                    </div>
                  </div>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── PRICING ───────────────────────────────────────────────── */}
      <section id="pricing" className="mx-auto max-w-6xl px-5 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{tt(sectionCopy.pricingTitle)}</h2>
          <p className="mt-3 text-muted-foreground">{tt(sectionCopy.pricingSub)}</p>
        </div>
        <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-x-5 gap-y-2 rounded-2xl border border-primary/20 bg-primary/5 px-5 py-3 text-[13.5px]">
          {[
            { tr: `${TRIAL_DAYS} gün ücretsiz, tüm özellikler açık`, en: `Free for ${TRIAL_DAYS} days, every feature on` },
            { tr: "Kart istemiyoruz", en: "No card needed" },
            { tr: "Süre dolunca panel kilitlenir, verilerin silinmez", en: "When it ends the panel locks; nothing is deleted" },
          ].map((p) => (
            <span key={p.en} className="inline-flex items-center gap-1.5 text-foreground/85">
              <Check className="h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={3} />
              {tt(p)}
            </span>
          ))}
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {m.pricing.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                "flex flex-col rounded-2xl border bg-card p-7 shadow-soft",
                tier.featured ? "border-primary/40 shadow-pop ring-1 ring-primary/20" : "border-border",
              )}
            >
              {tier.featured && (
                <span className="mb-3 inline-flex w-fit items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold text-primary-foreground">
                  <Star className="h-3 w-3 fill-current" />
                  {tt(sectionCopy.popular)}
                </span>
              )}
              <h3 className="font-semibold tracking-tight">{tier.name}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-display text-4xl font-bold tracking-tight">{t(tier.price)}</span>
                {tier.period && <span className="text-sm text-muted-foreground">{t(tier.period)}</span>}
              </div>
              <p className="mt-1.5 text-sm text-muted-foreground">{t(tier.tagline)}</p>
              <ul className="mt-6 flex-1 space-y-3 text-sm">
                {tier.features.map((f) => (
                  <li key={t(f)} className="flex items-start gap-2.5">
                    <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-success/12 text-success">
                      <Check className="h-2.5 w-2.5" strokeWidth={3} />
                    </span>
                    {t(f)}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className={cn(
                  "mt-7 inline-flex h-11 items-center justify-center rounded-xl text-sm font-semibold transition-all",
                  tier.featured
                    ? "bg-primary text-primary-foreground shadow-sm hover:opacity-90"
                    : "border border-border bg-card text-foreground hover:bg-muted",
                )}
              >
                {t(tier.cta)}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────── */}
      <section id="faq" className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-3xl px-5 py-20">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{tt(sectionCopy.faqTitle)}</h2>
            <p className="mt-3 text-muted-foreground">{tt(sectionCopy.faqSub)}</p>
          </div>
          <div className="mt-10 space-y-3">
            {m.faq.map((f) => (
              <details key={t(f.q)} className="group rounded-xl border border-border bg-card px-5 py-4 shadow-soft">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                  {t(f.q)}
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-colors group-open:border-primary group-open:bg-primary group-open:text-primary-foreground">
                    <Plus className="h-3.5 w-3.5 group-open:hidden" />
                    <Minus className="hidden h-3.5 w-3.5 group-open:block" />
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t(f.a)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card px-8 py-16 text-center shadow-pop">
          <div className="pointer-events-none absolute inset-0 -z-10" style={{ background: "var(--grad-hero)" }} aria-hidden />
          <span className="pointer-events-none absolute -left-10 top-0 -z-10 h-48 w-48 rounded-full bg-primary/10 blur-3xl drift" aria-hidden />
          <div className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-pill">
            <BellRing className="h-3.5 w-3.5 text-primary" />
            <span>{lang === "tr" ? "Anahtarsız demo · canlı" : "Keyless demo · live"}</span>
          </div>
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">{tt(sectionCopy.ctaTitle)}</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{tt(sectionCopy.ctaSub)}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-7 text-[15px] font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
            >
              {t(m.heroCtaPrimary)} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-card px-7 text-[15px] font-semibold text-foreground shadow-pill transition-colors hover:bg-muted"
            >
              {t(m.heroCtaSecondary)}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function IntegrationGlyph({ glyph }: { glyph: "db" | "scrape" | "store" | "slack" }) {
  const color =
    glyph === "db" ? "var(--color-success)" :
    glyph === "scrape" ? "var(--color-primary)" :
    glyph === "store" ? "var(--color-comp-4)" :
    "var(--color-comp-3)";
  return (
    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl" style={{ background: color }}>
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        {glyph === "db" && <path d="M4 6 c0 -1.7 3.6 -3 8 -3 s8 1.3 8 3 v12 c0 1.7 -3.6 3 -8 3 s-8 -1.3 -8 -3 z M4 6 c0 1.7 3.6 3 8 3 s8 -1.3 8 -3 M4 12 c0 1.7 3.6 3 8 3 s8 -1.3 8 -3" />}
        {glyph === "scrape" && <path d="M12 3 v4 M12 17 v4 M3 12 h4 M17 12 h4 M12 8 a4 4 0 1 0 0 8 a4 4 0 0 0 0 -8 Z" />}
        {glyph === "store" && <path d="M4 9 l1 -4 h14 l1 4 M4 9 h16 v10 h-16 z M4 9 a2 2 0 0 0 4 0 a2 2 0 0 0 4 0 a2 2 0 0 0 4 0 a2 2 0 0 0 4 0 M10 19 v-5 h4 v5" />}
        {glyph === "slack" && <path d="M9 3 a1.5 1.5 0 0 1 0 3 H7.5 V4.5 A1.5 1.5 0 0 1 9 3 Z M15 18 a1.5 1.5 0 0 1 0 -3 h1.5 v1.5 A1.5 1.5 0 0 1 15 18 Z M18 9 a1.5 1.5 0 0 0 -3 0 v1.5 h1.5 A1.5 1.5 0 0 0 18 9 Z M6 15 a1.5 1.5 0 0 0 3 0 v-1.5 H7.5 A1.5 1.5 0 0 0 6 15 Z" />}
      </svg>
    </span>
  );
}

function CompareCell({
  value,
  lang,
  highlight = false,
}: {
  value: boolean | L | string;
  lang: "tr" | "en";
  highlight?: boolean;
}) {
  return (
    <td className={cn("px-4 py-3.5 text-center", highlight && "border-x border-x-primary/15 bg-primary/5")}>
      <CompareMark value={value} lang={lang} highlight={highlight} />
    </td>
  );
}

/** The check / dash / text inside a comparison cell — shared by the table and the phone cards. */
function CompareMark({
  value,
  lang,
  highlight = false,
}: {
  value: boolean | L | string;
  lang: "tr" | "en";
  highlight?: boolean;
}) {
  const text = typeof value === "string" ? value : typeof value === "object" ? value[lang] : null;
  return (
    <>
      {typeof value === "boolean" ? (
        value ? (
          <span className={cn("mx-auto grid h-5 w-5 place-items-center rounded-full", highlight ? "bg-primary text-primary-foreground" : "bg-success/12 text-success")}>
            <Check className="h-3 w-3" strokeWidth={3} />
            <span className="sr-only">{lang === "tr" ? "Var" : "Yes"}</span>
          </span>
        ) : (
          <span className="mx-auto grid h-5 w-5 place-items-center rounded-full bg-muted text-muted-foreground">
            <Minus className="h-3 w-3" />
            <span className="sr-only">{lang === "tr" ? "Yok" : "No"}</span>
          </span>
        )
      ) : highlight ? (
        <span className="inline-flex min-w-0 items-start gap-1.5 text-[13px] font-semibold leading-snug text-primary [overflow-wrap:anywhere]">
          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={3} />
          {text}
        </span>
      ) : (
        <span className="text-[13px] leading-snug text-muted-foreground">{text}</span>
      )}
    </>
  );
}

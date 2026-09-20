/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │  app.config.ts — the single source of truth for this starter.            │
 * │                                                                          │
 * │  Every user-facing string is bilingual: { tr: "...", en: "..." }.        │
 * │  The guided setup (run `/setup`, or say "bu projeyi kur") edits this      │
 * │  file plus app/globals.css and .env.local.                               │
 * └──────────────────────────────────────────────────────────────────────────┘
 *
 *  PRICENOVA — competitor price monitoring & repricing for e-commerce: track
 *  rivals' prices, get alerts when they move, and auto-reprice to win the sale.
 *  Modeled on real, profitable products (prisync.com, pricefy.io). English
 *  brand; copy toggles TR/EN.
 */
import type { L } from "@/lib/i18n/config";

export type IconName = string;

export interface NavItem {
  label: L;
  href: string;
  icon: IconName;
  /** Optional "Soon" / "Beta" style badge shown muted in the sidebar. */
  badge?: L;
  /** Render as disabled/muted (e.g. a not-yet-shipped section). */
  muted?: boolean;
}

export interface NavGroup {
  label: L;
  items: NavItem[];
}

export interface Feature {
  icon: IconName;
  title: L;
  body: L;
}

export interface Stat {
  value: string;
  label: L;
}

export interface PricingTier {
  name: string;
  price: string;
  period?: L;
  tagline: L;
  features: L[];
  cta: L;
  featured?: boolean;
}

export interface FaqItem {
  q: L;
  a: L;
}

export interface Integration {
  key: string;
  name: string;
  envVars: string[];
  required: boolean;
  docsUrl: string;
  purpose: string;
}

export interface AppConfig {
  name: string;
  tagline: L;
  description: L;
  domain: string;
  logoText: string;
  accentName: string;
  marketing: {
    badge: L;
    heroTitle: L;
    heroAccent: L;
    heroSubtitle: L;
    heroCtaPrimary: L;
    heroCtaSecondary: L;
    features: Feature[];
    stats: Stat[];
    pricing: PricingTier[];
    faq: FaqItem[];
  };
  /** Sidebar navigation, grouped (Workspace / Management). */
  navGroups: NavGroup[];
  /** Flat nav (kept for the topbar title lookup + back-compat). */
  nav: NavItem[];
  integrations: Integration[];
}

export const appConfig: AppConfig = {
  name: "PriceNova",
  tagline: {
    tr: "Bilmediğin bir fiyat yüzünden bir daha satış kaybetme.",
    en: "Never lose a sale to a price you didn't know about.",
  },
  description: {
    tr: "Rakiplerinin fiyatlarını izle, değiştiklerinde anında haber al ve kazanmak için otomatik yeniden fiyatlandır. Tüm rakip fiyatları, geçmişi ve pazar konumun tek panelde.",
    en: "Monitor your competitors' prices, get alerted the moment they change, and auto-reprice to win the sale. Every rival price, history and market position in one panel.",
  },
  domain: "pricenova.io",
  logoText: "PN",
  accentName: "green-purple-turquoise",

  marketing: {
    badge: { tr: "E-ticaret fiyat zekâsı", en: "E-commerce price intelligence" },
    heroTitle: {
      tr: "Rakip fiyatlarını izle,",
      en: "Track every rival price,",
    },
    heroAccent: {
      tr: "her satışı kazan.",
      en: "win every sale.",
    },
    heroSubtitle: {
      tr: "PriceNova rakiplerinin fiyatlarını günde binlerce kez tarar, sen düşük kaldığında uyarır ve kuralların doğrultusunda otomatik yeniden fiyatlandırarak marjını korur — sen başka işlerle ilgilenirken.",
      en: "PriceNova scans your competitors thousands of times a day, alerts you the moment you're undercut, and auto-reprices within your rules to protect your margin — while you focus on everything else.",
    },
    heroCtaPrimary: { tr: "Hemen başla", en: "Get started" },
    heroCtaSecondary: { tr: "Canlı demoyu gör", en: "See the live demo" },
    features: [
      { icon: "radar", title: { tr: "Rakip takibi", en: "Competitor tracking" }, body: { tr: "Her ürünün için rakip URL'lerini eşleştir; fiyat, stok ve kargo durumunu günde binlerce kez tara.", en: "Match competitor URLs to each product and scan price, stock and shipping thousands of times a day." } },
      { icon: "bell-ring", title: { tr: "Fiyat uyarıları", en: "Price alerts" }, body: { tr: "Bir rakip fiyat düşürdüğünde ya da sen en ucuz olmaktan çıktığında e-posta ve Slack'e anında bildirim.", en: "Get an instant email and Slack alert when a rival drops a price or you stop being the cheapest." } },
      { icon: "wand-sparkles", title: { tr: "Otomatik yeniden fiyatlandırma", en: "Auto-repricing" }, body: { tr: "\"En düşüğü -%1 geç\" ya da \"taban = maliyet +%10\" gibi kurallar tanımla; PriceNova fiyatını otomatik ayarlasın.", en: "Set rules like \"match lowest -1%\" or \"floor = cost +10%\" and let PriceNova adjust your price automatically." } },
      { icon: "history", title: { tr: "Fiyat geçmişi", en: "Price history" }, body: { tr: "Her rakip için fiyatın zaman içindeki seyrini gör; sezonsal hamleleri ve indirim döngülerini yakala.", en: "See every competitor's price over time and catch seasonal moves and discount cycles before they hurt you." } },
      { icon: "store", title: { tr: "Pazaryeri desteği", en: "Marketplace support" }, body: { tr: "Shopify, WooCommerce, Amazon ve Trendyol'dan kataloğunu çek; tek panelden yönet.", en: "Pull your catalog from Shopify, WooCommerce, Amazon and Trendyol — manage it all from one panel." } },
      { icon: "file-chart-column", title: { tr: "Raporlar", en: "Reports" }, body: { tr: "Fiyat endeksin, kazandığın/kaybettiğin SKU'lar ve marj etkisi haftalık özetlerle gelir.", en: "Your price index, won/lost SKUs and margin impact arrive as weekly digests and exportable reports." } },
    ],
    stats: [
      { value: "12K+", label: { tr: "günlük fiyat kontrolü", en: "price checks / day" } },
      { value: "4", label: { tr: "pazaryeri", en: "marketplaces" } },
      { value: "~6dk", label: { tr: "tarama aralığı", en: "scan interval" } },
      { value: "+%12", label: { tr: "ortalama marj", en: "avg margin lift" } },
    ],
    pricing: [
      { name: "Starter", price: "$49", period: { tr: "/ay", en: "/mo" }, tagline: { tr: "İlk kataloğunu izlemeye başla.", en: "Start watching your first catalog." }, features: [{ tr: "100 ürüne kadar", en: "Up to 100 products" }, { tr: "5 rakip / ürün", en: "5 competitors / product" }, { tr: "Günde 2 tarama", en: "2 scans per day" }, { tr: "E-posta uyarıları", en: "Email alerts" }], cta: { tr: "Başla", en: "Get started" } },
      { name: "Growth", price: "$149", period: { tr: "/ay", en: "/mo" }, tagline: { tr: "Büyüyen mağazalar için.", en: "For scaling stores." }, features: [{ tr: "2.000 ürüne kadar", en: "Up to 2,000 products" }, { tr: "Sınırsız rakip", en: "Unlimited competitors" }, { tr: "Saatlik tarama", en: "Hourly scans" }, { tr: "Otomatik yeniden fiyatlandırma", en: "Auto-repricing" }, { tr: "Slack + e-posta uyarıları", en: "Slack + email alerts" }], cta: { tr: "Başla", en: "Get started" }, featured: true },
      { name: "Scale", price: "$259", period: { tr: "/ay", en: "/mo" }, tagline: { tr: "Büyük kataloglar için.", en: "For large catalogs." }, features: [{ tr: "Growth'taki her şey", en: "Everything in Growth" }, { tr: "50.000+ ürün", en: "50,000+ products" }, { tr: "Dakikada tarama & API", en: "Per-minute scans & API" }, { tr: "Özel kurallar & roller", en: "Custom rules & roles" }, { tr: "Özel hesap yöneticisi", en: "Dedicated manager" }], cta: { tr: "Başla", en: "Get started" } },
    ],
    faq: [
      { q: { tr: "Rakip fiyatlarını nasıl topluyorsunuz?", en: "How do you collect competitor prices?" }, a: { tr: "Her ürün için eşlediğin rakip URL'lerini düzenli aralıklarla tarar; fiyat, stok ve kargo bilgisini çıkarırız. Pazaryeri API'leri olanlar için doğrudan onları kullanırız.", en: "We scan the competitor URLs you match to each product at regular intervals, extracting price, stock and shipping. Where marketplace APIs exist, we use them directly." } },
      { q: { tr: "Otomatik yeniden fiyatlandırma nasıl çalışıyor?", en: "How does auto-repricing work?" }, a: { tr: "Kurallar tanımlarsın (ör. \"en düşüğü -%1 geç\", \"taban maliyet +%10\"). Bir rakip fiyatını değiştirdiğinde PriceNova kuralı uygular ve yeni fiyatı mağazana yazar — taban ve tavan sınırlarına saygı göstererek.", en: "You define rules (e.g. \"match lowest -1%\", \"floor = cost +10%\"). When a rival moves, PriceNova applies the rule and writes the new price back to your store — always respecting your floor and ceiling." } },
      { q: { tr: "Hangi mağaza ve pazaryerlerini destekliyorsunuz?", en: "Which stores and marketplaces do you support?" }, a: { tr: "Shopify ve WooCommerce ile çift yönlü senkron; Amazon ve Trendyol'dan katalog çekme. Yeni entegrasyonlar düzenli ekleniyor.", en: "Two-way sync with Shopify and WooCommerce; catalog pull from Amazon and Trendyol. New integrations land regularly." } },
      { q: { tr: "Fiyatlarım rakiplerime görünür mü?", en: "Are my prices visible to my competitors?" }, a: { tr: "Hayır. PriceNova yalnızca senin için herkese açık fiyatları okur; verilerin ve kuralların gizli kalır.", en: "No. PriceNova only reads publicly listed prices on your behalf; your data and rules stay private." } },
      { q: { tr: "Uyarıları nereye alabilirim?", en: "Where can I get alerts?" }, a: { tr: "E-posta ve Slack'e. Fiyat düşüşü, en-ucuz konumundan çıkma ve stok bitişi gibi olaylar için ayrı eşikler belirleyebilirsin.", en: "Email and Slack. You can set separate thresholds for price drops, losing the cheapest position, and stock-outs." } },
      { q: { tr: "Denemek için anahtar gerekli mi?", en: "Do I need keys to try it?" }, a: { tr: "Hayır. Gerçekçi örnek ürünler, rakip fiyatları ve geçmişiyle demo modda açılır — hemen tıklayabilirsin.", en: "No. It boots in demo mode with realistic sample products, competitor prices and history — click around immediately." } },
      { q: { tr: "Teknoloji nedir?", en: "What's the stack?" }, a: { tr: "Next.js 16, React 19, Tailwind v4. Supabase + bir fiyat-verisi sağlayıcısı + Shopify/WooCommerce + Slack ile bağlanır.", en: "Next.js 16, React 19, Tailwind v4. Wires to Supabase + a price-data provider + Shopify/WooCommerce + Slack." } },
      { q: { tr: "Yayına alabilir miyim?", en: "Can I deploy it?" }, a: { tr: "Evet — standart bir Next.js uygulaması. Vercel'e veya herhangi bir Node sunucusuna gönder.", en: "Yes — it's a standard Next.js app. Push to Vercel or any Node host." } },
    ],
  },

  navGroups: [
    {
      label: { tr: "Çalışma alanı", en: "Workspace" },
      items: [
        { label: { tr: "Panel", en: "Dashboard" }, href: "/dashboard", icon: "layout-dashboard" },
        { label: { tr: "Ürünler", en: "Products" }, href: "/products", icon: "package" },
        { label: { tr: "Rakipler", en: "Competitors" }, href: "/competitors", icon: "radar" },
        { label: { tr: "Fiyat değişimleri", en: "Price changes" }, href: "/changes", icon: "history" },
        { label: { tr: "Yeniden fiyatlandırma", en: "Repricing rules" }, href: "/rules", icon: "wand-sparkles" },
      ],
    },
    {
      label: { tr: "Yönetim", en: "Management" },
      items: [
        { label: { tr: "Uyarılar", en: "Alerts" }, href: "/alerts", icon: "bell-ring", muted: true },
        { label: { tr: "Raporlar", en: "Reports" }, href: "/reports", icon: "file-chart-column", muted: true },
        { label: { tr: "Pazaryerleri", en: "Marketplaces" }, href: "/marketplaces", icon: "store", badge: { tr: "Yakında", en: "Soon" }, muted: true },
        { label: { tr: "Entegrasyonlar", en: "Integrations" }, href: "/settings", icon: "plug" },
      ],
    },
  ],

  nav: [
    { label: { tr: "Panel", en: "Dashboard" }, href: "/dashboard", icon: "layout-dashboard" },
    { label: { tr: "Ürünler", en: "Products" }, href: "/products", icon: "package" },
    { label: { tr: "Rakipler", en: "Competitors" }, href: "/competitors", icon: "radar" },
    { label: { tr: "Fiyat değişimleri", en: "Price changes" }, href: "/changes", icon: "history" },
    { label: { tr: "Ayarlar", en: "Settings" }, href: "/settings", icon: "settings" },
  ],

  integrations: [
    {
      key: "supabase",
      name: "Supabase",
      envVars: ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"],
      required: false,
      docsUrl: "https://supabase.com/dashboard/project/_/settings/api",
      purpose: "Database & auth — your products, competitors and price history. Without it, the app runs in demo mode.",
    },
    {
      key: "price_data",
      name: "Scrapingdog (price data)",
      envVars: ["SCRAPINGDOG_API_KEY"],
      required: false,
      docsUrl: "https://www.scrapingdog.com/documentation",
      purpose: "Scrapes competitor product pages for live price, stock and shipping. Any scraping/price-data provider works.",
    },
    {
      key: "shopify",
      name: "Shopify",
      envVars: ["SHOPIFY_STORE_DOMAIN", "SHOPIFY_ADMIN_API_TOKEN"],
      required: false,
      docsUrl: "https://shopify.dev/docs/api/admin",
      purpose: "Pull your catalog and write repriced prices back to your store (WooCommerce works the same way).",
    },
    {
      key: "slack",
      name: "Slack (alerts)",
      envVars: ["SLACK_WEBHOOK_URL"],
      required: false,
      docsUrl: "https://api.slack.com/messaging/webhooks",
      purpose: "Post price-drop and lost-position alerts to a Slack channel (email alerts work without it).",
    },
  ],
};

export default appConfig;

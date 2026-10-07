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
  /** Per language: Turkish visitors see lira, everyone else sees dollars. */
  price: L;
  period?: L;
  tagline: L;
  features: L[];
  /** Announced but not built yet. Rendered muted with a "Soon" tag, never counted as part of the price. */
  soon?: L[];
  cta: L;
  featured?: boolean;
}

export interface FaqItem {
  q: L;
  a: L;
}

/**
 * A real customer story. Only add entries you can stand behind: a named brand
 * that agreed to be listed, a result they reported, and a quote they approved.
 * Leave the array empty and the whole testimonials section disappears — an
 * empty section costs nothing, invented customers cost trust.
 */
export interface CaseStudy {
  /** Brand name, written the way the customer writes it. */
  brand: string;
  /** Two letters for the avatar, used when there's no logo file. */
  initials: string;
  /** Logo in /public, e.g. "/customers/acme.svg". Optional. */
  logo?: string;
  /** Their result, in their own numbers — { tr: "Marj +%12", en: "Margin +12%" }. */
  result: L;
  /** One or two sentences, quoted verbatim, approved by them. */
  quote: L;
  /** Who said it. */
  author: string;
  /** Their title at the brand. */
  role: L;
}

/**
 * A review from a real PriceNova user, shown marketplace-style ("A*** Y***").
 * Only add one you actually received, with the person's permission to publish
 * it. Store initials only: the full name never enters the codebase or the
 * browser bundle. Leave the array empty and the reviews section stays hidden.
 */
export interface Review {
  /** First letter of each name part, e.g. ["A", "Y"] renders as "A*** Y***". */
  initials: string[];
  /** 1 to 5, exactly as the person gave it. */
  rating: 1 | 2 | 3 | 4 | 5;
  /** When the review was written, YYYY-MM-DD. */
  date: string;
  /** Who they are, in their words, e.g. { tr: "Trendyol satıcısı", en: "Trendyol seller" }. */
  context?: L;
  /** Their text, verbatim. Translate the other language faithfully, don't polish. */
  text: L;
  /** True only if the reviewer has (or had) a PriceNova account you can point to. */
  verified: boolean;
}

export interface Integration {
  key: string;
  name: string;
  envVars: string[];
  required: boolean;
  docsUrl: string;
  purpose: string;
}

/**
 * The legal entity behind the product. The legal pages (privacy, terms, KVKK,
 * retention, security), the about/contact pages and the footer all read from
 * here. Fill in only what is true; an empty field renders as a visible
 * "[...]" placeholder and keeps the "company details missing" notice on the
 * legal pages, so an unfinished policy can never pass for a finished one.
 */
export interface Company {
  /** Registered trade name, e.g. "PriceNova Yazılım Teknolojileri A.Ş." */
  legalName: string;
  /** Registered address, one line. */
  address: string;
  /** MERSİS number (16 digits). */
  mersisNo: string;
  taxOffice: string;
  taxNumber: string;
  /** KEP address; KVKK applications may be sent here. */
  kep: string;
  /** Optional. Leave empty to show email only. */
  phone: string;
  /** Courts that handle disputes under the terms, e.g. "İstanbul (Çağlayan)". */
  jurisdiction: string;
  /** Where the database is hosted, e.g. { tr: "AB (Frankfurt, Almanya)", en: "EU (Frankfurt, Germany)" }. */
  dataRegion: L | null;
  /** Who serves the web app, e.g. "Vercel Inc.". */
  hostingProvider: string;
  /** How long database backups are kept before they roll off, in days (see your Supabase plan). */
  backupRetentionDays: number | null;
  emails: { hello: string; privacy: string; security: string; careers: string };
}

export interface AppConfig {
  name: string;
  tagline: L;
  description: L;
  domain: string;
  logoText: string;
  accentName: string;
  company: Company;
  marketing: {
    badge: L;
    heroTitle: L;
    heroAccent: L;
    heroSubtitle: L;
    heroCtaPrimary: L;
    heroCtaSecondary: L;
    features: Feature[];
    stats: Stat[];
    caseStudies: CaseStudy[];
    reviews: Review[];
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

  /** Fill these in before going live. See the Company interface. */
  company: {
    legalName: "",
    address: "",
    mersisNo: "",
    taxOffice: "",
    taxNumber: "",
    kep: "",
    phone: "",
    jurisdiction: "",
    dataRegion: null,
    hostingProvider: "",
    backupRetentionDays: null,
    emails: {
      hello: "hello@pricenova.io",
      privacy: "privacy@pricenova.io",
      security: "security@pricenova.io",
      careers: "careers@pricenova.io",
    },
  },

  marketing: {
    badge: { tr: "E-ticaret fiyat takibi", en: "E-commerce price tracking" },
    heroTitle: {
      tr: "Rakibin fiyat kırdığında",
      en: "When a rival cuts a price,",
    },
    heroAccent: {
      tr: "ilk sen bil.",
      en: "know it first.",
    },
    heroSubtitle: {
      tr: "Planına göre günde birkaç kezden dakikalık takibe kadar rakip fiyatlarını izle. PriceNova rakibin fiyat düşürdüğünde veya fiyat avantajını kaybettiğinde seni uyarır; istersen belirlediğin sınırlar içinde fiyatını kendisi günceller.",
      en: "Track rival prices from a few times a day up to every minute, depending on your plan. PriceNova alerts you when a rival cuts a price or you lose your price advantage and, if you want, updates your price within the limits you set.",
    },
    /**
     * Two different doors, and the labels say which is which: the primary one
     * leads to the plans and the quote form, the secondary one opens the sample
     * workspace with no signup at all. Keep them distinguishable if you reword them.
     */
    heroCtaPrimary: { tr: "Fiyatları gör", en: "See pricing" },
    heroCtaSecondary: { tr: "Ücretsiz demo", en: "Free demo" },
    features: [
      { icon: "radar", title: { tr: "Rakip takibi", en: "Competitor tracking" }, body: { tr: "Paketine göre günde birkaç kez ya da dakikada bir kontrol edilir: fiyat, stok ve kargo dahil.", en: "Depending on your plan, checked a few times a day or once a minute: price, stock and shipping included." } },
      { icon: "bell-ring", title: { tr: "Fiyat uyarıları", en: "Price alerts" }, body: { tr: "Bir rakip fiyat düşürdüğünde ya da sen en ucuz olmaktan çıktığında e-posta ve Slack'e anında bildirim.", en: "Get an instant email and Slack alert when a rival drops a price or you stop being the cheapest." } },
      { icon: "wand-sparkles", title: { tr: "Otomatik yeniden fiyatlandırma", en: "Auto-repricing" }, body: { tr: "\"En düşüğü -%1 geç\" ya da \"taban = maliyet +%10\" gibi kurallar tanımla; PriceNova fiyatını otomatik ayarlasın.", en: "Set rules like \"match lowest -1%\" or \"floor = cost +10%\" and let PriceNova adjust your price automatically." } },
      { icon: "history", title: { tr: "Fiyat geçmişi", en: "Price history" }, body: { tr: "Her rakip için fiyatın zaman içindeki seyrini gör; sezonsal hamleleri ve indirim döngülerini yakala.", en: "See every competitor's price over time and catch seasonal moves and discount cycles before they hurt you." } },
      { icon: "store", title: { tr: "Pazaryeri desteği", en: "Marketplace support" }, body: { tr: "Shopify, WooCommerce, Trendyol, Hepsiburada ve n11'deki ürünlerini tek panelden izle.", en: "Watch your products on Shopify, WooCommerce, Trendyol, Hepsiburada and n11 from one panel." } },
      { icon: "file-chart-column", title: { tr: "Raporlar", en: "Reports" }, body: { tr: "Fiyat endeksin, kazandığın/kaybettiğin SKU'lar ve marj etkisi haftalık özetlerle gelir.", en: "Your price index, won/lost SKUs and margin impact arrive as weekly digests and exportable reports." } },
    ],
    /**
     * What the product can do — not traction claims. These render on the
     * marketing page and the auth panel, where invented customer counts or
     * margin lifts would be unverifiable. Keep any number you put here one you
     * can point at a feature or a plan for.
     */
    stats: [
      { value: "5", label: { tr: "mağaza & pazaryeri", en: "stores & marketplaces" } },
      { value: "1 dk", label: { tr: "en sık fiyat kontrolü", en: "fastest price check" } },
      { value: "14 gün", label: { tr: "ücretsiz deneme", en: "free trial" } },
      { value: "2", label: { tr: "uyarı kanalı", en: "alert channels" } },
    ],
    /**
     * Real customer stories only. Empty on purpose: the homepage shows anonymous
     * usage scenarios instead, and this section appears by itself once a named
     * customer has given written permission to be listed.
     */
    caseStudies: [],
    /** Real user reviews only. See the Review interface for the rules. */
    reviews: [],

    /**
     * Turkish prices exclude VAT (the period line says "+ KDV"); USD prices are
     * shown as-is. Anything listed under `soon` is announced, not sold: it is
     * rendered muted with a "Yakında" tag and is not part of what the price buys.
     */
    pricing: [
      { name: "Starter", price: { tr: "₺1.990", en: "$49" }, period: { tr: "/ay + KDV", en: "/mo" }, tagline: { tr: "İlk kataloğunu izlemeye başla.", en: "Start watching your first catalog." }, features: [{ tr: "100 ürüne kadar", en: "Up to 100 products" }, { tr: "5 rakip / ürün", en: "5 competitors / product" }, { tr: "Günde 2 tarama", en: "2 scans per day" }, { tr: "E-posta uyarıları", en: "Email alerts" }], cta: { tr: "Teklif al", en: "Get a quote" } },
      { name: "Growth", price: { tr: "₺5.990", en: "$149" }, period: { tr: "/ay + KDV", en: "/mo" }, tagline: { tr: "Büyüyen mağazalar için.", en: "For scaling stores." }, features: [{ tr: "2.000 ürüne kadar", en: "Up to 2,000 products" }, { tr: "Sınırsız rakip", en: "Unlimited competitors" }, { tr: "Saatlik tarama", en: "Hourly scans" }, { tr: "Otomatik yeniden fiyatlandırma", en: "Auto-repricing" }, { tr: "Slack + e-posta uyarıları", en: "Slack + email alerts" }], cta: { tr: "Teklif al", en: "Get a quote" }, featured: true },
      { name: "Scale", price: { tr: "₺9.990", en: "$259" }, period: { tr: "/ay + KDV", en: "/mo" }, tagline: { tr: "Büyük kataloglar için.", en: "For large catalogs." }, features: [{ tr: "Growth'taki her şey", en: "Everything in Growth" }, { tr: "50.000+ ürün", en: "50,000+ products" }, { tr: "Dakikada bir tarama", en: "Per-minute scans" }, { tr: "Özel kurallar & roller", en: "Custom rules & roles" }, { tr: "Özel hesap yöneticisi", en: "Dedicated manager" }], soon: [{ tr: "API erişimi", en: "API access" }], cta: { tr: "Teklif al", en: "Get a quote" } },
    ],
    /**
     * Written for the person deciding whether to trust us with their prices,
     * not for developers. No stack names, no API talk, no jargon: the two
     * questions people actually hesitate on are "will you mess up my prices?"
     * and "can I undo it?", so those are answered first and plainly.
     */
    faq: [
      {
        q: { tr: "Rakiplerimin fiyatlarını nereden buluyorsunuz?", en: "Where do you get my competitors' prices?" },
        a: {
          tr: "Rakip mağazaların herkese açık ürün sayfalarına düzenli aralıklarla bakar; oradaki fiyatı, stok durumunu ve kargo bilgisini okuruz. Yani bir müşterinin gördüğü neyse onu görürüz. Gizli bir erişimimiz ya da özel anlaşmamız yok.",
          en: "We look at your rivals' public product pages at regular intervals and read the price, stock status and shipping shown there: exactly what any shopper sees. We have no special access and no private deals.",
        },
      },
      {
        q: { tr: "Fiyatlar ne sıklıkla kontrol ediliyor?", en: "How often are prices checked?" },
        a: {
          tr: "Paketine bağlı. Starter paketinde günde iki kez, Growth paketinde saatte bir, Scale paketinde dakikada bir bakarız. Bir rakip fiyatını değiştirdiğinde bunu ne kadar çabuk öğreneceğini belirleyen şey budur.",
          en: "It depends on your plan: twice a day on Starter, hourly on Growth, and every minute on Scale. This is what decides how quickly you hear about a rival's move.",
        },
      },
      {
        q: { tr: "Yanlış ürünü rakip olarak eşleştirirseniz ne olur?", en: "What if you match my product to the wrong one?" },
        a: {
          tr: "Bu riski ciddiye alıyoruz, çünkü yanlış bir eşleşme ona dayanan her karşılaştırmayı bozar. Önce barkoda bakarız: barkod aynıysa aynı üründür, tartışma yok. Barkod yoksa marka ve model koduna bakarız. İkisi de yoksa ürün adından tahmin yürütürüz ve bu tahmin asla kendiliğinden kullanılmaz: \"Eşleşmeler\" ekranında, neden öyle düşündüğümüzle birlikte onayına sunulur. Onaylamazsan o rakip fiyat hesabına hiç girmez.",
          en: "We take this seriously, because one wrong match poisons every comparison built on it. First we check the barcode: same barcode, same product, no argument. With no barcode we look at the brand and model code. If neither exists we guess from the product title, and a guess is never used on its own: it appears on your Matches screen with our reasoning, waiting for your yes. Until you approve it, that rival's price doesn't count at all.",
        },
      },
      {
        q: { tr: "Fiyatımı siz mi değiştiriyorsunuz? Kontrol kimde?", en: "Do you change my prices? Who's in control?" },
        a: {
          tr: "Tamamen sana bağlı. Her kural için iki seçenek var: \"Önce bana sor\" dersen PriceNova fiyatına dokunmaz, yalnızca öneri bırakır ve sen onaylayana kadar hiçbir şey değişmez. \"Otomatik uygula\" dersen değişikliği kendisi yapar. Kural kural seçersin; hepsini onaylı modda tutman da gayet mümkün.",
          en: "Entirely up to you. Every rule has two settings: on \"ask me first\", PriceNova never touches your price; it just leaves a suggestion, and nothing moves until you approve it. On \"apply automatically\", it makes the change itself. You choose per rule, and keeping every rule on ask-me-first is a perfectly normal way to use it.",
        },
      },
      {
        q: { tr: "Bir hata olursa eski fiyata dönebilir miyim?", en: "If something goes wrong, can I get the old price back?" },
        a: {
          tr: "Evet. Otomatik yapılan her değişiklikte önceki fiyat saklanır; \"Eski fiyata dön\" düğmesiyle tek tıkla geri alırsın, tek tek ya da hepsini birden. Ayrıca panelin üst barında her ekranda duran bir durdurma düğmesi var: bastığın anda hiçbir kural fiyatına dokunamaz. Takip ve uyarılar çalışmaya devam eder, sadece fiyat yazma durur.",
          en: "Yes. Every automatic change keeps the price it replaced, and one click on \"restore old price\" puts it back, individually or all at once. There's also a stop button in the top bar of every screen: press it and no rule can touch a price, full stop. Tracking and alerts keep running; only the writing stops.",
        },
      },
      {
        q: { tr: "Fiyatım kontrolsüz düşer mi? Zarar eder miyim?", en: "Could my price spiral down and cost me money?" },
        a: {
          tr: "Hayır, çünkü her kuralın bir tabanı var. Maliyetini girersin, \"asla maliyet +%10'un altına inme\" dersin; bir rakip o seviyenin altına inerse PriceNova onu takip etmez, sana haber verir. Öneriyi onaylarken yeni kâr marjını da gösteririz, böylece ne kabul ettiğini görürsün.",
          en: "No, because every rule has a floor. You enter your cost, say \"never go below cost +10%\", and if a rival dives under that line PriceNova refuses to follow and tells you instead. When you approve a suggestion we show the margin it would leave you, so you can see exactly what you're agreeing to.",
        },
      },
      {
        q: { tr: "Verilerim güvende mi? Rakiplerim fiyatlarımı veya kurallarımı görebilir mi?", en: "Is my data safe? Can competitors see my prices or rules?" },
        a: {
          tr: "Hayır, göremezler. Kurallarını, maliyetlerini ve stratejini yalnızca sen görürsün. Biz sadece herkese açık fiyatları okuruz; senin verini kimseyle paylaşmayız, reklam için de kullanmayız.",
          en: "No, they can't. Your rules, your costs and your strategy are yours alone. We only ever read prices that are already public, and we don't share your data with anyone or use it for advertising.",
        },
      },
      {
        q: { tr: "Denemek için kayıt olmam veya kart girmem gerekiyor mu?", en: "Do I need to sign up or enter a card to try it?" },
        a: {
          tr: "Hayır. \"Ücretsiz demo\" düğmesine basarsan örnek bir mağazanın ürünleri, rakipleri ve fiyat geçmişiyle dolu paneli anında görürsün: kayıt yok, kart yok, kurulum yok. Kendi ürünlerinle denemeye hazır olduğunda hesap açarsın: 14 gün boyunca tüm özellikler ücretsiz, yine kart istemiyoruz. Süre dolunca panel kilitlenir ama verilerin silinmez; bir paket seçtiğinde kaldığın yerden devam edersin.",
          en: "No. \"Free demo\" drops you straight into a workspace filled with a sample store's products, rivals and price history: no signup, no card, no setup. When you're ready to try it with your own products you create an account. Every feature is free for 14 days, and we still don't ask for a card. When the trial ends the panel locks but nothing is deleted; pick a plan and you carry on where you left off.",
        },
      },
      {
        q: { tr: "Kendi mağazamı bağlamak ne kadar sürer?", en: "How long does connecting my own store take?" },
        a: {
          tr: "Shopify veya WooCommerce kullanıyorsan mağazanı bağlaman birkaç dakika sürer; ürünlerin kendiliğinden gelir. Trendyol, Hepsiburada ve n11'deki listelerini de takip edebiliriz. Rakip eşleştirmeleri ilk gün hazır olur, sen onaylarsın ve izleme başlar.",
          en: "If you're on Shopify or WooCommerce, connecting takes a few minutes and your products come across by themselves. We can track your Trendyol, Hepsiburada and n11 listings too. Competitor matches are ready the same day; you approve them and monitoring starts.",
        },
      },
    ],
  },

  navGroups: [
    {
      label: { tr: "Çalışma alanı", en: "Workspace" },
      items: [
        { label: { tr: "Panel", en: "Dashboard" }, href: "/dashboard", icon: "layout-dashboard" },
        { label: { tr: "Ürünler", en: "Products" }, href: "/products", icon: "package" },
        { label: { tr: "Rakipler", en: "Competitors" }, href: "/competitors", icon: "radar" },
        { label: { tr: "Eşleşmeler", en: "Matches" }, href: "/matches", icon: "git-compare-arrows" },
        { label: { tr: "Fiyat değişimleri", en: "Price changes" }, href: "/changes", icon: "history" },
        { label: { tr: "Yeniden fiyatlandırma", en: "Repricing rules" }, href: "/rules", icon: "wand-sparkles" },
        { label: { tr: "Onay kuyruğu", en: "Approval queue" }, href: "/approvals", icon: "bell-ring" },
      ],
    },
    {
      label: { tr: "Yönetim", en: "Management" },
      items: [
        { label: { tr: "Uyarılar", en: "Alerts" }, href: "/alerts", icon: "bell-ring", muted: true },
        { label: { tr: "Raporlar", en: "Reports" }, href: "/reports", icon: "file-chart-column" },
        { label: { tr: "Pazaryerleri", en: "Marketplaces" }, href: "/marketplaces", icon: "store" },
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

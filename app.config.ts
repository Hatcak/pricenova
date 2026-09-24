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
    caseStudies: CaseStudy[];
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
      tr: "PriceNova rakiplerinin fiyatlarını paketinize göre günde birkaç kez veya dakikada bir kontrol eder, sen düşük kaldığında uyarır ve kuralların doğrultusunda otomatik yeniden fiyatlandırarak marjını korur — sen başka işlerle ilgilenirken.",
      en: "PriceNova checks your rivals' prices a few times a day or once a minute depending on your plan, alerts you the moment you're undercut, and reprices within your rules to protect your margin — while you focus on everything else.",
    },
    /**
     * Two different doors, and the labels say which is which: the primary one
     * creates an account, the secondary one opens the sample workspace with no
     * signup at all. Keep them distinguishable if you reword them.
     */
    heroCtaPrimary: { tr: "Ücretsiz dene", en: "Try it free" },
    heroCtaSecondary: { tr: "Demo panelini aç", en: "Open the demo panel" },
    features: [
      { icon: "radar", title: { tr: "Rakip takibi", en: "Competitor tracking" }, body: { tr: "Paketinize göre fiyatlar günde birkaç kez veya dakikada bir kontrol edilir — fiyat, stok ve kargo dahil.", en: "Depending on your plan, prices are checked a few times a day or once a minute — price, stock and shipping included." } },
      { icon: "bell-ring", title: { tr: "Fiyat uyarıları", en: "Price alerts" }, body: { tr: "Bir rakip fiyat düşürdüğünde ya da sen en ucuz olmaktan çıktığında e-posta ve Slack'e anında bildirim.", en: "Get an instant email and Slack alert when a rival drops a price or you stop being the cheapest." } },
      { icon: "wand-sparkles", title: { tr: "Otomatik yeniden fiyatlandırma", en: "Auto-repricing" }, body: { tr: "\"En düşüğü -%1 geç\" ya da \"taban = maliyet +%10\" gibi kurallar tanımla; PriceNova fiyatını otomatik ayarlasın.", en: "Set rules like \"match lowest -1%\" or \"floor = cost +10%\" and let PriceNova adjust your price automatically." } },
      { icon: "history", title: { tr: "Fiyat geçmişi", en: "Price history" }, body: { tr: "Her rakip için fiyatın zaman içindeki seyrini gör; sezonsal hamleleri ve indirim döngülerini yakala.", en: "See every competitor's price over time and catch seasonal moves and discount cycles before they hurt you." } },
      { icon: "store", title: { tr: "Pazaryeri desteği", en: "Marketplace support" }, body: { tr: "Shopify, WooCommerce, Amazon ve Trendyol'dan kataloğunu çek; tek panelden yönet.", en: "Pull your catalog from Shopify, WooCommerce, Amazon and Trendyol — manage it all from one panel." } },
      { icon: "file-chart-column", title: { tr: "Raporlar", en: "Reports" }, body: { tr: "Fiyat endeksin, kazandığın/kaybettiğin SKU'lar ve marj etkisi haftalık özetlerle gelir.", en: "Your price index, won/lost SKUs and margin impact arrive as weekly digests and exportable reports." } },
    ],
    /**
     * What the product can do — not traction claims. These render on the
     * marketing page and the auth panel, where invented customer counts or
     * margin lifts would be unverifiable. Keep any number you put here one you
     * can point at a feature or a plan for.
     */
    stats: [
      { value: "4", label: { tr: "mağaza & pazaryeri", en: "stores & marketplaces" } },
      { value: "1 dk", label: { tr: "en sık fiyat kontrolü", en: "fastest price check" } },
      { value: "∞", label: { tr: "ürün başına rakip", en: "competitors / product" } },
      { value: "2", label: { tr: "uyarı kanalı", en: "alert channels" } },
    ],
    /**
     * ⚠️  DEMO CONTENT — every brand, person, quote and number below is made
     * up. They exist so the testimonials section has something to render while
     * you build. The marketing page labels this section as demo content on
     * screen; do not remove that label while these placeholders are here.
     *
     * Replace them one at a time as real customers agree to be named, and get
     * written permission before you publish anyone's name, logo or numbers.
     * Delete the label from app/(marketing)/page.tsx once the last placeholder
     * is gone — and empty this array to hide the section entirely.
     */
    caseStudies: [
      {
        brand: "Vestra Elektronik",
        initials: "SA",
        result: { tr: "Haftada 7 saat", en: "7 hours a week" },
        quote: {
          tr: "Her sabah on iki rakip sitesini elle açıyordum. Artık uyarılar kahvemle birlikte geliyor; o saatleri satın alma tarafına ayırdım.",
          en: "I used to open twelve rival sites by hand every morning. Now the alerts arrive with my coffee, and those hours go into buying instead.",
        },
        author: "Selin Arıkan",
        role: { tr: "Kurucu", en: "Founder" },
      },
      {
        brand: "Nord & Bloom",
        initials: "ML",
        result: { tr: "Marj +%9", en: "Margin +9%" },
        quote: {
          tr: "Taban kuralı olmadan rakibi körü körüne takip ediyorduk. Maliyet +%12 sınırını koyduktan sonra en ucuz kalmaya devam ettik ama zararına satmayı bıraktık.",
          en: "Without a floor rule we were following rivals blindly. After setting cost +12% we stayed cheapest but stopped selling at a loss.",
        },
        author: "Marta Lindqvist",
        role: { tr: "E-ticaret Müdürü", en: "Ecommerce Manager" },
      },
      {
        brand: "Kıvılcım Spor",
        initials: "BD",
        result: { tr: "En ucuz SKU %31 → %58", en: "Cheapest SKUs 31% → 58%" },
        quote: {
          tr: "Hangi kategoride kaybettiğimizi hiç bilmiyorduk. Rapor ekranı bunu ilk haftada gösterdi; koşu ayakkabılarında fiyatımız pazarın çok üstündeymiş.",
          en: "We had no idea which categories we were losing. The reports screen showed it in the first week — our running shoes sat way above the market.",
        },
        author: "Burak Demirtaş",
        role: { tr: "Operasyon Sorumlusu", en: "Operations Lead" },
      },
      {
        brand: "Harveston Home",
        initials: "JW",
        result: { tr: "1 öğleden sonra", en: "One afternoon" },
        quote: {
          tr: "Shopify bağlantısı bir öğleden sonrada kuruldu. Kurallar fiyatı doğrudan mağazaya yazıyor, kimse elle güncelleme yapmıyor artık.",
          en: "The Shopify connection took one afternoon. Rules write straight back to the store and nobody updates a price by hand any more.",
        },
        author: "James Whitfield",
        role: { tr: "E-ticaret Direktörü", en: "Head of Ecommerce" },
      },
      {
        brand: "PetiKöşe",
        initials: "EY",
        result: { tr: "Yanlış eşleşme: 0", en: "Zero bad matches" },
        quote: {
          tr: "Bir rakibin mama kabını 20 kiloluk mama çuvalıyla eşleştirmesi bütün hesabı bozardı. Sistem emin olmadığı eşleşmeyi bize sordu, biz de eledik.",
          en: "A rival's food bowl matched to our 20kg sack would have wrecked the whole comparison. The system asked us about the ones it wasn't sure of, and we threw them out.",
        },
        author: "Ece Yıldırım",
        role: { tr: "Kurucu Ortak", en: "Co-founder" },
      },
      {
        brand: "Lumea Studio",
        initials: "PR",
        result: { tr: "6 dakikada tepki", en: "6-minute reaction" },
        quote: {
          tr: "Black Friday'de bir rakip gece yarısı fiyat kırdı. Altı dakika sonra uyarı geldi, kural devreye girdi, sabaha yine ilk sıradaydık.",
          en: "A rival slashed prices at midnight on Black Friday. The alert came six minutes later, the rule fired, and we were back on top by morning.",
        },
        author: "Priya Raghavan",
        role: { tr: "Büyüme Sorumlusu", en: "Growth Lead" },
      },
      {
        brand: "Delta Parça",
        initials: "MS",
        result: { tr: "2.400 SKU", en: "2,400 SKUs" },
        quote: {
          tr: "Yedek parçada binlerce ürün var ve hepsi birbirine benziyor. Barkod eşleştirmesi olmasaydı bu işi hiç kuramazdık.",
          en: "Spare parts means thousands of products that all look alike. Without barcode matching we could never have set this up.",
        },
        author: "Mert Solak",
        role: { tr: "Satış Müdürü", en: "Sales Manager" },
      },
      {
        brand: "Brightfold Books",
        initials: "AK",
        result: { tr: "Onaylı mod", en: "Approval mode" },
        quote: {
          tr: "Fiyat kontrolünü hiçbir yazılıma devretmek istemiyorduk. Her kuralı \"önce bana sor\" modunda tutuyoruz; sabah on dakikada kuyruğu geçiyorum, yeter.",
          en: "We didn't want to hand price control to any software. Every rule stays on \"ask me first\" — ten minutes each morning clears the queue, and that's enough.",
        },
        author: "Anna Kowalski",
        role: { tr: "Fiyatlandırma Müdürü", en: "Pricing Manager" },
      },
      {
        brand: "Aksu Mutfak",
        initials: "DÖ",
        result: { tr: "Tek tıkla geri alma", en: "One-click undo" },
        quote: {
          tr: "Bir kuralı yanlış kurduk ve kırk üründe fiyat düştü. Panikledik ama \"tümünü geri al\" düğmesi hepsini bir dakikada eski haline getirdi.",
          en: "We set a rule up wrong and forty prices dropped. We panicked — then \"undo all\" put every one of them back inside a minute.",
        },
        author: "Deniz Öztürk",
        role: { tr: "Kategori Yöneticisi", en: "Category Manager" },
      },
      {
        brand: "Northpeak Outdoor",
        initials: "TR",
        result: { tr: "4 kanal tek panel", en: "4 channels, one panel" },
        quote: {
          tr: "Kendi sitemiz, Trendyol ve Amazon ayrı ayrı takip edilen üç dünyaydı. Pazaryerinde fiyatı hâlâ elle giriyoruz ama en azından ne olduğunu tek ekrandan görüyoruz.",
          en: "Our own site, Trendyol and Amazon were three worlds tracked separately. We still enter marketplace prices by hand, but at least we see what's happening on one screen.",
        },
        author: "Tomás Rivera",
        role: { tr: "Pazaryeri Sorumlusu", en: "Marketplace Manager" },
      },
    ],

    pricing: [
      { name: "Starter", price: "$49", period: { tr: "/ay", en: "/mo" }, tagline: { tr: "İlk kataloğunu izlemeye başla.", en: "Start watching your first catalog." }, features: [{ tr: "100 ürüne kadar", en: "Up to 100 products" }, { tr: "5 rakip / ürün", en: "5 competitors / product" }, { tr: "Günde 2 tarama", en: "2 scans per day" }, { tr: "E-posta uyarıları", en: "Email alerts" }], cta: { tr: "Başla", en: "Get started" } },
      { name: "Growth", price: "$149", period: { tr: "/ay", en: "/mo" }, tagline: { tr: "Büyüyen mağazalar için.", en: "For scaling stores." }, features: [{ tr: "2.000 ürüne kadar", en: "Up to 2,000 products" }, { tr: "Sınırsız rakip", en: "Unlimited competitors" }, { tr: "Saatlik tarama", en: "Hourly scans" }, { tr: "Otomatik yeniden fiyatlandırma", en: "Auto-repricing" }, { tr: "Slack + e-posta uyarıları", en: "Slack + email alerts" }], cta: { tr: "Başla", en: "Get started" }, featured: true },
      { name: "Scale", price: "$259", period: { tr: "/ay", en: "/mo" }, tagline: { tr: "Büyük kataloglar için.", en: "For large catalogs." }, features: [{ tr: "Growth'taki her şey", en: "Everything in Growth" }, { tr: "50.000+ ürün", en: "50,000+ products" }, { tr: "Dakikada tarama & API", en: "Per-minute scans & API" }, { tr: "Özel kurallar & roller", en: "Custom rules & roles" }, { tr: "Özel hesap yöneticisi", en: "Dedicated manager" }], cta: { tr: "Başla", en: "Get started" } },
    ],
    /**
     * Written for the person deciding whether to trust us with their prices —
     * not for developers. No stack names, no API talk, no jargon: the two
     * questions people actually hesitate on are "will you mess up my prices?"
     * and "can I undo it?", so those are answered first and plainly.
     */
    faq: [
      {
        q: { tr: "Rakiplerimin fiyatlarını nereden buluyorsunuz?", en: "Where do you get my competitors' prices?" },
        a: {
          tr: "Rakip mağazaların herkese açık ürün sayfalarına düzenli aralıklarla bakar; oradaki fiyatı, stok durumunu ve kargo bilgisini okuruz. Yani bir müşterinin gördüğü neyse onu görürüz. Gizli bir erişimimiz ya da özel anlaşmamız yok.",
          en: "We look at your rivals' public product pages at regular intervals and read the price, stock status and shipping shown there — exactly what any shopper sees. We have no special access and no private deals.",
        },
      },
      {
        q: { tr: "Fiyatlar ne sıklıkla kontrol ediliyor?", en: "How often are prices checked?" },
        a: {
          tr: "Paketinize göre fiyatlar günde birkaç kez veya dakikada bir kontrol edilir. Başlangıç paketinde günde iki kez bakarız; üst paketlerde saatte bir, en üst pakette dakikada bir. Bir rakip fiyatını değiştirdiğinde bunu ne kadar çabuk öğreneceğinizi belirleyen şey budur.",
          en: "Depending on your plan, prices are checked a few times a day or once a minute. The entry plan looks twice a day, higher plans hourly, and the top plan every minute. This is what decides how quickly you hear about a rival's move.",
        },
      },
      {
        q: { tr: "Yanlış ürünü rakip olarak eşleştirirseniz ne olur?", en: "What if you match my product to the wrong one?" },
        a: {
          tr: "Bu riski ciddiye alıyoruz, çünkü yanlış bir eşleşme ona dayanan her karşılaştırmayı bozar. Önce barkoda bakarız — barkod aynıysa aynı üründür, tartışma yok. Barkod yoksa marka ve model koduna bakarız. İkisi de yoksa ürün adından tahmin yürütürüz ve bu tahmin asla kendiliğinden kullanılmaz: \"Eşleşmeler\" ekranında, neden öyle düşündüğümüzle birlikte onayına sunulur. Onaylamazsan o rakip fiyat hesabına hiç girmez.",
          en: "We take this seriously, because one wrong match poisons every comparison built on it. First we check the barcode — same barcode, same product, no argument. With no barcode we look at the brand and model code. If neither exists we guess from the product title, and a guess is never used on its own: it appears on your Matches screen with our reasoning, waiting for your yes. Until you approve it, that rival's price doesn't count at all.",
        },
      },
      {
        q: { tr: "Fiyatımı siz mi değiştiriyorsunuz? Kontrol kimde?", en: "Do you change my prices? Who's in control?" },
        a: {
          tr: "Tamamen sana bağlı. Her kural için iki seçenek var: \"Önce bana sor\" dersen PriceNova fiyatına dokunmaz, yalnızca öneri bırakır — sen onaylayana kadar hiçbir şey değişmez. \"Otomatik uygula\" dersen değişikliği kendisi yapar. Kural kural seçersin; hepsini onaylı modda tutman da gayet mümkün.",
          en: "Entirely up to you. Every rule has two settings: on \"ask me first\", PriceNova never touches your price — it just leaves a suggestion, and nothing moves until you approve it. On \"apply automatically\", it makes the change itself. You choose per rule, and keeping every rule on ask-me-first is a perfectly normal way to use it.",
        },
      },
      {
        q: { tr: "Bir hata olursa eski fiyata dönebilir miyim?", en: "If something goes wrong, can I get the old price back?" },
        a: {
          tr: "Evet. Otomatik yapılan her değişiklikte önceki fiyat saklanır; \"Eski fiyata dön\" düğmesiyle tek tıkla geri alırsın — tek tek ya da hepsini birden. Ayrıca panelin üst barında her ekranda duran bir durdurma düğmesi var: bastığın anda hiçbir kural fiyatına dokunamaz. Takip ve uyarılar çalışmaya devam eder, sadece fiyat yazma durur.",
          en: "Yes. Every automatic change keeps the price it replaced, and one click on \"restore old price\" puts it back — individually or all at once. There's also a stop button in the top bar of every screen: press it and no rule can touch a price, full stop. Tracking and alerts keep running; only the writing stops.",
        },
      },
      {
        q: { tr: "Fiyatım kontrolsüz düşer mi? Zarar eder miyim?", en: "Could my price spiral down and cost me money?" },
        a: {
          tr: "Hayır, çünkü her kuralın bir tabanı var. Maliyetini girersin, \"asla maliyet +%10'un altına inme\" dersin; bir rakip o seviyenin altına inerse PriceNova onu takip etmez, sana haber verir. Öneriyi onaylarken yeni kâr marjını da gösteririz, böylece ne kabul ettiğini görürsün.",
          en: "No, because every rule has a floor. You enter your cost, say \"never go below cost +10%\", and if a rival dives under that line PriceNova refuses to follow — it tells you instead. When you approve a suggestion we show the margin it would leave you, so you can see exactly what you're agreeing to.",
        },
      },
      {
        q: { tr: "Rakiplerim benim fiyatlarımı veya kurallarımı görebilir mi?", en: "Can my competitors see my prices or my rules?" },
        a: {
          tr: "Hayır. Kurallarını, maliyetlerini ve stratejini yalnızca sen görürsün. Biz sadece herkese açık fiyatları okuruz; senin verini kimseyle paylaşmayız.",
          en: "No. Your rules, your costs and your strategy are yours alone. We only ever read prices that are already public, and we don't share your data with anyone.",
        },
      },
      {
        q: { tr: "Denemek için kayıt olmam veya kart girmem gerekiyor mu?", en: "Do I need to sign up or enter a card to try it?" },
        a: {
          tr: "Hayır. \"Demo panelini aç\" dersen örnek bir mağazanın ürünleri, rakipleri ve fiyat geçmişiyle dolu paneli anında görürsün — kayıt yok, kart yok, kurulum yok. Kendi ürünlerinle denemeye hazır olduğunda ücretsiz hesap açarsın; o zaman da kart istemiyoruz.",
          en: "No. \"Open the demo panel\" drops you straight into a workspace filled with a sample store's products, rivals and price history — no signup, no card, no setup. When you're ready to try it with your own products you create a free account, and we don't ask for a card then either.",
        },
      },
      {
        q: { tr: "Kendi mağazamı bağlamak ne kadar sürer?", en: "How long does connecting my own store take?" },
        a: {
          tr: "Shopify veya WooCommerce kullanıyorsan mağazanı bağlaman birkaç dakika sürer; ürünlerin kendiliğinden gelir. Amazon ve Trendyol'daki listelerini de çekebiliriz. Rakip eşleştirmeleri ilk gün hazır olur, sen onaylarsın ve izleme başlar.",
          en: "If you're on Shopify or WooCommerce, connecting takes a few minutes and your products come across by themselves. We can pull your Amazon and Trendyol listings too. Competitor matches are ready the same day; you approve them and monitoring starts.",
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

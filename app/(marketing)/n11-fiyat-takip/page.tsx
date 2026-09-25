import type { Metadata } from "next";
import appConfig from "@/app.config";
import { SeoLanding, type SeoLandingContent } from "@/components/marketing/seo-landing";

export const metadata: Metadata = {
  title: "n11 Fiyat Takip | PriceNova",
  description:
    "n11'de rakip mağazaların fiyatlarını takip edin, fiyat düştüğünde uyarı alın ve marjınızı koruyarak fiyat kararı verin. Kayıt gerektirmeyen demo.",
  keywords: [
    "n11 fiyat takip",
    "n11 fiyat takibi",
    "n11 rakip analizi",
    "n11 mağaza fiyat",
    "pazaryeri fiyat takibi",
  ],
  alternates: { canonical: `https://${appConfig.domain}/n11-fiyat-takip` },
  openGraph: {
    title: "n11 Fiyat Takip | PriceNova",
    description: "n11'deki rakip mağazaları izleyin, fiyat düştüğünde anında haber alın.",
    url: `https://${appConfig.domain}/n11-fiyat-takip`,
    type: "website",
  },
};

const content: SeoLandingContent = {
  eyebrow: { tr: "Pazaryeri takibi", en: "Marketplace tracking" },
  h1: {
    tr: "n11 fiyat takip",
    en: "n11 price tracking",
  },
  intro: {
    tr: "n11'de aynı ürünü birçok mağaza satar ve müşteri karar verirken fiyatları yan yana karşılaştırır. PriceNova rakip mağazaları izler, fiyatları paketinize göre günde birkaç kez veya dakikada bir kontrol eder ve siz en ucuz olmaktan çıktığınızda haber verir.",
    en: "On n11 many stores sell the same product, and customers compare prices side by side before they decide. PriceNova watches the rival stores, checks prices a few times a day or once a minute depending on your plan, and tells you when you stop being the cheapest.",
  },
  bullets: [
    { tr: "Aynı ürünü satan rakip mağazaları izleyin", en: "Watch the rival stores selling the same product" },
    { tr: "En ucuz konumu kaybettiğinizde anında uyarı", en: "Instant alert when you lose the cheapest spot" },
    { tr: "Diğer pazaryerleriyle tek ekranda karşılaştırma", en: "Compare with other marketplaces on one screen" },
    { tr: "Maliyet tabanınızın altına inmeyen öneriler", en: "Suggestions that never breach your cost floor" },
  ],
  sections: [
    {
      title: { tr: "n11'i neden ayrıca takip etmelisiniz?", en: "Why track n11 separately?" },
      body: {
        tr: "Birçok satıcı aynı ürünü birden fazla pazaryerinde satar ve fiyatı hepsinde aynı tutar. Oysa her pazaryerinde rakip listesi farklıdır: Trendyol'da en ucuz olduğunuz bir üründe n11'de başka bir mağaza sizi geçmiş olabilir. PriceNova her kanaldaki rakipleri ayrı ayrı izler, böylece hangi pazaryerinde kaybettiğinizi görürsünüz.",
        en: "Many sellers list the same product on several marketplaces and keep one price everywhere. But the set of rivals is different on each: a product where you're cheapest on Trendyol may have another store beating you on n11. PriceNova tracks rivals on each channel separately, so you can see which marketplace you're losing on.",
      },
    },
    {
      title: { tr: "Tüm pazaryerleri tek ekranda", en: "Every marketplace on one screen" },
      body: {
        tr: "Kendi siteniz, Trendyol, Hepsiburada ve n11'deki rakip fiyatları aynı üründe yan yana durur. Bir kanalda fiyat kırmanız gerektiğinde, diğer kanallardaki durumu da aynı anda görürsünüz; tek bir pazaryeri için verdiğiniz karar diğerlerindeki marjınızı sessizce bozmaz.",
        en: "Rival prices from your own site, Trendyol, Hepsiburada and n11 sit side by side on the same product. When you need to cut on one channel you see the others at the same time, so a decision made for one marketplace doesn't quietly erode your margin on the rest.",
      },
    },
    {
      title: { tr: "Önemli fark: n11'de izleriz, fiyatı siz yazarsınız", en: "An important limit: we watch, you write" },
      body: {
        tr: "Kendi mağazanızda (Shopify, WooCommerce) kurallarınız fiyatı gerçekten değiştirebilir. n11 tarafında ise PriceNova şu an yalnızca fiyatları okur. Bir kural tetiklendiğinde fiyatı değiştirmez; size uyarı gönderir ve öneriyi onay kuyruğuna bırakır. Kararı siz verir, değişikliği n11 mağaza panelinden siz yaparsınız.",
        en: "On your own store (Shopify, WooCommerce) your rules really can change a price. On n11, PriceNova currently only reads prices. When a rule fires it doesn't change anything — it alerts you and leaves the suggestion in your approval queue. You make the call and apply it in the n11 store panel yourself.",
      },
    },
    {
      title: { tr: "Fiyat geçmişiyle kampanyaya hazırlanın", en: "Prepare for campaigns with price history" },
      body: {
        tr: "Her rakip için tutulan fiyat geçmişi, kampanya dönemlerinde kimin gerçekten indirim yaptığını, kimin önce fiyat yükseltip sonra indirimli gösterdiğini ve kampanya bitince kimin ne zaman eski fiyatına döndüğünü gösterir. Bir sonraki kampanyaya bu bilgiyle girersiniz.",
        en: "The price history kept for each rival shows who genuinely discounts during campaigns, who raises first and then shows a \"discount\", and when each one returns to their old price once the campaign ends. You go into the next campaign knowing that.",
      },
    },
  ],
  faq: [
    {
      q: { tr: "n11'de fiyatımı otomatik değiştirebiliyor musunuz?", en: "Can you change my n11 price automatically?" },
      a: {
        tr: "Hayır. n11 tarafında şu an yalnızca fiyat okuyabiliyoruz. Kural tetiklendiğinde size uyarı gider ve öneri onay kuyruğuna düşer; değişikliği mağaza panelinden siz yaparsınız. Otomatik yazma yalnızca kendi mağazanızda (Shopify, WooCommerce) çalışır.",
        en: "No. On n11 we can currently only read prices. When a rule fires you get an alert and the suggestion lands in your approval queue; you apply it in the store panel yourself. Automatic write-back works only on your own store (Shopify, WooCommerce).",
      },
    },
    {
      q: { tr: "Kaç n11 ürünü takip edebilirim?", en: "How many n11 products can I track?" },
      a: {
        tr: "Paketinize bağlı: başlangıçta 100 ürüne kadar, üst paketlerde 2.000 ve 50.000+. Aynı ürünü birden fazla pazaryerinde takip etmek tek ürün sayılır.",
        en: "It depends on your plan: up to 100 products on the entry plan, 2,000 and 50,000+ above it. Tracking the same product on several marketplaces counts as one product.",
      },
    },
    {
      q: { tr: "Fiyatlar ne sıklıkla kontrol ediliyor?", en: "How often are prices checked?" },
      a: {
        tr: "Paketinize göre fiyatlar günde birkaç kez veya dakikada bir kontrol edilir.",
        en: "Depending on your plan, prices are checked a few times a day or once a minute.",
      },
    },
    {
      q: { tr: "n11 mağaza hesabımın şifresini vermem gerekiyor mu?", en: "Do I need to hand over my n11 store password?" },
      a: {
        tr: "Hayır. Rakip fiyatlarını okumak için herkese açık ürün sayfaları yeterlidir; hesabınıza giriş yapmayız.",
        en: "No. Reading rival prices only needs the public product pages; we don't log into your account.",
      },
    },
  ],
  related: [
    { href: "/trendyol-fiyat-takip-sistemi", label: { tr: "Trendyol fiyat takip sistemi", en: "Trendyol price tracking" } },
    { href: "/hepsiburada-fiyat-takip", label: { tr: "Hepsiburada fiyat takip", en: "Hepsiburada price tracking" } },
    { href: "/rakip-fiyat-takip-programi", label: { tr: "Rakip fiyat takip programı", en: "Competitor price tracking" } },
  ],
};

export default function Page() {
  return <SeoLanding content={content} />;
}

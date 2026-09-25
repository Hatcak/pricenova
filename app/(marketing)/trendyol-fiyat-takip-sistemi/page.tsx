import type { Metadata } from "next";
import appConfig from "@/app.config";
import { SeoLanding, type SeoLandingContent } from "@/components/marketing/seo-landing";

export const metadata: Metadata = {
  title: "Trendyol Fiyat Takip Sistemi | PriceNova",
  description:
    "Trendyol'daki rakip satıcıların fiyatlarını takip edin, kutuyu kaybettiğinizde uyarı alın ve marjınızı koruyarak fiyat kararı verin. Kayıt gerektirmeyen demo.",
  keywords: [
    "trendyol fiyat takip sistemi",
    "trendyol fiyat takibi",
    "trendyol rakip analizi",
    "pazaryeri fiyat takibi",
    "trendyol satıcı fiyat",
  ],
  alternates: { canonical: `https://${appConfig.domain}/trendyol-fiyat-takip-sistemi` },
  openGraph: {
    title: "Trendyol Fiyat Takip Sistemi | PriceNova",
    description: "Trendyol'daki rakip satıcıları izleyin, fiyat düştüğünde anında haber alın.",
    url: `https://${appConfig.domain}/trendyol-fiyat-takip-sistemi`,
    type: "website",
  },
};

const content: SeoLandingContent = {
  eyebrow: { tr: "Pazaryeri takibi", en: "Marketplace tracking" },
  h1: {
    tr: "Trendyol fiyat takip sistemi",
    en: "Trendyol price tracking",
  },
  intro: {
    tr: "Trendyol'da aynı ürünü satan onlarca satıcı olabilir ve sıralama büyük ölçüde fiyata bakar. PriceNova aynı üründeki rakip satıcıları izler, fiyatları paketinize göre günde birkaç kez veya dakikada bir kontrol eder ve siz en ucuz olmaktan çıktığınızda haber verir.",
    en: "On Trendyol dozens of sellers can list the same product, and ranking leans heavily on price. PriceNova watches the rival sellers on your listings, checks prices a few times a day or once a minute depending on your plan, and tells you when you stop being the cheapest.",
  },
  bullets: [
    { tr: "Aynı üründeki rakip satıcıları izleyin", en: "Watch rival sellers on the same listing" },
    { tr: "En ucuz konumu kaybettiğinizde anında uyarı", en: "Instant alert when you lose the cheapest spot" },
    { tr: "Kampanya dönemlerinde fiyat geçmişi", en: "Price history through campaign periods" },
    { tr: "Maliyet tabanınızın altına inmeyen öneriler", en: "Suggestions that never breach your cost floor" },
  ],
  sections: [
    {
      title: { tr: "Pazaryerinde fiyat neden bu kadar belirleyici?", en: "Why price decides so much on a marketplace" },
      body: {
        tr: "Kendi mağazanızda müşteri markanızı, kargo sürenizi ve yorumlarınızı bir bütün olarak değerlendirir. Pazaryerinde ise aynı ürün sayfasında yan yana dizilirsiniz ve ilk bakışta ayrışan tek şey fiyattır. Birkaç kuruşluk fark sıralamayı değiştirebilir. Bu yüzden pazaryerinde fiyat takibi, kendi sitenizdekinden daha sık ve daha dikkatli yapılmalıdır.",
        en: "On your own store a customer weighs your brand, delivery time and reviews together. On a marketplace you're lined up on the same product page, and at first glance the only thing that separates you is price. A few kuruş can change the order. That's why marketplace price tracking has to be more frequent and more careful than on your own site.",
      },
    },
    {
      title: { tr: "Önemli fark: Trendyol'da izleriz, fiyatı siz yazarsınız", en: "An important limit: we watch, you write" },
      body: {
        tr: "Bunu baştan net söylemek gerekir. Kendi mağazanızda (Shopify, WooCommerce) kurallarınız fiyatı gerçekten değiştirebilir. Trendyol tarafında ise PriceNova şu an yalnızca fiyatları okur. Bir kural tetiklendiğinde fiyatı değiştirmez; size uyarı gönderir ve öneriyi onay kuyruğuna bırakır. Kararı siz verir, değişikliği Trendyol panelinden siz yaparsınız.",
        en: "This needs saying up front. On your own store (Shopify, WooCommerce) your rules really can change a price. On Trendyol, PriceNova currently only reads prices. When a rule fires it doesn't change anything — it alerts you and leaves the suggestion in your approval queue. You make the call and apply it in the Trendyol panel yourself.",
      },
    },
    {
      title: { tr: "Doğru ürünü takip ettiğinizden nasıl emin olursunuz?", en: "Making sure you're tracking the right product" },
      body: {
        tr: "Pazaryerlerinde en sık yapılan hata, yanlış ilanı rakip sanmaktır. Aksesuar, yenilenmiş ürün ya da farklı bir varyant, gerçek rakibinizden çok daha ucuz görünür ve bütün karşılaştırmanızı bozar. PriceNova önce barkoda bakar; barkod yoksa marka ve model koduna. Emin olamadığı her eşleşmeyi, neden şüphelendiğini yazarak onayınıza sunar. \"Bu benim ürünüm değil\" dediğiniz an o fiyat hesaplardan çıkar.",
        en: "The most common marketplace mistake is treating the wrong listing as a rival. An accessory, a refurbished unit or a different variant looks far cheaper than your real competitor and corrupts every comparison. PriceNova checks the barcode first, then brand and model code. Every match it isn't sure about comes to you with its reasoning attached. The moment you say \"that's not my product\", that price leaves your calculations.",
      },
    },
    {
      title: { tr: "Kampanya dönemleri ve fiyat geçmişi", en: "Campaign periods and price history" },
      body: {
        tr: "Trendyol'da indirim dönemleri fiyatları toptan aşağı çeker ve sonra eski seviyeye döner. Her rakip için tutulan fiyat geçmişi grafiği bu döngüyü görünür kılar: hangi satıcı kampanyada gerçekten indiriyor, hangisi önce fiyat yükseltip sonra \"indirim\" yapıyor, kampanya bitince kim ne zaman eski fiyatına dönüyor. Bu bilgi, bir sonraki kampanyaya nasıl gireceğinizi belirler.",
        en: "Campaign periods on Trendyol pull prices down together and then let them drift back. The price-history chart kept for each rival makes the cycle visible: who genuinely discounts, who raises first and then \"discounts\", and when each one returns to their old price. That's what tells you how to enter the next campaign.",
      },
    },
  ],
  faq: [
    {
      q: { tr: "Trendyol'da fiyatımı otomatik değiştirebiliyor musunuz?", en: "Can you change my Trendyol price automatically?" },
      a: {
        tr: "Hayır. Trendyol tarafında şu an yalnızca fiyat okuyabiliyoruz. Kural tetiklendiğinde size uyarı gider ve öneri onay kuyruğuna düşer; değişikliği Trendyol panelinden siz yaparsınız. Otomatik yazma yalnızca kendi mağazanızda (Shopify, WooCommerce) çalışır.",
        en: "No. On Trendyol we can currently only read prices. When a rule fires you get an alert and the suggestion lands in your approval queue; you apply it in the Trendyol panel yourself. Automatic write-back works only on your own store (Shopify, WooCommerce).",
      },
    },
    {
      q: { tr: "Kaç Trendyol ürünü takip edebilirim?", en: "How many Trendyol products can I track?" },
      a: {
        tr: "Paketinize bağlı: başlangıçta 100 ürüne kadar, üst paketlerde 2.000 ve 50.000+. Aynı ürünü hem kendi mağazanızda hem Trendyol'da takip etmek tek ürün sayılır.",
        en: "It depends on your plan: up to 100 products on the entry plan, 2,000 and 50,000+ above it. Tracking the same product on both your own store and Trendyol counts as one product.",
      },
    },
    {
      q: { tr: "Fiyatlar ne sıklıkla kontrol ediliyor?", en: "How often are prices checked?" },
      a: {
        tr: "Paketinize göre fiyatlar günde birkaç kez veya dakikada bir kontrol edilir. Pazaryerinde fiyatlar hızlı değiştiği için sık kontrol eden paketler burada daha çok fark yaratır.",
        en: "Depending on your plan, prices are checked a few times a day or once a minute. Because marketplace prices move fast, the more frequent plans make a bigger difference here.",
      },
    },
    {
      q: { tr: "Trendyol hesabımın şifresini vermem gerekiyor mu?", en: "Do I need to hand over my Trendyol password?" },
      a: {
        tr: "Hayır. Rakip fiyatlarını okumak için herkese açık ürün sayfaları yeterlidir; hesabınıza giriş yapmayız.",
        en: "No. Reading rival prices only needs the public product pages; we don't log into your account.",
      },
    },
  ],
  related: [
    { href: "/hepsiburada-fiyat-takip", label: { tr: "Hepsiburada fiyat takip", en: "Hepsiburada price tracking" } },
    { href: "/n11-fiyat-takip", label: { tr: "n11 fiyat takip", en: "n11 price tracking" } },
    { href: "/rakip-fiyat-takip-programi", label: { tr: "Rakip fiyat takip programı", en: "Competitor price tracking" } },
  ],
};

export default function Page() {
  return <SeoLanding content={content} />;
}

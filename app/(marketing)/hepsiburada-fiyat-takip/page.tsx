import type { Metadata } from "next";
import appConfig from "@/app.config";
import { SeoLanding, type SeoLandingContent } from "@/components/marketing/seo-landing";

export const metadata: Metadata = {
  title: "Hepsiburada Fiyat Takip | PriceNova",
  description:
    "Hepsiburada'da aynı ürünü satan rakip satıcıların fiyatlarını takip edin, en ucuz olmaktan çıktığınızda uyarı alın ve marjınızı koruyarak fiyat kararı verin. Kayıt gerektirmeyen demo.",
  keywords: [
    "hepsiburada fiyat takip",
    "hepsiburada fiyat takibi",
    "hepsiburada rakip analizi",
    "hepsiburada satıcı fiyat",
    "pazaryeri fiyat takibi",
  ],
  alternates: { canonical: `https://${appConfig.domain}/hepsiburada-fiyat-takip` },
  openGraph: {
    title: "Hepsiburada Fiyat Takip | PriceNova",
    description: "Hepsiburada'daki rakip satıcıları izleyin, fiyat düştüğünde anında haber alın.",
    url: `https://${appConfig.domain}/hepsiburada-fiyat-takip`,
    type: "website",
  },
};

const content: SeoLandingContent = {
  eyebrow: { tr: "Pazaryeri takibi", en: "Marketplace tracking" },
  h1: {
    tr: "Hepsiburada fiyat takip",
    en: "Hepsiburada price tracking",
  },
  intro: {
    tr: "Hepsiburada'da bir ürün sayfasında birden fazla satıcı yer alır ve müşteri çoğu zaman ilk gördüğü fiyattan alır. PriceNova aynı üründeki rakip satıcıları izler, fiyatları paketinize göre günde birkaç kez veya dakikada bir kontrol eder ve siz en ucuz olmaktan çıktığınızda haber verir.",
    en: "On Hepsiburada a single product page carries several sellers, and customers usually buy at the first price they see. PriceNova watches the rival sellers on your listings, checks prices a few times a day or once a minute depending on your plan, and tells you when you stop being the cheapest.",
  },
  bullets: [
    { tr: "Aynı ürün sayfasındaki diğer satıcıları izleyin", en: "Watch the other sellers on the same product page" },
    { tr: "En ucuz konumu kaybettiğinizde anında uyarı", en: "Instant alert when you lose the cheapest spot" },
    { tr: "Rakip başına fiyat geçmişi grafiği", en: "A price-history chart for every rival" },
    { tr: "Maliyet tabanınızın altına inmeyen öneriler", en: "Suggestions that never breach your cost floor" },
  ],
  sections: [
    {
      title: { tr: "Aynı sayfada, farklı satıcılar", en: "Same page, different sellers" },
      body: {
        tr: "Hepsiburada'da aynı ürünü satan her satıcı ayrı bir ilan açmaz; hepsi aynı ürün sayfasında sıralanır. Bu, rakiplerinizi bulmayı kolaylaştırır ama rekabeti de sertleştirir: müşteri karşılaştırmayı sizin yerinize, tek bakışta yapar. PriceNova bu sayfadaki satıcıları ayrı ayrı izler ve hangisinin sizi ne zaman geçtiğini gösterir.",
        en: "On Hepsiburada, sellers of the same product don't each open a separate listing; they're lined up on one product page. That makes rivals easy to find but the competition harder: the customer does the comparison for you, at a glance. PriceNova tracks each seller on that page separately and shows who passed you, and when.",
      },
    },
    {
      title: { tr: "En ucuz olmak, zararına satmak demek değil", en: "Being cheapest doesn't mean selling at a loss" },
      body: {
        tr: "Bir rakip fiyatı maliyetinizin altına çektiğinde onu takip etmek, satışı kazanıp parayı kaybetmek demektir. PriceNova'da her ürün için bir taban belirlersiniz; örneğin maliyet +%12. Önerilen fiyat bu tabanın altına hiçbir zaman inmez. Rakip daha aşağı indiğinde öneri tabanda durur.",
        en: "When a rival drops below your cost, following them means winning the sale and losing the money. In PriceNova you set a floor for each product — say cost +12%. A suggested price never goes below it. When a rival goes lower, the suggestion stops at the floor.",
      },
    },
    {
      title: { tr: "Önemli fark: Hepsiburada'da izleriz, fiyatı siz yazarsınız", en: "An important limit: we watch, you write" },
      body: {
        tr: "Kendi mağazanızda (Shopify, WooCommerce) kurallarınız fiyatı gerçekten değiştirebilir. Hepsiburada tarafında ise PriceNova şu an yalnızca fiyatları okur. Bir kural tetiklendiğinde fiyatı değiştirmez; size uyarı gönderir ve öneriyi onay kuyruğuna bırakır. Kararı siz verir, değişikliği Hepsiburada satıcı panelinden siz yaparsınız.",
        en: "On your own store (Shopify, WooCommerce) your rules really can change a price. On Hepsiburada, PriceNova currently only reads prices. When a rule fires it doesn't change anything — it alerts you and leaves the suggestion in your approval queue. You make the call and apply it in the Hepsiburada seller panel yourself.",
      },
    },
    {
      title: { tr: "Doğru ürünü takip ettiğinizden emin olun", en: "Make sure you're tracking the right product" },
      body: {
        tr: "Benzer isimli ama farklı kapasite, renk ya da paket içeriğine sahip ürünler fiyat karşılaştırmasını bozar. PriceNova önce barkoda, barkod yoksa marka ve model koduna bakar. Emin olamadığı her eşleşmeyi, neden şüphelendiğini yazarak onayınıza sunar. \"Bu benim ürünüm değil\" dediğiniz an o fiyat hesaplardan çıkar.",
        en: "Products with similar names but a different capacity, colour or bundle break a price comparison. PriceNova checks the barcode first, then brand and model code. Every match it isn't sure about comes to you with its reasoning attached. The moment you say \"that's not my product\", that price leaves your calculations.",
      },
    },
  ],
  faq: [
    {
      q: { tr: "Hepsiburada'da fiyatımı otomatik değiştirebiliyor musunuz?", en: "Can you change my Hepsiburada price automatically?" },
      a: {
        tr: "Hayır. Hepsiburada tarafında şu an yalnızca fiyat okuyabiliyoruz. Kural tetiklendiğinde size uyarı gider ve öneri onay kuyruğuna düşer; değişikliği satıcı panelinden siz yaparsınız. Otomatik yazma yalnızca kendi mağazanızda (Shopify, WooCommerce) çalışır.",
        en: "No. On Hepsiburada we can currently only read prices. When a rule fires you get an alert and the suggestion lands in your approval queue; you apply it in the seller panel yourself. Automatic write-back works only on your own store (Shopify, WooCommerce).",
      },
    },
    {
      q: { tr: "Aynı ürünü Trendyol ve n11'de de satıyorum. Ayrı ayrı mı ödüyorum?", en: "I sell the same product on Trendyol and n11 too. Do I pay for each?" },
      a: {
        tr: "Hayır. Aynı ürünü birden fazla pazaryerinde ve kendi mağazanızda takip etmek tek ürün sayılır. Tüm kanallardaki rakip fiyatlarını tek ekranda yan yana görürsünüz.",
        en: "No. Tracking the same product across several marketplaces and your own store counts as one product. You see rival prices from every channel side by side on one screen.",
      },
    },
    {
      q: { tr: "Fiyatlar ne sıklıkla kontrol ediliyor?", en: "How often are prices checked?" },
      a: {
        tr: "Paketinize göre fiyatlar günde birkaç kez veya dakikada bir kontrol edilir. Kampanya dönemlerinde fiyatlar saatler içinde değişebildiği için sık kontrol eden paketler daha çok fark yaratır.",
        en: "Depending on your plan, prices are checked a few times a day or once a minute. Because prices can shift within hours during campaigns, the more frequent plans make a bigger difference.",
      },
    },
    {
      q: { tr: "Hepsiburada satıcı hesabımın şifresini vermem gerekiyor mu?", en: "Do I need to hand over my Hepsiburada seller password?" },
      a: {
        tr: "Hayır. Rakip fiyatlarını okumak için herkese açık ürün sayfaları yeterlidir; hesabınıza giriş yapmayız.",
        en: "No. Reading rival prices only needs the public product pages; we don't log into your account.",
      },
    },
  ],
  related: [
    { href: "/trendyol-fiyat-takip-sistemi", label: { tr: "Trendyol fiyat takip sistemi", en: "Trendyol price tracking" } },
    { href: "/n11-fiyat-takip", label: { tr: "n11 fiyat takip", en: "n11 price tracking" } },
    { href: "/rakip-fiyat-takip-programi", label: { tr: "Rakip fiyat takip programı", en: "Competitor price tracking" } },
  ],
};

export default function Page() {
  return <SeoLanding content={content} />;
}

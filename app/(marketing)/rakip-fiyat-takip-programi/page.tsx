import type { Metadata } from "next";
import appConfig from "@/app.config";
import { openGraph } from "@/lib/seo";
import { SeoLanding, type SeoLandingContent } from "@/components/marketing/seo-landing";

export const metadata: Metadata = {
  title: "Rakip Fiyat Takip Programı",
  description:
    "Rakiplerinizin fiyatlarını otomatik takip edin, siz ucuz olmaktan çıktığınızda anında haber alın ve kurallarınızla yeniden fiyatlandırın. Kayıt gerektirmeyen demo panel.",
  keywords: [
    "rakip fiyat takip programı",
    "rakip fiyat takibi",
    "fiyat takip yazılımı",
    "e-ticaret fiyat takibi",
    "otomatik fiyatlandırma",
  ],
  alternates: { canonical: `https://${appConfig.domain}/rakip-fiyat-takip-programi` },
  openGraph: openGraph({
    title: "Rakip Fiyat Takip Programı | PriceNova",
    description:
      "Rakip fiyatlarını otomatik izleyin, düşük kaldığınızda uyarı alın, kurallarınızla yeniden fiyatlandırın.",
    url: `https://${appConfig.domain}/rakip-fiyat-takip-programi`,
  }),
};

const content: SeoLandingContent = {
  eyebrow: { tr: "Rakip fiyat takibi", en: "Competitor price tracking" },
  h1: {
    tr: "Rakip fiyat takip programı",
    en: "Competitor price tracking software",
  },
  intro: {
    tr: "Rakiplerinizin fiyatlarını elle kontrol etmek, kaç ürününüz varsa o kadar sekme açmak demek. PriceNova bunu sizin yerinize yapar: her ürününüzü rakibin ilanıyla eşleştirir, fiyatlarını paketinize göre günde birkaç kez veya dakikada bir kontrol eder ve siz en ucuz olmaktan çıktığınız anda haber verir.",
    en: "Checking rival prices by hand means opening one tab per product. PriceNova does it for you: it matches each of your products to the rival's listing, checks prices a few times a day or once a minute depending on your plan, and tells you the moment you stop being the cheapest.",
  },
  bullets: [
    { tr: "Ürün başına sınırsız rakip takibi", en: "Unlimited rivals per product" },
    { tr: "Fiyat düştüğünde e-posta ve Slack uyarısı", en: "Email and Slack alerts on every drop" },
    { tr: "Her rakip için fiyat geçmişi grafiği", en: "A price-history chart per rival" },
    { tr: "Kural bazlı otomatik yeniden fiyatlandırma", en: "Rule-based automatic repricing" },
  ],
  sections: [
    {
      title: { tr: "Fiyat takibi tam olarak nasıl çalışıyor?", en: "How price tracking actually works" },
      body: {
        tr: "Kataloğunuzu Shopify veya WooCommerce'ten içe aktarırsınız; isterseniz SKU ve maliyetlerle elle de ekleyebilirsiniz. Ardından her ürün için rakip ilanları eşleştirilir. Bu eşleştirme önce barkoda (GTIN), barkod yoksa marka ve model koduna bakar. İkisi de yoksa ürün adından tahmin yürütülür ve bu tahmin asla sizin onayınız olmadan kullanılmaz. Eşleştirme tamamlandıktan sonra sistem rakip sayfalarını düzenli aralıklarla okur; fiyat, stok durumu ve kargo bilgisini kaydeder.",
        en: "You import your catalog from Shopify or WooCommerce, or add SKUs and costs by hand. Then each product is matched to the rival listings. Matching looks at the barcode (GTIN) first, then brand and model code. If neither exists we guess from the product title, and that guess is never used without your approval. Once matching is done, the system reads the rival pages at regular intervals and records price, stock and shipping.",
      },
    },
    {
      title: { tr: "Neden elle takip bir noktada çöker?", en: "Why manual tracking collapses" },
      body: {
        tr: "Yirmi ürün ve üç rakip, günde altmış kontrol demektir. Elli ürüne çıktığınızda bu sayı yüz elliyi geçer ve hafta sonları ile gece indirimlerini kaçırmaya başlarsınız. Rakipler fiyatlarını genellikle mesai dışında değiştirir. Otomatik takibin asıl faydası hız değil, sürekliliktir: siz uyurken de bakar.",
        en: "Twenty products and three rivals is sixty checks a day. At fifty products it passes a hundred and fifty, and you start missing weekend and overnight discounts. Rivals usually move outside office hours. The real benefit of automation isn't speed, it's continuity: it keeps looking while you sleep.",
      },
    },
    {
      title: { tr: "Takip etmek yetmez; ne yapacağınıza siz karar verirsiniz", en: "Tracking isn't enough; you decide what happens next" },
      body: {
        tr: "Bir rakip fiyat kırdığında iki seçeneğiniz var. Kuralı \"önce bana sor\" moduna alırsanız PriceNova fiyatınıza dokunmaz; önerisini, uygulanması hâlinde kalacak kâr marjıyla birlikte onay kuyruğuna bırakır. \"Otomatik uygula\" derseniz değişikliği kendisi yapar, ama önceki fiyatı saklar; tek tıkla geri alabilirsiniz. Ayrıca panelin üst barında her ekranda duran bir durdurma düğmesi vardır: bastığınız anda hiçbir kural fiyatınıza dokunamaz.",
        en: "When a rival cuts, you have two options. Set the rule to \"ask me first\" and PriceNova never touches your price; it leaves the proposal in your approval queue along with the margin it would leave you. Set it to apply automatically and it makes the change itself, but keeps the previous price so one click restores it. There's also a stop button in the top bar of every screen: press it and no rule can touch your price.",
      },
    },
    {
      title: { tr: "Marjınızı koruyan taban kuralı", en: "The floor rule that protects your margin" },
      body: {
        tr: "Fiyat takibinin en büyük riski, rakibi körü körüne takip edip zarara satmaktır. Her kurala bir taban tanımlarsınız, örneğin \"asla maliyet +%10'un altına inme\". Bir rakip o seviyenin altına düşerse sistem onu takip etmez; size haber verir ve kararı size bırakır. Öneri ekranında yeni marjınız da yazdığı için neye evet dediğinizi görürsünüz.",
        en: "The biggest risk in price tracking is blindly following a rival into a loss. Every rule gets a floor, say \"never go below cost +10%\". If a rival dives under that line the system refuses to follow; it tells you and leaves the call to you. The suggestion screen shows the margin you'd be left with, so you can see what you're agreeing to.",
      },
    },
  ],
  faq: [
    {
      q: { tr: "Rakip fiyat takip programı ne kadar sürede kurulur?", en: "How long does setup take?" },
      a: {
        tr: "Shopify veya WooCommerce kullanıyorsanız mağazanızı bağlamak birkaç dakika sürer ve ürünleriniz kendiliğinden gelir. Rakip eşleştirmeleri aynı gün hazır olur; siz onaylarsınız ve takip başlar.",
        en: "If you're on Shopify or WooCommerce, connecting takes a few minutes and your products arrive by themselves. Competitor matches are ready the same day; you approve them and tracking starts.",
      },
    },
    {
      q: { tr: "Fiyatlar ne sıklıkla kontrol ediliyor?", en: "How often are prices checked?" },
      a: {
        tr: "Paketinize göre fiyatlar günde birkaç kez veya dakikada bir kontrol edilir. Başlangıç paketinde günde iki kez, üst paketlerde saatte bir, en üst pakette dakikada bir bakılır.",
        en: "Depending on your plan, prices are checked a few times a day or once a minute: twice daily on the entry plan, hourly on higher plans, every minute on the top plan.",
      },
    },
    {
      q: { tr: "Rakiplerim benim fiyatlarımı görebilir mi?", en: "Can my rivals see my prices?" },
      a: {
        tr: "Hayır. Kurallarınız, maliyetleriniz ve stratejiniz yalnızca size aittir. Biz yalnızca herkese açık ilan fiyatlarını okuruz.",
        en: "No. Your rules, costs and strategy are yours alone. We only read prices that are already public.",
      },
    },
    {
      q: { tr: "Kaç rakip takip edebilirim?", en: "How many rivals can I track?" },
      a: {
        tr: "Başlangıç paketinde ürün başına beş rakip, üst paketlerde sınırsız. Rakip sayısı değil, izlediğiniz ürün sayısı fiyatı belirler.",
        en: "Five rivals per product on the entry plan, unlimited above it. Pricing is driven by how many products you track, not how many rivals.",
      },
    },
  ],
  related: [
    { href: "/trendyol-fiyat-takip-sistemi", label: { tr: "Trendyol fiyat takip sistemi", en: "Trendyol price tracking" } },
    { href: "/shopify-otomatik-fiyatlandirma", label: { tr: "Shopify otomatik fiyatlandırma", en: "Shopify auto-repricing" } },
    { href: "/#pricing", label: { tr: "Fiyatlandırma", en: "Pricing" } },
  ],
};

export default function Page() {
  return <SeoLanding content={content} />;
}

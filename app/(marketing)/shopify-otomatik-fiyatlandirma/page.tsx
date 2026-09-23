import type { Metadata } from "next";
import appConfig from "@/app.config";
import { SeoLanding, type SeoLandingContent } from "@/components/marketing/seo-landing";

export const metadata: Metadata = {
  title: "Shopify Otomatik Fiyatlandırma | PriceNova",
  description:
    "Shopify mağazanızda rakip fiyatlarına göre otomatik fiyatlandırma. Kurallarınızı tanımlayın, taban marjınızı koruyun, her değişikliği tek tıkla geri alın.",
  keywords: [
    "shopify otomatik fiyatlandırma",
    "shopify fiyat güncelleme",
    "shopify repricing",
    "shopify rakip fiyat takibi",
    "otomatik fiyat değiştirme",
  ],
  alternates: { canonical: `https://${appConfig.domain}/shopify-otomatik-fiyatlandirma` },
  openGraph: {
    title: "Shopify Otomatik Fiyatlandırma | PriceNova",
    description: "Kurallarınızı tanımlayın, PriceNova Shopify fiyatlarınızı sizin yerinize güncellesin.",
    url: `https://${appConfig.domain}/shopify-otomatik-fiyatlandirma`,
    type: "website",
  },
};

const content: SeoLandingContent = {
  eyebrow: { tr: "Shopify entegrasyonu", en: "Shopify integration" },
  h1: {
    tr: "Shopify otomatik fiyatlandırma",
    en: "Shopify automatic repricing",
  },
  intro: {
    tr: "Shopify, PriceNova'nın fiyatı gerçekten değiştirebildiği yerdir. Kataloğunuzu çeker, rakip fiyatlarını paketinize göre günde birkaç kez veya dakikada bir kontrol eder ve tanımladığınız kural devreye girdiğinde yeni fiyatı doğrudan mağazanıza yazar — taban ve tavan sınırlarınıza uyarak.",
    en: "Shopify is where PriceNova can actually change a price. It pulls your catalog, checks rival prices a few times a day or once a minute depending on your plan, and when your rule fires it writes the new price straight back to your store — respecting your floor and ceiling.",
  },
  bullets: [
    { tr: "Çift yönlü senkron: katalog çekme + fiyat yazma", en: "Two-way sync: catalog in, prices out" },
    { tr: "\"Önce bana sor\" modu — onaysız fiyat değişmez", en: "\"Ask me first\" mode — nothing moves without you" },
    { tr: "Her değişiklik tek tıkla geri alınabilir", en: "Every change is one click from being undone" },
    { tr: "Maliyet tabanı altına inmeyen kurallar", en: "Rules that never breach your cost floor" },
  ],
  sections: [
    {
      title: { tr: "Kurulum: bir öğleden sonra değil, birkaç dakika", en: "Setup: minutes, not an afternoon" },
      body: {
        tr: "Shopify mağazanızı bağlarsınız ve ürünleriniz SKU, fiyat ve varsa maliyet bilgisiyle birlikte gelir. Maliyetleri Shopify'a girmediyseniz PriceNova içinde de girebilirsiniz — taban kuralları bu veriye dayanır, o yüzden atlanmaması gereken tek adım budur. Ardından rakip eşleştirmelerini onaylarsınız ve takip başlar.",
        en: "You connect your Shopify store and your products arrive with SKU, price and cost where you have it. If you haven't entered costs in Shopify you can enter them in PriceNova — floor rules depend on that figure, so it's the one step not to skip. Then you approve the competitor matches and tracking begins.",
      },
    },
    {
      title: { tr: "Kural nasıl yazılır?", en: "What a rule looks like" },
      body: {
        tr: "Kurallar cümle gibi okunur: \"en düşük rakibin %1 altına in\", \"ikinci en ucuz fiyata eşle\", \"asla maliyet +%10'un altına inme\". Bir kuralı bir kategoriye ya da tüm kataloğa uygulayabilirsiniz. Birden fazla kural çakıştığında taban kuralı her zaman kazanır — yani marjınızı koruyan kural, sizi en ucuz yapan kuraldan önce gelir.",
        en: "Rules read like sentences: \"go 1% under the lowest rival\", \"match the second cheapest\", \"never go below cost +10%\". A rule can apply to one category or the whole catalog. When rules collide the floor always wins — the rule that protects your margin comes before the rule that makes you cheapest.",
      },
    },
    {
      title: { tr: "Otomatik demek kontrolsüz demek değil", en: "Automatic doesn't mean unsupervised" },
      body: {
        tr: "Her kuralı iki moddan birine alabilirsiniz. \"Önce bana sor\" modunda PriceNova fiyatınıza hiç dokunmaz; önerisini, uygulanırsa kalacak kâr marjıyla birlikte onay kuyruğuna bırakır. \"Otomatik uygula\" modunda değişikliği kendisi yapar, ama önceki fiyatı saklar. Bir hata fark ederseniz tek tek ya da hepsini birden geri alırsınız; eski fiyat Shopify'a yeniden yazılır. Üstelik panelin üst barında, her ekranda duran bir durdurma düğmesi vardır — bastığınız anda hiçbir kural fiyata dokunamaz, ama rakip takibi ve uyarılar çalışmaya devam eder.",
        en: "Every rule sits in one of two modes. On \"ask me first\", PriceNova never touches your price — it leaves the proposal in your approval queue with the margin it would leave you. On automatic it makes the change itself, but keeps the price it replaced. Spot a mistake and you restore it, one at a time or all at once, and the old price goes back to Shopify. There's also a stop button in the top bar of every screen: press it and no rule can touch a price, while tracking and alerts keep running.",
      },
    },
    {
      title: { tr: "Fiyat değişikliği Shopify'a nasıl yazılır?", en: "How the change reaches Shopify" },
      body: {
        tr: "Kural tetiklendiğinde yeni fiyat Shopify Admin API üzerinden ilgili varyanta yazılır. Karşılaştırma fiyatını (compare-at) değiştirmeyiz; yalnızca satış fiyatına dokunuruz. Her yazma işlemi zaman damgası, tetikleyen kural ve önceki fiyatla birlikte kaydedilir — bu kayıt hem geri almayı mümkün kılar hem de ay sonunda \"bu fiyat neden değişmiş\" sorusunu cevaplar.",
        en: "When a rule fires, the new price is written to the relevant variant through the Shopify Admin API. We don't touch the compare-at price; only the selling price. Every write is logged with a timestamp, the rule that triggered it and the previous price — that record is what makes undo possible, and what answers \"why did this price change\" at the end of the month.",
      },
    },
  ],
  faq: [
    {
      q: { tr: "Shopify fiyatlarımı gerçekten otomatik değiştirebiliyor mu?", en: "Can it really change my Shopify prices automatically?" },
      a: {
        tr: "Evet. Shopify, fiyat geri yazmanın desteklendiği kanallardan biridir. Kuralı \"otomatik uygula\" moduna alırsanız yeni fiyat doğrudan mağazanıza yazılır. İsterseniz onay moduna alıp her değişikliği tek tek onaylayabilirsiniz.",
        en: "Yes. Shopify is one of the channels where price write-back is supported. Put a rule on automatic and the new price is written straight to your store. Or keep it on approval mode and confirm each change yourself.",
      },
    },
    {
      q: { tr: "Yanlış bir fiyat yazılırsa ne olur?", en: "What if a wrong price gets written?" },
      a: {
        tr: "Her otomatik değişiklikte önceki fiyat saklanır. Onay kuyruğundaki \"Uygulananlar\" sekmesinden tek tıkla geri alırsınız; eski fiyat Shopify'a yeniden yazılır. Toplu geri alma da mümkündür.",
        en: "Every automatic change keeps the price it replaced. From the \"Already applied\" tab in the approval queue, one click restores it and the old price goes back to Shopify. Bulk undo is available too.",
      },
    },
    {
      q: { tr: "İndirim kampanyalarımı bozar mı?", en: "Will it interfere with my sale campaigns?" },
      a: {
        tr: "Kuralları kategori bazında tanımladığınız için kampanya yürüttüğünüz ürünleri kural kapsamı dışında bırakabilir ya da o kuralı geçici olarak duraklatabilirsiniz. Ayrıca taban kuralınız kampanya sırasında da geçerlidir.",
        en: "Because rules are scoped by category you can leave campaign products outside a rule, or pause that rule for the duration. Your floor rule stays in force during a campaign too.",
      },
    },
    {
      q: { tr: "WooCommerce için de çalışıyor mu?", en: "Does it work for WooCommerce too?" },
      a: {
        tr: "Evet, WooCommerce de çift yönlü çalışır: katalog çekme ve fiyat geri yazma desteklenir. Amazon ve Trendyol tarafında ise şu an yalnızca fiyat okuyabiliyoruz.",
        en: "Yes, WooCommerce is also two-way: catalog pull and price write-back are both supported. On Amazon and Trendyol we can currently only read prices.",
      },
    },
  ],
  related: [
    { href: "/rakip-fiyat-takip-programi", label: { tr: "Rakip fiyat takip programı", en: "Competitor price tracking" } },
    { href: "/trendyol-fiyat-takip-sistemi", label: { tr: "Trendyol fiyat takip sistemi", en: "Trendyol price tracking" } },
    { href: "/#control", label: { tr: "Kontrol & güvenlik", en: "Control & safety" } },
  ],
};

export default function Page() {
  return <SeoLanding content={content} />;
}

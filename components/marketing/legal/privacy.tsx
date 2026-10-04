"use client";

import appConfig from "@/app.config";
import { LEGAL_UPDATED, LegalPage, type LegalDoc } from "@/components/marketing/legal-page";
import { hostingL, legalNameL, regionL } from "@/lib/company";

const { privacy } = appConfig.company.emails;

/**
 * Privacy policy. Every claim here maps to something the code does: the
 * Supabase tables in supabase/schema.sql, the two cookies, the integrations in
 * app.config.ts. If you add a provider (analytics, billing, email), add it to
 * the processors table in the same change.
 */
const DOC: LegalDoc = {
  title: { tr: "Gizlilik Politikası", en: "Privacy Policy" },
  intro: {
    tr: `Bu politika ${appConfig.name}'nın hangi verileri topladığını, neden topladığını, nerede sakladığını ve kimlerle paylaştığını anlatır. Kısaca: işimizi yapmak için gereken kadarını toplarız, satmayız, reklam için kullanmayız.`,
    en: `This policy explains what ${appConfig.name} collects, why, where it's kept and who it's shared with. In short: we collect what the job needs, we don't sell it, and we don't use it for advertising.`,
  },
  updated: LEGAL_UPDATED,
  sections: [
    {
      id: "kim",
      title: { tr: "1. Veri sorumlusu", en: "1. Who is responsible" },
      blocks: [
        {
          p: {
            tr: `${appConfig.name} hizmetini ${legalNameL.tr} sunar ve kişisel verileriniz bakımından 6698 sayılı KVKK ve AB Genel Veri Koruma Tüzüğü (GDPR) anlamında veri sorumlusudur. İletişim bilgileri sayfanın sonundadır.`,
            en: `${appConfig.name} is provided by ${legalNameL.en}, which is the data controller for your personal data under Turkey's KVKK (Law No. 6698) and the EU GDPR. Contact details are at the end of this page.`,
          },
        },
      ],
    },
    {
      id: "toplanan",
      title: { tr: "2. Hangi verileri topluyoruz", en: "2. What we collect" },
      blocks: [
        {
          list: [
            {
              tr: "Hesap bilgileri: e-posta adresiniz, adınız ve girerseniz mağaza adınız. Google ya da GitHub ile giriş yaparsanız bu sağlayıcının bize ilettiği ad ve e-posta.",
              en: "Account details: your email address, your name and, if you give one, your store name. If you sign in with Google or GitHub, the name and email that provider passes to us.",
            },
            {
              tr: "Katalog verileriniz: ürün adları, SKU ve barkodlar, satış fiyatlarınız ve girdiyseniz maliyetleriniz.",
              en: "Your catalog: product names, SKUs and barcodes, your selling prices and, where you enter them, your costs.",
            },
            {
              tr: "Kurallarınız ve geçmişiniz: fiyatlandırma kurallarınız, onay kuyruğundaki öneriler, yapılan her fiyat değişikliği ve önceki fiyat.",
              en: "Your rules and history: repricing rules, suggestions in your approval queue, every price change made and the price it replaced.",
            },
            {
              tr: "Rakip fiyat gözlemleri: izlemesini istediğiniz rakip ürün sayfalarından okunan herkese açık fiyat, stok ve kargo bilgisi. Bunlar bir işletmenin ilan bilgisidir, kişisel veri değildir.",
              en: "Competitor observations: public price, stock and shipping read from the rival product pages you ask us to watch. These are a business's listing details, not personal data.",
            },
            {
              tr: "Ayarlarınız: bildirim tercihleri, varsayılan taban marjı, günlük değişim sınırı gibi çalışma alanı ayarları.",
              en: "Your settings: notification preferences, default floor margin, daily change cap and similar workspace settings.",
            },
            {
              tr: "Teknik kayıtlar: oturum açma zamanları, IP adresi ve hata kayıtları gibi, hizmeti güvenli ve çalışır tutmak için gereken asgari bilgiler.",
              en: "Technical logs: sign-in times, IP address and error records: the minimum needed to keep the service secure and working.",
            },
          ],
        },
      ],
    },
    {
      id: "toplanmayan",
      title: { tr: "3. Neyi toplamıyoruz", en: "3. What we don't collect" },
      blocks: [
        {
          list: [
            { tr: "Ödeme kartı bilgilerinizi sunucularımızda saklamayız.", en: "We don't store payment card details on our servers." },
            { tr: "Pazaryeri hesaplarınızın (Trendyol, Hepsiburada, n11, Amazon) şifrelerini istemeyiz.", en: "We don't ask for your marketplace account passwords (Trendyol, Hepsiburada, n11, Amazon)." },
            { tr: "Rakiplerinizin size kapalı verilerine erişmeyiz; giriş gerektiren sayfaları okumayız.", en: "We don't access data your competitors keep private, and we don't read pages that require a login." },
            { tr: "Mağazanızın müşterilerine ait kişisel verileri (alıcı adı, adresi, siparişi) çekmeyiz.", en: "We don't pull personal data about your store's customers (buyer names, addresses, orders)." },
            { tr: "Reklam, analiz ya da takip çerezi kullanmayız.", en: "We use no advertising, analytics or tracking cookies." },
          ],
        },
      ],
    },
    {
      id: "amac",
      title: { tr: "4. Verilerinizi neden işliyoruz", en: "4. Why we process your data" },
      blocks: [
        {
          table: {
            head: [
              { tr: "Amaç", en: "Purpose" },
              { tr: "Hukuki sebep (KVKK m.5 / GDPR m.6)", en: "Legal basis (KVKK art. 5 / GDPR art. 6)" },
            ],
            rows: [
              [
                { tr: "Hesabınızı açmak, giriş yaptırmak, hizmeti sunmak", en: "Creating your account, signing you in, providing the service" },
                { tr: "Sözleşmenin kurulması ve ifası", en: "Performance of a contract" },
              ],
              [
                { tr: "Rakip fiyatlarını göstermek, uyarı göndermek, kurallarınıza göre fiyat önermek ya da güncellemek", en: "Showing rival prices, sending alerts, suggesting or updating prices under your rules" },
                { tr: "Sözleşmenin ifası", en: "Performance of a contract" },
              ],
              [
                { tr: "Güvenlik, kötüye kullanımın önlenmesi, hata ayıklama", en: "Security, abuse prevention, debugging" },
                { tr: "Meşru menfaat", en: "Legitimate interest" },
              ],
              [
                { tr: "Fatura ve ticari kayıtların tutulması", en: "Keeping invoices and commercial records" },
                { tr: "Hukuki yükümlülük", en: "Legal obligation" },
              ],
              [
                { tr: "Hizmetle ilgili zorunlu bildirimler (deneme süresi, güvenlik, politika değişikliği)", en: "Essential service notices (trial, security, policy changes)" },
                { tr: "Sözleşmenin ifası", en: "Performance of a contract" },
              ],
            ],
          },
        },
        {
          p: {
            tr: "Verilerinizi reklam amacıyla kullanmayız, üçüncü taraflara satmayız ve yapay zekâ modeli eğitmek için kullanmayız. Size pazarlama e-postası göndermeyiz; ileride gönderirsek bunu yalnızca ayrıca açık rızanızla yaparız.",
            en: "We don't use your data for advertising, we don't sell it, and we don't use it to train AI models. We don't send you marketing email; if we ever do, it will only be with your separate explicit consent.",
          },
        },
      ],
    },
    {
      id: "paylasim",
      title: { tr: "5. Kimlerle paylaşıyoruz", en: "5. Who we share it with" },
      blocks: [
        {
          p: {
            tr: "Hizmeti çalıştırmak için aşağıdaki hizmet sağlayıcılarla (veri işleyen) çalışırız. Her biri yalnızca kendi işi için gereken veriyi görür.",
            en: "We use the service providers (processors) below to run the service. Each sees only the data its job requires.",
          },
        },
        {
          table: {
            head: [
              { tr: "Sağlayıcı", en: "Provider" },
              { tr: "Ne için", en: "What for" },
              { tr: "Gördüğü veri", en: "Data it sees" },
            ],
            rows: [
              [
                { tr: "Supabase", en: "Supabase" },
                { tr: "Veritabanı, kimlik doğrulama, giriş e-postaları", en: "Database, authentication, sign-in emails" },
                { tr: "Hesap, katalog, kural ve fiyat verilerinin tamamı", en: "All account, catalog, rule and price data" },
              ],
              [
                hostingL,
                { tr: "Web uygulamasının barındırılması", en: "Hosting the web application" },
                { tr: "İstek kayıtları (IP adresi, zaman)", en: "Request logs (IP address, time)" },
              ],
              [
                { tr: "Scrapingdog", en: "Scrapingdog" },
                { tr: "Rakip ürün sayfalarının okunması", en: "Reading competitor product pages" },
                { tr: "Yalnızca rakip sayfa adresleri; sizinle ilgili kişisel veri gönderilmez", en: "Only competitor page URLs; no personal data about you is sent" },
              ],
              [
                { tr: "Slack (bağlarsanız)", en: "Slack (if you connect it)" },
                { tr: "Fiyat uyarılarının kanalınıza gönderilmesi", en: "Posting price alerts to your channel" },
                { tr: "Uyarı içeriği: ürün adı, fiyatlar", en: "Alert content: product name, prices" },
              ],
              [
                { tr: "Shopify / WooCommerce (bağlarsanız)", en: "Shopify / WooCommerce (if you connect it)" },
                { tr: "Kataloğunuzun çekilmesi, yeni fiyatın mağazanıza yazılması", en: "Pulling your catalog, writing new prices to your store" },
                { tr: "Kendi mağazanız; yalnızca ürün ve fiyat alanları", en: "Your own store; product and price fields only" },
              ],
            ],
          },
        },
        {
          p: {
            tr: "Bunların dışında verilerinizi yalnızca yasal olarak zorunlu olduğumuzda (ör. mahkeme kararı) yetkili kamu kurumlarıyla paylaşırız.",
            en: "Beyond these, we share your data only when legally required to (for example a court order), and only with the authority entitled to it.",
          },
        },
      ],
    },
    {
      id: "konum",
      title: { tr: "6. Verileriniz nerede saklanıyor", en: "6. Where your data lives" },
      blocks: [
        {
          p: {
            tr: `Veritabanımız ${regionL.tr} bölgesinde barındırılır. Türkiye dışında bir bölgede barındırılması, KVKK'nın 9. maddesi anlamında yurt dışına aktarım sayılır; bu aktarımı Kanun'da öngörülen uygun güvencelerle (ör. Kurul'un ilan ettiği standart sözleşme) yaparız.`,
            en: `Our database is hosted in ${regionL.en}. Hosting outside Turkey counts as a cross-border transfer under Article 9 of the KVKK; we make that transfer under the safeguards the law provides for (such as the Board's standard contractual clauses).`,
          },
        },
        {
          p: {
            tr: "Her tablo satır bazlı güvenlik (RLS) ile korunur: bir kullanıcı yalnızca kendi satırlarını görebilir ve değiştirebilir. Ayrıntılar Güvenlik sayfasındadır.",
            en: "Every table is protected by row-level security: a user can only read and change their own rows. Details are on the Security page.",
          },
        },
      ],
    },
    {
      id: "cerezler",
      title: { tr: "7. Çerezler ve yerel depolama", en: "7. Cookies and local storage" },
      blocks: [
        {
          table: {
            head: [
              { tr: "Ad", en: "Name" },
              { tr: "Ne işe yarar", en: "Purpose" },
              { tr: "Süre", en: "Lifetime" },
            ],
            rows: [
              [
                { tr: "Supabase oturum çerezleri (sb-…)", en: "Supabase session cookies (sb-…)" },
                { tr: "Giriş yaptığınızda kimliğinizi taşır. Zorunludur.", en: "Carry your identity once you sign in. Strictly necessary." },
                { tr: "Çıkış yapana ya da oturum sona erene kadar", en: "Until you sign out or the session expires" },
              ],
              [
                { tr: "pn_demo", en: "pn_demo" },
                { tr: "Örnek paneli kayıt olmadan gezdiğinizi işaretler. Zorunludur.", en: "Marks that you're exploring the sample panel without an account. Strictly necessary." },
                { tr: "Tarayıcı kapanana kadar", en: "Until the browser closes" },
              ],
              [
                { tr: "Dil tercihi (yerel depolama)", en: "Language choice (local storage)" },
                { tr: "TR/EN seçiminizi hatırlar. Sunucuya gönderilmez.", en: "Remembers your TR/EN choice. Never sent to our servers." },
                { tr: "Siz silene kadar", en: "Until you clear it" },
              ],
            ],
          },
        },
        {
          p: {
            tr: "Bunların hepsi hizmetin çalışması için zorunlu olduğundan çerez onayı istemeyiz. Reklam, analiz ya da takip çerezi eklersek önce onayınızı alırız.",
            en: "All of these are strictly necessary for the service to work, so we don't ask for cookie consent. If we ever add advertising, analytics or tracking cookies, we'll ask first.",
          },
        },
      ],
    },
    {
      id: "sure",
      title: { tr: "8. Ne kadar süre saklıyoruz", en: "8. How long we keep it" },
      blocks: [
        {
          p: {
            tr: "Hesabınız açık kaldığı sürece. Hesabınızı silmemizi istediğinizde katalog, kural ve fiyat geçmişiniz dahil tüm verileriniz silinir. Veri türüne göre süreler Veri Saklama Politikası'nda tablo halinde yer alır.",
            en: "For as long as your account is open. When you ask us to delete your account, all your data goes, including catalog, rules and price history. Periods per data type are tabled in the Data Retention Policy.",
          },
        },
      ],
    },
    {
      id: "haklar",
      title: { tr: "9. Haklarınız", en: "9. Your rights" },
      blocks: [
        {
          list: [
            { tr: "Verilerinizin işlenip işlenmediğini öğrenme ve bir kopyasını isteme", en: "Find out whether we process your data and get a copy" },
            { tr: "Yanlış ya da eksik verinin düzeltilmesini isteme", en: "Have inaccurate or incomplete data corrected" },
            { tr: "Verilerinizin silinmesini isteme", en: "Have your data deleted" },
            { tr: "Verilerinizi taşınabilir bir biçimde (CSV) alma", en: "Receive your data in a portable format (CSV)" },
            { tr: "Meşru menfaate dayanan işlemeye itiraz etme", en: "Object to processing based on legitimate interest" },
            { tr: "Kişisel Verileri Koruma Kurulu'na ya da AB'deyseniz yerel veri koruma otoritenize şikâyette bulunma", en: "Complain to Turkey's Personal Data Protection Board or, in the EU, your local data protection authority" },
          ],
        },
        {
          p: {
            tr: `Taleplerinizi ${privacy} adresine, hesabınızda kayıtlı e-posta adresinden yazın. En geç 30 gün içinde ücretsiz yanıtlarız. Başvuru yolları KVKK Aydınlatma Metni'nde ayrıca anlatılır.`,
            en: `Send requests to ${privacy} from the email address on your account. We reply free of charge within 30 days at the latest. The ways to apply are also set out in the KVKK / GDPR Notice.`,
          },
        },
      ],
    },
    {
      id: "degisiklik",
      title: { tr: "10. Değişiklikler", en: "10. Changes" },
      blocks: [
        {
          p: {
            tr: "Bu politikayı güncellersek sayfanın üstündeki tarihi değiştiririz. Önemli bir değişiklik olursa yürürlüğe girmeden en az 15 gün önce hesabınızdaki e-posta adresine haber veririz.",
            en: "If we update this policy we change the date at the top. For a significant change we email the address on your account at least 15 days before it takes effect.",
          },
        },
      ],
    },
  ],
};

export function PrivacyContent() {
  return <LegalPage doc={DOC} />;
}

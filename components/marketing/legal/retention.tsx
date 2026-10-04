"use client";

import appConfig from "@/app.config";
import { LEGAL_UPDATED, LegalPage, type LegalDoc } from "@/components/marketing/legal-page";
import { backupDaysL } from "@/lib/company";

const { privacy } = appConfig.company.emails;

/**
 * Data retention policy. Matches the code: nothing is pruned automatically,
 * and every user table in supabase/schema.sql cascades from auth.users, so
 * deleting the user deletes everything they own in one step.
 */
const DOC: LegalDoc = {
  title: { tr: "Veri Saklama Politikası", en: "Data Retention Policy" },
  intro: {
    tr: "Hangi veriyi ne kadar tuttuğumuzu ve nasıl sildiğimizi burada bulabilirsiniz. İlkemiz basit: veriyi hizmet için gerektiği sürece tutarız, silmenizi istediğinizde geri dönülmez biçimde sileriz.",
    en: "This page sets out how long we keep each kind of data and how we delete it. The principle is simple: we keep data as long as the service needs it, and when you ask us to delete it, it's gone for good.",
  },
  updated: LEGAL_UPDATED,
  sections: [
    {
      id: "sureler",
      title: { tr: "1. Saklama süreleri", en: "1. Retention periods" },
      blocks: [
        {
          table: {
            head: [
              { tr: "Veri", en: "Data" },
              { tr: "Ne kadar süre", en: "How long" },
              { tr: "Sonra ne olur", en: "Then" },
            ],
            rows: [
              [
                { tr: "Hesap bilgileri (ad, e-posta)", en: "Account details (name, email)" },
                { tr: "Hesap açık kaldığı sürece", en: "While the account is open" },
                { tr: "Silme talebiyle silinir", en: "Deleted on request" },
              ],
              [
                { tr: "Katalog, maliyetler, rakipler, eşleşmeler", en: "Catalog, costs, competitors, matches" },
                { tr: "Hesap açık kaldığı sürece", en: "While the account is open" },
                { tr: "Hesapla birlikte silinir", en: "Deleted with the account" },
              ],
              [
                { tr: "Fiyat geçmişi ve fiyat değişiklik kayıtları", en: "Price history and price change log" },
                { tr: "Hesap açık kaldığı sürece; grafikler ve geri alma bu kayıtlara dayanır", en: "While the account is open; charts and undo depend on it" },
                { tr: "Hesapla birlikte silinir", en: "Deleted with the account" },
              ],
              [
                { tr: "Kurallar ve ayarlar", en: "Rules and settings" },
                { tr: "Hesap açık kaldığı sürece", en: "While the account is open" },
                { tr: "Hesapla birlikte silinir", en: "Deleted with the account" },
              ],
              [
                { tr: "Deneme süresi dolmuş hesaplar", en: "Accounts whose trial has ended" },
                { tr: "Otomatik silinmez; panel kilitli bekler", en: "Not deleted automatically; the panel stays locked" },
                { tr: "İstediğiniz an silme talep edebilirsiniz", en: "You can ask for deletion at any time" },
              ],
              [
                { tr: "Veritabanı yedekleri", en: "Database backups" },
                { tr: `${backupDaysL.tr} gün`, en: `${backupDaysL.en} days` },
                { tr: "Süre dolunca yedekten de kendiliğinden düşer", en: "Rolls off the backups automatically" },
              ],
              [
                { tr: "Güvenlik ve erişim kayıtları", en: "Security and access logs" },
                { tr: "Altyapı sağlayıcılarımızın standart kayıt süresi", en: "Our infrastructure providers' standard log period" },
                { tr: "Kendiliğinden silinir", en: "Deleted automatically" },
              ],
              [
                { tr: "Fatura ve ticari kayıtlar", en: "Invoices and commercial records" },
                { tr: "10 yıl (Türk Ticaret Kanunu m.82, Vergi Usul Kanunu)", en: "10 years (Turkish Commercial Code art. 82, Tax Procedure Law)" },
                { tr: "Yasal süre dolunca silinir", en: "Deleted when the legal period ends" },
              ],
            ],
          },
        },
      ],
    },
    {
      id: "silme",
      title: { tr: "2. Hesabınızı silmek", en: "2. Deleting your account" },
      blocks: [
        {
          p: {
            tr: `Hesabınızın silinmesini istemek için kayıtlı e-posta adresinizden ${privacy} adresine yazın. Kimliğinizi doğruladıktan sonra hesabınızı ve ona bağlı tüm verileri tek işlemle sileriz: ürünler, rakipler, eşleşmeler, fiyat geçmişi, kurallar, değişiklik kayıtları ve ayarlar. Silme işlemi geri alınamaz; önce Raporlar ekranından dışa aktarmanızı öneririz.`,
            en: `To have your account deleted, write to ${privacy} from your registered email address. Once we've verified it's you, we delete the account and everything attached to it in one operation: products, competitors, matches, price history, rules, change log and settings. Deletion can't be undone, so we suggest exporting from the Reports screen first.`,
          },
        },
        {
          p: {
            tr: "Fatura kayıtları gibi kanunen saklamak zorunda olduğumuz veriler, yasal süre boyunca yalnızca bu amaçla ve erişimi kısıtlanarak tutulur.",
            en: "Data we're legally required to keep, such as invoices, is held for the statutory period, only for that purpose and with access restricted.",
          },
        },
      ],
    },
    {
      id: "nasil",
      title: { tr: "3. Nasıl siliyoruz", en: "3. How we delete" },
      blocks: [
        {
          list: [
            { tr: "Canlı veritabanından silme kalıcıdır: hesabınıza bağlı her tablo, hesap silindiğinde otomatik olarak birlikte silinir.", en: "Deletion from the live database is permanent: every table tied to your account is removed automatically along with it." },
            { tr: "Yedeklerdeki kopyalar, yukarıdaki yedek süresi dolduğunda kendiliğinden düşer ve bu süre içinde geri yükleme dışında kullanılmaz.", en: "Copies in backups roll off when the backup period above ends, and aren't used for anything but disaster recovery in the meantime." },
            { tr: "Bağlı mağazanızda (Shopify, WooCommerce) yazdığımız fiyatlar sizin mağazanızın verisidir; silme talebiniz bunları değiştirmez.", en: "Prices we wrote to your connected store (Shopify, WooCommerce) are your store's data; a deletion request doesn't change them." },
          ],
        },
      ],
    },
    {
      id: "anonim",
      title: { tr: "4. Anonim veri", en: "4. Anonymous data" },
      blocks: [
        {
          p: {
            tr: "Verilerinizi silme talebinden sonra anonimleştirerek saklamayız ve istatistik ya da başka bir amaçla kullanmayız.",
            en: "We don't keep an anonymised copy of your data after a deletion request, and we don't reuse it for statistics or anything else.",
          },
        },
      ],
    },
  ],
};

export function RetentionContent() {
  return <LegalPage doc={DOC} />;
}

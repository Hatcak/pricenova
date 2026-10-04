"use client";

import appConfig from "@/app.config";
import { LEGAL_UPDATED, LegalPage, type LegalDoc } from "@/components/marketing/legal-page";
import { addressL, legalNameL, regionL } from "@/lib/company";

const { privacy } = appConfig.company.emails;
const kep = appConfig.company.kep;

/**
 * KVKK Article 10 information notice, with the GDPR rights alongside for EU
 * users. It restates the privacy policy in the structure the law asks for:
 * controller, purposes, recipients, method and legal basis, rights, how to apply.
 */
const DOC: LegalDoc = {
  title: { tr: "KVKK Aydınlatma Metni", en: "KVKK / GDPR Privacy Notice" },
  intro: {
    tr: "6698 sayılı Kişisel Verilerin Korunması Kanunu'nun 10. maddesi uyarınca, kişisel verilerinizin kim tarafından, hangi amaçla ve hangi hukuki sebeple işlendiğini, kimlere aktarıldığını ve haklarınızı nasıl kullanacağınızı bu metinde bulabilirsiniz. AB'deki kullanıcılarımız için GDPR kapsamındaki haklar da aşağıdadır.",
    en: "Under Article 10 of Turkey's Personal Data Protection Law No. 6698 (KVKK), this notice sets out who processes your personal data, for what purpose and on what legal basis, who it's transferred to, and how to exercise your rights. Rights under the GDPR for users in the EU are included below.",
  },
  updated: LEGAL_UPDATED,
  sections: [
    {
      id: "sorumlu",
      title: { tr: "1. Veri sorumlusu", en: "1. Data controller" },
      blocks: [
        {
          p: {
            tr: `Veri sorumlusu ${legalNameL.tr}'dir. Adres: ${addressL.tr}.`,
            en: `The data controller is ${legalNameL.en}. Address: ${addressL.en}.`,
          },
        },
      ],
    },
    {
      id: "kategoriler",
      title: { tr: "2. İşlenen veri kategorileri ve amaçlar", en: "2. Data categories and purposes" },
      blocks: [
        {
          table: {
            head: [
              { tr: "Kategori", en: "Category" },
              { tr: "Veriler", en: "Data" },
              { tr: "Amaç", en: "Purpose" },
              { tr: "Hukuki sebep", en: "Legal basis" },
            ],
            rows: [
              [
                { tr: "Kimlik", en: "Identity" },
                { tr: "Ad soyad", en: "Full name" },
                { tr: "Hesabın oluşturulması", en: "Creating the account" },
                { tr: "KVKK m.5/2-c (sözleşme)", en: "KVKK 5/2-c, GDPR 6(1)(b) (contract)" },
              ],
              [
                { tr: "İletişim", en: "Contact" },
                { tr: "E-posta adresi", en: "Email address" },
                { tr: "Giriş, zorunlu hizmet bildirimleri, fiyat uyarıları", en: "Sign-in, essential service notices, price alerts" },
                { tr: "KVKK m.5/2-c (sözleşme)", en: "KVKK 5/2-c, GDPR 6(1)(b) (contract)" },
              ],
              [
                { tr: "Müşteri işlem", en: "Customer transaction" },
                { tr: "Katalog, maliyet, kurallar, fiyat değişiklik geçmişi, ayarlar", en: "Catalog, costs, rules, price change history, settings" },
                { tr: "Rakip fiyat takibi ve fiyatlandırma hizmetinin sunulması", en: "Providing price tracking and repricing" },
                { tr: "KVKK m.5/2-c (sözleşme)", en: "KVKK 5/2-c, GDPR 6(1)(b) (contract)" },
              ],
              [
                { tr: "İşlem güvenliği", en: "Security" },
                { tr: "IP adresi, oturum ve hata kayıtları", en: "IP address, session and error logs" },
                { tr: "Bilgi güvenliği, kötüye kullanımın önlenmesi", en: "Information security, abuse prevention" },
                { tr: "KVKK m.5/2-ç (hukuki yükümlülük) ve m.5/2-f (meşru menfaat)", en: "KVKK 5/2-ç and 5/2-f, GDPR 6(1)(c) and (f)" },
              ],
              [
                { tr: "Finans", en: "Finance" },
                { tr: "Fatura bilgileri (unvan, vergi no, adres)", en: "Invoice details (company name, tax no, address)" },
                { tr: "Faturalandırma, ticari kayıtların tutulması", en: "Billing, keeping commercial records" },
                { tr: "KVKK m.5/2-ç (hukuki yükümlülük)", en: "KVKK 5/2-ç, GDPR 6(1)(c) (legal obligation)" },
              ],
            ],
          },
        },
      ],
    },
    {
      id: "yontem",
      title: { tr: "3. Toplama yöntemi", en: "3. How it's collected" },
      blocks: [
        {
          p: {
            tr: "Verileriniz elektronik ortamda; kayıt formu, Google ya da GitHub ile giriş, panelde girdiğiniz bilgiler ve bağladığınız Shopify ya da WooCommerce mağazası aracılığıyla otomatik yollarla toplanır.",
            en: "Your data is collected electronically and automatically: through the signup form, Google or GitHub sign-in, what you enter in the panel, and the Shopify or WooCommerce store you connect.",
          },
        },
      ],
    },
    {
      id: "aktarim",
      title: { tr: "4. Aktarım", en: "4. Transfers" },
      blocks: [
        {
          p: {
            tr: `Verileriniz, hizmetin sunulması amacıyla sınırlı olarak altyapı hizmeti aldığımız tedarikçilere (veritabanı ve kimlik doğrulama: Supabase; barındırma) ve yalnızca bağlamayı seçtiğiniz entegrasyonlara (Slack, Shopify, WooCommerce) aktarılır. Veritabanımız ${regionL.tr} bölgesinde bulunduğundan bu aktarım KVKK m.9 kapsamında yurt dışına aktarımdır ve Kanun'da öngörülen uygun güvencelere dayanır. Kanunen yetkili kamu kurum ve kuruluşlarına yalnızca talep halinde ve yasal zorunluluk ölçüsünde aktarım yapılır. Tedarikçilerin tam listesi Gizlilik Politikası'ndadır.`,
            en: `Your data is transferred, only as far as needed to provide the service, to the infrastructure suppliers we use (database and authentication: Supabase; hosting) and to the integrations you choose to connect (Slack, Shopify, WooCommerce). Because our database is in ${regionL.en}, this is a cross-border transfer under KVKK Article 9 and relies on the safeguards the law provides for. Data goes to public authorities only on lawful request and only as far as the law requires. The full supplier list is in the Privacy Policy.`,
          },
        },
      ],
    },
    {
      id: "haklar",
      title: { tr: "5. Haklarınız (KVKK m.11)", en: "5. Your rights (KVKK art. 11, GDPR art. 15-22)" },
      blocks: [
        {
          list: [
            { tr: "Kişisel verilerinizin işlenip işlenmediğini öğrenme", en: "Learn whether your personal data is processed" },
            { tr: "İşlenmişse buna ilişkin bilgi talep etme", en: "Request information about that processing" },
            { tr: "İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme", en: "Learn the purpose and whether data is used accordingly" },
            { tr: "Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme", en: "Know the third parties it's transferred to, at home or abroad" },
            { tr: "Eksik veya yanlış işlenmişse düzeltilmesini isteme", en: "Have incomplete or inaccurate data corrected" },
            { tr: "KVKK m.7'deki şartlar çerçevesinde silinmesini veya yok edilmesini isteme", en: "Have it erased or destroyed under the conditions of KVKK art. 7" },
            { tr: "Düzeltme ve silme işlemlerinin aktarılan üçüncü kişilere bildirilmesini isteme", en: "Have corrections and erasures notified to the third parties it was shared with" },
            { tr: "Münhasıran otomatik sistemlerle analiz edilmesi sonucu aleyhinize bir sonuç çıkmasına itiraz etme", en: "Object to an outcome against you that results solely from automated analysis" },
            { tr: "Kanuna aykırı işleme nedeniyle zarara uğramanız halinde zararın giderilmesini talep etme", en: "Claim compensation for damage caused by unlawful processing" },
          ],
        },
        {
          p: {
            tr: "AB'deki kullanıcılar ayrıca GDPR kapsamında verilerin taşınabilirliği, işlemenin kısıtlanması ve itiraz haklarına sahiptir ve yerel denetim otoritesine şikâyette bulunabilir.",
            en: "Users in the EU additionally have the GDPR rights to data portability, restriction of processing and objection, and may complain to their local supervisory authority.",
          },
        },
      ],
    },
    {
      id: "basvuru",
      title: { tr: "6. Nasıl başvurulur", en: "6. How to apply" },
      blocks: [
        {
          list: [
            {
              tr: `E-posta: hesabınızda kayıtlı e-posta adresinden ${privacy} adresine`,
              en: `Email: to ${privacy}, from the address registered on your account`,
            },
            {
              tr: `Yazılı olarak: ıslak imzalı dilekçeyle ${addressL.tr} adresine`,
              en: `In writing: a signed letter to ${addressL.en}`,
            },
            ...(kep
              ? [{ tr: `KEP: ${kep} adresine güvenli elektronik imzalı olarak`, en: `KEP: to ${kep}, signed with a secure electronic signature` }]
              : []),
          ],
        },
        {
          p: {
            tr: "Başvurunuzda adınızı soyadınızı, iletişim bilginizi ve talebinizi açıkça belirtin. Başvurunuzu niteliğine göre en geç 30 gün içinde ücretsiz sonuçlandırırız. Yanıtımızdan memnun kalmazsanız Kişisel Verileri Koruma Kurulu'na şikâyette bulunabilirsiniz.",
            en: "State your full name, contact details and request clearly. We resolve it free of charge within 30 days at the latest. If you're not satisfied with our answer you can complain to the Personal Data Protection Board.",
          },
        },
      ],
    },
  ],
};

export function KvkkContent() {
  return <LegalPage doc={DOC} />;
}

"use client";

import appConfig from "@/app.config";
import { LEGAL_UPDATED, LegalPage, type LegalDoc } from "@/components/marketing/legal-page";
import { jurisdictionL, legalNameL } from "@/lib/company";
import { TRIAL_DAYS } from "@/lib/trial";

const name = appConfig.name;

/**
 * Terms of service. Written for a business customer (merchants), which is who
 * the product is sold to. The repricing section is the one that matters most:
 * it says plainly who decides a price and what the safety controls are.
 */
const DOC: LegalDoc = {
  title: { tr: "Kullanım Şartları", en: "Terms of Service" },
  intro: {
    tr: `Bu şartlar ${name} hesabı açtığınızda ya da hizmeti kullandığınızda sizinle aramızdaki sözleşmedir. Hukuki dil yerine düz anlatmaya çalıştık; en çok merak edilen kısım 5. maddedir: fiyatınıza kimin karar verdiği.`,
    en: `These terms are the agreement between you and us when you open a ${name} account or use the service. We've tried to write them plainly; the part people ask about most is section 5: who decides your price.`,
  },
  updated: LEGAL_UPDATED,
  sections: [
    {
      id: "taraflar",
      title: { tr: "1. Taraflar ve kapsam", en: "1. Parties and scope" },
      blocks: [
        {
          p: {
            tr: `Hizmeti ${legalNameL.tr} ("${name}", "biz") sunar. "Siz", hesabı açan kişi ve adına hesap açılan işletmedir. ${name} işletmelere yönelik bir hizmettir; hesap açarak bunu ticari ya da mesleki faaliyetiniz kapsamında kullandığınızı kabul edersiniz.`,
            en: `The service is provided by ${legalNameL.en} ("${name}", "we"). "You" means the person who opens the account and the business it's opened for. ${name} is a business service; by opening an account you confirm you're using it for your trade or profession.`,
          },
        },
      ],
    },
    {
      id: "hesap",
      title: { tr: "2. Hesabınız", en: "2. Your account" },
      blocks: [
        {
          list: [
            { tr: "18 yaşından büyük olmalı ve doğru bilgi vermelisiniz.", en: "You must be over 18 and give accurate information." },
            { tr: "Şifrenizin ve hesabınızda yapılanların sorumluluğu sizdedir. Yetkisiz bir erişim fark ederseniz hemen bize yazın.", en: "You're responsible for your password and for what happens in your account. Tell us straight away if you notice unauthorised access." },
            { tr: "Bağladığınız mağaza ve entegrasyonlar için gerekli yetkiye sahip olduğunuzu kabul edersiniz.", en: "You confirm you're authorised to connect the stores and integrations you connect." },
          ],
        },
      ],
    },
    {
      id: "deneme",
      title: { tr: "3. Ücretsiz deneme", en: "3. Free trial" },
      blocks: [
        {
          p: {
            tr: `Yeni her hesap, açıldığı andan itibaren ${TRIAL_DAYS} gün boyunca tüm özellikleri ücretsiz kullanır. Kart bilgisi istemeyiz ve süre bitince otomatik ücret almayız. Süre dolduğunda panel kilitlenir; verileriniz silinmez, bir paket seçtiğinizde kaldığınız yerden devam edersiniz.`,
            en: `Every new account gets every feature free for ${TRIAL_DAYS} days from the moment it's created. We don't ask for a card and we never charge automatically when the trial ends. When it ends the panel locks; your data isn't deleted, and picking a plan lets you carry on where you left off.`,
          },
        },
      ],
    },
    {
      id: "ucret",
      title: { tr: "4. Paketler ve ödeme", en: "4. Plans and payment" },
      blocks: [
        {
          list: [
            { tr: "Paket fiyatları fiyatlandırma bölümünde yazandır. Türk lirası fiyatlara KDV dahil değildir.", en: "Plan prices are as shown in the pricing section. Turkish lira prices exclude VAT." },
            { tr: "Ücretler aylık ve peşin alınır. Paketinizi istediğiniz an yükseltebilir ya da düşürebilirsiniz; değişiklik bir sonraki dönemde geçerli olur.", en: "Fees are billed monthly in advance. You can upgrade or downgrade at any time; the change applies from the next period." },
            { tr: "Aboneliğinizi istediğiniz an iptal edebilirsiniz. İptal, ödediğiniz dönemin sonunda geçerli olur; başlamış dönem için kısmi iade yapılmaz.", en: "You can cancel at any time. Cancellation takes effect at the end of the period you've paid for; we don't give partial refunds for a period that has started." },
            { tr: "Fiyatlarımızı değiştirirsek mevcut müşterilere en az 30 gün önceden e-postayla haber veririz.", en: "If we change our prices we email existing customers at least 30 days in advance." },
          ],
        },
      ],
    },
    {
      id: "fiyatlandirma",
      title: { tr: "5. Otomatik fiyatlandırma: karar sizde", en: "5. Automatic repricing: you decide" },
      blocks: [
        {
          p: {
            tr: `${name} fiyatınızı yalnızca sizin tanımladığınız kurallara göre ve sizin verdiğiniz izinle değiştirir. Bir kuralı "önce bana sor" modunda bırakırsanız hiçbir fiyat onayınız olmadan değişmez. "Otomatik uygula" modunu seçerseniz, o kuralın ürettiği fiyatların mağazanıza yazılmasına önceden onay vermiş olursunuz.`,
            en: `${name} changes your price only under rules you define and with permission you give. Leave a rule on "ask me first" and no price changes without your approval. Choose "apply automatically" and you approve in advance that the prices that rule produces are written to your store.`,
          },
        },
        {
          p: {
            tr: "Size şu güvenlik araçlarını sağlarız ve çalışır tutmayı taahhüt ederiz:",
            en: "We provide, and commit to keeping working, these safety controls:",
          },
        },
        {
          list: [
            { tr: "Taban ve tavan: hiçbir kural belirlediğiniz taban fiyatın altına ya da tavanın üstüne çıkamaz.", en: "Floor and ceiling: no rule can go below your floor or above your ceiling." },
            { tr: "Günlük değişim sınırı: bir günde yapılabilecek otomatik değişiklik sayısını siz belirlersiniz.", en: "Daily change cap: you set how many automatic changes can happen in a day." },
            { tr: "Geri alma: her otomatik değişiklikte önceki fiyat saklanır ve tek tıkla geri yüklenir.", en: "Undo: every automatic change keeps the previous price, restorable in one click." },
            { tr: "Durdurma: panelin her ekranındaki düğmeyle tüm fiyat yazımını anında durdurabilirsiniz.", en: "Stop: a button on every screen halts all price writing instantly." },
          ],
        },
        {
          p: {
            tr: "Kuralların içeriği, taban ve tavan değerleri ve maliyet bilgilerinin doğruluğu sizin sorumluluğunuzdadır. Rakip fiyatları herkese açık sayfalardan paketinizin tarama sıklığında okunur; bu nedenle gecikmeli ya da hatalı olabilir (ör. rakip sayfasının değişmesi). Bir fiyat kararını vermeden önce bu sınırları göz önünde bulundurmanızı öneririz.",
            en: "You're responsible for what your rules say, your floor and ceiling values and the accuracy of your cost data. Rival prices are read from public pages at your plan's scan frequency, so they can be delayed or wrong (for example when a rival changes their page). Bear that in mind before acting on a price.",
          },
        },
      ],
    },
    {
      id: "kullanim",
      title: { tr: "6. Kabul edilebilir kullanım", en: "6. Acceptable use" },
      blocks: [
        {
          p: { tr: "Hizmeti kullanırken şunları yapmamayı kabul edersiniz:", en: "When using the service you agree not to:" },
        },
        {
          list: [
            { tr: "Herkese açık olmayan, giriş gerektiren ya da erişiminiz olmayan sayfaları izletmek.", en: "Have us watch pages that aren't public, require a login, or you have no right to access." },
            { tr: "Hizmeti rakiplerle fiyat anlaşması, fiyat sabitleme ya da 4054 sayılı Rekabetin Korunması Hakkında Kanun'a aykırı başka bir amaç için kullanmak.", en: "Use the service to agree, fix or coordinate prices with competitors, or for anything else that breaches competition law." },
            { tr: "Satış yaptığınız pazaryerlerinin ve platformların kurallarını ihlal edecek şekilde fiyat ayarlamak.", en: "Set prices in a way that breaks the rules of the marketplaces and platforms you sell on." },
            { tr: "Toplanan verileri üçüncü kişilere satmak ya da hizmeti yeniden satmak.", en: "Sell the collected data to third parties or resell the service." },
            { tr: "Hizmete aşırı yük bindirmek, güvenliğini aşmaya çalışmak ya da kaynak kodunu tersine mühendislikle çıkarmak.", en: "Overload the service, try to get around its security, or reverse-engineer it." },
          ],
        },
        {
          p: {
            tr: "Bu kurallardan birinin ihlal edildiğini düşünürsek önce size yazarız; ciddi ya da tekrarlayan ihlallerde hesabı askıya alabiliriz.",
            en: "If we think one of these rules has been broken we write to you first; for serious or repeated breaches we may suspend the account.",
          },
        },
      ],
    },
    {
      id: "veri",
      title: { tr: "7. Verileriniz sizindir", en: "7. Your data is yours" },
      blocks: [
        {
          p: {
            tr: "Kataloğunuz, kurallarınız ve fiyat geçmişiniz size aittir. Bize yalnızca hizmeti sunmak için bu verileri işleme izni verirsiniz. Raporlar ekranından CSV ya da Excel olarak dışa aktarabilir, tüm verilerinizin bir kopyasını da e-postayla isteyebilirsiniz. Kişisel verilerin işlenmesi Gizlilik Politikası ve KVKK Aydınlatma Metni'ne tabidir.",
            en: "Your catalog, rules and price history belong to you. You give us permission to process them only to provide the service. You can export it as CSV or Excel from the Reports screen, and ask us by email for a copy of all of it. Personal data is handled under the Privacy Policy and the KVKK / GDPR Notice.",
          },
        },
      ],
    },
    {
      id: "sureklilik",
      title: { tr: "8. Hizmetin sürekliliği", en: "8. Availability" },
      blocks: [
        {
          p: {
            tr: "Hizmeti kesintisiz sunmak için makul çabayı gösteririz, ancak belirli bir çalışma süresi garantisi vermeyiz. Planlı bakımları mümkün olduğunda önceden duyururuz. Bağlı mağaza ya da pazaryerlerinin kendi kesintilerinden sorumlu değiliz.",
            en: "We make reasonable efforts to keep the service running, but we don't guarantee a specific uptime. We announce planned maintenance in advance where we can. We aren't responsible for outages at connected stores or marketplaces.",
          },
        },
      ],
    },
    {
      id: "sorumluluk",
      title: { tr: "9. Sorumluluğun sınırı", en: "9. Limitation of liability" },
      blocks: [
        {
          p: {
            tr: "Kanunun izin verdiği ölçüde, dolaylı zararlardan, kâr kaybından ve sizin tanımladığınız ya da onayladığınız kurallar sonucunda oluşan fiyatlardan sorumlu değiliz. Herhangi bir talep için toplam sorumluluğumuz, talebe konu olaydan önceki 12 ayda bize ödediğiniz ücretlerle sınırlıdır. Bu sınırlar kastımız ya da ağır ihmalimizden doğan zararlar için uygulanmaz.",
            en: "To the extent the law allows, we aren't liable for indirect loss, loss of profit, or prices produced by rules you defined or approved. Our total liability for any claim is limited to the fees you paid us in the 12 months before the event giving rise to it. These limits don't apply to damage caused by our intent or gross negligence.",
          },
        },
      ],
    },
    {
      id: "fesih",
      title: { tr: "10. Sona erme", en: "10. Termination" },
      blocks: [
        {
          p: {
            tr: "Hesabınızı istediğiniz an kapatabilirsiniz. Kapatmadan önce verilerinizi dışa aktarmanızı öneririz; silme talebinizden sonra veriler Veri Saklama Politikası'ndaki sürelerle kalıcı olarak silinir. Bu şartları ciddi biçimde ihlal etmeniz halinde sözleşmeyi yazılı bildirimle sona erdirebiliriz.",
            en: "You can close your account at any time. We suggest exporting your data first; after a deletion request it's permanently erased on the timelines in the Data Retention Policy. We may end the agreement by written notice if you seriously breach these terms.",
          },
        },
      ],
    },
    {
      id: "degisiklik",
      title: { tr: "11. Şartlarda değişiklik", en: "11. Changes to these terms" },
      blocks: [
        {
          p: {
            tr: "Şartları değiştirirsek yürürlüğe girmeden en az 30 gün önce e-postayla bildiririz. Değişikliği kabul etmezseniz bu süre içinde aboneliğinizi iptal edebilirsiniz.",
            en: "If we change these terms we email you at least 30 days before they take effect. If you don't accept the change you can cancel within that time.",
          },
        },
      ],
    },
    {
      id: "hukuk",
      title: { tr: "12. Uygulanacak hukuk", en: "12. Governing law" },
      blocks: [
        {
          p: {
            tr: `Bu şartlara Türkiye Cumhuriyeti hukuku uygulanır. Uyuşmazlıklarda ${jurisdictionL.tr} mahkemeleri ve icra daireleri yetkilidir.`,
            en: `These terms are governed by the laws of the Republic of Türkiye. The courts and enforcement offices of ${jurisdictionL.en} have jurisdiction over disputes.`,
          },
        },
      ],
    },
  ],
};

export function TermsContent() {
  return <LegalPage doc={DOC} />;
}

"use client";

import appConfig from "@/app.config";
import { LEGAL_UPDATED, LegalPage, type LegalDoc } from "@/components/marketing/legal-page";
import { regionL } from "@/lib/company";

const { security } = appConfig.company.emails;
const name = appConfig.name;

/**
 * Security overview. Two kinds of safety, because a repricing tool can hurt you
 * in two ways: someone getting at your data, and the tool itself setting a bad
 * price. Only claims backed by the code or our providers; no certifications we
 * don't hold.
 */
const DOC: LegalDoc = {
  title: { tr: "Güvenlik", en: "Security" },
  intro: {
    tr: `${name} iki şeyi korumak zorunda: verilerinizi ve fiyatlarınızı. Maliyetleriniz ve kurallarınız işinizin en hassas bilgisidir; fiyatlarınızı değiştirebilen bir araç ise hata yaparsa doğrudan para kaybettirir. Bu sayfa ikisine karşı da ne yaptığımızı anlatır.`,
    en: `${name} has two things to protect: your data and your prices. Your costs and rules are your business's most sensitive information, and a tool that can change your prices costs you money directly if it gets one wrong. This page explains what we do about both.`,
  },
  updated: LEGAL_UPDATED,
  sections: [
    {
      id: "veri",
      title: { tr: "1. Verilerinizin korunması", en: "1. Protecting your data" },
      blocks: [
        {
          list: [
            {
              tr: "Satır bazlı güvenlik (RLS): her tablo, bir kullanıcının yalnızca kendi satırlarını görmesine ve değiştirmesine izin verir. Bu kural uygulama kodunda değil, veritabanının kendisinde uygulanır; uygulamada bir hata olsa bile başka bir hesabın verisi okunamaz.",
              en: "Row-level security: every table lets a user see and change only their own rows. The rule is enforced by the database itself, not the application, so even a bug in the app can't read another account's data.",
            },
            {
              tr: "Şifreler: şifrenizi biz göremeyiz. Supabase Auth tarafından tek yönlü özetlenerek (bcrypt) saklanır.",
              en: "Passwords: we never see yours. Supabase Auth stores it as a one-way hash (bcrypt).",
            },
            {
              tr: "İletimde şifreleme: tarayıcınızla sunucularımız ve sunucularımızla veritabanı arasındaki tüm trafik HTTPS (TLS) üzerinden gider.",
              en: "Encryption in transit: all traffic between your browser and our servers, and between our servers and the database, goes over HTTPS (TLS).",
            },
            {
              tr: `Depolamada şifreleme: veritabanı ve yedekler, ${regionL.tr} bölgesindeki altyapı sağlayıcımız tarafından diskte şifreli tutulur.`,
              en: `Encryption at rest: the database and its backups are kept encrypted on disk by our infrastructure provider in ${regionL.en}.`,
            },
            {
              tr: "Gizli anahtarlar: mağaza erişim anahtarları ve servis anahtarları yalnızca sunucu tarafında tutulur, tarayıcıya hiçbir zaman gönderilmez.",
              en: "Secrets: store access tokens and service keys live only on the server and are never sent to the browser.",
            },
            {
              tr: "Asgari erişim: ekibimiz hesabınızdaki verilere yalnızca destek talebiniz ya da bir güvenlik incelemesi gerektirdiğinde erişir.",
              en: "Least access: our team only looks at data in your account when your support request or a security investigation requires it.",
            },
          ],
        },
      ],
    },
    {
      id: "fiyat",
      title: { tr: "2. Fiyatlarınızın korunması", en: "2. Protecting your prices" },
      blocks: [
        {
          p: {
            tr: "Otomatik fiyatlandırmanın en büyük riski, yanlış bir kuralın ya da hatalı bir rakip verisinin fiyatınızı kontrolsüz değiştirmesidir. Buna karşı katmanlı frenler vardır:",
            en: "The biggest risk in automatic repricing is a wrong rule or bad competitor data moving your price unchecked. There are layered brakes against that:",
          },
        },
        {
          list: [
            { tr: "Taban ve tavan: hiçbir kural belirlediğiniz sınırların dışına çıkamaz. Rakip tabanınızın altına inerse takip etmeyiz, size haber veririz.", en: "Floor and ceiling: no rule can leave the limits you set. If a rival goes under your floor we don't follow; we tell you." },
            { tr: "Önce bana sor: her kural, fiyatı değiştirmek yerine onay kuyruğuna öneri bırakacak şekilde çalışabilir.", en: "Ask me first: any rule can leave a suggestion in the approval queue instead of changing the price." },
            { tr: "Günlük değişim sınırı: bir günde yapılabilecek otomatik değişiklik sayısı sınırlıdır; hatalı bir kural en fazla bu kadar zarar verebilir.", en: "Daily change cap: the number of automatic changes per day is capped, which bounds the damage a bad rule can do." },
            { tr: "Tek tıkla geri alma: her otomatik değişiklikte önceki fiyat saklanır.", en: "One-click undo: every automatic change keeps the price it replaced." },
            { tr: "Her şeyi durdur: panelin her ekranındaki düğme tüm fiyat yazımını anında durdurur; takip ve uyarılar sürer.", en: "Stop everything: a button on every screen halts all price writing at once; tracking and alerts keep running." },
            { tr: "Emin olunmayan eşleşme kullanılmaz: ürün adı benzerliğine dayanan bir eşleşme siz onaylamadan hiçbir fiyat hesabına girmez.", en: "No unconfirmed matches: a match based on title similarity never feeds a price calculation until you approve it." },
          ],
        },
      ],
    },
    {
      id: "toplama",
      title: { tr: "3. Fiyat verisini nasıl topluyoruz", en: "3. How we collect price data" },
      blocks: [
        {
          p: {
            tr: "Yalnızca herkese açık ürün sayfalarını, bir alışverişçinin gördüğü haliyle okuruz. Giriş gerektiren sayfalara erişmeyiz, pazaryeri hesap şifrenizi istemeyiz ve tarama sıklığını paketinizle sınırlı tutarız.",
            en: "We read only public product pages, as a shopper would see them. We don't access pages that need a login, we don't ask for your marketplace passwords, and we keep scan frequency within your plan.",
          },
        },
      ],
    },
    {
      id: "durust",
      title: { tr: "4. Neye sahip değiliz", en: "4. What we don't have yet" },
      blocks: [
        {
          p: {
            tr: "Henüz ISO 27001 ya da SOC 2 gibi bir güvenlik sertifikamız yok. Altyapı sağlayıcımız Supabase'in kendi sertifikaları vardır, ancak bunlar bizim adımıza bir sertifika değildir. Bir sertifika aldığımızda burada yayımlarız.",
            en: "We don't hold a security certification such as ISO 27001 or SOC 2 yet. Our infrastructure provider Supabase holds its own, but those aren't a certification of us. When we get one, we'll publish it here.",
          },
        },
      ],
    },
    {
      id: "olay",
      title: { tr: "5. Güvenlik olayı olursa", en: "5. If there's an incident" },
      blocks: [
        {
          p: {
            tr: "Verilerinizi etkileyen bir ihlal tespit edersek etkilenen kullanıcılara gecikmeden e-postayla haber veririz ve KVKK uyarınca Kişisel Verileri Koruma Kurulu'na en geç 72 saat içinde bildirimde bulunuruz. Bildirimde ne olduğunu, hangi verilerin etkilendiğini ve ne yaptığımızı açıkça yazarız.",
            en: "If we detect a breach affecting your data, we email affected users without delay and notify Turkey's Personal Data Protection Board within 72 hours as the law requires. The notice says plainly what happened, what data was affected and what we've done.",
          },
        },
      ],
    },
    {
      id: "bildir",
      title: { tr: "6. Açık bildirin", en: "6. Report a vulnerability" },
      blocks: [
        {
          p: {
            tr: `Bir güvenlik açığı bulduğunuzu düşünüyorsanız ayrıntılarıyla ${security} adresine yazın. İyi niyetle yapılan bildirimler için yasal yola başvurmayız. Bildiriminizi aldığımızı birkaç iş günü içinde teyit eder, düzeltme sürecinde sizi bilgilendiririz. Lütfen açığı düzeltilmeden kamuya duyurmayın, başka kullanıcıların verisine erişmeyin ve hizmeti aksatacak testler yapmayın.`,
            en: `If you think you've found a vulnerability, write to ${security} with the details. We won't take legal action over reports made in good faith. We confirm receipt within a few working days and keep you informed while we fix it. Please don't publish it before it's fixed, don't access other users' data, and don't run tests that disrupt the service.`,
          },
        },
      ],
    },
  ],
};

export function SecurityContent() {
  return <LegalPage doc={DOC} />;
}

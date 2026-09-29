"use client";

/**
 * Privacy policy.
 *
 * This is a TEMPLATE, and the banner at the top says so on the page itself —
 * it describes what this codebase actually does (reads public prices, stores
 * your catalog in Supabase, keeps two cookies), which is the honest starting
 * point. It is not legal advice and it has not been reviewed by a lawyer.
 * Before going live you must have it checked against KVKK/GDPR and fill in the
 * company details marked below.
 */

import Link from "next/link";
import { AlertTriangle, Mail } from "lucide-react";
import appConfig from "@/app.config";
import { useLang } from "@/components/i18n/language-provider";
import type { L } from "@/lib/i18n/config";

const UPDATED: L = { tr: "Son güncelleme: 23 Eylül 2026", en: "Last updated: 23 September 2026" };

const SECTIONS: { title: L; body: L[] }[] = [
  {
    title: { tr: "1. Hangi verileri topluyoruz", en: "1. What we collect" },
    body: [
      {
        tr: "Hesap bilgileri: e-posta adresiniz, adınız ve belirtirseniz mağaza adınız. Bunları hesabınızı oluşturmak ve size giriş yaptırmak için kullanırız.",
        en: "Account details: your email address, your name and, if you give one, your store name. We use these to create your account and sign you in.",
      },
      {
        tr: "Katalog verileriniz: ürün adlarınız, SKU'larınız, satış fiyatlarınız ve girdiyseniz maliyetleriniz. Maliyet bilgisi yalnızca taban kurallarını hesaplamak için kullanılır ve hiçbir koşulda dışarı verilmez.",
        en: "Your catalog: product names, SKUs, selling prices and, where you enter them, costs. Cost data is used only to compute floor rules and is never shared outside your account.",
      },
      {
        tr: "Rakip fiyat gözlemleri: izlemesini istediğiniz rakip ürün sayfalarından okunan herkese açık fiyat, stok ve kargo bilgisi.",
        en: "Competitor observations: publicly listed price, stock and shipping read from the rival product pages you asked us to watch.",
      },
      {
        tr: "Teknik kayıtlar: oturum açma zamanları ve hata kayıtları gibi, hizmeti güvenli ve çalışır tutmak için gereken asgari bilgiler.",
        en: "Technical logs: sign-in times and error records: the minimum needed to keep the service secure and working.",
      },
    ],
  },
  {
    title: { tr: "2. Neyi toplamıyoruz", en: "2. What we don't collect" },
    body: [
      {
        tr: "Ödeme kartı bilgilerinizi sunucularımızda saklamayız. Rakiplerinizin size kapalı olan verilerine erişmeyiz; yalnızca herkesin görebildiği ilan sayfalarını okuruz. Pazaryeri hesaplarınızın şifrelerini istemeyiz.",
        en: "We do not store your payment card details on our servers. We do not access data your competitors keep private; we only read listing pages anyone can see. We do not ask for your marketplace account passwords.",
      },
    ],
  },
  {
    title: { tr: "3. Verilerinizi neden işliyoruz", en: "3. Why we process your data" },
    body: [
      {
        tr: "Tek bir amaç için: size rakip fiyatlarını göstermek, fiyat değiştiğinde haber vermek ve sizin tanımladığınız kurallara göre fiyat önerisi üretmek ya da izin verdiyseniz fiyatı güncellemek. Verilerinizi reklam amacıyla kullanmayız ve üçüncü taraflara satmayız.",
        en: "For one purpose: to show you rival prices, alert you when they move, and either suggest a new price or, if you allowed it, update your price according to the rules you set. We do not use your data for advertising and we do not sell it.",
      },
    ],
  },
  {
    title: { tr: "4. Verileriniz nerede saklanıyor", en: "4. Where your data lives" },
    body: [
      {
        tr: "Veritabanımız Supabase üzerinde barındırılır. Her tablo satır bazlı güvenlik (RLS) ile korunur: bir kullanıcı yalnızca kendi satırlarını görebilir ve değiştirebilir. Bu kural veritabanının kendi seviyesinde uygulanır, uygulama kodunda değil.",
        en: "Our database is hosted on Supabase. Every table is protected by row-level security: a user can only read and change their own rows. That rule is enforced by the database itself, not by application code.",
      },
      {
        tr: "[BURAYI DOLDURUN: sunucu bölgeniz, ör. Frankfurt / AB.] Verilerin hangi ülkede tutulduğunu belirtmek KVKK ve GDPR açısından zorunludur.",
        en: "[FILL THIS IN: your server region, e.g. Frankfurt / EU.] Stating which country the data sits in is required under GDPR and Turkey's KVKK.",
      },
    ],
  },
  {
    title: { tr: "5. Çerezler", en: "5. Cookies" },
    body: [
      {
        tr: "İki çerez kullanırız. Birincisi oturum çerezidir: giriş yaptığınızda kimliğinizi taşır, olmadan giriş yapılamaz. İkincisi demo çerezidir (pn_demo): örnek paneli gezerken bunu işaretler, tarayıcıyı kapatınca silinir. Reklam ya da takip çerezi kullanmıyoruz.",
        en: "We use two cookies. One is the session cookie: it carries your identity once you sign in, and sign-in is impossible without it. The other marks a demo visit (pn_demo) while you explore the sample panel, and disappears when you close the browser. We use no advertising or tracking cookies.",
      },
      {
        tr: "Ayrıca seçtiğiniz dil (TR/EN) tarayıcınızın yerel depolamasında tutulur. Bu bilgi bize hiç gönderilmez, yalnızca sizin cihazınızda kalır.",
        en: "Your language choice (TR/EN) is also kept in your browser's local storage. That never reaches us; it stays on your device.",
      },
    ],
  },
  {
    title: { tr: "6. Verilerinizi ne kadar süre saklıyoruz", en: "6. How long we keep it" },
    body: [
      {
        tr: "Hesabınız açık kaldığı sürece. Hesabınızı sildiğinizde katalog verileriniz, kurallarınız ve fiyat geçmişiniz silinir. [BURAYI DOLDURUN: yedeklerden silinme süresi, ör. 30 gün.]",
        en: "For as long as your account is open. When you delete your account, your catalog, rules and price history are deleted. [FILL THIS IN: how long until it clears backups, e.g. 30 days.]",
      },
    ],
  },
  {
    title: { tr: "7. Haklarınız", en: "7. Your rights" },
    body: [
      {
        tr: "Verilerinize erişme, düzeltme, silinmesini isteme ve taşınabilir bir kopyasını talep etme hakkınız vardır. Bu taleplerin tamamı için aşağıdaki adrese yazmanız yeterlidir; kimliğinizi doğruladıktan sonra makul süre içinde yanıtlarız.",
        en: "You have the right to access your data, correct it, ask for it to be deleted, and request a portable copy. Write to the address below for any of these; once we've verified who you are we'll respond within a reasonable time.",
      },
    ],
  },
  {
    title: { tr: "8. Değişiklikler", en: "8. Changes" },
    body: [
      {
        tr: "Bu politikayı güncellersek sayfanın üstündeki tarihi değiştiririz. Önemli bir değişiklik olursa hesabınızdaki e-posta adresine haber veririz.",
        en: "If we update this policy we'll change the date at the top. For a significant change we'll email the address on your account.",
      },
    ],
  },
];

export function PrivacyContent() {
  const { t, lang } = useLang();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl sm:leading-[1.1]">
        {lang === "tr" ? "Gizlilik Politikası" : "Privacy Policy"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">{t(UPDATED)}</p>

      {/* The page says what it is. Shipping a template as if a lawyer wrote it
          would be exactly the kind of quiet dishonesty this kit avoids. */}
      <div className="mt-6 flex gap-3 rounded-2xl border border-warning bg-warning/10 p-4">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" aria-hidden />
        <div className="min-w-0 text-sm leading-relaxed">
          <p className="font-semibold text-foreground">
            {lang === "tr" ? "Bu bir şablondur, hukuki görüş değildir." : "This is a template, not legal advice."}
          </p>
          <p className="mt-1 text-muted-foreground">
            {lang === "tr"
              ? "Metin, bu uygulamanın gerçekte ne yaptığını anlatır ve dürüst bir başlangıç noktasıdır. Ancak yayına almadan önce bir avukata KVKK ve GDPR açısından kontrol ettirmeniz, köşeli parantezle işaretli alanları da kendi bilgilerinizle doldurmanız gerekir."
              : "The text describes what this application genuinely does and is an honest starting point. Before going live you must have it reviewed by a lawyer against GDPR and Turkey's KVKK, and fill in the fields marked with square brackets."}
          </p>
        </div>
      </div>

      <div className="mt-10 space-y-9">
        {SECTIONS.map((s) => (
          <section key={t(s.title)}>
            <h2 className="font-display text-xl font-bold tracking-tight">{t(s.title)}</h2>
            <div className="mt-3 space-y-3">
              {s.body.map((p) => (
                <p key={t(p)} className="max-w-prose text-base leading-relaxed text-muted-foreground">
                  {t(p)}
                </p>
              ))}
            </div>
          </section>
        ))}

        <section>
          <h2 className="font-display text-xl font-bold tracking-tight">
            {lang === "tr" ? "9. İletişim" : "9. Contact"}
          </h2>
          <p className="mt-3 max-w-prose text-base leading-relaxed text-muted-foreground">
            {lang === "tr"
              ? "Gizlilikle ilgili her soru ve talep için:"
              : "For any privacy question or request:"}
          </p>
          <a
            href={`mailto:privacy@${appConfig.domain}`}
            className="mt-3 inline-flex items-center gap-2 rounded-lg border border-border bg-card min-h-11 px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            <Mail className="h-4 w-4 text-muted-foreground" aria-hidden />
            privacy@{appConfig.domain}
          </a>
          <p className="mt-4 text-sm text-muted-foreground">
            {lang === "tr"
              ? "[BURAYI DOLDURUN: şirket unvanınız, adresiniz ve varsa veri sorumlusu temsilcinizin bilgileri.]"
              : "[FILL THIS IN: your registered company name, address and data-controller contact.]"}
          </p>
        </section>
      </div>

      <div className="mt-12 border-t border-border pt-6">
        <Link href="/" className="inline-flex min-h-11 items-center text-sm font-medium text-primary hover:underline">
          ← {lang === "tr" ? "Ana sayfaya dön" : "Back to the homepage"}
        </Link>
      </div>
    </div>
  );
}

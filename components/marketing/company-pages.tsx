"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Eye, FlaskConical, Handshake, KeyRound, Mail, MessageSquareText, ShieldCheck } from "lucide-react";
import appConfig from "@/app.config";
import { CompanyCard, LEGAL_LINKS } from "@/components/marketing/legal-page";
import { useLang } from "@/components/i18n/language-provider";
import type { L } from "@/lib/i18n/config";

/* ─────────────────────────────────────────────────────────────────────────────
   About, blog, careers and contact. Same house rules as the homepage: no
   invented founders, team sizes, customers, job openings or blog posts. Each
   page says what is true today and points somewhere real.
   ───────────────────────────────────────────────────────────────────────────── */

const name = appConfig.name;
const emails = appConfig.company.emails;

function PageHead({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
  return (
    <header className="max-w-3xl">
      <p className="label-mono text-primary">{eyebrow}</p>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl sm:leading-[1.1]">{title}</h1>
      <p className="mt-5 text-lg leading-relaxed text-muted-foreground text-pretty">{intro}</p>
    </header>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">{children}</div>;
}

/* ── About ───────────────────────────────────────────────────────────────────── */

const PRINCIPLES: { icon: typeof Eye; title: L; body: L }[] = [
  {
    icon: Eye,
    title: { tr: "Yalnızca herkese açık veri", en: "Public data only" },
    body: {
      tr: "Rakip fiyatlarını bir alışverişçinin gördüğü sayfalardan okuruz. Giriş gerektiren sayfalara girmeyiz, kimseden gizli veri almayız.",
      en: "We read rival prices from the pages any shopper sees. We don't go behind logins and we don't buy anyone's private data.",
    },
  },
  {
    icon: Handshake,
    title: { tr: "Son söz sende", en: "You have the last word" },
    body: {
      tr: "Fiyatın senin işin. Her kural onay modunda çalışabilir, taban ve tavanın dışına çıkamaz ve tek tıkla geri alınır.",
      en: "Your price is your business. Every rule can wait for approval, can't leave your floor and ceiling, and can be undone in one click.",
    },
  },
  {
    icon: KeyRound,
    title: { tr: "Verin senin", en: "Your data is yours" },
    body: {
      tr: "Maliyetlerini ve kurallarını yalnızca sen görürsün. Satmayız, reklam için kullanmayız, silmeni istediğinde sileriz.",
      en: "Only you see your costs and rules. We don't sell them, don't use them for ads, and delete them when you ask.",
    },
  },
  {
    icon: MessageSquareText,
    title: { tr: "Dürüst pazarlama", en: "Honest marketing" },
    body: {
      tr: "Uydurma müşteri yorumu, şişirilmiş rakam ya da henüz yapılmamış bir özellik vaadi yok. Sayfalarımızda yazan her şey üründe var.",
      en: "No invented reviews, inflated numbers or promises of features that aren't built. Everything on our pages is in the product.",
    },
  },
];

export function AboutContent() {
  const { t, lang } = useLang();
  const tr = lang === "tr";

  return (
    <Shell>
      <PageHead
        eyebrow={tr ? "Hakkımızda" : "About"}
        title={tr ? "Fiyat kararlarını tahminden kurtarıyoruz." : "Taking the guesswork out of pricing."}
        intro={
          tr
            ? `${name}, Türkiye'deki e-ticaret satıcıları için rakip fiyat takibi ve otomatik fiyatlandırma aracıdır. Trendyol, Hepsiburada, n11, Amazon, Shopify ve WooCommerce'te aynı ürünü satan rakiplerinin fiyatını izler, geride kaldığında haber verir ve istersen senin belirlediğin sınırlar içinde fiyatını günceller.`
            : `${name} is a competitor price tracking and repricing tool for e-commerce sellers in Turkey. It watches the rivals selling your products on Trendyol, Hepsiburada, n11, Amazon, Shopify and WooCommerce, tells you when you fall behind and, if you want, updates your price within the limits you set.`
        }
      />

      <section className="mt-14 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">{tr ? "Neden var?" : "Why it exists"}</h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>
              {tr
                ? "Pazaryerinde aynı ürünü onlarca satıcı satıyor ve fiyat gün içinde defalarca değişiyor. Çoğu satıcı bunu tarayıcı sekmeleri ve tablolarla takip etmeye çalışıyor: rakip indirim yaptığında ya geç fark ediyor ya da hiç fark etmiyor."
                : "On a marketplace dozens of sellers list the same product and prices change many times a day. Most sellers try to keep up with browser tabs and spreadsheets, and notice a rival's cut late or not at all."}
            </p>
            <p>
              {tr
                ? `${name} bu işi otomatikleştirir. Ama otomatik fiyatlandırma, kontrolü bir makineye bırakmak demek olmamalı. Bu yüzden ürünü güvenlik frenleri etrafında kurduk: taban fiyat, onay kuyruğu, günlük değişim sınırı, geri alma ve her ekranda bir durdurma düğmesi.`
                : `${name} automates that. But automatic repricing shouldn't mean handing control to a machine, so we built the product around brakes: a floor price, an approval queue, a daily change cap, undo, and a stop button on every screen.`}
            </p>
          </div>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2">
          {PRINCIPLES.map((p) => (
            <li key={p.title.en} className="rounded-2xl border border-border bg-card p-5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <p.icon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-3 font-semibold tracking-tight">{t(p.title)}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t(p.body)}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <CompanyCard />
        <div className="rounded-2xl border border-border bg-muted p-6">
          <h2 className="font-semibold tracking-tight">{tr ? "Güveni belgelerle anlatıyoruz" : "Trust, in writing"}</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            {tr
              ? "Verilerini nasıl işlediğimizi, ne kadar sakladığımızı ve fiyatlarını nasıl koruduğumuzu açıkça yazdık."
              : "We've written down plainly how we handle your data, how long we keep it and how we protect your prices."}
          </p>
          <ul className="mt-4 grid gap-1">
            {LEGAL_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex min-h-11 items-center gap-2 text-sm font-medium hover:text-primary">
                  <ShieldCheck className="h-4 w-4 text-primary" aria-hidden />
                  {t(l.label)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Shell>
  );
}

/* ── Blog ────────────────────────────────────────────────────────────────────── */

/** The guides that already exist on the site. Add a real post here when one is written. */
const GUIDES: { href: string; title: L; body: L }[] = [
  {
    href: "/rakip-fiyat-takip-programi",
    title: { tr: "Rakip fiyat takip programı nasıl çalışır?", en: "How competitor price tracking works" },
    body: { tr: "Rakip fiyatlarını otomatik izlemek, ucuz olmaktan çıkınca haber almak ve kurallarla yeniden fiyatlandırmak.", en: "Tracking rival prices automatically, hearing when you stop being cheapest, and repricing with rules." },
  },
  {
    href: "/trendyol-fiyat-takip-sistemi",
    title: { tr: "Trendyol'da rakip satıcı fiyatlarını takip etmek", en: "Tracking rival sellers on Trendyol" },
    body: { tr: "Aynı ilanı satan satıcıları izlemek, kutuyu kaybettiğinde uyarı almak ve marjını korumak.", en: "Watching sellers on the same listing, getting alerted when you lose the box, and protecting your margin." },
  },
  {
    href: "/hepsiburada-fiyat-takip",
    title: { tr: "Hepsiburada fiyat takibi rehberi", en: "A guide to Hepsiburada price tracking" },
    body: { tr: "Hepsiburada'da en ucuz konumunu kaybettiğinde haberin olsun.", en: "Know when you lose the cheapest spot on Hepsiburada." },
  },
  {
    href: "/n11-fiyat-takip",
    title: { tr: "n11'de rakip mağaza fiyatlarını izlemek", en: "Watching rival stores on n11" },
    body: { tr: "n11'deki rakip mağazaların fiyat hareketlerini takip etmek.", en: "Following price moves by rival stores on n11." },
  },
  {
    href: "/shopify-otomatik-fiyatlandirma",
    title: { tr: "Shopify'da otomatik fiyatlandırma", en: "Automatic repricing on Shopify" },
    body: { tr: "Kural tanımlamak, taban marjını korumak ve her değişikliği tek tıkla geri almak.", en: "Defining rules, protecting your floor margin and undoing any change in one click." },
  },
];

export function BlogContent() {
  const { t, lang } = useLang();
  const tr = lang === "tr";

  return (
    <Shell>
      <PageHead
        eyebrow="Blog"
        title={tr ? "Rehberler ve yazılar" : "Guides and articles"}
        intro={
          tr
            ? "Rakip fiyat takibi ve fiyatlandırma üzerine pratik rehberler. Pazaryerine göre ayrılmış yazılarla başla; yenileri eklendikçe burada listelenir."
            : "Practical guides on competitor price tracking and repricing. Start with the marketplace-specific ones; new articles appear here as they're published."
        }
      />

      <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {GUIDES.map((g) => (
          <li key={g.href}>
            <Link href={g.href} className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary">
                <BookOpen className="h-3.5 w-3.5" aria-hidden />
                {tr ? "Rehber" : "Guide"}
              </span>
              <h2 className="mt-3 text-lg font-semibold tracking-tight">{t(g.title)}</h2>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">{t(g.body)}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                {tr ? "Oku" : "Read"}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-10 text-sm text-muted-foreground">
        {tr ? "Okumak istediğin bir konu mu var? " : "Is there a topic you'd like us to cover? "}
        <a href={`mailto:${emails.hello}`} className="font-medium text-primary hover:underline">
          {emails.hello}
        </a>
      </p>
    </Shell>
  );
}

/* ── Careers ─────────────────────────────────────────────────────────────────── */

export function CareersContent() {
  const { lang } = useLang();
  const tr = lang === "tr";

  return (
    <Shell>
      <PageHead
        eyebrow={tr ? "Kariyer" : "Careers"}
        title={tr ? `${name}'da çalışmak` : `Working at ${name}`}
        intro={
          tr
            ? "Satıcıların fiyat kararlarını veriyle vermesini sağlayan bir ürün geliştiriyoruz ve ürünü kullanan satıcılara yakın çalışıyoruz."
            : "We build a product that lets sellers make pricing decisions on data, and we work close to the sellers who use it."
        }
      />

      <section aria-labelledby="openings-title" className="mt-12 max-w-3xl rounded-2xl border border-border bg-card p-6">
        <h2 id="openings-title" className="text-lg font-semibold tracking-tight">{tr ? "Açık pozisyonlar" : "Open positions"}</h2>
        <p className="mt-2 text-base leading-relaxed text-muted-foreground">
          {tr
            ? "Şu anda açık bir pozisyonumuz yok. Pozisyon açtığımızda burada, görevi ve beklentileri açıkça yazarak ilan ederiz."
            : "We don't have any open positions right now. When we do, we'll list them here with the role and expectations spelled out."}
        </p>
      </section>

      <section aria-labelledby="open-app-title" className="mt-5 max-w-3xl rounded-2xl border border-border bg-muted p-6">
        <h2 id="open-app-title" className="text-lg font-semibold tracking-tight">{tr ? "Açık başvuru" : "Open application"}</h2>
        <p className="mt-2 text-base leading-relaxed text-muted-foreground">
          {tr
            ? "E-ticaret, fiyatlandırma ya da veri toplama tarafında bize katkı verebileceğini düşünüyorsan kısaca kendini ve neler yaptığını anlatan bir e-posta gönder. Her başvuruyu okuruz; uygun bir pozisyon açıldığında haber veririz."
            : "If you think you could help us on the e-commerce, pricing or data collection side, send a short email about yourself and what you've built. We read every application and get in touch when a fitting role opens."}
        </p>
        <a
          href={`mailto:${emails.careers}`}
          className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Mail className="h-4 w-4" aria-hidden />
          {emails.careers}
        </a>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          {tr
            ? "Başvurunla gönderdiğin bilgileri yalnızca işe alım değerlendirmesi için kullanırız ve talep etmen halinde sileriz. Ayrıntılar: "
            : "We use what you send only to assess your application, and delete it if you ask. Details: "}
          <Link href="/gizlilik" className="font-medium text-primary hover:underline">
            {tr ? "Gizlilik Politikası" : "Privacy Policy"}
          </Link>
        </p>
      </section>
    </Shell>
  );
}

/* ── Contact ─────────────────────────────────────────────────────────────────── */

export function ContactContent() {
  const { t, lang } = useLang();
  const tr = lang === "tr";

  const channels: { icon: typeof Mail; title: L; body: L; address: string }[] = [
    {
      icon: MessageSquareText,
      title: { tr: "Satış ve genel sorular", en: "Sales and general questions" },
      body: { tr: "Paketler, kurulum ya da ürünün senin mağazana uyup uymadığı.", en: "Plans, setup, or whether the product fits your store." },
      address: emails.hello,
    },
    {
      icon: KeyRound,
      title: { tr: "Gizlilik ve KVKK başvuruları", en: "Privacy and data requests" },
      body: { tr: "Verine erişim, düzeltme, silme ya da dışa aktarma talepleri.", en: "Access, correction, deletion or export of your data." },
      address: emails.privacy,
    },
    {
      icon: ShieldCheck,
      title: { tr: "Güvenlik bildirimi", en: "Security reports" },
      body: { tr: "Bir güvenlik açığı bulduğunu düşünüyorsan.", en: "If you think you've found a vulnerability." },
      address: emails.security,
    },
  ];

  return (
    <Shell>
      <PageHead
        eyebrow={tr ? "İletişim" : "Contact"}
        title={tr ? "Bize ulaş" : "Get in touch"}
        intro={
          tr
            ? "Her e-postayı bir insan okur ve yanıtlar. Konuna uygun adrese yazarsan daha hızlı yardımcı olabiliriz."
            : "Every email is read and answered by a person. Writing to the right address helps us help you faster."
        }
      />

      <ul className="mt-12 grid gap-5 md:grid-cols-3">
        {channels.map((c) => (
          <li key={c.address} className="flex flex-col rounded-2xl border border-border bg-card p-6">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <c.icon className="h-5 w-5" aria-hidden />
            </span>
            <h2 className="mt-4 font-semibold tracking-tight">{t(c.title)}</h2>
            <p className="mt-1 flex-1 text-sm leading-relaxed text-muted-foreground">{t(c.body)}</p>
            <a href={`mailto:${c.address}`} className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary hover:underline wrap-anywhere">
              <Mail className="h-4 w-4 shrink-0" aria-hidden />
              {c.address}
            </a>
          </li>
        ))}
      </ul>

      <section className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <CompanyCard />
        <div className="flex flex-col rounded-2xl border border-border bg-muted p-6">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
            <FlaskConical className="h-5 w-5" aria-hidden />
          </span>
          <h2 className="mt-4 font-semibold tracking-tight">{tr ? "Önce kendin görmek ister misin?" : "Want to see it first?"}</h2>
          <p className="mt-1 flex-1 text-sm leading-relaxed text-muted-foreground">
            {tr
              ? "Demo paneli örnek bir mağazanın verileriyle doludur. Kayıt ya da kart gerekmez."
              : "The demo panel is filled with a sample store's data. No signup, no card."}
          </p>
          <Link href="/demo" className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary hover:underline">
            {t(appConfig.marketing.heroCtaSecondary)}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>
    </Shell>
  );
}

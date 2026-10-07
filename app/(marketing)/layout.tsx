"use client";

import Link from "next/link";
import { AtSign, FlaskConical, Menu, X } from "lucide-react";
import appConfig from "@/app.config";
import { Logo, LogoMark } from "@/components/ui/logo";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useLang } from "@/components/i18n/language-provider";
import { LEGAL_LINKS } from "@/components/marketing/legal-page";
import { companyName } from "@/lib/company";

/** Close the mobile <details> menu once a link inside it is used. */
function closeMenu(e: React.MouseEvent<HTMLElement>) {
  e.currentTarget.closest("details")?.removeAttribute("open");
}

export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { ui, t, lang } = useLang();

  // "Fiyatlar" is the header's main button, so it isn't repeated in this list.
  const sections = [
    { label: ui.features, href: "/#features" },
    { label: lang === "tr" ? "Entegrasyonlar" : "Integrations", href: "/#integrations" },
    { label: ui.faq, href: "/#faq" },
    { label: lang === "tr" ? "İletişim" : "Contact", href: "/iletisim" },
  ];

  return (
    // `.mk` switches on the marketing palette and OS-driven dark mode (globals.css).
    <div className="mk flex min-h-dvh flex-col bg-background text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-card focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:shadow-pop"
      >
        {lang === "tr" ? "İçeriğe geç" : "Skip to content"}
      </a>

      {/* Floating glass pill (ui-ux-pro-max: glassmorphism navigation). */}
      <header className="sticky top-0 z-30 px-3 pt-3 sm:px-4">
        <div className="nav-glass mx-auto flex h-16 max-w-6xl items-center gap-2 rounded-2xl border border-border pl-3 pr-2 shadow-soft sm:pl-4">
          <Link href="/" aria-label={`${appConfig.name}, ${lang === "tr" ? "ana sayfa" : "home"}`} className="inline-flex h-11 items-center rounded-lg">
            <Logo />
          </Link>

          <nav aria-label={lang === "tr" ? "Ana menü" : "Main"} className="ml-6 hidden items-center gap-0.5 xl:flex">
            {sections.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="inline-flex h-11 items-center rounded-xl px-3.5 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
              >
                {s.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1.5">
            <LanguageToggle large className="hidden md:inline-flex" />
            <Link
              href="/login"
              className="hidden h-11 items-center rounded-xl px-3 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground md:inline-flex"
            >
              {ui.signIn}
            </Link>
            {/* The demo door stays its own button, separate from the plans. */}
            <Link
              href="/demo"
              className="hidden h-11 items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-semibold transition-colors duration-200 hover:bg-muted sm:inline-flex"
            >
              <FlaskConical className="h-4 w-4 text-primary" aria-hidden />
              {ui.openDemo}
            </Link>
            <Link
              href="/#pricing"
              className="inline-flex h-11 items-center rounded-xl bg-cta px-4 text-sm font-semibold text-cta-foreground transition-[filter] duration-200 hover:brightness-95"
            >
              {ui.pricing}
            </Link>

            {/* Phones and tablets: everything the desktop header shows, in one menu. */}
            <details className="group relative xl:hidden">
              <summary
                className="grid h-11 w-11 cursor-pointer list-none place-items-center rounded-xl border border-border bg-card [&::-webkit-details-marker]:hidden"
                aria-label={lang === "tr" ? "Menü" : "Menu"}
              >
                <Menu className="h-5 w-5 group-open:hidden" aria-hidden />
                <X className="hidden h-5 w-5 group-open:block" aria-hidden />
              </summary>
              <div className="absolute right-0 top-full mt-2 w-[min(18rem,calc(100vw-2rem))] rounded-xl border border-border bg-card p-2 shadow-pop">
                <nav aria-label={lang === "tr" ? "Mobil menü" : "Mobile"}>
                  <ul>
                    {sections.map((s) => (
                      <li key={s.href}>
                        <Link
                          href={s.href}
                          onClick={closeMenu}
                          className="flex h-11 items-center rounded-lg px-3 text-sm font-medium hover:bg-muted"
                        >
                          {s.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="mt-2 grid gap-1 border-t border-border pt-2">
                  <Link href="/demo" onClick={closeMenu} className="flex h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold hover:bg-muted sm:hidden">
                    <FlaskConical className="h-4 w-4 text-primary" aria-hidden />
                    {ui.openDemo}
                  </Link>
                  <Link href="/login" onClick={closeMenu} className="flex h-11 items-center rounded-lg px-3 text-sm font-medium hover:bg-muted md:hidden">
                    {ui.signIn}
                  </Link>
                  <div className="flex items-center justify-between px-3 py-1 md:hidden">
                    <span className="text-sm text-muted-foreground">{lang === "tr" ? "Dil" : "Language"}</span>
                    <LanguageToggle large />
                  </div>
                </div>
              </div>
            </details>
          </div>
        </div>
      </header>

      <main id="main" className="flex-1">
        {children}
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="max-w-xs">
              <Logo />
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {lang === "tr"
                  ? "E-ticaret için rakip fiyat takibi ve otomatik fiyatlandırma. Her rakip fiyatı, geçmişi ve konumun tek panelde."
                  : "Competitor price tracking and auto-repricing for e-commerce. Every rival price, its history and your position in one panel."}
              </p>
            </div>
            {/* Every link below goes somewhere real. Nothing decorative. */}
            <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-4">
              <FooterCol
                title={lang === "tr" ? "Ürün" : "Product"}
                links={[
                  { label: ui.features, href: "/#features" },
                  { label: ui.pricing, href: "/#pricing" },
                  { label: lang === "tr" ? "Entegrasyonlar" : "Integrations", href: "/#integrations" },
                  { label: lang === "tr" ? "Geliştiriciler" : "Developers", href: "/gelistiriciler" },
                  { label: ui.faq, href: "/#faq" },
                  { label: ui.openDemo, href: "/demo" },
                ]}
              />
              <FooterCol
                title={lang === "tr" ? "Çözümler" : "Solutions"}
                links={[
                  { label: lang === "tr" ? "Rakip fiyat takip programı" : "Competitor price tracking", href: "/rakip-fiyat-takip-programi" },
                  { label: lang === "tr" ? "Trendyol fiyat takip sistemi" : "Trendyol price tracking", href: "/trendyol-fiyat-takip-sistemi" },
                  { label: lang === "tr" ? "Hepsiburada fiyat takip" : "Hepsiburada price tracking", href: "/hepsiburada-fiyat-takip" },
                  { label: lang === "tr" ? "n11 fiyat takip" : "n11 price tracking", href: "/n11-fiyat-takip" },
                  { label: lang === "tr" ? "Shopify otomatik fiyatlandırma" : "Shopify auto-repricing", href: "/shopify-otomatik-fiyatlandirma" },
                ]}
              />
              <FooterCol
                title={lang === "tr" ? "Şirket" : "Company"}
                links={[
                  { label: lang === "tr" ? "Hakkımızda" : "About", href: "/hakkimizda" },
                  { label: "Blog", href: "/blog" },
                  { label: lang === "tr" ? "Kariyer" : "Careers", href: "/kariyer" },
                  { label: lang === "tr" ? "İletişim" : "Contact", href: "/iletisim" },
                ]}
              />
              <FooterCol
                title={lang === "tr" ? "Yasal" : "Legal"}
                links={LEGAL_LINKS.map((l) => ({ label: t(l.label), href: l.href }))}
              />
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center gap-4 border-t border-border pt-6 sm:flex-row">
            <p className="text-center text-xs text-muted-foreground sm:text-left">
              © {new Date().getFullYear()} {companyName}
              {appConfig.company.mersisNo && <> · MERSİS {appConfig.company.mersisNo}</>}
              {appConfig.company.address && <> · {appConfig.company.address}</>}
            </p>
            <div className="flex items-center gap-2 sm:ml-auto">
              <a
                href={`mailto:${appConfig.company.emails.hello}`}
                aria-label={lang === "tr" ? "Bize e-posta gönder" : "Email us"}
                className="grid h-11 w-11 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <AtSign className="h-4 w-4" aria-hidden />
              </a>
              <Link
                href="/"
                aria-label={lang === "tr" ? "Ana sayfa" : "Home"}
                className="grid h-11 w-11 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <LogoMark className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h2 className="label-mono text-muted-foreground">{title}</h2>
      <ul className="mt-2">
        {links.map((l) => (
          <li key={l.href}>
            {l.href.startsWith("mailto:") ? (
              <a href={l.href} className="inline-flex min-h-11 min-w-11 items-center text-muted-foreground transition-colors hover:text-foreground">
                {l.label}
              </a>
            ) : (
              <Link href={l.href} className="inline-flex min-h-11 min-w-11 items-center text-muted-foreground transition-colors hover:text-foreground">
                {l.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

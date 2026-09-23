"use client";

import Link from "next/link";
import { AtSign, FlaskConical } from "lucide-react";
import appConfig from "@/app.config";
import { Logo, LogoMark } from "@/components/ui/logo";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useLang } from "@/components/i18n/language-provider";

export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { ui, lang } = useLang();
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/75 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-5">
          <Link href="/">
            <Logo />
          </Link>
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 text-sm font-medium text-muted-foreground lg:flex">
            <Link href="/#features" className="transition-colors hover:text-foreground">{ui.features}</Link>
            <Link href="/#how" className="transition-colors hover:text-foreground">{ui.howItWorks}</Link>
            <Link href="/#matching" className="transition-colors hover:text-foreground">{ui.matching}</Link>
            <Link href="/#pricing" className="transition-colors hover:text-foreground">{ui.pricing}</Link>
            <Link href="/#faq" className="transition-colors hover:text-foreground">{ui.faq}</Link>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <LanguageToggle className="mr-1" />
            <Link href="/login" className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline">
              {ui.signIn}
            </Link>
            {/* Demo and signup are separate doors — never collapse them into one. */}
            <Link
              href="/demo"
              className="hidden h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 text-[13px] font-semibold text-foreground shadow-pill transition-colors hover:bg-muted sm:inline-flex"
            >
              <FlaskConical className="h-3.5 w-3.5 text-primary" />
              {lang === "tr" ? "Demo" : "Demo"}
            </Link>
            <Link
              href="/signup"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-[13px] font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
            >
              {ui.tryFree}
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-1">{children}</div>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="max-w-xs">
              <Logo />
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {lang === "tr"
                  ? "E-ticaret için rakip fiyat izleme ve otomatik yeniden fiyatlandırma. Her rakip fiyatı, geçmişi ve konumun tek panelde."
                  : "Competitor price monitoring and auto-repricing for e-commerce. Every rival price, history and position in one panel."}
              </p>
            </div>
            {/* Every link below goes somewhere real. Nothing decorative. */}
            <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-4">
              <FooterCol
                title={lang === "tr" ? "Ürün" : "Product"}
                links={[
                  { label: ui.features, href: "/#features" },
                  { label: ui.howItWorks, href: "/#how" },
                  { label: ui.matching, href: "/#matching" },
                  { label: lang === "tr" ? "Kontrol & güvenlik" : "Control & safety", href: "/#control" },
                  { label: ui.pricing, href: "/#pricing" },
                ]}
              />
              <FooterCol
                title={lang === "tr" ? "Başla" : "Get going"}
                links={[
                  { label: ui.tryFree, href: "/signup" },
                  { label: ui.openDemo, href: "/demo" },
                  { label: ui.signIn, href: "/login" },
                ]}
              />
              <FooterCol
                title={lang === "tr" ? "Çözümler" : "Solutions"}
                links={[
                  { label: lang === "tr" ? "Rakip fiyat takip programı" : "Competitor price tracking", href: "/rakip-fiyat-takip-programi" },
                  { label: lang === "tr" ? "Trendyol fiyat takip sistemi" : "Trendyol price tracking", href: "/trendyol-fiyat-takip-sistemi" },
                  { label: lang === "tr" ? "Shopify otomatik fiyatlandırma" : "Shopify auto-repricing", href: "/shopify-otomatik-fiyatlandirma" },
                ]}
              />
              <FooterCol
                title={lang === "tr" ? "Yardım" : "Help"}
                links={[
                  { label: ui.faq, href: "/#faq" },
                  { label: lang === "tr" ? "Gizlilik" : "Privacy", href: "/gizlilik" },
                  { label: lang === "tr" ? "Bize yazın" : "Email us", href: `mailto:hello@${appConfig.domain}` },
                ]}
              />
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center gap-4 border-t border-border pt-6 sm:flex-row">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} {appConfig.name} · {appConfig.domain}
            </p>
            <div className="flex items-center gap-2 sm:ml-auto">
              <a
                href={`mailto:hello@${appConfig.domain}`}
                aria-label={lang === "tr" ? "Bize e-posta gönder" : "Email us"}
                className="grid h-8 w-8 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <AtSign className="h-4 w-4" />
              </a>
              <Link
                href="/"
                aria-label={appConfig.name}
                className="grid h-8 w-8 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <LogoMark className="h-4 w-4" />
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
      <p className="label-mono text-muted-foreground">{title}</p>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            {l.href.startsWith("mailto:") ? (
              <a href={l.href} className="text-muted-foreground transition-colors hover:text-foreground">
                {l.label}
              </a>
            ) : (
              <Link href={l.href} className="text-muted-foreground transition-colors hover:text-foreground">
                {l.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";

/**
 * Shared layout for the keyword landing pages.
 *
 * Each page passes its own content — the copy is deliberately different per
 * page, because three near-identical pages targeting three keywords is thin
 * content and gets treated as such. What's shared is the shape: a hero with
 * both doors, the substance, a FAQ that also ships as FAQPage structured data,
 * and links across to the sibling pages.
 */

import Link from "next/link";
import { ArrowRight, Check, FlaskConical } from "lucide-react";
import { useLang } from "@/components/i18n/language-provider";
import type { L } from "@/lib/i18n/config";

export interface SeoLandingContent {
  eyebrow: L;
  h1: L;
  intro: L;
  bullets: L[];
  sections: { title: L; body: L }[];
  faq: { q: L; a: L }[];
  related: { href: string; label: L }[];
}

export function SeoLanding({ content }: { content: SeoLandingContent }) {
  const { t, lang } = useLang();

  /**
   * FAQPage structured data, built from the same questions shown on the page.
   * Google's guidelines require the markup to match visible content — so this
   * is generated from `content.faq` rather than written separately.
   */
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.map((f) => ({
      "@type": "Question",
      name: t(f.q),
      acceptedAnswer: { "@type": "Answer", text: t(f.a) },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 -z-10" style={{ background: "var(--grad-hero)" }} aria-hidden />
        <div className="mx-auto max-w-4xl px-5 py-16 sm:py-20">
          <p className="label-mono text-primary">{t(content.eyebrow)}</p>
          <h1 className="mt-3 font-display text-[34px] font-bold leading-[1.08] tracking-[-0.02em] sm:text-[46px]">
            {t(content.h1)}
          </h1>
          <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-muted-foreground">{t(content.intro)}</p>

          <ul className="mt-7 grid gap-2.5 sm:grid-cols-2">
            {content.bullets.map((b) => (
              <li key={t(b)} className="flex items-start gap-2.5 text-[15px]">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-success/12 text-success">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                {t(b)}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-[15px] font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
            >
              {lang === "tr" ? "Ücretsiz dene" : "Try it free"} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/demo"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 text-[15px] font-semibold text-foreground shadow-pill transition-colors hover:bg-muted"
            >
              <FlaskConical className="h-4 w-4 text-primary" />
              {lang === "tr" ? "Demo panelini aç" : "Open the demo panel"}
            </Link>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {lang === "tr" ? "Kayıt gerekmez · Kart istemiyoruz" : "No signup · No card"}
          </p>
        </div>
      </section>

      {/* Substance */}
      <section className="mx-auto max-w-4xl px-5 py-16">
        <div className="space-y-10">
          {content.sections.map((s) => (
            <article key={t(s.title)}>
              <h2 className="font-display text-2xl font-bold tracking-tight">{t(s.title)}</h2>
              <p className="mt-3 text-[15.5px] leading-relaxed text-muted-foreground">{t(s.body)}</p>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-3xl px-5 py-16">
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            {lang === "tr" ? "Sıkça sorulanlar" : "Frequently asked"}
          </h2>
          <div className="mt-8 space-y-4">
            {content.faq.map((f) => (
              <details key={t(f.q)} className="group rounded-2xl border border-border bg-card p-5 shadow-soft">
                <summary className="cursor-pointer list-none font-semibold tracking-tight marker:hidden">
                  <span className="flex items-center justify-between gap-3">
                    {t(f.q)}
                    <span className="shrink-0 text-muted-foreground transition-transform group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-[14.5px] leading-relaxed text-muted-foreground">{t(f.a)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Related pages + closing CTA */}
      <section className="mx-auto max-w-4xl px-5 py-16">
        <h2 className="font-display text-xl font-bold tracking-tight">
          {lang === "tr" ? "İlgili sayfalar" : "Related pages"}
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {content.related.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className="group rounded-2xl border border-border bg-card p-4 shadow-soft transition-shadow hover:shadow-pop"
            >
              <span className="flex items-center justify-between gap-2 text-[14px] font-semibold tracking-tight">
                {t(r.label)}
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-card p-6 text-center shadow-soft">
          <p className="font-display text-xl font-bold tracking-tight">
            {lang === "tr" ? "Rakiplerini bugün izlemeye başla" : "Start watching your rivals today"}
          </p>
          <p className="mx-auto mt-2 max-w-md text-[14.5px] text-muted-foreground">
            {lang === "tr"
              ? "Örnek panelde her şeyi kayıt olmadan gezebilirsin."
              : "Explore the whole thing in the sample panel, without signing up."}
          </p>
          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-[14px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              {lang === "tr" ? "Ücretsiz dene" : "Try it free"} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/demo"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border px-5 text-[14px] font-semibold text-foreground transition-colors hover:bg-muted"
            >
              {lang === "tr" ? "Demo panelini aç" : "Open the demo panel"}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

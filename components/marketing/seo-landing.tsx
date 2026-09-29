"use client";

/**
 * Shared layout for the keyword landing pages.
 *
 * Each page passes its own content. The copy is deliberately different per
 * page, because near-identical pages targeting different keywords are thin
 * content and get treated as such. What's shared is the shape: a hero with
 * both doors, the substance, a FAQ that also ships as FAQPage structured data,
 * and links across to the sibling pages.
 */

import Link from "next/link";
import { ArrowRight, Check, FlaskConical, Minus, Plus } from "lucide-react";
import { useLang } from "@/components/i18n/language-provider";
import type { L } from "@/lib/i18n/config";
import { TRIAL_DAYS } from "@/lib/trial";

export interface SeoLandingContent {
  eyebrow: L;
  h1: L;
  intro: L;
  bullets: L[];
  sections: { title: L; body: L }[];
  faq: { q: L; a: L }[];
  related: { href: string; label: L }[];
}

function Doors({ tr }: { tr: boolean }) {
  return (
    <div className="grid gap-3 sm:max-w-lg sm:grid-cols-2">
      <Link href="/signup" className="flex min-h-14 flex-col items-center justify-center rounded-xl bg-primary px-5 py-3 text-center transition-opacity hover:opacity-90">
        <span className="inline-flex items-center gap-2 text-base font-semibold text-primary-foreground">
          {tr ? "Ücretsiz dene" : "Try it free"} <ArrowRight className="h-4 w-4" aria-hidden />
        </span>
        <span className="mt-0.5 text-xs text-primary-foreground">
          {tr ? `${TRIAL_DAYS} gün ücretsiz · kart istemiyoruz` : `Free for ${TRIAL_DAYS} days · no card`}
        </span>
      </Link>
      <Link href="/demo" className="flex min-h-14 flex-col items-center justify-center rounded-xl border border-border bg-card px-5 py-3 text-center transition-colors hover:bg-muted">
        <span className="inline-flex items-center gap-2 text-base font-semibold">
          <FlaskConical className="h-4 w-4 text-primary" aria-hidden />
          {tr ? "Demo panelini aç" : "Open the demo panel"}
        </span>
        <span className="mt-0.5 text-xs text-muted-foreground">{tr ? "Örnek mağaza · kayıt gerekmez" : "Sample store · no signup"}</span>
      </Link>
    </div>
  );
}

export function SeoLanding({ content }: { content: SeoLandingContent }) {
  const { t, lang } = useLang();
  const tr = lang === "tr";

  /**
   * FAQPage structured data, built from the same questions shown on the page.
   * Google's guidelines require the markup to match visible content, so this
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 -z-10" style={{ background: "var(--grad-hero)" }} aria-hidden />
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="label-mono text-primary">{t(content.eyebrow)}</p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl sm:leading-[1.1]">{t(content.h1)}</h1>
          <p className="mt-5 max-w-prose text-lg leading-relaxed text-muted-foreground text-pretty">{t(content.intro)}</p>

          <ul className="mt-7 grid gap-2.5 sm:grid-cols-2">
            {content.bullets.map((b) => (
              <li key={b.en} className="flex items-start gap-2.5 text-base">
                <Check className="mt-1 h-4 w-4 shrink-0 text-success" strokeWidth={3} aria-hidden />
                {t(b)}
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Doors tr={tr} />
          </div>
        </div>
      </section>

      {/* Substance */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="space-y-10">
          {content.sections.map((s) => (
            <article key={s.title.en}>
              <h2 className="font-display text-2xl font-bold tracking-tight text-balance">{t(s.title)}</h2>
              <p className="mt-3 max-w-prose text-base leading-relaxed text-muted-foreground">{t(s.body)}</p>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border bg-muted">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-3xl font-bold tracking-tight">{tr ? "Sıkça sorulanlar" : "Frequently asked"}</h2>
          <div className="mt-8 space-y-3">
            {content.faq.map((f) => (
              <details key={f.q.en} className="group rounded-xl border border-border bg-card">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-3 font-medium [&::-webkit-details-marker]:hidden">
                  {t(f.q)}
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-border text-muted-foreground group-open:border-primary group-open:bg-primary group-open:text-primary-foreground" aria-hidden>
                    <Plus className="h-4 w-4 group-open:hidden" />
                    <Minus className="hidden h-4 w-4 group-open:block" />
                  </span>
                </summary>
                <p className="max-w-prose px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{t(f.a)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Related pages + closing CTA */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-2xl font-bold tracking-tight">{tr ? "İlgili sayfalar" : "Related pages"}</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-3">
          {content.related.map((r) => (
            <li key={r.href}>
              <Link
                href={r.href}
                className="group flex min-h-14 items-center justify-between gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold transition-colors hover:bg-muted"
              >
                {t(r.label)}
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-10 rounded-2xl border border-border bg-card p-6 text-center sm:p-8">
          <p className="font-display text-2xl font-bold tracking-tight">{tr ? "Rakiplerini bugün izlemeye başla" : "Start watching your rivals today"}</p>
          <p className="mx-auto mt-2 max-w-md text-base text-muted-foreground">
            {tr ? "Örnek panelde her şeyi kayıt olmadan gezebilirsin." : "Explore the whole thing in the sample panel, without signing up."}
          </p>
          <div className="mx-auto mt-6 max-w-lg">
            <Doors tr={tr} />
          </div>
        </div>
      </section>
    </>
  );
}

"use client";

import { BadgeCheck, Star } from "lucide-react";
import type { Review } from "@/app.config";
import { useLang } from "@/components/i18n/language-provider";
import { cn } from "@/lib/utils";

/** ["A", "Y"] → "A*** Y***", the way marketplaces show a reviewer. */
function maskedName(initials: string[]) {
  return initials.map((i) => `${i.toLocaleUpperCase("tr-TR")}***`).join(" ");
}

function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-hidden>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={cn("h-4 w-4", n <= Math.round(rating) ? "fill-star text-star" : "text-border")} />
      ))}
    </span>
  );
}

/**
 * Marketplace-style reviews from real users. Renders nothing while the list is
 * empty, and the summary (average, count) is computed from the list itself, so
 * it can never claim more than the reviews on the page.
 */
export function Reviews({ reviews }: { reviews: Review[] }) {
  const { t, lang } = useLang();
  const tr = lang === "tr";
  if (reviews.length === 0) return null;

  const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const averageText = average.toLocaleString(tr ? "tr-TR" : "en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const dateFmt = new Intl.DateTimeFormat(tr ? "tr-TR" : "en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <section aria-labelledby="reviews-title" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 id="reviews-title" className="font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          {tr ? "Kullanıcılar ne diyor?" : "What users say"}
        </h2>
        <p className="mt-4 inline-flex flex-wrap items-center justify-center gap-2 text-base text-muted-foreground">
          <Stars rating={average} />
          <span>
            <span className="tnum font-semibold text-foreground">{averageText}</span>
            {" · "}
            {tr ? `${reviews.length} değerlendirme` : `${reviews.length} ${reviews.length === 1 ? "review" : "reviews"}`}
          </span>
          <span className="sr-only">
            {tr ? `5 üzerinden ortalama ${averageText} puan` : `Average ${averageText} out of 5`}
          </span>
        </p>
      </div>

      {/* Flex, not grid, so one or two reviews sit centred instead of hugging the left. */}
      <ul className="mt-12 flex flex-wrap justify-center gap-5">
        {reviews.map((r) => (
          <li key={`${r.initials.join("")}-${r.date}`} className="w-full sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]">
            <figure className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between gap-3">
                <Stars rating={r.rating} />
                <span className="sr-only">{tr ? `5 üzerinden ${r.rating} yıldız` : `${r.rating} out of 5 stars`}</span>
                <time dateTime={r.date} className="text-xs text-muted-foreground">
                  {dateFmt.format(new Date(`${r.date}T12:00:00`))}
                </time>
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed">{t(r.text)}</blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary" aria-hidden>
                  {r.initials.join("").toLocaleUpperCase("tr-TR")}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold">{maskedName(r.initials)}</span>
                  <span className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                    {r.context && <span>{t(r.context)}</span>}
                    {r.verified && (
                      <span className="inline-flex items-center gap-1 font-medium text-success">
                        <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
                        {tr ? "Doğrulanmış kullanıcı" : "Verified user"}
                      </span>
                    )}
                  </span>
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { ArrowRight, Pause, Play } from "lucide-react";
import { useLang } from "@/components/i18n/language-provider";
import { cn } from "@/lib/utils";
import type { L } from "@/lib/i18n/config";
import dashboard from "@/public/tour/dashboard.webp";
import matches from "@/public/tour/matches.webp";
import rules from "@/public/tour/rules.webp";
import approvals from "@/public/tour/approvals.webp";
import reports from "@/public/tour/reports.webp";

/**
 * Auto-advancing tour of the real demo panel. The images are screenshots of
 * /demo (sample store data), captured at 1280×800. Retake them whenever the
 * panel's look changes so the homepage never shows a screen that isn't there.
 */
const STEPS: { image: StaticImageData; title: L; body: L; alt: L }[] = [
  {
    image: dashboard,
    title: { tr: "Fiyat paneli", en: "Price dashboard" },
    body: { tr: "Her ürünün için senin fiyatın, her rakibin fiyatı ve aradaki fark tek tabloda. Bir satıra tıklayınca fiyat geçmişi açılır.", en: "Your price, every rival's price and the gap, per product, in one table. Click a row for its price history." },
    alt: { tr: "PriceNova fiyat paneli: ürünler, rakip fiyatları ve bir ürünün fiyat geçmişi grafiği", en: "PriceNova price dashboard: products, rival prices and one product's price-history chart" },
  },
  {
    image: matches,
    title: { tr: "Eşleşmeler", en: "Matches" },
    body: { tr: "Rakip ürünün doğru olup olmadığını burada görürsün. Emin olmadığımız eşleşmeler, güven oranıyla birlikte onayını bekler.", en: "See whether each rival product is the right one. Matches we're unsure of wait for you, with a confidence score." },
    alt: { tr: "Eşleşmeler ekranı: dört eşleştirme yöntemi ve onay bekleyen bir eşleşme", en: "Matches screen: the four matching methods and a match awaiting review" },
  },
  {
    image: rules,
    title: { tr: "Fiyatlandırma kuralları", en: "Repricing rules" },
    body: { tr: "\"En düşüğü %1 geç\" gibi kuralları kurar, her biri için \"önce bana sor\" ya da \"otomatik uygula\" seçersin. Hepsini durdurma düğmesi hep üstte.", en: "Set rules like \"beat lowest by 1%\" and choose \"ask me first\" or \"apply automatically\" for each. The stop-all button stays on top." },
    alt: { tr: "Kurallar ekranı: otomatik fiyatlandırma durumu, durdurma düğmesi ve aktif kurallar", en: "Rules screen: automatic repricing status, stop button and active rules" },
  },
  {
    image: approvals,
    title: { tr: "Onay kuyruğu", en: "Approval queue" },
    body: { tr: "Önerilen her fiyat, eski ve yeni marjla birlikte burada bekler. Onaylamadıkça hiçbir fiyat değişmez.", en: "Every suggested price waits here with its old and new margin. Nothing changes until you approve it." },
    alt: { tr: "Onay kuyruğu: eski fiyat, önerilen fiyat ve marj değişimiyle bekleyen öneriler", en: "Approval queue: pending suggestions with old price, new price and margin change" },
  },
  {
    image: reports,
    title: { tr: "Raporlar", en: "Reports" },
    body: { tr: "En ucuz olduğun ürün oranı, fiyat endeksin ve kategori bazında nerede kazanıp nerede kaybettiğin.", en: "The share of products where you're cheapest, your price index, and where you win or lose by category." },
    alt: { tr: "Raporlar ekranı: en ucuz olunan ürün oranı ve fiyat endeksi grafikleri", en: "Reports screen: cheapest-share and price-index charts" },
  },
];

const STEP_MS = 6000;

export function ProductTour() {
  const { t, lang } = useLang();
  const tr = lang === "tr";
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);

  const running = playing && !hovered;

  useEffect(() => {
    // Visitors who asked for less motion get a still tour they step through by hand.
    if (!running || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setTimeout(() => setStep((s) => (s + 1) % STEPS.length), STEP_MS);
    return () => clearTimeout(id);
  }, [running, step]);

  return (
    <section id="tour" aria-labelledby="tour-title" className="scroll-mt-20 border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="label-mono text-primary">{tr ? "Ekran turu" : "Screen tour"}</p>
          <h2 id="tour-title" className="mt-2 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            {tr ? "Paneli yakından gör" : "See the panel up close"}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground text-pretty">
            {tr
              ? "Demo panelinden gerçek ekranlar, örnek mağaza verisiyle. Kendin gezmek istersen demo paneli kayıt istemez."
              : "Real screens from the demo panel, with sample store data. Want to click around yourself? The demo needs no signup."}
          </p>
        </div>

        <div
          className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)] lg:items-start"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocus={() => setHovered(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHovered(false);
          }}
        >
          {/* Screen */}
          <div className="lg:order-2">
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-pop">
              <div className="flex items-center gap-1.5 border-b border-border px-4 py-3" aria-hidden>
                <span className="h-2.5 w-2.5 rounded-full bg-border" />
                <span className="h-2.5 w-2.5 rounded-full bg-border" />
                <span className="h-2.5 w-2.5 rounded-full bg-border" />
                <span className="ml-3 truncate text-xs text-muted-foreground">pricenova.io/demo</span>
              </div>
              <div className="relative aspect-[1280/800]">
                {STEPS.map((s, i) => (
                  <Image
                    key={s.title.en}
                    src={s.image}
                    alt={i === step ? t(s.alt) : ""}
                    aria-hidden={i !== step}
                    fill
                    sizes="(min-width: 1152px) 700px, (min-width: 1024px) 60vw, 100vw"
                    className={cn("object-cover object-top transition-opacity duration-200", i === step ? "opacity-100" : "opacity-0")}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="lg:order-1">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground" aria-live="polite">
                <span className="tnum">{step + 1} / {STEPS.length}</span>
                <span className="sr-only">: {t(STEPS[step].title)}</span>
              </p>
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-medium transition-colors hover:bg-muted"
              >
                {playing ? <Pause className="h-4 w-4" aria-hidden /> : <Play className="h-4 w-4" aria-hidden />}
                {playing ? (tr ? "Duraklat" : "Pause") : tr ? "Oynat" : "Play"}
              </button>
            </div>

            <ol className="mt-4 space-y-2">
              {STEPS.map((s, i) => {
                const active = i === step;
                return (
                  <li key={s.title.en}>
                    <button
                      type="button"
                      onClick={() => {
                        setStep(i);
                        setPlaying(false);
                      }}
                      aria-current={active ? "step" : undefined}
                      className={cn(
                        "relative w-full overflow-hidden rounded-xl border px-4 py-3 text-left transition-colors",
                        active ? "border-primary bg-card" : "border-transparent hover:bg-muted",
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={cn(
                            "tnum grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold",
                            active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                          )}
                        >
                          {i + 1}
                        </span>
                        <span className="font-semibold">{t(s.title)}</span>
                      </span>
                      {active && <span className="mt-2 block pl-10 text-sm leading-relaxed text-muted-foreground">{t(s.body)}</span>}
                      {/* Timer bar: how long until the next screen. */}
                      {active && running && (
                        <span
                          key={step}
                          className="tour-progress absolute inset-x-0 bottom-0 h-0.5 origin-left bg-primary"
                          style={{ animationDuration: `${STEP_MS}ms` }}
                          aria-hidden
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ol>

            <Link
              href="/demo"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              {tr ? "Demo panelini kendin gez" : "Explore the demo yourself"} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

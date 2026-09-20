"use client";

import { useEffect, useState } from "react";
import { Check, Trophy, ArrowDown, AlertTriangle, Wand2, RotateCcw } from "lucide-react";
import { useLang } from "@/components/i18n/language-provider";
import { cn, formatPrice } from "@/lib/utils";
import { flowDemo } from "@/lib/demo/data";

const ICONS = [Trophy, ArrowDown, AlertTriangle, Wand2, RotateCcw];

/**
 * Interactive landing demo: a rival drops their price → your position flips to
 * "not cheapest" → a repricing rule fires → you recover the position. Auto-
 * advances through the 5 stages; clicking a stage jumps to it. Pure useState.
 */
export function FlowDemo() {
  const { t, lang } = useLang();
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setStep((s) => (s + 1) % flowDemo.steps.length), 1900);
    return () => clearInterval(id);
  }, [playing]);

  // The price story: you 79.00 → rival 77.90 → you 77.12 (recovered)
  const yourPrice = step >= 3 ? 77.12 : 79.0;
  const isCheapest = step === 0 || step >= 4;
  const rank = isCheapest ? 1 : 2;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-pop sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
            <Trophy className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold leading-tight">{flowDemo.product}</p>
            <p className="tnum text-xs text-muted-foreground">SKU AUD-EB-220 · 5 {lang === "tr" ? "satıcı" : "sellers"}</p>
          </div>
        </div>
        <button
          onClick={() => setPlaying((p) => !p)}
          className="rounded-md border border-border px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {playing ? (lang === "tr" ? "Duraklat" : "Pause") : (lang === "tr" ? "Oynat" : "Play")}
        </button>
      </div>

      {/* Big price + live position */}
      <div className="relative mt-5 overflow-hidden rounded-xl border border-border bg-muted/40 p-5 text-center">
        <div className="flex items-center justify-center gap-3">
          <p className="tnum text-3xl font-bold tracking-tight text-foreground">{formatPrice(yourPrice)}</p>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors",
              isCheapest ? "bg-success/12 text-success" : "bg-destructive/10 text-destructive",
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", isCheapest ? "bg-success" : "bg-destructive")} />
            {isCheapest ? (lang === "tr" ? "En ucuz" : "Cheapest") : (lang === "tr" ? "En ucuz değil" : "Not cheapest")}
          </span>
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground">
          {t(flowDemo.steps[step].label)} · {flowDemo.steps[step].sub} · {lang === "tr" ? "sıra" : "rank"} {rank}/5
        </p>
        {/* progress bar */}
        <div className="pointer-events-none absolute inset-x-0 bottom-3 h-1.5">
          <div className="relative mx-6 h-full overflow-hidden rounded-full bg-border">
            <span
              className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all duration-500"
              style={{ width: `${((step + 1) / flowDemo.steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="mt-5 space-y-2">
        {flowDemo.steps.map((s, i) => {
          const I = ICONS[i];
          const done = i < step;
          const current = i === step;
          return (
            <button
              key={s.sub}
              onClick={() => {
                setStep(i);
                setPlaying(false);
              }}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors",
                current ? "border-primary/40 bg-primary/[0.05]" : "border-border bg-card hover:bg-muted/50",
              )}
            >
              <span
                className={cn(
                  "grid h-8 w-8 shrink-0 place-items-center rounded-full transition-colors",
                  done ? "bg-success text-success-foreground" : current ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                {done ? <Check className="h-4 w-4" strokeWidth={3} /> : <I className="h-4 w-4" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold leading-tight">{t(s.label)}</p>
                <p className="tnum truncate text-[11px] text-muted-foreground">{s.sub}</p>
              </div>
              {current && <span className="h-1.5 w-1.5 rounded-full bg-primary pulse-dot" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

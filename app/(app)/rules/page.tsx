"use client";

import { useState } from "react";
import { Plus, Play, Pause, Wand2 } from "lucide-react";
import { useLang } from "@/components/i18n/language-provider";
import { cn, formatRelative } from "@/lib/utils";
import { repriceRules } from "@/lib/demo/data";

export default function RulesPage() {
  const { t, lang } = useLang();
  // Local toggle state so the page feels interactive (demo only).
  const [paused, setPaused] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(repriceRules.map((r) => [r.id, r.status === "paused"])),
  );

  const activeCount = repriceRules.filter((r) => !paused[r.id]).length;

  return (
    <div className="mx-auto max-w-[900px] animate-fade-in space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">{lang === "tr" ? "Yeniden fiyatlandırma kuralları" : "Repricing rules"}</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {lang === "tr" ? "Fiyatını otomatik ayarlayan mantık — taban ve tavan sınırlarıyla." : "The logic that adjusts your price automatically — with floor and ceiling."}
          </p>
        </div>
        <button className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-[13px] font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90">
          <Plus className="h-4 w-4" />
          {lang === "tr" ? "Kural ekle" : "Add rule"}
        </button>
      </div>

      {/* summary */}
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
          <Wand2 className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-semibold">{activeCount} {lang === "tr" ? "aktif kural" : "active rules"}</p>
          <p className="text-xs text-muted-foreground">
            {lang === "tr" ? "Bugün 14 ürün otomatik yeniden fiyatlandırıldı" : "14 products auto-repriced today"}
          </p>
        </div>
      </div>

      {/* rules list */}
      <div className="space-y-3">
        {repriceRules.map((rule) => {
          const isPaused = paused[rule.id];
          return (
            <div key={rule.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft">
              <span className={cn(
                "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
                !isPaused ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
              )}>
                {!isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{t(rule.name)}</p>
                <p className="tnum text-[12px] text-muted-foreground">
                  {rule.formula} · {t(rule.scope)} · {rule.appliesTo} {lang === "tr" ? "ürün" : "products"}
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {rule.lastFired
                    ? `${lang === "tr" ? "son tetiklenme" : "last fired"} ${formatRelative(rule.lastFired)}`
                    : lang === "tr" ? "henüz tetiklenmedi" : "not fired yet"}
                </p>
              </div>
              <button
                onClick={() => setPaused((p) => ({ ...p, [rule.id]: !p[rule.id] }))}
                className={cn(
                  "inline-flex h-9 items-center gap-1.5 rounded-lg px-3.5 text-[13px] font-medium transition-colors",
                  isPaused
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : "border border-border bg-card text-foreground hover:bg-muted",
                )}
              >
                {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                {isPaused ? (lang === "tr" ? "Etkinleştir" : "Activate") : (lang === "tr" ? "Duraklat" : "Pause")}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { useLang } from "@/components/i18n/language-provider";
import { cn, formatPrice, formatRelative } from "@/lib/utils";
import { priceChanges, competitors } from "@/lib/demo/data";

function compColor(id: string) {
  return competitors.find((c) => c.id === id)?.color ?? "var(--color-mid)";
}

export default function ChangesPage() {
  const { lang } = useLang();

  return (
    <div className="mx-auto max-w-[900px] animate-fade-in space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">{lang === "tr" ? "Fiyat değişimleri" : "Price changes"}</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {lang === "tr" ? "Rakiplerinin yaptığı her hamle — kim, neyi, ne zaman, ne kadar." : "Every move your rivals make — who, what, when, how much."}
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <div className="divide-y divide-border/60">
          {priceChanges.map((c) => {
            const dropped = c.to < c.from;
            const pct = (((c.to - c.from) / c.from) * 100).toFixed(1);
            return (
              <div key={c.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[11px] font-bold text-white" style={{ background: compColor(c.competitorId) }}>
                  {c.who.slice(0, 2).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-tight">
                    <span className="font-semibold">{c.who}</span>{" "}
                    <span className="text-muted-foreground">{lang === "tr" ? "fiyatını değiştirdi:" : "changed price on"}</span>{" "}
                    <span className="font-medium">{c.product}</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground">{formatRelative(c.at)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="tnum text-sm text-muted-foreground line-through">{formatPrice(c.from)}</span>
                  <span className={cn("tnum inline-flex items-center gap-0.5 text-sm font-bold", dropped ? "text-success" : "text-destructive")}>
                    {dropped ? <ArrowDown className="h-3.5 w-3.5" /> : <ArrowUp className="h-3.5 w-3.5" />}
                    {formatPrice(c.to)}
                  </span>
                  <span className={cn("tnum rounded-full px-2 py-0.5 text-[11px] font-semibold", dropped ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive")}>
                    {pct}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

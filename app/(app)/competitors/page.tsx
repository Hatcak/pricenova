"use client";

import Link from "next/link";
import { Plus, Globe, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useLang } from "@/components/i18n/language-provider";
import { cn } from "@/lib/utils";
import { rivalCols, products } from "@/lib/demo/data";

export default function CompetitorsPage() {
  const { lang } = useLang();

  // For each competitor, count how often they're cheaper than you.
  const stats = rivalCols.map((c) => {
    let cheaper = 0;
    let pricier = 0;
    let matched = 0;
    for (const p of products) {
      const r = p.rivals.find((x) => x.competitorId === c.id);
      if (!r || r.price === null) continue;
      matched++;
      if (r.price < p.yourPrice) cheaper++;
      else if (r.price > p.yourPrice) pricier++;
    }
    return { ...c, cheaper, pricier, matched };
  });

  return (
    <div className="mx-auto max-w-[1200px] animate-fade-in space-y-6">
      {/* header */}
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">{lang === "tr" ? "Rakipler" : "Competitors"}</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {lang === "tr" ? "İzlediğin mağazalar, ortalama fiyat farkı ve eşleşen ürünler." : "The stores you track, their avg price gap and matched products."}
          </p>
        </div>
        <button className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-[13px] font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90">
          <Plus className="h-4 w-4" />
          {lang === "tr" ? "Rakip ekle" : "Add competitor"}
        </button>
      </div>

      {/* competitor cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {stats.map((c) => {
          const cheaperPct = c.matched ? Math.round((c.cheaper / c.matched) * 100) : 0;
          return (
            <div key={c.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-sm font-bold text-white" style={{ background: c.color }}>
                  {c.name.slice(0, 2).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold tracking-tight">{c.name}</p>
                  <p className="inline-flex items-center gap-1 truncate text-xs text-muted-foreground">
                    <Globe className="h-3 w-3" /> {c.domain}
                  </p>
                </div>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                    c.avgGap > 0 ? "bg-success/10 text-success" : c.avgGap < 0 ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground",
                  )}
                >
                  {c.avgGap > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {c.avgGap > 0 ? "+" : ""}{c.avgGap.toFixed(1)}%
                </span>
              </div>

              {/* mini stats */}
              <div className="mt-4 grid grid-cols-3 gap-3">
                <Mini label={lang === "tr" ? "Eşleşme" : "Matched"} value={String(c.matched)} />
                <Mini label={lang === "tr" ? "Onlar ucuz" : "They're cheaper"} value={String(c.cheaper)} tone="destructive" />
                <Mini label={lang === "tr" ? "Sen ucuz" : "You're cheaper"} value={String(c.pricier)} tone="success" />
              </div>

              {/* cheaper-than-you bar */}
              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{lang === "tr" ? "Senden ucuz oldukları SKU" : "SKUs where they undercut you"}</span>
                  <span className="tnum">{cheaperPct}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-destructive" style={{ width: `${cheaperPct}%` }} />
                </div>
              </div>

              <Link
                href="/matches"
                className="mt-4 block w-full rounded-lg border border-border bg-card py-2 text-center text-[13px] font-medium text-foreground transition-colors hover:bg-muted"
              >
                {lang === "tr" ? "Eşleşmeleri yönet" : "Manage matches"}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Mini({ label, value, tone }: { label: string; value: string; tone?: "success" | "destructive" }) {
  return (
    <div className="rounded-xl border border-border bg-muted/30 p-2.5 text-center">
      <p className={cn("tnum text-lg font-bold leading-none", tone === "success" ? "text-success" : tone === "destructive" ? "text-destructive" : "text-foreground")}>
        {value}
      </p>
      <p className="mt-1 text-[10.5px] text-muted-foreground">{label}</p>
    </div>
  );
}

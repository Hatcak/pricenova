"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { Sparkline } from "@/components/app/charts";
import { PositionPill } from "@/components/app/position";
import { useLang } from "@/components/i18n/language-provider";
import { formatPrice } from "@/lib/utils";

/**
 * Inline-SVG marks for the platforms this kit integrates with. One source for
 * both the marketing logo row and the Marketplaces screen in the app — no image
 * files, and nothing to keep in sync twice.
 */
const BRAND_GLYPHS: Record<string, React.ReactNode> = {
  Shopify: <path d="M4 8 l6 -2 l6 2 l2 11 h-16 z M9 6 a3 3 0 0 1 6 0" />,
  WooCommerce: <path d="M3 6 h18 v9 h-11 l-4 4 v-4 h-3 z M8 10 l1.5 3 l1.5 -3 M13 10 l1.5 3 l1.5 -3" />,
  Amazon: <path d="M4 15 c5 4 11 4 16 0 M9 4 h4 a3 3 0 0 1 0 6 h-2 a3 3 0 0 0 0 6 h4" />,
  Trendyol: <path d="M4 7 h16 l-2 12 h-12 z M9 4 l3 3 l3 -3" />,
  Slack: <path d="M9 4 v6 M15 14 v6 M4 15 h6 M14 9 h6 M10 10 h4 v4 h-4 z" />,
  Supabase: <path d="M13 3 L5 13 h6 v8 L19 11 h-6 z" />,
};

/** Just the icon, at whatever size the caller wants. */
export function BrandGlyph({ name, className = "h-5 w-5" }: { name: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {BRAND_GLYPHS[name]}
    </svg>
  );
}

/** Icon + wordmark, used in the marketing logo row. */
export function CompanyMark({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-muted-foreground/70">
      <BrandGlyph name={name} />
      <span className="text-[15px] font-semibold tracking-tight">{name}</span>
    </span>
  );
}

/* ── Hero product-preview card: a mini price-comparison table ───────────────── */
export function ProductPreview() {
  const { lang } = useLang();
  const rows = [
    { you: 79.0, name: "Aurora Earbuds Pro", rivals: [81.5, 84.0, 79.9], pos: "cheapest" as const, spark: [82, 81, 80, 80, 79, 79], down: true },
    { you: 189.0, name: "Pulse Smartwatch 5", rivals: [174.99, 179.0, 181.5], pos: "expensive" as const, spark: [185, 186, 187, 188, 189, 189], down: false },
    { you: 44.9, name: "Nimbus Speaker", rivals: [42.0, 43.5, 47.99], pos: "mid" as const, spark: [46, 45, 45, 44.9, 44.9, 44.9], down: true },
  ];

  return (
    <div className="w-full rounded-2xl border border-border bg-card p-4 shadow-pop sm:p-5">
      {/* mini summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-border bg-muted/40 p-3">
          <p className="text-[10.5px] font-medium text-muted-foreground">{lang === "tr" ? "En ucuz" : "You win"}</p>
          <p className="mt-1 tnum text-lg font-bold leading-none text-success">21</p>
        </div>
        <div className="rounded-xl border border-border bg-muted/40 p-3">
          <p className="text-[10.5px] font-medium text-muted-foreground">{lang === "tr" ? "Endeks" : "Index"}</p>
          <p className="mt-1 tnum text-lg font-bold leading-none">98.4</p>
        </div>
        <div className="rounded-xl border border-border bg-muted/40 p-3">
          <div className="flex items-center justify-between">
            <p className="text-[10.5px] font-medium text-muted-foreground">{lang === "tr" ? "Değişim" : "Changes"}</p>
            <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-semibold text-primary">{lang === "tr" ? "bugün" : "today"}</span>
          </div>
          <p className="mt-1 tnum text-lg font-bold leading-none">23</p>
        </div>
      </div>

      {/* mini table */}
      <div className="mt-4 overflow-hidden rounded-xl border border-border">
        <div className="grid grid-cols-[1.5fr_auto_auto] gap-2 border-b border-border bg-muted/40 px-3 py-2 label-mono text-muted-foreground">
          <span>{lang === "tr" ? "Ürün" : "Product"}</span>
          <span className="text-right text-primary">{lang === "tr" ? "Senin" : "You"}</span>
          <span className="text-right">{lang === "tr" ? "Konum" : "Position"}</span>
        </div>
        {rows.map((r, i) => (
          <div
            key={r.name}
            className={`grid grid-cols-[1.5fr_auto_auto] items-center gap-2 px-3 py-2.5 ${i === 0 ? "bg-primary/[0.04]" : ""} ${i < rows.length - 1 ? "border-b border-border/60" : ""}`}
          >
            <div className="flex items-center gap-2">
              <Sparkline
                data={r.spark}
                width={40}
                height={20}
                color={r.pos === "cheapest" ? "var(--color-success)" : r.pos === "expensive" ? "var(--color-destructive)" : "var(--color-mid)"}
              />
              <div className="min-w-0">
                <p className="truncate text-[12px] font-semibold leading-tight">{r.name}</p>
                <p className="tnum truncate text-[9.5px] text-muted-foreground">
                  {lang === "tr" ? "rakip" : "rivals"} {r.rivals.map((x) => formatPrice(x)).join(" · ")}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="tnum inline-flex items-center gap-0.5 text-[12px] font-bold text-primary">
                {formatPrice(r.you)}
                {r.down ? <ArrowDown className="h-3 w-3 text-success" /> : <ArrowUp className="h-3 w-3 text-destructive" />}
              </p>
            </div>
            <div className="flex justify-end">
              <PositionPill position={r.pos} lang={lang} withDot={false} />
            </div>
          </div>
        ))}
      </div>

      {/* reprice button */}
      <button className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary py-2.5 text-[13px] font-semibold text-primary-foreground">
        {lang === "tr" ? "14 ürünü yeniden fiyatlandır" : "Reprice 14 products"}
        <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]">14</span>
      </button>
    </div>
  );
}

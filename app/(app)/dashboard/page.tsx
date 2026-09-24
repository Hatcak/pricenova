"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Download,
  Plus,
  Search,
  X,
  ArrowUpRight,
  ArrowDownRight,
  ArrowUp,
  ArrowDown,
  Minus,
  Pause,
  Play,
} from "lucide-react";
import { Sparkline, AreaChart, MultiLineChart } from "@/components/app/charts";
import { PositionPill, deltaTone } from "@/components/app/position";
import { useLang } from "@/components/i18n/language-provider";
import { cn, formatPrice, formatRelative } from "@/lib/utils";
import {
  products,
  rivalCols,
  competitors,
  summary,
  priceChanges,
  repriceRules,
  positionMix,
  priceIndexTrend,
  priceIndexMeta,
  kpis,
  CATEGORIES,
  type ProductRow,
} from "@/lib/demo/data";

const ALL = "__all__";

function compName(id: string) {
  return competitors.find((c) => c.id === id)?.name ?? id;
}
function compColor(id: string) {
  return competitors.find((c) => c.id === id)?.color ?? "var(--color-mid)";
}

export default function DashboardPage() {
  const { t, lang } = useLang();
  const [selected, setSelected] = useState<string | null>("p2");
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>(ALL);

  const rows = useMemo(
    () =>
      products.filter(
        (p) =>
          (category === ALL || p.category === category) &&
          (!query ||
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.sku.toLowerCase().includes(query.toLowerCase())),
      ),
    [query, category],
  );

  const selectedProduct = products.find((p) => p.id === selected) ?? products[0];
  const maxMix = Math.max(positionMix.cheapest, positionMix.mid, positionMix.expensive);

  return (
    <div className="mx-auto max-w-[1500px] animate-fade-in">
      <div className={cn("grid gap-6", drawerOpen ? "xl:grid-cols-[1fr_368px]" : "grid-cols-1")}>
        {/* ── Main column ──────────────────────────────────────────── */}
        <div className="min-w-0 space-y-6">
          {/* Page header */}
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight">
                {lang === "tr" ? "Fiyat paneli" : "Price cockpit"}
              </h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {lang === "tr"
                  ? "Rakiplerin nerede, sen neredesin — tek bakışta."
                  : "Where your rivals are, where you stand — at a glance."}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3.5 text-[13px] font-medium text-foreground shadow-pill transition-colors hover:bg-muted">
                <Download className="h-4 w-4 text-muted-foreground" />
                {lang === "tr" ? "Rapor indir" : "Export report"}
              </button>
              <button className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-[13px] font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90">
                <Plus className="h-4 w-4" />
                {lang === "tr" ? "Ürün ekle" : "Add product"}
              </button>
            </div>
          </div>

          {/* Stat row */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label={t(summary.productsTracked.label)} value={String(summary.productsTracked.value)} delta={summary.productsTracked.delta} />
            <StatCard label={t(summary.competitors.label)} value={String(summary.competitors.value)} delta={summary.competitors.delta} />
            <StatCard label={t(summary.changesToday.label)} value={String(summary.changesToday.value)} delta={summary.changesToday.delta} />
            <StatCard label={t(summary.priceIndex.label)} value={summary.priceIndex.value.toFixed(1)} delta={summary.priceIndex.delta} lowerIsBetter />
          </div>

          {/* Products table — your price vs competitors */}
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
            <div className="flex flex-wrap items-center gap-2.5 border-b border-border p-4">
              <h2 className="font-display text-[15px] font-semibold tracking-tight">
                {lang === "tr" ? "Ürünler & rakip fiyatları" : "Products & competitor prices"}
              </h2>
              <div className="ml-auto flex flex-wrap items-center gap-2">
                <div className="flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={lang === "tr" ? "Ürün / SKU ara…" : "Search product / SKU…"}
                    className="w-32 bg-transparent text-foreground placeholder:text-muted-foreground/70 focus:outline-none sm:w-44"
                  />
                </div>
              </div>
            </div>

            {/* category filter (useState) */}
            <div className="flex items-center gap-1.5 overflow-x-auto border-b border-border px-4 py-2.5">
              <FilterChip active={category === ALL} onClick={() => setCategory(ALL)}>
                {lang === "tr" ? "Tümü" : "All"}
              </FilterChip>
              {CATEGORIES.map((c) => (
                <FilterChip key={c} active={category === c} onClick={() => setCategory(c)}>
                  {c}
                </FilterChip>
              ))}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="label-mono py-2.5 pl-4 font-medium text-muted-foreground">{lang === "tr" ? "Ürün" : "Product"}</th>
                    <th className="label-mono py-2.5 text-right font-medium text-primary">{lang === "tr" ? "Senin" : "You"}</th>
                    {rivalCols.map((c) => (
                      <th key={c.id} className="label-mono hidden py-2.5 text-right font-medium text-muted-foreground lg:table-cell">{c.name}</th>
                    ))}
                    <th className="label-mono py-2.5 text-center font-medium text-muted-foreground">{lang === "tr" ? "Konum" : "Position"}</th>
                    <th className="label-mono py-2.5 pr-4 text-right font-medium text-muted-foreground">{lang === "tr" ? "Seyir" : "Trend"}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => {
                    const isSel = row.id === selected;
                    return (
                      <tr
                        key={row.id}
                        onClick={() => {
                          setSelected(row.id);
                          setDrawerOpen(true);
                        }}
                        className={cn(
                          "cursor-pointer border-b border-border/60 transition-colors last:border-0",
                          isSel ? "bg-primary/4" : "hover:bg-muted/50",
                        )}
                      >
                        <td className="py-3 pl-4">
                          <div className="min-w-0 max-w-[200px]">
                            <p className="truncate font-semibold leading-tight">{row.name}</p>
                            <p className="tnum text-[11px] text-muted-foreground">{row.sku} · {row.category}</p>
                          </div>
                        </td>
                        <td className="py-3 pr-2 text-right">
                          <p className="tnum font-bold text-primary">{formatPrice(row.yourPrice)}</p>
                          <p className="text-[10.5px] text-muted-foreground">
                            {lang === "tr" ? `${row.sellers} satıcı` : `${row.sellers} sellers`}
                          </p>
                        </td>
                        {rivalCols.map((c) => {
                          const r = row.rivals.find((x) => x.competitorId === c.id);
                          return (
                            <td key={c.id} className="hidden py-3 pr-2 text-right lg:table-cell">
                              {r && r.price !== null ? (
                                <>
                                  <p className="tnum font-medium">{formatPrice(r.price)}</p>
                                  <DeltaTag delta={r.delta} />
                                </>
                              ) : (
                                <span className="text-xs text-muted-foreground">—</span>
                              )}
                            </td>
                          );
                        })}
                        <td className="py-3 text-center">
                          <PositionPill position={row.position} lang={lang} />
                        </td>
                        <td className="py-3 pr-4">
                          <div className="flex justify-end">
                            <Sparkline
                              data={row.spark}
                              color={row.position === "cheapest" ? "var(--color-success)" : row.position === "expensive" ? "var(--color-destructive)" : "var(--color-mid)"}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t border-border px-4 py-2.5 text-xs text-muted-foreground">
              <span>{rows.length} {lang === "tr" ? "ürün" : "products"}</span>
              <Link href="/products" className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
                {lang === "tr" ? "Tümünü gör" : "View all"} <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* KPI strip */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {kpis.map((k) => {
              const up = (k.delta ?? 0) >= 0;
              return (
                <div key={t(k.label)} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
                  <p className="text-[12.5px] font-medium text-muted-foreground">{t(k.label)}</p>
                  <div className="mt-2 flex items-end justify-between">
                    <p className="tnum text-xl font-bold leading-none">{k.value}</p>
                    {k.delta !== undefined && k.delta !== 0 && (
                      <span className={cn("inline-flex items-center gap-0.5 text-[11px] font-semibold", up ? "text-success" : "text-destructive")}>
                        {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {Math.abs(k.delta).toFixed(1)}%
                      </span>
                    )}
                  </div>
                  {k.hint && <p className="mt-1.5 line-clamp-1 text-[11px] text-muted-foreground">{t(k.hint)}</p>}
                </div>
              );
            })}
          </div>

          {/* Price index + position mix */}
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            {/* Price index area chart */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-[15px] font-semibold tracking-tight">{t(priceIndexMeta.title)}</h3>
                  <p className="text-xs text-muted-foreground">{t(priceIndexMeta.subtitle)}</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success">
                  <ArrowDownRight className="h-3 w-3" />
                  {priceIndexMeta.delta}
                </span>
              </div>
              <p className="mt-3 tnum text-2xl font-bold leading-none">{summary.priceIndex.value.toFixed(1)}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {lang === "tr" ? "Pazar ortalamasının %1,6 altındasın" : "1.6% below the market average"}
              </p>
              <div className="mt-4">
                <AreaChart
                  data={priceIndexTrend.map((v) => v.value)}
                  labels={priceIndexTrend.map((v) => v.label)}
                  height={150}
                  baseline={100}
                />
              </div>
            </div>

            {/* Price position mix */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <h3 className="font-display text-[15px] font-semibold tracking-tight">
                {lang === "tr" ? "Fiyat konumu dağılımı" : "Price position mix"}
              </h3>
              <p className="text-xs text-muted-foreground">{lang === "tr" ? "48 SKU üzerinden" : "Across 48 SKUs"}</p>
              <div className="mt-4 space-y-3.5">
                {([
                  { key: "cheapest", label: lang === "tr" ? "En ucuz" : "Cheapest", value: positionMix.cheapest, color: "var(--color-success)" },
                  { key: "mid", label: lang === "tr" ? "Orta" : "Mid", value: positionMix.mid, color: "var(--color-mid)" },
                  { key: "expensive", label: lang === "tr" ? "En pahalı" : "Most expensive", value: positionMix.expensive, color: "var(--color-destructive)" },
                ] as const).map((r) => (
                  <div key={r.key}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="inline-flex items-center gap-2 font-medium">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ background: r.color }} />
                        {r.label}
                      </span>
                      <span className="tnum text-muted-foreground">{r.value} {lang === "tr" ? "SKU" : "SKUs"}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full" style={{ width: `${(r.value / maxMix) * 100}%`, background: r.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Repricing rules panel */}
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
            <div className="flex items-center justify-between border-b border-border p-4">
              <div>
                <h3 className="font-display text-[15px] font-semibold tracking-tight">
                  {lang === "tr" ? "Yeniden fiyatlandırma kuralları" : "Repricing rules"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {lang === "tr" ? "Fiyatını otomatik ayarlayan mantık" : "The logic that adjusts your price automatically"}
                </p>
              </div>
              <Link href="/rules" className="inline-flex items-center gap-1 text-[13px] font-medium text-primary hover:underline">
                {lang === "tr" ? "Tümünü yönet" : "Manage all"}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="divide-y divide-border/60">
              {repriceRules.map((rule) => (
                <div key={rule.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                  <span className={cn(
                    "grid h-9 w-9 shrink-0 place-items-center rounded-lg",
                    rule.status === "active" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
                  )}>
                    {rule.status === "active" ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{t(rule.name)}</p>
                    <p className="tnum truncate text-[11px] text-muted-foreground">{rule.formula} · {t(rule.scope)}</p>
                  </div>
                  <span className="tnum hidden text-xs text-muted-foreground sm:block">
                    {rule.appliesTo} {lang === "tr" ? "ürün" : "products"}
                  </span>
                  <span className={cn(
                    "inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold",
                    rule.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground",
                  )}>
                    {rule.status === "active" ? (lang === "tr" ? "aktif" : "active") : (lang === "tr" ? "duraklatıldı" : "paused")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right detail drawer ──────────────────────────────────── */}
        {drawerOpen && (
          <aside className="animate-float-up xl:sticky xl:top-2 xl:self-start">
            <ProductDrawer product={selectedProduct} onClose={() => setDrawerOpen(false)} />

            {/* Price-changes feed */}
            <div className="mt-5 rounded-2xl border border-border bg-card p-5 shadow-soft">
              <h3 className="font-display text-[15px] font-semibold tracking-tight">
                {lang === "tr" ? "Fiyat değişimleri" : "Price changes"}
              </h3>
              <p className="text-xs text-muted-foreground">{lang === "tr" ? "Kim neyi ne zaman değiştirdi" : "Who changed what, when"}</p>
              <div className="mt-4 space-y-3.5">
                {priceChanges.slice(0, 7).map((c) => {
                  const dropped = c.to < c.from;
                  return (
                    <div key={c.id} className="flex items-start gap-2.5">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[10px] font-bold text-white" style={{ background: compColor(c.competitorId) }}>
                        {c.who.slice(0, 2).toUpperCase()}
                      </span>
                      <div className="min-w-0 flex-1 text-[13px]">
                        <p className="leading-snug">
                          <span className="font-semibold">{c.who}</span>{" "}
                          <span className="text-muted-foreground">→</span>{" "}
                          <span>{c.product}</span>
                        </p>
                        <p className="mt-0.5 flex items-center gap-1.5 text-[11px]">
                          <span className="tnum text-muted-foreground line-through">{formatPrice(c.from)}</span>
                          <span className={cn("tnum inline-flex items-center gap-0.5 font-semibold", dropped ? "text-success" : "text-destructive")}>
                            {dropped ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />}
                            {formatPrice(c.to)}
                          </span>
                          <span className="ml-auto text-muted-foreground">{formatRelative(c.at)}</span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Competitors list */}
            <div className="mt-5 rounded-2xl border border-border bg-card p-5 shadow-soft">
              <h3 className="font-display text-[15px] font-semibold tracking-tight">
                {lang === "tr" ? "Rakipler" : "Competitors"}
              </h3>
              <div className="mt-4 space-y-2.5">
                {rivalCols.map((c) => (
                  <div key={c.id} className="flex items-center gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[10px] font-bold text-white" style={{ background: c.color }}>
                      {c.name.slice(0, 2).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold leading-tight">{c.name}</p>
                      <p className="truncate text-[11px] text-muted-foreground">{c.domain} · {c.products} {lang === "tr" ? "eşleşme" : "matched"}</p>
                    </div>
                    <span className={cn("tnum text-xs font-semibold", c.avgGap > 0 ? "text-success" : c.avgGap < 0 ? "text-destructive" : "text-muted-foreground")}>
                      {c.avgGap > 0 ? "+" : ""}{c.avgGap.toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
              <Link href="/competitors" className="mt-4 inline-flex items-center gap-1 text-[13px] font-medium text-primary hover:underline">
                {lang === "tr" ? "Rakipleri yönet" : "Manage competitors"}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

/* ── Stat card (top row) ───────────────────────────────────────────────────── */
function StatCard({
  label,
  value,
  delta,
  lowerIsBetter = false,
}: {
  label: string;
  value: string;
  delta: number;
  lowerIsBetter?: boolean;
}) {
  const positive = lowerIsBetter ? delta < 0 : delta > 0;
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
      <p className="text-[12.5px] font-medium text-muted-foreground">{label}</p>
      <div className="mt-2 flex items-end justify-between">
        <p className="tnum text-2xl font-bold leading-none">{value}</p>
        {delta !== 0 ? (
          <span className={cn("inline-flex items-center gap-0.5 text-[11px] font-semibold", positive ? "text-success" : "text-destructive")}>
            {delta > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(delta)}
          </span>
        ) : (
          <span className="inline-flex items-center text-[11px] font-semibold text-muted-foreground">
            <Minus className="h-3 w-3" />
          </span>
        )}
      </div>
    </div>
  );
}

/* ── Filter chip (category) ────────────────────────────────────────────────── */
function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-8 shrink-0 rounded-lg px-3 text-[12.5px] font-medium transition-colors",
        active ? "bg-primary text-primary-foreground" : "border border-border bg-card text-muted-foreground hover:bg-muted",
      )}
    >
      {children}
    </button>
  );
}

/* ── Delta tag (% vs your price) ───────────────────────────────────────────── */
function DeltaTag({ delta }: { delta: number | null }) {
  if (delta === null) return null;
  if (delta === 0) return <p className="text-[10.5px] text-muted-foreground">±0%</p>;
  const up = delta > 0;
  return (
    <p className={cn("tnum inline-flex items-center justify-end gap-0.5 text-[10.5px] font-semibold", deltaTone(delta))}>
      {up ? <ArrowUp className="h-2.5 w-2.5" /> : <ArrowDown className="h-2.5 w-2.5" />}
      {Math.abs(delta)}%
    </p>
  );
}

/* ── Product detail drawer — multi-line price-history chart ────────────────── */
function ProductDrawer({ product, onClose }: { product: ProductRow; onClose: () => void }) {
  const { lang } = useLang();
  const series = product.history.map((h) => ({
    id: h.competitorId,
    color: compColor(h.competitorId),
    data: h.series,
  }));
  const lowestRival = product.rivals
    .filter((r) => r.price !== null)
    .reduce((m, r) => (r.price! < m ? r.price! : m), Infinity);

  return (
    <div className="space-y-5 rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="font-display text-[15px] font-semibold tracking-tight">
            {lang === "tr" ? "Fiyat geçmişi" : "Price history"}
          </h2>
          <p className="truncate text-xs text-muted-foreground">{product.name}</p>
        </div>
        <button
          onClick={onClose}
          aria-label={lang === "tr" ? "Kapat" : "Close"}
          className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* your price + position */}
      <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 p-3">
        <div>
          <p className="text-[11px] text-muted-foreground">{lang === "tr" ? "Senin fiyatın" : "Your price"}</p>
          <p className="tnum text-xl font-bold leading-none text-primary">{formatPrice(product.yourPrice)}</p>
        </div>
        <div className="text-right">
          <PositionPill position={product.position} lang={lang} />
          <p className="tnum mt-1 text-[11px] text-muted-foreground">
            {lang === "tr" ? "sıra" : "rank"} {product.rank}/{product.sellers}
          </p>
        </div>
      </div>

      {/* multi-line chart — one line per competitor across time */}
      <MultiLineChart series={series} height={170} />

      {/* legend */}
      <div className="flex flex-wrap gap-x-3 gap-y-1.5">
        {product.history.map((h) => (
          <span key={h.competitorId} className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="h-2 w-2 rounded-full" style={{ background: compColor(h.competitorId) }} />
            {h.competitorId === "you" ? (lang === "tr" ? "Sen" : "You") : compName(h.competitorId)}
          </span>
        ))}
      </div>

      {/* rival prices table */}
      <div>
        <div className="grid grid-cols-[1fr_auto_auto] gap-3 border-b border-border pb-2 label-mono text-muted-foreground">
          <span>{lang === "tr" ? "Rakip" : "Competitor"}</span>
          <span className="text-right">{lang === "tr" ? "Fiyat" : "Price"}</span>
          <span className="text-right">Δ</span>
        </div>
        <div className="divide-y divide-border/60">
          {product.rivals.map((r) => (
            <div key={r.competitorId} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 py-2.5">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: compColor(r.competitorId) }} />
                <span className="text-[13px] font-medium">{compName(r.competitorId)}</span>
              </div>
              <span className="tnum text-right text-[13px] font-semibold">
                {r.price === null ? "—" : formatPrice(r.price)}
              </span>
              <span className={cn("tnum text-right text-[12px] font-semibold", deltaTone(r.delta))}>
                {r.delta === null ? "—" : `${r.delta > 0 ? "+" : ""}${r.delta}%`}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* footer: suggested reprice */}
      <div className="rounded-xl border border-primary/30 bg-primary/4 p-3">
        <p className="text-[11px] font-medium text-muted-foreground">{lang === "tr" ? "Önerilen fiyat" : "Suggested price"}</p>
        <div className="mt-1 flex items-end justify-between gap-2">
          <p className="tnum text-lg font-bold text-primary">
            {formatPrice(Math.max(product.cost * 1.1, lowestRival - 0.01))}
          </p>
          <span className="text-right text-[11px] text-muted-foreground">{lang === "tr" ? "en düşüğü -%1 · taban maliyet +%10" : "lowest −1% · floor cost +10%"}</span>
        </div>
      </div>
      <button className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary py-2.5 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90">
        {lang === "tr" ? "Şimdi yeniden fiyatlandır" : "Reprice now"}
      </button>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { Search, Plus, Download, ArrowUp, ArrowDown } from "lucide-react";
import { Sparkline } from "@/components/app/charts";
import { PositionPill, deltaTone } from "@/components/app/position";
import { useLang } from "@/components/i18n/language-provider";
import { cn, formatPrice } from "@/lib/utils";
import { products, rivalCols, CATEGORIES, positionMix } from "@/lib/demo/data";

const ALL = "__all__";

export default function ProductsPage() {
  const { lang } = useLang();
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

  return (
    <div className="mx-auto max-w-[1400px] animate-fade-in space-y-6">
      {/* header */}
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">{lang === "tr" ? "Ürünler" : "Products"}</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {lang === "tr" ? "Senin fiyatın, rakip fiyatları ve pazar konumun." : "Your price, competitor prices and your market position."}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3.5 text-[13px] font-medium text-foreground shadow-pill transition-colors hover:bg-muted">
            <Download className="h-4 w-4 text-muted-foreground" />
            {lang === "tr" ? "Dışa aktar" : "Export"}
          </button>
          <button className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-[13px] font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90">
            <Plus className="h-4 w-4" />
            {lang === "tr" ? "Ürün ekle" : "Add product"}
          </button>
        </div>
      </div>

      {/* summary chips */}
      <div className="grid grid-cols-3 gap-4">
        <SummaryChip label={lang === "tr" ? "En ucuz olduğun" : "You win"} value={positionMix.cheapest} color="var(--color-success)" />
        <SummaryChip label={lang === "tr" ? "Orta konum" : "Mid position"} value={positionMix.mid} color="var(--color-mid)" />
        <SummaryChip label={lang === "tr" ? "En pahalı olduğun" : "Most expensive"} value={positionMix.expensive} color="var(--color-destructive)" />
      </div>

      {/* table card */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <div className="flex flex-wrap items-center gap-2.5 border-b border-border p-4">
          <div className="flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={lang === "tr" ? "Ürün / SKU ara…" : "Search product / SKU…"}
              className="w-40 bg-transparent text-foreground placeholder:text-muted-foreground/70 focus:outline-none sm:w-56"
            />
          </div>
          <div className="ml-auto flex items-center gap-1.5 overflow-x-auto">
            <Chip active={category === ALL} onClick={() => setCategory(ALL)}>{lang === "tr" ? "Tümü" : "All"}</Chip>
            {CATEGORIES.map((c) => (
              <Chip key={c} active={category === c} onClick={() => setCategory(c)}>{c}</Chip>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="label-mono py-2.5 pl-4 font-medium text-muted-foreground">{lang === "tr" ? "Ürün" : "Product"}</th>
                <th className="label-mono py-2.5 text-right font-medium text-muted-foreground">{lang === "tr" ? "Maliyet" : "Cost"}</th>
                <th className="label-mono py-2.5 text-right font-medium text-primary">{lang === "tr" ? "Senin" : "You"}</th>
                {rivalCols.map((c) => (
                  <th key={c.id} className="label-mono hidden py-2.5 text-right font-medium text-muted-foreground xl:table-cell">{c.name}</th>
                ))}
                <th className="label-mono py-2.5 text-center font-medium text-muted-foreground">{lang === "tr" ? "Konum" : "Position"}</th>
                <th className="label-mono py-2.5 pr-4 text-right font-medium text-muted-foreground">{lang === "tr" ? "Seyir" : "Trend"}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const margin = (((row.yourPrice - row.cost) / row.yourPrice) * 100).toFixed(0);
                return (
                  <tr key={row.id} className="border-b border-border/60 transition-colors last:border-0 hover:bg-muted/50">
                    <td className="py-3 pl-4">
                      <div className="min-w-0 max-w-[220px]">
                        <p className="truncate font-semibold leading-tight">{row.name}</p>
                        <p className="tnum text-[11px] text-muted-foreground">{row.sku} · {row.category}</p>
                      </div>
                    </td>
                    <td className="py-3 pr-2 text-right">
                      <p className="tnum text-[13px]">{formatPrice(row.cost)}</p>
                      <p className="text-[10.5px] text-muted-foreground">{lang === "tr" ? `marj %${margin}` : `${margin}% margin`}</p>
                    </td>
                    <td className="py-3 pr-2 text-right">
                      <p className="tnum font-bold text-primary">{formatPrice(row.yourPrice)}</p>
                    </td>
                    {rivalCols.map((c) => {
                      const r = row.rivals.find((x) => x.competitorId === c.id);
                      return (
                        <td key={c.id} className="hidden py-3 pr-2 text-right xl:table-cell">
                          {r && r.price !== null ? (
                            <>
                              <p className="tnum font-medium">{formatPrice(r.price)}</p>
                              {r.delta !== null && r.delta !== 0 && (
                                <p className={cn("tnum inline-flex items-center justify-end gap-0.5 text-[10.5px] font-semibold", deltaTone(r.delta))}>
                                  {r.delta > 0 ? <ArrowUp className="h-2.5 w-2.5" /> : <ArrowDown className="h-2.5 w-2.5" />}
                                  {Math.abs(r.delta)}%
                                </p>
                              )}
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
        <div className="border-t border-border px-4 py-2.5 text-xs text-muted-foreground">
          {rows.length} {lang === "tr" ? "ürün gösteriliyor" : "products shown"}
        </div>
      </div>
    </div>
  );
}

function SummaryChip({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
        <p className="text-[12.5px] font-medium text-muted-foreground">{label}</p>
      </div>
      <p className="mt-2 tnum text-2xl font-bold leading-none">{value}</p>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
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

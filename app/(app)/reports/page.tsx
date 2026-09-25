"use client";

/**
 * Reports — the weekly read on whether price monitoring is actually earning
 * its keep. Four questions, in order: am I winning more SKUs, where am I
 * bleeding, which rival is doing the damage, and what lands in my inbox.
 */

import { useEffect, useRef, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarClock,
  ChevronDown,
  Download,
  FileSpreadsheet,
  FileText,
  Mail,
  Minus,
  Plus,
  Printer,
  TrendingUp,
} from "lucide-react";
import { AreaChart, Sparkline } from "@/components/app/charts";
import { useLang } from "@/components/i18n/language-provider";
import { runExport, type ExportFormat, type ExportTable } from "@/lib/export";
import { cn, formatMoney, formatRelative } from "@/lib/utils";
import {
  categoryReport,
  competitorPressure,
  competitors,
  indexTrend,
  marginTrend,
  reportRanges,
  scheduledReports,
  weekLabels,
  winRateTrend,
  type ReportRange,
} from "@/lib/demo/data";

export default function ReportsPage() {
  const { t, lang } = useLang();
  const [range, setRange] = useState<ReportRange>("90d");

  const weeks = reportRanges.find((r) => r.key === range)?.weeks ?? 13;
  const slice = <T,>(arr: T[]) => arr.slice(-weeks);

  const wins = slice(winRateTrend);
  const index = slice(indexTrend);
  const margin = slice(marginTrend);
  const labels = slice(weekLabels);

  /** Change across the visible window — the number the range picker changes. */
  const delta = (series: number[]) => series[series.length - 1] - series[0];
  const winDelta = delta(wins);
  const indexDelta = delta(index);
  const marginTotal = margin.reduce((s, v) => s + v, 0);

  const nameOf = (id: string) => competitors.find((c) => c.id === id)?.name ?? id;
  const colorOf = (id: string) => competitors.find((c) => c.id === id)?.color ?? "var(--color-mid)";

  const totalSkus = categoryReport.reduce((s, c) => s + c.skus, 0);

  /** What actually goes into the exported file — the category scoreboard. */
  const exportTable = (): ExportTable => ({
    filename: `pricenova-rapor-${range}`,
    headers:
      lang === "tr"
        ? ["Kategori", "SKU", "En ucuz", "Orta", "En pahalı", "Ort. fark %", "Marj etkisi $"]
        : ["Category", "SKUs", "Cheapest", "Mid", "Most expensive", "Avg gap %", "Margin impact $"],
    rows: categoryReport.map((c) => [c.category, c.skus, c.win, c.mid, c.lose, c.avgGap, c.marginImpact]),
  });

  return (
    <div className="mx-auto max-w-[1200px] animate-fade-in space-y-6">
      {/* header + range picker */}
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            {lang === "tr" ? "Raporlar" : "Reports"}
          </h1>
          <p className="mt-0.5 max-w-2xl text-sm text-muted-foreground">
            {lang === "tr"
              ? "Fiyat konumun zamanla nereye gidiyor, hangi kategoride kazanıp hangisinde kaybediyorsun."
              : "Where your price position is heading, and which categories are winning or bleeding."}
          </p>
        </div>
        {/* Controls are for the screen, not for the printed page. */}
        <div className="ml-auto flex flex-wrap items-center gap-2 print:hidden">
          <div className="flex rounded-lg border border-border bg-muted/40 p-0.5">
            {reportRanges.map((r) => (
              <button
                key={r.key}
                onClick={() => setRange(r.key)}
                className={cn(
                  "cursor-pointer rounded-[7px] px-3 py-1.5 text-[12.5px] font-semibold transition-colors",
                  range === r.key ? "bg-card text-foreground shadow-pill" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t(r.label)}
              </button>
            ))}
          </div>
          <ExportMenu table={exportTable} lang={lang} />
        </div>
      </div>

      {/* headline numbers for the selected window */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Metric
          label={lang === "tr" ? "En ucuz olduğun SKU" : "SKUs you win"}
          value={`${wins[wins.length - 1]}%`}
          delta={winDelta}
          unit="pt"
        />
        <Metric
          label={lang === "tr" ? "Fiyat endeksi" : "Price index"}
          value={index[index.length - 1].toFixed(1)}
          delta={indexDelta}
          lowerIsBetter
        />
        <Metric
          label={lang === "tr" ? "Toplam marj etkisi" : "Total margin impact"}
          value={formatMoney(marginTotal)}
          delta={delta(margin)}
          unit="$"
        />
        <Metric
          label={lang === "tr" ? "İzlenen SKU" : "SKUs tracked"}
          value={String(totalSkus)}
          delta={0}
        />
      </div>

      {/* the two trend charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title={lang === "tr" ? "En ucuz olduğun SKU oranı" : "Share of SKUs you win"}
          subtitle={lang === "tr" ? "Yüzde · haftalık" : "Percent · weekly"}
          badge={`${winDelta >= 0 ? "+" : ""}${winDelta} ${lang === "tr" ? "puan" : "pts"}`}
          badgeGood={winDelta >= 0}
        >
          <AreaChart data={wins} labels={labels} height={160} color="var(--color-success)" />
        </ChartCard>

        <ChartCard
          title={lang === "tr" ? "Fiyat endeksi" : "Price index"}
          subtitle={lang === "tr" ? "Pazar = 100 · haftalık" : "Market = 100 · weekly"}
          badge={`${indexDelta >= 0 ? "+" : ""}${indexDelta.toFixed(1)}`}
          badgeGood={indexDelta < 0}
        >
          <AreaChart data={index} labels={labels} height={160} baseline={100} />
        </ChartCard>
      </div>

      {/* category scoreboard */}
      <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <div className="border-b border-border p-4">
          <h2 className="font-display text-[15px] font-semibold tracking-tight">
            {lang === "tr" ? "Kategori performansı" : "Category performance"}
          </h2>
          <p className="text-xs text-muted-foreground">
            {lang === "tr"
              ? "Negatif fark iyidir — en ucuz rakibin altındasın demektir."
              : "A negative gap is good — it means you're under the cheapest rival."}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="label-mono py-2.5 pl-4 font-medium text-muted-foreground">{lang === "tr" ? "Kategori" : "Category"}</th>
                <th className="label-mono py-2.5 text-right font-medium text-muted-foreground">SKU</th>
                <th className="label-mono py-2.5 pl-4 font-medium text-muted-foreground">{lang === "tr" ? "Dağılım" : "Split"}</th>
                <th className="label-mono py-2.5 text-right font-medium text-muted-foreground">{lang === "tr" ? "Ort. fark" : "Avg gap"}</th>
                <th className="label-mono py-2.5 pr-4 text-right font-medium text-muted-foreground">{lang === "tr" ? "Marj etkisi" : "Margin impact"}</th>
              </tr>
            </thead>
            <tbody>
              {categoryReport.map((c) => (
                <tr key={c.category} className="border-b border-border/60 transition-colors last:border-0 hover:bg-muted/50">
                  <td className="py-3 pl-4 font-semibold">{c.category}</td>
                  <td className="tnum py-3 text-right">{c.skus}</td>
                  <td className="py-3 pl-4">
                    {/* win / mid / lose as one bar — green left, red right */}
                    <div className="flex h-2.5 w-full min-w-[120px] max-w-[200px] overflow-hidden rounded-full bg-muted">
                      <span style={{ width: `${(c.win / c.skus) * 100}%`, background: "var(--color-success)" }} />
                      <span style={{ width: `${(c.mid / c.skus) * 100}%`, background: "var(--color-mid)", marginLeft: 1.5 }} />
                      <span style={{ width: `${(c.lose / c.skus) * 100}%`, background: "var(--color-destructive)", marginLeft: 1.5 }} />
                    </div>
                    <p className="tnum mt-1 text-[10.5px] text-muted-foreground">
                      {c.win} {lang === "tr" ? "kazanç" : "win"} · {c.mid} {lang === "tr" ? "orta" : "mid"} · {c.lose} {lang === "tr" ? "kayıp" : "lose"}
                    </p>
                  </td>
                  <td className={cn("tnum py-3 text-right font-semibold", c.avgGap < 0 ? "text-success" : "text-destructive")}>
                    {c.avgGap > 0 ? "+" : ""}{c.avgGap}%
                  </td>
                  <td className={cn("tnum py-3 pr-4 text-right font-semibold", c.marginImpact >= 0 ? "text-success" : "text-destructive")}>
                    {c.marginImpact >= 0 ? "+" : "−"}{formatMoney(Math.abs(c.marginImpact))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* who is pushing on you, and what goes out by email */}
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <h2 className="font-display text-[15px] font-semibold tracking-tight">
            {lang === "tr" ? "Rakip baskısı" : "Competitor pressure"}
          </h2>
          <p className="text-xs text-muted-foreground">
            {lang === "tr" ? "Kaç SKU'da senin altına iniyorlar — ve trend" : "How many SKUs they undercut you on — and the trend"}
          </p>
          <div className="mt-4 space-y-4">
            {competitorPressure.map((c) => {
              const total = c.undercutsYou + c.youUndercut;
              const pct = Math.round((c.undercutsYou / total) * 100);
              const rising = c.spark[c.spark.length - 1] > c.spark[0];
              return (
                <div key={c.competitorId} className="flex items-center gap-3">
                  <span
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[10px] font-bold text-white"
                    style={{ background: colorOf(c.competitorId) }}
                  >
                    {nameOf(c.competitorId).slice(0, 2).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-[13.5px] font-semibold">{nameOf(c.competitorId)}</p>
                      <p className="tnum text-[11px] text-muted-foreground">
                        {c.movesThisWeek} {lang === "tr" ? "hamle" : "moves"}
                      </p>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-destructive" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="tnum mt-1 text-[10.5px] text-muted-foreground">
                      {lang === "tr"
                        ? `${c.undercutsYou} SKU'da seni geçiyor · ${c.youUndercut} SKU'da sen öndesin`
                        : `undercuts you on ${c.undercutsYou} · you lead on ${c.youUndercut}`}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end">
                    <Sparkline data={c.spark} width={60} height={22} color={rising ? "var(--color-destructive)" : "var(--color-success)"} />
                    <span className={cn("text-[10.5px] font-semibold", rising ? "text-destructive" : "text-success")}>
                      {rising ? (lang === "tr" ? "artıyor" : "rising") : (lang === "tr" ? "azalıyor" : "easing")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="font-display text-[15px] font-semibold tracking-tight">
                {lang === "tr" ? "Planlı raporlar" : "Scheduled reports"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {lang === "tr" ? "Kendiliğinden e-postana düşenler" : "What lands in your inbox by itself"}
              </p>
            </div>
            <button className="inline-flex h-8 shrink-0 cursor-pointer items-center gap-1 rounded-lg border border-border bg-card px-2.5 text-[12px] font-semibold text-foreground transition-colors hover:bg-muted">
              <Plus className="h-3.5 w-3.5" />
              {lang === "tr" ? "Ekle" : "Add"}
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {scheduledReports.map((r) => (
              <div key={r.id} className="rounded-xl border border-border bg-muted/30 p-3.5">
                <div className="flex items-start gap-2.5">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-card text-primary shadow-pill">
                    {r.format === "CSV" || r.format === "XLSX" ? (
                      <FileSpreadsheet className="h-4 w-4" />
                    ) : (
                      <Mail className="h-4 w-4" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-semibold leading-tight">{t(r.name)}</p>
                    <p className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                      <CalendarClock className="h-3 w-3" />
                      {t(r.cadence)}
                    </p>
                  </div>
                  {/* The badge is the download: same file the schedule mails out. */}
                  <button
                    onClick={() =>
                      runExport(r.format === "PDF" ? "pdf" : r.format === "CSV" ? "csv" : "xlsx", {
                        ...exportTable(),
                        filename: `pricenova-${r.id}`,
                      })
                    }
                    title={lang === "tr" ? "Şimdi indir" : "Download now"}
                    className="label-mono shrink-0 cursor-pointer rounded-full bg-card px-2 py-0.5 text-muted-foreground shadow-pill transition-colors hover:bg-primary hover:text-primary-foreground print:hidden"
                  >
                    {r.format}
                  </button>
                </div>
                <p className="mt-2 truncate text-[11px] text-muted-foreground">{r.recipients}</p>
                <p className="tnum mt-0.5 text-[10.5px] text-muted-foreground">
                  {lang === "tr" ? "son gönderim" : "last sent"} {formatRelative(r.lastRun, lang)}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

/* ── Export menu ───────────────────────────────────────────────────────────────
   Three real outputs: a CSV, an .xlsx, and the print dialog for PDF. The table
   is built lazily so the file always reflects the range on screen.           */
function ExportMenu({ table, lang }: { table: () => ExportTable; lang: "tr" | "en" }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<ExportFormat | null>(null);
  const wrap = useRef<HTMLDivElement>(null);

  // Close on an outside click or Escape — a menu you can't dismiss is a trap.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function pick(format: ExportFormat) {
    setBusy(format);
    try {
      await runExport(format, table());
    } finally {
      setBusy(null);
      setOpen(false);
    }
  }

  const items: { format: ExportFormat; icon: React.ReactNode; label: string; hint: string }[] = [
    {
      format: "csv",
      icon: <FileText className="h-4 w-4 text-muted-foreground" />,
      label: "CSV",
      hint: lang === "tr" ? "Excel ve Sheets açar" : "Opens in Excel and Sheets",
    },
    {
      format: "xlsx",
      icon: <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />,
      label: "Excel (.xlsx)",
      hint: lang === "tr" ? "Biçimli tablo" : "Formatted sheet",
    },
    {
      format: "pdf",
      icon: <Printer className="h-4 w-4 text-muted-foreground" />,
      label: "PDF",
      hint: lang === "tr" ? "Yazdır penceresinden kaydet" : "Save from the print dialog",
    },
  ];

  return (
    <div ref={wrap} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-3.5 text-[13px] font-medium text-foreground shadow-pill transition-colors hover:bg-muted"
      >
        <Download className="h-4 w-4 text-muted-foreground" />
        {lang === "tr" ? "Dışa aktar" : "Export"}
        <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-11 z-30 w-60 overflow-hidden rounded-xl border border-border bg-card p-1 shadow-pop"
        >
          {items.map((it) => (
            <button
              key={it.format}
              role="menuitem"
              onClick={() => pick(it.format)}
              disabled={busy !== null}
              className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-muted disabled:opacity-60"
            >
              {it.icon}
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-semibold leading-tight">{it.label}</span>
                <span className="block text-[11px] text-muted-foreground">{it.hint}</span>
              </span>
              {busy === it.format && (
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── A headline number with its change across the window ───────────────────── */
function Metric({
  label,
  value,
  delta,
  unit = "",
  lowerIsBetter = false,
}: {
  label: string;
  value: string;
  delta: number;
  unit?: string;
  lowerIsBetter?: boolean;
}) {
  const good = lowerIsBetter ? delta < 0 : delta > 0;
  const flat = delta === 0;
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
      <p className="text-[12.5px] font-medium text-muted-foreground">{label}</p>
      <div className="mt-2 flex items-end justify-between gap-2">
        <p className="tnum text-2xl font-bold leading-none">{value}</p>
        {flat ? (
          <span className="inline-flex items-center text-[11px] font-semibold text-muted-foreground">
            <Minus className="h-3 w-3" />
          </span>
        ) : (
          <span className={cn("tnum inline-flex items-center gap-0.5 text-[11px] font-semibold", good ? "text-success" : "text-destructive")}>
            {delta > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {unit === "$" ? formatMoney(Math.abs(delta)) : `${Math.abs(Number(delta.toFixed(1)))}${unit}`}
          </span>
        )}
      </div>
    </div>
  );
}

/* ── Chart card shell ──────────────────────────────────────────────────────── */
function ChartCard({
  title,
  subtitle,
  badge,
  badgeGood,
  children,
}: {
  title: string;
  subtitle: string;
  badge: string;
  badgeGood: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-display text-[15px] font-semibold tracking-tight">{title}</h3>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <span
          className={cn(
            "tnum inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
            badgeGood ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
          )}
        >
          <TrendingUp className={cn("h-3 w-3", !badgeGood && "rotate-180")} />
          {badge}
        </span>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

"use client";

/**
 * The stop control for automatic repricing, in two sizes.
 *
 * `AutopilotSwitch` rides in the topbar so the stop is never more than one
 * click away from any screen. `AutopilotCard` is the explained version at the
 * top of the repricing rules page. Both drive the same piece of state, and
 * stopping takes effect immediately — an emergency brake you have to confirm
 * isn't an emergency brake.
 */

import Link from "next/link";
import { OctagonX, Play, ShieldCheck, Undo2 } from "lucide-react";
import { useAppState } from "@/components/app/app-state";
import { useLang } from "@/components/i18n/language-provider";
import { cn } from "@/lib/utils";

export function AutopilotSwitch() {
  const { autopilot, setAutopilot } = useAppState();
  const { lang } = useLang();

  return (
    <button
      onClick={() => setAutopilot(!autopilot)}
      title={
        autopilot
          ? lang === "tr" ? "Tüm otomatik fiyat değişikliklerini durdur" : "Stop all automatic price changes"
          : lang === "tr" ? "Otomatik fiyatlandırmayı yeniden başlat" : "Resume automatic repricing"
      }
      className={cn(
        "inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border px-2.5 text-[12.5px] font-semibold transition-colors",
        autopilot
          ? "border-border bg-card text-foreground hover:bg-destructive/10 hover:text-destructive"
          : "border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/15",
      )}
    >
      {autopilot ? (
        <>
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-success pulse-ring" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          <span className="hidden sm:inline">{lang === "tr" ? "Otomatik: açık" : "Auto: on"}</span>
          <OctagonX className="h-4 w-4" />
        </>
      ) : (
        <>
          <OctagonX className="h-4 w-4" />
          <span className="hidden sm:inline">{lang === "tr" ? "Durduruldu" : "Stopped"}</span>
        </>
      )}
    </button>
  );
}

export function AutopilotCard() {
  const { autopilot, setAutopilot, pending, applied, reverted, undoAll } = useAppState();
  const { lang } = useLang();
  const undoable = applied.filter((a) => !reverted.includes(a.id)).length;

  return (
    <div
      className={cn(
        "rounded-2xl border p-5 shadow-soft transition-colors",
        autopilot ? "border-border bg-card" : "border-destructive/30 bg-destructive/5",
      )}
    >
      <div className="flex flex-wrap items-start gap-4">
        <span
          className={cn(
            "grid h-11 w-11 shrink-0 place-items-center rounded-xl",
            autopilot ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
          )}
        >
          {autopilot ? <ShieldCheck className="h-5 w-5" /> : <OctagonX className="h-5 w-5" />}
        </span>

        <div className="min-w-0 flex-1">
          <p className="font-semibold tracking-tight">
            {autopilot
              ? lang === "tr" ? "Otomatik fiyatlandırma açık" : "Automatic repricing is on"
              : lang === "tr" ? "Tüm otomatik fiyat değişiklikleri durduruldu" : "All automatic price changes are stopped"}
          </p>
          <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-muted-foreground">
            {autopilot
              ? lang === "tr"
                ? "Kuralların çalışıyor. \"Önce sor\" modundaki kurallar fiyatına dokunmaz, önerilerini onay kuyruğuna bırakır."
                : "Your rules are running. Rules set to \"ask me first\" never touch your price — they leave their suggestions in the approval queue."
              : lang === "tr"
                ? "Hiçbir kural fiyatına dokunamaz. Rakip takibi ve uyarılar çalışmaya devam eder; yalnızca yazma işlemi kapalı."
                : "No rule can touch your price. Tracking and alerts keep running — only writing is switched off."}
          </p>

          {/* Quick counts so you know what's in flight before you decide. */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[12px]">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1">
              <span className="tnum font-semibold">{pending.length}</span>
              <span className="text-muted-foreground">{lang === "tr" ? "onay bekliyor" : "awaiting approval"}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1">
              <span className="tnum font-semibold">{undoable}</span>
              <span className="text-muted-foreground">{lang === "tr" ? "geri alınabilir değişiklik" : "undoable changes"}</span>
            </span>
          </div>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto">
          <button
            onClick={() => setAutopilot(!autopilot)}
            className={cn(
              "inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 text-[13px] font-semibold transition-opacity hover:opacity-90",
              autopilot ? "bg-destructive text-white" : "bg-primary text-primary-foreground",
            )}
          >
            {autopilot ? <OctagonX className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {autopilot
              ? lang === "tr" ? "Hepsini durdur" : "Stop everything"
              : lang === "tr" ? "Yeniden başlat" : "Resume"}
          </button>

          {undoable > 0 && (
            <button
              onClick={undoAll}
              className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 text-[13px] font-medium text-foreground transition-colors hover:bg-muted"
            >
              <Undo2 className="h-4 w-4 text-muted-foreground" />
              {lang === "tr" ? "Son değişiklikleri geri al" : "Undo recent changes"}
            </button>
          )}

          <Link
            href="/approvals"
            className="inline-flex h-10 items-center justify-center rounded-lg px-4 text-[13px] font-medium text-primary transition-colors hover:bg-primary/5"
          >
            {lang === "tr" ? "Onay kuyruğuna git" : "Open the approval queue"}
          </Link>
        </div>
      </div>
    </div>
  );
}

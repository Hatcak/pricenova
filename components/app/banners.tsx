"use client";

/**
 * Two standing notices at the top of the dashboard: one says you're in the
 * sample account (so nothing here is mistaken for your own catalog), the other
 * says automatic repricing is stopped (so a stop is never silent).
 */

import Link from "next/link";
import { FlaskConical, OctagonX } from "lucide-react";
import { useAppState } from "@/components/app/app-state";
import { useLang } from "@/components/i18n/language-provider";

export function AppBanners() {
  const { isDemo, autopilot, setAutopilot } = useAppState();
  const { lang } = useLang();

  return (
    <>
      {!autopilot && (
        <div className="flex flex-wrap items-center gap-3 border-b border-destructive/25 bg-destructive/10 px-5 py-2.5 lg:px-8">
          <OctagonX className="h-4 w-4 shrink-0 text-destructive" />
          <p className="text-[13px] font-medium text-destructive">
            {lang === "tr"
              ? "Otomatik fiyat değişiklikleri durduruldu. Takip ve uyarılar çalışmaya devam ediyor."
              : "Automatic price changes are stopped. Tracking and alerts are still running."}
          </p>
          <button
            onClick={() => setAutopilot(true)}
            className="ml-auto cursor-pointer rounded-lg border border-destructive/30 bg-card px-3 py-1 text-[12.5px] font-semibold text-destructive transition-colors hover:bg-destructive/10"
          >
            {lang === "tr" ? "Yeniden başlat" : "Resume"}
          </button>
        </div>
      )}

      {isDemo && (
        <div className="flex flex-wrap items-center gap-3 border-b border-border bg-primary/5 px-5 py-2.5 lg:px-8">
          <FlaskConical className="h-4 w-4 shrink-0 text-primary" />
          <p className="text-[13px] text-foreground/80">
            <span className="font-semibold text-foreground">
              {lang === "tr" ? "Örnek hesap." : "Sample account."}
            </span>{" "}
            {lang === "tr"
              ? "Buradaki ürünler, rakipler ve fiyatlar uydurma. Hiçbir mağazaya bağlı değilsin, hiçbir şeyi bozamazsın."
              : "The products, competitors and prices here are made up. Nothing is connected to a store, and you can't break anything."}
          </p>
          <Link
            href="/signup"
            className="ml-auto shrink-0 rounded-lg bg-primary px-3 py-1.5 text-[12.5px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            {lang === "tr" ? "Kendi hesabımı aç" : "Open my own account"}
          </Link>
        </div>
      )}
    </>
  );
}

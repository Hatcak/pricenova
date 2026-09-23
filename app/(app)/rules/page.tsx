"use client";

import Link from "next/link";
import { Plus, Play, Pause, Wand2, Handshake } from "lucide-react";
import { AutopilotCard } from "@/components/app/autopilot";
import { useAppState } from "@/components/app/app-state";
import { useLang } from "@/components/i18n/language-provider";
import { cn, formatRelative } from "@/lib/utils";
import { repriceRules } from "@/lib/demo/data";

export default function RulesPage() {
  const { t, lang } = useLang();
  const { autopilot, rulePaused, toggleRulePause, ruleModes, setRuleMode, pending } = useAppState();

  const activeCount = repriceRules.filter((r) => !rulePaused[r.id]).length;
  const askFirstCount = repriceRules.filter((r) => ruleModes[r.id] === "approval").length;

  return (
    <div className="mx-auto max-w-[900px] animate-fade-in space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">{lang === "tr" ? "Yeniden fiyatlandırma kuralları" : "Repricing rules"}</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {lang === "tr" ? "Fiyatını ayarlayan mantık — taban ve tavan sınırlarıyla." : "The logic that adjusts your price — with floor and ceiling."}
          </p>
        </div>
        <button className="ml-auto inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg bg-primary px-3.5 text-[13px] font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90">
          <Plus className="h-4 w-4" />
          {lang === "tr" ? "Kural ekle" : "Add rule"}
        </button>
      </div>

      {/* The stop, plus what's currently in flight. */}
      <AutopilotCard />

      {/* summary */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
          <Wand2 className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-semibold">
            {activeCount} {lang === "tr" ? "aktif kural" : "active rules"} · {askFirstCount} {lang === "tr" ? "önce sana soruyor" : "ask you first"}
          </p>
          <p className="text-xs text-muted-foreground">
            {lang === "tr"
              ? `Bugün 3 ürün otomatik değişti, ${pending.length} öneri onayını bekliyor`
              : `3 products changed automatically today, ${pending.length} suggestions await you`}
          </p>
        </div>
        {pending.length > 0 && (
          <Link
            href="/approvals"
            className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 text-[13px] font-semibold text-primary transition-colors hover:bg-primary/5"
          >
            {lang === "tr" ? "Önerileri incele" : "Review suggestions"}
          </Link>
        )}
      </div>

      {/* rules list */}
      <div className="space-y-3">
        {repriceRules.map((rule) => {
          const isPaused = rulePaused[rule.id];
          const mode = ruleModes[rule.id];
          const live = !isPaused && autopilot;
          return (
            <div
              key={rule.id}
              className={cn(
                "rounded-2xl border border-border bg-card p-5 shadow-soft transition-opacity",
                !autopilot && "opacity-60",
              )}
            >
              <div className="flex flex-wrap items-center gap-4">
                <span className={cn(
                  "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
                  live ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
                )}>
                  {live ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
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
                  onClick={() => toggleRulePause(rule.id)}
                  className={cn(
                    "inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg px-3.5 text-[13px] font-medium transition-colors",
                    isPaused
                      ? "bg-primary text-primary-foreground hover:opacity-90"
                      : "border border-border bg-card text-foreground hover:bg-muted",
                  )}
                >
                  {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                  {isPaused ? (lang === "tr" ? "Etkinleştir" : "Activate") : (lang === "tr" ? "Duraklat" : "Pause")}
                </button>
              </div>

              {/* Who gets the last word on this rule. */}
              <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-4">
                <p className="text-[12.5px] font-medium text-muted-foreground">
                  {lang === "tr" ? "Bu kural fiyatı değiştirdiğinde:" : "When this rule wants to move a price:"}
                </p>
                <div className="flex rounded-lg border border-border bg-muted/40 p-0.5">
                  <ModeTab
                    active={mode === "approval"}
                    onClick={() => setRuleMode(rule.id, "approval")}
                    icon={<Handshake className="h-3.5 w-3.5" />}
                  >
                    {lang === "tr" ? "Önce bana sor" : "Ask me first"}
                  </ModeTab>
                  <ModeTab
                    active={mode === "auto"}
                    onClick={() => setRuleMode(rule.id, "auto")}
                    icon={<Wand2 className="h-3.5 w-3.5" />}
                  >
                    {lang === "tr" ? "Otomatik uygula" : "Apply automatically"}
                  </ModeTab>
                </div>
                <p className="w-full text-[12px] leading-relaxed text-muted-foreground sm:w-auto sm:flex-1">
                  {mode === "approval"
                    ? lang === "tr"
                      ? "Öneri onay kuyruğuna düşer, sen onaylamadan fiyat değişmez."
                      : "The suggestion lands in your approval queue; nothing changes until you say yes."
                    : lang === "tr"
                      ? "Fiyat hemen güncellenir — önceki fiyat saklanır, tek tıkla geri alınabilir."
                      : "The price updates right away — the old price is kept, one click restores it."}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ModeTab({
  active, onClick, icon, children,
}: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex cursor-pointer items-center gap-1.5 rounded-[7px] px-2.5 py-1.5 text-[12.5px] font-semibold transition-colors",
        active ? "bg-card text-foreground shadow-pill" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {icon}
      {children}
    </button>
  );
}

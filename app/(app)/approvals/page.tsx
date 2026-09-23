"use client";

/**
 * The approval queue: every price change a rule wants to make, and every change
 * it already made. Nothing on the left side has touched the store yet; nothing
 * on the right side is permanent.
 */

import { useState } from "react";
import { ArrowRight, Check, CheckCheck, Inbox, Undo2, X } from "lucide-react";
import { useAppState } from "@/components/app/app-state";
import { useLang } from "@/components/i18n/language-provider";
import { cn, formatPrice, formatRelative } from "@/lib/utils";
import type { RepriceEvent } from "@/lib/demo/data";

type Tab = "pending" | "applied";

export default function ApprovalsPage() {
  const { t, lang } = useLang();
  const { pending, approve, reject, approveAll, rejectedCount, applied, reverted, undo, undoAll } = useAppState();
  const [tab, setTab] = useState<Tab>("pending");

  const undoable = applied.filter((a) => !reverted.includes(a.id));

  /** Margin after the change — the number that decides whether you say yes. */
  const marginOf = (e: RepriceEvent, price: number) => Math.round(((price - e.cost) / price) * 100);

  return (
    <div className="mx-auto max-w-[1000px] animate-fade-in space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            {lang === "tr" ? "Onay kuyruğu" : "Approval queue"}
          </h1>
          <p className="mt-0.5 max-w-2xl text-sm text-muted-foreground">
            {lang === "tr"
              ? "\"Önce bana sor\" modundaki kuralların önerileri burada bekler. Sen onaylamadan hiçbir fiyat değişmez."
              : "Suggestions from rules set to \"ask me first\" wait here. No price changes until you approve it."}
          </p>
        </div>
      </div>

      {/* tabs */}
      <div className="flex items-center gap-1.5">
        <TabButton active={tab === "pending"} onClick={() => setTab("pending")}>
          {lang === "tr" ? "Onay bekleyen" : "Awaiting approval"}
          <Count n={pending.length} active={tab === "pending"} />
        </TabButton>
        <TabButton active={tab === "applied"} onClick={() => setTab("applied")}>
          {lang === "tr" ? "Uygulananlar" : "Already applied"}
          <Count n={undoable.length} active={tab === "applied"} />
        </TabButton>
      </div>

      {tab === "pending" ? (
        <section className="space-y-3">
          {pending.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft">
              <p className="text-[13px] text-muted-foreground">
                {lang === "tr"
                  ? `${pending.length} öneri bekliyor${rejectedCount ? ` · ${rejectedCount} tanesini reddettin` : ""}`
                  : `${pending.length} waiting${rejectedCount ? ` · you dismissed ${rejectedCount}` : ""}`}
              </p>
              <button
                onClick={approveAll}
                className="ml-auto inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg bg-primary px-3.5 text-[13px] font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
              >
                <CheckCheck className="h-4 w-4" />
                {lang === "tr" ? "Tümünü onayla" : "Approve all"}
              </button>
            </div>
          )}

          {pending.map((e) => {
            const newMargin = marginOf(e, e.to);
            const oldMargin = marginOf(e, e.from);
            const pct = (((e.to - e.from) / e.from) * 100).toFixed(1);
            return (
              <article key={e.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <div className="flex flex-wrap items-start gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold leading-tight">{e.product}</p>
                    <p className="tnum text-[11.5px] text-muted-foreground">
                      {e.sku} · {t(e.rule)} · {formatRelative(e.at)}
                    </p>
                    <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-foreground/80">{t(e.reason)}</p>
                  </div>

                  {/* the actual move */}
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3">
                    <div className="text-right">
                      <p className="tnum text-[15px] font-semibold text-muted-foreground line-through">{formatPrice(e.from)}</p>
                      <p className="text-[10.5px] text-muted-foreground">{lang === "tr" ? `marj %${oldMargin}` : `${oldMargin}% margin`}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="text-right">
                      <p className="tnum text-[17px] font-bold text-primary">{formatPrice(e.to)}</p>
                      <p className={cn("text-[10.5px] font-medium", newMargin < 35 ? "text-destructive" : "text-muted-foreground")}>
                        {lang === "tr" ? `marj %${newMargin}` : `${newMargin}% margin`} · {pct}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
                  <button
                    onClick={() => approve(e.id)}
                    className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg bg-primary px-3.5 text-[13px] font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
                  >
                    <Check className="h-4 w-4" />
                    {lang === "tr" ? "Onayla ve uygula" : "Approve and apply"}
                  </button>
                  <button
                    onClick={() => reject(e.id)}
                    className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 text-[13px] font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                    {lang === "tr" ? "Reddet" : "Dismiss"}
                  </button>
                </div>
              </article>
            );
          })}

          {pending.length === 0 && (
            <Empty
              title={lang === "tr" ? "Bekleyen öneri yok" : "Nothing waiting"}
              body={
                lang === "tr"
                  ? "Bir rakip fiyat değiştirdiğinde ve bir kuralın \"önce bana sor\" modundaysa, öneri burada belirir."
                  : "When a rival moves and one of your rules is set to \"ask me first\", the suggestion shows up here."
              }
            />
          )}
        </section>
      ) : (
        <section className="space-y-3">
          {undoable.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft">
              <p className="text-[13px] text-muted-foreground">
                {lang === "tr"
                  ? "Her değişikliğin önceki fiyatı saklanır — tek tek ya da toplu geri alabilirsin."
                  : "Every change keeps its previous price — put them back one by one or all at once."}
              </p>
              <button
                onClick={undoAll}
                className="ml-auto inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 text-[13px] font-semibold text-foreground transition-colors hover:bg-muted"
              >
                <Undo2 className="h-4 w-4 text-muted-foreground" />
                {lang === "tr" ? "Tümünü geri al" : "Undo all"}
              </button>
            </div>
          )}

          {applied.map((e) => {
            const isReverted = reverted.includes(e.id);
            return (
              <article
                key={e.id}
                className={cn(
                  "flex flex-wrap items-center gap-4 rounded-2xl border p-5 shadow-soft transition-colors",
                  isReverted ? "border-border bg-muted/40" : "border-border bg-card",
                )}
              >
                <div className="min-w-0 flex-1">
                  <p className={cn("font-semibold leading-tight", isReverted && "text-muted-foreground")}>{e.product}</p>
                  <p className="tnum text-[11.5px] text-muted-foreground">
                    {e.sku} · {t(e.rule)} · {formatRelative(e.at)}
                  </p>
                  <p className="mt-1.5 max-w-xl text-[12.5px] leading-relaxed text-muted-foreground">{t(e.reason)}</p>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="tnum text-[13px] text-muted-foreground line-through">{formatPrice(e.from)}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className={cn("tnum text-[15px] font-bold", isReverted ? "text-muted-foreground line-through" : "text-primary")}>
                    {formatPrice(e.to)}
                  </span>
                </div>

                {isReverted ? (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-success/10 px-3 py-2 text-[12.5px] font-semibold text-success">
                    <Undo2 className="h-3.5 w-3.5" />
                    {lang === "tr" ? `${formatPrice(e.from)} geri yüklendi` : `restored to ${formatPrice(e.from)}`}
                  </span>
                ) : (
                  <button
                    onClick={() => undo(e.id)}
                    className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 text-[13px] font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    <Undo2 className="h-4 w-4 text-muted-foreground" />
                    {lang === "tr" ? "Eski fiyata dön" : "Restore old price"}
                  </button>
                )}
              </article>
            );
          })}

          {applied.length === 0 && (
            <Empty
              title={lang === "tr" ? "Henüz otomatik değişiklik yok" : "No automatic changes yet"}
              body={lang === "tr" ? "Bir kural fiyatını değiştirdiğinde kaydı burada durur." : "When a rule changes a price, the record sits here."}
            />
          )}
        </section>
      )}
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg px-3.5 text-[13px] font-medium transition-colors",
        active ? "bg-primary text-primary-foreground" : "border border-border bg-card text-muted-foreground hover:bg-muted",
      )}
    >
      {children}
    </button>
  );
}

function Count({ n, active }: { n: number; active: boolean }) {
  return (
    <span
      className={cn(
        "tnum rounded-full px-1.5 py-0.5 text-[11px] font-bold",
        active ? "bg-white/20 text-primary-foreground" : "bg-muted text-foreground",
      )}
    >
      {n}
    </span>
  );
}

function Empty({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
      <span className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-muted text-muted-foreground">
        <Inbox className="h-5 w-5" />
      </span>
      <p className="mt-3 font-semibold">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-[13px] text-muted-foreground">{body}</p>
    </div>
  );
}

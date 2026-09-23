"use client";

/**
 * Competitor-match review. Every comparison, alert and repricing rule in the
 * app is built on top of these pairs, so a wrong one is worse than a missing
 * one: it quietly drags your price toward a product you don't even sell. Low
 * confidence therefore never auto-applies — it waits here for a human.
 */

import { AlertTriangle, Check, ExternalLink, Link2, ShieldCheck, X } from "lucide-react";
import { useAppState } from "@/components/app/app-state";
import { useLang } from "@/components/i18n/language-provider";
import { cn, formatPrice } from "@/lib/utils";
import { competitors, matchLadder, productMatches, type MatchMethod } from "@/lib/demo/data";

const METHOD_LABEL: Record<MatchMethod, { tr: string; en: string }> = {
  gtin: { tr: "Barkod", en: "Barcode" },
  model: { tr: "Model kodu", en: "Model code" },
  title: { tr: "Başlık benzerliği", en: "Title similarity" },
  manual: { tr: "Elle eklendi", en: "Added by hand" },
};

export default function MatchesPage() {
  const { t, lang } = useLang();
  const { matchStatus, setMatch } = useAppState();

  const rows = productMatches.map((m) => ({ ...m, status: matchStatus[m.id] ?? m.status }));
  const pending = rows.filter((m) => m.status === "pending");
  const confirmed = rows.filter((m) => m.status === "confirmed");
  const rejected = rows.filter((m) => m.status === "rejected");

  const nameOf = (id: string) => competitors.find((c) => c.id === id)?.name ?? id;
  const colorOf = (id: string) => competitors.find((c) => c.id === id)?.color ?? "var(--color-muted)";

  return (
    <div className="mx-auto max-w-[1000px] animate-fade-in space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">
          {lang === "tr" ? "Rakip eşleşmeleri" : "Competitor matches"}
        </h1>
        <p className="mt-0.5 max-w-2xl text-sm text-muted-foreground">
          {lang === "tr"
            ? "Senin ürününün, rakibin sitesindeki hangi ürüne denk geldiği. Tüm fiyat karşılaştırman bunun üzerine kurulu — o yüzden son söz sende."
            : "Which listing on a rival's site is the same product as yours. Every comparison rests on this, so you get the final say."}
        </p>
      </div>

      {/* Why a match can be trusted — the ladder we walk, in order. */}
      <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">
        <p className="font-semibold tracking-tight">
          {lang === "tr" ? "Eşleştirme nasıl yapılıyor?" : "How matching works"}
        </p>
        <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-muted-foreground">
          {lang === "tr"
            ? "Sırayla dört yöntem denenir; ilk üçü başarısız olursa ürün eşleşmeden kalır. İlk iki yöntem kesin sayılır ve doğrudan uygulanır. Üçüncüsü tahmine dayanır, bu yüzden hiçbir zaman kendiliğinden uygulanmaz — onayına düşer."
            : "We try four methods in order; if the first three fail the product stays unmatched. The first two are treated as certain and applied directly. The third is a guess, so it never applies on its own — it comes to you."}
        </p>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2">
          {matchLadder.map((step, i) => (
            <li key={step.method} className="flex gap-3 rounded-xl border border-border bg-muted/30 p-3.5">
              <span className="tnum grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-card text-[12px] font-bold text-primary shadow-pill">
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className="text-[13.5px] font-semibold leading-tight">{t(step.title)}</p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">{t(step.body)}</p>
                <span
                  className={cn(
                    "mt-2 inline-block rounded-full px-2 py-0.5 text-[10.5px] font-semibold",
                    step.method === "title" ? "bg-warning/15 text-warning" : "bg-success/10 text-success",
                  )}
                >
                  {t(step.certainty)}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Needs review */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <h2 className="font-semibold tracking-tight">
            {lang === "tr" ? "İncelemeni bekleyen" : "Waiting for your review"}
          </h2>
          <span className="tnum rounded-full bg-warning/15 px-2 py-0.5 text-[11px] font-bold text-warning">{pending.length}</span>
        </div>

        {pending.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center text-[13px] text-muted-foreground">
            {lang === "tr" ? "Hepsini inceledin — bekleyen eşleşme yok." : "You've reviewed them all — nothing pending."}
          </p>
        )}

        {pending.map((m) => (
          <article key={m.id} className="rounded-2xl border border-warning/30 bg-card p-5 shadow-soft">
            <div className="flex flex-wrap items-start gap-4">
              <div className="min-w-0 flex-1">
                {/* your side */}
                <p className="label-mono text-muted-foreground">{lang === "tr" ? "Senin ürünün" : "Your product"}</p>
                <p className="font-semibold leading-tight">{m.product}</p>
                <p className="tnum text-[11.5px] text-muted-foreground">{m.sku}</p>

                {/* their side */}
                <div className="mt-3 flex items-start gap-2 border-l-2 border-border pl-3">
                  <Link2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="label-mono flex items-center gap-1.5 text-muted-foreground">
                      <span className="h-2 w-2 rounded-full" style={{ background: colorOf(m.competitorId) }} />
                      {nameOf(m.competitorId)}
                    </p>
                    <p className="text-[13.5px] font-medium leading-tight">{m.rivalTitle}</p>
                    <p className="inline-flex items-center gap-1 text-[11.5px] text-muted-foreground">
                      {m.rivalUrl} <ExternalLink className="h-3 w-3" />
                      <span className="tnum ml-1 font-semibold text-foreground">{formatPrice(m.rivalPrice)}</span>
                    </p>
                  </div>
                </div>

                <p className="mt-3 max-w-xl rounded-lg bg-muted/50 px-3 py-2 text-[12.5px] leading-relaxed text-foreground/80">
                  {t(m.evidence)}
                </p>
              </div>

              <ConfidenceDial value={m.confidence} method={m.method} lang={lang} />
            </div>

            <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
              <button
                onClick={() => setMatch(m.id, "confirmed")}
                className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg bg-primary px-3.5 text-[13px] font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
              >
                <Check className="h-4 w-4" />
                {lang === "tr" ? "Aynı ürün, onayla" : "Same product, confirm"}
              </button>
              <button
                onClick={() => setMatch(m.id, "rejected")}
                className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 text-[13px] font-medium text-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="h-4 w-4" />
                {lang === "tr" ? "Yanlış eşleşme, çıkar" : "Wrong match, remove"}
              </button>
            </div>
          </article>
        ))}
      </section>

      {/* Confirmed */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-success" />
          <h2 className="font-semibold tracking-tight">{lang === "tr" ? "Onaylı eşleşmeler" : "Confirmed matches"}</h2>
          <span className="tnum rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-bold text-success">{confirmed.length}</span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          {confirmed.map((m, i) => (
            <div key={m.id} className={cn("flex flex-wrap items-center gap-3 p-4", i > 0 && "border-t border-border/60")}>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-semibold leading-tight">{m.product}</p>
                <p className="truncate text-[11.5px] text-muted-foreground">
                  <span className="h-2 w-2" style={{ color: colorOf(m.competitorId) }} />
                  {nameOf(m.competitorId)} · {m.rivalTitle}
                </p>
              </div>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10.5px] font-semibold text-muted-foreground">
                {METHOD_LABEL[m.method][lang]}
              </span>
              <span className="tnum text-[12px] font-bold text-success">%{m.confidence}</span>
              <button
                onClick={() => setMatch(m.id, "rejected")}
                className="cursor-pointer rounded-lg border border-border px-2.5 py-1 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                {lang === "tr" ? "Çıkar" : "Remove"}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Removed */}
      {rejected.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-semibold tracking-tight text-muted-foreground">
            {lang === "tr" ? "Çıkardıkların" : "Removed by you"}
          </h2>
          <div className="overflow-hidden rounded-2xl border border-dashed border-border bg-muted/30">
            {rejected.map((m, i) => (
              <div key={m.id} className={cn("flex flex-wrap items-center gap-3 p-4", i > 0 && "border-t border-border/60")}>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-medium leading-tight text-muted-foreground line-through">{m.rivalTitle}</p>
                  <p className="truncate text-[11.5px] text-muted-foreground">
                    {nameOf(m.competitorId)} · {m.product}
                  </p>
                </div>
                <button
                  onClick={() => setMatch(m.id, "confirmed")}
                  className="cursor-pointer rounded-lg border border-border bg-card px-2.5 py-1 text-[12px] font-medium text-foreground transition-colors hover:bg-muted"
                >
                  {lang === "tr" ? "Geri ekle" : "Put back"}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

/** Confidence as a ring, because a bare "61%" doesn't tell you to be careful. */
function ConfidenceDial({ value, method, lang }: { value: number; method: MatchMethod; lang: "tr" | "en" }) {
  const tone = value >= 90 ? "var(--color-success)" : value >= 70 ? "var(--color-warning)" : "var(--color-destructive)";
  const r = 26;
  const c = 2 * Math.PI * r;

  return (
    <div className="flex shrink-0 flex-col items-center gap-1.5 rounded-xl border border-border bg-muted/30 px-4 py-3">
      <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" stroke="var(--color-border)" strokeWidth="6" />
        <circle
          cx="32" cy="32" r={r} fill="none" stroke={tone} strokeWidth="6" strokeLinecap="round"
          strokeDasharray={`${(value / 100) * c} ${c}`}
        />
      </svg>
      <p className="tnum -mt-[42px] text-[15px] font-bold" style={{ color: tone }}>%{value}</p>
      <p className="mt-[22px] text-center text-[10.5px] leading-tight text-muted-foreground">
        {lang === "tr" ? "güven" : "confidence"}
        <br />
        <span className="font-semibold text-foreground">{METHOD_LABEL[method][lang]}</span>
      </p>
    </div>
  );
}

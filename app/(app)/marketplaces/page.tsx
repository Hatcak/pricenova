"use client";

/**
 * Marketplaces — where your catalog lives and what PriceNova is allowed to do
 * there. The distinction that matters on this screen is write-back: on your own
 * store a rule can change a price, on a marketplace it can usually only watch.
 * Saying that plainly here stops people expecting repricing where it can't run.
 */

import { useState } from "react";
import {
  ArrowRight,
  Check,
  CircleDashed,
  Clock,
  Eye,
  PencilLine,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import { BrandGlyph } from "@/components/marketing/marks";
import { useLang } from "@/components/i18n/language-provider";
import { cn, formatRelative } from "@/lib/utils";
import { marketplaces, type Marketplace } from "@/lib/demo/data";

export default function MarketplacesPage() {
  const { t, lang } = useLang();
  /** Which card is mid-sync — purely local feedback, nothing leaves the page. */
  const [syncing, setSyncing] = useState<string | null>(null);

  const connected = marketplaces.filter((m) => m.status === "connected");
  const totalProducts = marketplaces.reduce((s, m) => s + m.products, 0);
  const writable = marketplaces.filter((m) => m.status === "connected" && m.writeBack).length;

  function sync(key: string) {
    setSyncing(key);
    window.setTimeout(() => setSyncing(null), 1400);
  }

  return (
    <div className="mx-auto max-w-[1100px] animate-fade-in space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">
          {lang === "tr" ? "Pazaryerleri" : "Marketplaces"}
        </h1>
        <p className="mt-0.5 max-w-2xl text-sm text-muted-foreground">
          {lang === "tr"
            ? "Kataloğunun bulunduğu yerler ve PriceNova'nın orada ne yapabildiği."
            : "Where your catalog lives, and what PriceNova is allowed to do there."}
        </p>
      </div>

      {/* summary strip */}
      <div className="grid grid-cols-3 gap-4">
        <Summary
          label={lang === "tr" ? "Bağlı kanal" : "Connected"}
          value={`${connected.length} / ${marketplaces.length}`}
        />
        <Summary
          label={lang === "tr" ? "Çekilen ürün" : "Products pulled"}
          value={String(totalProducts)}
        />
        <Summary
          label={lang === "tr" ? "Fiyat yazılabilen" : "Price write-back"}
          value={String(writable)}
          hint={lang === "tr" ? "kanal" : "channels"}
        />
      </div>

      {/* the channels */}
      <div className="grid gap-4 sm:grid-cols-2">
        {marketplaces.map((m) => (
          <ChannelCard
            key={m.key}
            m={m}
            lang={lang}
            t={t}
            syncing={syncing === m.key}
            onSync={() => sync(m.key)}
          />
        ))}
      </div>

      {/* the one thing people get wrong */}
      <section className="rounded-2xl border border-border bg-muted/40 p-5">
        <div className="flex flex-wrap items-start gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-card text-primary shadow-pill">
            <PencilLine className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold tracking-tight">
              {lang === "tr" ? "\"İzleme\" ile \"fiyat yazma\" aynı şey değil" : "Watching and writing are not the same thing"}
            </p>
            <p className="mt-1 max-w-2xl text-[13.5px] leading-relaxed text-muted-foreground">
              {lang === "tr"
                ? "Kendi mağazanda (Shopify, WooCommerce) kuralların fiyatı gerçekten değiştirebilir. Amazon, Trendyol, Hepsiburada ve n11 gibi pazaryerlerinde ise şu an yalnızca fiyatları okuyabiliyoruz — orada bir kural tetiklendiğinde fiyatı değiştirmez, sana uyarı gönderir ve öneriyi onay kuyruğuna bırakır."
                : "On your own store (Shopify, WooCommerce) your rules really can change a price. On marketplaces like Amazon, Trendyol, Hepsiburada and n11 we can currently only read prices — a rule that fires there won't change anything, it alerts you and leaves the suggestion in your approval queue."}
            </p>
            <Link
              href="/approvals"
              className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary hover:underline"
            >
              {lang === "tr" ? "Onay kuyruğuna git" : "Open the approval queue"}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── One channel ───────────────────────────────────────────────────────────── */
function ChannelCard({
  m,
  lang,
  t,
  syncing,
  onSync,
}: {
  m: Marketplace;
  lang: "tr" | "en";
  t: (v: { tr: string; en: string }) => string;
  syncing: boolean;
  onSync: () => void;
}) {
  const isConnected = m.status === "connected";
  const isSoon = m.status === "soon";

  return (
    <article
      className={cn(
        "flex flex-col rounded-2xl border bg-card p-5 shadow-soft transition-colors",
        isConnected ? "border-success/30" : "border-border",
        isSoon && "opacity-75",
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white"
          style={{ background: m.color }}
        >
          <BrandGlyph name={m.name} className="h-[22px] w-[22px]" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display font-semibold tracking-tight">{m.name}</p>
          <p className="text-[11.5px] text-muted-foreground">{t(m.region)}</p>
        </div>
        <StatusPill status={m.status} lang={lang} />
      </div>

      <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">{t(m.capability)}</p>

      {/* what it can do, said as a pair of chips */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        <Capability on icon={<Eye className="h-3 w-3" />}>
          {lang === "tr" ? "Fiyat okuma" : "Read prices"}
        </Capability>
        <Capability on={m.writeBack} icon={<PencilLine className="h-3 w-3" />}>
          {lang === "tr" ? "Fiyat yazma" : "Write prices"}
        </Capability>
      </div>

      {/* numbers, only where there are any */}
      {isConnected || m.products > 0 ? (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-muted/30 p-2.5 text-center">
            <p className="tnum text-lg font-bold leading-none">{m.products}</p>
            <p className="mt-1 text-[10.5px] text-muted-foreground">{lang === "tr" ? "ürün" : "products"}</p>
          </div>
          <div className="rounded-xl border border-border bg-muted/30 p-2.5 text-center">
            <p className="tnum text-lg font-bold leading-none text-success">{m.winRate}%</p>
            <p className="mt-1 text-[10.5px] text-muted-foreground">{lang === "tr" ? "en ucuz sensin" : "you're cheapest"}</p>
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-border p-3 text-center">
          <p className="text-[12px] text-muted-foreground">
            {isSoon
              ? lang === "tr"
                ? "Rakip fiyatları okunuyor. Kendi ilanlarını buradan içe aktarma henüz hazır değil — ürünlerini şimdilik elle ekleyebilirsin."
                : "Rival prices are read already. Importing your own listings from here isn't ready yet — add those products by hand for now."
              : lang === "tr" ? "Henüz bağlanmadı — bağlayınca ürünlerin buraya düşer." : "Not connected yet — your products land here once it is."}
          </p>
        </div>
      )}

      {/* footer: last sync + the action */}
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
        {m.lastSync && (
          <p className="tnum inline-flex items-center gap-1 text-[11px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            {lang === "tr" ? "son senkron" : "last sync"} {formatRelative(m.lastSync, lang)}
          </p>
        )}

        {isSoon ? (
          <button
            disabled
            className="ml-auto inline-flex h-9 cursor-not-allowed items-center gap-1.5 rounded-lg border border-border bg-muted px-3.5 text-[13px] font-medium text-muted-foreground"
          >
            {lang === "tr" ? "Yakında" : "Coming soon"}
          </button>
        ) : isConnected ? (
          <button
            onClick={onSync}
            disabled={syncing}
            className="ml-auto inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 text-[13px] font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-wait"
          >
            <RefreshCw className={cn("h-3.5 w-3.5 text-muted-foreground", syncing && "animate-spin")} />
            {syncing
              ? lang === "tr" ? "Senkronlanıyor…" : "Syncing…"
              : lang === "tr" ? "Şimdi senkronla" : "Sync now"}
          </button>
        ) : (
          <Link
            href="/settings"
            className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-[13px] font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            {lang === "tr" ? "Bağla" : "Connect"}
          </Link>
        )}
      </div>
    </article>
  );
}

function StatusPill({ status, lang }: { status: Marketplace["status"]; lang: "tr" | "en" }) {
  if (status === "connected") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success">
        <Check className="h-3 w-3" />
        {lang === "tr" ? "Bağlı" : "Connected"}
      </span>
    );
  }
  if (status === "soon") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
        {lang === "tr" ? "Yakında" : "Soon"}
      </span>
    );
  }
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
      <CircleDashed className="h-3 w-3" />
      {lang === "tr" ? "Hazır" : "Available"}
    </span>
  );
}

function Capability({ on, icon, children }: { on?: boolean; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
        on ? "bg-success/10 text-success" : "bg-muted text-muted-foreground line-through",
      )}
    >
      {icon}
      {children}
    </span>
  );
}

function Summary({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
      <p className="text-[12.5px] font-medium text-muted-foreground">{label}</p>
      <p className="tnum mt-2 text-2xl font-bold leading-none">
        {value}
        {hint && <span className="ml-1.5 text-[12px] font-medium text-muted-foreground">{hint}</span>}
      </p>
    </div>
  );
}

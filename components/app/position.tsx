import { cn } from "@/lib/utils";
import type { Position } from "@/lib/demo/data";
import type { Lang } from "@/lib/i18n/config";

const LABEL: Record<Position, { tr: string; en: string; cls: string; dot: string }> = {
  cheapest: { tr: "En ucuz", en: "Cheapest", cls: "text-success bg-success/10", dot: "bg-success" },
  mid: { tr: "Orta", en: "Mid", cls: "text-muted-foreground bg-muted", dot: "bg-mid" },
  expensive: { tr: "En pahalı", en: "Most expensive", cls: "text-destructive bg-destructive/10", dot: "bg-destructive" },
};

/** A small colored tag for a product's price position among all sellers. */
export function PositionPill({
  position,
  lang,
  withDot = true,
  className,
}: {
  position: Position;
  lang: Lang;
  withDot?: boolean;
  className?: string;
}) {
  const p = LABEL[position];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap", p.cls, className)}>
      {withDot && <span className={cn("h-1.5 w-1.5 rounded-full", p.dot)} />}
      {lang === "tr" ? p.tr : p.en}
    </span>
  );
}

/** The teal/green/red color for a delta (− cheaper = good for them, costs you). */
export function deltaTone(delta: number | null): string {
  if (delta === null) return "text-muted-foreground";
  if (delta > 0) return "text-success";   // rival is pricier → you win
  if (delta < 0) return "text-destructive"; // rival is cheaper → you lose
  return "text-muted-foreground";
}

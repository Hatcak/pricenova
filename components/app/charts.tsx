"use client";

import { useId } from "react";

/* ── Tiny price sparkline (bespoke inline SVG) ─────────────────────────────── */
export function Sparkline({
  data,
  color = "var(--color-primary)",
  width = 84,
  height = 26,
  className,
}: {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
  className?: string;
}) {
  const pad = 3;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const span = max - min || 1;
  const step = (width - pad * 2) / (data.length - 1);
  const pts = data.map((v, i) => {
    const x = pad + i * step;
    const y = pad + (1 - (v - min) / span) * (height - pad * 2);
    return [x, y] as const;
  });
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} className={className} aria-hidden>
      <path d={line} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="1.8" fill={color} />
    </svg>
  );
}

/* ── Mini line chart with a soft area fill ─────────────────────────────────── */
export function MiniLineChart({
  data,
  color = "var(--color-primary)",
  height = 56,
  className,
}: {
  data: number[];
  color?: string;
  height?: number;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  const w = 200;
  const h = height;
  const pad = 4;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const span = max - min || 1;
  const step = (w - pad * 2) / (data.length - 1);
  const pts = data.map((v, i) => {
    const x = pad + i * step;
    const y = pad + (1 - (v - min) / span) * (h - pad * 2);
    return [x, y] as const;
  });
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const area = `${line} L${pts[pts.length - 1][0].toFixed(1)} ${h - pad} L${pts[0][0].toFixed(1)} ${h - pad} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} preserveAspectRatio="none" style={{ width: "100%", height }}>
      <defs>
        <linearGradient id={`fill-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#fill-${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="2.6" fill={color} />
    </svg>
  );
}

/* ── Larger area chart (price index over time) ─────────────────────────────── */
export function AreaChart({
  data,
  labels,
  color = "var(--color-primary)",
  height = 150,
  baseline,
}: {
  data: number[];
  labels?: string[];
  color?: string;
  height?: number;
  /** Optional reference line value (e.g. market index = 100). */
  baseline?: number;
}) {
  const id = useId().replace(/:/g, "");
  const w = 520;
  const h = height;
  const padX = 6;
  const padTop = 10;
  const padBottom = labels ? 22 : 8;
  const all = baseline !== undefined ? [...data, baseline] : data;
  const max = Math.max(...all);
  const min = Math.min(...all) * 0.999;
  const span = max - min || 1;
  const step = (w - padX * 2) / (data.length - 1);
  const yOf = (v: number) => padTop + (1 - (v - min) / span) * (h - padTop - padBottom);
  const pts = data.map((v, i) => [padX + i * step, yOf(v)] as const);
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const baseY = h - padBottom;
  const area = `${line} L${pts[pts.length - 1][0].toFixed(1)} ${baseY} L${pts[0][0].toFixed(1)} ${baseY} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`afill-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.20" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((g) => (
        <line key={g} x1={padX} x2={w - padX} y1={padTop + g * (h - padTop - padBottom)} y2={padTop + g * (h - padTop - padBottom)} stroke="var(--color-border)" strokeWidth="1" />
      ))}
      {baseline !== undefined && (
        <line x1={padX} x2={w - padX} y1={yOf(baseline)} y2={yOf(baseline)} stroke="var(--color-mid)" strokeWidth="1.2" strokeDasharray="4 4" />
      )}
      <path d={area} fill={`url(#afill-${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === pts.length - 1 ? 3.2 : 2.2} fill="var(--color-card)" stroke={color} strokeWidth="1.6" />
      ))}
      {labels &&
        labels.map((lab, i) => (
          <text key={lab} x={padX + i * step} y={h - 6} textAnchor="middle" fontSize="9.5" fill="var(--color-muted-foreground)" fontFamily="var(--font-mono)">
            {lab}
          </text>
        ))}
    </svg>
  );
}

/* ── Multi-line price-history chart — one line per competitor across time ───── */
export function MultiLineChart({
  series,
  height = 180,
}: {
  series: { id: string; color: string; data: number[]; dashed?: boolean }[];
  height?: number;
}) {
  const w = 520;
  const h = height;
  const padX = 8;
  const padTop = 12;
  const padBottom = 12;
  const all = series.flatMap((s) => s.data);
  const max = Math.max(...all);
  const min = Math.min(...all);
  const span = max - min || 1;
  const len = Math.max(...series.map((s) => s.data.length));
  const step = (w - padX * 2) / (len - 1);
  const yOf = (v: number) => padTop + (1 - (v - min) / span) * (h - padTop - padBottom);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height }} preserveAspectRatio="none">
      {[0, 0.25, 0.5, 0.75, 1].map((g) => (
        <line key={g} x1={padX} x2={w - padX} y1={padTop + g * (h - padTop - padBottom)} y2={padTop + g * (h - padTop - padBottom)} stroke="var(--color-border)" strokeWidth="1" />
      ))}
      {series.map((s) => {
        const pts = s.data.map((v, i) => [padX + i * step, yOf(v)] as const);
        const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
        const isYou = s.id === "you";
        return (
          <g key={s.id}>
            <path
              d={line}
              fill="none"
              stroke={s.color}
              strokeWidth={isYou ? 2.6 : 1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={s.dashed ? "5 4" : undefined}
              vectorEffect="non-scaling-stroke"
              opacity={isYou ? 1 : 0.9}
            />
            <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={isYou ? 3.4 : 2.6} fill="var(--color-card)" stroke={s.color} strokeWidth="1.8" />
          </g>
        );
      })}
    </svg>
  );
}

/* ── Multi-color segmented position bar ────────────────────────────────────── */
export function SegmentedBar({
  segments,
  className,
}: {
  segments: { label: string; value: number; color: string }[];
  className?: string;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  return (
    <div className={className}>
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted">
        {segments.map((s, i) => (
          <span
            key={s.label}
            title={`${s.label} · ${s.value}`}
            style={{ width: `${(s.value / total) * 100}%`, background: s.color, marginLeft: i === 0 ? 0 : 1.5 }}
            className="h-full first:rounded-l-full last:rounded-r-full"
          />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {segments.map((s) => (
          <span key={s.label} className="inline-flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
            <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
            {s.label}
            <span className="tnum text-foreground/70">{s.value}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

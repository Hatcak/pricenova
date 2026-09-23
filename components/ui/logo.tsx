import { cn } from "@/lib/utils";
import appConfig from "@/app.config";

/**
 * PriceNova brand mark — a bespoke inline-SVG logomark: a price tag whose hole
 * doubles as a watching "eye" with a live pulse dot, in a green-turquoise-purple
 * gradient. The tag = pricing; the eye/pulse = monitoring. No external image.
 * The setup can swap `appConfig.name` for the wordmark; drop a real file at
 * public/logo.svg if you have one.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("h-8 w-8 shrink-0", className)}
      aria-hidden
      fill="none"
    >
      <defs>
        <linearGradient id="pw-mark" x1="4" y1="3" x2="28" y2="29" gradientUnits="userSpaceOnUse">
          <stop stopColor="oklch(65% 0.16 152)" />
          <stop offset="0.55" stopColor="oklch(64% 0.13 190)" />
          <stop offset="1" stopColor="oklch(56% 0.17 300)" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#pw-mark)" />
      {/* price tag body — a rounded chamfered tag pointing up-right */}
      <path
        d="M9.4 17.2 L17.2 9.4 a2 2 0 0 1 1.5 -0.6 l4.1 0.2 a1.4 1.4 0 0 1 1.3 1.3 l0.2 4.1 a2 2 0 0 1 -0.6 1.5 L15.4 23.2 a2.2 2.2 0 0 1 -3.1 0 L9.4 20.3 a2.2 2.2 0 0 1 0 -3.1 Z"
        fill="#fff"
        fillOpacity="0.95"
      />
      {/* the tag hole = a watching eye */}
      <circle cx="20.4" cy="11.6" r="2.5" fill="url(#pw-mark)" />
      <circle cx="20.4" cy="11.6" r="1.05" fill="#fff" />
    </svg>
  );
}

export function Logo({
  className,
  withWordmark = true,
  withChevron = false,
  onDark = false,
}: {
  className?: string;
  withWordmark?: boolean;
  /** Render a small chevron after the wordmark (matches the sidebar header). */
  withChevron?: boolean;
  /** Use light wordmark on a dark surface (e.g. the auth brand panel). */
  onDark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="h-8 w-8 shadow-pill" />
      {withWordmark && (
        <span className="inline-flex items-center gap-1.5">
          <span
            className={cn(
              "font-display text-[17px] font-bold tracking-[-0.02em]",
              onDark ? "text-white" : "text-foreground",
            )}
          >
            {appConfig.name}
          </span>
          {withChevron && (
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-muted-foreground" aria-hidden>
              <path d="M5 6l3 3 3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          )}
        </span>
      )}
    </span>
  );
}

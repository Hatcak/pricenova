import type { Metadata, Viewport } from "next";
// ── FONTS ─────────────────────────────────────────────────────────────────
// Distinctive, NOT Inter/Roboto. IBM Plex Sans drives the UI/display voice —
// a precise, slightly technical face that suits a data tool; IBM Plex Mono
// powers every price, delta and number. The setup can swap these — keep the CSS
// variable names (--font-sans-app / --font-display-app / --font-mono-app) so
// globals.css picks them up.
// The public marketing pages (`.mk` in globals.css) use their own pairing,
// picked with the ui-ux-pro-max skill ("Tech Startup"): Space Grotesk for
// headlines, DM Sans for body text. Prices stay in IBM Plex Mono everywhere.
import { IBM_Plex_Sans, IBM_Plex_Mono, Space_Grotesk, DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/i18n/language-provider";
import appConfig from "@/app.config";
import { DEFAULT_LANG } from "@/lib/i18n/config";

const sans = IBM_Plex_Sans({
  variable: "--font-sans-app",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// IBM Plex Sans also serves as the display face — clean, precise, modern.
const display = IBM_Plex_Sans({
  variable: "--font-display-app",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  weight: ["600", "700"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono-app",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const mkDisplay = Space_Grotesk({
  variable: "--font-mk-display",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  weight: ["500", "600", "700"],
});

const mkSans = DM_Sans({
  variable: "--font-mk-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(`https://${appConfig.domain}`),
  title: {
    default: `${appConfig.name} · ${appConfig.tagline[DEFAULT_LANG]}`,
    template: `%s | ${appConfig.name}`,
  },
  description: appConfig.description[DEFAULT_LANG],
  applicationName: appConfig.name,
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: appConfig.name,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1120" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang={DEFAULT_LANG}
      suppressHydrationWarning
      /**
       * globals.css sets `scroll-behavior: smooth` for the anchor links on the
       * marketing page. Next needs this attribute to know that's deliberate,
       * otherwise it warns and route changes animate their scroll reset too.
       */
      data-scroll-behavior="smooth"
      className={`${sans.variable} ${display.variable} ${mono.variable} ${mkDisplay.variable} ${mkSans.variable} h-full`}
    >
      <body className="min-h-full bg-background text-foreground antialiased font-sans">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

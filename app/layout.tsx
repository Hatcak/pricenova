import type { Metadata } from "next";
// ── FONTS ─────────────────────────────────────────────────────────────────
// Distinctive, NOT Inter/Roboto. IBM Plex Sans drives the UI/display voice —
// a precise, slightly technical face that suits a data tool; IBM Plex Mono
// powers every price, delta and number. The setup can swap these — keep the CSS
// variable names (--font-sans-app / --font-display-app / --font-mono-app) so
// globals.css picks them up.
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/i18n/language-provider";
import appConfig from "@/app.config";
import { DEFAULT_LANG } from "@/lib/i18n/config";

const sans = IBM_Plex_Sans({
  variable: "--font-sans-app",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// IBM Plex Sans also serves as the display face — clean, precise, modern.
const display = IBM_Plex_Sans({
  variable: "--font-display-app",
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono-app",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: `${appConfig.name} — ${appConfig.tagline[DEFAULT_LANG]}`,
  description: appConfig.description[DEFAULT_LANG],
  applicationName: appConfig.name,
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
      className={`${sans.variable} ${display.variable} ${mono.variable} h-full`}
    >
      <body className="min-h-full bg-background text-foreground antialiased font-sans">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

# Working in this project (read me first)

This is **PriceNova** — a **GoatStarter kit** on Next.js 16. The product:
**competitor price monitoring & repricing for e-commerce** — track rivals'
prices, get alerted when they move, and auto-reprice to win the sale (modeled on
prisync.com + pricefy.io). A production-grade starter built to be rebranded fast.

**Design language:** LIGHT, clean, data-first. White surfaces, hairline borders,
a **teal-blue** primary (`oklch(58% 0.13 210)`), **IBM Plex Sans** for UI and
**IBM Plex Mono** for every price/number (use the `.tnum` class). Green =
cheapest (you win), red = most expensive (you lose). Light is the default —
**no `dark` class** on `<html>`. The dashboard is a price cockpit: white sidebar
(grouped nav + pinned user card) · a products table (your price vs each
competitor, with deltas + a position pill + a sparkline) · a row-click detail
drawer with a **multi-line price-history chart** (one line per competitor) · a
price-changes feed · a competitors list. All visuals are **inline SVG** (charts
in `components/app/charts.tsx`, the price-tag-with-eye logomark in
`components/ui/logo.tsx`) — **no chart library, no photos**.

## ⭐ If the user wants to set this up

When the user says anything like **"set up this project"**, **"bu projeyi kur"**,
**"make this mine"**, **"configure this"**, or runs **`/setup`** — do NOT start
editing files blindly. Open **`SETUP.md`** and follow it exactly. It is an
interview: you ask a short list of questions (brand, logo, colors, and the
specific API keys this app needs), then you apply the answers to:

- `app.config.ts` — name, tagline, copy, navigation
- `app/globals.css` — brand colors
- `app/layout.tsx` — fonts (optional)
- `.env.local` — the API keys you collected
- `public/logo.svg` — the user's logo (if provided)

Ask **one question at a time**, accept "skip"/"keep default" for any of them, and
never invent API keys. When done, run `npm install` and `npm run dev` and report
the local URL.

## The single source of truth

`app.config.ts` drives the brand, the marketing page, the dashboard navigation
(`navGroups` = the grouped sidebar; `nav` = the flat list used for topbar title
lookup), and the list of integrations this kit expects (Supabase, a
scraping/price-data provider, Shopify/WooCommerce, Slack). Read it before
changing UI copy.

## Bilingual (TR + EN)

Every user-facing string is `{ tr: "…", en: "…" }`. When you edit copy, **keep
both languages**. Shared UI strings (auth, nav chrome, buttons) live in
`lib/i18n/dict.ts`. The default language is set in `lib/i18n/config.ts`
(`DEFAULT_LANG`). A live TR/EN toggle sits in the navbar, dashboard topbar and
auth pages.

## Auth

Supabase Auth is wired and switches on by itself when the keys are present.

- **With `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`:**
  `/login` and `/signup` are real (email + password, plus OAuth for whichever
  providers you enable in Supabase). `proxy.ts` — Next 16's name for what used
  to be middleware — refreshes the session and bounces signed-out visitors off
  the dashboard routes. Run `supabase/schema.sql` once in the SQL Editor to
  create the tables; every one of them is row-level-secured to its owner.
- **Without the keys:** there is no account to create, so the auth screens say
  so and send you through the demo door instead of pretending to sign you in.

`/demo` is a separate entrance: it sets a `pn_demo` cookie, which is what lets
the proxy allow a visitor with no session through to the sample dashboard. Keep
the demo door and the signup path verbally and visually distinct — they are two
different offers, and collapsing them back into one button is a regression.

Client helpers live in `lib/supabase/client.ts` (browser) and
`lib/supabase/server.ts` (server); both return `null` when unconfigured, so
callers fall back to demo data rather than throwing.

## Demo mode

With no keys in `.env.local`, the app renders from `lib/demo/data.ts`. That is
intentional — it lets anyone boot the app instantly. Real integrations replace
the demo data once their keys are present.

<!-- BEGIN:nextjs-agent-rules -->
## This is NOT the Next.js you may know

This is Next.js 16 (App Router, React 19, Tailwind v4). APIs and conventions may
differ from older training data. If unsure about a Next.js API, check
`node_modules/next/dist/docs/` before writing code, and heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# PriceNova

**Competitor price monitoring & repricing for e-commerce.** Track your rivals'
prices, get alerted the moment they move, and auto-reprice to win the sale —
*"never lose a sale to a price you didn't know about."* A production-grade
**Next.js 16** starter, built to be rebranded in minutes.

> Inspired by clean e-commerce price-intelligence SaaS like
> [prisync.com](https://prisync.com) and [pricefy.io](https://pricefy.io).

## Quick start (demo mode — no keys needed)

```bash
npm install
npm run dev          # → http://localhost:3000
```

It boots straight into a **live demo**: realistic products, four competitors,
price history, a price-changes feed and repricing rules — all from
`lib/demo/data.ts`. Click a product row on the dashboard to open the
price-history drawer; flip the language toggle (top-right) for TR/EN.

## Make it yours

Open this folder in **Claude Code** and say:

> **"set up this project"**  (or run **`/setup`**)

Claude interviews you for your **brand**, **logo**, **colors**, and the **API
keys this app needs** (Supabase, a scraping/price-data provider,
Shopify/WooCommerce, Slack), then writes your `app.config.ts` and `.env.local`
and boots it. New to the kit? **Open [`START-HERE.md`](./START-HERE.md)** for the
guided walkthrough. Prefer to do it by hand? Follow [`SETUP.md`](./SETUP.md) —
every step names the exact file to change.

## What's inside

```
app.config.ts            ← single source of truth (brand, copy, nav, integrations)
app/(marketing)/         ← landing page (hero, interactive demo, pricing, FAQ…)
app/(app)/dashboard/     ← the price-intelligence cockpit (products table + drawer)
app/(app)/products/      ← full products list (your price vs competitors)
app/(app)/competitors/   ← tracked stores, avg gap, matched products
app/(app)/changes/       ← price-changes feed (who changed what, when)
app/(app)/rules/         ← repricing rules (match lowest -1%, floor = cost +10%…)
components/app/charts.tsx ← inline-SVG sparklines + multi-line price-history chart
components/app/position   ← the Cheapest / Mid / Most-expensive position pill
lib/demo/data.ts          ← sample data that powers demo mode
.env.example              ← the keys this kit can use (all optional)
SETUP.md                  ← the guided-setup script
```

## Design

Light, clean, data-first. Teal-blue accent (`oklch(58% 0.13 210)`),
**IBM Plex Sans** for UI and **IBM Plex Mono** for every price and number.
Green = cheapest, red = most expensive. All visuals are **inline SVG** — charts,
sparklines and the price-tag-with-eye logomark — **no chart library, no photos**.

## Stack

Next.js 16 (App Router) · React 19 · Tailwind v4 · lucide-react.
No database required to run — it falls back to realistic demo data. Push to
Vercel (or any Node host) when you're ready.

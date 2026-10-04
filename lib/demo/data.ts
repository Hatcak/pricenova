/**
 * Demo data — what makes PriceNova feel alive with zero API keys. Labels are
 * bilingual ({ tr, en }); the dashboard resolves them to the active language.
 * Proper nouns and free text (product names, competitor names) stay as-is.
 * Replace with real Supabase / scraping-provider queries once setup wires keys.
 */
import type { L } from "@/lib/i18n/config";

/* ── Competitors we track (referenced across the app) ──────────────────────── */
export interface Competitor {
  id: string;
  name: string;
  domain: string;
  color: string;   // chart line color
  products: number; // products matched
  avgGap: number;   // avg % they are vs you (+ = they're pricier)
  position: "cheaper" | "pricier" | "even";
}

export const competitors: Competitor[] = [
  { id: "you", name: "You", domain: "yourstore.com", color: "var(--color-comp-you)", products: 48, avgGap: 0, position: "even" },
  { id: "c1", name: "MegaShop", domain: "megashop.com", color: "var(--color-comp-1)", products: 46, avgGap: -2.4, position: "cheaper" },
  { id: "c2", name: "ValueMart", domain: "valuemart.io", color: "var(--color-comp-2)", products: 44, avgGap: 1.8, position: "pricier" },
  { id: "c3", name: "PrimeGoods", domain: "primegoods.co", color: "var(--color-comp-3)", products: 40, avgGap: 4.1, position: "pricier" },
  { id: "c4", name: "QuickBuy", domain: "quickbuy.net", color: "var(--color-comp-4)", products: 37, avgGap: -0.6, position: "cheaper" },
];

/** The four rivals (excludes "you"), in column order. */
export const rivalCols = competitors.filter((c) => c.id !== "you");

/* ── Top summary cards ─────────────────────────────────────────────────────── */
export const summary = {
  productsTracked: { value: 48, label: { tr: "İzlenen ürün", en: "Products tracked" } as L, delta: 6 },
  competitors: { value: 4, label: { tr: "Rakip", en: "Competitors" } as L, delta: 0 },
  changesToday: { value: 23, label: { tr: "Bugünkü değişim", en: "Price changes today" } as L, delta: 9 },
  priceIndex: { value: 98.4, label: { tr: "Fiyat endeksi", en: "Price index" } as L, delta: -1.2 },
};

/* ── Products table — each row: your price + each rival's price + position ──── */
export type Position = "cheapest" | "mid" | "expensive";

export interface RivalQuote {
  competitorId: string;
  price: number | null; // null = not stocked / not matched
  delta: number | null; // % vs your price (+ pricier than you, − cheaper)
  inStock: boolean;
}

export interface ProductRow {
  id: string;
  name: string;
  sku: string;
  category: string;
  cost: number;        // your unit cost (for floor rules)
  yourPrice: number;
  position: Position;  // your position among all sellers
  rank: number;        // 1 = cheapest of N sellers
  sellers: number;     // total sellers incl. you
  spark: number[];     // your price (or index) sparkline, last ~14 points
  rivals: RivalQuote[];
  // per-competitor price-history series for the detail drawer (chronological)
  history: { competitorId: string; series: number[] }[];
}

const CATEGORIES = ["Audio", "Wearables", "Home", "Computing", "Cameras"] as const;

function q(id: string, price: number | null, yours: number, inStock = true): RivalQuote {
  return {
    competitorId: id,
    price,
    delta: price === null ? null : Number((((price - yours) / yours) * 100).toFixed(1)),
    inStock,
  };
}

export const products: ProductRow[] = [
  {
    id: "p1", name: "Aurora Wireless Earbuds Pro", sku: "AUD-EB-220", category: "Audio",
    cost: 41.0, yourPrice: 79.0, position: "cheapest", rank: 1, sellers: 5,
    spark: [82, 82, 81, 81, 80, 80, 80, 79, 79, 79, 79, 79, 79, 79],
    rivals: [q("c1", 81.5, 79), q("c2", 84.0, 79), q("c3", 89.99, 79), q("c4", 79.9, 79)],
    history: [
      { competitorId: "you", series: [82, 82, 81, 80, 80, 79, 79, 79, 79, 79] },
      { competitorId: "c1", series: [85, 85, 84, 83, 82, 82, 81.5, 81.5, 81.5, 81.5] },
      { competitorId: "c2", series: [86, 86, 85, 85, 84, 84, 84, 84, 84, 84] },
      { competitorId: "c3", series: [92, 91, 91, 90, 90, 89.99, 89.99, 89.99, 89.99, 89.99] },
      { competitorId: "c4", series: [83, 82, 82, 81, 81, 80.5, 80, 79.9, 79.9, 79.9] },
    ],
  },
  {
    id: "p2", name: "Pulse Smartwatch 5", sku: "WEA-SW-501", category: "Wearables",
    cost: 96.0, yourPrice: 189.0, position: "expensive", rank: 4, sellers: 5,
    spark: [185, 185, 186, 187, 188, 188, 189, 189, 189, 189, 189, 189, 189, 189],
    rivals: [q("c1", 174.99, 189), q("c2", 179.0, 189), q("c3", 192.0, 189), q("c4", 181.5, 189)],
    history: [
      { competitorId: "you", series: [185, 186, 187, 188, 188, 189, 189, 189, 189, 189] },
      { competitorId: "c1", series: [182, 181, 180, 178, 177, 176, 175, 174.99, 174.99, 174.99] },
      { competitorId: "c2", series: [184, 183, 183, 182, 181, 180, 179, 179, 179, 179] },
      { competitorId: "c3", series: [195, 194, 194, 193, 193, 192, 192, 192, 192, 192] },
      { competitorId: "c4", series: [186, 185, 184, 183, 183, 182, 182, 181.5, 181.5, 181.5] },
    ],
  },
  {
    id: "p3", name: "Nimbus Bluetooth Speaker", sku: "AUD-SP-118", category: "Audio",
    cost: 22.0, yourPrice: 44.9, position: "mid", rank: 3, sellers: 5,
    spark: [46, 46, 45, 45, 45, 44.9, 44.9, 44.9, 44.9, 44.9, 44.9, 44.9, 44.9, 44.9],
    rivals: [q("c1", 42.0, 44.9), q("c2", 43.5, 44.9), q("c3", 47.99, 44.9), q("c4", null, 44.9, false)],
    history: [
      { competitorId: "you", series: [47, 46, 46, 45, 45, 44.9, 44.9, 44.9, 44.9, 44.9] },
      { competitorId: "c1", series: [45, 44, 44, 43, 43, 42.5, 42, 42, 42, 42] },
      { competitorId: "c2", series: [46, 45, 45, 44, 44, 43.5, 43.5, 43.5, 43.5, 43.5] },
      { competitorId: "c3", series: [49, 49, 48.5, 48, 48, 47.99, 47.99, 47.99, 47.99, 47.99] },
      { competitorId: "c4", series: [45, 45, 44, 44, 43.5, 43, 43, 43, 43, 43] },
    ],
  },
  {
    id: "p4", name: "Terra Robot Vacuum X2", sku: "HOM-RV-740", category: "Home",
    cost: 168.0, yourPrice: 299.0, position: "cheapest", rank: 1, sellers: 5,
    spark: [315, 312, 309, 305, 305, 302, 299, 299, 299, 299, 299, 299, 299, 299],
    rivals: [q("c1", 309.0, 299), q("c2", 319.0, 299), q("c3", 329.99, 299), q("c4", 304.5, 299)],
    history: [
      { competitorId: "you", series: [319, 315, 312, 309, 305, 302, 299, 299, 299, 299] },
      { competitorId: "c1", series: [325, 322, 320, 318, 315, 312, 310, 309, 309, 309] },
      { competitorId: "c2", series: [330, 328, 326, 324, 322, 320, 319, 319, 319, 319] },
      { competitorId: "c3", series: [339, 338, 336, 334, 332, 330, 329.99, 329.99, 329.99, 329.99] },
      { competitorId: "c4", series: [320, 318, 315, 312, 309, 306, 305, 304.5, 304.5, 304.5] },
    ],
  },
  {
    id: "p5", name: "Lumen 4K Webcam", sku: "CAM-WC-090", category: "Cameras",
    cost: 28.0, yourPrice: 59.0, position: "expensive", rank: 5, sellers: 5,
    spark: [55, 56, 56, 57, 58, 58, 59, 59, 59, 59, 59, 59, 59, 59],
    rivals: [q("c1", 49.99, 59), q("c2", 52.0, 59), q("c3", 54.5, 59), q("c4", 51.0, 59)],
    history: [
      { competitorId: "you", series: [55, 56, 56, 57, 58, 58, 59, 59, 59, 59] },
      { competitorId: "c1", series: [54, 53, 52, 51, 50, 50, 49.99, 49.99, 49.99, 49.99] },
      { competitorId: "c2", series: [56, 55, 54, 53, 53, 52, 52, 52, 52, 52] },
      { competitorId: "c3", series: [58, 57, 56, 55, 55, 54.5, 54.5, 54.5, 54.5, 54.5] },
      { competitorId: "c4", series: [55, 54, 53, 52, 52, 51.5, 51, 51, 51, 51] },
    ],
  },
  {
    id: "p6", name: "Vertex Mechanical Keyboard", sku: "COM-KB-330", category: "Computing",
    cost: 47.0, yourPrice: 109.0, position: "mid", rank: 2, sellers: 5,
    spark: [112, 112, 111, 110, 110, 109, 109, 109, 109, 109, 109, 109, 109, 109],
    rivals: [q("c1", 104.0, 109), q("c2", 112.0, 109), q("c3", 119.99, 109), q("c4", 107.5, 109)],
    history: [
      { competitorId: "you", series: [114, 112, 112, 111, 110, 110, 109, 109, 109, 109] },
      { competitorId: "c1", series: [110, 109, 108, 107, 106, 105, 104, 104, 104, 104] },
      { competitorId: "c2", series: [115, 114, 113, 113, 112, 112, 112, 112, 112, 112] },
      { competitorId: "c3", series: [122, 121, 121, 120, 120, 119.99, 119.99, 119.99, 119.99, 119.99] },
      { competitorId: "c4", series: [112, 111, 110, 109, 108, 108, 107.5, 107.5, 107.5, 107.5] },
    ],
  },
  {
    id: "p7", name: "Halo Over-Ear Headphones", sku: "AUD-HP-455", category: "Audio",
    cost: 64.0, yourPrice: 129.0, position: "cheapest", rank: 1, sellers: 5,
    spark: [139, 137, 135, 133, 131, 130, 129, 129, 129, 129, 129, 129, 129, 129],
    rivals: [q("c1", 134.0, 129), q("c2", 131.0, 129), q("c3", 144.99, 129), q("c4", 132.5, 129)],
    history: [
      { competitorId: "you", series: [139, 137, 135, 133, 131, 130, 129, 129, 129, 129] },
      { competitorId: "c1", series: [140, 139, 138, 137, 136, 135, 134, 134, 134, 134] },
      { competitorId: "c2", series: [138, 136, 135, 134, 133, 132, 131, 131, 131, 131] },
      { competitorId: "c3", series: [149, 148, 147, 146, 146, 145, 144.99, 144.99, 144.99, 144.99] },
      { competitorId: "c4", series: [139, 138, 136, 135, 134, 133, 132.5, 132.5, 132.5, 132.5] },
    ],
  },
  {
    id: "p8", name: "Drift Fitness Band 3", sku: "WEA-FB-210", category: "Wearables",
    cost: 19.0, yourPrice: 39.0, position: "mid", rank: 3, sellers: 5,
    spark: [41, 41, 40, 40, 39.5, 39, 39, 39, 39, 39, 39, 39, 39, 39],
    rivals: [q("c1", 36.99, 39), q("c2", 37.5, 39), q("c3", 41.0, 39), q("c4", 38.9, 39)],
    history: [
      { competitorId: "you", series: [42, 41, 41, 40, 40, 39.5, 39, 39, 39, 39] },
      { competitorId: "c1", series: [40, 39, 39, 38, 38, 37, 36.99, 36.99, 36.99, 36.99] },
      { competitorId: "c2", series: [41, 40, 40, 39, 39, 38, 37.5, 37.5, 37.5, 37.5] },
      { competitorId: "c3", series: [43, 42, 42, 41, 41, 41, 41, 41, 41, 41] },
      { competitorId: "c4", series: [41, 40, 40, 39, 39, 39, 38.9, 38.9, 38.9, 38.9] },
    ],
  },
  {
    id: "p9", name: "Atlas Standing Desk Mat", sku: "HOM-DM-082", category: "Home",
    cost: 14.0, yourPrice: 34.0, position: "cheapest", rank: 1, sellers: 4,
    spark: [38, 37, 36, 36, 35, 34, 34, 34, 34, 34, 34, 34, 34, 34],
    rivals: [q("c1", 36.0, 34), q("c2", 35.5, 34), q("c3", 39.99, 34), q("c4", null, 34, false)],
    history: [
      { competitorId: "you", series: [38, 37, 36, 36, 35, 34, 34, 34, 34, 34] },
      { competitorId: "c1", series: [39, 38, 38, 37, 37, 36, 36, 36, 36, 36] },
      { competitorId: "c2", series: [38, 37, 37, 36, 36, 35.5, 35.5, 35.5, 35.5, 35.5] },
      { competitorId: "c3", series: [42, 41, 41, 40, 40, 39.99, 39.99, 39.99, 39.99, 39.99] },
      { competitorId: "c4", series: [37, 37, 36, 36, 35, 35, 35, 35, 35, 35] },
    ],
  },
  {
    id: "p10", name: "Photon USB-C Hub 8-in-1", sku: "COM-HB-611", category: "Computing",
    cost: 21.0, yourPrice: 45.0, position: "expensive", rank: 4, sellers: 5,
    spark: [43, 43, 44, 44, 44.5, 45, 45, 45, 45, 45, 45, 45, 45, 45],
    rivals: [q("c1", 39.99, 45), q("c2", 41.0, 45), q("c3", 47.5, 45), q("c4", 42.0, 45)],
    history: [
      { competitorId: "you", series: [43, 43, 44, 44, 44.5, 45, 45, 45, 45, 45] },
      { competitorId: "c1", series: [44, 43, 42, 41, 41, 40, 39.99, 39.99, 39.99, 39.99] },
      { competitorId: "c2", series: [44, 43, 43, 42, 42, 41, 41, 41, 41, 41] },
      { competitorId: "c3", series: [49, 49, 48, 48, 48, 47.5, 47.5, 47.5, 47.5, 47.5] },
      { competitorId: "c4", series: [44, 44, 43, 43, 42.5, 42, 42, 42, 42, 42] },
    ],
  },
];

export { CATEGORIES };

/* ── Price-changes feed (who changed what, when) ───────────────────────────── */
export interface PriceChange {
  id: string;
  competitorId: string;   // who changed it
  who: string;
  productId: string;
  product: string;
  from: number;
  to: number;
  at: string;             // ISO
}

export const priceChanges: PriceChange[] = [
  { id: "ch1", competitorId: "c1", who: "MegaShop", productId: "p2", product: "Pulse Smartwatch 5", from: 178.0, to: 174.99, at: "2026-06-14T08:42:00Z" },
  { id: "ch2", competitorId: "c4", who: "QuickBuy", productId: "p1", product: "Aurora Wireless Earbuds Pro", from: 81.0, to: 79.9, at: "2026-06-14T07:15:00Z" },
  { id: "ch3", competitorId: "c1", who: "MegaShop", productId: "p5", product: "Lumen 4K Webcam", from: 51.0, to: 49.99, at: "2026-06-14T06:30:00Z" },
  { id: "ch4", competitorId: "c3", who: "PrimeGoods", productId: "p4", product: "Terra Robot Vacuum X2", from: 334.0, to: 329.99, at: "2026-06-13T22:05:00Z" },
  { id: "ch5", competitorId: "c2", who: "ValueMart", productId: "p7", product: "Halo Over-Ear Headphones", from: 133.0, to: 131.0, at: "2026-06-13T19:48:00Z" },
  { id: "ch6", competitorId: "c1", who: "MegaShop", productId: "p10", product: "Photon USB-C Hub 8-in-1", from: 41.0, to: 39.99, at: "2026-06-13T16:20:00Z" },
  { id: "ch7", competitorId: "c4", who: "QuickBuy", productId: "p6", product: "Vertex Mechanical Keyboard", from: 108.0, to: 107.5, at: "2026-06-13T14:02:00Z" },
  { id: "ch8", competitorId: "c2", who: "ValueMart", productId: "p8", product: "Drift Fitness Band 3", from: 38.0, to: 37.5, at: "2026-06-13T11:36:00Z" },
];

/* ── Repricing rules panel ─────────────────────────────────────────────────── */
export interface RepriceRule {
  id: string;
  name: L;
  formula: string;            // human-readable, e.g. "lowest − 1%"
  scope: L;                   // which products / category
  appliesTo: number;          // count of products
  status: "active" | "paused";
  /**
   * "auto"     — the rule writes the new price by itself.
   * "approval" — the rule only suggests; nothing moves until you say yes.
   */
  mode: "auto" | "approval";
  lastFired: string | null;   // ISO
}

export const repriceRules: RepriceRule[] = [
  { id: "r1", name: { tr: "En düşüğü -%1 geç", en: "Beat lowest by 1%" }, formula: "lowest − 1%", scope: { tr: "Tüm Audio", en: "All Audio" }, appliesTo: 12, status: "active", mode: "approval", lastFired: "2026-06-14T07:16:00Z" },
  { id: "r2", name: { tr: "Taban = maliyet +%10", en: "Floor = cost +10%" }, formula: "max(rule, cost × 1.10)", scope: { tr: "Tüm ürünler", en: "All products" }, appliesTo: 48, status: "active", mode: "auto", lastFired: "2026-06-14T07:16:00Z" },
  { id: "r3", name: { tr: "İkinci en ucuza eşle", en: "Match 2nd cheapest" }, formula: "2nd lowest", scope: { tr: "Wearables", en: "Wearables" }, appliesTo: 6, status: "active", mode: "approval", lastFired: "2026-06-13T22:06:00Z" },
  { id: "r4", name: { tr: "Stok yokken +%5", en: "Out-of-stock premium +5%" }, formula: "your price × 1.05", scope: { tr: "Home", en: "Home" }, appliesTo: 8, status: "paused", mode: "auto", lastFired: null },
];

/* ── Repricing suggestions & applied changes ───────────────────────────────────
   A rule in "approval" mode never touches your price on its own: it lands here
   as a suggestion you approve or dismiss. A rule in "auto" mode writes the
   price straight away, but the change is still logged with its previous value
   so a single click puts it back.                                             */
export interface RepriceEvent {
  id: string;
  productId: string;
  product: string;
  sku: string;
  /** The price before the change. Restoring means writing this back. */
  from: number;
  /** The price the rule wants to set (or has set). */
  to: number;
  cost: number;
  ruleId: string;
  rule: L;
  /** Plain-language trigger, e.g. "MegaShop dropped to $77.90". */
  reason: L;
  at: string;
}

/** Waiting for your approval — nothing has changed on your store yet. */
export const pendingReprices: RepriceEvent[] = [
  {
    id: "sg1", productId: "p1", product: "Aurora Wireless Earbuds Pro", sku: "AUD-EB-220",
    from: 79.0, to: 77.12, cost: 41.0, ruleId: "r1", rule: { tr: "En düşüğü -%1 geç", en: "Beat lowest by 1%" },
    reason: { tr: "QuickBuy 77,90 $'a düştü — en ucuz konumunu kaybettin.", en: "QuickBuy dropped to $77.90 — you lost the cheapest spot." },
    at: "2026-06-14T08:52:00Z",
  },
  {
    id: "sg2", productId: "p8", product: "Drift Fitness Band 3", sku: "WEA-FB-210",
    from: 39.0, to: 37.35, cost: 19.0, ruleId: "r3", rule: { tr: "İkinci en ucuza eşle", en: "Match 2nd cheapest" },
    reason: { tr: "MegaShop 36,99 $ · ValueMart 37,50 $ — ikinci sıraya oynuyorsun.", en: "MegaShop $36.99 · ValueMart $37.50 — you're targeting second place." },
    at: "2026-06-14T08:31:00Z",
  },
  {
    id: "sg3", productId: "p5", product: "Lumen 4K Webcam", sku: "CAM-WC-090",
    from: 59.0, to: 49.49, cost: 28.0, ruleId: "r1", rule: { tr: "En düşüğü -%1 geç", en: "Beat lowest by 1%" },
    reason: { tr: "MegaShop 49,99 $'a indi — bu öneri marjını %44'ten %43'e çeker.", en: "MegaShop cut to $49.99 — this suggestion takes your margin from 53% to 43%." },
    at: "2026-06-14T06:34:00Z",
  },
  {
    id: "sg4", productId: "p6", product: "Vertex Mechanical Keyboard", sku: "COM-KB-330",
    from: 109.0, to: 103.0, cost: 47.0, ruleId: "r1", rule: { tr: "En düşüğü -%1 geç", en: "Beat lowest by 1%" },
    reason: { tr: "MegaShop 104,00 $ — bir adım altına inmek için.", en: "MegaShop at $104.00 — this steps just underneath." },
    at: "2026-06-14T05:10:00Z",
  },
];

/** Already written to your store by an automatic rule — each one is undoable. */
export const appliedReprices: RepriceEvent[] = [
  {
    id: "ap1", productId: "p4", product: "Terra Robot Vacuum X2", sku: "HOM-RV-740",
    from: 302.0, to: 299.0, cost: 168.0, ruleId: "r2", rule: { tr: "Taban = maliyet +%10", en: "Floor = cost +10%" },
    reason: { tr: "PrimeGoods 329,99 $'a düştü; taban kuralı 299,00 $'da tuttu.", en: "PrimeGoods fell to $329.99; the floor rule held you at $299.00." },
    at: "2026-06-14T07:16:00Z",
  },
  {
    id: "ap2", productId: "p7", product: "Halo Over-Ear Headphones", sku: "AUD-HP-455",
    from: 130.0, to: 129.0, cost: 64.0, ruleId: "r2", rule: { tr: "Taban = maliyet +%10", en: "Floor = cost +10%" },
    reason: { tr: "ValueMart 131,00 $'a indi — bir basamak altına geçtin.", en: "ValueMart moved to $131.00 — you stepped just below." },
    at: "2026-06-14T07:16:00Z",
  },
  {
    id: "ap3", productId: "p9", product: "Atlas Standing Desk Mat", sku: "HOM-DM-082",
    from: 35.0, to: 34.0, cost: 14.0, ruleId: "r2", rule: { tr: "Taban = maliyet +%10", en: "Floor = cost +10%" },
    reason: { tr: "ValueMart 35,50 $ — en ucuz konumu korudun.", en: "ValueMart at $35.50 — you kept the cheapest spot." },
    at: "2026-06-13T21:02:00Z",
  },
];

/* ── Competitor product matching ───────────────────────────────────────────────
   A wrong match poisons every comparison built on it, so matches carry how they
   were found and how sure we are — and you get the final say.                  */
export type MatchMethod = "gtin" | "model" | "title" | "manual";

export interface ProductMatch {
  id: string;
  productId: string;
  product: string;      // your product
  sku: string;
  competitorId: string;
  rivalTitle: string;   // the product title on their site
  rivalUrl: string;
  rivalPrice: number;
  /** How sure we are, 0–100. Anything under 90 waits for you. */
  confidence: number;
  method: MatchMethod;
  status: "confirmed" | "pending" | "rejected";
  /** Why we think these are the same product, in plain language. */
  evidence: L;
}

export const productMatches: ProductMatch[] = [
  {
    id: "m1", productId: "p1", product: "Aurora Wireless Earbuds Pro", sku: "AUD-EB-220",
    competitorId: "c1", rivalTitle: "Aurora Earbuds Pro — Wireless ANC", rivalUrl: "megashop.com/p/aurora-pro",
    rivalPrice: 81.5, confidence: 99, method: "gtin", status: "confirmed",
    evidence: { tr: "Barkod (GTIN) birebir aynı: 0845973042318.", en: "Identical barcode (GTIN): 0845973042318." },
  },
  {
    id: "m2", productId: "p1", product: "Aurora Wireless Earbuds Pro", sku: "AUD-EB-220",
    competitorId: "c3", rivalTitle: "Aurora Earbuds Lite (2. nesil)", rivalUrl: "primegoods.co/aurora-lite-2",
    rivalPrice: 89.99, confidence: 61, method: "title", status: "pending",
    evidence: { tr: "Sadece ürün adı benziyor. \"Lite\" farklı bir model olabilir — barkod yok.", en: "Only the title is similar. \"Lite\" may be a different model — no barcode published." },
  },
  {
    id: "m3", productId: "p2", product: "Pulse Smartwatch 5", sku: "WEA-SW-501",
    competitorId: "c1", rivalTitle: "Pulse Smartwatch 5 · 44mm Siyah", rivalUrl: "megashop.com/p/pulse-5-44",
    rivalPrice: 174.99, confidence: 96, method: "model", status: "confirmed",
    evidence: { tr: "Marka + model kodu eşleşiyor (PLS-SW5-44).", en: "Brand + model code match (PLS-SW5-44)." },
  },
  {
    id: "m4", productId: "p2", product: "Pulse Smartwatch 5", sku: "WEA-SW-501",
    competitorId: "c4", rivalTitle: "Pulse Smartwatch 5 Kordon Seti", rivalUrl: "quickbuy.net/pulse-5-band-kit",
    rivalPrice: 29.9, confidence: 34, method: "title", status: "pending",
    evidence: { tr: "Fiyat, eşleşen diğer satıcıların %83 altında — bu büyük ihtimalle aksesuar, ürünün kendisi değil.", en: "Priced 83% below the other matched sellers — this is most likely an accessory, not the product." },
  },
  {
    id: "m5", productId: "p5", product: "Lumen 4K Webcam", sku: "CAM-WC-090",
    competitorId: "c1", rivalTitle: "Lumen Webcam 4K UHD 60fps", rivalUrl: "megashop.com/p/lumen-4k",
    rivalPrice: 49.99, confidence: 94, method: "model", status: "confirmed",
    evidence: { tr: "Model kodu ve teknik özellikler örtüşüyor.", en: "Model code and specs line up." },
  },
  {
    id: "m6", productId: "p3", product: "Nimbus Bluetooth Speaker", sku: "AUD-SP-118",
    competitorId: "c2", rivalTitle: "Nimbus Taşınabilir Hoparlör (Yenilenmiş)", rivalUrl: "valuemart.io/nimbus-refurb",
    rivalPrice: 31.0, confidence: 48, method: "title", status: "pending",
    evidence: { tr: "Başlıkta \"Yenilenmiş\" geçiyor — sıfır ürününle aynı fiyat ligi değil.", en: "The title says \"Refurbished\" — not the same price league as your new unit." },
  },
  {
    id: "m7", productId: "p6", product: "Vertex Mechanical Keyboard", sku: "COM-KB-330",
    competitorId: "c3", rivalTitle: "Vertex Mekanik Klavye TKL Kahverengi Switch", rivalUrl: "primegoods.co/vertex-tkl",
    rivalPrice: 119.99, confidence: 88, method: "title", status: "pending",
    evidence: { tr: "Aynı seri, ama seninki tam boy. TKL daha küçük bir varyant olabilir.", en: "Same line, but yours is full-size. TKL may be a smaller variant." },
  },
  {
    id: "m8", productId: "p4", product: "Terra Robot Vacuum X2", sku: "HOM-RV-740",
    competitorId: "c2", rivalTitle: "Terra X2 Robot Süpürge + Şarj İstasyonu", rivalUrl: "valuemart.io/terra-x2",
    rivalPrice: 319.0, confidence: 91, method: "gtin", status: "confirmed",
    evidence: { tr: "Barkod aynı; istasyon kutu içeriğinde zaten var.", en: "Same barcode; the dock is included in the box either way." },
  },
];

/** How a match is found, newest-first in the order we try them. */
export const matchLadder: { method: MatchMethod; title: L; body: L; certainty: L }[] = [
  {
    method: "gtin",
    title: { tr: "Barkod (GTIN / EAN / UPC)", en: "Barcode (GTIN / EAN / UPC)" },
    body: { tr: "İki üründe de aynı barkod varsa, bu aynı üründür. Tartışmaya kapalı.", en: "If both listings carry the same barcode, it's the same product. No argument." },
    certainty: { tr: "Kesin", en: "Certain" },
  },
  {
    method: "model",
    title: { tr: "Marka + model kodu", en: "Brand + model code" },
    body: { tr: "Barkod yoksa üretici model kodunu ararız — \"PLS-SW5-44\" gibi.", en: "With no barcode we look for the manufacturer's model code — something like \"PLS-SW5-44\"." },
    certainty: { tr: "Çok güçlü", en: "Very strong" },
  },
  {
    method: "title",
    title: { tr: "Başlık ve özellik benzerliği", en: "Title and spec similarity" },
    body: { tr: "Son çare: ürün adı, varyant ve fiyat aralığı karşılaştırılır. Burası yanılabilir — bu yüzden onayına sunulur.", en: "Last resort: we compare title, variant and price range. This is where mistakes happen — so it comes to you for approval." },
    certainty: { tr: "Onayın gerekir", en: "Needs your approval" },
  },
  {
    method: "manual",
    title: { tr: "Senin elinle eklediğin", en: "Added by you" },
    body: { tr: "Rakip ürünün bağlantısını kendin yapıştırırsın. Hiçbir tahmin yapılmaz.", en: "You paste the competitor's product link yourself. Nothing is guessed." },
    certainty: { tr: "Kesin", en: "Certain" },
  },
];

/* ── Price-position chart (how your SKUs are distributed) ──────────────────── */
export const positionMix = {
  cheapest: 21,
  mid: 18,
  expensive: 9,
};

/* ── Price-index trend (your basket vs market = 100) ───────────────────────── */
export interface TrendPointLite {
  label: string;
  value: number;
}
export const priceIndexTrend: TrendPointLite[] = [
  { label: "Jun 01", value: 101.2 },
  { label: "Jun 04", value: 100.6 },
  { label: "Jun 07", value: 99.8 },
  { label: "Jun 10", value: 99.1 },
  { label: "Jun 14", value: 98.4 },
];
export const priceIndexMeta = {
  title: { tr: "Fiyat endeksi", en: "Price index" } as L,
  subtitle: { tr: "Pazar = 100 · son 14 gün", en: "Market = 100 · last 14 days" } as L,
  delta: "−1.2",
};

/* ── KPI tiles (compact strip) ─────────────────────────────────────────────── */
export interface DKpi {
  label: L;
  value: string;
  delta?: number;
  icon?: string;
  hint?: L;
}
const vs7: L = { tr: "son 7 güne göre", en: "vs last 7 days" };
export const kpis: DKpi[] = [
  { label: { tr: "En ucuz olduğun SKU", en: "SKUs you win" }, value: "21 / 48", delta: 8.2, icon: "trophy", hint: vs7 },
  { label: { tr: "Bugünkü yeniden fiyatlandırma", en: "Reprices today" }, value: "14", delta: 12.0, icon: "wand-sparkles", hint: vs7 },
  { label: { tr: "Ort. rakip farkı", en: "Avg competitor gap" }, value: "+1.3%", delta: -0.4, icon: "git-compare-arrows", hint: vs7 },
  { label: { tr: "Tahmini marj etkisi", en: "Est. margin impact" }, value: "+$2,140", delta: 6.1, icon: "trending-up", hint: vs7 },
];

/* ── Reports ───────────────────────────────────────────────────────────────────
   Everything the Reports screen charts. Values are weekly, oldest first, and
   the ranges below decide how many of those weeks a chart shows.             */
export type ReportRange = "7d" | "30d" | "90d";

export const reportRanges: { key: ReportRange; label: L; weeks: number }[] = [
  { key: "7d", label: { tr: "Son 7 gün", en: "Last 7 days" }, weeks: 2 },
  { key: "30d", label: { tr: "Son 30 gün", en: "Last 30 days" }, weeks: 5 },
  { key: "90d", label: { tr: "Son 90 gün", en: "Last 90 days" }, weeks: 13 },
];

/** % of tracked SKUs where you are the cheapest seller, by week. */
export const winRateTrend: number[] = [
  32, 34, 33, 36, 38, 37, 40, 39, 41, 43, 42, 44, 44,
];

/** Your price index against the market (market = 100), by week. */
export const indexTrend: number[] = [
  103.1, 102.6, 102.4, 101.9, 101.5, 101.2, 100.8, 100.4, 100.1, 99.6, 99.1, 98.7, 98.4,
];

/** Estimated margin impact in dollars, by week. */
export const marginTrend: number[] = [
  820, 910, 880, 1040, 1180, 1120, 1360, 1290, 1480, 1610, 1570, 1880, 2140,
];

export const weekLabels: string[] = [
  "Mar 23", "Mar 30", "Apr 06", "Apr 13", "Apr 20", "Apr 27", "May 04",
  "May 11", "May 18", "May 25", "Jun 01", "Jun 08", "Jun 14",
];

/** Per-category scoreboard — where you win and where you're bleeding. */
export interface CategoryReport {
  category: string;
  skus: number;
  win: number;      // cheapest
  mid: number;
  lose: number;     // most expensive
  avgGap: number;   // your avg % vs the cheapest rival (− = you're cheaper)
  marginImpact: number;
}

export const categoryReport: CategoryReport[] = [
  { category: "Audio", skus: 14, win: 8, mid: 4, lose: 2, avgGap: -1.8, marginImpact: 740 },
  { category: "Wearables", skus: 9, win: 2, mid: 3, lose: 4, avgGap: 3.6, marginImpact: -260 },
  { category: "Home", skus: 11, win: 6, mid: 4, lose: 1, avgGap: -2.4, marginImpact: 910 },
  { category: "Computing", skus: 8, win: 3, mid: 4, lose: 1, avgGap: 0.9, marginImpact: 410 },
  { category: "Cameras", skus: 6, win: 2, mid: 3, lose: 1, avgGap: 2.1, marginImpact: 340 },
];

/** How much pressure each rival puts on you. */
export interface CompetitorPressure {
  competitorId: string;
  undercutsYou: number;   // SKUs where they're cheaper
  youUndercut: number;    // SKUs where you're cheaper
  movesThisWeek: number;  // price changes they made
  spark: number[];
}

export const competitorPressure: CompetitorPressure[] = [
  { competitorId: "c1", undercutsYou: 26, youUndercut: 20, movesThisWeek: 31, spark: [18, 20, 21, 23, 24, 25, 26] },
  { competitorId: "c2", undercutsYou: 17, youUndercut: 27, movesThisWeek: 12, spark: [21, 20, 19, 19, 18, 17, 17] },
  { competitorId: "c3", undercutsYou: 9, youUndercut: 31, movesThisWeek: 7, spark: [14, 13, 12, 11, 10, 9, 9] },
  { competitorId: "c4", undercutsYou: 22, youUndercut: 15, movesThisWeek: 19, spark: [16, 17, 19, 20, 21, 22, 22] },
];

/** Reports that go out on a schedule. */
export interface ScheduledReport {
  id: string;
  name: L;
  cadence: L;
  recipients: string;
  lastRun: string;
  format: "PDF" | "CSV" | "XLSX";
}

export const scheduledReports: ScheduledReport[] = [
  {
    id: "sr1",
    name: { tr: "Haftalık fiyat özeti", en: "Weekly price digest" },
    cadence: { tr: "Her pazartesi 09:00", en: "Mondays at 09:00" },
    recipients: "alex@yourstore.com",
    lastRun: "2026-06-08T06:00:00Z",
    format: "PDF",
  },
  {
    id: "sr2",
    name: { tr: "Kaybedilen SKU listesi", en: "Lost SKU list" },
    cadence: { tr: "Her gün 07:00", en: "Daily at 07:00" },
    recipients: "alex@yourstore.com · ops@yourstore.com",
    lastRun: "2026-06-14T04:00:00Z",
    format: "CSV",
  },
  {
    id: "sr3",
    name: { tr: "Aylık marj raporu", en: "Monthly margin report" },
    cadence: { tr: "Ayın 1'i", en: "1st of the month" },
    recipients: "finance@yourstore.com",
    lastRun: "2026-06-01T06:00:00Z",
    format: "XLSX",
  },
];

/* ── Marketplaces ──────────────────────────────────────────────────────────────
   Where your catalog lives. "connected" means we both read the catalog and can
   write prices back; "available" means the integration exists but you haven't
   wired it; "soon" means it isn't built yet — and the UI says so plainly.   */
export interface Marketplace {
  key: string;
  /** Must match a glyph name in components/marketing/marks.tsx. */
  name: string;
  status: "connected" | "available" | "soon";
  /** What the link does, in plain language. */
  capability: L;
  /** Two-way = we can write prices back. Read-only = we only observe. */
  writeBack: boolean;
  products: number;
  /** % of that marketplace's SKUs where you're the cheapest. */
  winRate: number;
  lastSync: string | null;
  color: string;
  region: L;
}

export const marketplaces: Marketplace[] = [
  {
    key: "shopify",
    name: "Shopify",
    status: "connected",
    capability: { tr: "Katalog senkronu + fiyat geri yazma", en: "Catalog sync + price write-back" },
    writeBack: true,
    products: 32,
    winRate: 48,
    lastSync: "2026-06-14T08:40:00Z",
    color: "var(--color-comp-1)",
    region: { tr: "Kendi mağazan", en: "Your own store" },
  },
  {
    key: "woocommerce",
    name: "WooCommerce",
    status: "available",
    capability: { tr: "Katalog senkronu + fiyat geri yazma", en: "Catalog sync + price write-back" },
    writeBack: true,
    products: 0,
    winRate: 0,
    lastSync: null,
    color: "var(--color-comp-2)",
    region: { tr: "Kendi mağazan", en: "Your own store" },
  },
  {
    key: "trendyol",
    name: "Trendyol",
    status: "soon",
    capability: { tr: "Katalog çekme — yakında", en: "Catalog pull — coming soon" },
    writeBack: false,
    products: 0,
    winRate: 0,
    lastSync: null,
    color: "var(--color-comp-4)",
    region: { tr: "Pazaryeri · TR", en: "Marketplace · TR" },
  },
  {
    key: "hepsiburada",
    name: "Hepsiburada",
    status: "soon",
    capability: { tr: "Katalog çekme — yakında", en: "Catalog pull — coming soon" },
    writeBack: false,
    products: 0,
    winRate: 0,
    lastSync: null,
    color: "var(--color-comp-5)",
    region: { tr: "Pazaryeri · TR", en: "Marketplace · TR" },
  },
  {
    key: "n11",
    name: "n11",
    status: "soon",
    capability: { tr: "Katalog çekme — yakında", en: "Catalog pull — coming soon" },
    writeBack: false,
    products: 0,
    winRate: 0,
    lastSync: null,
    color: "var(--color-comp-6)",
    region: { tr: "Pazaryeri · TR", en: "Marketplace · TR" },
  },
];

/* ── Interactive landing demo: a rival drops price → rule fires → recover ──── */
export const flowDemo = {
  product: "Aurora Wireless Earbuds Pro",
  cost: 41.0,
  steps: [
    { label: { tr: "En ucuz sensin", en: "You're the cheapest" } as L, sub: "$79.00 · rank 1/5" },
    { label: { tr: "Rakip fiyat düşürdü", en: "A rival drops their price" } as L, sub: "MegaShop → $77.90" },
    { label: { tr: "Artık en ucuz değilsin", en: "You're no longer cheapest" } as L, sub: "rank 2/5 · −$1.10" },
    { label: { tr: "Kural devreye girdi", en: "A repricing rule fires" } as L, sub: "lowest − 1% → $77.12" },
    { label: { tr: "Konumunu geri aldın", en: "You recover the position" } as L, sub: "$77.12 · rank 1/5" },
  ],
};

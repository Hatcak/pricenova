import { ImageResponse } from "next/og";

/**
 * The link preview for every public page. Inline styles are unavoidable inside
 * ImageResponse, so this is the one file allowed raw colours (they mirror the
 * `.mk` tokens in globals.css).
 *
 * The copy avoids ı/ş/ğ on purpose: the built-in OG font only covers basic
 * Latin, and a missing glyph renders as an empty box in the preview.
 */
export const alt = "PriceNova: rakip fiyat takibi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(160deg, #dbeafe 0%, #ffffff 55%)",
          color: "#0f172a",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: "#1d4ed8" }} />
          <div style={{ fontSize: 44, fontWeight: 700 }}>PriceNova</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.1 }}>Rakip fiyat takibi</div>
          <div style={{ fontSize: 34, color: "#475569" }}>
            Shopify · WooCommerce · Trendyol · Hepsiburada · n11
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#1d4ed8", fontWeight: 600 }}>pricenova.io</div>
      </div>
    ),
    size,
  );
}

import { ImageResponse } from "next/og";

/**
 * Open Graph / social share image (served at /opengraph-image and used for
 * Twitter too). Generated at build/request time by next/og — no extra deps,
 * no static asset needed. 1200x630 is the standard OG size.
 */
export const alt = "RangeClarity — Clean chart context in seconds";
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
          justifyContent: "center",
          padding: "80px",
          background:
            "radial-gradient(ellipse 80% 60% at 30% 0%, #0c1f1b, #05060a)",
          color: "#f2f6ff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              background: "#2fffd6",
              display: "flex",
            }}
          />
          <div style={{ fontSize: "30px", letterSpacing: "0.12em", color: "#9aa6c4" }}>
            RANGECLARITY
          </div>
        </div>
        <div style={{ fontSize: "76px", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em" }}>
          Clean chart context
        </div>
        <div style={{ fontSize: "76px", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em", color: "#2fffd6" }}>
          in seconds.
        </div>
        <div style={{ fontSize: "30px", color: "#9aa6c4", marginTop: "32px", maxWidth: "900px" }}>
          A TradingView dashboard for trend, support, resistance, range, and extension. No signals. No hype.
        </div>
      </div>
    ),
    { ...size },
  );
}

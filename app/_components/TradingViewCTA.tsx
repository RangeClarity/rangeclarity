"use client";

import { TRADINGVIEW_AFFILIATE_URL } from "@/lib/affiliate";
import { rcTrack } from "@/lib/analytics";

/**
 * Shared TradingView affiliate CTA. Real <a href> (works on desktop + mobile),
 * opens in a new tab, full button area clickable, no overlay, no disabled styling.
 * Single source of truth for the referral URL: lib/affiliate.ts.
 */
export default function TradingViewCTA({ note }: { note?: string }) {
  return (
    <div style={{ margin: "1.1rem 0 0" }}>
      <p style={{ margin: "0 0 0.65rem", color: "#9aa3b2", fontSize: "0.9rem", lineHeight: 1.5 }}>
        Open TradingView using our referral link.
      </p>
      <a
        href={TRADINGVIEW_AFFILIATE_URL}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={() => rcTrack("tradingview_referral_click")}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          width: "100%",
          minHeight: 52,
          padding: "0.95rem 1.25rem",
          borderRadius: 12,
          fontWeight: 800,
          fontSize: "1rem",
          textDecoration: "none",
          color: "#04221e",
          background: "#2dd4bd",
          boxShadow: "0 10px 28px rgba(45, 212, 189, 0.28)",
        }}
      >
        Open TradingView <span aria-hidden="true">&rarr;</span>
      </a>
      <p style={{ margin: "0.65rem 0 0", fontSize: "0.8rem", color: "#9aa3b2", lineHeight: 1.5 }}>
        If the button does not open,{" "}
        <a
          href={TRADINGVIEW_AFFILIATE_URL}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={() => rcTrack("tradingview_referral_click")}
          style={{ color: "#2dd4bd", textDecoration: "underline" }}
        >
          click here
        </a>
        .{note ? ` ${note}` : ""}
      </p>
    </div>
  );
}

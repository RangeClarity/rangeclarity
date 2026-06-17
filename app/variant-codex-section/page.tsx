import type { Metadata } from "next";
import Link from "next/link";
import BoldHero from "./_components/BoldHero";

export const metadata: Metadata = {
  title: "RangeClarity — Bold Hero variant (Codex)",
  robots: { index: false, follow: false },
};

/* ============================================================
   /variant-codex-section
   A clean, isolated variant page showcasing the older "Codex" Bold Hero
   section recreated in the current project. The live homepage (/) is
   untouched, so you can open both and compare.
   Mock copy + placeholder mascot art (see MascotPlaceholder.tsx).
   ============================================================ */

const bar: React.CSSProperties = {
  position: "sticky",
  top: 0,
  zIndex: 40,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "1rem",
  flexWrap: "wrap",
  padding: "0.7rem clamp(1.25rem, 4vw, 2rem)",
  background: "rgba(5,6,10,0.82)",
  backdropFilter: "blur(10px)",
  borderBottom: "1px solid rgba(124,160,220,0.14)",
  fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
};
const brand: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "#fff", fontWeight: 800, letterSpacing: "-0.01em" };
const mark: React.CSSProperties = { width: 26, height: 26, borderRadius: 7, background: "linear-gradient(135deg,#34f5b0,#2fffd6)", color: "#04130d", display: "grid", placeItems: "center", fontSize: 12, fontWeight: 900 };
const links: React.CSSProperties = { display: "flex", gap: "0.9rem", alignItems: "center", flexWrap: "wrap" };
const link: React.CSSProperties = { color: "#9aa6c4", textDecoration: "none", fontSize: "0.85rem", fontWeight: 600 };
const note: React.CSSProperties = { fontFamily: "ui-monospace, Menlo, monospace", fontSize: "0.7rem", color: "#5c668a" };

export default function VariantCodexSectionPage() {
  return (
    <div style={{ background: "#05060a", minHeight: "100vh" }}>
      <header style={bar}>
        <span style={brand}>
          <span style={mark}>RC</span> RangeClarity
        </span>
        <span style={note}>Variant · Codex Bold Hero · noindex</span>
        <nav style={links}>
          <Link href="/" style={link}>← Live homepage</Link>
          <Link href="/designs" style={link}>All designs</Link>
        </nav>
      </header>

      <BoldHero />

      <footer style={{ padding: "2rem", textAlign: "center" }}>
        <p style={note}>
          Compare this Bold Hero against the live homepage at <Link href="/" style={{ color: "#34f5b0" }}>/</Link>.
          The homepage is unchanged.
        </p>
      </footer>
    </div>
  );
}

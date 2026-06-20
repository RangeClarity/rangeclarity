import type { Metadata } from "next";
import BetaShell from "../_components/BetaShell";
import styles from "../beta.module.css";

export const metadata: Metadata = {
  title: "RangeClarity — Disclaimer",
  description: "RangeClarity is a market-structure visualization tool, not financial advice.",
  robots: { index: false },
};

export default function Disclaimer() {
  return (
    <BetaShell>
      <section className={styles.hero} style={{ paddingBottom: "0.6rem" }}>
        <span className={styles.eyebrow}>Disclaimer</span>
        <h1 className={styles.h1} style={{ maxWidth: "20ch" }}>
          A clarity tool — <span className={styles.accent}>not advice</span>.
        </h1>
      </section>
      <section className={styles.section} style={{ borderTop: "none", paddingTop: "0.5rem" }}>
        <div className={styles.card}>
          <p style={{ color: "var(--fg-dim)", fontSize: "0.92rem", lineHeight: 1.7 }}>
            RangeClarity is a <b style={{ color: "var(--fg)" }}>market-structure visualization tool</b> for TradingView,
            provided for educational and informational purposes only.
          </p>
          <ul className={styles.ul} style={{ marginTop: "0.8rem" }}>
            <li style={{ color: "var(--fg-dim)", fontSize: "0.9rem", marginTop: "0.5rem" }}>It does <b style={{ color: "var(--fg)" }}>not</b> provide buy or sell signals, entries, or exits.</li>
            <li style={{ color: "var(--fg-dim)", fontSize: "0.9rem", marginTop: "0.5rem" }}>It does <b style={{ color: "var(--fg)" }}>not</b> predict price or probability of direction.</li>
            <li style={{ color: "var(--fg-dim)", fontSize: "0.9rem", marginTop: "0.5rem" }}>It makes <b style={{ color: "var(--fg)" }}>no</b> win-rate, performance, or profit promises.</li>
            <li style={{ color: "var(--fg-dim)", fontSize: "0.9rem", marginTop: "0.5rem" }}>It is <b style={{ color: "var(--fg)" }}>not</b> financial, investment, or trading advice, and is not a recommendation to take any action.</li>
            <li style={{ color: "var(--fg-dim)", fontSize: "0.9rem", marginTop: "0.5rem" }}>It describes structure that is already on the chart; <b style={{ color: "var(--fg)" }}>you</b> make all decisions.</li>
          </ul>
          <p style={{ color: "var(--fg-dim)", fontSize: "0.92rem", lineHeight: 1.7, marginTop: "0.9rem" }}>
            Trading and investing carry risk, including loss of capital. Past behavior of any market does not
            indicate future behavior. This is a <b style={{ color: "var(--fg)" }}>private beta</b>: features, access, and
            availability may change, and access is granted and revoked manually.
          </p>
        </div>
      </section>
    </BetaShell>
  );
}

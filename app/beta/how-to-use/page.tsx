import type { Metadata } from "next";
import Link from "next/link";
import BetaShell from "../_components/BetaShell";
import styles from "../beta.module.css";

export const metadata: Metadata = {
  title: "RangeClarity — How to Use",
  description: "How to read RangeClarity on TradingView: the Daily/Weekly structure review workflow.",
  robots: { index: false },
};

export default function HowToUse() {
  return (
    <BetaShell>
      <section className={styles.hero} style={{ paddingBottom: "1rem" }}>
        <span className={styles.eyebrow}>How to use</span>
        <h1 className={styles.h1} style={{ maxWidth: "18ch" }}>
          Read the <span className={styles.accent}>structure</span> in seconds.
        </h1>
        <p className={styles.heroSub} style={{ maxWidth: "58ch" }}>
          RangeClarity is built first for Daily/Weekly chart structure review. Here&rsquo;s the workflow and
          what each element means.
        </p>
      </section>

      <section className={styles.section}>
        <span className={styles.eyebrow}>The workflow</span>
        <h2 className={styles.h2}>Daily / Weekly <span style={{ color: "var(--accent)" }}>structure review</span></h2>
        <div className={styles.steps}>
          <div className={styles.step}><div className={styles.stepNum}>01</div><h3>Start on the Daily</h3><p>Open a Daily chart for a name on your watchlist and add the RangeClarity indicator.</p></div>
          <div className={styles.step}><div className={styles.stepNum}>02</div><h3>Read bias + clarity</h3><p>Note the structural bias and the clarity score — is this chart clean structure or chop?</p></div>
          <div className={styles.step}><div className={styles.stepNum}>03</div><h3>Locate the levels</h3><p>See where Local / Key / Strong support and resistance sit, and any weak structure.</p></div>
          <div className={styles.step}><div className={styles.stepNum}>04</div><h3>Check range position</h3><p>How far is price between the boundaries? Is it testing a channel edge?</p></div>
          <div className={styles.step}><div className={styles.stepNum}>05</div><h3>Zoom to Weekly</h3><p>Switch to the Weekly for higher-timeframe context around the same structure.</p></div>
          <div className={styles.step}><div className={styles.stepNum}>06</div><h3>Next name</h3><p>Repeat across your watchlist. A few seconds per chart. Clarity over noise.</p></div>
        </div>
      </section>

      <section className={styles.section}>
        <span className={styles.eyebrow}>Reading the overlay</span>
        <h2 className={styles.h2}>What each element <span style={{ color: "var(--accent)" }}>means</span></h2>
        <div className={styles.grid3}>
          <div className={styles.card}><div className={styles.kicker}>Bias</div><h3>The structural read</h3><p>Bullish, bearish, sideways, or unclear — a description of structure, not a recommendation.</p></div>
          <div className={styles.card}><div className={styles.kicker}>S/R tiers</div><h3>Local · Key · Strong</h3><p>Zones tiered by how much structure backs them. Strong zones carry the most context.</p></div>
          <div className={styles.card}><div className={styles.kicker}>Range position</div><h3>0 &rarr; 1 in range</h3><p>Where price sits between the boundaries, plus the channel state.</p></div>
          <div className={styles.card}><div className={styles.kicker}>Weak structure</div><h3>Low-confidence areas</h3><p>Where structure is thin — read with more caution.</p></div>
          <div className={styles.card}><div className={styles.kicker}>Clarity score</div><h3>Clean vs chop</h3><p>A single read on how structurally clear the chart is right now.</p></div>
          <div className={styles.card}><div className={styles.kicker}>Dashboard</div><h3>The summary</h3><p>A compact panel with the current read at a glance.</p></div>
        </div>
        <div className={styles.disclaimer}>
          <strong>Note.</strong> Every element describes existing structure. RangeClarity does not tell you to
          buy or sell, predict price, or guarantee outcomes. <Link href="/beta/disclaimer" style={{ color: "var(--accent)" }}>Full disclaimer</Link>.
        </div>
      </section>
    </BetaShell>
  );
}

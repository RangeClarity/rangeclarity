import type { Metadata } from "next";
import Link from "next/link";
import BetaShell from "../_components/BetaShell";
import styles from "../beta.module.css";
import { TRADINGVIEW_AFFILIATE_URL } from "@/lib/affiliate";

export const metadata: Metadata = {
  title: "RangeClarity — Beta Onboarding",
  description: "What RangeClarity is, how invite-only TradingView access works, and the Daily/Weekly structure review workflow.",
  robots: { index: false },
};

const TV_URL = TRADINGVIEW_AFFILIATE_URL;

export default function Onboarding() {
  return (
    <BetaShell>
      <section className={styles.hero} style={{ paddingBottom: "1.2rem" }}>
        <span className={styles.eyebrow}>Onboarding &middot; core value</span>
        <h1 className={styles.h1} style={{ maxWidth: "20ch" }}>
          Welcome to <span className={styles.accent}>RangeClarity</span>.
        </h1>
        <p className={styles.heroSub} style={{ maxWidth: "60ch" }}>
          A premium market-structure clarity system for TradingView. Simple chart, complex
          engine. This page explains what you get, how access works, and how to run your first
          structure review.
        </p>
      </section>

      <section className={styles.section}>
        <span className={styles.eyebrow}>What RangeClarity is</span>
        <h2 className={styles.h2}>A visual <span style={{ color: "var(--accent)" }}>market-structure layer</span></h2>
        <p className={styles.lead}>
          RangeClarity overlays the structure that is already on your chart — bias, support and
          resistance tiers, range position, channel state, and a clarity score — so you can read it
          in seconds. No signals. No noise. Just structure.
        </p>
        <div className={styles.grid4}>
          <div className={styles.card}><div className={styles.kicker}>Structure &amp; bias</div><h3>The read</h3><p>Bullish, bearish, sideways, or unclear — at a glance.</p></div>
          <div className={styles.card}><div className={styles.kicker}>Support / resistance</div><h3>Levels that matter</h3><p>Local, Key, and Strong zones, tiered by structure.</p></div>
          <div className={styles.card}><div className={styles.kicker}>Range position</div><h3>Where in the range</h3><p>How far price sits between the boundaries.</p></div>
          <div className={styles.card}><div className={styles.kicker}>Clarity score</div><h3>Clean or chop?</h3><p>One read on whether the structure is clear.</p></div>
        </div>
      </section>

      <section className={styles.section}>
        <span className={styles.eyebrow}>How access works</span>
        <h2 className={styles.h2}>Invite-only on <span style={{ color: "var(--accent)" }}>TradingView</span></h2>
        <div className={styles.steps}>
          <div className={styles.step}><div className={styles.stepNum}>01</div><h3>We confirm your plan</h3><p>For paid plans ($29 / $49) a founder confirms your beta payment via a manual link. Free preview needs no payment.</p></div>
          <div className={styles.step}><div className={styles.stepNum}>02</div><h3>We grant access by hand</h3><p>We add the invite-only RangeClarity indicator to the exact TradingView username you registered.</p></div>
          <div className={styles.step}><div className={styles.stepNum}>03</div><h3>You add it to a chart</h3><p>TradingView &rarr; Indicators &rarr; Invite-only scripts &rarr; RangeClarity. The structure renders instantly.</p></div>
        </div>
        <p className={styles.payNote} style={{ marginTop: "0.9rem" }}>
          Access states: <b style={{ color: "var(--fg)" }}>pending</b> &rarr; <b style={{ color: "var(--bull)" }}>granted</b> (live) &rarr; <b>revoked</b> / <b style={{ color: "var(--warn,#ffce4d)" }}>expired</b> when the beta window ends. See <Link href="/beta/tradingview-access" style={{ color: "var(--accent)" }}>TradingView access</Link>.
        </p>
      </section>

      <section className={styles.section}>
        <span className={styles.eyebrow}>What to do next</span>
        <h2 className={styles.h2}>After signup / payment</h2>
        <div className={styles.formWrap}>
          <div className={styles.form}>
            <ul className={styles.faqList} style={{ marginTop: 0 }}>
              <li className={styles.payNote} style={{ marginTop: 0 }}>1. Make sure your TradingView username is correct (it&rsquo;s how access is granted).</li>
              <li className={styles.payNote}>2. For $29 / $49, complete the manual payment link a founder sends you.</li>
              <li className={styles.payNote}>3. Watch for your access confirmation, then add the indicator to a Daily chart.</li>
              <li className={styles.payNote}>4. Run a structure review (below), then send <Link href="/beta/feedback" style={{ color: "var(--accent)" }}>feedback</Link>.</li>
            </ul>
          </div>
          <div className={styles.pay}>
            <div className={styles.kicker}>Daily / Weekly structure review</div>
            <ol style={{ margin: "0.6rem 0 0 1rem", color: "var(--fg-dim)", fontSize: "0.88rem", lineHeight: 1.7 }}>
              <li>Open a <b style={{ color: "var(--fg)" }}>Daily</b> chart of a name on your watchlist.</li>
              <li>Read the <b style={{ color: "var(--fg)" }}>bias</b> and the <b style={{ color: "var(--fg)" }}>clarity score</b>.</li>
              <li>Note the <b style={{ color: "var(--fg)" }}>Strong zones</b> and any <b style={{ color: "var(--fg)" }}>weak structure</b>.</li>
              <li>Check <b style={{ color: "var(--fg)" }}>range position</b> — where price sits between boundaries.</li>
              <li>Switch to <b style={{ color: "var(--fg)" }}>Weekly</b> for higher-timeframe context.</li>
              <li>Move to the next name. Clarity over noise.</li>
            </ol>
            <p className={styles.payNote}>Built first for Daily/Weekly chart structure review. Full guide: <Link href="/beta/how-to-use" style={{ color: "var(--accent)" }}>how to use</Link>.</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.row} style={{ gap: "1rem", flexWrap: "wrap" }}>
          <div className={styles.card} style={{ flex: 1, minWidth: 260, borderColor: "rgba(255,93,122,0.3)" }}>
            <div className={styles.kicker} style={{ color: "var(--bear)" }}>What RangeClarity does NOT do</div>
            <ul className={styles.ul} style={{ marginTop: "0.6rem" }}>
              <li style={{ color: "var(--fg-dim)", fontSize: "0.88rem", marginTop: "0.4rem" }}>No buy/sell signals or entries/exits</li>
              <li style={{ color: "var(--fg-dim)", fontSize: "0.88rem", marginTop: "0.4rem" }}>No price predictions or probability calls</li>
              <li style={{ color: "var(--fg-dim)", fontSize: "0.88rem", marginTop: "0.4rem" }}>No win-rate or profit promises</li>
              <li style={{ color: "var(--fg-dim)", fontSize: "0.88rem", marginTop: "0.4rem" }}>No financial advice — you decide</li>
            </ul>
          </div>
          <div className={styles.card} style={{ flex: 1, minWidth: 260 }}>
            <div className={styles.kicker}>TradingView</div>
            <h3 style={{ marginTop: "0.4rem", fontSize: "1rem", fontWeight: 650 }}>Need an account?</h3>
            <p style={{ marginTop: "0.4rem", color: "var(--fg-dim)", fontSize: "0.88rem" }}>
              A free TradingView account works to start. <a href={TV_URL} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>Open TradingView &rarr;</a>
              <br /><span className={styles.payNote}>(Affiliate/referral placeholder — set <code>NEXT_PUBLIC_TRADINGVIEW_URL</code>.)</span>
            </p>
            <div className={styles.ctaRow}>
              <Link href="/beta/feedback" className={`${styles.btn} ${styles.btnPrimary}`}>Share feedback</Link>
              <Link href="/beta/how-to-use" className={styles.btn}>How to use</Link>
            </div>
          </div>
        </div>
        <div className={styles.disclaimer}>
          <strong>Reminder.</strong> RangeClarity is a market-structure visualization tool for educational
          decision-support. It does not provide buy/sell signals, price predictions, or financial advice.
        </div>
      </section>
    </BetaShell>
  );
}

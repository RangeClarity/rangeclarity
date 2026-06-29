import type { Metadata } from "next";
import Link from "next/link";
import BetaShell from "../_components/BetaShell";
import styles from "../beta.module.css";
import { TRADINGVIEW_AFFILIATE_URL } from "@/lib/affiliate";

export const metadata: Metadata = {
  title: "RangeClarity — TradingView Access",
  description: "How invite-only TradingView access works for the RangeClarity beta.",
  robots: { index: false },
};

const TV_URL = TRADINGVIEW_AFFILIATE_URL;

export default function TradingViewAccess() {
  return (
    <BetaShell>
      <section className={styles.hero} style={{ paddingBottom: "1rem" }}>
        <span className={styles.eyebrow}>TradingView access</span>
        <h1 className={styles.h1} style={{ maxWidth: "20ch" }}>
          Invite-only, granted <span className={styles.accent}>by hand</span>.
        </h1>
        <p className={styles.heroSub} style={{ maxWidth: "58ch" }}>
          RangeClarity is an invite-only TradingView indicator. During the private beta, a founder
          grants and revokes access manually — no automation yet.
        </p>
      </section>

      <section className={styles.section}>
        <span className={styles.eyebrow}>Getting access</span>
        <h2 className={styles.h2}>Four <span style={{ color: "var(--accent)" }}>steps</span></h2>
        <div className={styles.steps}>
          <div className={styles.step}><div className={styles.stepNum}>01</div><h3>TradingView account</h3><p>A free account is enough to start. <a href={TV_URL} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>Open TradingView &rarr;</a></p></div>
          <div className={styles.step}><div className={styles.stepNum}>02</div><h3>Register your username</h3><p>Give us your exact TradingView username — access is granted to that account specifically.</p></div>
          <div className={styles.step}><div className={styles.stepNum}>03</div><h3>Confirm your plan</h3><p>Free preview is lead-capture only. Paid plans ($29 / $49) confirm via a manual payment link.</p></div>
          <div className={styles.step}><div className={styles.stepNum}>04</div><h3>Access granted</h3><p>We add the indicator to your account. Find it under Indicators &rarr; Invite-only scripts.</p></div>
        </div>
      </section>

      <section className={styles.section}>
        <span className={styles.eyebrow}>Access states</span>
        <h2 className={styles.h2}>What each <span style={{ color: "var(--accent)" }}>status</span> means</h2>
        <div className={styles.grid4}>
          <div className={styles.card}><div className={styles.kicker}>Pending</div><h3>Awaiting review</h3><p>Registered; a founder will confirm payment (paid plans) and grant access.</p></div>
          <div className={styles.card}><div className={styles.kicker} style={{ color: "var(--bull)" }}>Granted</div><h3>Live</h3><p>The indicator is on your TradingView account for the beta window.</p></div>
          <div className={styles.card}><div className={styles.kicker} style={{ color: "var(--bear)" }}>Revoked</div><h3>Removed</h3><p>Access removed — e.g. on request or after a refund.</p></div>
          <div className={styles.card}><div className={styles.kicker} style={{ color: "var(--warn,#ffce4d)" }}>Expired</div><h3>Window ended</h3><p>The beta period passed; flagged for review or renewal.</p></div>
        </div>
        <ul className={styles.faqList}>
          <li className={styles.payNote} style={{ marginTop: 0 }}>&bull; A TradingView username is <b style={{ color: "var(--fg)" }}>required</b> before access can be granted.</li>
          <li className={styles.payNote}>&bull; Free preview does <b style={{ color: "var(--fg)" }}>not</b> include invite-only access unless a founder manually upgrades you.</li>
          <li className={styles.payNote}>&bull; Refunds revoke access. When the beta window ends, access is marked expired / flagged for review.</li>
        </ul>
        <p className={styles.payNote}>
          <em>Affiliate/referral placeholder:</em> set <code>NEXT_PUBLIC_TRADINGVIEW_URL</code> to your TradingView referral link to use it across the beta pages.
        </p>
        <div className={styles.ctaRow}>
          <Link href="/beta" className={`${styles.btn} ${styles.btnPrimary}`}>Join the beta</Link>
          <Link href="/beta/onboarding" className={styles.btn}>Back to onboarding</Link>
        </div>
      </section>
    </BetaShell>
  );
}

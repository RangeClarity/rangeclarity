import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { RangeCommandV2LowerSections } from "../premium-hero-range-command-v2/RangeCommandV2LowerSections";
import v2 from "../range-command-v2/v2.module.css";
import variant from "../premium-hero-range-command-v2/variant.module.css";
import styles from "./foxBrandHero.module.css";
import { StickyCtaBar } from "./StickyCtaBar";

/* ============================================================
   /designs/rangeclarity-fox-brand-v1
   New fox-brand homepage candidate.
   - Net-new: fox-badge nav + cinematic fox hero ("The Operator").
   - Reused (NOT forked): RangeCommandV2LowerSections — the same lower
     sections the live homepage already renders.
   - app/page.tsx is intentionally NOT switched to this route.
   ============================================================ */

export const metadata: Metadata = {
  title: "RangeClarity — No signals. No noise. Just structure.",
  description:
    "A premium market-structure clarity layer for TradingView. RangeClarity reads strong and weak structure, ranges, zones and a visual verdict, so the chart stays simple while the engine does the work.",
};

export default function RangeClarityFoxBrandV1Page() {
  return (
    <main className={styles.page}>
      <header className={styles.nav}>
        <div className={styles.navInner}>
          <Link className={styles.brand} href="/" aria-label="RangeClarity home">
            <Image
              className={styles.brandBadge}
              src="/brand/fox-badge.png"
              alt=""
              aria-hidden="true"
              width={34}
              height={34}
            />
            <span className={styles.brandWord}>
              Range<span className={styles.g}>Clarity</span>
            </span>
          </Link>

          <nav className={styles.navLinks} aria-label="Primary navigation">
            <Link className={styles.active} href="/">
              Premium Indicators
            </Link>
            <Link href="/indicator-guide">Investor Research Lab</Link>
          </nav>

          <a className={styles.navCta} href="/beta?plan=beta_29">
            Get Beta Access
          </a>
        </div>
      </header>

      <section className={styles.hero} aria-label="RangeClarity — market-structure clarity">
        <Image
          className={styles.heroImage}
          src="/brand/fox-hero.jpg"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
        />
        <div className={styles.heroScrim} aria-hidden="true" />
        <div className={styles.heroGlow} aria-hidden="true" />

        <div className={styles.heroInner}>
          <div className={`${styles.copy} ${styles.copyDesktop}`}>
            <div className={styles.eyebrow}>
              <span className={styles.eyebrowDot} aria-hidden="true" />
              Market-structure clarity
            </div>

            <h1 className={styles.title}>
              No signals. No noise. <span className={styles.accent}>Just structure.</span>
            </h1>

            <p className={styles.lead}>
              Built for TradingView. RangeClarity reads strong and weak structure, ranges, zones
              and a visual verdict — so the chart stays simple while the engine does the work.
            </p>

            <div className={styles.actions}>
              <a className={styles.primary} href="/beta?plan=beta_29">
                Get Beta Access <span aria-hidden="true">→</span>
              </a>
              <a className={styles.secondary} href="/beta/free-access">
                7-Day Free Access
              </a>
            </div>

            <p className={styles.proofLine}>
              Private beta · TradingView username required · manual invite within 24–48h.
            </p>

            <div className={styles.micro}>
              <div className={styles.microItem}>
                <span className={styles.microLabel}>Clean chart</span>
                <span className={styles.microValue}>One readable layer</span>
              </div>
              <div className={styles.microItem}>
                <span className={styles.microLabel}>Complex engine</span>
                <span className={styles.microValue}>Multi-timeframe context</span>
              </div>
            </div>
          </div>

          {/* Mobile-only "Editorial" hero (≤767px). Type-led, no mascot; CTAs live in the sticky bar. */}
          <div className={styles.mobileHero}>
            <div className={styles.eyebrow}>
              <span className={styles.eyebrowDot} aria-hidden="true" />
              Market-structure clarity
            </div>
            <h1 className={styles.mTitle}>
              Read market structure <span className={styles.mAccent}>clearly.</span>
            </h1>
            <p className={styles.mSub}>Trend, location, zones and structure quality — without signals.</p>
            <p className={styles.mNote}>Private beta. TradingView username required.</p>
          </div>
        </div>
      </section>

      {/* Preserved lower homepage sections — reused from the live homepage,
          not duplicated. Same bridge + page wrapper the current homepage uses. */}
      <div className={variant.bridge} aria-hidden="true" />
      <div className={`${v2.page} ${variant.lowerPage}`}>
        <div className={v2.grid} aria-hidden="true" />
        <RangeCommandV2LowerSections />
      </div>

      {/* Mobile-only sticky conversion bar (≤767px); fades out when the final #join CTA is in view. */}
      <StickyCtaBar />
    </main>
  );
}

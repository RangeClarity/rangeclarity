import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { RangeCommandV2LowerSections } from "./RangeCommandV2LowerSections";
import hero from "../codex-premium-hero/codexPremiumHero.module.css";
import v2 from "../range-command-v2/v2.module.css";
import styles from "./variant.module.css";

const chips = [
  "TradingView-first",
  "Three named modules",
  "No black-box signals",
  "Mock preview only",
];

const proofCards = [
  {
    label: "Suite packaging",
    value: "Range Map + Momentum Engine + Risk Radar",
  },
  {
    label: "Decision posture",
    value: "Buy / wait / avoid context, never guaranteed calls",
  },
  {
    label: "Launch posture",
    value: "Early access, setup notes, and honest mock previews",
  },
];

export const metadata: Metadata = {
  title: "RangeClarity - TradingView Range Intelligence",
  description:
    "TradingView indicators that show the range before you make the move.",
};

export default function PremiumHeroRangeCommandV2Page() {
  return (
    <main className={hero.page}>
      <header className={hero.nav}>
        <div className={hero.navInner}>
          <Link className={hero.brand} href="/" aria-label="RangeClarity home">
            <span className={hero.brandMark}>RC</span>
            <span>RangeClarity</span>
          </Link>

          <nav className={hero.navLinks} aria-label="Primary navigation">
            <Link className={hero.active} href="/">
              Premium Indicators
            </Link>
          </nav>

          <a className={hero.navCta} href="#early-access">
            Join Early Access
          </a>
        </div>
      </header>

      <section className={hero.hero}>
        <Image
          className={hero.heroImage}
          src="/assets/rangeclarity-hero.png"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
        />
        <div className={hero.heroVeil} aria-hidden="true" />
        <div className={hero.grid} aria-hidden="true" />
        <div className={hero.scan} aria-hidden="true" />

        <div className={hero.heroInner}>
          <div className={hero.heroCopy}>
            <div className={hero.eyebrow}>
              Premium TradingView indicator suite <span aria-hidden="true">-</span> Range reading mode
            </div>

            <h1 className={hero.title}>
              TradingView indicators that show the range before you make the{" "}
              <span>move.</span>
            </h1>

            <p className={hero.lead}>
              RangeClarity overlays support, resistance, momentum, entry quality, and risk zones
              directly on your TradingView chart - so you can stop chasing candles and start reading
              structure.
            </p>

            <div className={hero.actions}>
              <a className={hero.primary} href="#early-access">
                Join Early Access
              </a>
              <a className={hero.secondary} href="#indicator-modules">
                View Indicator Modules
              </a>
            </div>

            <p className={hero.proofLine}>
              No repaint hype. No guaranteed signals. Just cleaner chart context.
            </p>

            <div className={hero.chips}>
              {chips.map((chip) => (
                <span key={chip}>{chip}</span>
              ))}
            </div>

            <div className={hero.miniCards}>
              {proofCards.map((card) => (
                <div className={hero.miniCard} key={card.label}>
                  <small>{card.label}</small>
                  <strong>{card.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className={styles.bridge} aria-hidden="true" />
      <div className={`${v2.page} ${styles.lowerPage}`}>
        <div className={v2.grid} aria-hidden="true" />
        <RangeCommandV2LowerSections />
      </div>
    </main>
  );
}

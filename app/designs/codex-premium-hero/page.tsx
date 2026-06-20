import Link from "next/link";
import Image from "next/image";
import s from "./codexPremiumHero.module.css";

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

const modules = [
  {
    eyebrow: "Range Map Toolkit",
    title: "Know where price lives.",
    body: "Support, resistance, and location context so the chart starts with structure instead of impulse.",
  },
  {
    eyebrow: "Momentum Engine",
    title: "Read force, not noise.",
    body: "Momentum state, compression, breakout watch, and exhaustion context without signal-bot promises.",
  },
  {
    eyebrow: "Risk Radar",
    title: "Respect the late entry.",
    body: "Entry quality, pullback zones, and risk/reward context before you make the move.",
  },
];

export default function CodexPremiumHeroPage() {
  return (
    <main className={s.page}>
      <header className={s.nav}>
        <div className={s.navInner}>
          <Link className={s.brand} href="/" aria-label="RangeClarity home">
            <span className={s.brandMark}>RC</span>
            <span>RangeClarity</span>
          </Link>

          <nav className={s.navLinks} aria-label="Primary navigation">
            <Link className={s.active} href="/designs/codex-premium-hero">
              Premium Indicators
            </Link>
          </nav>

          <a className={s.navCta} href="#early-access">
            Join Early Access
          </a>
        </div>
      </header>

      <section className={s.hero}>
        <Image
          className={s.heroImage}
          src="/assets/rangeclarity-hero.png"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
        />
        <div className={s.heroVeil} aria-hidden="true" />
        <div className={s.grid} aria-hidden="true" />
        <div className={s.scan} aria-hidden="true" />

        <div className={s.heroInner}>
          <div className={s.heroCopy}>
            <div className={s.eyebrow}>
              Premium TradingView indicator suite <span aria-hidden="true">-</span> Range reading mode
            </div>

            <h1 className={s.title}>
              TradingView indicators that show the range before you make the{" "}
              <span>move.</span>
            </h1>

            <p className={s.lead}>
              RangeClarity overlays support, resistance, momentum, entry quality, and risk zones
              directly on your TradingView chart - so you can stop chasing candles and start reading
              structure.
            </p>

            <div className={s.actions}>
              <a className={s.primary} href="#early-access">
                Join Early Access
              </a>
              <a className={s.secondary} href="#indicator-modules">
                View Indicator Modules
              </a>
            </div>

            <p className={s.proofLine}>
              No repaint hype. No guaranteed signals. Just cleaner chart context.
            </p>

            <div className={s.chips}>
              {chips.map((chip) => (
                <span key={chip}>{chip}</span>
              ))}
            </div>

            <div className={s.miniCards}>
              {proofCards.map((card) => (
                <div className={s.miniCard} key={card.label}>
                  <small>{card.label}</small>
                  <strong>{card.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={s.below} id="indicator-modules">
        <div className={s.belowInner}>
          <div className={s.sectionHead}>
            <small>Indicator modules</small>
            <h2>Premium market-command cards for cleaner chart context.</h2>
          </div>

          <div className={s.moduleGrid}>
            {modules.map((module) => (
              <article className={s.module} key={module.eyebrow}>
                <small>{module.eyebrow}</small>
                <h3>{module.title}</h3>
                <p>{module.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={s.below} id="early-access">
        <div className={s.belowInner}>
          <div className={s.sectionHead}>
            <small>Early access</small>
            <h2>TradingView clarity first. Hype never.</h2>
          </div>

          <div className={s.actions}>
            <a className={s.primary} href="mailto:hello@rangeclarity.com?subject=RangeClarity%20Early%20Access">
              Join Early Access
            </a>
            <Link className={s.secondary} href="/designs">
              Compare Designs
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

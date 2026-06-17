import type { Metadata } from "next";
import Link from "next/link";
import s from "./previous.module.css";
import { MODULES, STEPS, NOTS } from "./data";
import ModuleCard from "./_components/ModuleCard";
import MockChart from "./_components/MockChart";
import PricingSection from "./_components/PricingSection";
import FaqSection from "./_components/FaqSection";

/* ============================================================
   /designs/previous-pro
   The clean, professional "Range Command" layout as it existed
   BEFORE the meme-microcopy and mascot passes. Snapshot for
   comparison. Mock data only.
   ============================================================ */

export const metadata: Metadata = {
  title: "RangeClarity — Range Command (previous, pro)",
  robots: { index: false, follow: false },
};

export default function PreviousProPage() {
  return (
    <div className={s.page}>
      <div className={s.grid} aria-hidden="true" />

      {/* nav */}
      <header className={s.nav}>
        <div className={`${s.wrap} ${s.navInner}`}>
          <a href="#top" className={s.brand}>
            <span className={s.brandMark} aria-hidden="true">R</span>
            Range<span className={s.g}>Clarity</span>
          </a>
          <nav className={s.navLinks}>
            <a href="#modules">Modules</a>
            <a href="#chart">Live read</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </nav>
          <a href="#join" className={s.navCta}>Join Early Access</a>
        </div>
      </header>

      {/* hero */}
      <section id="top" className={s.hero}>
        <div className={`${s.wrap} ${s.heroGrid}`}>
          <div>
            <span className={s.badge}>
              <span className={s.pulse} style={{ width: 6, height: 6, borderRadius: 999, background: "#34f5b0" }} />
              TRADINGVIEW INDICATOR SUITE · EARLY ACCESS
            </span>
            <h1 className={s.h1}>
              TradingView indicators that show the{" "}
              <span className={s.grad}>range before you make the move.</span>
            </h1>
            <p className={s.sub}>
              RangeClarity overlays support, resistance, momentum, entry quality, and risk zones
              directly on your TradingView chart — so you can stop chasing candles and start reading
              structure.
            </p>
            <div className={s.btnRow} style={{ marginTop: "2rem" }}>
              <a href="#join" className={s.btnPrimary}>Join Early Access <span aria-hidden="true">→</span></a>
              <a href="#chart" className={s.btnGhost}>See a sample read</a>
            </div>
            <p className={s.trustLine}>No signal-bot hype. No profit promises. Just cleaner chart structure.</p>
            <div className={s.heroChips}>
              <span className={s.chip}>● Support / Resistance</span>
              <span className={s.chip}>● Momentum lifecycle</span>
              <span className={s.chip}>● Risk / Reward</span>
            </div>
          </div>
          <div className={s.float}>
            <MockChart />
          </div>
        </div>
      </section>

      {/* indicator modules */}
      <section id="modules" className={s.section}>
        <div className={s.wrap}>
          <div className={`${s.head} ${s.headCenter}`}>
            <span className={s.eyebrow}>The Toolkit</span>
            <h2 className={s.h2}>Three modules. One clear call.</h2>
            <p className={s.lead}>
              Each module is a collectible panel in your market command center — built to answer one
              question well.
            </p>
          </div>
          <div className={s.modGrid}>
            {MODULES.map((m) => (
              <ModuleCard key={m.id} m={m} />
            ))}
          </div>
        </div>
      </section>

      {/* mock tradingview chart */}
      <section id="chart" className={s.section}>
        <div className={s.wrap}>
          <div className={`${s.head} ${s.headCenter}`}>
            <span className={s.eyebrow}>Sample Read · ASTS</span>
            <h2 className={s.h2}>One ticker, fully read</h2>
            <p className={s.lead}>
              Mock data — but this is exactly how a read lands on your chart: structure first, verdict
              last.
            </p>
          </div>
          <div style={{ marginTop: "2.5rem" }}>
            <MockChart />
          </div>
        </div>
      </section>

      {/* how it works */}
      <section id="how" className={s.section}>
        <div className={s.wrap}>
          <div className={`${s.head} ${s.headCenter}`}>
            <span className={s.eyebrow}>How it works</span>
            <h2 className={s.h2}>From chart to decision in five steps</h2>
          </div>
          <div className={s.steps}>
            {STEPS.map((st) => (
              <div key={st.n} className={s.step}>
                <div className={s.stepNum}><span>{st.n}</span></div>
                <h3 className={s.stepT}>{st.t}</h3>
                <p className={s.stepD}>{st.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* what it's NOT */}
      <section id="not" className={s.section}>
        <div className={s.wrap}>
          <div className={s.notWrap}>
            <div className={s.head}>
              <span className={s.eyebrow}>Clarity, not hype</span>
              <h2 className={s.h2}>What RangeClarity is <span className={s.gradGold}>not</span>.</h2>
              <p className={s.lead}>
                We are deliberate about what this tool is. It is decision support for reading
                structure — nothing more, and nothing it can&apos;t honestly be.
              </p>
            </div>
            <div className={s.notList}>
              {NOTS.map((n) => (
                <div key={n} className={s.notItem}>
                  <span className={s.notX} aria-hidden="true">✕</span>
                  {n}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* pricing */}
      <PricingSection />

      {/* faq */}
      <FaqSection />

      {/* final cta */}
      <section id="join" className={s.section}>
        <div className={s.wrap}>
          <div className={s.finalCard}>
            <span className={s.badge}>
              <span className={s.pulse} style={{ width: 6, height: 6, borderRadius: 999, background: "#34f5b0" }} />
              EARLY ACCESS · LIMITED SEATS
            </span>
            <h2 className={s.h2} style={{ marginTop: "1.4rem" }}>
              Stop chasing candles. <span className={s.grad}>Start reading the range.</span>
            </h2>
            <form className={s.finalForm} action="#" aria-label="Join early access">
              <input className={s.input} type="email" placeholder="you@portfolio.com" aria-label="Email address" />
              <button type="button" className={s.btnPrimary}>Join Early Access <span aria-hidden="true">→</span></button>
            </form>
            <p className={s.mono} style={{ marginTop: "1rem", fontSize: 12, letterSpacing: "0.05em", color: "#5d6a8c" }}>
              No spam. No signals-for-hire. Just the range, clearly.
            </p>
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className={s.footer}>
        <div className={`${s.wrap} ${s.footInner}`}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontWeight: 800, color: "#fff" }}>Range<span className={s.g}>Clarity</span></span>
            <span className={s.mono} style={{ fontSize: 12, color: "#5d6a8c" }}>· Previous pro layout · snapshot</span>
          </div>
          <div className={s.footLinks}>
            <a href="#modules">Modules</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
            <Link href="/designs">All designs</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

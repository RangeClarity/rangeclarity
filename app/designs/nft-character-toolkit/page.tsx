import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import s from "./nft.module.css";
import { CHARACTERS, STEPS, NOTS, DISCLAIMER } from "./data";
import CharacterCard from "./_components/CharacterCard";
import MockChart from "./_components/MockChart";
import AccessPasses from "./_components/AccessPasses";
import FaqAccordion from "./_components/FaqAccordion";
import Emblem from "./_components/Emblem";

/* ============================================================
   /designs/nft-character-toolkit
   Experimental collectible-character branding over the real
   product: a premium TradingView indicator suite. Mock data only.
   ============================================================ */

export const metadata: Metadata = {
  title: "RangeClarity — Character Toolkit (experimental)",
  robots: { index: false, follow: false },
};

export default function NftCharacterToolkitPage() {
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
            <a href="#roster">Modules</a>
            <a href="#chart">Live read</a>
            <a href="#passes">Passes</a>
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
              TRADINGVIEW INDICATOR SUITE · CHARACTER EDITION
            </span>
            <h1 className={s.h1}>
              TradingView indicators <span className={s.grad}>with character.</span>
            </h1>
            <p className={s.sub}>
              RangeClarity turns support, resistance, momentum, entry quality, and risk into
              collectible market modules built for TradingView. Read the range — don&apos;t chase
              the candle.
            </p>
            <div className={s.btnRow} style={{ marginTop: "2rem" }}>
              <a href="#join" className={s.btnPrimary}>Join Early Access <span aria-hidden="true">→</span></a>
              <a href="#roster" className={s.btnGhost}>View Indicator Modules</a>
            </div>
            <p className={s.trustLine}>No signal-bot hype. No profit promises. Just cleaner chart structure.</p>
          </div>

          {/* collectible showcase */}
          <div className={s.float}>
            <div className={s.heroShow}>
              {CHARACTERS.map((ch) => (
                <div
                  key={ch.id}
                  className={s.heroTile}
                  style={{ ["--tc" as string]: `${ch.c}55` } as CSSProperties}
                >
                  <Emblem kind={ch.emblem} c={ch.c} c2={ch.c2} />
                  <div className={s.heroTileName}>{ch.name}</div>
                  <div className={s.heroTileRole}>{ch.indicator}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* character roster */}
      <section id="roster" className={s.section}>
        <div className={s.wrap}>
          <div className={`${s.head} ${s.headCenter}`}>
            <span className={s.eyebrow}>The Roster</span>
            <h2 className={s.h2}>Four modules. One clear call.</h2>
            <p className={s.lead}>
              Each character is the face of a real indicator module — a collectible panel in your
              market command center, built to answer one question well.
            </p>
          </div>
          <div className={s.charGrid}>
            {CHARACTERS.map((ch) => (
              <CharacterCard key={ch.id} ch={ch} />
            ))}
          </div>
        </div>
      </section>

      {/* mock chart */}
      <section id="chart" className={s.section}>
        <div className={s.wrap}>
          <div className={`${s.head} ${s.headCenter}`}>
            <span className={s.eyebrow}>Sample Read · ASTS</span>
            <h2 className={s.h2}>It&apos;s a real charting product</h2>
            <p className={s.lead}>
              Characters up front, serious tooling underneath. Mock data — but this is how a read
              lands on your TradingView chart.
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

      {/* access passes */}
      <AccessPasses />

      {/* what it's NOT */}
      <section id="not" className={s.section}>
        <div className={s.wrap}>
          <div className={s.notWrap}>
            <div className={s.head}>
              <span className={s.eyebrow}>Clarity, not hype</span>
              <h2 className={s.h2}>What RangeClarity is <span className={s.gradGold}>not</span>.</h2>
              <p className={s.lead}>
                The characters are branding. The product is a disciplined indicator suite for reading
                structure — and we&apos;re clear about what it isn&apos;t.
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

      {/* faq */}
      <FaqAccordion />

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
            <p className={s.disclaimer} style={{ marginInline: "auto", textAlign: "center" }}>{DISCLAIMER}</p>
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className={s.footer}>
        <div className={`${s.wrap} ${s.footInner}`}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontWeight: 800, color: "#fff" }}>Range<span className={s.g}>Clarity</span></span>
            <span className={s.mono} style={{ fontSize: 12, color: "#5d6a8c" }}>· Character edition · experimental</span>
          </div>
          <div className={s.footLinks}>
            <a href="#roster">Modules</a>
            <a href="#passes">Passes</a>
            <a href="#faq">FAQ</a>
            <Link href="/designs">All designs</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

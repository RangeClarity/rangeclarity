import type { Metadata } from "next";
import Link from "next/link";
import ps from "../designs/premium-fintech/premium.module.css";
import vs from "../designs/range-command-v2/v2.module.css";
import ms from "./merge.module.css";
import { MODULES, STEPS, NOTS } from "../designs/range-command-v2/data";
import ModuleCardV2 from "../designs/range-command-v2/_components/ModuleCardV2";
import MockTradingViewChartV2 from "../designs/range-command-v2/_components/MockTradingViewChartV2";
import PricingSectionV2 from "../designs/range-command-v2/_components/PricingSectionV2";
import FAQSectionV2 from "../designs/range-command-v2/_components/FAQSectionV2";

/* ============================================================
   /range-command-premium — "Range Command Premium Merge"
   Hero/top  = premium-fintech (reuses premium.module.css)
   Toolkit→footer = range-command-v2 (reuses v2.module.css + components)
   Original routes are untouched. Conflicts resolved only here, via scoped
   CSS modules + merge.module.css. Mock data only.
   ============================================================ */

export const metadata: Metadata = {
  title: "RangeClarity — Range Command Premium (merge)",
  robots: { index: false, follow: false },
};

export default function RangeCommandPremiumPage() {
  return (
    <div className={ms.merge}>
      {/* ============ HERO / TOP — from premium-fintech ============ */}
      <div className={ps.page} style={{ minHeight: "auto" }}>
        <div className={ps.grid} aria-hidden="true" />

        {/* nav (anchors repointed to the merged Toolkit-down sections) */}
        <header className={ps.nav}>
          <div className={`${ps.wrap} ${ps.navInner}`}>
            <a href="#top" className={ps.brand}>
              <span className={ps.brandMark} aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <polyline points="3,16 8,11 12,14 21,5" fill="none" stroke="#b6ff3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="3" y1="20" x2="21" y2="20" stroke="#38e1ff" strokeWidth="1.5" opacity="0.6" />
                </svg>
              </span>
              Range<span className={ps.acid}>Clarity</span>
            </a>
            <nav className={ps.navLinks}>
              <a href="#modules">Toolkit</a>
              <a href="#how">How it thinks</a>
              <a href="#chart">Sample</a>
            </nav>
            <a href="#join" className={ps.navCta}>Early Access</a>
          </div>
        </header>

        {/* hero */}
        <section id="top" className={ps.hero}>
          <div className={ps.glowA} aria-hidden="true" />
          <div className={ps.glowB} aria-hidden="true" />
          <div className={`${ps.wrap} ${ps.heroGrid}`}>
            <div>
              <span className={ps.badge}>
                <span className={ps.pulse} style={{ width: 6, height: 6, borderRadius: 999, background: "#b6ff3c" }} />
                EARLY ACCESS · v0.1 TOOLKIT
              </span>
              <h1 className={ps.h1}>
                See the range <span className={ps.grad}>before you move.</span>
              </h1>
              <p className={ps.sub}>
                RangeClarity turns messy price action into a visual decision map — showing support,
                resistance, momentum, entry quality, and risk before you chase the move.
              </p>
              <div className={ps.ctaRow}>
                <a href="#join" className={ps.ctaPrimary}>Join Early Access <span aria-hidden="true">→</span></a>
                <a href="#chart" className={ps.ctaGhost}>View Sample Range Map</a>
              </div>
              <div className={ps.heroChips}>
                <span>● SUPPORT / RESISTANCE</span>
                <span>● MOMENTUM LIFECYCLE</span>
                <span>● RISK / REWARD</span>
              </div>
            </div>

            {/* decision-map dashboard */}
            <div className={`${ps.dash} ${ps.float}`}>
              <div className={ps.dashGlow} aria-hidden="true" />
              <div className={ps.dashFrame}>
                <div className={ps.dashHead}>
                  <div className={ps.dots}>
                    <span className={ps.d} style={{ background: "#ff5c87cc" }} />
                    <span className={ps.d} style={{ background: "#b6ff3ccc" }} />
                    <span className={ps.d} style={{ background: "#38e1ffcc" }} />
                  </div>
                  <span className={ps.mono} style={{ fontSize: 11, letterSpacing: "0.16em", color: "#8a99bf" }}>
                    DECISION MAP · ASTS
                  </span>
                  <span className={ps.mono} style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.16em", color: "#b6ff3c", background: "rgba(182,255,60,0.15)", padding: "2px 8px", borderRadius: 4 }}>
                    LIVE
                  </span>
                </div>
                <div className={ps.dashBody}>
                  <div className={ps.scoreCard}>
                    <svg viewBox="0 0 120 120" width="112" height="112" style={{ transform: "rotate(-90deg)" }}>
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#1c2740" strokeWidth="10" />
                      <circle cx="60" cy="60" r="50" fill="none" stroke="url(#sg)" strokeWidth="10" strokeLinecap="round" strokeDasharray={`${(78 / 100) * 314} 314`} />
                      <defs>
                        <linearGradient id="sg" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#b6ff3c" />
                          <stop offset="100%" stopColor="#38e1ff" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div style={{ marginTop: "-4.6rem", textAlign: "center" }}>
                      <div className={ps.gaugeNum}>78</div>
                      <div className={ps.mono} style={{ fontSize: 10, letterSpacing: "0.16em", color: "#8a99bf" }}>RANGE SCORE</div>
                    </div>
                    <div className={ps.mono} style={{ marginTop: "2.6rem", fontSize: 10, letterSpacing: "0.16em", color: "#8a99bf" }}>UPPER RANGE</div>
                  </div>
                  <div>
                    <div className={ps.zoneCard}>
                      <div className={ps.zoneTop}><span>SUPPORT</span><span>RESISTANCE</span></div>
                      <div className={ps.zoneBar}><span className={ps.zoneMark} style={{ left: "78%" }} /></div>
                      <div className={ps.zoneScale}><span>$28.50</span><span style={{ color: "#b6ff3c" }}>● $39.40</span><span>$42.00</span></div>
                    </div>
                    <div className={ps.miniGrid}>
                      <div className={ps.miniCard} style={{ border: "1px solid rgba(56,225,255,0.25)", background: "rgba(56,225,255,0.05)" }}>
                        <div className={ps.miniLabel}>MOMENTUM</div>
                        <div className={ps.miniValue} style={{ color: "#38e1ff" }}>Strong · Extended</div>
                      </div>
                      <div className={ps.miniCard} style={{ border: "1px solid rgba(176,123,255,0.25)", background: "rgba(176,123,255,0.05)" }}>
                        <div className={ps.miniLabel}>RISK / REWARD</div>
                        <div className={ps.miniValue} style={{ color: "#b07bff" }}>1 : 2.4</div>
                      </div>
                    </div>
                    <div className={ps.verdict}>
                      <span className={ps.mono} style={{ fontSize: 11, letterSpacing: "0.16em", color: "#8a99bf" }}>VERDICT</span>
                      <span className={ps.verdictVal}>WAIT FOR PULLBACK</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* premium → toolkit seam */}
      <div className={ms.seam} aria-hidden="true" />

      {/* ============ TOOLKIT → FOOTER — from range-command-v2 ============ */}
      <div className={`${vs.page} ${ms.lowerBlock}`}>
        <div className={vs.grid} aria-hidden="true" />

        {/* indicator modules */}
        <section id="modules" className={vs.section}>
          <div className={vs.wrap}>
            <div className={`${vs.head} ${vs.headCenter}`}>
              <span className={vs.eyebrow}>The Toolkit</span>
              <h2 className={vs.h2}>Three modules. One clear call.</h2>
              <p className={vs.lead}>
                Each module is a collectible panel in your market command center — built to answer one
                question well.
              </p>
            </div>
            <div className={vs.modGrid}>
              {MODULES.map((m) => (
                <ModuleCardV2 key={m.id} m={m} />
              ))}
            </div>
          </div>
        </section>

        {/* mock tradingview chart */}
        <section id="chart" className={vs.section}>
          <div className={vs.wrap}>
            <div className={`${vs.head} ${vs.headCenter}`}>
              <span className={vs.eyebrow}>Sample Read · ASTS</span>
              <h2 className={vs.h2}>One ticker, fully read</h2>
              <p className={vs.lead}>
                Mock data — but this is exactly how a read lands on your chart: structure first, verdict
                last.
              </p>
            </div>
            <div style={{ marginTop: "2.5rem" }}>
              <MockTradingViewChartV2 />
            </div>
          </div>
        </section>

        {/* how it works */}
        <section id="how" className={vs.section}>
          <div className={vs.wrap}>
            <div className={`${vs.head} ${vs.headCenter}`}>
              <span className={vs.eyebrow}>How it works</span>
              <h2 className={vs.h2}>From chart to decision in five steps</h2>
            </div>
            <div className={vs.steps}>
              {STEPS.map((st) => (
                <div key={st.n} className={vs.step}>
                  <div className={vs.stepNum}><span>{st.n}</span></div>
                  <h3 className={vs.stepT}>{st.t}</h3>
                  <p className={vs.stepD}>{st.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* what it's NOT */}
        <section id="not" className={vs.section}>
          <div className={vs.wrap}>
            <div className={vs.notWrap}>
              <div className={vs.head}>
                <span className={vs.eyebrow}>Clarity, not hype</span>
                <h2 className={vs.h2}>What RangeClarity is <span className={vs.gradGold}>not</span>.</h2>
                <p className={vs.lead}>
                  We are deliberate about what this tool is. It is decision support for reading
                  structure — nothing more, and nothing it can&apos;t honestly be.
                </p>
              </div>
              <div className={vs.notList}>
                {NOTS.map((n) => (
                  <div key={n} className={vs.notItem}>
                    <span className={vs.notX} aria-hidden="true">✕</span>
                    {n}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* pricing */}
        <PricingSectionV2 />

        {/* faq */}
        <FAQSectionV2 />

        {/* final cta */}
        <section id="join" className={vs.section}>
          <div className={vs.wrap}>
            <div className={vs.finalCard}>
              <span className={vs.badge}>
                <span className={vs.pulse} style={{ width: 6, height: 6, borderRadius: 999, background: "#34f5b0" }} />
                EARLY ACCESS · LIMITED SEATS
              </span>
              <h2 className={vs.h2} style={{ marginTop: "1.4rem" }}>
                Stop chasing candles. <span className={vs.grad}>Start reading the range.</span>
              </h2>
              <form className={vs.finalForm} action="#" aria-label="Join early access">
                <input className={vs.input} type="email" placeholder="you@portfolio.com" aria-label="Email address" />
                <button type="button" className={vs.btnPrimary}>Join Early Access <span aria-hidden="true">→</span></button>
              </form>
              <p className={vs.mono} style={{ marginTop: "1rem", fontSize: 12, letterSpacing: "0.05em", color: "#5d6a8c" }}>
                No spam. No signals-for-hire. Just the range, clearly.
              </p>
            </div>
          </div>
        </section>

        {/* footer */}
        <footer className={vs.footer}>
          <div className={`${vs.wrap} ${vs.footInner}`}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontWeight: 800, color: "#fff" }}>Range<span className={vs.g}>Clarity</span></span>
              <span className={vs.mono} style={{ fontSize: 12, color: "#5d6a8c" }}>· See the range before you make the move.</span>
            </div>
            <div className={vs.footLinks}>
              <a href="#modules">Modules</a>
              <a href="#pricing">Pricing</a>
              <a href="#faq">FAQ</a>
              <Link href="/designs">All designs</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

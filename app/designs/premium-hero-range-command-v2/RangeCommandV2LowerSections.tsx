import Link from "next/link";
import { MODULES, NOTS, STEPS } from "../range-command-v2/data";
import FAQSectionV2 from "../range-command-v2/_components/FAQSectionV2";
import MockTradingViewChartV2 from "../range-command-v2/_components/MockTradingViewChartV2";
import ModuleCardV2 from "../range-command-v2/_components/ModuleCardV2";
import PricingSectionV2 from "../range-command-v2/_components/PricingSectionV2";
import s from "../range-command-v2/v2.module.css";

export function RangeCommandV2LowerSections() {
  return (
    <>
      <span id="indicator-modules" className="sr-only" aria-hidden="true" />

      {/* indicator modules */}
      <section id="modules" className={s.section}>
        <div className={s.wrap}>
          <div className={`${s.head} ${s.headCenter}`}>
            <span className={s.eyebrow}>What it shows</span>
            <h2 className={s.h2}>Three modules. One clean read.</h2>
            <p className={s.lead}>
              Each module answers one question about market structure - clearly, with no clutter.
            </p>
          </div>
          <div className={s.modGrid}>
            {MODULES.map((m) => (
              <ModuleCardV2 key={m.id} m={m} />
            ))}
          </div>
        </div>
      </section>

      {/* sample tradingview chart (illustration) */}
      <section id="chart" className={s.section}>
        <div className={s.wrap}>
          <div className={`${s.head} ${s.headCenter}`}>
            <span className={s.eyebrow}>Sample Read - ASTS</span>
            <h2 className={s.h2}>One ticker, fully read</h2>
            <p className={s.lead}>
              Example read - not real prices, but exactly how a read lands on your chart: structure first,
              verdict last.
            </p>
          </div>
          <div style={{ marginTop: "2.5rem" }}>
            <MockTradingViewChartV2 />
          </div>
        </div>
      </section>

      {/* how it works */}
      <section id="how" className={s.section}>
        <div className={s.wrap}>
          <div className={`${s.head} ${s.headCenter}`}>
            <span className={s.eyebrow}>How it works</span>
            <h2 className={s.h2}>How RangeClarity reads a chart</h2>
          </div>
          <div className={s.steps}>
            {STEPS.map((st) => (
              <div key={st.n} className={s.step}>
                <div className={s.stepNum}>
                  <span>{st.n}</span>
                </div>
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
              <h2 className={s.h2}>
                What RangeClarity is <span className={s.gradGold}>not</span>.
              </h2>
              <p className={s.lead}>
                We are deliberate about what this tool is. It is decision support for reading
                structure - nothing more, and nothing it can&apos;t honestly be.
              </p>
            </div>
            <div className={s.notList}>
              {NOTS.map((n) => (
                <div key={n} className={s.notItem}>
                  <span className={s.notX} aria-hidden="true">x</span>
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
      <section id="join" className={s.section}>
        <span id="early-access" className="sr-only" aria-hidden="true" />
        <div className={s.wrap}>
          <div className={s.finalCard}>
            <span className={s.badge}>
              <span className={s.pulse} style={{ width: 6, height: 6, borderRadius: 999, background: "#34f5b0" }} />
              PRIVATE BETA - INVITE-ONLY
            </span>
            <h2 className={s.h2} style={{ marginTop: "1.4rem" }}>
              Stop chasing candles. <span className={s.grad}>Start reading the range.</span>
            </h2>
            <div className={s.finalForm}>
              <Link className={s.btnPrimary} href="/beta?plan=beta_29">
                Get Beta Access
              </Link>
            </div>
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
            <span style={{ fontWeight: 800, color: "#fff" }}>
              Range<span className={s.g}>Clarity</span>
            </span>
            <span className={s.mono} style={{ fontSize: 12, color: "#5d6a8c" }}>
              - See the range before you make the move.
            </span>
          </div>
          <div className={s.footLinks}>
            <a href="#modules">Modules</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </div>
        </div>
      </footer>
    </>
  );
}

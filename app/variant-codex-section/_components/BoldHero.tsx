/* ============================================================
   Bold Hero — faithful recreation of the older Codex hero section
   (from the attached screenshot). Visual direction only; reuses the
   project's existing brand colors. Mock copy. Scoped CSS module.
   ============================================================ */
import s from "./boldhero.module.css";
import MascotPlaceholder from "./MascotPlaceholder";

const CHIPS = ["TradingView-first", "Three named modules", "No black-box signals", "Mock preview only"];

const POSTURE = [
  {
    label: "SUITE PACKAGING",
    title: "Range · Momentum · Entry · Risk",
    body: "Four named modules in one premium TradingView indicator suite.",
  },
  {
    label: "DECISION POSTURE",
    title: "Buy / wait / avoid context",
    body: "Descriptive structure reads, never buy/sell signals or guarantees.",
  },
  {
    label: "LAUNCH POSTURE",
    title: "Early access — mock preview",
    body: "Join the waitlist now; live charts and module rollout to follow.",
  },
];

export default function BoldHero() {
  return (
    <section className={s.hero} id="top">
      <div className={s.grid} aria-hidden="true" />
      <div className={s.glow} aria-hidden="true" />

      <div className={s.wrap}>
        <div className={s.cols}>
          {/* left: copy */}
          <div className={s.copy}>
            <span className={s.badge}>
              <span className={s.dot} aria-hidden="true" />
              PREMIUM TRADINGVIEW INDICATOR SUITE · RANGE READING MODE
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

            <div className={s.ctaRow}>
              <a href="#join" className={s.ctaPrimary}>Join Early Access</a>
              <a href="#modules" className={s.ctaGhost}>View Indicator Modules</a>
            </div>

            <p className={s.micro}>No repaint hype. No guaranteed signals. Just cleaner chart context.</p>

            <div className={s.chips}>
              {CHIPS.map((c) => (
                <span key={c} className={s.chip}>{c}</span>
              ))}
            </div>
          </div>

          {/* right: mascot panel */}
          <div className={s.showcase}>
            <div className={s.mascotPanel}>
              <div className={s.panelGrid} aria-hidden="true" />
              <span className={s.placeholderTag}>Placeholder art</span>
              <div className={s.mascotWrap}>
                <MascotPlaceholder />
              </div>
            </div>
          </div>
        </div>

        {/* posture cards */}
        <div className={s.postureRow}>
          {POSTURE.map((p) => (
            <article key={p.label} className={s.postureCard}>
              <span className={s.postureLabel}>{p.label}</span>
              <h3 className={s.postureTitle}>{p.title}</h3>
              <p className={s.postureBody}>{p.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

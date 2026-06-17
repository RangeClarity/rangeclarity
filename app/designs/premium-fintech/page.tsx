import type { CSSProperties } from "react";
import Link from "next/link";
import s from "./premium.module.css";

/* ============================================================
   /designs/premium-fintech
   Faithful vanilla-CSS recreation of the Codex "premium-fintech"
   design (originally Tailwind v4). Mock data only.
   ============================================================ */

type Accent = { hex: string; hex2: string };

const TOOLKIT = [
  {
    id: "range",
    pill: "THE RANGE",
    title: "Range Map Toolkit",
    description:
      "Instantly see where price sits inside the current structure — near support, resistance, breakout, or danger zone.",
    stats: [
      { value: "0–100", label: "Range Score" },
      { value: "3", label: "Key Zones" },
      { value: "1", label: "Decision Map" },
    ],
    bullets: [
      "Support and resistance zones",
      "Current price position inside range",
      "Wait / Watch / Act context",
    ],
    accent: { hex: "#b6ff3c", hex2: "#ffe14d" },
    visual: "range" as const,
  },
  {
    id: "momentum",
    pill: "THE MOMENTUM",
    title: "Momentum Engine",
    description:
      "Detect whether the move is strengthening, fading, compressing, or breaking out.",
    stats: [
      { value: "10", label: "Momentum Stages" },
      { value: "5", label: "Signal Inputs" },
      { value: "LIVE", label: "Trend State" },
    ],
    bullets: ["Momentum lifecycle", "Breakout watch", "Weakness and rejection zones"],
    accent: { hex: "#38e1ff", hex2: "#5b8cff" },
    visual: "momentum" as const,
  },
  {
    id: "risk",
    pill: "THE RISK",
    title: "Risk Radar",
    description:
      "Understand whether the setup gives you enough upside compared with nearby downside risk.",
    stats: [
      { value: "R / R", label: "Risk / Reward" },
      { value: "A–F", label: "Entry Quality" },
      { value: "3", label: "Alert Zones" },
    ],
    bullets: ["Late-entry warning", "Downside zone mapping", "Better patience signals"],
    accent: { hex: "#b07bff", hex2: "#ff5c87" },
    visual: "radar" as const,
  },
];

const STEPS = [
  { step: "01", title: "Fundamental Thesis", detail: "Start with a reason to own it — not a candle." },
  { step: "02", title: "Range Structure", detail: "Map support, resistance, and where price lives now." },
  { step: "03", title: "Momentum Confirmation", detail: "Is the move strengthening, fading, or compressing?" },
  { step: "04", title: "Entry Quality", detail: "Grade the setup: chasing, fair, or patient." },
  { step: "05", title: "Decision", detail: "Buy, wait, or sell — with the range in full view." },
];

const SAMPLE = {
  ticker: "ASTS",
  name: "Sample Range Map",
  pricePosition: "Upper Range",
  rangeScore: 78,
  support: "$28.50 – $31.00",
  resistance: "$39.00 – $42.00",
  momentum: "Strong but Extended",
  entryQuality: "Wait for Pullback",
  riskLevel: "Medium / High",
  verdict: "WAIT",
};

const DISCLAIMER =
  "RangeClarity is a visual decision-support tool for long-term investors. It is not financial advice, not a signal bot, and not a guarantee of profit. All data shown is illustrative mock data.";

function cssVars(accent: Accent): CSSProperties {
  return {
    ["--c" as string]: accent.hex,
    ["--c2" as string]: accent.hex2,
    ["--cardc" as string]: `${accent.hex}33`,
  };
}

/* ---- card visuals (CSS/SVG, no images) ---- */
function RangeVisual({ accent }: { accent: Accent }) {
  const candles = [38, 30, 46, 52, 44, 58, 50, 64, 70, 66, 78, 72];
  return (
    <div
      className={s.visual}
      style={{
        background: `radial-gradient(120% 120% at 0% 0%, ${accent.hex}1f 0%, transparent 55%), radial-gradient(120% 120% at 100% 100%, ${accent.hex2}1a 0%, transparent 55%), #070b14`,
      }}
    >
      <span className={s.visualTag} style={{ color: accent.hex, background: `${accent.hex}1a` }}>
        RANGE MAP
      </span>
      <svg viewBox="0 0 320 176" style={{ position: "absolute", inset: 0, height: "100%", width: "100%" }}>
        <rect x="0" y="34" width="320" height="22" fill={`${accent.hex}14`} />
        <line x1="0" y1="34" x2="320" y2="34" stroke={accent.hex} strokeWidth="1" strokeDasharray="5 5" opacity="0.7" />
        <rect x="0" y="122" width="320" height="22" fill={`${accent.hex2}14`} />
        <line x1="0" y1="144" x2="320" y2="144" stroke={accent.hex2} strokeWidth="1" strokeDasharray="5 5" opacity="0.7" />
        {candles.map((h, i) => {
          const x = 22 + i * 24;
          const top = 150 - h * 1.4;
          const col = i % 2 === 0 ? accent.hex : accent.hex2;
          return (
            <g key={i}>
              <line x1={x} y1={top - 8} x2={x} y2={top + h - 4} stroke={col} strokeWidth="1.5" opacity="0.55" />
              <rect x={x - 5} y={top} width="10" height={Math.max(h * 0.5, 8)} rx="1.5" fill={col} opacity="0.85" />
            </g>
          );
        })}
        <g className={s.float}>
          <circle cx="296" cy="58" r="5" fill={accent.hex} />
          <circle cx="296" cy="58" r="10" fill="none" stroke={accent.hex} strokeWidth="1" className={s.pulse} />
        </g>
      </svg>
      <div className={s.visualFoot}>
        <span style={{ color: accent.hex }}>● RESIST</span>
        <span style={{ color: "#c7d2e8" }}>PRICE: UPPER RANGE</span>
        <span style={{ color: accent.hex2 }}>● SUPPORT</span>
      </div>
    </div>
  );
}

function MomentumVisual({ accent }: { accent: Accent }) {
  const nodes = [[40, 60], [110, 38], [110, 96], [180, 60], [250, 44], [250, 92], [292, 68]];
  const links: [number, number][] = [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [3, 5], [4, 6], [5, 6]];
  const bars = [30, 48, 62, 80, 70, 90, 76, 58, 40, 88];
  return (
    <div
      className={s.visual}
      style={{
        background: `radial-gradient(120% 120% at 0% 0%, ${accent.hex}1f 0%, transparent 55%), radial-gradient(120% 120% at 100% 100%, ${accent.hex2}1a 0%, transparent 55%), #070b14`,
      }}
    >
      <span className={s.visualTag} style={{ color: accent.hex, background: `${accent.hex}1a` }}>
        MOMENTUM ENGINE
      </span>
      <svg viewBox="0 0 320 176" style={{ position: "absolute", inset: 0, height: "100%", width: "100%" }}>
        {links.map(([a, b], i) => (
          <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke={accent.hex} strokeWidth="1" opacity="0.35" />
        ))}
        {nodes.map(([x, y], i) => (
          <g key={i} className={i % 3 === 0 ? s.pulse : undefined}>
            <circle cx={x} cy={y} r={i === 3 ? 6 : 4} fill={i === 3 ? accent.hex : accent.hex2} />
            <circle cx={x} cy={y} r={i === 3 ? 12 : 8} fill="none" stroke={accent.hex} strokeWidth="0.75" opacity="0.4" />
          </g>
        ))}
        {bars.map((h, i) => (
          <rect key={i} x={20 + i * 29} y={150 - h * 0.7} width="14" height={h * 0.7} rx="2" fill={accent.hex} opacity={0.25 + (i / bars.length) * 0.6} />
        ))}
      </svg>
      <div className={s.visualFoot}>
        <span>STAGE 07 / 10</span>
        <span style={{ color: accent.hex }}>▲ STRENGTHENING</span>
      </div>
    </div>
  );
}

function RadarVisual({ accent }: { accent: Accent }) {
  const cx = 90;
  const cy = 88;
  return (
    <div
      className={s.visual}
      style={{
        background: `radial-gradient(120% 120% at 0% 0%, ${accent.hex}1f 0%, transparent 55%), radial-gradient(120% 120% at 100% 100%, ${accent.hex2}1a 0%, transparent 55%), #070b14`,
      }}
    >
      <span className={s.visualTag} style={{ color: accent.hex, background: `${accent.hex}1a` }}>
        RISK RADAR
      </span>
      <svg viewBox="0 0 320 176" style={{ position: "absolute", inset: 0, height: "100%", width: "100%" }}>
        {[20, 38, 56, 72].map((r) => (
          <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke={accent.hex} strokeWidth="0.75" opacity="0.25" />
        ))}
        <line x1={cx - 72} y1={cy} x2={cx + 72} y2={cy} stroke={accent.hex} strokeWidth="0.5" opacity="0.2" />
        <line x1={cx} y1={cy - 72} x2={cx} y2={cy + 72} stroke={accent.hex} strokeWidth="0.5" opacity="0.2" />
        <g className={s.sweep} style={{ transformOrigin: `${cx}px ${cy}px` }}>
          <path d={`M${cx} ${cy} L${cx + 72} ${cy} A72 72 0 0 0 ${cx + 51} ${cy - 51} Z`} fill={`${accent.hex}40`} />
          <line x1={cx} y1={cy} x2={cx + 72} y2={cy} stroke={accent.hex} strokeWidth="1.5" />
        </g>
        <circle cx={cx + 30} cy={cy - 24} r="3.5" fill={accent.hex} className={s.pulse} />
        <circle cx={cx - 36} cy={cy + 18} r="3" fill={accent.hex2} />
        <circle cx={cx + 18} cy={cy + 40} r="2.5" fill={accent.hex2} className={s.pulse} />
        <g transform="translate(212, 36)">
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x="0" y={i * 22} width="84" height="12" rx="3" fill="#ffffff" opacity="0.06" />
          ))}
          <rect x="0" y="0" width="64" height="12" rx="3" fill={accent.hex} opacity="0.9" />
          <rect x="0" y="22" width="40" height="12" rx="3" fill={accent.hex} opacity="0.7" />
          <rect x="0" y="44" width="72" height="12" rx="3" fill={accent.hex2} opacity="0.8" />
          <rect x="0" y="66" width="30" height="12" rx="3" fill={accent.hex} opacity="0.6" />
          <rect x="0" y="88" width="52" height="12" rx="3" fill={accent.hex2} opacity="0.7" />
        </g>
      </svg>
      <div className={s.visualFoot}>
        <span style={{ color: accent.hex }}>◎ SCANNING</span>
        <span style={{ color: "#c7d2e8" }}>R/R 1 : 2.4</span>
      </div>
    </div>
  );
}

function CardVisual({ visual, accent }: { visual: "range" | "momentum" | "radar"; accent: Accent }) {
  if (visual === "range") return <RangeVisual accent={accent} />;
  if (visual === "momentum") return <MomentumVisual accent={accent} />;
  return <RadarVisual accent={accent} />;
}

function SampleRow({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className={s.row}>
      <span className={s.rowLabel}>{label}</span>
      <span className={s.rowValue} style={{ color: tone }}>{value}</span>
    </div>
  );
}

export default function PremiumFintechPage() {
  return (
    <div className={s.page}>
      <div className={s.grid} aria-hidden="true" />

      {/* nav */}
      <header className={s.nav}>
        <div className={`${s.wrap} ${s.navInner}`}>
          <a href="#top" className={s.brand}>
            <span className={s.brandMark} aria-hidden="true">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <polyline points="3,16 8,11 12,14 21,5" fill="none" stroke="#b6ff3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="3" y1="20" x2="21" y2="20" stroke="#38e1ff" strokeWidth="1.5" opacity="0.6" />
              </svg>
            </span>
            Range<span className={s.acid}>Clarity</span>
          </a>
          <nav className={s.navLinks}>
            <a href="#toolkit">Toolkit</a>
            <a href="#process">How it thinks</a>
            <a href="#sample">Sample</a>
          </nav>
          <a href="#join" className={s.navCta}>Early Access</a>
        </div>
      </header>

      {/* hero */}
      <section id="top" className={s.hero}>
        <div className={s.glowA} aria-hidden="true" />
        <div className={s.glowB} aria-hidden="true" />
        <div className={`${s.wrap} ${s.heroGrid}`}>
          <div>
            <span className={s.badge}>
              <span className={s.pulse} style={{ width: 6, height: 6, borderRadius: 999, background: "#b6ff3c" }} />
              EARLY ACCESS · v0.1 TOOLKIT
            </span>
            <h1 className={s.h1}>
              See the range <span className={s.grad}>before you move.</span>
            </h1>
            <p className={s.sub}>
              RangeClarity turns messy price action into a visual decision map — showing support,
              resistance, momentum, entry quality, and risk before you chase the move.
            </p>
            <div className={s.ctaRow}>
              <a href="#join" className={s.ctaPrimary}>Join Early Access <span aria-hidden="true">→</span></a>
              <a href="#sample" className={s.ctaGhost}>View Sample Range Map</a>
            </div>
            <div className={s.heroChips}>
              <span>● SUPPORT / RESISTANCE</span>
              <span>● MOMENTUM LIFECYCLE</span>
              <span>● RISK / REWARD</span>
            </div>
          </div>

          {/* decision-map dashboard */}
          <div className={`${s.dash} ${s.float}`}>
            <div className={s.dashGlow} aria-hidden="true" />
            <div className={s.dashFrame}>
              <div className={s.dashHead}>
                <div className={s.dots}>
                  <span className={s.d} style={{ background: "#ff5c87cc" }} />
                  <span className={s.d} style={{ background: "#b6ff3ccc" }} />
                  <span className={s.d} style={{ background: "#38e1ffcc" }} />
                </div>
                <span className={s.mono} style={{ fontSize: 11, letterSpacing: "0.16em", color: "#8a99bf" }}>
                  DECISION MAP · ASTS
                </span>
                <span className={s.mono} style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.16em", color: "#b6ff3c", background: "rgba(182,255,60,0.15)", padding: "2px 8px", borderRadius: 4 }}>
                  LIVE
                </span>
              </div>
              <div className={s.dashBody}>
                <div className={s.scoreCard}>
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
                    <div className={s.gaugeNum}>78</div>
                    <div className={s.mono} style={{ fontSize: 10, letterSpacing: "0.16em", color: "#8a99bf" }}>RANGE SCORE</div>
                  </div>
                  <div className={s.mono} style={{ marginTop: "2.6rem", fontSize: 10, letterSpacing: "0.16em", color: "#8a99bf" }}>UPPER RANGE</div>
                </div>
                <div>
                  <div className={s.zoneCard}>
                    <div className={s.zoneTop}><span>SUPPORT</span><span>RESISTANCE</span></div>
                    <div className={s.zoneBar}><span className={s.zoneMark} style={{ left: "78%" }} /></div>
                    <div className={s.zoneScale}><span>$28.50</span><span style={{ color: "#b6ff3c" }}>● $39.40</span><span>$42.00</span></div>
                  </div>
                  <div className={s.miniGrid}>
                    <div className={s.miniCard} style={{ border: "1px solid rgba(56,225,255,0.25)", background: "rgba(56,225,255,0.05)" }}>
                      <div className={s.miniLabel}>MOMENTUM</div>
                      <div className={s.miniValue} style={{ color: "#38e1ff" }}>Strong · Extended</div>
                    </div>
                    <div className={s.miniCard} style={{ border: "1px solid rgba(176,123,255,0.25)", background: "rgba(176,123,255,0.05)" }}>
                      <div className={s.miniLabel}>RISK / REWARD</div>
                      <div className={s.miniValue} style={{ color: "#b07bff" }}>1 : 2.4</div>
                    </div>
                  </div>
                  <div className={s.verdict}>
                    <span className={s.mono} style={{ fontSize: 11, letterSpacing: "0.16em", color: "#8a99bf" }}>VERDICT</span>
                    <span className={s.verdictVal}>WAIT FOR PULLBACK</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* toolkit */}
      <section id="toolkit" className={s.section}>
        <div className={s.wrap}>
          <div className={s.head}>
            <span className={s.eyebrow}>THE TOOLKIT</span>
            <h2 className={s.h2}>Three modules. One clear call.</h2>
            <p className={s.lead}>
              Each module is a collectible panel in your market command center — built to answer one question well.
            </p>
          </div>
          <div className={s.cards}>
            {TOOLKIT.map((card) => (
              <article key={card.id} className={s.card} style={cssVars(card.accent)}>
                <div className={s.cardBar} />
                <CardVisual visual={card.visual} accent={card.accent} />
                <div style={{ marginTop: "1.25rem" }}>
                  <span className={s.pill} style={{ color: card.accent.hex, background: `${card.accent.hex}1a`, boxShadow: `inset 0 0 0 1px ${card.accent.hex}40` }}>
                    {card.pill}
                  </span>
                </div>
                <h3 className={s.cardTitle}>{card.title}</h3>
                <p className={s.cardDesc}>{card.description}</p>
                <div className={s.statRow}>
                  {card.stats.map((st) => (
                    <div key={st.label} className={s.stat}>
                      <div className={s.statVal} style={{ color: card.accent.hex }}>{st.value}</div>
                      <div className={s.statLab}>{st.label}</div>
                    </div>
                  ))}
                </div>
                <ul className={s.bullets}>
                  {card.bullets.map((b) => (
                    <li key={b}>
                      <span className={s.dotMark} style={{ background: card.accent.hex, boxShadow: `0 0 8px ${card.accent.hex}` }} />
                      {b}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* process */}
      <section id="process" className={s.section}>
        <div className={s.wrap}>
          <div className={s.head}>
            <span className={s.eyebrow}>THE METHOD</span>
            <h2 className={s.h2}>How RangeClarity thinks</h2>
            <p className={s.lead}>
              A disciplined path from thesis to decision — so you act on structure, not adrenaline.
            </p>
          </div>
          <div className={s.processWrap}>
            <div className={s.processLine} aria-hidden="true" />
            <ol className={s.steps}>
              {STEPS.map((st) => (
                <li key={st.step} className={s.step}>
                  <div className={s.stepNum}><span>{st.step}</span></div>
                  <h3 className={s.stepTitle}>{st.title}</h3>
                  <p className={s.stepDetail}>{st.detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* sample analysis */}
      <section id="sample" className={s.section}>
        <div className={s.wrap}>
          <div className={s.head}>
            <span className={s.eyebrow}>SAMPLE RANGE MAP</span>
            <h2 className={s.h2}>One ticker, fully read</h2>
            <p className={s.lead}>
              Mock data — but this is exactly how a real read lands: structure first, verdict last.
            </p>
          </div>
          <div className={s.sample}>
            <div className={s.sampleCard}>
              <div className={s.sampleHead}>
                <div className={s.sampleTicker}>
                  <span className={s.tickMark}>{SAMPLE.ticker.slice(0, 2)}</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "1.25rem", color: "#fff" }}>{SAMPLE.ticker}</div>
                    <div className={s.mono} style={{ fontSize: 11, letterSpacing: "0.16em", color: "#8a99bf" }}>{SAMPLE.name}</div>
                  </div>
                </div>
                <span className={s.sampleVerdict}>VERDICT · {SAMPLE.verdict}</span>
              </div>
              <div className={s.sampleBody}>
                <div className={s.rangeCol}>
                  <div className={s.zoneTop} style={{ marginBottom: "0.75rem" }}>
                    <span>RANGE SCORE</span>
                    <span style={{ color: "#b6ff3c" }}>{SAMPLE.rangeScore} / 100 · {SAMPLE.pricePosition}</span>
                  </div>
                  <div className={s.sampleBar}>
                    <span className={s.sampleMark} style={{ left: `${SAMPLE.rangeScore}%` }}>●</span>
                  </div>
                  <div style={{ marginTop: "0.75rem", display: "flex", justifyContent: "space-between" }} className={s.mono}>
                    <span style={{ fontSize: 11, color: "#c7d2e8" }}>SUPPORT</span>
                    <span style={{ fontSize: 11, color: "#c7d2e8" }}>RESISTANCE</span>
                  </div>
                  <div style={{ marginTop: "0.25rem", display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "0.9rem" }}>
                    <span style={{ color: "#6ee7b7" }}>{SAMPLE.support}</span>
                    <span style={{ color: "#ff5c87" }}>{SAMPLE.resistance}</span>
                  </div>
                  <div className={s.note}>
                    Price is sitting in the <span style={{ color: "#c7d2e8" }}>upper third</span> of its range.
                    Plenty of room was already taken — the reward left is thin against the drop back to support.
                  </div>
                </div>
                <div className={s.readCol}>
                  <SampleRow label="Price Position" value={SAMPLE.pricePosition} tone="#38e1ff" />
                  <SampleRow label="Support Zone" value={SAMPLE.support} tone="#6ee7b7" />
                  <SampleRow label="Resistance Zone" value={SAMPLE.resistance} tone="#ff5c87" />
                  <SampleRow label="Momentum" value={SAMPLE.momentum} tone="#38e1ff" />
                  <SampleRow label="Entry Quality" value={SAMPLE.entryQuality} tone="#b6ff3c" />
                  <SampleRow label="Risk Level" value={SAMPLE.riskLevel} tone="#b07bff" />
                  <div className={s.callout}>
                    <span style={{ display: "grid", placeItems: "center", width: 36, height: 36, flex: "none", borderRadius: 999, background: "rgba(182,255,60,0.15)", color: "#b6ff3c" }}>◷</span>
                    <p><span style={{ fontWeight: 700, color: "#b6ff3c" }}>Wait for pullback.</span> Better entries cluster nearer support — patience improves the risk/reward.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* final cta */}
      <section id="join" className={s.section}>
        <div className={s.wrap}>
          <div className={s.join}>
            <div className={s.joinCard}>
              <div className={s.joinGlow} aria-hidden="true" />
              <span className={s.badge}>
                <span className={s.pulse} style={{ width: 6, height: 6, borderRadius: 999, background: "#b6ff3c" }} />
                EARLY ACCESS · LIMITED SEATS
              </span>
              <h2 className={s.h2} style={{ marginTop: "1.5rem" }}>
                Stop chasing candles. <span className={s.grad}>Start reading the range.</span>
              </h2>
              <form className={s.joinForm} action="#" aria-label="Join early access">
                <input className={s.input} type="email" placeholder="you@portfolio.com" aria-label="Email address" />
                <button type="button" className={s.ctaPrimary}>Join Early Access <span aria-hidden="true">→</span></button>
              </form>
              <p className={s.mono} style={{ marginTop: "1rem", fontSize: 11, letterSpacing: "0.06em", color: "#8a99bf" }}>
                No spam. No signals-for-hire. Just the range, clearly.
              </p>
            </div>
            <p className={s.disclaimer}>{DISCLAIMER}</p>
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className={s.footer}>
        <div className={`${s.wrap} ${s.footerInner}`}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontWeight: 800, color: "#fff" }}>Range<span className={s.acid}>Clarity</span></span>
            <span className={s.mono} style={{ fontSize: 11, color: "#8a99bf" }}>· See the range before you make the move.</span>
          </div>
          <div className={s.footLinks}>
            <a href="#toolkit">Toolkit</a>
            <a href="#process">Method</a>
            <a href="#sample">Sample</a>
            <Link href="/designs">All designs</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

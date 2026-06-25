/* RangeClarity Visual Guide — section components (reusable, presentational).
   All content mirrors pine/rangeclarity_ultimate_core.pine. Mock visuals only. */
import Link from "next/link";
import s from "./guide.module.css";
import { Chip, ScoreBar, Meter, SectionHead, DashboardMock, MiniPattern } from "./ui";
import { ChartAnatomy, ANATOMY_LEGEND } from "./ChartAnatomy";
import {
  TONE,
  CAPABILITIES,
  DASHBOARD_ROWS,
  REGIMES,
  STRUCTURE,
  MOMENTUM,
  CONFIDENCE,
  NO_EDGE_REASONS,
  CONTEXT_LABELS,
  WORKFLOW,
  EXAMPLES,
  NOT_MEANT,
  FAQ,
  DISCLAIMER,
  QUICK_FIELDS,
} from "./data";

export function IndicatorGuideHero() {
  return (
    <header className={s.hero}>
      <span className={s.heroPill}>RangeClarity · Indicator Guide</span>
      <h1 className={s.h1}>RangeClarity Indicator Guide</h1>
      <p className={s.heroSub}>
        A visual breakdown of what RangeClarity detects, what it shows on chart, and how to interpret it.
      </p>
      <p className={s.heroLead}>
        RangeClarity is a TradingView chart-structure indicator that helps you read regime, structure,
        support/resistance, range position, momentum, confidence, and no-edge conditions — in one clean dashboard.
      </p>
      <div className={s.glanceGrid}>
        <div className={s.glance}>
          <span className={s.glanceK}>What it is</span>
          <p>A decision-support dashboard. Simple on the surface, complex underneath.</p>
        </div>
        <div className={s.glance}>
          <span className={s.glanceK}>Who it&apos;s for</span>
          <p>Swing traders and long-term investors timing their own watchlist.</p>
        </div>
        <div className={s.glance}>
          <span className={s.glanceK}>What it helps avoid</span>
          <p>Chasing late near resistance and acting when there is no edge.</p>
        </div>
        <div className={s.glance}>
          <span className={s.glanceK}>What it is not</span>
          <p>Not signals. Not predictions. Not financial advice.</p>
        </div>
      </div>
      <div className={s.heroActions}>
        <Link className={s.btnGhost} href="/indicator-guide/print">Open print / PDF version →</Link>
      </div>
    </header>
  );
}

export function IndicatorCapabilityGrid() {
  return (
    <section className={s.section}>
      <SectionHead kicker="Section 2" title="What the indicator does" blurb="Seven things RangeClarity knows how to detect — each surfaced as a clear, readable state." />
      <div className={s.capGrid}>
        {CAPABILITIES.map((c) => (
          <article key={c.n} className={s.capCard} style={{ ["--accent" as string]: TONE[c.tone] }}>
            <div className={s.capTop}>
              <span className={s.capNum}>{String(c.n).padStart(2, "0")}</span>
              <h3 className={s.capTitle}>{c.title}</h3>
            </div>
            <p className={s.capWhat}>{c.what}</p>
            <div className={s.capMeta}>
              <span className={s.capLabel}>You see</span>
              <p>{c.sees}</p>
            </div>
            <div className={s.capMeta}>
              <span className={s.capLabel}>Why it matters</span>
              <p>{c.why}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function IndicatorVisualBreakdown() {
  return (
    <section className={s.section}>
      <SectionHead kicker="Section 3" title="Visual anatomy" blurb="Everything RangeClarity puts on your chart, labelled. (Illustration — not real prices.)" />
      <div className={s.anatomyWrap}>
        <ChartAnatomy />
      </div>
      <ol className={s.legend}>
        {ANATOMY_LEGEND.map((l) => (
          <li key={l.n} className={s.legendItem}>
            <span className={s.legendNum}>{l.n}</span>
            <div>
              <strong>{l.title}</strong>
              <p>{l.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function DashboardExplainer() {
  return (
    <section className={s.section}>
      <SectionHead kicker="Section 4" title="The dashboard, row by row" blurb="One table is the whole UI. Read it top to bottom." />
      <div className={s.dashLayout}>
        <div className={s.dashStick}>
          <DashboardMock />
          <p className={s.caption}>Dashboard illustration (top-right on chart).</p>
        </div>
        <div className={s.rowTable}>
          {DASHBOARD_ROWS.map((r) => (
            <div key={r.row} className={s.rowItem}>
              <div className={s.rowHead}>
                <span className={s.rowName}>{r.row}</span>
                <Chip tone={r.tone}>{r.example}</Chip>
              </div>
              <p className={s.rowMeans}>{r.means}</p>
              <p className={s.rowDont}><span>Don&apos;t assume:</span> {r.dont}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function RegimeExplainer() {
  return (
    <section className={s.section}>
      <SectionHead kicker="Section 5" title="Regime states" blurb="What kind of market is this? Everything else is read against this backdrop." />
      <div className={s.tileGrid}>
        {REGIMES.map((r) => (
          <article key={r.name} className={s.tile} style={{ ["--accent" as string]: TONE[r.tone] }}>
            <div className={s.tileHead}>
              <Chip tone={r.tone}>{r.name}</Chip>
            </div>
            <p className={s.tileMeans}>{r.means}</p>
            <p className={s.tileFeels}><span>Feels like:</span> {r.feels}</p>
          </article>
        ))}
        <article className={`${s.tile} ${s.tileMuted}`}>
          <div className={s.tileHead}><Chip tone="grey">No Edge*</Chip></div>
          <p className={s.tileMeans}>Not a regime — a Context result. A Chop regime (or conflict / low confidence) produces the No-Edge context.</p>
          <p className={s.tileFeels}><span>Read it as:</span> nothing clean here.</p>
        </article>
      </div>
    </section>
  );
}

export function StructureExplainer() {
  return (
    <section className={s.section}>
      <SectionHead kicker="Section 6" title="Structure states" blurb="The chart's skeleton, from confirmed swing pivots." />
      <div className={s.structGrid}>
        {STRUCTURE.map((st) => (
          <article key={st.name} className={s.structCard}>
            <MiniPattern kind={st.pattern} />
            <div>
              <Chip tone={st.tone}>{st.name}</Chip>
              <p className={s.structMeans}>{st.means}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ChartZoneExplainer() {
  return (
    <section className={s.section}>
      <SectionHead kicker="Section 7" title="Support & resistance zones" blurb="Zones, not lines — because real reactions cluster around an area." />
      <div className={s.zoneLayout}>
        <svg viewBox="0 0 360 220" className={s.zoneSvg} role="img" aria-label="Zone vs line diagram">
          <rect x="0" y="0" width="360" height="220" fill="rgba(124,160,220,0.04)" />
          <rect x="0" y="40" width="360" height="26" fill={`${TONE.red}26`} stroke={`${TONE.red}66`} />
          <text x="8" y="34" fontSize="11" fill={TONE.red} fontWeight="600">RESISTANCE — a band</text>
          <rect x="0" y="150" width="360" height="26" fill={`${TONE.green}26`} stroke={`${TONE.green}66`} />
          <text x="8" y="196" fontSize="11" fill={TONE.green} fontWeight="600">SUPPORT — a band</text>
          <polyline points="10,150 60,120 110,158 160,96 210,150 260,60 310,120 350,52" fill="none" stroke="#9fb6dd" strokeWidth="2" />
          <circle cx="160" cy="96" r="4" fill={TONE.red} />
          <circle cx="60" cy="160" r="4" fill={TONE.green} />
          <circle cx="210" cy="155" r="4" fill={TONE.green} />
        </svg>
        <div className={s.zoneNotes}>
          <div className={s.callBox} style={{ ["--accent" as string]: TONE.green }}>
            <strong>Support zone</strong>
            <p>An area below price where buyers reacted before. Price may slow or bounce — it is not guaranteed to hold.</p>
          </div>
          <div className={s.callBox} style={{ ["--accent" as string]: TONE.red }}>
            <strong>Resistance zone</strong>
            <p>An area above price where sellers reacted before. Leaning on it is a stretched, unclear location.</p>
          </div>
          <div className={s.callBox} style={{ ["--accent" as string]: TONE.amber }}>
            <strong>Near support · Mid-range · Near resistance</strong>
            <p>Range Position turns this into a 0–100% read. Low = nearer support, high = nearer resistance. <Meter pct={78} /> = 78%.</p>
          </div>
          <div className={s.callBox} style={{ ["--accent" as string]: TONE.blue }}>
            <strong>Why a band, not a line?</strong>
            <p>A precise line implies accuracy that does not exist. A band (price ± a fraction of ATR) is the honest representation.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function MomentumExplainer() {
  return (
    <section className={s.section}>
      <SectionHead kicker="Section 8" title="Momentum states" blurb="Confirmation only — momentum is never an entry trigger on its own." />
      <div className={s.momGrid}>
        {MOMENTUM.map((m) => (
          <article key={m.name} className={s.momCard}>
            <div className={s.momHead}>
              <Chip tone={m.tone}>{m.name}</Chip>
            </div>
            <ScoreBar value={m.score} tone={m.tone} label={m.name} />
            <p className={s.momNote}>{m.note}</p>
          </article>
        ))}
      </div>
      <div className={s.noteStrip}>
        <span>Key:</span> Strong ≠ good entry · Extended = chase risk · Fading = patience · Improving = watchlist interest.
      </div>
    </section>
  );
}

export function ConfidenceExplainer() {
  return (
    <section className={s.section}>
      <SectionHead kicker="Section 9" title="Confidence" blurb="How much the modules agree — alignment, NOT a probability of profit." />
      <div className={s.confLayout}>
        <div className={s.confMeters}>
          {CONFIDENCE.map((c) => (
            <div key={c.name} className={s.confRow}>
              <div className={s.confLabel}>
                <Chip tone={c.tone}>{c.name}</Chip>
                <span className={s.confBand}>{c.band}</span>
              </div>
              <ScoreBar
                value={c.name === "High" ? 82 : c.name === "Medium" ? 58 : c.name === "Low" ? 34 : 24}
                tone={c.tone}
              />
              <p className={s.confMeans}>{c.means}</p>
            </div>
          ))}
        </div>
        <aside className={s.confAside}>
          <strong>Read confidence correctly</strong>
          <p>
            A &ldquo;High&rdquo; reading means the indicator&apos;s parts agree with each other. It says nothing
            about whether your trade will work. Confidence is downgraded by explicit penalties — chop, conflict,
            mid-range, volatility shock, extension, and failed breakouts.
          </p>
        </aside>
      </div>
    </section>
  );
}

export function NoEdgeExplainer() {
  return (
    <section className={`${s.section} ${s.noEdge}`}>
      <SectionHead kicker="Section 10" title="No Edge is a feature, not a failure" blurb="When conditions aren't clean enough, the honest output is: wait." />
      <div className={s.noEdgeCompare}>
        <div className={s.compareCard} style={{ ["--accent" as string]: TONE.green }}>
          <span className={s.compareTag}>Clear context</span>
          <DashboardLine k="Regime" v="Trend" tone="green" />
          <DashboardLine k="Structure" v="Bullish (Up)" tone="green" />
          <DashboardLine k="Momentum" v="Improving" tone="blue" />
          <DashboardLine k="Confidence" v="High 78" tone="green" />
          <DashboardLine k="Context" v="Strong Context" tone="green" big />
          <p className={s.compareRead}>Modules agree. A clean read — still your decision.</p>
        </div>
        <div className={s.vs}>vs</div>
        <div className={s.compareCard} style={{ ["--accent" as string]: TONE.grey }}>
          <span className={s.compareTag}>No edge</span>
          <DashboardLine k="Regime" v="Chop" tone="grey" />
          <DashboardLine k="Structure" v="Neutral" tone="grey" />
          <DashboardLine k="Momentum" v="Fading" tone="amber" />
          <DashboardLine k="Confidence" v="Conflicting" tone="red" />
          <DashboardLine k="Context" v="No Edge" tone="grey" big />
          <p className={s.compareRead}>Nothing clean. Waiting protects you from forcing trades.</p>
        </div>
      </div>
      <div className={s.reasonGrid}>
        <span className={s.reasonHead}>No Edge / Structure Not Clear may appear when:</span>
        <ul>
          {NO_EDGE_REASONS.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function DashboardLine({ k, v, tone, big }: { k: string; v: string; tone: keyof typeof TONE; big?: boolean }) {
  return (
    <div className={s.dashRow}>
      <span className={s.dashKey}>{k}</span>
      <span className={big ? s.dashValBig : s.dashVal} style={{ color: TONE[tone] }}>{v}</span>
    </div>
  );
}

export function ContextLabels() {
  return (
    <section className={s.section}>
      <SectionHead kicker="Section 11" title="Context label library" blurb="The eight labels the Context row can show. None is a buy or sell instruction." />
      <div className={s.labelGrid}>
        {CONTEXT_LABELS.map((l) => (
          <article key={l.label} className={s.labelCard} style={{ ["--accent" as string]: TONE[l.tone] }}>
            <Chip tone={l.tone}>{l.label}</Chip>
            <p className={s.labelWhen}><span>When:</span> {l.when}</p>
            <p className={s.labelDo}><span>Consider:</span> {l.consider}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function WorkflowExplainer() {
  return (
    <section className={s.section}>
      <SectionHead kicker="Section 12" title="How to use it in practice" blurb="A simple, repeatable read — context first, decision yours." />
      <ol className={s.flow}>
        {WORKFLOW.map((w) => (
          <li key={w.step} className={s.flowStep}>
            <span className={s.flowNum}>{w.step}</span>
            <strong>{w.title}</strong>
            <p>{w.detail}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

const EX_CHARTS: Record<string, React.ReactNode> = {
  pullback: <polyline points="4,52 20,40 36,44 52,28 68,46 84,40" fill="none" stroke={TONE.green} strokeWidth="2.5" />,
  resistance: <polyline points="4,50 20,38 36,40 52,22 68,18 84,16" fill="none" stroke={TONE.amber} strokeWidth="2.5" />,
  midrange: (
    <>
      <line x1="4" y1="16" x2="84" y2="16" stroke={TONE.grey} strokeDasharray="3 3" strokeWidth="1.2" />
      <line x1="4" y1="52" x2="84" y2="52" stroke={TONE.grey} strokeDasharray="3 3" strokeWidth="1.2" />
      <polyline points="4,44 20,24 36,46 52,26 68,44 84,30" fill="none" stroke="#9fb6dd" strokeWidth="2.5" />
    </>
  ),
  compression: (
    <>
      <line x1="4" y1="22" x2="84" y2="22" stroke={TONE.grey} strokeDasharray="3 3" strokeWidth="1.2" />
      <polyline points="4,48 24,30 44,40 64,32 84,18" fill="none" stroke={TONE.teal} strokeWidth="2.5" />
    </>
  ),
  failed: (
    <>
      <line x1="4" y1="18" x2="84" y2="18" stroke={TONE.grey} strokeDasharray="3 3" strokeWidth="1.2" />
      <polyline points="4,46 22,34 38,12 50,24 66,44 84,50" fill="none" stroke={TONE.red} strokeWidth="2.5" />
    </>
  ),
};

export function ExampleScenarios() {
  return (
    <section className={s.section}>
      <SectionHead kicker="Section 13" title="Example reads" blurb="Hypothetical chart situations — educational only, not recommendations." />
      <div className={s.exGrid}>
        {EXAMPLES.map((ex) => (
          <article key={ex.title} className={s.exCard}>
            <div className={s.exTop}>
              <svg viewBox="0 0 88 64" className={s.exChart} aria-hidden="true">
                {EX_CHARTS[ex.chart]}
              </svg>
              <h3 className={s.exTitle}>{ex.title}</h3>
            </div>
            <div className={s.exRows}>
              {ex.rows.map((r) => (
                <div key={r.k} className={s.exRow}>
                  <span>{r.k}</span>
                  <span style={{ color: TONE[r.tone] }}>{r.v}</span>
                </div>
              ))}
            </div>
            <div className={s.exContext}>
              <Chip tone={ex.contextTone}>{ex.context}</Chip>
            </div>
            <p className={s.exRead}>{ex.read}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function NotMeant() {
  return (
    <section className={`${s.section} ${s.notMeant}`}>
      <SectionHead kicker="Section 14" title="What RangeClarity does NOT do" blurb="Read this before you read anything else into the dashboard." />
      <div className={s.notGrid}>
        {NOT_MEANT.map((n) => (
          <div key={n} className={s.notCard}>
            <span className={s.notX} aria-hidden="true">✕</span>
            <p>{n}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function PrintSummaryPage() {
  return (
    <section className={`${s.section} ${s.quick}`}>
      <SectionHead kicker="Section 15" title="One-page quick start" blurb="The whole indicator, condensed — ideal for a single printed page." />
      <div className={s.quickGrid}>
        <div className={s.quickCol}>
          <h3 className={s.quickH}>What it is</h3>
          <p className={s.quickP}>A TradingView chart-structure dashboard: regime, structure, support/resistance, range position, momentum, confidence, and an honest no-edge state. Context, not advice.</p>
          <h3 className={s.quickH}>Main fields</h3>
          <ul className={s.quickList}>
            {QUICK_FIELDS.map((f) => (
              <li key={f.k}><strong>{f.k}:</strong> {f.v}</li>
            ))}
          </ul>
          <h3 className={s.quickH}>No Edge</h3>
          <p className={s.quickP}>Means conditions aren&apos;t clean enough — mid-range, conflict, extended, or choppy. Waiting is a valid, valuable output.</p>
        </div>
        <div className={s.quickCol}>
          <h3 className={s.quickH}>5-step workflow</h3>
          <ol className={s.quickSteps}>
            <li>Start with your watchlist idea.</li>
            <li>Check Regime &amp; support/resistance.</li>
            <li>Check Range Position &amp; Momentum.</li>
            <li>Check Confidence; if No Edge, wait.</li>
            <li>If constructive, do your own research &amp; risk plan.</li>
          </ol>
          <h3 className={s.quickH}>Key labels</h3>
          <div className={s.quickChips}>
            {CONTEXT_LABELS.map((l) => (
              <Chip key={l.label} tone={l.tone}>{l.label}</Chip>
            ))}
          </div>
        </div>
      </div>
      <p className={s.disclaimer}>{DISCLAIMER}</p>
    </section>
  );
}

export function FAQSection() {
  return (
    <section className={s.section}>
      <SectionHead kicker="FAQ" title="Frequently asked" />
      <div className={s.faqGrid}>
        {FAQ.map((f) => (
          <div key={f.q} className={s.faqItem}>
            <h3 className={s.faqQ}>{f.q}</h3>
            <p className={s.faqA}>{f.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

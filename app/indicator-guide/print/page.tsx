import type { Metadata } from "next";
import Link from "next/link";
import p from "./print.module.css";
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
} from "../_components/data";

export const metadata: Metadata = {
  title: "RangeClarity — Indicator Handbook (Print / PDF)",
  description: "Print-optimized RangeClarity indicator handbook for PDF export.",
  robots: { index: false, follow: false },
};

function Tag({ tone, children }: { tone: keyof typeof TONE; children: React.ReactNode }) {
  const c = TONE[tone];
  return <span className={p.tag} style={{ color: c, borderColor: c, background: `${c}14` }}>{children}</span>;
}

export default function IndicatorGuidePrintPage() {
  return (
    <div className={p.doc}>
      <div className={p.toolbar} data-noprint>
        <span>Print version — use your browser&apos;s Print → Save as PDF. See RANGECLARITY_PDF_EXPORT_GUIDE.md.</span>
        <Link href="/indicator-guide" className={p.back}>← Back to interactive guide</Link>
      </div>

      {/* Page 1 — cover + at a glance */}
      <header className={p.cover}>
        <span className={p.eyebrow}>RangeClarity · Indicator Handbook</span>
        <h1 className={p.title}>RangeClarity Indicator Guide</h1>
        <p className={p.sub}>What it detects, what it shows on chart, and how to interpret it.</p>
        <p className={p.lead}>
          RangeClarity is a TradingView chart-structure indicator. It reads regime, structure, support/resistance,
          range position, momentum, confidence, and no-edge conditions — in one clean dashboard. It is a
          decision-support tool, not a signal service.
        </p>
        <div className={p.glance}>
          <div><h4>What it is</h4><p>A chart-context dashboard. Simple surface, complex engine.</p></div>
          <div><h4>Who it&apos;s for</h4><p>Swing traders &amp; long-term investors timing a watchlist.</p></div>
          <div><h4>Helps avoid</h4><p>Chasing late near resistance; acting with no edge.</p></div>
          <div><h4>What it is not</h4><p>Not signals, predictions, or financial advice.</p></div>
        </div>
      </header>

      {/* Capabilities */}
      <section className={p.section}>
        <h2 className={p.h2}>1 · What it detects</h2>
        <table className={p.table}>
          <thead><tr><th>#</th><th>Capability</th><th>You see</th><th>Why it matters</th></tr></thead>
          <tbody>
            {CAPABILITIES.map((c) => (
              <tr key={c.n}><td>{c.n}</td><td><strong>{c.title}</strong></td><td>{c.sees}</td><td>{c.why}</td></tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Dashboard */}
      <section className={p.section}>
        <h2 className={p.h2}>2 · The dashboard, row by row</h2>
        <table className={p.table}>
          <thead><tr><th>Row</th><th>Example</th><th>Means</th><th>Don&apos;t assume</th></tr></thead>
          <tbody>
            {DASHBOARD_ROWS.map((r) => (
              <tr key={r.row}><td><strong>{r.row}</strong></td><td><Tag tone={r.tone}>{r.example}</Tag></td><td>{r.means}</td><td>{r.dont}</td></tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Regime + Structure */}
      <section className={p.section}>
        <h2 className={p.h2}>3 · Regime &amp; structure states</h2>
        <div className={p.two}>
          <div>
            <h3 className={p.h3}>Regime</h3>
            {REGIMES.map((r) => (
              <p key={r.name} className={p.line}><Tag tone={r.tone}>{r.name}</Tag> {r.means}</p>
            ))}
            <p className={p.line}><Tag tone="grey">No Edge*</Tag> A Context result (from Chop / conflict / low confidence), not a regime.</p>
          </div>
          <div>
            <h3 className={p.h3}>Structure</h3>
            {STRUCTURE.map((st) => (
              <p key={st.name} className={p.line}><Tag tone={st.tone}>{st.name}</Tag> {st.means}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Zones */}
      <section className={p.section}>
        <h2 className={p.h2}>4 · Support &amp; resistance</h2>
        <ul className={p.bullets}>
          <li><strong>Support zone</strong> — area below price where buyers reacted before. May slow/bounce; not guaranteed to hold.</li>
          <li><strong>Resistance zone</strong> — area above price where sellers reacted. Leaning on it is a stretched, unclear location.</li>
          <li><strong>Zones, not lines</strong> — reactions cluster around an area; a band (price ± a fraction of ATR) is honest, a line is false precision.</li>
          <li><strong>Range Position</strong> — 0% at support → 100% at resistance, shown with a [####------] meter.</li>
        </ul>
      </section>

      {/* Momentum + Confidence */}
      <section className={p.section}>
        <h2 className={p.h2}>5 · Momentum &amp; confidence</h2>
        <div className={p.two}>
          <div>
            <h3 className={p.h3}>Momentum (confirmation only)</h3>
            {MOMENTUM.map((m) => (
              <p key={m.name} className={p.line}><Tag tone={m.tone}>{m.name}</Tag> {m.note}</p>
            ))}
          </div>
          <div>
            <h3 className={p.h3}>Confidence = alignment, not profit odds</h3>
            {CONFIDENCE.map((c) => (
              <p key={c.name} className={p.line}><Tag tone={c.tone}>{c.name} {c.band}</Tag> {c.means}</p>
            ))}
          </div>
        </div>
      </section>

      {/* No edge */}
      <section className={p.section}>
        <h2 className={p.h2}>6 · No Edge is a feature</h2>
        <p className={p.para}>No Edge means conditions aren&apos;t clean enough to read — waiting is a valid, valuable output. It may appear when:</p>
        <ul className={p.bullets}>
          {NO_EDGE_REASONS.map((r) => <li key={r}>{r}</li>)}
        </ul>
      </section>

      {/* Context labels */}
      <section className={p.section}>
        <h2 className={p.h2}>7 · Context label library</h2>
        <table className={p.table}>
          <thead><tr><th>Label</th><th>When it appears</th><th>Consider</th></tr></thead>
          <tbody>
            {CONTEXT_LABELS.map((l) => (
              <tr key={l.label}><td><Tag tone={l.tone}>{l.label}</Tag></td><td>{l.when}</td><td>{l.consider}</td></tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Workflow */}
      <section className={p.section}>
        <h2 className={p.h2}>8 · Workflow</h2>
        <ol className={p.flow}>
          {WORKFLOW.map((w) => (
            <li key={w.step}><strong>{w.title}.</strong> {w.detail}</li>
          ))}
        </ol>
      </section>

      {/* Examples */}
      <section className={p.section}>
        <h2 className={p.h2}>9 · Example reads (hypothetical)</h2>
        <table className={p.table}>
          <thead><tr><th>Situation</th><th>State</th><th>Context</th><th>Read</th></tr></thead>
          <tbody>
            {EXAMPLES.map((ex) => (
              <tr key={ex.title}>
                <td><strong>{ex.title}</strong></td>
                <td>{ex.rows.map((r) => `${r.k}: ${r.v}`).join(" · ")}</td>
                <td><Tag tone={ex.contextTone}>{ex.context}</Tag></td>
                <td>{ex.read}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className={p.fine}>Educational examples only — not recommendations.</p>
      </section>

      {/* Not meant */}
      <section className={p.section}>
        <h2 className={p.h2}>10 · What RangeClarity does NOT do</h2>
        <ul className={p.notList}>
          {NOT_MEANT.map((n) => <li key={n}>✕ &nbsp;{n}</li>)}
        </ul>
      </section>

      {/* Quick start page */}
      <section className={`${p.section} ${p.quickPage}`}>
        <h2 className={p.h2}>Quick start (one page)</h2>
        <div className={p.two}>
          <div>
            <h3 className={p.h3}>Main fields</h3>
            <ul className={p.bullets}>
              {QUICK_FIELDS.map((f) => <li key={f.k}><strong>{f.k}:</strong> {f.v}</li>)}
            </ul>
          </div>
          <div>
            <h3 className={p.h3}>5-step workflow</h3>
            <ol className={p.flow}>
              <li>Start with your watchlist idea.</li>
              <li>Check Regime &amp; support/resistance.</li>
              <li>Check Range Position &amp; Momentum.</li>
              <li>Check Confidence; if No Edge, wait.</li>
              <li>If constructive, do your own research &amp; risk plan.</li>
            </ol>
          </div>
        </div>
        <div className={p.chipRow}>
          {CONTEXT_LABELS.map((l) => <Tag key={l.label} tone={l.tone}>{l.label}</Tag>)}
        </div>
      </section>

      {/* FAQ */}
      <section className={p.section}>
        <h2 className={p.h2}>FAQ</h2>
        {FAQ.map((f) => (
          <div key={f.q} className={p.faq}>
            <strong>{f.q}</strong>
            <p>{f.a}</p>
          </div>
        ))}
      </section>

      <footer className={p.foot}>
        <p>{DISCLAIMER}</p>
        <p className={p.footMeta}>RangeClarity Ultimate Core · Indicator Handbook · educational use only.</p>
      </footer>
    </div>
  );
}

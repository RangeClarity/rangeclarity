/**
 * DashboardMock - a static, illustrative preview of the RangeClarity Starter
 * "Clean Mode" dashboard described in RANGECLARITY_MASTER_PLAN.md (sec.6, sec.8).
 *
 * This is a visual mock for the landing page only - it is NOT the indicator and
 * uses fixed, clearly-illustrative sample values on a sample symbol. The real
 * product is a TradingView Pine Script indicator (built later, per the plan).
 *
 * Compliance: language here is restricted to the plan's approved vocabulary
 * (Bias, State, Location, Range, Extension, Support/Resistance zone, etc.).
 * No trade-call, signal, or profit wording anywhere.
 */

type Tone = "bull" | "bear" | "neutral" | "warn";

function Pill({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return <span className={`pill pill-${tone}`}>{children}</span>;
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mock-row">
      <span className="mock-label">{label}</span>
      <span className="mock-value">{children}</span>
    </div>
  );
}

export default function DashboardMock() {
  return (
    <figure className="mock" aria-label="Illustrative RangeClarity dashboard preview">
      <div className="mock-head">
        <span className="mock-symbol">SAMPLE &middot; 1D</span>
        <span>RangeClarity &middot; Clean Mode</span>
      </div>

      <Row label="Bias">
        <Pill tone="bull">Bullish</Pill>
      </Row>

      <Row label="State">
        <Pill tone="warn">Extended</Pill>
      </Row>

      <Row label="Support / Resistance">
        <span className="sub">S</span> 182.40-183.10&nbsp;&nbsp;
        <span className="sub">R</span> 199.50-200.80
      </Row>

      <Row label="Location">
        <span className="sub">to S</span> +7.9%&nbsp;&nbsp;
        <span className="sub">to R</span> -1.2%&nbsp;&nbsp;
        <span className="sub">in range</span> 86%
      </Row>

      <Row label="Range Width">9.4%</Row>

      <Row label="Extension + Volume">
        Stretched&nbsp;&middot;&nbsp;<span className="sub">RVOL</span> Elevated
      </Row>

      <p className="mock-interpretation">
        &ldquo;Trend is constructive, but price is extended near resistance - location
        carries chase risk.&rdquo;
      </p>

      <figcaption className="mock-caption">
        Illustrative preview - sample values, not a live chart or recommendation.
      </figcaption>
    </figure>
  );
}

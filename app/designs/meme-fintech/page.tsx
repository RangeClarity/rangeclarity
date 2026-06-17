import ChartInstrument from "@/components/ChartInstrument";
import UseCases from "@/components/UseCases";
import WaitlistForm from "@/components/WaitlistForm";
import PricingSection from "@/components/PricingSection";
import Reveal from "@/components/Reveal";

const disclosure =
  "RangeClarity is an educational chart-context tool. It does not provide financial advice, investment recommendations, trade signals, or guarantees of performance. Trading involves risk. You are responsible for your own decisions.";

const capabilities = [
  {
    title: "Bias",
    tag: "Trend",
    body: "Bullish, Bearish, or Neutral. A descriptive read of trend structure, never an instruction.",
  },
  {
    title: "State",
    tag: "Condition",
    body: "Wait, Watch, Constructive, Strong Trend, or Extended. The chart's condition at a glance.",
  },
  {
    title: "Support zone",
    tag: "Level",
    body: "The nearest meaningful area below price, drawn from clustered swing pivots.",
  },
  {
    title: "Resistance zone",
    tag: "Level",
    body: "The nearest meaningful area above price, or an honest 'none nearby' at new highs.",
  },
  {
    title: "Location",
    tag: "Position",
    body: "Distance to support, distance to resistance, and where price sits inside its range.",
  },
  {
    title: "Range width",
    tag: "Structure",
    body: "How wide the current range is, separating clean structure from messy chop.",
  },
  {
    title: "Extension",
    tag: "Stretch",
    body: "Whether price is stretched from its EMA reference: Normal, Stretched, or Extended.",
  },
  {
    title: "Volume",
    tag: "Flow",
    body: "Relative volume context: light, normal, or elevated participation.",
  },
];

const heroModules = [
  { label: "Range Map", c: "cyan" },
  { label: "Momentum", c: "lime" },
  { label: "Risk Radar", c: "magenta" },
  { label: "Range Score", c: "violet" },
  { label: "S/R Zones", c: "gold" },
];

const steps = [
  {
    n: "STEP 01",
    title: "Add it to your chart",
    body: "One compact dashboard table on a clean chart. An EMA reference and the nearest zones, nothing else by default.",
  },
  {
    n: "STEP 02",
    title: "Read the context",
    body: "Bias and State first, then location, range, and extension. Restrained color, stable rows, plain labels.",
  },
  {
    n: "STEP 03",
    title: "Decide for yourself",
    body: "One plain-English line summarizes the read. The interpretation is yours to make, not ours to dictate.",
  },
];

const proof = [
  {
    k: "Non-repainting",
    title: "Confirmed swing pivots only",
    body: "Zones are built from pivots that have closed bars on both sides. No lookahead, no levels that quietly shift after the fact.",
  },
  {
    k: "Zones, not lines",
    title: "Levels are areas, with tolerance",
    body: "Support and resistance render as zones because real levels are ranges. Exact lines imply a precision the market does not have.",
  },
  {
    k: "Honest data",
    title: "It says so when levels are not clean",
    body: "On thin history, illiquid symbols, or an undefined range, the dashboard reports 'no nearby zone' instead of inventing one.",
  },
  {
    k: "Educational",
    title: "Context, never a command",
    body: "State and Bias describe the chart. There are no trade calls, targets, win rates, or performance claims, anywhere in the product.",
  },
];

function Header() {
  return (
    <header className="site-header">
      <div className="container">
        <a className="brand" href="#top" aria-label="RangeClarity home">
          <span className="brand-mark" aria-hidden="true" />
          RangeClarity
          <small>chart context</small>
        </a>
        <nav className="nav" aria-label="Primary navigation">
          <a className="nav-link" href="#instrument">
            Instrument
          </a>
          <a className="nav-link" href="#capabilities">
            Reads
          </a>
          <a className="nav-link" href="#method">
            Method
          </a>
          <a className="nav-link" href="#usecases">
            Cases
          </a>
          <a className="nav-link" href="#pricing">
            Pricing
          </a>
          <span className="status">
            <span className="dot" aria-hidden="true" /> live preview
          </span>
          <a className="btn btn-primary" href="#waitlist">
            Join waitlist
          </a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="section hero" id="top">
      <div className="container hero-grid">
        <div>
          <span className="eyebrow">TradingView indicator suite / chart context</span>
          <h1>
            Read trend, location, and extension
            <br />
            <span className="muted">in about ten seconds.</span>
          </h1>
          <p className="lead">
            RangeClarity is a TradingView indicator suite that condenses a chart
            into one calm dashboard: bias, state, support and resistance zones,
            location, range, and extension. No signals. No hype.
          </p>
          <div className="pill-row" aria-label="Indicator modules">
            {heroModules.map((m) => (
              <span className="pill" data-c={m.c} key={m.label}>
                {m.label}
              </span>
            ))}
          </div>
          <div className="cta-row">
            <a className="btn btn-primary" href="#waitlist">
              Join the waitlist <span className="caret">-&gt;</span>
            </a>
            <a className="btn btn-ghost" href="#instrument">
              See it read a chart
            </a>
          </div>
          <div className="hero-meta">
            <div>
              <span className="num">8</span>
              <span className="lab">context dimensions</span>
            </div>
            <div>
              <span className="num">0</span>
              <span className="lab">repaint, by design</span>
            </div>
            <div>
              <span className="num">~10s</span>
              <span className="lab">to read a chart</span>
            </div>
          </div>
        </div>
        <ChartInstrument />
      </div>
    </section>
  );
}

function Capabilities() {
  return (
    <section className="section" id="capabilities">
      <div className="container">
        <Reveal>
          <span className="eyebrow">What it reads</span>
          <h2 className="s-title">Eight dimensions of chart context, one panel.</h2>
          <p className="s-lead">
            Every line describes context, not a recommendation. Together they
            answer one question: is this chart worth attention right now, or not?
          </p>
        </Reveal>
        <Reveal>
          <div className="cap-grid">
            {capabilities.map((c, i) => (
              <div className="cap-row" key={c.title}>
                <span className="idx">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="cap-tag">{c.tag}</span>
                <div>
                  <h3>{c.title}</h3>
                  <p>{c.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Method() {
  return (
    <section className="section" id="method">
      <div className="container">
        <Reveal>
          <span className="eyebrow">How it works</span>
          <h2 className="s-title">Context first. The decision stays with you.</h2>
        </Reveal>
        <Reveal>
          <div className="pipeline">
            {steps.map((s) => (
              <div className="node" key={s.n}>
                <span className="step">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Proof() {
  return (
    <section className="section" id="proof">
      <div className="container">
        <Reveal>
          <span className="eyebrow">Why trust the read</span>
          <h2 className="s-title">
            Built to be honest about what a chart can and cannot say.
          </h2>
        </Reveal>
        <Reveal>
          <div className="proof-grid">
            {proof.map((p) => (
              <div className="spec-row" key={p.k}>
                <span className="k">{p.k}</span>
                <div className="v">
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="disclosure">
            <b>Disclosure</b>
            {disclosure}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function UseCasesSection() {
  return (
    <section className="section" id="usecases">
      <div className="container">
        <Reveal>
          <span className="eyebrow">Situations it handles</span>
          <h2 className="s-title">
            Clean trends, messy ranges, and everything between.
          </h2>
          <p className="s-lead">
            Pick a situation to load it into the instrument above. Each one shows
            the same calm read on a different kind of chart.
          </p>
        </Reveal>
        <Reveal>
          <UseCases />
        </Reveal>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="section" id="waitlist">
      <div className="container">
        <Reveal>
          <div className="cta-panel">
            <span className="eyebrow">Early access</span>
            <h2 className="s-title">Be first to read with RangeClarity.</h2>
            <p className="s-lead">
              We will email you when the free Starter publishes on TradingView and
              when Pro early access opens. No spam, leave anytime.
            </p>
            <WaitlistForm />
            <p className="form-hint">
              We only use your email to contact you about RangeClarity.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <a className="brand" href="#top">
            <span className="brand-mark" aria-hidden="true" />
            RangeClarity
          </a>
          <nav className="footer-links" aria-label="Footer navigation">
            <a href="#capabilities">Reads</a>
            <a href="#method">Method</a>
            <a href="#usecases">Cases</a>
            <a href="#pricing">Pricing</a>
            <a href="#waitlist">Waitlist</a>
            <a href="/terms">Terms</a>
            <a href="/privacy">Privacy</a>
            <a href="mailto:hello@rangeclarity.com">Contact</a>
          </nav>
        </div>
        <p className="footer-note">
          Copyright {year} RangeClarity. An educational chart-context tool. No
          signals, no performance claims. Sample charts shown on this page are
          illustrative and are not live data or recommendations.
        </p>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Capabilities />
        <Method />
        <Proof />
        <UseCasesSection />
        <PricingSection />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

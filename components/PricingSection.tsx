import Reveal from "@/components/Reveal";

type Plan = {
  id: string;
  badge: string;
  name: string;
  price: string;
  cadence?: string;
  billingNote: string;
  subtitle: string;
  features: string[];
  cta: string;
  href: string;
  note?: string;
  featured?: boolean;
};

/**
 * Pricing is intentionally data-driven. Final numbers, the free-tier decision,
 * whether annual billing is live, and the exact module names are pending founder
 * input — change them here in one place. Copy stays inside the product's
 * compliance voice: context language, never signals or performance claims.
 */
const plans: Plan[] = [
  {
    id: "free",
    badge: "Start free",
    name: "Early Access Preview",
    price: "$0",
    billingNote: "No card needed.",
    subtitle: "Try the RangeClarity read before the full suite publishes.",
    features: [
      "Sample Range Map overlay",
      "Example support and resistance zones",
      "Guided walkthrough of the dashboard",
      "Early product updates",
      "Founder notes and roadmap access",
      "A seat in the early feedback loop",
    ],
    cta: "Join free preview",
    href: "#waitlist",
  },
  {
    id: "annual",
    badge: "Best value",
    name: "Pro — Annual",
    price: "$29",
    cadence: "/mo",
    billingNote: "Billed annually. Early-access pricing.",
    subtitle: "The full instrument for people who read charts every day.",
    features: [
      "Range Map overlay",
      "Momentum context engine",
      "Risk & extension context",
      "Context Score (0–100)",
      "Support and resistance zones",
      "Entry-quality context",
      "Late / extended context labels",
      "Risk-to-reward context",
      "TradingView setup guide",
      "Ongoing product updates",
      "Priority access to the future AI Chart Companion",
    ],
    cta: "Join annual early access",
    href: "#waitlist",
    note: "Best value for serious watchlist builders.",
    featured: true,
  },
  {
    id: "monthly",
    badge: "Flexible",
    name: "Pro — Monthly",
    price: "$49",
    cadence: "/mo",
    billingNote: "Month to month. Cancel anytime.",
    subtitle: "Full access with no annual commitment.",
    features: [
      "Full TradingView indicator suite",
      "Range Map overlay",
      "Momentum context engine",
      "Risk & extension context",
      "Context Score (0–100)",
      "Pullback and wait-zone labels",
      "Risk-to-reward context",
      "TradingView setup guide",
      "Ongoing product updates",
      "Community and feedback access",
    ],
    cta: "Go month-to-month",
    href: "#waitlist",
  },
];

function Check() {
  return (
    <svg
      className="pc-check"
      viewBox="0 0 16 16"
      width="16"
      height="16"
      aria-hidden="true"
    >
      <path
        d="M3 8.4l3.1 3.1L13 4.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PricingCard({ plan }: { plan: Plan }) {
  return (
    <article
      className={`pricing-card${plan.featured ? " is-featured" : ""}`}
      aria-label={plan.name}
    >
      <span
        className={`pc-badge${plan.featured ? " pc-badge-gold" : ""}`}
      >
        {plan.badge}
      </span>

      <h3 className="pc-name">{plan.name}</h3>
      <p className="pc-subtitle">{plan.subtitle}</p>

      <div className="pc-price">
        <span className="pc-amount">{plan.price}</span>
        {plan.cadence ? <span className="pc-cadence">{plan.cadence}</span> : null}
      </div>
      <p className="pc-billing">{plan.billingNote}</p>

      <a className={`btn ${plan.featured ? "btn-primary" : "btn-ghost"} pc-cta`} href={plan.href}>
        {plan.cta} <span className="caret">-&gt;</span>
      </a>

      <ul className="pc-features">
        {plan.features.map((f) => (
          <li key={f}>
            <Check />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {plan.note ? <p className="pc-note">{plan.note}</p> : null}
    </article>
  );
}

export default function PricingSection() {
  return (
    <section className="section" id="pricing">
      <div className="container">
        <Reveal>
          <span className="eyebrow">Access</span>
          <h2 className="s-title">Simple access. Full range clarity.</h2>
          <p className="s-lead">
            No hidden tiers. No signal-bot hype. Just premium TradingView
            indicators for reading structure — with pricing that stays plain.
          </p>
        </Reveal>

        <Reveal>
          <div className="pricing-grid">
            {plans.map((plan) => (
              <PricingCard key={plan.id} plan={plan} />
            ))}
          </div>
        </Reveal>

        <Reveal>
          <p className="pricing-compliance">
            RangeClarity is a chart-structure toolkit, not financial advice. It
            does not guarantee profits, predict the market, or tell you what to
            buy or sell.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

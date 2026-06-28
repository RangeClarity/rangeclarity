/* ============================================================
   /designs/previous-pro — content (mock data only)
   The clean professional "Range Command" copy, before the
   meme-microcopy pass (no taglines, sticker chips, or pricing
   personality notes). Bloomberg-terminal × TradingView pack.
   ============================================================ */

export type ModuleV2 = {
  id: string;
  pill: string;
  title: string;
  blurb: string;
  shows: string;
  avoids: string;
  bestFor: string;
  stats: { value: string; label: string }[];
  visual: "range" | "momentum" | "radar";
  c: string;
  c2: string;
};

export const MODULES: ModuleV2[] = [
  {
    id: "range",
    pill: "THE RANGE",
    title: "Range Map Overlay",
    blurb:
      "Plots support and resistance as zones and shows exactly where price sits inside the structure right now.",
    shows: "Support / resistance zones, price position, and a 0–100 range score.",
    avoids: "Buying blindly into the top of a stretched range.",
    bestFor: "Swing traders and long-term investors timing entries.",
    stats: [
      { value: "0–100", label: "Range Score" },
      { value: "3", label: "Key Zones" },
      { value: "1", label: "Decision Map" },
    ],
    visual: "range",
    c: "#34f5b0",
    c2: "#2fe9d6",
  },
  {
    id: "momentum",
    pill: "THE MOMENTUM",
    title: "Momentum Engine",
    blurb:
      "Reads whether the move is strengthening, fading, compressing, or breaking out — so trend confirms structure.",
    shows: "Momentum lifecycle stage, compression, and weakness zones.",
    avoids: "Chasing a move that is already rolling over.",
    bestFor: "Confirming a setup before committing capital.",
    stats: [
      { value: "10", label: "Stages" },
      { value: "5", label: "Inputs" },
      { value: "LIVE", label: "Trend State" },
    ],
    visual: "momentum",
    c: "#38e1ff",
    c2: "#5b8cff",
  },
  {
    id: "risk",
    pill: "THE RISK",
    title: "Risk Radar",
    blurb:
      "Weighs nearby upside against downside so you can see whether the reward justifies the entry.",
    shows: "Risk/reward context, entry-quality grade, and late-entry warnings.",
    avoids: "Taking trades where the downside dwarfs the upside.",
    bestFor: "Investors who care about patience and position sizing.",
    stats: [
      { value: "R / R", label: "Risk / Reward" },
      { value: "A–F", label: "Entry Grade" },
      { value: "3", label: "Alert Zones" },
    ],
    visual: "radar",
    c: "#ffcf5c",
    c2: "#ff8a3c",
  },
];

/* Mock data only. */
export const CHART = {
  ticker: "ASTS",
  rangeScore: 74,
  pricePosition: "Upper Range",
  support: "$28.50 – $31.00",
  resistance: "$39.00 – $42.00",
  momentum: "Strong but Extended",
  entryQuality: "Wait for Pullback",
  risk: "Medium / High",
  price: "$39.40",
  verdict: "WAIT",
};

export const STEPS = [
  { n: "01", t: "Install on TradingView", d: "Add the RangeClarity suite to any chart in a couple of clicks." },
  { n: "02", t: "Add the indicators", d: "Range Map, Momentum Engine, and Risk Radar overlay your chart." },
  { n: "03", t: "Read the range", d: "See support, resistance, and where price sits inside structure." },
  { n: "04", t: "Confirm momentum", d: "Check whether the move is strengthening, fading, or extended." },
  { n: "05", t: "Decide", d: "Buy, wait, or avoid — with the full picture in view." },
];

export const NOTS = [
  "Not a signal bot",
  "Not financial advice",
  "Not guaranteed profit",
  "Not random indicator spaghetti",
  "Not a day-trading gambling tool",
];

export type Plan = {
  id: string;
  badge: string;
  name: string;
  price: string;
  cadence?: string;
  billing: string;
  features: string[];
  cta: string;
  featured?: boolean;
  note?: string;
};

export const PLANS: Plan[] = [
  {
    id: "free",
    badge: "START FREE",
    name: "Early Access Preview",
    price: "$0",
    billing: "No card needed.",
    features: [
      "Sample Range Map overlay",
      "Example support / resistance zones",
      "Guided dashboard walkthrough",
      "Early product updates",
      "Founder notes & roadmap",
    ],
    cta: "Join Free Preview",
  },
  {
    id: "annual",
    badge: "BEST VALUE",
    name: "Pro — Annual",
    price: "$29",
    cadence: "/mo",
    billing: "Billed annually. Early-access pricing.",
    features: [
      "Range Map Overlay",
      "Momentum Engine",
      "Risk Radar",
      "Range Score (0–100)",
      "Entry-quality context",
      "Late / extended labels",
      "TradingView setup guide",
      "Priority access to future AI Chart Companion",
    ],
    cta: "Join Annual Early Access",
    featured: true,
    note: "Best value for serious watchlist builders.",
  },
  {
    id: "monthly",
    badge: "FLEXIBLE",
    name: "Pro — Monthly",
    price: "$49",
    cadence: "/mo",
    billing: "Month to month. Cancel anytime.",
    features: [
      "Full TradingView indicator suite",
      "Range Map Overlay",
      "Momentum Engine",
      "Risk Radar",
      "Pullback & wait-zone labels",
      "TradingView setup guide",
      "Community & feedback access",
    ],
    cta: "Go Month-to-Month",
  },
];

export const FAQS = [
  {
    q: "Is RangeClarity a signal bot?",
    a: "No. It does not tell you what to buy or sell. It overlays structure — support, resistance, momentum, and risk context — so you can make your own decision.",
  },
  {
    q: "Does it work inside TradingView?",
    a: "Yes. RangeClarity is a TradingView indicator suite that adds overlays and a compact dashboard directly to your charts.",
  },
  {
    q: "Is this financial advice?",
    a: "No. RangeClarity is an educational, decision-support toolkit. It is not financial advice and does not guarantee or predict outcomes.",
  },
  {
    q: "Who is it for?",
    a: "Long-term investors and swing traders who want to read range structure and risk before acting — not day-trading gamblers chasing candles.",
  },
  {
    q: "When will pricing be final?",
    a: "Pricing shown here is early-access and indicative. Final pricing, billing, and any community access are still being confirmed.",
  },
];

export const DISCLAIMER =
  "RangeClarity is a chart-structure toolkit, not financial advice. It is not a signal bot, does not guarantee profits, and does not predict the market. All data shown is illustrative mock data.";

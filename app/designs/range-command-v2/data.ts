/* ============================================================
   /designs/range-command-v2 — content (mock data only)
   "Bloomberg terminal meets TradingView indicator pack meets
   collectible meme-fintech cards." Edit copy/colors here.
   ============================================================ */

export type ModuleV2 = {
  id: string;
  pill: string;
  /** small sticker/badge accent — internet-native personality */
  chip: string;
  title: string;
  /** witty one-liner that gives the module character */
  tagline: string;
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
    chip: "MAPS THE TERRAIN",
    title: "Range Map Overlay",
    tagline: "Reads the structure on the chart, not the noise.",
    blurb:
      "Plots support and resistance as zones and shows exactly where price sits inside the structure right now.",
    shows: "Support / resistance zones, price position, and a 0–100 range score.",
    avoids: "Mistaking a heavy resistance zone for open space.",
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
    chip: "HYPE DETECTOR",
    title: "Momentum Engine",
    tagline: "Tells you when the move has juice — and when it's just showing off.",
    blurb:
      "Reads whether the move is strengthening, fading, compressing, or breaking out — so trend confirms structure.",
    shows: "Momentum lifecycle stage, compression, and weakness zones.",
    avoids: "Confusing late hype for real strength.",
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
    chip: "ANTI-FOMO",
    title: "Risk Radar",
    tagline: "The part that quietly says: relax, this looks stretched.",
    blurb:
      "Weighs nearby structure above and below so you can see how stretched price is.",
    shows: "Risk/reward context, structure-quality read, and late-move warnings.",
    avoids: "Chasing a move that is already stretched.",
    bestFor: "Investors who care about patience and position sizing.",
    stats: [
      { value: "R / R", label: "Risk / Reward" },
      { value: "A–F", label: "Structure Grade" },
      { value: "3", label: "Alert Zones" },
    ],
    visual: "radar",
    c: "#ffcf5c",
    c2: "#ff8a3c",
  },
];

/* Mock data only — exactly the figures requested for V2. */
export const CHART = {
  ticker: "ASTS",
  rangeScore: 74,
  pricePosition: "Upper Range",
  support: "$28.50 – $31.00",
  resistance: "$39.00 – $42.00",
  momentum: "Strong but Extended",
  entryQuality: "Extended / upper range",
  risk: "Medium / High",
  price: "$39.40",
  verdict: "EXTENDED",
};

export const STEPS = [
  { n: "01", t: "Install on TradingView", d: "Add the RangeClarity suite to any chart in a couple of clicks." },
  { n: "02", t: "Add the indicators", d: "Range Map, Momentum Engine, and Risk Radar overlay your chart." },
  { n: "03", t: "Read the range", d: "See support, resistance, and where price sits inside structure." },
  { n: "04", t: "Confirm momentum", d: "Check whether the move is strengthening, fading, or extended." },
  { n: "05", t: "Read the verdict", d: "Get a clean structural read - bias, levels, and range position - and decide for yourself." },
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
  slug?: string;
  href?: string;
};

export const PLANS: Plan[] = [
  {
    id: "free",
    badge: "FREE",
    name: "7-Day Free Access",
    price: "$0",
    billing: "No card. Manual TradingView invite.",
    features: [
      "Sample Range Map overlay",
      "Example support / resistance zones",
      "Guided dashboard walkthrough",
      "Early product updates",
      "Founder notes & roadmap",
    ],
    cta: "Request Free Access",
    slug: "free_preview",
    href: "/beta/free-access",
    note: "Try RangeClarity for 7 days — submit email + TradingView username; eligible users added manually.",
  },
  {
    id: "annual",
    badge: "MOST POPULAR",
    name: "RangeClarity Beta",
    price: "$29",
    cadence: "/mo",
    billing: "Beta access — invite-only on TradingView.",
    features: [
      "Range Map Overlay",
      "Momentum Engine",
      "Risk Radar",
      "Range Score (0–100)",
      "Structure-quality context",
      "Late / extended labels",
      "TradingView setup guide",
      "Priority support and early feature previews",
    ],
    cta: "Get Beta Access",
    slug: "beta_29",
    href: "/beta?plan=beta_29",
    featured: true,
    note: "Core beta access to the RangeClarity TradingView indicator.",
  },
  {
    id: "monthly",
    badge: "PRO BETA",
    name: "RangeClarity Pro Beta",
    price: "$49",
    cadence: "/mo",
    billing: "Everything in RangeClarity Beta, plus more.",
    features: [
      "Full TradingView indicator suite",
      "Range Map Overlay",
      "Momentum Engine",
      "Risk Radar",
      "Pullback & range-context labels",
      "TradingView setup guide",
      "Community & feedback access",
    ],
    cta: "Get Pro Beta",
    slug: "pro_beta_49",
    href: "/beta?plan=pro_beta_49",
    note: "Pro Beta access: priority updates, deeper setup guidance, and early access to upcoming improvements.",
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

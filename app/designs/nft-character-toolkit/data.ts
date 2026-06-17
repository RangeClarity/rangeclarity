/* ============================================================
   /designs/nft-character-toolkit — content (mock data only)
   Experimental "collectible character" branding layer over the
   real product: a premium TradingView indicator suite.
   All characters are ORIGINAL RangeClarity brand concepts.
   ============================================================ */

export type Character = {
  id: string;
  name: string;
  indicator: string;
  rarity: string;
  pill: string;
  represents: string;
  description: string;
  shows: string;
  avoids: string;
  bestFor: string;
  stats: { value: string; label: string }[];
  traits: string[];
  c: string;
  c2: string;
  emblem: "ronin" | "beast" | "goblin" | "oracle";
};

export const CHARACTERS: Character[] = [
  {
    id: "ronin",
    name: "Range Ronin",
    indicator: "Range Map Overlay",
    rarity: "LEGENDARY",
    pill: "THE RANGE",
    represents: "Reads the battlefield — support, resistance, and price position inside the range.",
    description:
      "A disciplined read of structure. The Ronin maps where price sits between support and resistance so you know the terrain before you act.",
    shows: "Support / resistance zones, price position, and a 0–100 range score.",
    avoids: "Buying blindly into the top of a stretched range.",
    bestFor: "Swing traders and investors timing entries.",
    stats: [
      { value: "0–100", label: "Range Score" },
      { value: "3", label: "Key Zones" },
      { value: "1", label: "Decision Map" },
    ],
    traits: ["Support/Resistance", "Range Position", "Wait · Watch · Act"],
    c: "#34f5b0",
    c2: "#2fe9d6",
    emblem: "ronin",
  },
  {
    id: "beast",
    name: "Momentum Beast",
    indicator: "Momentum Engine",
    rarity: "EPIC",
    pill: "THE MOMENTUM",
    represents: "Strength, acceleration, exhaustion, and breakout pressure.",
    description:
      "Raw trend force. The Beast reads whether the move is building, breaking out, or running out of breath — so momentum confirms structure.",
    shows: "Momentum lifecycle stage, breakout watch, and weakness zones.",
    avoids: "Chasing a move that is already rolling over.",
    bestFor: "Confirming a setup before committing capital.",
    stats: [
      { value: "10", label: "Stages" },
      { value: "5", label: "Inputs" },
      { value: "LIVE", label: "Trend State" },
    ],
    traits: ["Acceleration", "Breakout Watch", "Exhaustion"],
    c: "#38e1ff",
    c2: "#5b8cff",
    emblem: "beast",
  },
  {
    id: "goblin",
    name: "Risk Goblin",
    indicator: "Risk Radar",
    rarity: "RARE",
    pill: "THE RISK",
    represents: "Late-entry warnings, downside awareness, and bad-chase prevention.",
    description:
      "Your gremlin of caution. The Goblin weighs nearby downside against upside and shrieks when you are about to chase a poor entry.",
    shows: "Risk/reward context, entry-quality grade, and late-entry warnings.",
    avoids: "Taking trades where the downside dwarfs the upside.",
    bestFor: "Patience and disciplined position sizing.",
    stats: [
      { value: "R / R", label: "Risk / Reward" },
      { value: "A–F", label: "Entry Grade" },
      { value: "3", label: "Alert Zones" },
    ],
    traits: ["Late-Entry Alarm", "Downside Map", "Chase Guard"],
    c: "#ffcf5c",
    c2: "#ff8a3c",
    emblem: "goblin",
  },
  {
    id: "oracle",
    name: "Oracle Bot",
    indicator: "AI Chart Companion",
    rarity: "MYTHIC · COMING SOON",
    pill: "THE FUTURE",
    represents: "A future AI explanation layer for chart context.",
    description:
      "The seer in the machine. A future companion that explains the read in plain language — context, not commands. On the roadmap, not shipped.",
    shows: "Plain-English context summaries of the current chart (planned).",
    avoids: "Guesswork about what the modules are telling you.",
    bestFor: "Investors who want the read explained, not dictated.",
    stats: [
      { value: "AI", label: "Companion" },
      { value: "SOON", label: "Status" },
      { value: "∞", label: "Context" },
    ],
    traits: ["Plain-English", "Context Layer", "Roadmap"],
    c: "#9b6bff",
    c2: "#c98bff",
    emblem: "oracle",
  },
];

/* Mock data only — exactly the figures requested. */
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
};

export const STEPS = [
  { n: "01", t: "Install on TradingView", d: "Add the RangeClarity suite to any chart in a couple of clicks." },
  { n: "02", t: "Add the indicators", d: "Range, Momentum, and Risk modules overlay your chart." },
  { n: "03", t: "Read the range", d: "See support, resistance, and where price sits in structure." },
  { n: "04", t: "Confirm momentum", d: "Check whether the move is strengthening, fading, or extended." },
  { n: "05", t: "Decide", d: "Buy, wait, or avoid — with the full picture in view." },
];

export const NOTS = [
  "Not an NFT project",
  "Not a signal bot",
  "Not financial advice",
  "Not guaranteed profit",
  "Not random indicator spaghetti",
];

export type Pass = {
  id: string;
  tier: string;
  name: string;
  price: string;
  cadence?: string;
  billing: string;
  perks: string[];
  cta: string;
  featured?: boolean;
  note?: string;
};

export const PASSES: Pass[] = [
  {
    id: "free",
    tier: "PREVIEW PASS",
    name: "Free Preview",
    price: "$0",
    billing: "No card needed.",
    perks: [
      "Sample Range Map overlay",
      "Example support / resistance zones",
      "Guided dashboard walkthrough",
      "Early product updates",
      "Founder notes & roadmap",
    ],
    cta: "Claim Free Pass",
  },
  {
    id: "annual",
    tier: "PRO ANNUAL PASS",
    name: "Pro — Annual",
    price: "$29",
    cadence: "/mo",
    billing: "Billed annually · early-access pricing.",
    perks: [
      "Range Ronin · Range Map Overlay",
      "Momentum Beast · Momentum Engine",
      "Risk Goblin · Risk Radar",
      "Range Score (0–100)",
      "Entry-quality context",
      "Late / extended labels",
      "TradingView setup guide",
      "Priority access to Oracle Bot (AI Companion)",
    ],
    cta: "Mint Annual Access",
    featured: true,
    note: "Best value for serious watchlist builders.",
  },
  {
    id: "monthly",
    tier: "PRO MONTHLY PASS",
    name: "Pro — Monthly",
    price: "$49",
    cadence: "/mo",
    billing: "Month to month · cancel anytime.",
    perks: [
      "Full character module suite",
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
    q: "Is this an NFT project?",
    a: "No. RangeClarity is a premium TradingView indicator suite. The characters are purely a branding and design layer — there are no tokens, mints, or collectibles to buy.",
  },
  {
    q: "What is RangeClarity, really?",
    a: "A set of TradingView indicators that overlay support, resistance, momentum, entry quality, and risk context on your chart so you can read structure before you act.",
  },
  {
    q: "Are the characters the product?",
    a: "No. Each character is a friendly face for a real indicator module: Range Ronin = Range Map Overlay, Momentum Beast = Momentum Engine, Risk Goblin = Risk Radar, Oracle Bot = a planned AI companion.",
  },
  {
    q: "Is the pricing final?",
    a: "No. The access passes shown here are early-access and indicative. Final pricing, billing, and any community access are still being confirmed.",
  },
  {
    q: "Is this financial advice?",
    a: "No. RangeClarity is an educational, decision-support toolkit. It is not financial advice, not a signal bot, and does not guarantee or predict outcomes.",
  },
];

export const DISCLAIMER =
  "RangeClarity is a chart-structure toolkit, not financial advice. It is not an NFT project, not a signal bot, does not guarantee profits, and does not predict the market. The characters are original branding only. All data shown is illustrative mock data.";

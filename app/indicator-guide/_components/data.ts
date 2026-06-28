/* ============================================================
   RangeClarity Visual Guide — shared mock data.
   Every value here mirrors the live indicator:
   pine/rangeclarity_ultimate_core.pine ("RangeClarity Ultimate Core").
   Mock data only. No APIs. Do not change indicator logic.
   ============================================================ */

// Status-chip colors mirror the indicator's own colorFor() language.
export const TONE = {
  green: "#2e9e6b", // High / Strong / Strong Context
  blue: "#2e75b6", // Coiled / Improving
  teal: "#14a3a3", // Retest Area
  amber: "#c9921f", // Medium / Watch / Extended
  red: "#c0504d", // Stretched / Risk Elevated / Conflicting
  grey: "#6b7785", // No Edge / Structure Not Clear / Low
} as const;

export type Tone = keyof typeof TONE;

export const CAPABILITIES: {
  n: number;
  title: string;
  what: string;
  sees: string;
  why: string;
  tone: Tone;
}[] = [
  {
    n: 1,
    title: "Regime",
    what: "Classifies the market environment from volatility percentile, range tightness and trend strength.",
    sees: "A label: Trend, Range, Compression, Expansion or Chop.",
    why: "An edge that works in a trend fails in chop. Regime sets the backdrop for everything else.",
    tone: "blue",
  },
  {
    n: 2,
    title: "Structure",
    what: "Reads confirmed swing pivots into higher-highs / lower-lows and break-of-structure.",
    sees: "Bullish, Bearish, Neutral, Range-bound, Breakout attempt or Failed breakout (+ bias).",
    why: "The skeleton of price. Tells you the shape before you read the details.",
    tone: "green",
  },
  {
    n: 3,
    title: "Support / Resistance",
    what: "Clusters pivots into zones and scores them by touches, maturity and volume.",
    sees: "A green support band and a red resistance band, drawn nearest-only.",
    why: "Areas where price has reacted before — the map of where moves stall or bounce.",
    tone: "green",
  },
  {
    n: 4,
    title: "Range Position",
    what: "Measures where price sits between the nearest support and resistance.",
    sees: "Lower / Mid / Upper, a 0–100%, and a meter [####------].",
    why: "Buying high in the range (near resistance) is a common, avoidable mistake.",
    tone: "amber",
  },
  {
    n: 5,
    title: "Momentum",
    what: "Combines RSI, EMA slope and trend strength — confirmation only, never a trigger.",
    sees: "Strong, Improving, Fading, Extended, Weak or Neutral.",
    why: "Tells you whether a move is gaining or running out of fuel.",
    tone: "amber",
  },
  {
    n: 6,
    title: "Confidence",
    what: "A weighted blend of the modules minus explicit penalties for messy conditions.",
    sees: "High, Medium, Low or Conflicting, with a 0–100 score.",
    why: "Shows how much the modules agree — alignment, not a profit probability.",
    tone: "green",
  },
  {
    n: 7,
    title: "No Edge / Structure Not Clear",
    what: "Detects when conditions are not clean enough and the honest answer is to stand aside.",
    sees: "Context labels like No Edge, Structure Not Clear, Stretched or Risk Elevated.",
    why: "Most losses come from acting when there is no edge. Naming it is the point.",
    tone: "grey",
  },
];

// The live dashboard rows, in order, as drawn by the indicator.
export const DASHBOARD_ROWS: {
  row: string;
  example: string;
  tone: Tone;
  means: string;
  dont: string;
}[] = [
  { row: "Regime", example: "Compression 78", tone: "blue", means: "Market type; a 0–100 score shows next to Compression.", dont: "A regime is not a direction." },
  { row: "Structure", example: "Range-bound", tone: "grey", means: "Chart shape, with bias in parentheses e.g. Bullish (Up).", dont: "“Bullish” is not a buy call." },
  { row: "Range Pos.", example: "Upper 78% [#######---]", tone: "amber", means: "0% = at support, 100% = at resistance.", dont: "High is not “sell”, low is not “buy”." },
  { row: "Momentum", example: "Strong", tone: "green", means: "Strength + direction of the move (confirmation only).", dont: "Never an entry trigger on its own." },
  { row: "Zone Str.", example: "Resistance 72", tone: "amber", means: "Strength 0–100 of the nearest zone (touches/age/volume).", dont: "Strong zones still break." },
  { row: "Confidence", example: "Medium 58", tone: "amber", means: "How much the modules agree (0–100).", dont: "NOT a probability of profit." },
  { row: "Context", example: "Structure Not Clear", tone: "grey", means: "The summary read — one of 8 labels.", dont: "Never “buy” or “sell”." },
  { row: "Note", example: "Mid-range - unclear location", tone: "grey", means: "One-line reason for the current Context.", dont: "It explains, it does not instruct." },
  { row: "State", example: "confirmed | not advice", tone: "grey", means: "forming = live bar can change; confirmed = final.", dont: "Don’t treat a forming read as final." },
];

export const REGIMES: { name: string; means: string; feels: string; tone: Tone }[] = [
  { name: "Trend", means: "Directional move with strength (ADX-confirmed).", feels: "Stair-stepping highs/lows in one direction.", tone: "green" },
  { name: "Range", means: "Sideways; weak trend strength.", feels: "Price oscillating between two boundaries.", tone: "blue" },
  { name: "Compression", means: "Unusually tight, coiled range (0–100 score).", feels: "Narrowing candles, energy building.", tone: "teal" },
  { name: "Expansion", means: "High volatility moving with trend strength.", feels: "Big, fast bars; moves can over-extend.", tone: "amber" },
  { name: "Chop", means: "Messy, no clean structure → drives No Edge.", feels: "Random, overlapping bars; no rhythm.", tone: "grey" },
];

export const STRUCTURE: { name: string; means: string; tone: Tone; pattern: "up" | "down" | "flat" | "range" | "break" | "fail" }[] = [
  { name: "Bullish", means: "Higher highs and higher lows.", tone: "green", pattern: "up" },
  { name: "Bearish", means: "Lower highs and lower lows.", tone: "red", pattern: "down" },
  { name: "Neutral", means: "Not enough confirmed swings yet.", tone: "grey", pattern: "flat" },
  { name: "Range-bound", means: "Flat swings both sides; price boxed in.", tone: "blue", pattern: "range" },
  { name: "Breakout attempt", means: "Decisive close beyond the last swing.", tone: "blue", pattern: "break" },
  { name: "Failed breakout", means: "Pierced a level, closed back inside.", tone: "red", pattern: "fail" },
];

export const MOMENTUM: { name: string; score: number; tone: Tone; note: string }[] = [
  { name: "Strong", score: 80, tone: "green", note: "High momentum + trend confirms — but check range position first." },
  { name: "Improving", score: 62, tone: "blue", note: "Building from a lower base — often constructive; watchlist interest." },
  { name: "Fading", score: 42, tone: "amber", note: "Rolling over — patience may beat action." },
  { name: "Extended", score: 90, tone: "amber", note: "Stretched (RSI extreme) — chase risk is high." },
  { name: "Weak", score: 30, tone: "grey", note: "Little energy — consistent with range/chop." },
  { name: "Neutral", score: 50, tone: "grey", note: "No clear signal — no help either way." },
];

export const CONFIDENCE: { name: string; band: string; tone: Tone; means: string }[] = [
  { name: "High", band: "≥ 70", tone: "green", means: "Modules well aligned; few penalties apply." },
  { name: "Medium", band: "≥ 45", tone: "amber", means: "Workable read with some caveats." },
  { name: "Low", band: "< 45", tone: "grey", means: "Weak agreement; treat with caution." },
  { name: "Conflicting", band: "—", tone: "red", means: "Structure and momentum disagree; downgraded." },
];

export const NO_EDGE_REASONS: string[] = [
  "Price is mid-range (unclear location)",
  "Signals conflict (structure vs momentum)",
  "Momentum is extended (the move already happened)",
  "Market is choppy / structure unclear",
  "Confidence is low",
  "Volatility shock — conditions unstable",
];

export const CONTEXT_LABELS: { label: string; tone: Tone; when: string; consider: string }[] = [
  { label: "Watch", tone: "amber", when: "Mixed but not messy conditions.", consider: "Keep observing; let it clarify." },
  { label: "Structure Not Clear", tone: "grey", when: "Compression, or mid-range with no breakout.", consider: "Patience; an edge may form later." },
  { label: "No Edge", tone: "grey", when: "Conflict, chop or low confidence.", consider: "Stand aside — normal and useful." },
  { label: "Stretched", tone: "red", when: "Extended momentum, price far from mean.", consider: "The move is extended from its mean." },
  { label: "Coiled", tone: "blue", when: "Compression near a boundary.", consider: "Watch for a confirmed resolution." },
  { label: "Retest Area", tone: "teal", when: "Trend pulling into structure.", consider: "Often constructive — still your call." },
  { label: "Strong Context", tone: "green", when: "High confidence, no conflict.", consider: "A clean read — not a guarantee." },
  { label: "Risk Elevated", tone: "red", when: "Volatility shock (ATR percentile very high).", consider: "Conditions unstable — context only." },
];

export const WORKFLOW: { step: number; title: string; detail: string }[] = [
  { step: 1, title: "Watchlist idea", detail: "Start with your own fundamental or technical idea." },
  { step: 2, title: "Open chart", detail: "Load it in TradingView with RangeClarity on." },
  { step: 3, title: "Check Regime", detail: "What kind of market is this?" },
  { step: 4, title: "Check S/R", detail: "Where are the nearest zones?" },
  { step: 5, title: "Range Position", detail: "Near support, mid, or near resistance?" },
  { step: 6, title: "Momentum", detail: "Strong, fading, or extended?" },
  { step: 7, title: "Confidence", detail: "Do the modules agree?" },
  { step: 8, title: "Respect No Edge", detail: "If unclear, stand aside — that is a valid output." },
  { step: 9, title: "Decide", detail: "Watch / stand aside / continue your own research." },
];

export const EXAMPLES: {
  title: string;
  chart: "pullback" | "resistance" | "midrange" | "compression" | "failed";
  rows: { k: string; v: string; tone: Tone }[];
  context: string;
  contextTone: Tone;
  read: string;
}[] = [
  {
    title: "Constructive pullback",
    chart: "pullback",
    rows: [
      { k: "Range Pos.", v: "Lower 22%", tone: "green" },
      { k: "Momentum", v: "Improving", tone: "blue" },
      { k: "Confidence", v: "Medium 61", tone: "amber" },
    ],
    context: "Retest Area",
    contextTone: "teal",
    read: "A trend pulling into support with improving momentum. Cleaner backdrop — do your own risk work.",
  },
  {
    title: "Late and stretched",
    chart: "resistance",
    rows: [
      { k: "Range Pos.", v: "Upper 85%", tone: "amber" },
      { k: "Momentum", v: "Extended", tone: "amber" },
      { k: "Confidence", v: "Low 38", tone: "grey" },
    ],
    context: "Stretched",
    contextTone: "red",
    read: "The move already happened and price sits under resistance — an extended, stretched context.",
  },
  {
    title: "Nothing clean",
    chart: "midrange",
    rows: [
      { k: "Range Pos.", v: "Mid 50%", tone: "grey" },
      { k: "Momentum", v: "Fading", tone: "amber" },
      { k: "Confidence", v: "Conflicting", tone: "red" },
    ],
    context: "No Edge",
    contextTone: "grey",
    read: "Structure and momentum disagree in the middle of the range. There is no edge — waiting is sensible.",
  },
  {
    title: "Coiled spring",
    chart: "compression",
    rows: [
      { k: "Regime", v: "Compression 81", tone: "teal" },
      { k: "Range Pos.", v: "Upper 76%", tone: "amber" },
      { k: "Confidence", v: "Medium 55", tone: "amber" },
    ],
    context: "Coiled",
    contextTone: "blue",
    read: "Energy building near a boundary. Watch for a confirmed move rather than anticipating direction.",
  },
  {
    title: "Trap and turbulence",
    chart: "failed",
    rows: [
      { k: "Structure", v: "Failed breakout", tone: "red" },
      { k: "Regime", v: "Expansion", tone: "amber" },
      { k: "Confidence", v: "Low 31", tone: "grey" },
    ],
    context: "Risk Elevated",
    contextTone: "red",
    read: "A breakout failed and volatility is high. Conditions are unstable — context only, not advice.",
  },
];

export const NOT_MEANT: string[] = [
  "Give guaranteed buy / sell signals",
  "Predict the future",
  "Guarantee profits",
  "Replace your risk management",
  "Replace your own research",
  "Provide financial advice",
];

export const FAQ: { q: string; a: string }[] = [
  { q: "Is RangeClarity a buy/sell signal?", a: "No. It provides chart context and a decision framework, never trade instructions." },
  { q: "Does it repaint?", a: "Confirmed outputs (structure, zones, zone strength) do not change after a bar closes. Swing pivots confirm a few bars late by design and are never back-dated. The live bar's confidence number can update until close — the State row shows forming vs confirmed. No request.security / lookahead is used." },
  { q: "Does it work on all assets?", a: "It can be tested on stocks, ETFs, crypto and FX, but behavior varies. Always test on your own instruments." },
  { q: "Which timeframe should I use?", a: "It depends on your style. Daily and 4H are cleaner for investors and swing traders; below 1H is noisier." },
  { q: "What does No Edge mean?", a: "Conditions are not clean enough to read. Waiting is the sensible response — it is a feature, not a fault." },
  { q: "Can I use this alone?", a: "No. It should be one part of a broader research and risk-management process." },
];

export const DISCLAIMER =
  "RangeClarity is an educational and analytical chart-structure tool. It is not financial, investment, or trading advice, does not guarantee profits, and does not tell you what to buy or sell. Markets carry risk; you are responsible for your own decisions. Always do your own research and manage your own risk.";

export const QUICK_FIELDS: { k: string; v: string }[] = [
  { k: "Regime", v: "What kind of market (Trend / Range / Compression / Expansion / Chop)" },
  { k: "Range Pos.", v: "Where price sits: 0% support → 100% resistance" },
  { k: "Momentum", v: "Strong / Improving / Fading / Extended / Weak / Neutral" },
  { k: "Confidence", v: "Module alignment 0–100 (not profit odds)" },
  { k: "Context", v: "The summary read — never buy/sell" },
];

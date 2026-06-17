/**
 * Deterministic, illustrative chart-context scenarios for the landing page
 * instrument. All series are generated from a fixed seed so server and client
 * render identically (no hydration mismatch). These are sample charts, not live
 * data and not recommendations. Readings use only the RangeClarity approved
 * vocabulary (Bias, State, Location, Extension, Support/Resistance zone).
 */

export type Candle = { o: number; h: number; l: number; c: number };
export type Band = { lo: number; hi: number };
export type BiasT = "Bullish" | "Bearish" | "Neutral";
export type StateT =
  | "Wait"
  | "Watch"
  | "Constructive"
  | "Strong Trend"
  | "Extended";
export type ExtT = "Normal" | "Stretched" | "Extended";
export type VolT = "Light" | "Normal" | "Elevated";

export type Reading = {
  bias: BiasT;
  state: StateT;
  distToSupport: string;
  distToResistance: string;
  inRange: string;
  rangeWidth: string;
  extension: ExtT;
  volume: VolT;
  interpretation: string;
};

export type Scenario = {
  id: string;
  label: string;
  blurb: string;
  candles: Candle[];
  ema: number[];
  support: Band | null;
  resistance: Band | null;
  reading: Reading;
};

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function ema(values: number[], period: number): number[] {
  const k = 2 / (period + 1);
  const out: number[] = [];
  let prev = values.length ? values[0] : 0;
  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    prev = i === 0 ? v : v * k + prev * (1 - k);
    out.push(prev);
  }
  return out;
}

type Cfg = {
  id: string;
  label: string;
  blurb: string;
  seed: number;
  n: number;
  start: number;
  vol: number;
  drift: (i: number, n: number) => number;
  support: [number, number] | null;
  resistance: [number, number] | null;
  reading: Reading;
};

function build(cfg: Cfg): Scenario {
  const rnd = mulberry32(cfg.seed);
  const candles: Candle[] = [];
  let price = cfg.start;
  for (let i = 0; i < cfg.n; i++) {
    const o = price;
    const step = cfg.drift(i, cfg.n) + (rnd() - 0.5) * cfg.vol;
    let c = o + step;
    if (c < 1) c = 1;
    const wick = cfg.vol * (0.35 + rnd() * 0.7);
    const h = Math.max(o, c) + wick * rnd();
    const l = Math.min(o, c) - wick * rnd();
    candles.push({ o, h, l, c });
    price = c;
  }

  const highs = candles.map((d) => d.h);
  const lows = candles.map((d) => d.l);
  const max = Math.max(...highs);
  const min = Math.min(...lows);
  const r = max - min || 1;
  const toBand = (f: [number, number] | null): Band | null =>
    f ? { lo: min + r * f[0], hi: min + r * f[1] } : null;

  return {
    id: cfg.id,
    label: cfg.label,
    blurb: cfg.blurb,
    candles,
    ema: ema(candles.map((d) => d.c), 14),
    support: toBand(cfg.support),
    resistance: toBand(cfg.resistance),
    reading: cfg.reading,
  };
}

export const SCENARIOS: Scenario[] = [
  build({
    id: "trend",
    label: "Clean trend",
    blurb: "Constructive structure with room inside the range.",
    seed: 7,
    n: 48,
    start: 100,
    vol: 2.2,
    drift: () => 0.85,
    support: [0.05, 0.11],
    resistance: [0.86, 0.93],
    reading: {
      bias: "Bullish",
      state: "Strong Trend",
      distToSupport: "+6.2%",
      distToResistance: "-4.1%",
      inRange: "63%",
      rangeWidth: "11.8%",
      extension: "Normal",
      volume: "Normal",
      interpretation:
        "Price is holding above its EMA 50 reference inside a defined range, with room before resistance.",
    },
  }),
  build({
    id: "extended",
    label: "Extended",
    blurb: "Strong trend, but stretched from the reference.",
    seed: 21,
    n: 48,
    start: 94,
    vol: 2.0,
    drift: (i, n) => 0.35 + (i / n) * 2.3,
    support: [0.04, 0.1],
    resistance: [0.78, 0.86],
    reading: {
      bias: "Bullish",
      state: "Extended",
      distToSupport: "+12.4%",
      distToResistance: "-0.6%",
      inRange: "92%",
      rangeWidth: "13.0%",
      extension: "Extended",
      volume: "Elevated",
      interpretation:
        "Trend is strong, but price is stretched well above its EMA 50 and sits near resistance, so location carries chase risk.",
    },
  }),
  build({
    id: "range",
    label: "Messy range",
    blurb: "Unclear structure, light participation.",
    seed: 39,
    n: 48,
    start: 100,
    vol: 1.7,
    drift: (i) => Math.sin(i / 3) * 1.7,
    support: [0.12, 0.19],
    resistance: [0.81, 0.88],
    reading: {
      bias: "Neutral",
      state: "Wait",
      distToSupport: "+3.1%",
      distToResistance: "-3.4%",
      inRange: "48%",
      rangeWidth: "6.7%",
      extension: "Normal",
      volume: "Light",
      interpretation:
        "Structure is choppy and volume is light. Range is unclear, so wait for cleaner structure.",
    },
  }),
  build({
    id: "resistance",
    label: "Near resistance",
    blurb: "Approaching the ceiling after a move up.",
    seed: 58,
    n: 48,
    start: 90,
    vol: 1.8,
    drift: (i, n) => 1.4 * (1 - i / n),
    support: [0.05, 0.11],
    resistance: [0.88, 0.95],
    reading: {
      bias: "Bullish",
      state: "Watch",
      distToSupport: "+9.0%",
      distToResistance: "-1.1%",
      inRange: "88%",
      rangeWidth: "10.2%",
      extension: "Stretched",
      volume: "Normal",
      interpretation:
        "Price is testing resistance after a move up. Location is less attractive while it works through the zone.",
    },
  }),
  build({
    id: "ath",
    label: "All-time high",
    blurb: "New highs, no overhead resistance nearby.",
    seed: 73,
    n: 48,
    start: 80,
    vol: 2.0,
    drift: () => 1.05,
    support: [0.08, 0.15],
    resistance: null,
    reading: {
      bias: "Bullish",
      state: "Strong Trend",
      distToSupport: "+8.3%",
      distToResistance: "No nearby resistance",
      inRange: "N/A",
      rangeWidth: "N/A",
      extension: "Stretched",
      volume: "Elevated",
      interpretation:
        "Price is at new highs with no overhead resistance nearby. Trend is strong, but there is no zone to reference above.",
    },
  }),
];

export function getScenario(id: string): Scenario {
  return SCENARIOS.find((s) => s.id === id) ?? SCENARIOS[0];
}

/* ----------------------------- projection ----------------------------- */

export type Layout = {
  w: number;
  h: number;
  padX: number;
  padTop: number;
  padBottom: number;
};

export type PCandle = {
  bx: number;
  bw: number;
  cx: number;
  bodyY: number;
  bodyH: number;
  wickY: number;
  wickH: number;
  up: boolean;
};

export type Projected = {
  cw: number;
  candles: PCandle[];
  emaPath: string;
  support: { y: number; h: number } | null;
  resistance: { y: number; h: number } | null;
  last: { x: number; y: number };
};

export function project(s: Scenario, L: Layout): Projected {
  const highs = s.candles.map((d) => d.h);
  const lows = s.candles.map((d) => d.l);
  let max = Math.max(...highs);
  let min = Math.min(...lows);
  if (s.support) {
    max = Math.max(max, s.support.hi);
    min = Math.min(min, s.support.lo);
  }
  if (s.resistance) {
    max = Math.max(max, s.resistance.hi);
    min = Math.min(min, s.resistance.lo);
  }
  const pad = (max - min) * 0.06 || 1;
  max += pad;
  min -= pad;
  const span = max - min || 1;

  const plotW = L.w - L.padX * 2;
  const plotH = L.h - L.padTop - L.padBottom;
  const n = s.candles.length;
  const step = plotW / Math.max(n - 1, 1);
  const cw = step * 0.62;

  const y = (price: number) =>
    L.padTop + ((max - price) / span) * plotH;
  const x = (i: number) => L.padX + i * step;

  const candles: PCandle[] = s.candles.map((d, i) => {
    const cx = x(i);
    const top = y(Math.max(d.o, d.c));
    const bot = y(Math.min(d.o, d.c));
    return {
      cx,
      bx: cx - cw / 2,
      bw: cw,
      bodyY: top,
      bodyH: Math.max(bot - top, 1.2),
      wickY: y(d.h),
      wickH: Math.max(y(d.l) - y(d.h), 0.5),
      up: d.c >= d.o,
    };
  });

  const emaPath = s.ema
    .map((v, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`)
    .join(" ");

  const toRect = (b: Band | null) =>
    b ? { y: y(b.hi), h: Math.max(y(b.lo) - y(b.hi), 2) } : null;

  const lastC = s.candles[n - 1];
  return {
    cw,
    candles,
    emaPath,
    support: toRect(s.support),
    resistance: toRect(s.resistance),
    last: { x: x(n - 1), y: y(lastC.c) },
  };
}

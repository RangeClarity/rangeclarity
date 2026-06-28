// RangeClarity Live QA — event + finding schema (rc_live_qa.v1).
// Internal QA only. This describes indicator-quality events, never trade advice.

export const SCHEMA_VERSION = "rc_live_qa.v1";

export interface RcZone {
  price: number;
  quality: string;   // Fresh | Tested | Weak | Insufficient
  score: number;     // 0-100 structural quality (volume excluded by design)
  age_bars: number;  // bars since the zone's defining pivot
  touches: number;
  stale: boolean;
}

export interface RcLiveQaEvent {
  schema: string;          // "rc_live_qa.v1"
  event_id: string;
  symbol: string;
  timeframe: string;       // e.g. "1D"
  bar_time: string;        // ISO timestamp of the confirmed bar
  rc: { score: number; state: string };          // 0-100 + Clear|Mixed|Weak|Insufficient Structure
  trend: string;           // Clean | Mixed | Weak | Range-bound
  regime: string;          // Trend | Range | Compression | Expansion | Chop
  structure_delta: string; // Improved | Weakened | Unchanged
  location: {
    state: string;                       // Near Support | Lower Range | Mid Range | Upper Range | Near Resistance | Above Range | Below Range
    range_position: number | null;       // 0-100 within key band
    dist_support_pct: number | null;     // signed % to key support (below price => negative)
    dist_resistance_pct: number | null;  // signed % to key resistance (above price => positive)
    atr_extension: number | null;        // |close - MA200| / ATR
    near_atr?: number | null;            // distance to NEARER key level / ATR (proximity; optional)
  };
  support: RcZone | null;
  resistance: RcZone | null;
  ui: {
    table_rows: number;
    visible_zones: number;
    display_text: string[];              // every text string the indicator renders (for compliance scan)
  };
}

export type Severity = "critical" | "warning" | "info";
export type Category =
  | "compliance" | "score" | "location" | "zone" | "regime" | "visual" | "data-quality";

export interface Finding {
  rule: string;
  severity: Severity;
  category: Category;
  symbol: string;
  timeframe: string;
  message: string;
  suggested_fix: string;
  source_event_id?: string;
  bar_time?: string;
}

// Deterministic thresholds (documented; tune as the engine matures).
export const THRESHOLDS = {
  highScore: 70,          // "high RC score" floor
  weakZoneScore: 45,      // a key zone below this is "weak" for scoring
  strongZoneScore: 80,    // a zone at/above this is treated as "strong"
  scoreJump: 35,          // |score - prevScore| above this is a suspicious jump
  nearDistancePctMax: 1.5,// "Near X" must be within this % of price
  nearAtrMax: 1.0,        // ...or within this many ATR of the level (mirrors the indicator)
  staleAgeBars: 250,      // age beyond this should be flagged stale
  zonesTooClosePct: 1.0,  // support/resistance closer than this % overlap/duplicate
  maxTableRows: 9,        // default-surface row budget
  maxVisibleZones: 4,     // hard cap on drawn S/R zones
};

// Forbidden signal-like / decision wording (calm-structure brand). Phrases match as
// substrings; single tokens match on word boundaries to avoid false positives.
export const FORBIDDEN_WORDS: string[] = [
  "buy", "sell", "entry", "exit", "target",
  "avoid chase", "pullback zone", "breakout watch", "confirmed breakout",
  "conviction", "liquidity", "absorption", "poor r/r", "size down",
  "win rate", "win-rate", "high probability", "guaranteed", "profit",
];

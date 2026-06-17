# Regime Patterns

Distilled concepts for identifying the market environment: trend, range, compression, expansion, volatility state, chop/noise. Attribute any externally-derived idea to its source + ledger row.

## The core question

"What *kind* of market is this?" An edge that works in a trend fails in chop. Regime is the first filter — everything downstream (structure, momentum, confidence) is interpreted differently per regime.

## Concepts worth keeping

### Volatility state via ATR percentile
- Compute `ATR`, then its **percentrank** over a lookback window (e.g. 100 bars) → 0–100.
- Low percentile (e.g. <25) = **compression** (coiled, energy building).
- High percentile (e.g. >75) = **expansion**; very high (>90) = **shock** (treat as unstable).
- Why percentile, not raw ATR: self-normalizing across instruments and price levels. No magic numbers per ticker.

### Trend vs range via ADX / DMI
- `ADX >= ~22` → trending; `ADX < ~18` → ranging; the gap between is transitional.
- `+DI` vs `-DI` gives direction once trending.
- ADX lags but is robust; pair it with structure (HH/HL) rather than trusting it alone.

### Compression detection (alternatives to study)
- Bollinger Band width or Keltner-inside-Bollinger ("squeeze") as a compression proxy.
- Narrowing range of swing highs/lows (converging structure).
- Falling ATR percentile sustained over N bars.

### Chop / noise state
- Low ADX **and** mid-range price **and** conflicting momentum = chop. This should map to **No Edge** (see `no_edge_patterns.md`).
- Beware indicators that try to "trade the chop" — for a decision-support tool, naming the chop is the value.

## Mapping to a clean output (what RangeClarity does)

Five labels, decided on confirmed data:
`Compression` (low ATR pct, not trending) · `Expansion` (high ATR pct, trending) · `Trend` (ADX strong) · `Range` (ADX weak) · `Chop` (everything else / messy).

Each label carries a **regime clarity score** feeding confidence (Trend/Expansion high, Compression medium, Range low, Chop very low).

## Pitfalls / what NOT to copy

- Don't stack five oscillators to define regime — ATR percentile + ADX is enough and explainable.
- Don't switch regime intrabar; confirm on bar close to avoid flicker.
- Don't invent more than ~5 regimes; users can't reason about 10 states.

## Open ideas to test later

- HTF regime confirmation (regime on the daily filtering the 1h read) — defer until MVP stable.
- Adaptive ATR percentile window by timeframe.

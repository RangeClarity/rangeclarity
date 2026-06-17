# Structure Patterns

Distilled concepts for reading chart structure: higher highs / lower lows, swing structure, break of structure (BOS), change of character (CHoCH), range boundaries, consolidation zones.

## The core question

"Is price making progress, and in which direction?" Structure is the skeleton; momentum and zones hang off it.

## Concepts worth keeping

### Swing pivots as the primitive
- `ta.pivothigh(left, right)` / `ta.pivotlow(left, right)` return a confirmed pivot **`right` bars after** it forms. This lag is unavoidable and *honest* — never back-date pivots to look cleaner (see repainting rules).
- Track the last two confirmed highs and last two confirmed lows → enough to classify HH/HL/LH/LL.

### Bias from pivot sequence
- **Higher highs + higher lows** → bullish structure.
- **Lower highs + lower lows** → bearish structure.
- Mixed (e.g. HH but LL) → neutral / transitioning.
- Flat pivots on both sides → **range-bound**.

### Break of structure (BOS) and change of character (CHoCH)
- **BOS**: confirmed close beyond the most recent confirmed swing in the trend direction (continuation).
- **CHoCH**: first break *against* the prevailing structure (early sign of regime change). Useful but noisy — treat as "attention," not a signal.
- **Failed breakout**: price pierces a level then closes back inside. High-information event — should *downgrade* confidence, not trigger an entry.

### Range boundaries & consolidation
- Range = nearest confirmed pivot high above + nearest confirmed pivot low below current price.
- Consolidation = converging pivots + low ATR percentile (links to compression in `regime_patterns.md`).

## Mapping to a clean output (what RangeClarity does)

Structure label ∈ `Bullish` · `Bearish` · `Neutral` · `Range-bound` · `Breakout attempt` · `Failed breakout`, plus a **bias** (Up/Down/Neutral). A structure score feeds confidence (clean trend high; failed breakout low).

## Pitfalls / what NOT to copy

- "Smart money concepts" packs often draw dozens of BOS/CHoCH/OB/FVG boxes — visual spaghetti and frequently repaint. Keep only confirmed BOS + a single bias read for MVP.
- Don't use unconfirmed (forming-bar) breaks to flip structure; wait for close.
- Avoid fractal libraries that recompute historical pivots on each new bar.

## Open ideas to test later

- Order blocks / fair-value gaps as *optional* zone inputs (future module, off by default).
- Multi-timeframe structure agreement as a confidence booster.

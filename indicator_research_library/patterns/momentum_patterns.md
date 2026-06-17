# Momentum Patterns

Distilled concepts for momentum: acceleration, fading, trend strength, breakout pressure, exhaustion/extension, divergence. **Momentum is confirm-only in RangeClarity — never an entry trigger by itself.**

## The core question

"Is the move gaining, holding, or running out of fuel?" Momentum confirms or contradicts structure; it does not lead.

## Concepts worth keeping

### Direction + strength, separately
- **Direction**: RSI relative to 50, EMA slope sign. **Strength**: ADX, RSI distance from 50, slope magnitude.
- Combine into one normalized 0–100 momentum score that is *explainable* ("RSI above 50, EMA rising, ADX strong").

### Acceleration vs fading
- Compare the momentum score to its own recent value (e.g. 3 bars ago): rising = improving, falling = fading.
- Slope-of-slope / histogram (MACD-style) is an alternative acceleration read.

### Extension / exhaustion
- RSI > ~72 or < ~28, especially with high ATR percentile and price far from its mean (e.g. >2×ATR from EMA) = **extended** → "Avoid Chase," a *downgrade*, not a reversal call.

### Breakout pressure
- Expanding ATR + rising volume (RVOL) + price pressing a boundary = genuine breakout pressure vs a fakeout.

### Divergence (use sparingly)
- Price higher high while momentum lower high = bearish divergence (and vice versa). High false-positive rate; treat as a confidence *nudge*, not a standalone signal. Optional/off for MVP.

## Mapping to a clean output (what RangeClarity does)

Momentum label ∈ `Strong` · `Improving` · `Fading` · `Extended` · `Weak` · `Neutral`. A momentum-confirms-structure score feeds confidence (agrees with bias → boost; conflicts → strong downgrade).

## Pitfalls / what NOT to copy

- Don't treat RSI/MACD crossovers as buy/sell signals — that's exactly the noise we reject.
- Don't let momentum override structure; it confirms.
- Don't chase divergence-only systems; they look great in hindsight and bleed live.

## Open ideas to test later

- Volume-delta / CVD approximation for breakout-pressure quality.
- Per-regime momentum interpretation (extension means different things in trend vs range).

# Confidence Patterns

Distilled concepts for a scoring model: weighted inputs, alignment scoring, conflict handling, downgrade rules. **Goal: explainable confidence with no fake precision.**

## The core question

"How much should I trust today's read?" Confidence is a meta-signal: it scores how well the other modules *agree*.

## Concepts worth keeping

### Weighted multi-factor blend
- Score each module 0–100, then take a weighted average:
  - Regime clarity (is the environment readable?)
  - Structure quality (clean trend vs mixed/failed)
  - Momentum confirmation (does momentum agree with bias?)
  - Zone quality (is price near a strong, actionable zone?)
- Weights are inputs with strong defaults (e.g. structure 0.30, regime 0.25, momentum 0.25, zone 0.20). Sum-normalize so weights can be tuned without breaking the 0–100 scale.

### Alignment, not averaging-away
- The point is to reward agreement and punish conflict. A high structure score *plus* contradicting momentum should not average to "medium and fine" — it should trigger an explicit penalty.

### Explicit downgrade rules (the heart of it)
Subtract points for named conditions, so the score is auditable:
- Chop regime → large penalty.
- Bias vs momentum conflict → penalty.
- Mid-range with no breakout (poor R/R) → penalty.
- Volatility shock (ATR pct > ~90) → penalty.
- Extended momentum → penalty.
- Failed breakout → penalty.

### Honest buckets
- Map the number to `High` / `Medium` / `Low`, plus a distinct `Conflicting` state when bias and momentum disagree. If it's low, say low.

## Mapping to a clean output (what RangeClarity does)

`confidence = clamp(weightedBase − sumOfPenalties, 0, 100)`, surfaced as a number + label. The penalties are exactly the conditions above, each documented in code so a user (or you) can explain any score.

## Pitfalls / what NOT to copy

- Don't display 2-decimal precision (e.g. "73.48%") — implies accuracy you don't have. Whole numbers + a word.
- Don't let confidence climb just because many indicators fire; correlated inputs aren't independent confirmation.
- Don't hide the math — explainability *is* the premium feel.

## Open ideas to test later

- Per-regime weight sets (structure matters more in trends, zones more in ranges).
- Confidence smoothing to avoid bucket flicker near thresholds (already partly handled by confirmed-bar gating).

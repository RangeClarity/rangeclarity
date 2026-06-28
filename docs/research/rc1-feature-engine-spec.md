# RC-1 Feature Engine — Spec

> Computes eight **structural** features per **confirmed** bar from OHLCV only. Volume
> is **0% of the score** (context only). No lookahead — every feature uses data up to and
> including the confirmed bar, never future bars. Concept-level (no Pine, no copied code).

## Feature row (output schema)
```
symbol, tf, as_of_bar (confirmed bar_time),
trend_quality 0-100, zone_quality 0-100, location_context 0-100,
chop_regime 0-100 (high = chop), atr_extension 0-100 (high = extended),
agreement_score 0-6 (lenses concurring), score_stability 0-100 (high = stable),
cap_flags []  # e.g. ["chop","weak_zone","extended"]
+ raw sub-signals (for audit): adx, choppiness, efficiency_ratio, atr, dist_200ma_atr,
  ma_align, pivots_count, key_zone_touches, key_zone_state, range_position
```

## The eight features
**1. trend_quality** — MA 20/50/200 alignment + slope + HH/HL or LH/LL consistency +
regression R². *In:* close MAs, confirmed pivots. *0–100*; low when MAs tangle / structure
mixed. *Lens:* Trend. *Leakage:* MAs/pivots on confirmed bars only.

**2. zone_quality** — key-zone touches, freshness (recency), ATR-normalised reaction,
violation/age decay (volume-free). *In:* confirmed pivots, ATR. *States:* Fresh/Tested/
Weak/Insufficient. *Lens:* Zone. *Leakage:* zone built from confirmed pivots; no
forward touches.

**3. location_context** — signed distance to key S/R, range position 0–100, ATR distance,
distance from 200-MA. *In:* zones, Donchian range, ATR, MA-200. *States:* NearS/Lower/Mid/
Upper/NearR/Above/Below. *Lens:* Location.

**4. chop_regime** — Choppiness Index + Efficiency Ratio + ADX + MA-tangle (high = chop).
*In:* OHLC, ATR. *Drives the Chop cap.* *Lens:* Regime. *Leakage:* rolling windows end at
the confirmed bar.

**5. atr_extension** — ATR distance of price from anchor (200-MA / range mid) →
Normal/Stretched/Extended (severe >3 ATR). *In:* ATR, MA-200, range mid. *Drives the
Extended cap.* *Lens:* Extension.

**6. agreement_score** — count (0–6) of lenses in mutually-consistent states
(Trend/Zone/Location/Regime/Extension + non-conflict). *In:* features 1–5 + conflict
detector. *Drives the agree3 gate and the >85 requirement.* *Lens:* Agreement.

**7. score_stability** — inverse of |Δ structural read| vs the prior confirmed bar (high =
stable). *In:* prior-bar snapshot (`var`-style). *Drives hysteresis / the jump fatal.*
*Leakage:* compares to the **prior** confirmed bar only.

**8. cap_flags** — boolean set of which negative-first caps the bar triggers (chop,
weak_zone, broken_zone, mid_range, extended/severe, contradiction/conflict, compression,
price_discovery, lens_missing, expansion, insufficient). *In:* features 1–7 thresholds.
*This is the negative-first ceiling input.*

## Validation metrics for the engine itself
- Feature ↔ human-label agreement on `labels-50` (e.g. `chop_regime` high where humans
  tagged chop) — per-feature confusion vs the bucket labels.
- cap_flags recall on reject buckets (every chop case should raise the chop flag).
- Determinism: same bar ⇒ same features (no RNG, no repaint).

## Anti-leakage (feature-specific)
Rolling windows and MAs **end on** the confirmed bar · pivots use the delayed/confirmed
value (accept lag) · ATR/percentiles computed in-sample to the bar · feature 7 references
only the prior confirmed snapshot · **no forward bars anywhere.** Forward "proxies"
(future trend efficiency, forward chop) live in the validation layer, **never** here.

## Build order (within the 14-day plan)
D3 trend_quality + atr_extension (cheap, anchor everything) · D4 zone_quality +
location_context · D5 chop_regime + agreement_score + score_stability + cap_flags, then
unit-test all eight against `labels-50` before scoring.

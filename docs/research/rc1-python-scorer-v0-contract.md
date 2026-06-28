# RC-1 Python Scorer v0 — Implementation Contract

> **Binding spec.** Future code MUST obey this. The scorer follows the **negative-first
> min-gate** architecture and MUST NOT drift into additive confluence scoring. **No code
> here, no Pine, no live data, no returns, no signal language.** Source of truth for caps:
> `validation/rc1-cap-thresholds-v0.md`. Schemas/flow align with
> `rc1-reject-probe-v0-spec.md`, `rc1-feature-engine-spec.md`, `rc1-negative-first-scoring.md`.

**Spine sentence:** *The RC score is the **minimum** of what the structure permits — never
the **sum** of what is present.*

## 1. Non-negotiable scoring principles
- **No additive confluence.** The final score MUST be `min(agreement_ceiling, all triggered
  caps)`. It MUST NOT be a weighted/additive sum that can reach Clear/High by accumulating
  lens points. *(Any numeric lens "quality" is bounded by this min and can never promote a
  band; v0 is gate/cap/agreement-driven and emits no free additive base.)*
- **No trading-signal language** anywhere — identifiers, outputs, comments, docs: no buy/
  sell/entry/exit/target/stop/setup/long/short/signal/"breakout."
- **No returns optimisation.** The scorer references no P&L/return. Its only objective
  (handled in validation, not the scorer) is minimising false-highs.
- **Confirmed bars only.** Consumes confirmed-bar features; MUST NOT read the live/unclosed
  bar or any future bar.
- **ATR-normalised where possible.** Distances/widths/extension in ATR or %-of-range units;
  raw absolute-price thresholds are forbidden.
- **Weakest lens caps the result.** The final ceiling is the minimum over all triggered
  caps; the worst lens governs.
- **High Clarity requires agreement, not accumulation** — full six-lens agreement + zero
  caps + persistence (§7).

## 2. Scorer architecture (ordered stages + interfaces)
Pure, deterministic, no RNG, no I/O inside scoring. Stages:
1. **Feature primitives** — `OHLCV(confirmed) → numbers` (§3).
2. **Lens reads** — primitives → 6 lens states (+ optional bounded 0–100 quality):
   Trend, Zone, Location, Chop/Regime, ATR Extension, (Agreement is derived).
3. **Rejection gates** — data / contradiction / chop → may end scoring (Insufficient/Unclear).
4. **Hard caps** — collect every triggered cap → set of ceilings.
5. **Agreement gate** — agree3 / full agreement → agreement_ceiling.
6. **Hysteresis** — compare to prior confirmed-bar snapshot; limit band promotion.
7. **Final band assignment** — `min` of everything → state + (optional) number.
8. **Audit output** — mandatory record (§8).
Contract interfaces (illustrative, **not** implementation):
`score_case(features, prior) -> Score` · `Score{final_score, final_state, final_band,
triggered_gates[], triggered_caps[], weakest_lens, agreement_count, why_not_higher,
false_high_risk_flag, audit_comment}`.

## 3. Required feature primitives (confirmed-bar, ATR-normalised where relevant)
| Primitive | Purpose | Notes |
|---|---|---|
| ATR | universal normaliser | all distances/widths in ATR units |
| ADX / DMI | trend-presence gate | low ADX → range/chop |
| Efficiency Ratio | trend-vs-noise | feeds chop |
| Choppiness Index | chop detection | feeds chop cap |
| Pivot clusters | zone construction | confirmed pivots only; touches/reactions |
| Donchian / Keltner location | range position | Upper/Mid/Lower + price-discovery |
| MA 20/50/200 alignment + slope | trend quality | stack order + slope; lens-missing if MA-200 absent |
| ATR distance from anchor / zone | extension + proximity | Normal/Stretched/Extended/Severe |
| Zone freshness / touch count / width | zone quality | width = k·ATR; age decay; reaction |
All primitives: deterministic, no lookahead, end on the confirmed bar.

## 4. Explicit exclusions (MUST NOT appear in the code path)
RSI / Stochastic / MACD as score inputs · candlestick-pattern signals · FVG / order-block
signals · **volume as score** (volume may be read only as a zero-weight context flag) ·
**weighted additive confluence** · any prediction / entry / target / direction-call logic.
Presence of any of these = review fail (§10).

## 5. Conceptual scoring flow
```
features (confirmed) → candidate ceiling = 100
  → DATA gate         : insufficient → state=Insufficient, no number  (STOP)
  → CONTRADICTION gate : lenses oppose → Unclear, cap 40              (STOP/severe)
  → CHOP gate          : regime Chop  → Unclear, cap 44               (STOP/severe)
  → ZONE gate          : weak/one-touch→cap 52 ; broken→cap 50
  → LOCATION gate      : mid-range→cap 65 ; above/below range→cap 60
  → EXTENSION gate     : Extended→cap 60 ; Severe(>3 ATR)→cap 50
  → AGREEMENT gate     : not agree3 → cap 69 ; full agreement → ceiling up to 100
  → HYSTERESIS         : limit Δ vs prior confirmed bar; no jump-promotion
  → final_score/state  = band of min(candidate, every triggered cap)
```
This is reject-weakness: each stage can only **lower** the ceiling (except the agreement
gate, which *unlocks* the high band only when earned).

## 6. Cap behavior
**Source of truth: `validation/rc1-cap-thresholds-v0.md` (do not redefine).** Rule:
`final_score = min(candidate_score, every triggered cap)`. If two caps apply, the **lower**
wins. Insufficient data → **no number** (state only). A cap may only lower the score; a cap
that raises is a defect.

## 7. Agreement behavior
- **Mixed (45–69):** the default — partial agreement, or any cap holding the ceiling ≤69.
- **Clear (70–85):** **agree3** = Trend `Clean` (or clean Range) **and** Location meaningful
  (Near S/R or clean Mid) **and** Zone `Fresh/Tested` — **and** no cap below 70.
- **High Clarity (>85):** **all six lenses** in best state (Trend, Zone, Location, Regime,
  Extension, MA) **and zero caps triggered and confirmed persistence ≥3 bars.** Rarity
  target **1–5%** of observations. High Clarity MUST be impossible with any cap active.

## 8. Audit contract (every scored case MUST emit — no silent scores)
`final_score` · `final_state` · `triggered_gates[]` · `triggered_caps[]` · `weakest_lens`
· `agreement_count (0–6)` · `why_not_higher` (the single binding constraint, plain English)
· `false_high_risk_flag` (Y/N) · `audit_comment`. A score without a complete audit record
is invalid output.

## 9. Reject-Probe compatibility
The scorer's `Score`/audit output MUST be directly consumable by the False-High Hunter
(`rc1-false-high-hunter.md`). Test ladder:
- **labels-50 (now):** v0 runs in human-label mode (reads the filled scoring template); gate
  = 0 fatal false-highs, 0 Clear on any reject bucket, HC ≤2, ≥46/50 consistent.
- **labels-100 / labels-300 (v1):** same scorer fed by the Python feature engine; parity
  with manual/expected within tolerance; 0 fatal; false-high CI per the statistical plan.
The scorer MUST expose the join key (`case_id`) and the fields the Hunter adjudicates on
(state, caps, weakest_lens, agreement_count).

## 10. Implementation guardrails — PR FAILS REVIEW if any hold
1. Scores are computed as **additive sums** (band reachable by accumulation).
2. **High Clarity occurs with any cap active** (or without full agreement / persistence).
3. **Missing/insufficient data produces a normal numeric score** (must be Insufficient, no number).
4. **Volume contributes points** to the score.
5. **Signal wording** appears (buy/sell/entry/target/setup/long/short/"breakout").
6. **Future or live (unclosed) bars** are used in any feature or score.
7. A **cap raises** the score, or two caps don't take the **minimum**.
8. Output is **non-deterministic**, **unbounded**, or **missing the audit record**.
9. Any **excluded module** (§4: RSI/Stoch/MACD/candlestick/FVG/order-block) is in the score path.
A reviewer (or CI lint) checks these before any merge.

---
## Summary
This contract binds the v0 scorer to negative-first min-gating: **min of permitted, never
sum of present**; weakest lens caps; High Clarity only by full agreement + zero caps +
persistence; volume context-only; confirmed bars; no signal language; mandatory per-case
audit; nine review-fail guardrails. It reuses the locked caps and the Reject-Probe schemas
so the scorer is testable on labels-50 → 100 → 300 with the False-High Hunter.

## Exact next task after this contract
Unchanged NOW: **manually score `labels-50`** (start with the 10-case warmup; pick RC1-09's
IPO symbol). Then **build the v0 scorer to this contract** (offline, reads the filled CSV,
**no live data**) and **run Reject-Probe v0** — gate: 0 fatal false-highs, 0 Clear on any
reject bucket, High Clarity ≤2, ≥46/50 consistent. The Python feature engine (Alpaca) and
labels-100/300 come after, behind their approval gates.

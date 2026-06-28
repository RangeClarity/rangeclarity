# RangeClarity — Live QA Report

> Internal indicator-quality report (`rc_live_qa.v1`). Reviews structure/clarity only — **never** buy/sell/entry/exit advice. Offline MVP (fixtures).

Generated: 2026-06-24T23:39:58.723Z · Events: 17 · Product findings: 13 · QA self-test findings: 2

## Product Findings

Findings from real product fixtures. **This is the daily-review signal.**

| Severity | Count |
|---|---|
| 🔴 critical | 0 |
| 🟠 warning | 11 |
| 🔵 info | 2 |

| Category | Count |
|---|---|
| data-quality | 2 |
| location | 2 |
| regime | 1 |
| score | 3 |
| visual | 2 |
| zone | 3 |

### 🟠 Warning (11)

- **[score] AAPL 1D** — High RC score (82) but key zone quality is weak (Weak/38, Weak/41).
  - fix: Cap RC score when key zones are weak/insufficient; structure clarity should not read high on thin levels.
  - rule: `score.high_with_weak_zones` · event: `aapl-1d-001`
- **[score] NVDA 1D** — RC score jumped 42 points since the previous confirmed bar (80 -> 38).
  - fix: Smooth the headline score or confirm a real structural change drove it; avoid jumpy reads.
  - rule: `score.large_jump` · event: `nvda-1d-002`
- **[score] TSLA 1D** — State "Clear" but RC score is 50 (expected >= 70).
  - fix: Lower the state to Mixed/Weak, or re-check the score caps.
  - rule: `score.state_mismatch` · event: `tsla-1d-001`
- **[zone] MSFT 1D** — Support zone is stale but still marked strong (quality Fresh, score 85).
  - fix: Decay/expire stale zones; a stale zone must not read Fresh/Tested or score high.
  - rule: `zone.stale_but_strong` · event: `msft-1d-001`
- **[zone] META 1D** — Support zone has only 1 touch(es) but is treated as strong.
  - fix: Require >= 2 clean touches (or strong reaction) before a zone reads strong.
  - rule: `zone.one_touch_strong` · event: `meta-1d-001`
- **[zone] BTCUSD 1D** — Support and resistance are only 0.27% apart (overlap/duplicate).
  - fix: Merge or de-duplicate near-identical zones; keep the stronger one.
  - rule: `zone.too_close` · event: `btcusd-1d-001`
- **[regime] BTCUSD 1D** — High RC score (76) while regime is Chop.
  - fix: Cap RC score in chop; choppy structure should not read clear.
  - rule: `regime.high_score_in_chop` · event: `btcusd-1d-001`
- **[data-quality] ETHUSD 1D** — No key support or resistance present.
  - fix: Fall back to a subtle structure level, or surface Insufficient Structure.
  - rule: `zone.missing_both` · event: `ethusd-1d-001`
- **[visual] ETHUSD 1D** — Dashboard has 12 rows (budget 9).
  - fix: Move extra rows to Advanced; keep the default surface compact.
  - rule: `visual.too_many_rows` · event: `ethusd-1d-001`
- **[visual] ETHUSD 1D** — 6 zones drawn (hard cap 4).
  - fix: Cap drawn zones; show only the nearest 1-2 per side.
  - rule: `visual.too_many_zones` · event: `ethusd-1d-001`
- **[location] SENTINEL 1D** — Location "Near Support" but distance to support is -3.2% / 1.6 ATR (> 1.5% and > 1 ATR).
  - fix: Only emit "Near Support" within 1.5% or 1 ATR; otherwise use Lower Range.
  - rule: `location.near_too_far` · event: `sentinel-loc-near-too-far-001`

### 🔵 Info (2)

- **[data-quality] QQQ 1D** — No key resistance present (one-sided structure).
  - fix: Confirm Location reads 'Above Range' / open-above, not a fabricated level.
  - rule: `zone.missing_resistance` · event: `qqq-1d-002`
- **[location] SENTINEL 1D** — Location state "Near Support" disagrees with range position 16 / 1.6 ATR (expected "Lower Range").
  - fix: Derive Location from range position AND proximity (% or ATR); keep one source of truth with the indicator.
  - rule: `location.state_vs_position` · event: `sentinel-loc-near-too-far-001`

---

## QA Self-Test (negative controls)

> Intentional internal test events (symbol prefix `SELFTEST`) that **must** trip a rule. They prove the QA scanner still fires — they are **not** product output and do **not** indicate a product issue.

✅ Scanner fired on 2 expected self-test case(s):

- **[compliance] SELFTEST-COMPLIANCE 1D** — Forbidden signal-like wording surfaced: "avoid chase".
  - fix: Remove "avoid chase" from indicator output; use structure / location / regime / quality / clarity language only.
  - rule: `compliance.forbidden_word` · event: `selftest-compliance-001`
- **[compliance] SELFTEST-COMPLIANCE 1D** — Forbidden signal-like wording surfaced: "pullback zone".
  - fix: Remove "pullback zone" from indicator output; use structure / location / regime / quality / clarity language only.
  - rule: `compliance.forbidden_word` · event: `selftest-compliance-001`

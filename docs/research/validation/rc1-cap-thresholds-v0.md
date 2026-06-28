# RC-1 Cap Thresholds — v0 (LOCKED for Reject-Probe v0)

> The negative-first cap set Reject-Probe v0 scores against. **Goal is false-high
> prevention, so v0 prefers the stricter value.** Where a cap was ambiguous, one v0 value
> is locked and the looser/alternative is logged as a future test. Bands: HighClarity
> 86–100 · Clear 70–85 · Mixed 45–69 · Unclear 0–44 · Insufficient NA. Final score =
> **min of every triggered ceiling** (worst lens wins). No Pine, no ML.

## Locked v0 cap table
| # | Condition (gate / cap) | v0 ceiling | Resulting state | Number shown? | Alternative (future test) |
|---|---|---|---|---|---|
|1|Insufficient / missing data|— (no score)|**Insufficient**|**No**|— (hard gate) |
|2|Contradiction (lenses oppose)|**40**|Unclear|Yes|44 (looser) |
|3|High chop / low efficiency|**44**|Unclear|Yes|40 (stricter) |
|4|Broken nearby zone|**50**|Unclear / low-Mixed|Yes|44 (force Unclear on decisive breaks) |
|5|Severe overextension (>3 ATR)|**50**|low-Mixed / Unclear|Yes|44 |
|6|Weak / stale / one-touch zone|**52**|Mixed|Yes|50 |
|7|Trend–location conflict|**55**|Mixed|Yes|50 |
|8|Compression without direction|**60**|Mixed|Yes|55 |
|9|Moderate overextension (Extended, not severe)|**60**|Mixed|Yes|55 |
|10|Price discovery (Above / Below range)|**60**|Mixed|Yes|55 |
|11|Lens missing (no MA-200 / one-sided)|**60**|Mixed|Yes|65 (original) |
|12|Mid-range / poor location|**65**|Mixed|Yes|60 (stricter) |
|13|No agreement (trend+location+zone not all clean)|**69**|Mixed|Yes|— |
|14|Score instability (Δ>15 / bar, no structural event)|hold prior; **no promotion**|unchanged|Yes|Δ≤10 |
|15|High Clarity (>85) **requires**|full 6-lens agreement + **0 caps** + ≥3-bar persistence|HighClarity|Yes|— |

## Notes
- Caps are **ceilings**; they only lower. A clean chart with no triggered cap is free to
  reach Clear/High via agreement (gate #13/#15).
- #2 and #3 (contradiction 40, chop 44) **force Unclear** — the most dangerous false-high
  paths get the hardest caps.
- #15 makes High Clarity rare by construction: it is *not* enough to avoid caps; **all six
  lenses must agree** and the read must persist.
- "Prefer stricter for v0": every ambiguous cap took the lower number; the looser value is
  logged so a later run can test whether it changes the false-high rate.

## Manual-pass usage
When labeling, the operator records the observed lens states, then reads off the **lowest
applicable ceiling** here → that is `cap_applied` and the implied `manual_band`/
`manual_state`. If two caps apply, use the **lower** one.

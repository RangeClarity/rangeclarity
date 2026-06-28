# RC-1 Reference Conviction Engine v1

> Concept research + validation only. **No Pine, no code/formula/UI/name/color/marketing
> copying, no proprietary logic, no trading-return optimisation.** Turns public
> indicator references into a measurable conviction system for RC-1.

## Governing law (most important)
```
Conviction = Reference agreement + Data validation + IP safety
Popularity  = small bonus only
```
A concept becomes **high conviction only if** all six hold: (1) multiple *independent*
references support it · (2) it is IP-safe · (3) it maps cleanly to an RC-1 lens · (4) it
can be tested on `labels.csv` · (5) it reduces **false high scores** · (6) it supports
**"RC Score is permission, not prediction."** Popularity can nudge, never carry.

## A. Reference Conviction Score (RCS) — 0–100
Per reference, sum six components, then apply penalties.

| Comp | Range | What it measures |
|---|---|---|
| A. RC relevance | 0–25 | how directly it helps RC-1 structural clarity |
| B. Concept usefulness | 0–20 | usefulness for scoring clarity / caps / agreement |
| C. Cross-reference support | 0–20 | does the same idea appear independently across strong refs (from the concept matrix) |
| D. Validation-test usefulness | 0–15 | can it produce concrete `labels.csv` / 20-chart cases |
| E. Explainability | 0–10 | explainable to a user in <3 seconds |
| F. Popularity bonus | 0–10 | **percentile within category**, capped at 10 |

**Penalties (subtract, or exclude):**
- High IP risk → **−20 or exclude from production reasoning**.
- Proprietary / invite-only logic → **exclude from production reasoning**.
- Too signal-like → −15. · Too noisy/complex for the Calm Default → −10.
- Cannot be converted into a testable rule → −10. · Duplicative, no new concept → −5.

**Popularity method.** Tiers — **U** universal/textbook · **H** high community · **M**
medium · **N** niche. F = within-category percentile of the tier, capped at 10.
*Exact download/like counts are **not scraped** (library no-bulk-scrape rule + JS-rendered
pages + honesty); add manually later if wanted. Popularity is adoption evidence, **not**
proof of correctness.*

## B. Rule Conviction Score (for extracted concepts) — 0–100
Scored in `rc1-concept-conviction-matrix.md`:

| Comp | Range | Measures |
|---|---|---|
| Reference agreement | 0–30 | # of *independent, IP-safe* references supporting it |
| IP safety | 0–20 | all-safe 20 · mixed 10 · mostly-risky 0 |
| RC-lens mapping | 0–15 | maps to one specific lens cleanly |
| Testability | 0–15 | concrete `labels.csv` cases exist |
| False-high reduction | 0–15 | directly drives a cap/gate/penalty |
| Popularity bonus | 0–5 | small |

**Recommendation thresholds:** **Adopt** ≥75 · **Test** 55–74 · **Watch** 40–54 ·
**Reject** <40 · **Exclude (IP)** = any proprietary/high-IP concept that can't be cleanly
re-derived from IP-safe references.

## How it feeds validation
Every **Adopt** concept must name the `labels.csv` cases it affects and the cap/gate it
implies — so adoption is provable, not asserted. Nothing here authorises Pine; outputs
are caps/gates/surface decisions for the RC-1 model docs, gated by the validation
framework (`rc1-validation-framework.md`).

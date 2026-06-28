# RC-1 Reject-Probe v0 — Specification

> First **measurable, offline** validation tool for RC-1. **No live data, no Pine, no ML,
> no push/Telegram/Linear**, no implementation beyond an optional safe skeleton. Build-
> ready spec; code blocks are illustrative signatures, not a running program.

## 1. Purpose
Answer exactly one question:
**"Do our current negative-first RC-1 rules ever give Clear / High Clarity to bad or
unclear charts?"**
v0 is a **rule-logic harness**: it consumes **human** structural reads (from
`labels-50.csv`), applies the negative-first gates/caps/penalties/bands, and hunts
false-highs. It measures the false-high rate of the rules we already wrote — **before** any
learning or feature engine. It does **not** compute features from price (that's v1).

## 2. Input schema
- **Source:** `docs/research/validation/labels-50.csv` (50 stratified cases). One row per
  case; one chart per row.
- v0 reads the **human lens states** as the feature input and the **expected_*** columns
  as ground truth, and emits a per-case audit row + a conviction report.
- No OHLCV, no network. (v1 will add an OHLCV→feature adapter; same downstream code.)

## 3. Required `labels.csv` columns (v0 cannot run without these)
| Column | Role | Allowed values |
|---|---|---|
| `case_id` | key | RC1-NN |
| `bucket` | stratum + adjudication | chop, weak_zone, broken_zone, mid_range_poor_location, overextension, contradiction_conflict, compression, thin_data, volatility_expansion, visual_dashboard_risk, score_stability, clean_trend, clean_range, full_agreement |
| `case_type` | control vs reject | positive_control, rejection_test, control |
| `human_trend` | feature | Clean, Mixed, Weak, Range-bound |
| `human_location` | feature | NearSupport, Lower, Mid, Upper, NearResistance, Above, Below |
| `human_zone` | feature | Fresh, Tested, Weak, Insufficient |
| `human_regime` | feature | Trend, Range, Compression, Expansion, Chop |
| `human_extension` | feature | Normal, Stretched, Extended, Severe |
| `human_is_clear` | adjudication | Y, N |
| `expected_state` | accuracy | HighClarity, Clear, Mixed, Unclear, Insufficient |
| `expected_band` | accuracy | 86-100, 70-85, 45-69, 45-65, 45-60, 0-44, NA |
| `expected_caps` | accuracy | semicolon list, or `none` / `no_number` |

## 4. Optional model-output columns (written by v0/v1; need not pre-exist)
`engine_state`, `engine_score`, `result` (v0 writes these), `human_rc_call`,
`reviewer`, `reviewer_confidence`, `as_of_date`, `symbol`, `timeframe`, `screenshot`,
`notes`. If the `validation-run-template.csv` columns (`actual_*`, `*_match`, `vcs_case`)
are present they are reused; otherwise v0 generates the audit table itself.

## 5. Manual feature override format
The `human_*` columns **are** the manual feature input. For re-runs or "what-if" tweaks
without editing the seed, an optional `overrides.csv` keyed by `case_id`:
```
case_id,override_trend,override_location,override_zone,override_regime,override_extension
RC1-10,,,Tested,,         # promote zone Weak->Tested to test the cap
```
**Precedence:** `override_* (if non-empty)` ▸ `human_*` ▸ (v1) computed feature. Any
override value must use the §3 allowed enums; unknown values error out (no silent guess).

## 6. Negative-first scorer logic (state level in v0)
Order is gates → caps → penalties → band (best band the rules **allow**):
```
score_case(f):
  # 1) GATES (top-down, most severe first)
  if insufficient(f):        return ("Insufficient","NA",[],number_shown=False)
  if contradictory(f):       return capped("Unclear","0-44",["contradictory<=44"])
  if chop(f):                return capped("Unclear","0-44",["chop<=44"])
  if broken_or_false_break(f): return capped("Unclear","0-44",["broken<=50"])
  # 2) CAPS — collect all triggered, take the min ceiling
  caps = collect(f): weakzone<=52, extended<=60 (severe<=50), midrange<=65,
                     pricediscovery<=60, compression<=60, expansion<=60,
                     lensmissing<=60, conflict<=55
  ceiling = min(caps or 100)
  # 3) AGREEMENT gate — Clear/High only if trend+location+zone all clean
  if not agree3(f): ceiling = min(ceiling, 69); caps += ["agree3<=69"]
  # 4) BAND from ceiling; HighClarity only on FULL six-lens agreement + no caps
  state, band = band_from(ceiling, full_agreement(f))
  return (state, band, caps, penalties(f), number_shown=True)
```
v0 reports the **best band the rules permit**; a false-high = that band reaches Clear/High
on a reject case (a hole in the caps). Numeric 0–100 scoring arrives with v1.

## 7. False-high definitions
A **false-high** = the scorer assigns **Clear or HighClarity** to a case that is bad/unclear,
i.e. `rc_state ∈ {Clear, HighClarity}` AND (`case_type == rejection_test` OR
`bucket ∈ REJECT_BUCKETS` OR `human_is_clear == N`). This is the primary metric to drive
to zero.

## 8. Fatal false-high definitions
A **fatal false-high** = a false-high in a category the product must *never* misread, or a
logic breach:
- `HighClarity` on **chop**, **broken_zone**, **contradiction**, or **severe overextension**.
- A **number shown** while state is Insufficient (`number_on_insufficient`).
- **cap_violation:** the assigned band exceeds a triggered cap's ceiling (a rules bug).
Any fatal = the run **fails** and blocks promotion, regardless of other metrics.

## 9. Metrics
- **false_high_rate** = false_high_count / n_reject.
- **fatal_false_high_rate** = fatal_count / n_reject. *(Target 0 — hard.)*
- **rule_of_three_upper95** = `3 / n_reject` when false_high_count == 0 (else Wilson
  interval). e.g. 0/41 ⇒ ≤ ~7%.
- **high_clarity_rarity** = #HighClarity / n. *(Target ≤ ~2/50.)*
- **band_accuracy** = scorer band == expected_band (±1-band reported separately).
- **state_accuracy** = scorer state == expected_state.
- **cap_accuracy** = expected caps fired with none missing/extra.

## 10. Case-by-case audit table format
Emitted per case (CSV + rendered table):
```
case_id | bucket | case_type | expected_state | scorer_state | allowed_band |
caps_fired | false_high(Y/N) | fatal(Y/N) | state_match(Y/N) | cap_match(Y/N) | note
```
Sort: fatals first, then false-highs, then mismatches, then passes.

## 11. Conviction report format
**Markdown (`report.md`):**
```
# RC-1 Reject-Probe v0 — Conviction Report
Run <date> · Input labels-50.csv (n=50, n_reject=<N>) · Mode human-labels (v0)
## Headline
- False-high: <x> (<rate>)   95% upper bound (rule of 3): <3/N>
- Fatal false-high: <n>  (MUST be 0)
- High Clarity: <n>/50 (<rate>)  target ≤2
- Level-2 gate: PASS/FAIL  (≥46/50 · 0 fatal · 0 false-Clear on reject · HC ≤2)
## Accuracy   State <%> · Band <%> · Cap <%>
## Per-bucket  | bucket | n | #Clear/High | #false-high | note |
## Incidents   | case_id | detector | severity | state | bucket | evidence |
## Top failure patterns  (clustered evidence → feeds Rule Distillation later)
```
**JSON (`report.json`):** machine-readable mirror for run-over-run trend tracking.

## 12. Blockers before running it
1. **labels-50 is unlabeled — 0/50 `human_*` columns filled.** v0 cannot run until the
   manual scoring pass fills them. **This is the gating blocker.**
2. **Operator-pick symbols** (RC1-09, 13, 46, 47) not yet chosen (recent IPO / short-
   history / illiquid).
3. **Cap thresholds not yet formally ratified** — `labels-50` adopts the negative-first
   tightenings (`rc1-negative-first-scoring.md` §7), but `rc1-scoring-rubric.md` hasn't
   been updated; confirm the threshold set v0 should use.
4. **Enum hygiene** — `human_*` values must match §3 exactly (no free text), or v0 errors.
5. **Scope honesty** — v0 validates **rule logic on human reads only**; it does *not*
   validate feature computation (that's v1). Don't over-claim.

## 13. Exact next step after this spec
Per the correct order (Spec → Expand to 50 → **Run manual scoring** → Plan 50→300):
- "Expand to 50" is **done** (the 50 cases are drafted in `labels-50.csv`).
- **Immediate next step: run the manual scoring pass on `labels-50.csv`** — capture each
  chart on TradingView per `labeling-guide.md`, fill the `human_*` columns (+ pick the 4
  operator-pick symbols), and hand-apply the rules. That produces the input Reject-Probe
  v0 consumes.
- After v0 runs and clears the Level-2 gate, proceed to **option 2: plan the 50→300
  expansion.** Do **not** expand to 300 yet.

## Appendix — package layout & run (optional safe skeleton)
```
rc1_reject_probe/  schemas.py · features_human.py · features_engine.py(STUB v1) ·
                   rules.py · hunter.py · conviction.py · report.py · cli.py
tests/             test_rules.py · test_hunter.py
# run (no network, no live data):
python -m rc1_reject_probe.cli --labels docs/research/validation/labels-50.csv --out report.md
```
Stdlib only (optional `pandas`); **no network libraries in v0.** v1 swaps
`features_human` → `features_engine` (Alpaca Daily/Weekly) and reuses everything downstream.

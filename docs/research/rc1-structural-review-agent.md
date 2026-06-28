# RC Structural Review Agent — design & operating notes

> **Advisory, read-only assistant** that helps the founder review `clean_but_capped` windows. It
> **does not replace human judgment**, does **not** change scoring / caps / `agree3`, does **not**
> implement the broken-zone A/B, does **not** touch Pine, and uses **no** buy/sell/prediction/
> trade-quality language. Conviction stays **RED**; the founder's hand labels are the truth.
> Code: `research/rc1_review_agent/rc_structural_review_agent.py` · Skill card: `…/SKILL.md`.

## Why it exists
Real Baseline v1 ([`rc1-real-data-visual-review-v1.md`](./rc1-real-data-visual-review-v1.md)) flagged
40 `clean_but_capped` windows — `Clean` trends capped to Mixed/Unclear, every one reading
`zone = Broken`. The founder must label each (`true_broken` / `stale_zone_false_cap` /
`normal_pullback_false_cap` / `genuinely_unclear` / `unsure`) to decide the broken-zone A/B
([`rc1-ab-test-broken-zone-v0.md`](./rc1-ab-test-broken-zone-v0.md)). This agent does a first pass so
the founder reviews *with* a structured opinion in front of them, not from a blank sheet.

## Method (read-only diagnostics, not a re-score)
For each window `(symbol, t)` the agent loads bars through the **same** `data_loader.load_universe`
the scoring run used (so `t` aligns exactly), then reuses the **frozen** engine functions read-only —
`structure_features.compute_frame` (ATR), `indicators.confirmed_pivots`, `zone_engine._cluster` — to
reconstruct what `zone_engine.zones_asof` saw, and computes extra diagnostics the engine does not
expose. Nothing is written back into the engine; the engine's `broken` result is only cross-checked.

For each support cluster `m` that trips the Broken rule (some recent close `> m` **and** some recent
close `< m − 0.25·ATR`, over the last ~20 bars), it records:

| diagnostic | meaning |
|---|---|
| `trip_inplay` | is the tripping cluster the nearest in-play support (≤ `near_zone` = 1 ATR), or a secondary/old one? |
| `penetration_atr` | deepest close below `m`, in ATR — how decisive the break is |
| `reclaimed` | did price close back **above** `m` at bar `t`? (equivalently: is the broken level now *below* price = a pierced-and-recovered support, vs *above* price = a real breakdown) |
| `bars_below` | how many recent closes stayed below `m − 0.25·ATR` — persistence |
| `pivot_age_bars` | age of the most recent pivot forming `m` — staleness of the level |
| `nearest_sup_atr` | distance to the nearest in-play support — is the primary structure intact? |

The **binding trip** (the one used to explain the cap) is the in-play tripping cluster nearest price;
if none is in-play, the nearest tripping cluster.

## Decision tree (transparent; advisory thresholds only)
Thresholds are **review heuristics for this assistant**, deliberately separate from the engine and
never fed back into any score: `DECISIVE_BREAK = 1.0·ATR`, `SHALLOW_BREAK = 0.5·ATR`,
`SUSTAIN = 3 bars`, `RECLAIM_PULLBACK = 1.5·ATR`, `STALE_AGE = 250 bars`, confidence capped at `0.85`.

1. **Contradiction binds first.** If the binding cap is `contradictory` (score 40), clarity is held
   down by a structural conflict, not the Broken flag → `genuinely_unclear` (and the Broken flag is
   assessed separately in the reason).
2. **Stale.** A secondary/old cluster trips while the nearest in-play support is intact, or the in-play
   level is built from pivots older than `STALE_AGE` with a non-decisive break → `stale_zone_false_cap`
   (Broken = *spurious (stale)*).
3. **Valid break.** In-play level, penetration ≥ `DECISIVE`, **not** reclaimed, ≥ `SUSTAIN` bars below
   → `true_broken` (Broken = *valid*). Structurally: price sits decisively below a support it recently held.
4. **Reclaimed.** Price closed back above the in-play level. If the dip was both shallow (≤
   `RECLAIM_PULLBACK`) **and** brief (≤ `SUSTAIN` bars) → `normal_pullback_false_cap` (Broken =
   *spurious (pullback)*). A deep or long-lived dip that only just reclaimed → `genuinely_unclear`.
5. **Marginal / fresh / moderate.** Very shallow non-reclaimed dip → `normal_pullback_false_cap`; a
   decisive but ≤2-bar (unconfirmed) break, or a moderate 0.5–1.0 ATR non-reclaimed break →
   `genuinely_unclear`.
6. **Fallback** → `unsure`.

Confidence scales with how cleanly the diagnostics point one way and is always ≤ 0.85.

## Output schema (`agent_label_suggestions.csv`)
`symbol, date, t, final_state, final_score, binding_cap, zone, location, regime, extension, trend,`
`agent_label, confidence, broken_zone_assessment, reason, visual_evidence,`
`diag_trip_inplay, diag_penetration_atr, diag_bars_below, diag_reclaimed, diag_pivot_age_bars,`
`diag_nearest_sup_atr, diag_trip_cluster_atr, diag_n_sup_clusters, engine_zone_state,`
`founder_label, agreement`.

Companion: `agent_vs_founder_comparison.md` (label distribution; agreement % + confusion once the
founder fills labels).

## Current run (advisory — not validation)
40 windows · 18 symbols. Agent labels: **true_broken 6 · stale_zone_false_cap 6 ·
normal_pullback_false_cap 3 · genuinely_unclear 25 · unsure 0**; Broken assessment: **valid 6 ·
spurious(stale) 6 · spurious(pullback) 5 · uncertain 23**; mean confidence 0.56. Read: ~9 windows look
like clear false caps, ~6 look like genuine breakdowns of `Clean`-but-down trends, and the majority
round-trip the level on daily closes and need a human eye. The agent deliberately does **not** rubber-
stamp the "Broken is mostly spurious" hypothesis — it found real breakdowns too.

### Hand-check (sanity)
- `XOM 2021-11-22` → `stale_zone_false_cap`: tripping pivots ~698 bars old while nearest support holds — clearly a stale level. ✔
- `KO 2023-07-27` → `true_broken` (0.85): 4.26 ATR below the in-play support, 17 bars below, not reclaimed — a real breakdown on a clean down-trend. ✔
- `AMD 2019-08-06` → `normal_pullback_false_cap` (0.70): 0.52 ATR dip reclaimed same window in a clean trend — ordinary pullback. ✔
- `AAPL 2023-02-02` → `genuinely_unclear` (0.48): price spent ~all 20 bars below the level then reclaimed only at the end — a volatile recovery, not resolvable from closes. ✔

## Limitations (be honest with it)
- Daily **closes** only — no intrabar path, no multi-timeframe context, no chart vision. Deep
  round-trips are genuinely ambiguous and are labeled as such on purpose.
- Heuristic thresholds are reasonable but unvalidated; they are visible in the CSV so the founder can
  discount them. They are **not** engine parameters and must never be copied into the scorer.
- This is decision **support**. It changes nothing and proves nothing. The founder's labels decide
  RC-11 / O-008 and whether the A/B is built.

## Workflow
1. Run the agent → `agent_label_suggestions.csv`.
2. Founder reviews `clean_but_capped` in `index.html`, comparing against the agent's suggestion, and
   fills `founder_labels_template.csv` (the truth).
3. Re-run the agent → `agent_vs_founder_comparison.md` now shows agreement + a confusion table,
   highlighting exactly where the assistant and the founder diverge.

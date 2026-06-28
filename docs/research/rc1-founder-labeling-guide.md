# RC-1 Founder Labeling Guide — `clean_but_capped`

> ~20–30 min. You are the human label that decides the broken-zone A/B (RC-11 / O-008). Nothing here
> changes the engine: no scoring, no caps, no `agree3`, no A/B, no Pine. Conviction stays **RED**.
> The agent only advises; **your label is the truth.**

## The files (all in `research/reports/visual_review/`)
| file | what it is |
|---|---|
| **`founder_review_charts.html`** | **Start here.** All 40 windows rendered as calm charts, sorted by priority, each with the agent's suggestion. Open in any browser. |
| **`founder_review_priority.csv`** | Compact worktable: one row per window, priority-sorted, with `chart_ref` links + blank `founder_label` / `notes`. Good for labeling in a spreadsheet. |
| `agent_label_suggestions.csv` | Full agent output incl. raw diagnostics (penetration, reclaim, pivot age…). Reference when a case is close. |
| `founder_labels_template.csv` | **Where your labels go.** Fill the `founder_label` column. This file is the source of truth. |
| `index.html` | The original category overview (renders only a 4-per-category sample). Superseded for this task by `founder_review_charts.html`. |
| `agent_vs_founder_comparison.md` | Auto agreement report (regenerated when you re-run the agent). |

## Step 1 — open the charts
Open `research/reports/visual_review/founder_review_charts.html`. It opens to the priority order:
**normal_pullback_false_cap → stale_zone_false_cap → genuinely_unclear → true_broken**. The two
spurious groups are first because they're the quickest to confirm and most directly test the
hypothesis that Broken over-rejects. Each card shows the calm chart (price line + the in-play S/R
band), the engine state/caps, and the agent's label + reason + evidence.

## Step 2 — use the agent suggestion as a second opinion
For each window, glance at the chart and the agent's `reason`/`broken_assessment`, then ask the single
question: **is the `Broken` flag real, or noise?** The agent's `confidence` is capped at 0.85 — treat
anything `genuinely_unclear` or `< ~0.6` as "look yourself." Use `founder_review_priority.csv`'s
`chart_ref` (e.g. `founder_review_charts.html#win-AAPL-2019-08-06`) to jump straight to a window.

## Step 3 — record your label
Set `founder_label` for each `(symbol, date)` to exactly one of the five values below (and optionally a
few words in a `notes`/`founder_note` cell). The agent reads your labels from **either**
`founder_labels_template.csv` **or** `founder_review_priority.csv` (the priority worktable) — so you can
label directly in the priority CSV while you review the charts. If a window is labeled in both, the
**priority CSV wins**. (`founder_labels.csv` is also still read if it exists.)

## What each label means
| label | choose when |
|---|---|
| `true_broken` | The **relevant** support genuinely broke — price closed decisively **below** a level it recently held and stayed there. The cap is **correct**. |
| `stale_zone_false_cap` | `Broken` fired on an **old / secondary** level price left long ago, while the nearest in-play support is intact. The cap is wrong. |
| `normal_pullback_false_cap` | Clean trend; an ordinary pullback dipped through the in-play level and price is back above it. The cap is wrong. |
| `genuinely_unclear` | The chart really is messy/ambiguous (e.g. a big volatile round-trip, or a real contradiction) — Mixed/Unclear is **fair**, not a broken-zone artifact. |
| `unsure` | You can't decide from this view. Flag it and move on. |

## Examples (from this run — verify on the chart, don't take them as given)
- **`normal_pullback_false_cap` — AMD 2019-08-06:** price dipped ~0.5 ATR below the in-play support and
  closed back above it the same window, still trending. A pullback through the level, not a break.
- **`stale_zone_false_cap` — XOM 2021-11-22:** the level that tripped `Broken` is built from pivots
  ~700 bars old while the nearest support holds — an irrelevant old level.
- **`true_broken` — KO 2023-07-27:** price sits ~4 ATR below the in-play support, 17 bars below, no
  reclaim — a genuine structural break (a `Clean` *down*-trend). The cap is doing its job here.
- **`genuinely_unclear` — AAPL 2023-02-02:** price spent almost the whole window below the level then
  reclaimed only at the end — a volatile recovery you can't resolve from daily closes alone.

## What the result should tell you
- Mostly `stale_zone_false_cap` + `normal_pullback_false_cap` ⇒ the broken detector over-rejects ⇒
  the A/B in `docs/research/rc1-ab-test-broken-zone-v0.md` is worth building (constants then frozen).
- A meaningful share of `true_broken` / `genuinely_unclear` ⇒ Broken is partly doing its job ⇒ keep
  the A/B **narrow** (scope + decisive + reclaim/time), not a broad loosening.

## Step 4 — re-run the agent comparison
Once `founder_labels_template.csv` has labels, run:
```bash
python3 research/rc1_review_agent/rc_structural_review_agent.py
```
This refreshes `agent_label_suggestions.csv` (now with `founder_label` + `agreement`) and rewrites
`agent_vs_founder_comparison.md` with the agreement rate and a founder→agent confusion table — showing
exactly where you and the agent diverged. (Optional: re-run `build_founder_review.py` to refresh the
priority CSV/charts.) Then record the go/no-go on **RC-11 / O-008**. **No engine change until you do.**

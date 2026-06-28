# RC-1 Founder Review Checklist — `clean_but_capped` (Broken-Zone Reality Check)

> **This is the gate that decides whether the Broken-Zone A/B test gets built.** ~20–30 minutes.
> You are the human label. Conviction stays **RED** until this is done. No code changes happen first.
> Spec under review: [`rc1-ab-test-broken-zone-v0.md`](./rc1-ab-test-broken-zone-v0.md).

## The one question you are answering
On clean trends that the engine capped to Mixed/Unclear, is the `Broken` zone flag **real** (price
truly broke the relevant structure) or **noise** (a stale/old level, or a normal pullback)? That's it.

## Setup (2 min)
1. Open `research/reports/visual_review/index.html` in a browser (no server needed).
2. Click the **`clean_but_capped`** section in the top nav (these are `Clean` trends held at Mixed/Unclear).
3. Open the label sheet `research/reports/visual_review/founder_labels_template.csv` (42 rows, pre-filled
   with symbol/date/state/caps/lens; one blank `founder_label` column per row).
4. _Optional pre-fill:_ open `research/reports/visual_review/agent_label_suggestions.csv` — the
   **RC Structural Review Agent** (advisory, read-only) proposes a label + confidence + reason +
   broken-zone assessment for each window. Use it as a second opinion, **not** the answer; your label
   in step 3 is the truth. See `docs/research/rc1-structural-review-agent.md`.

## For each of 20–40 cards, look at three things
- **The chart vs the band(s).** Is price interacting with the drawn zone *now*, or did it leave that
  level long ago? Is the "break" a decisive close-through, or a single wick/quarter-ATR dip?
- **The audit line.** Note `zone = Broken`, the binding `caps` (`broken` / `contradictory` / `agree3`),
  and `weakest_lens`. The claim under test: `broken` is firing on levels that aren't really in play.
- **Your trader read.** If you glanced at this chart cold, is the structure *broken*, or is it a clean
  trend on a normal pullback?

## Label each card (one value, in `founder_label`)
| Label | Use when |
|---|---|
| `true_broken` | Structure genuinely broke — the relevant zone failed decisively. Cap is **correct**. |
| `stale_zone_false_cap` | `Broken` fired on an **old / irrelevant** level price left long ago. Cap is wrong. |
| `normal_pullback_false_cap` | Clean trend, ordinary pullback dipped through a level by a hair. Cap is wrong. |
| `genuinely_unclear` | Chart really is messy/ambiguous; Mixed/Unclear is **fair** (not a broken-zone issue). |
| `unsure` | Can't decide — flag it, move on. |

Optional: jot a few words in `founder_note` (e.g. "old 2019 level, irrelevant").

## How to read the result (the decision rule)
- **Mostly `stale_zone_false_cap` + `normal_pullback_false_cap`** → hypothesis **confirmed**; the broken
  detector over-rejects. Approve building the A/B toggle (Section 4 of the spec) and freeze its constants.
- **Mostly `true_broken`** → hypothesis **wrong**; `Broken` is doing its job and the over-rejection is
  elsewhere (likely `agree3`). **Discard** the broken-zone toggle; do not implement it.
- **Mostly `genuinely_unclear`** → the data is just hard here; revisit dataset/labels before any toggle.
- **A lot of `unsure`** → review more cards, or we tighten the visual harness first.

## Hard rules during review
- Do **not** change scoring, caps, `agree3`, or the engine. This is **observation only**.
- Do **not** create or touch Pine. **BLOCK Pine** stands.
- This is a **research signal**, not validation. Nothing is "validated" by this review — it only decides
  whether the *next experiment* is worth running.

## When done
Save the filled CSV and tell the planner "broken-zone review complete: N labeled, breakdown X/Y/Z."
That unlocks the go/no-go on **RC-11** / **O-008**. Until then, conviction **RED**, no implementation.

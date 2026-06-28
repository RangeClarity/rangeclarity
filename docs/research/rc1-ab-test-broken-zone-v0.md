# RC-1 A/B Test Spec — Broken-Zone Semantics v0 (SPEC ONLY — DO NOT IMPLEMENT)

> **Status: SPEC ONLY. Not implemented. No scoring/cap/agree3/Pine change is authorized by this
> document.** This file defines a single, reversible A/B test to be built *only after* founder
> review of the `clean_but_capped` charts + human labels. **Conviction: RED.** BLOCK Pine remains.
> Owner of the go/no-go: Founder.

Source finding: [`rc1-real-data-visual-review-v1.md`](./rc1-real-data-visual-review-v1.md) (Real Baseline v1, frozen 2026-06-25).
Board ticket: **RC-11** (`docs/kanban.md`). Decision: **O-008** (`docs/decisions.md`, Recommended — awaiting founder).

---

## 1. Frozen baseline (the control arm)

The control is the **current frozen engine**, unchanged: `research/rc1_ultimate_offline_indicator/`
(+ `negative_first_scorer.score_window`, `zone_engine.zones_asof`). Real Baseline v1, on the
**Yahoo/yfinance** research dataset (19/20 symbols, F missing), 2018-01-02 → 2026-06-24, **1,767 windows**:

| Metric (control) | Value |
|---|---|
| State distribution | **Unclear 984 · Mixed 783 · Clear 0 · HighClarity 0** |
| `broken` (zone) binding rate | **74.1%** (1309/1767) |
| `agree3` binding rate | **97.5%** (1723/1767) |
| `severe` (extension) binding | 55.5% (980) · `chop` 52.7% (931) |
| `clean_but_capped` windows | **42** · `suspicious_high` **0** · `caps_saved` 1337 |
| Weakest lens | Chop/Regime 903 · **Zone 589** · Extension 185 · Agreement 90 |

These numbers are the **fixed reference**. The A/B arm is measured as a *delta vs this exact control*,
on the *same cached windows* (`research/reports/visual_review/cache/<SYM>.csv`), so nothing else moves.

---

## 2. Hypothesis

> **Broken should apply only to the currently relevant, in-play key zone — never to any old
> historical cluster. A zone should be marked `Broken` only after a decisive break, a failed
> reclaim, or a time-confirmed invalidation.**

If that is true, then today's detector is firing `Broken` on ordinary trend pullbacks (price dipping
through a stale level it left long ago), which caps clean trends to ≤50 and is the **primary
over-rejection lever** — not `agree3`. Fixing the *scope* and *strength* of `Broken` should let clean
charts reach `Clear` *sometimes*, while messy charts stay capped.

---

## 3. Exact problem (current behavior, code-grounded)

`zone_engine.zones_asof()` derives `Broken` (frozen source, lines 35–40):

```python
broken = False
for (m, k) in sup:                       # (A) loops EVERY historical support cluster, not the in-play zone
    recent = df["close"].iloc[max(0, t - 20):t + 1]
    if (recent < m - params["zone_broken_atr"] * atr_t).any() and (recent > m).any():
        broken = True                    # (B) fires; (C) order-independent .any(); (D) break on first match
        break
```

with `zone_broken_atr = 0.25`, `zone_cluster_atr = 0.75` (config.yaml). Four compounding defects:

- **(A) Scope is unbounded.** It iterates `sup` = *all* clustered pivot-low levels at or before `t`,
  not the nearest in-play support (`nsup` / `inplay`). Any **old, irrelevant** level can trip it. The
  more history a symbol has, the more clusters exist, the more likely one fires — which is exactly why
  the rate climbs to 74% on 8-year large-caps.
- **(B) Threshold is tiny.** `0.25·ATR` below a level is a *normal* intrabar excursion, not a
  structural break. A single down-bar clears it.
- **(C) No direction / no ordering.** The two `.any()` tests are independent: it only needs *some* bar
  in the last 21 above `m` and *some* bar below `m − 0.25·ATR`. It does **not** require the close-below
  to come *after* being above, and it never checks whether price **reclaimed** the level afterward.
- **(D) No time confirmation.** One qualifying bar in a 21-bar window sets `Broken` permanently for
  that window; there is no "stayed below for N closes" requirement.

**Net effect:** a clean uptrend that pulls back a quarter-ATR through any level it once traded above is
labeled `Broken` → `state = "Broken"` overrides all other zone states → **cap 50**. The
`founder_review_queue.csv` evidence is unanimous: every `clean_but_capped` row reads `zone = Broken`
on a `Clean` trend (e.g. `NVDA 2021-05-05`, `MSFT 2024-12-31`, `AAPL 2023-02-02`, all `Clean/Trend →
Mixed (50)` capped by `broken`). When structure momentarily disagrees, `contradictory` (40) stacks on
top; `agree3` then caps whatever survives at ≤69 — but `broken` is the **first and dominant** binder.

---

## 4. Proposed smallest toggle (the experimental arm)

**One change, behind one config flag, fully reversible.** No other gate, cap, weight, or `agree3` leg
is touched. Proposed flag: `params["broken_inplay_only"]` (default **false** = current behavior).

When enabled, replace the all-clusters loop with an **in-play-only, decisive, confirmed** test:

1. **Scope to the in-play key zone only.** Evaluate `Broken` against the nearest relevant support
   (`nsup` / `inplay`) — the zone price is actually interacting with — not every historical cluster.
2. **Require a decisive break.** The break must exceed a *materially larger* margin than `0.25·ATR`
   (candidate: a **closing** break beyond the zone by ≥ a `broken_decisive_atr` to be chosen during
   design, e.g. ~0.5–1.0·ATR), measured on **closes**, not wicks.
3. **Require failed reclaim OR time confirmation.** Mark `Broken` only if, after the decisive
   close-through, price **did not reclaim** the level within a small window **OR** stayed beyond it
   for ≥ `broken_confirm_bars` closes. Ordering matters: above → decisive close-through → no reclaim.
4. **Never mark old/irrelevant zones.** A historical cluster that price left long ago and is not
   currently in play cannot, by itself, produce `Broken`.

Exact constants (`broken_decisive_atr`, `broken_confirm_bars`, reclaim window) are **left open for the
design step** and must be set *before* looking at outcomes, then frozen for the run. This spec does not
choose them. **No code is written until founder review approves proceeding.**

Everything downstream of `zones_asof` (zone-state precedence, the `broken` cap value of 50, location,
extension, `agree3`, hysteresis) stays **byte-for-byte unchanged**.

---

## 5. Success criteria (all must hold to even *consider* adoption)

Measured as A/B delta on the same 1,767 cached windows, vs the Section-1 control:

1. **`Clear` becomes reachable on clean charts.** `Clear` count goes from 0 to a **small, non-zero**
   share, and the new `Clear` windows are, on inspection, genuinely clean trends/ranges.
2. **`HighClarity` stays rare.** Still ~0 to low single digits; the >85 / full-agreement / zero-caps /
   persistence bar is unchanged, so this should barely move. A spike here is a **failure**.
3. **Messy charts do not leak into `Clear`.** Spot-checked chop/contradiction/broken-for-real windows
   must remain `Mixed`/`Unclear`. No genuinely broken structure may print `Clear`.
4. **`suspicious_high` stays 0 (or very low).** The false-high self-flag must not start firing. This is
   the primary danger (false confidence) and is the hard gate.
5. **`clean_but_capped` decreases.** The 42 clean-but-capped windows should shrink materially — that is
   the whole point. Each *remaining* clean_but_capped case should have a real reason.
6. **`caps_saved` remains meaningful.** Caps must still bind on genuinely poor charts (the model stays
   negative-first and conservative). A collapse in `caps_saved` means we loosened too far → **failure**.

A pass is **necessary, not sufficient.** Even a clean pass returns to founder + human labels before adoption.

---

## 6. Failure criteria (any one ⇒ reject the toggle, keep frozen baseline)

- `HighClarity` rises beyond a tiny single-digit count, or any `HighClarity` is visibly not pristine.
- Any `suspicious_high` appears, or the false-high self-flag fires on a new `Clear`/`HighClarity`.
- A genuinely broken / choppy / contradictory chart prints `Clear`.
- `caps_saved` drops sharply (caps stop protecting bad charts) → over-loosening.
- `Clear` share becomes large rather than selective (clarity must stay **rare** = permission, not prediction).
- The change touches anything beyond the scoped `zones_asof` broken test (scope creep ⇒ void the test).

---

## 7. Required human review BEFORE implementation (hard gate)

This test is **not authorized to be built** until, in order:

1. **Founder opens `research/reports/visual_review/index.html`**, jumps to **`clean_but_capped`**, and
   inspects 20–40 examples (checklist: [`rc1-founder-review-checklist.md`](./rc1-founder-review-checklist.md)).
2. **Each example is labeled** `true_broken` / `stale_zone_false_cap` / `normal_pullback_false_cap` /
   `genuinely_unclear` / `unsure` (template: `research/reports/visual_review/founder_labels_template.csv`).
3. **The labels confirm the hypothesis** — i.e. most `clean_but_capped` are `stale_zone_false_cap` /
   `normal_pullback_false_cap`, not `true_broken`. If they are mostly `true_broken`, the hypothesis is
   wrong and this spec is discarded, not implemented.
4. **Founder explicitly approves** building the toggle and **freezes the open constants** (Section 4).

Until all four happen: **no toggle, no scoring change, no `agree3` change, no Pine.** Conviction **RED**.

---

## 8. What this spec explicitly does NOT do

- Does **not** change `zone_broken_atr`, any cap value, `agree3`, or any weight in the frozen engine.
- Does **not** implement, run, or tune anything. There is no code deliverable here.
- Does **not** claim validation. Real Baseline v1 is a **research signal**, not a validated result.
- Does **not** create or unblock Pine. BLOCK Pine stands until the engine is trustworthy on real data.

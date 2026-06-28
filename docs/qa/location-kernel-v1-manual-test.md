# Location Quality Kernel v1 — Manual Test Notes

**Build gated:** Location Quality Kernel v1 in `pine/rangeclarity_sr_core_v1.pine`
**QA gate:** `npm run qa:rc` → `docs/qa/live-qa-report.md` (offline, fixture-based)
**Status:** QA-clean for Location. **Visual pass on TradingView still required before Zone Quality.**

> Honest scope note: this environment cannot compile Pine or capture TradingView screenshots —
> TradingView is the compile + visual gate. The tables below are the structured review checklist to
> run there. Tick each box; capture a screenshot per symbol into `docs/qa/screens/` if you want a record.

---

## What changed in this build (Location)

The Location state used to be derived from **range position alone** (`≤20 → Near Support`,
`≥80 → Near Resistance`). On a **wide** support/resistance band that let the dashboard say
"Near Resistance" while price was still several percent / multiple ATR away from the level.

New rule (proximity-gated): **"Near Support/Resistance" now requires BOTH** an extreme range
position **AND** real proximity to that level — within **1.5%** or within **~1 ATR**. If the position
is extreme but price is structurally far, it reads **Lower Range / Upper Range** instead. The QA gate
(`location.near_too_far`, `location.state_vs_position`) was updated to check "near" the same dual way,
so the gate and the indicator share one definition of "Near".

Other Location states are unchanged: Lower (≤40) · Mid (<60) · Upper (60–80, or ≥80 when far) ·
Above Range (only support below) · Below Range (only resistance above).

---

## Per-symbol review (primary TF = 1D; spot-check 4H/1H)

For every symbol confirm the **3-second read**: glance at the `Location` row, look at where price sits
between the drawn teal support / magenta resistance, and the row should match what your eye sees.

| # | Symbol | What to look for on the chart | Location row should read | ✅ |
|---|--------|-------------------------------|--------------------------|----|
| 1 | QQQ    | Liquid, usually two clean levels framing price | A position state (Near/Lower/Mid/Upper) that matches the gap to each level | ☐ |
| 2 | SPY    | Similar to QQQ; often mid-band | Mid / Upper / Lower consistent with eye; "Near" only when price is hugging a level | ☐ |
| 3 | AAPL   | Trends then consolidates | "Near Resistance/Support" only when price sits right on the level | ☐ |
| 4 | NVDA   | **Key proximity test** — has run far in strong legs | When extended far above support in a wide band → **Upper Range**, NOT "Near Resistance" | ☐ |
| 5 | TSLA   | Wide ATR, big ranges | On a wide band, extreme position but far → Lower/Upper Range, not "Near" | ☐ |
| 6 | MSFT   | Often orderly trend | State tracks position; "Near" only within ~1.5%/1 ATR | ☐ |
| 7 | META   | Trends with clean pullbacks | At a tested level → "Near X"; mid-band → Mid Range | ☐ |
| 8 | BTCUSD | **ATR-proximity test** — 1.5% can be < 1 ATR | "Near Resistance/Support" may legitimately show when within ~1 ATR even if slightly >1.5% | ☐ |
| 9 | ETHUSD | Thin history / one-sided possible | If only one level present → **Above Range / Below Range**; never a fabricated opposite level | ☐ |

### Targeted proximity-gate checks (the point of this build)
- [ ] Find any symbol mid-strong-trend that has **run far** from its nearest level → confirm it does **NOT** say "Near …". It should say Upper/Lower Range. (NVDA / TSLA are good candidates.)
- [ ] Find price **sitting on** a tested level → confirm it **does** say "Near Support" / "Near Resistance".
- [ ] On a **low-priced or high-ATR** instrument (BTCUSD/ETHUSD), confirm "Near" can show within ~1 ATR even when the % distance is a touch over 1.5% (ATR path).
- [ ] One-sided case (price broken above all resistance, or below all support) → reads **Above Range / Below Range**, single level drawn.

---

## Calm / brand acceptance (must all hold)

- [ ] Exactly **one** `Location` row is added — no second pane, no extra labels, no arrows.
- [ ] Wording is structure-only. **No** buy/sell/entry/exit/wait/avoid-chase/pullback-zone/breakout-watch.
- [ ] Colors stay on palette: teal support, magenta resistance, slate neutral, amber for Above/Below Range.
- [ ] Dashboard stays compact (Minimal/Standard/Advanced row budgets respected); Location reads in ~3s.
- [ ] No repaint surprise: Location is computed on the last bar from confirmed zones; it settles on close.
- [ ] Toggling the (inert) volume input changes **nothing** in Location or RC Score.

---

## Sign-off

| Check | Result |
|---|---|
| Compiles in TradingView Pine Editor (no errors) | ☐ |
| Visual pass on all 9 symbols (table above) | ☐ |
| Proximity-gate checks pass | ☐ |
| `npm run qa:rc` → no Location findings on real-output fixtures | ✅ (offline) |
| Brand / calm acceptance | ☐ |

**Do not proceed to Zone Quality v1 until every box above is ticked.**

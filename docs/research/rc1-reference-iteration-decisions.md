# RC-1 Reference Iteration Decisions (v1)

> The decision doc: what RangeClarity **actually adopts, tests, rejects, postpones, or
> excludes** for RC-1 v1. Tied to `labels-50.csv`, Reject-Probe v0, the locked v0 caps,
> and the false-high rate. Bar for inclusion: **prevents a false-high AND reads in 3
> seconds.** RC Score is permission, not prediction. No Pine, no live data, no copying;
> proprietary/high-risk references are **excluded** from production reasoning.

## 1. Executive decision memo
RC-1 v1 is **deliberately small and negative-first.** We adopt only the concepts that
either (a) close a false-high path or (b) carry the calm surface. The moat is not feature
count — it's that **bad/unclear charts cannot earn Clear/High.**
- **Adopting now:** the negative-first engine (confluence minimum gate + caps + no-clarity
  default + hysteresis) and the five structural lenses behind it — **Zone Quality, Location
  Context, Chop/Regime, ATR Extension, Trend Quality** — plus the calm one-number surface.
  Volume stays a **context-only constraint (0% of score).**
- **Testing in Reject-Probe:** compression-without-direction, regression-R² trend clarity,
  and the price-discovery nuance — promising but need a labels check before they earn trust.
- **Rejecting:** FVG / imbalance engines, divergence-as-score, order-block *signals*, and
  any volume-in-score or arrow/target — they manufacture confidence and break "permission,
  not prediction."
- **Postponing (Watch):** MTF/HTF confirmation, VWAP context, BOS/CHoCH — useful later,
  too costly/complex or signal-adjacent for a conservative beta.
- **Excluding (IP):** LuxAlgo toolkits (proprietary) and the unlicensed ribbon/channel
  files — description-only, never production reasoning.
**Why:** every Adopt item maps to a cap/gate that drove the false-high rate down in
design; every Reject/Watch item adds complexity or signal-risk without a beta-critical
false-high benefit.

## Iteration 1 — Concept audit (decisions)
Ratings H/M/L (for Complexity/IP/Signal, lower = better). Pine = feasible as confirmed-bar
scalar math.
| Concept | Prod | FH-prevent | Clarity | Cmplx | Pine | IP | Signal | labels-50 testable | **Decision** |
|---|---|---|---|---|---|---|---|---|---|
| Confluence minimum gate | H | **H** | H | M | Y | L | L | all gate cases | **Adopt** |
| No-clarity default | H | H | H | L | Y | L | L | 05,14,20 | **Adopt** |
| Chop detection | H | H | H | M | Y | L | L | 05,20–23 | **Adopt** |
| ATR extension cap | H | H | M | L | Y | L | L | 07,12,34–37 | **Adopt** |
| Donchian/Keltner location | H | M | H | L | Y | L | L | 03,04,08,31–33 | **Adopt** |
| Price-discovery handling | M | M | M | L | Y | L | L | 08,32,33 | **Adopt** (in Location) |
| MA alignment / trend quality | H | M | H | L | Y | L | L | 01,02,15,48 | **Adopt** |
| ADX / efficiency ratio | M | H | M | L | Y | L | L | 05,16 | **Adopt** (input to Chop/Trend) |
| Pivot-cluster zone quality | H | H | H | M | Y | L | L | 10,11,24–30 | **Adopt** |
| Weak/stale/broken demotion | H | H | M | M | Y | L | L | 10,11,16,27–30 | **Adopt** |
| ATR-scaled zone width | M | M | M | L | Y | L | L | 11 | **Adopt** |
| Zone de-duplication | M | M | H | L | Y | L | L | 17 | **Adopt** |
| Hysteresis / score stability | M | M | M | M | Y | L | L | 19 | **Adopt** |
| Volume as context only | M | H | M | L | Y | L | L | 12 | **Adopt** (constraint) |
| Compression without direction | M | M | M | M | Y | L | M | 41–45 | **Test** |
| Regression R² trend clarity | M | M | M | M | Y | L | L | 01,02 | **Test** |
| MTF confirmation | M | M | M | **H** | Y(costly) | L | L | — | **Watch** |
| VWAP context | M | L | M | M | Y | L | M | — | **Watch** |
| BOS / CHoCH | M | L | M | H | Y | L | M | 16 | **Watch** |
| Order blocks / FVG / imbalance / divergence | L | **L** | L | H | ~(FVG lookahead) | M | **H** | — | **Reject** (FVG/imbalance/divergence); order-blocks → Watch (context) |

## Iteration 2 — Rule translation (Adopt + Test)
### Adopt Now
| Concept | Reference support | Why it matters | RC lens | Product rule (v1) | cap/gate/penalty | labels-50 | Risk | Decision |
|---|---|---|---|---|---|---|---|---|
| Confluence minimum gate | min-gate, MTF-filter, chop-filter | stops score inflation | Agreement | final = min(base, all caps); Clear only if trend+location+zone all clean | **gate** (agree3≤69) | all | none | Adopt |
| No-clarity default | no-trade default, chop-filter | humility default | Agreement | default band = Mixed/Unclear; Clear must be earned | gate | 05,14,20 | none | Adopt |
| Chop detection | Choppiness, ER, ADX, NR | chop ≠ clarity | Chop/Regime | regime Chop → force Unclear | **cap chop≤44** | 05,20–23 | none | Adopt |
| ATR extension cap | Keltner, Chandelier, %from200 | late/fragile ≠ clear | ATR Extension | Extended→≤60; severe(>3 ATR)→≤50 | **cap 60/50** | 07,12,34–37 | none | Adopt |
| Location (Donchian/Keltner + price-discovery) | Donchian, Keltner, range-pos | "where" defines clarity | Location | Upper/Mid/Lower; Above/Below→price-discovery | **cap pricediscovery≤60; midrange≤65** | 03,04,08,31–33 | none | Adopt |
| MA alignment / trend | SMA/EMA, MA-stack, GMMA | trend-decided leg of agree3 | Trend | 20/50/200 order+slope→Clean/Mixed/Weak/Range | observation + gate; lens-missing≤60 | 01,02,13,15,48 | none | Adopt |
| Pivot-cluster zone quality | SR Channels, Statistical Zone, fractals | level trust | Zone | touches+reaction→Fresh/Tested/Weak/Insufficient | observation feeding caps | 10,11,24–30 | none | Adopt |
| Weak/stale/broken demotion | Dynamic v2, Adaptive S/R | thin levels ≠ strong | Zone | weak/one-touch→≤52; stale −; broken→≤50/Unclear | **cap weakzone≤52; broken≤50** | 10,11,16,27–30 | none | Adopt |
| ATR-scaled zone width + de-dup | Adaptive S/R, SR Channels | fewer/cleaner zones | Zone | width=k·ATR; merge near-identical | observation; too_close merge | 11,17 | none | Adopt |
| Hysteresis | hysteresis, Supertrend | no flicker | Agreement | |Δscore|>15 w/o event = invalid | **smoothing; jump fatal** | 19 | none | Adopt |
| Volume as context only | brand law, Volumatic | no false confidence from volume | Risk/Surface | volume never additive; context/veto only | constraint (0%) | 12 | none | Adopt |

**Dashboard wording (Adopt):** headline `Clear / Mixed / Unclear / Insufficient Structure`
(+ one optional whole number); rows `Trend Structure`, `Location`, `Zone Quality`,
`Extension`; `Key Zones S·R`. **What NOT to say:** buy/sell, entry/exit, target, setup,
bullish/bearish setup, high-probability, "breakout imminent," any per-row /100 scoreboard.

### Test First
| Concept | Hypothesis | Proves it | Disproves it | Labels needed | Reject-Probe check |
|---|---|---|---|---|---|
| Compression w/o direction | a squeeze should read Mixed, never Clear | 41–45 all land Mixed (≤60), 0 Clear | any compression case reads Clear | RC1-41–45 (have) + 5 more at 100 | compression×high = 0 |
| Regression R² trend clarity | R² sharpens Clean vs Mixed trend beyond MA-stack | adds separation on 01/02 without new false-highs | R² lets an extended/chop trend read Clear | 01,02 + trend variants | trend-clarity doesn't lift a capped case |
| Price-discovery nuance | clean trend into discovery = Mixed (one ref absent), not Clear | 08/32/33 land Mixed | discovery reads Clear | 08,32,33 + downside cases | pricediscovery×high = 0 |

## Iteration 3 — Product spine decision
**Final RC-1 v1 concept stack (must-have):**
1. **Negative-first gates + caps** (the engine: min-gate + locked caps + no-clarity default)
2. **Zone Quality** (pivot-cluster, ATR-width, weak/stale/broken demotion, de-dup)
3. **Location Context** (Donchian/Keltner range position + price-discovery)
4. **Chop / Regime** (Choppiness/ER/ADX → chop cap)
5. **ATR Extension** (Extended/severe cap)
6. **Trend Quality** (MA 20/50/200 alignment)
7. **Agreement Engine + Hysteresis** (the gate + stability)
8. **Calm Dashboard** (state-first, one number) — *surface*
- **Optional (beta-nice, not required):** Structure-Change row (needs BOS/CHoCH or a
  delta snapshot); per-symbol cap calibration.
- **Later (Watch):** MTF/HTF confirmation, VWAP context, BOS/CHoCH structure module,
  regression-R² (until Test passes), order-block context, round-number confluence.
- **Reject:** FVG/imbalance engine, divergence-as-score, volume-in-score, arrows/targets,
  per-row /100 scoreboard, "breakout/setup" wording.
- **Exclude (IP):** LuxAlgo toolkits (proprietary, description-only); unlicensed Adaptive
  Trend Ribbon / AG Pro Ribbon Stress / Adaptive Trend Channel — re-derive any MA-spread
  idea from public GMMA + MPL MA Suite instead.

## 5. Reject / Postpone table
| Concept | Reason | Risk type | Future revisit condition |
|---|---|---|---|
| FVG / imbalance engine | signal/lookahead; predicts | signal-risk + repaint | never as engine; only if reframed as non-predictive context after beta |
| Divergence as score input | momentum prediction, not structure | signal-risk | only as a hidden warning, never additive |
| Volume in score | brand law (0%) | false-confidence | never (permanent) |
| Order blocks (as signal) | SMC signal framing | signal-risk | only as Zone *context*, post-beta |
| MTF / HTF confirmation | request.security cost + complexity | complexity | after Green beta, as off-by-default agreement factor |
| VWAP context | volume-derived; Location already covered | scope creep | post-beta, context row only |
| BOS / CHoCH | complexity + SMC hype association | complexity/signal | when a Structure-Change row is validated |
| LuxAlgo toolkits | proprietary | **IP** | never copy; description-only study |
| Unlicensed ribbon/channel files | no license | **IP** | excluded; re-derive from public/MPL |

## 6. Concrete development decisions
- **Python scorer implements first:** the **negative-first cap/gate engine** — the
  `min(base, caps)` + agree3 gate + the locked caps — over the five lens reads, prioritising
  the false-high-preventing caps (**chop, contradiction, broken/weak-zone, extension**)
  before any reward path. (This is exactly Reject-Probe v0's rule layer.)
- **Reject-Probe v0 checks first:** **fatal false-highs = 0** — chop×high, broken×high,
  contradiction×high, severe-extension×high, number-on-insufficient. Then the overall
  false-high rate on the ~41 reject cases.
- **Pine eventually displays first:** the **headline state** (`Clear / Mixed / Unclear /
  Insufficient`) + one optional number; then Trend Structure, Location, Zone Quality,
  Extension; then Key Zones. Nothing else by default.
- **NOT in RC-1 beta:** FVG/order-blocks/divergence, MTF, VWAP, BOS/CHoCH, volume-in-score,
  regression-R² (until tested), the 84-reference scoring, the ML model-research/distillation
  layer, the LLM review panel, any per-row /100 scoreboard, any trade/prediction wording.

## 7. Final recommendation — smallest powerful RC-1 beta
**Seven core concepts, nothing more:**
1. Negative-first caps + **Agreement minimum gate** (the engine)
2. **Zone Quality** 3. **Location Context** 4. **Chop/Regime** 5. **ATR Extension**
6. **Trend Quality** 7. **Calm one-number Dashboard** (+ hysteresis for stability)
With volume as a **context-only constraint** across all. This is conservative, focused on
preventing false-highs, and readable in under 3 seconds. **Do not overbuild beyond this for
beta.**

## 8. Next action — decisive
**A — manually label labels-50.** It is the gating blocker and the source of every
conviction number; nothing downstream is real without it. Then **B — build + run
Reject-Probe v0** on the filled sheet. **D (revise caps)** only if v0 finds leaks;
**C (expand to 100)** after labels-50 passes; **E (Pine scope)** only after the 300-case
validation (Green). Order: **A → B → (D if needed) → C → … → E.**

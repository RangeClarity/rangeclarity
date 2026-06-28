# RangeClarity — RC Score Model (conservative, agreement-gated)

> **Status: spec / lock.** Design only — no Pine is written from this until the
> founder approves an implementation pass. Pairs with
> `docs/RANGECLARITY_V2_ENGINE_SPEC.md` (modules) and
> `docs/RANGECLARITY_V2_SURFACE_SPEC.md` (visible table). Grounded in the live
> engine `pine/rangeclarity_sr_core_v1.pine`, the offline QA harness
> (`scripts/qa/run-qa.ts`, `data/qa/findings.jsonl`), and market-structure
> first principles — **not** signal/indicator marketing.

## Principle 0 — RangeClarity reads clean structure, not trades
RC Score measures **how clearly the market structure can be read right now** — not
whether there is a trade, an entry, an edge, or a direction worth taking. A clean
downtrend is exactly as "clear" as a clean uptrend. Being *at support* matters
because it means the structure is **defined and readable**, not because it is a buy.
Every rule below is a **clarity** rule. Anything that smells like opportunity,
setup, entry, target, or probability is out of scope and out of the surface.

The model is built so that **high scores are rare and earned**: a score may only
read "Clear" when trend structure, price location, and zone quality **independently
agree** that the picture is clean. The default disposition is humility.

---

## 1. What RC Score actually means
- **A 0–100 reading of structural clarity on confirmed bars.** High = multiple
  independent structural lenses agree the structure is clean and the current
  location is well-defined. Low = the lenses disagree, the data is thin, or price
  is in no-man's-land between references.
- **It is NOT** a probability, a trade quality, a win-rate, a direction call, or an
  edge. It never says what price will do.
- **The state word is primary; the number is secondary** (and optional). A reader
  should get the answer from one calm word.
- **Direction-agnostic and symmetric.** The same logic scores longs and shorts;
  there is no optimistic tilt.

## 2. Conditions required before score can exceed 70 ("Clear" gate)
"Clear" (≥70) is an **AND-gate**, not an average. The score may enter the ≥70 band
only when **all** of these hold; otherwise it is hard-capped below 70:
1. **Data sufficiency** — enough confirmed pivots (≥2 highs and ≥2 lows) and at
   least one defined key zone in play. (Data Quality = OK.)
2. **Trend structure decided** — Trend Structure is `Clean` (consistent HH/HL or
   LH/LL **and** MA alignment agreeing), or a *clean, well-defined* range. Not
   `Mixed` / `Weak`.
3. **Location meaningful** — price sits at a **defined structural location**
   (Near Support / Near Resistance / clean Mid of a defined range), not floating in
   a gap and not in price discovery (Above/Below Range).
4. **Zone quality real** — the in-play key zone is `Fresh` or `Tested` (≥2 clean
   touches or a strong ATR-normalised reaction). Not one-touch / `Developing` / stale.
5. **No conflict** — trend direction, location, and zone type **agree** (e.g.
   uptrend pulling into fresh support = agreement; uptrend jammed under heavy
   resistance = conflict).
6. **Regime supports clarity** — regime is `Trend` or clean `Range`. Not `Chop`,
   not volatility `Expansion`.
7. **Not over-extended** — ATR extension from the anchor (200 MA / range mid) is
   `Normal` or only mildly `Stretched`. Not `Extended`.

The three load-bearing lenses are **Trend, Location, Zone** — all three must pass
("agree3"). Regime, extension, and data act as additional gates/caps. This makes a
high score structurally hard to reach.

## 3. Hard caps (ceilings — apply the MINIMUM)
Caps say "even if the weighted base is high, this condition forbids a clear read."
The final score is `min(base, every applicable cap)`. Numbers chosen so a capped
score lands in Mixed/Weak, never Clear.

| Condition | Cap | Why |
|---|---|---|
| Data Quality = Insufficient | **no number** → `Insufficient Structure` | data gate, not a cap |
| Chop regime | **50** | chop is the opposite of clarity |
| Key zone Weak / one-touch / Developing | **55** | structure can't be clear on thin levels |
| Conflict (trend vs location vs zone disagree) | **55** | disagreement = not clear |
| Extended (ATR extension beyond threshold) | **60** | stretched price is fragile/late, less clean |
| Location = Above / Below Range (price discovery) | **60** | a structural reference is absent on one side |
| Volatility Expansion / range too wide | **60** | expansion lowers structural reliability |
| One lens unavailable (MA off, or one-sided structure) | **65** | partial information caps confidence |
| `agree3` fails (Trend+Location+Zone not all clean) | **69** | **no Clear without agreement** |

## 4. How the lenses combine (two-stage)
**Stage I — conservative weighted base** (structure-only; **volume 0%**). Measures
"how good is each lens," 0–100:

```
base = clamp( 0.25*Trend + 0.25*Location + 0.25*Zone + 0.15*Regime + 0.10*Extension , 0, 100 )
       (Volume = 0.00 — never a positive input; renormalise weights if MA/Regime unavailable)
```
- **Trend structure** — MA 20/50/200 alignment + slope + channel quality + HH/HL or
  LH/LL consistency.
- **S/R zone quality** — touches, freshness, ATR-normalised reaction, violation
  history, age decay, tightness/cleanliness (`f_rescore`, volume-free).
- **Price location** — signed distance to key S/R, range position 0–100, ATR
  distance, MA distance.
- **Regime** — Trend / Range / Compression / Expansion / Chop (structure behaviour
  + ATR percentile; ADX/CHOP internal only).
- **ATR extension / maturity** — distance from MA / range mid → Normal / Stretched /
  Extended.
- **MA structure** — feeds Trend (alignment/slope/spacing); availability gates the
  cap at 65.
- **Volume context** — **0% of score, ever.** At most an internal/Advanced context
  flag that can only act as a one-way **veto** (e.g. flag a break on conspicuously
  thin volume as "unconfirmed," lowering confidence) — it can never add points and
  is never required for a high score. Brand law: Volume = 0% of RC Score.

**Stage II — gates, caps, penalties.** The base is then disciplined by the `agree3`
gate (§2), the `min`-caps (§3), and the penalties (§5). The base **cannot by itself**
produce ≥70 unless `agree3` and all gates pass. This two-stage shape is the whole
point: a great trend + great MA must not *average* their way to 80 while location is
a gap and the zone is one-touch.

A small **Structure Delta** (±, vs the prior confirmed bar/day) nudges the score and
drives the "Structure Change" row, but never lifts a read into Clear on its own.

## 5. How to avoid false confidence
- **AND-gates, not averages**, for the Clear band (§2).
- **Take the minimum** of base and every cap (§3) — the worst lens sets the ceiling.
- **Explicit conflict detection** → cap + penalty when trend/location/zone disagree.
- **Hysteresis / smoothing** — the headline cannot jump bands bar-to-bar: require N
  confirmed bars in a higher band before promoting, or limit `|Δscore|` per confirmed
  bar to ~15. (Directly fixes the QA `score.large_jump` finding.)
- **Confirmed-bar only** — the live bar may preview; it is final on close. No
  repaint, no lookahead.
- **Whole numbers only** — no decimals, no fake precision.
- **Low is allowed to be low; thin data shows `Insufficient`** — never a forced
  number.
- **No single lens can manufacture a high score.**
- **Structure, not trades** — no location or zone is ever evaluated as an "entry";
  retire any "Setup"-style wording from the surface.

## 6. How "Unclear" stays the default
- **Default band is Mixed / Unclear (45–69).** `Clear` (≥70) is *earned* through the
  agreement gate; `Weak` (<45) is for genuine disagreement/poor structure;
  `Insufficient` is the data gate.
- **Burden of proof is on Clear** — if any required lens is unknown or unavailable,
  you cannot be Clear (cap 65).
- **Initialisation / missing data → Insufficient or Unclear**, never a mid-70s
  default.
- **Calibrate so Clear is a minority state** across a random basket (target: Clear
  present on well under ~20–25% of symbol/bar observations at any moment) — verified
  in §7.

## 7. Validation against 20 real charts (founder-run on TradingView)
The sandbox cannot render charts, so validation is a founder pass plus the offline
harness.

**Sample (20):** 5 clean trends, 5 clean ranges, 5 chop/messy, 5 edge cases
(price-discovery / post-earnings extension / thin new listing / wide expansion / gap
between levels). Mix equities + crypto + one index; mostly 1D, a couple intraday.

**Record per chart:** RC Score + state, the three big-lens states (Trend / Location /
Zone), regime, extension, and a human "is this actually *clear structure*? Y/N."

**Acceptance criteria (conservatism checks):**
- Clear appears on the clean-trend / clean-range charts a human agrees are obvious —
  and **almost never** on chop/edge charts.
- **No chart reads Clear** while any big lens is Weak/Insufficient or in conflict.
- Score does not move >~15 between adjacent confirmed bars without a real structural
  event.
- Chop / expansion / extended / price-discovery charts are capped (≤50 / ≤60).
- Thin-data charts show `Insufficient Structure`, not a number.
- Across all 20, **Clear is the minority** state (rare by design).

**Tooling:** extend `data/qa/fixtures/` with one fixture per case and add the rules
in §QA below; `npm run qa:rc` must pass. The harness already encodes several of these
(`high_with_weak_zones`, `large_jump`, `state_mismatch`, `high_score_in_chop`,
`stale_but_strong`, `one_touch_strong`).

## 8. Dashboard surface (what is shown) — calm, state-first
Default table, **one** optional whole-number headline; **state words** elsewhere
(per `RANGECLARITY_V2_SURFACE_SPEC.md`):

| # | Row | States |
|---|---|---|
| 1 | **RangeClarity** | `Clear` / `Mixed` / `Weak` / `Insufficient Structure` (+ optional number, e.g. `Mixed · 58`) |
| 2 | **Trend Structure** | `Clean` / `Mixed` / `Weak` / `Range-bound` |
| 3 | **Location** | `Near Support` / `Lower Range` / `Mid-Range` / `Upper Range` / `Near Resistance` / `Above Range` / `Below Range` |
| 4 | **Zone Quality** | `Fresh` / `Tested` / `Weak` / `Insufficient` |
| 5 | **Extension** | `Normal` / `Stretched` / `Extended` |
| 6 | **Structure Change** | `Improved` / `Weakened` / `Unchanged` |
| 7 | **Key Zones** | compact `S 58.40 · R 67.50` |

No per-row `/100` by default. No "Setup" / "Bias call" / direction-as-instruction row.

## 9. What stays hidden / internal (Advanced + engine)
- Per-lens 0–100 sub-scores (Trend / Location / Zone / Regime / Extension).
- Regime detail, ATR percentile, optional ADX / CHOP internals.
- **Volume context flag** (0% of score; one-way veto only).
- MTF / HTF alignment (architected, off by default).
- Zone debug (touches, age, reaction, violation count), `agree3` count, **which caps
  fired** (the cap trace), Structure-Delta deltas.
- Advanced **explains** the engine; it never clutters the calm surface.

## 10. First implementable scoring spec for Pine
Concrete, referencing variables already present in `pine/rangeclarity_sr_core_v1.pine`
(`rcSRScore`, `msQuality`/`rcMAavail`, `rcTCQ`, `rcLocClarity`/`rcLocState`,
`locNearAtr`/`locExtAtr`/`locRangePos`, `rcState`/`rcStateQ`,
`msSignCons`/`msAlign`/`msAbove200`/`ms200`, `atr`, zone `f_strength`). Single-file,
reversible, no new chart objects.

```
// Stage I — base (structure-only; volume 0%)
trendQ  = blend(msQuality, rcTCQ)         // MA structure + trend/channel quality
locQ    = rcLocClarity
zoneQ   = rcSRScore                        // volume-free zone composite
regimeQ = rcStateQ
extQ    = locExtAtr <= 1.5 ? 100 : locExtAtr <= 3.0 ? 60 : 25   // Normal/Stretched/Extended
base = clamp( 0.25*trendQ + 0.25*locQ + 0.25*zoneQ + 0.15*regimeQ + 0.10*extQ , 0,100 )
       // renormalise weights when rcMAavail == false

// Stage II — booleans (gates)
okData       = pivots>=2/side AND keyZonePresent
trendDecided = trendState == "Clean"  (clean Range allowed)
locMeaning   = rcLocState in {Near Support, Near Resistance, clean Mid-Range}
zoneReal     = keyZoneStrength in {Fresh, Tested}      // >=2 touches or strong reaction
noConflict   = sign(trend) agrees with location/zone type
regimeOk     = rcState in {Trend, clean Range}
notExtended  = extQ >= 60
agree3       = trendDecided AND locMeaning AND zoneReal

// caps (take the minimum)
if not okData            -> SHOW "Insufficient Structure"  (no number)   // gate
cap = 100
if rcState == Chop                         -> cap = min(cap,50)
if not zoneReal                            -> cap = min(cap,55)
if not noConflict                          -> cap = min(cap,55)
if not notExtended                         -> cap = min(cap,60)
if rcLocState in {Above Range,Below Range} -> cap = min(cap,60)
if expansion                               -> cap = min(cap,60)
if (not rcMAavail) or oneSidedStructure    -> cap = min(cap,65)
if not agree3                              -> cap = min(cap,69)   // no Clear without agreement

// penalties (subtract, then clamp), then apply cap
score = base - (noConflict?0:10) - (staleKeyZone?8:0) - (oneTouchKeyZone?8:0) - (lowFreshness?5:0)
score = min( clamp(score,0,100), cap )

// hysteresis (anti-jump) on confirmed bars
score = barstate.isconfirmed ? limitDelta(prevScore, score, 15) : prevScore

// state band
state = not okData ? "Insufficient Structure"
      : score>=70 ? "Clear" : score>=45 ? "Mixed" : "Weak"
```
New work vs today's `rcOverall` (the plain weighted blend at ~line 1064): the
booleans, the `min`-cap chain, the conflict detector, the penalty block, and the
delta-limiter — all scalar math on confirmed bars.

---

## QA test cases (extend the harness)
| # | Case | Expectation |
|---|---|---|
| 1 | Trend Clean + Near Support + Zone Fresh + Trend regime + Normal ext | **Clear ≥70** (positive control) |
| 2 | Same but key zone one-touch / Weak | ≤55, Mixed/Weak |
| 3 | Strong trend + zone but regime Chop | ≤50 |
| 4 | Uptrend but price jammed under strong resistance (conflict) | ≤55 |
| 5 | Clean trend but ATR Extended | ≤60 |
| 6 | Location Above Range (price discovery, no overhead level) | ≤60 |
| 7 | <2 pivots / no key zone (thin) | `Insufficient Structure`, no number |
| 8 | MA unavailable, S/R + location great | ≤65 |
| 9 | Adjacent confirmed bars, no structural event | `|Δ|` ≤ ~15 |
| 10 | Genuine disagreement across lenses | Weak <45 (not floored up) |

Reuse existing rules: `high_with_weak_zones`, `large_jump`, `state_mismatch`,
`high_score_in_chop`, `stale_but_strong`, `one_touch_strong`, `zone.too_close`.

## Implementation plan (after approval — spec/lock until then)
- **Phase 0 — lock:** approve this doc; freeze weights, caps, thresholds, row list.
- **Phase 1 — RC-1 (~2 days):** implement Stage I + II in `sr_core_v1.pine`,
  replacing the plain `rcOverall` blend. Keep volume 0%. No new chart objects.
- **Phase 2 — surface:** reshape the dashboard to the 7 state-first rows (§8); move
  sub-scores / regime detail / volume flag / cap-trace to Advanced; remove
  "Setup"-style wording.
- **Phase 3 — validate:** add the 10 QA fixtures + rules; `npm run qa:rc` green;
  founder runs the 20-chart pass (§7); tune thresholds so Clear is rare.
- **Phase 4 — deeper research / calibration:** per-asset and per-timeframe threshold
  tuning (crypto vs equities, 1D vs intraday); optional MTF agreement factor (off by
  default); regime-classifier robustness (ADX/CHOP); Extension thresholds.

**Guardrails:** structure-only; volume 0%; confirmed-bar only; whole numbers;
state-first surface; one reversible single-file change; no signal/trade language;
reads **clean structure, not trades**.

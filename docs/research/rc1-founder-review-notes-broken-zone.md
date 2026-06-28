# RC-1 Founder Review Notes — Broken Zone Over-Rejection

> **Documentation / analysis only.** No scoring change, no cap change, no `agree3` loosening, no
> Broken-Zone A/B implemented or run, no Pine, no payment, no commit/push. **Conviction: RED** — stays
> RED until the *full* founder-label set is complete and compared against the frozen 1,767-window
> baseline. Nothing here is a validation claim. Founder labels below live in this note; they are **not**
> written into `founder_review_priority.csv` (left untouched by request).
>
> Sources: `research/reports/visual_review/founder_review_charts.html` ·
> `research/reports/visual_review/founder_review_priority.csv` ·
> `research/reports/visual_review/agent_label_suggestions.csv` ·
> `research/rc1_review_agent/rc_structural_review_agent.py` ·
> `docs/research/rc1-real-data-visual-review-v1.md` · `docs/research/rc1-ab-test-broken-zone-v0.md` ·
> `docs/research/rc1-founder-labeling-guide.md`.

## Context
RC-1 Real Baseline v1 (real data, frozen) found heavy over-rejection: 19/20 symbols · **1,767 windows**
· Unclear **984** · Mixed **783** · Clear **0** · HighClarity **0**. Broken Zone fired heavily; `agree3`
also bound heavily. The `clean_but_capped` queue (40 windows) is being manually reviewed by the founder.

## Core issue
Broken Zone appears to be over-triggering — **but not every spurious Broken flag means the chart should
become Clear.** The review is surfacing distinct failure modes that must be told apart.

## Failure-mode taxonomy (the 5 labels)
1. **normal_pullback_false_cap** — Broken fires too early on a normal retest/pullback into *active*
   support that price reclaims/holds.
2. **stale_zone_false_cap** — Broken fires on a stale/secondary/far level while the nearest *active*
   structure remains intact.
3. **genuinely_unclear** — Broken may be imperfect, but the chart is still structurally conflicted
   (contradiction, volatility, deep excursion) and should **not** become Clear.
4. **true_broken** — Broken is valid: the relevant in-play structure decisively fails and does not reclaim.
5. **unsure** — founder cannot decide from the current view.

## Chart-by-chart founder labels (10 of 40 reviewed)

### #1 · AMD @ 2019-08-06 — `normal_pullback_false_cap` (conf 0.75)
- **Reason:** relevant in-play support was tested after a sharp pullback, but price reclaimed/held the
  zone. Broken cap looks too strict — a normal pullback false cap, not a confirmed breakdown.
- **Notes:** the zone was active and relevant, not stale. Price returned to support after a strong move
  and did not clearly fail below it.
- **Model implication:** Broken should not cap a clean chart simply because price briefly dips
  into/through active support and reclaims.

### #2 · JPM @ 2019-10-02 — `normal_pullback_false_cap` (conf 0.65–0.70)
- **Reason:** relevant support ~93–96 tested after a strong September breakout. Price dipped briefly
  below the zone but reclaimed it, only one bar below — a normal pullback into a relevant support area.
- **Notes:** the zone is the main structural zone on the chart, not stale. Broken cap appears too strict.
- **Model implication:** a brief, reclaimed dip below an active support/retest zone should not
  automatically be Broken.

### #3 · INTC @ 2023-09-22 — `normal_pullback_false_cap` (conf 0.65)
- **Reason:** Broken fired on a relevant in-play support ~33–35. The late-September drop was sharp, but
  price was retesting the active support zone rather than clearly breaking down. Agent diagnostics:
  reclaimed=True, bars_below=2, trend=Clean, regime=Trend, loc=NearSupport.
- **Notes:** more borderline than AMD/JPM (deeper pullback, two bars below/inside the zone), but the
  support area still appeared in play. Broken likely triggered too early.
- **Model implication:** Broken should require decisive failure, failed reclaim, or time-confirmed
  invalidation before capping a deep-but-reclaimed active-zone retest.

### #4 · XOM @ 2021-11-22 — `stale_zone_false_cap` (conf 0.70–0.75)
- **Reason:** Broken fired on an old support cluster rather than a clearly failed current structure.
  Price dropped sharply into 51–52, but the break was non-decisive (one bar below/near; very old pivot age).
- **Notes:** old-zone false cap — but **not** because all old zones are invalid. Weekly context shows old
  levels can matter as major regime levels. This cap is wrong because the break was non-decisive and tied
  to a stale/minor cluster, not a confirmed higher-timeframe failure.
- **Model implication:** do not ignore old zones automatically — distinguish stale minor clusters from
  major higher-timeframe regime levels.

### #5 · MSFT @ 2024-12-31 — `stale_zone_false_cap` (conf 0.75)
- **Reason:** Broken fired on a secondary support far from price while the nearest in-play support
  (~407–425) remained intact / still being tested, not decisively broken.
- **Notes:** more range/mixed than trend-pullback, so not a clean normal pullback — but the cap still
  looks wrong because it came from a stale/secondary cluster, not the current active structure.
- **Weekly reference insight:** the 400–425 area looks like a major higher-timeframe zone, not a stale
  level. (Do **not** use 2025–2026 price action to label the 2024-12-31 case — see hindsight guardrail.)
- **Model implication:** Broken should depend on whether the relevant in-play / primary HTF structure
  failed — not whether any secondary historical support was violated.

### #6 · NVDA @ 2022-04-18 — `stale_zone_false_cap` (conf 0.75)
- **Reason:** Broken triggered by a secondary/far support ~2.9 ATR from price while the nearest in-play
  support (~20.5–23) did not break. The chart is weak/mixed, but the cap came from the wrong level.
- **Notes:** a broader correction / weak structure, not a clean normal pullback — yet still a
  secondary-zone false cap because it did not reflect failure of the active nearest structure.
- **Weekly reference insight:** long-term base structure exists, but **no hindsight** — the useful point
  is level hierarchy, not 2024+ validation.
- **Model implication:** secondary/far clusters should not cap the chart if the nearest active structure
  remains intact.

### #8 · GE @ 2020-02-26 — `stale_zone_false_cap` (conf 0.60–0.65)
- **Reason:** Broken fired on a secondary support while the nearest active support (~52–55) remained
  intact; price pulled sharply in but there was no confirmed breakdown of that in-play structure.
- **Notes:** borderline (sharp move, reclaimed=False), but the cap appears to come from the wrong level →
  stale/secondary-zone false cap is the best label.
- **Model implication:** even on weaker charts, Broken should not fire on secondary structure if the
  nearest active zone has not clearly failed.

### #9 · WMT @ 2023-05-30 — `stale_zone_false_cap` (conf 0.65)
- **Reason:** Broken fired on a secondary support while the nearest active structure (~47–48 / 45.5–46)
  remained intact; price was pulling back after a clean March–May advance, still testing, not breaking down.
- **Notes:** has some pullback character, but the diagnostic issue is secondary-zone triggering, not an
  in-play reclaim — so `stale_zone_false_cap` is more precise than `normal_pullback_false_cap`.
- **Model implication:** secondary/local clusters should not cap when the primary active structure holds.

### #11 · TSLA @ 2023-05-30 — `genuinely_unclear` (conf 0.65)
- **Reason:** Broken itself may be spurious (price reclaimed the in-play zone), but the chart has real
  structural conflict — a wide, volatile range around a major reaction zone. The `contradictory` cap
  appears to be the correct dominant blocker.
- **Notes:** **key case** — not every spurious Broken flag should lead to Clear. A chart can have a bad
  Broken flag and still be genuinely unclear.
- **Model implication:** the A/B must **not** convert every spurious Broken into Clear. Broken release
  should help only if other structural lenses are clean and non-contradictory.

### #14 · SPY @ 2019-01-15 — `genuinely_unclear` (conf 0.70)
- **Reason:** very deep ~4.61 ATR excursion below the in-play support, 14 bars below before reclaiming.
  Not stale/secondary, not a normal pullback. The Broken flag may be uncertain (reclaim), but the chart
  is structurally conflicted after a major volatility event.
- **Notes:** not every reclaimed zone should become valid again — a deep volatile round-trip with reclaim
  can still be genuinely unclear.
- **Model implication:** the A/B must distinguish a **clean reclaim after a shallow support test** from a
  **deep volatile round-trip after structural damage**.

### Not yet reviewed (do not invent)
Reviewed so far: **10 of 40** (priority ranks 1–6, 8, 9, 11, 14). **Not yet reviewed:** ranks **7, 10, 12,
13**, and **15–40**. These have no founder label yet and must not be fabricated.

## Current founder label distribution (10 labeled)
| label | count |
|---|---|
| normal_pullback_false_cap | 3 |
| stale_zone_false_cap | 5 |
| genuinely_unclear | 2 |
| true_broken | 0 |
| unsure | 0 |

## Agent cross-reference (informal — NOT the official comparison)
On the 10 windows reviewed, the founder's documented labels match the read-only review agent's
suggestions **10/10** (AMD/JPM/INTC → normal_pullback; XOM/MSFT/NVDA/GE/WMT → stale; TSLA/SPY →
genuinely_unclear). This is encouraging that the agent's structural heuristics track the founder's
judgment, **but it is not validation and not the official metric**: the official distribution / agreement
rate / confusion table come from entering the labels into `founder_review_priority.csv` (or the template)
and running `rc_structural_review_agent.py`. Conviction stays RED.

## Emerging conclusions
1. **Broken Zone is over-triggering, but not uniformly.** Two main false-cap families: (a) normal
   retest/pullback into active support capped too early; (b) secondary/stale/far clusters capping while
   the nearest active structure remains intact.
2. **Some spurious Broken flags should stay capped by other lenses.** TSLA and SPY show a Broken flag can
   be imperfect while the chart still deserves Mixed/Unclear (contradiction, volatility, deep excursion).
3. **Level hierarchy is now required.** Binary broken/not-broken is too crude.
4. **Old zones must not be ignored automatically.** Weekly context (XOM, MSFT, NVDA, GE, WMT, SPY) shows
   old levels can stay important when they are major regime levels. The issue is **relevance, hierarchy,
   and decisiveness — not age alone**.
5. **Broken should require more than a shallow violation.**
6. **Avoid hindsight leakage** (below).

### Level taxonomy (future)
- `primary_in_play_zone`
- `secondary_local_level`
- `major_regime_level`
- `stale_minor_cluster`

### Candidate Broken requirements
- relevant **in-play** level (not secondary/far) ·
- **decisive** break depth (relative to ATR and zone width) ·
- **failed reclaim OR time-confirmed** invalidation ·
- the **nearest active structure actually failed** ·
- do **not** fire on secondary/far clusters or stale minor levels ·
- do **not** release charts that still have contradiction / chop / severe-extension problems.

### Hindsight-leakage guardrail
Weekly charts may help **define structural concepts** (regime levels, hierarchy), but **later price action
must never be used to label an earlier date**. Concepts only, never outcome hindsight.

## Potential future feature direction — Structure Corridor / Trend Structure Band
**Classification:** Candidate / Needs Validation. **Not** an RC-1 Pine default. **Prototype in the Python
visual review first.**
- **Purpose (context only):** show whether price is moving inside an orderly structural path; visualize
  trend cleanliness; show compression / range / expansion; show when price is stretched or structurally
  weak; help the user grasp chart context in under 3 seconds.
- **Strict guardrails:** no buy/sell, no entry/exit, no TP/SL, no arrows, no signal labels, no prophecy,
  no aggressive green/red trade coloring, no Bullish/Bearish verdict — context only.
- **Possible visual language:** teal = orderly structure · gray = mixed/range-bound · amber =
  stretched/unstable · muted red = structurally broken/weak.
- **Do NOT copy from external indicators:** B/S labels, "Strong" labels as signals, TP labels, Prime
  Score, prophecy, oscillator stacks, green/red signal framing. Use only as inspiration for HTF regime
  awareness, a structure corridor / compression channel, range/compression/breakout/extension distinction,
  and calm structural context.

## Recommended next steps
1. Continue founder review until **at least 20** cases are labeled.
2. **Do not run the Broken-Zone A/B yet.**
3. After labels exist (entered into the CSV): run `rc_structural_review_agent.py` → compute founder label
   distribution → agent agreement → confusion table.
4. Only then decide: **approve a narrow A/B · reject · or continue review.**
5. If approved, it must be **narrow**: don't loosen `agree3` broadly; don't remove the Broken cap; only
   scope/strengthen Broken semantics; compare against the frozen 1,767-window baseline; check
   suspicious_high / false-high leakage; verify Clear becomes reachable **only** on clean charts; verify
   HighClarity stays rare.

### Potential A/B hypothesis
Broken Zone should apply only when the **relevant primary in-play structure fails decisively** — not when
any historical/secondary/stale cluster is violated.

### Potential A/B rule ideas
- Evaluate the nearest active support/resistance first.
- Treat secondary/far clusters as **debug context, not hard caps**.
- Require failed reclaim or N-bar time confirmation before the Broken cap.
- Require break depth relative to ATR and zone width.
- **Preserve** caps from contradiction / chop / severe extension.
- Do **not** upgrade `genuinely_unclear` cases just because Broken is removed.

## Status / what remains blocked
- **Blocked:** founder labeling continues (10/40 done); Broken-Zone A/B (spec-only, not implemented/run);
  scoring/cap/`agree3` changes; Pine; payment/Lemon; web QA/commits; pushes.
- **Conviction: RED** until the full founder-label set is complete and compared against the frozen baseline.

---

## Update 2 — 15 windows reviewed (2026-06-25)

Founder labeling extended from 10 to **15 of 40**. Five new windows added (all `genuinely_unclear`).
Labels are now persisted in `research/reports/visual_review/founder_labels_template.csv` (the priority CSV
is left untouched). Conviction stays **RED**.

### New chart-by-chart labels
- **#15 · META @ 2026-04-14 — `genuinely_unclear` (0.70):** deep 4.76 ATR excursion below the in-play
  support, 16 bars below before reclaim. Broken may be uncertain due to reclaim, but a structurally
  conflicted round-trip around an active zone.
- **AMZN @ 2022-03-18 — `genuinely_unclear` (0.70):** deep 3.28 ATR excursion, 18 bars below before
  reclaim. Not a normal pullback and not a stale/secondary-zone case.
- **CVX @ 2020-11-10 — `genuinely_unclear` (0.70):** deep 4.38 ATR excursion, 20 bars below before
  reclaim. Structurally conflicted after a deep volatility round-trip into the active zone.
- **DIS @ 2025-04-29 — `genuinely_unclear` (0.70):** deep 2.49 ATR excursion, 13 bars below before
  reclaim. Not a clean pullback, not stale/secondary; conflicted around the active 88-96 zone.
- **#32 · AVGO @ 2019-08-06 — `genuinely_unclear` (0.60-0.65):** moderate 0.73 ATR penetration over 2
  bars, no reclaim yet. The broken level is active/relevant (not stale) and unreclaimed (not a clean
  pullback) — evidence does not separate a real breakdown from a pullback.

### Updated founder label distribution (15 of 40 labeled)
| label | count |
|---|---|
| normal_pullback_false_cap | 3 |
| stale_zone_false_cap | 5 |
| genuinely_unclear | 7 |
| true_broken | 0 |
| unsure | 0 |

Not yet reviewed: ranks 7, 10, 12, 13 and the remainder of 15-40 (no labels invented).

### Refined insights (15-window view)
- **Three false/uncertain families are now clear:** normal_pullback (AMD, JPM, INTC) · stale_zone (XOM,
  MSFT, NVDA, GE, WMT) · genuinely_unclear (TSLA, SPY, META, AMZN, CVX, DIS, AVGO).
- **Reclaim alone is NOT enough** — do **not** implement `if reclaimed then not broken`. Distinguish:
  (a) shallow/moderate test + quick reclaim + clean structure → possible false cap;
  (b) deep ATR excursion + many bars below + volatile round-trip → genuinely unclear;
  (c) moderate break + no reclaim yet + active support → genuinely unclear / wait for confirmation.
  The 7 genuinely_unclear cases are mostly deep multi-bar round-trips — exactly what a naive reclaim rule
  would wrongly promote to Clear.
- **C-F and H unchanged** (level hierarchy required; old zones not auto-ignored — relevance + decisiveness,
  not age; Broken needs decisive + failed-reclaim/time-confirm; A/B stays narrow; Structure Corridor is a
  document-only candidate) — see the original sections above.

### Path to higher conviction
1. Continue labeling to >=20, ideally all 40. 2. Keep labels in the template / priority CSV.
3. Run `python research/rc1_review_agent/rc_structural_review_agent.py` only after enough labels exist.
4. Produce: founder distribution · agent agreement · confusion table · false-cap family counts ·
   true_broken count · genuinely_unclear count.
5. Approve the A/B only if: true_broken stays low · false-cap families dominate · suspicious_high /
   false-confidence does not rise · Clear becomes reachable only on genuinely clean charts · HighClarity
   stays rare. 6. If many cases are genuinely_unclear (now 7/15), keep Broken conservative and refine only
   level relevance/hierarchy.

### Early read (informal — NOT a verdict)
Of 15 reviewed: **8 clear false caps** (3 pullback + 5 stale) · **7 genuinely_unclear** · **0 true_broken**
· 0 unsure. Zero true_broken among the worst clean_but_capped cases points toward a **narrow A/B** (scope
Broken to the in-play primary level + decisive break + failed-reclaim/time-confirm) rather than a broad
loosening — but this is **not** a verdict: it needs the full label set + the agent run + comparison to the
frozen 1,767-window baseline. Conviction **RED**.

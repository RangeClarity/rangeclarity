# RangeClarity Dashboard UX — redesign notes

**Status:** implemented as an additive block inside `pine/rangeclarity_sr_core_v1.pine`,
wrapped in `// BEGIN RangeClarity Dashboard UX` … `// END RangeClarity Dashboard UX`.
The S/R engine and the MA Structure Layer are **not modified** (engine content is
byte-for-byte identical except two input *defaults* flipped — see below). All new
identifiers are `rc`-prefixed.

Goal: answer one question at a glance — **"What is the market-structure quality right
now?"** — with one Overall score, two sub-scores, a plain-language state, the nearest
key levels, and long-term position. Context only: **no buy/sell, long/short, entries,
exits, targets, predictions, win-rates, or alerts.**

---

## 1. Current dashboard audit (the old `dash` table)
The legacy table had **11 rows, mostly `size.tiny`**, with technical wording and no
score:

| Row | Label | Content |
|----|----|----|
| 0 | RangeClarity S/R v1 | title + ticker·tf |
| 1 | Market bias | Bullish/Bearish/Sideways/Unclear |
| 2 | Active setup | descriptive setup string |
| 3 | Nearest support | tier + distance % |
| 4 | Nearest resistance | tier + distance % |
| 5 | Strongest zone | tier + score |
| 6 | Visible levels | count |
| 7 | Tracked zones | count |
| 8 | Last event | approach/enter/break/retest |
| 9 | Channel | channel state |
| 10 | Channel bias | channel bias |

Problems: too many rows, dense jargon, tiny text, and **no single "how good is the
structure" answer**.

### Where each legacy row goes now
- **Minimal:** Overall score, Market State, Nearest key level.
- **Standard:** Overall, S/R score, MA score, Market State, Nearest support, Nearest
  resistance, vs 200.
- **Advanced:** Standard + Active setup, MA spacing, Tracked zones (+ optional
  Components / MA detail when "advanced details" is on).
- **Moved to the legacy detail table (off by default):** Strongest zone, Visible
  levels, Last event, Channel, Channel bias. (These live *inside* the engine's render
  block and are not exposed as globals; the legacy table remains available for
  debugging via "Show legacy S/R detail table".)

---

## 2. New dashboard layout (3-column grid: label · score · state)
Premium, minimal, Bloomberg-meets-Apple. The Overall score row is emphasised with
large text; every other row is `size.small` (no tiny text). Color encodes *state only*.

**Minimal (3 rows)**
```
RC Score        84/100   Strong Structure
State                    Trend Developing
Near                     Key S · 58.24
```

**Standard (7 rows)**
```
RC Score        84/100   Strong Structure
S/R             88/100   Strong Levels
MA Structure    92/100   Strong Trend
Market State             Trend Developing
Support                  Key S · 58.24
Resistance               Key R · 67.50
vs 200                   Above · +8.4%
```

**Advanced (10 rows, or 12 with "advanced details")**
```
… Standard rows …
Setup                    <active setup>
MA spacing               Compressed / Normal / Expanding
Tracked zones            <n>
Components               S/R 88 · MA 92 · St 60     (advanced details only)
MA detail                align 90 · agree 80%       (advanced details only)
```

Default rows are kept to **3 / 7 / 10–12** — at or under the 6–8 target for the
everyday (Standard) view.

### Wording (premium, descriptive)
- Sub-score grades: **Exceptional** (90–100) · **Strong** (75–89) · **Healthy**
  (55–74) · **Developing** (35–54) · **Weak** (0–34).
- Overall: "<grade> Structure". S/R: "<grade> Levels". MA: "<grade> Trend".
- Market State: **Trend Developing / Range Bound / Compression / Mixed / Transition**.
- Levels: "Key S · <price>", "Strong R · <price>", "Local S · <price>".
- Position: "Above · +8.4%" / "Below · -3.1%".

### Color (state, not decoration)
Muted teal (strong/healthy) → soft green → amber (developing) → muted red (weak).
Support teal, resistance amber, state colored by kind. Backgrounds are the same dark
slate as the rest of the product.

---

## 3. Scores: added vs reused
- **MA Structure (reused):** the MA layer's `msQuality` (0–100), shown directly. If the
  MA layer is disabled or lacks history, the row reads "off" and its weight is removed.
- **S/R Structure (new, dashboard-derived):** built from **real engine output** — the
  scores of the nearest support/resistance zones in the global `zones` pool (found with
  the engine's own `f_nearestIdxD` within `localDist`), plus a *framing* term (both
  sides present > one side > none) and *bias clarity* (defined vs Unclear):
  `S/R = 0.55·avg(nearest zone scores) + 0.30·framing + 0.15·biasClarity`.
- **Market State quality (new, derived):** a 0–100 read of how decisive the current
  state is (clean trend with agreeing MAs scores high; mixed/transition scores low).
- **Overall RangeClarity Score (new, blended):**
  `0.45·S/R + 0.35·MA + 0.20·State`, **weights renormalised** if a module is
  unavailable (e.g. MA off ⇒ 0.45/0.20 rescaled to sum to 1). Result clamped 0–100.

All scores are **presentation-only** — they do not feed back into the engine,
zone selection, or any chart drawing.

---

## 4. Inputs added (group "RangeClarity Dashboard")
| Input | Default | Notes |
|---|---|---|
| Show RangeClarity dashboard | **true** | The main product dashboard. |
| Dashboard detail | **Standard** | Minimal · Standard · Advanced. |
| Show advanced dashboard details | **false** | Adds debug-like component rows in Advanced. |
| Dashboard position | **Top Right** | Top/Middle/Bottom corners. |

### Two legacy toggles flipped to OFF (presentation only)
- `showDash` → **false**, relabelled **"Show legacy S/R detail table"**.
- `msShowDash` → **false**, relabelled **"Show legacy MA mini-table"**.

These are the only changes to pre-existing lines (verified by diff: lines 36 and 739).
Engine logic, zone selection, scoring, fallback, drawings, and alerts are untouched.
Re-enabling either legacy table is supported (intended for debugging; it may overlap
the new dashboard since both anchor top-right by default).

---

## 5. How to validate in TradingView (final gate — run by a human)
> Authored and statically self-checked outside TradingView; **not compiled here.**

1. **Compiles** with no errors/warnings.
2. Check on **1D and 4H** across a large-cap stock/ETF, a crypto pair, and an index.
3. Toggle **Minimal / Standard / Advanced** — row sets match this doc; no empty rows.
4. **Readable at normal zoom** — Overall score is the emphasis; no tiny text.
5. **Scores match chart reality** — strong, well-framed, trending structure reads high;
   choppy/again­st-200/unframed reads lower; a tight MA cluster reads "Compression".
6. **No buy/sell/signal/entry/exit/target/prediction language** anywhere.
7. **S/R zones and MA lines on the chart are unchanged** (this was a dashboard-only
   change).
8. Disable the dashboard → nothing draws; enable a legacy table → it still works.
9. With the MA layer disabled, the MA row reads "off" and the Overall score
   renormalises sensibly.

---

## 6. What was intentionally removed from the default view
Strongest-zone, Visible-levels, Last-event, Channel, and Channel-bias rows are no longer
in the default dashboard (they remain available via the legacy detail table). No new
metrics, signals, or chart objects were added. The redesign is presentation + derived
scoring only.

---

## No-advice disclaimer
The RangeClarity dashboard summarises current market *structure* for context only. The
scores and labels are descriptive, not financial advice, recommendations, signals, or
predictions, and nothing shown should be treated as a basis for any trade decision.

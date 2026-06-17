# RangeClarity — TradingView Usage Guide

How to install and read `pine/rangeclarity_ultimate_core.pine`. RangeClarity is a **decision-support and chart-context tool**, not a signal service.

---

## 1. Install (2 minutes)

1. Open TradingView and any chart.
2. Bottom panel → **Pine Editor**.
3. Open `pine/rangeclarity_ultimate_core.pine`, copy **all** of it, paste into the editor (replace any template).
4. Click **Add to chart**. The dashboard appears (default top-right) with up to two zones and dashed range bounds.
5. (Optional) Open the indicator's settings to adjust **Sensitivity**, **Zone width**, **Theme**, and **Dashboard position**.

**Recommended use:** swing/position trading on **1H, 4H, 1D** (works on stocks, ETFs, crypto, FX). Give it a few hundred bars of history so pivots and percentiles populate.

---

## 2. Reading the dashboard (top to bottom)

| Row | What it tells you |
|---|---|
| **Regime** | The environment: Trend, Range, Compression (with a 0–100 tightness score), Expansion, or Chop. |
| **Structure** | Chart skeleton: Bullish / Bearish / Neutral / Range-bound / Breakout attempt / Failed breakout, with bias. |
| **Range Pos.** | Where price sits between nearest support and resistance: Lower / Mid / Upper, a %, and a meter `[####------]`. |
| **Momentum** | Strong / Improving / Fading / Extended / Weak / Neutral. Confirmation only — never an instruction. |
| **Zone Str.** | Strength (0–100) of the nearest active zone, from touch count, age/maturity, and volume. |
| **Confidence** | High / Medium / Low / Conflicting — how much the modules agree (0–100). |
| **Context** | The decision context (see below). |
| **Note** | One plain-English reason for the current context. |
| **State** | `forming` (live bar, not final) vs `confirmed` (bar closed) + "not advice". |

### Context labels (what they mean)
- **Strong Context** — modules aligned, higher confidence. A clean *read*, not a trade call.
- **Breakout Watch** — compressed and near a boundary; energy may release.
- **Pullback Zone** — a trend is pulling back into support/resistance.
- **Watch** — developing; nothing decisive yet.
- **Wait** — compressed or mid-range; let it resolve (poor reward-to-risk now).
- **Avoid Chase** — the move is extended; chasing has poor R/R.
- **Risk Elevated** — volatility shock; conditions are unstable — consider smaller size / standing aside.
- **No Edge** — conflicting, messy, or low-confidence. The honest answer is: nothing clean here.

RangeClarity will **never** show Buy, Sell, targets, guaranteed entries, or win rates. That is by design.

---

## 3. What the scores mean

All scores are 0–100, shown as whole numbers (no false precision).

- **Compression** — how unusually tight the recent range is (high = coiled).
- **Range Position** — 0 at support, 100 at resistance.
- **Zone Strength** — combines how many times a level was touched, how mature it is, and whether it formed on high volume.
- **Confidence** — a weighted blend of regime clarity, structure, momentum agreement, and zone quality, minus explicit penalties (chop, conflict, mid-range, volatility shock, extension, failed breakout). If signals conflict, it drops and reads **Conflicting**.

---

## 4. What "No Edge" means (and why it's good)

No Edge means the tool sees no clean, favorable read right now — signals conflict, price is mid-range, volatility is messy, or confidence is low. **This is a feature, not a failure.** Most losses come from acting when there is no edge. A tool that tells you to wait is doing its job.

---

## 5. How to read the support/resistance zones

- **Green-tinted box** = nearest support zone; **red-tinted box** = nearest resistance zone. Only the nearest of each is drawn to avoid clutter.
- The box is a **band** (price ± a fraction of ATR), because real reactions cluster — it is not a precise line.
- **Dashed grey lines** mark the current range bounds.
- A higher **Zone Strength** means the level has more history (touches, maturity, volume) behind it — but strength is context, not a guarantee it will hold.

---

## 6. What NOT to assume

- Do **not** read any label as "buy" or "sell." Context describes the market; you decide.
- Zones are probabilities, not walls — price can and does break strong zones.
- Pivots confirm a few bars late (honest lag); the tool will not back-date levels to look better.
- The live bar's read can change until it closes — treat `confirmed` as final.
- Strong Context ≠ a winning trade. It means the read is clean, nothing more.

---

## 7. Disclaimer

RangeClarity is an educational chart-structure and decision-support tool. It is **not financial, investment, or trading advice**, does **not** guarantee profits, and does **not** predict the market. Markets carry risk; you are responsible for your own decisions. Do your own research.

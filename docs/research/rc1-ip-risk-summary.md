# RC-1 IP-Risk Summary

> Authoritative IP classification for every reference file. Pairs with
> `indicator_research_library/license_ledger.md` (rows 1–36). **Concept-only review;
> we copy no code, formulas, UI, names, or colors.** Supersedes the tentative IP
> guesses in `rc1-reference-library.md`.

## Coverage
- Ledger rows **before:** 18 · **after:** 36 (all reference files now logged).
- Files: `sources/` (18) + `sources/RangeClarity/` (7) + `sources/MA/` (7) +
  `sources/TrendLine/` (4) = 36.

## The four buckets

### 🟢 A — Safe concept reference (MPL-2.0 → re-implement concept + attribute) — 10
Code is reusable under MPL but file-level copyleft; to stay closed we **re-implement
the concept** and credit the author. Safe to *inform* RC-1 design.
- Stop-Loss Clustering / Breakouts (KioseffTrading) · Liquidity Magnet Pro (JOAT) ·
  Smart Money Breakout Channels (AlgoAlpha) · Support Resistance Channels
  (LonesomeTheBlue) · Vdubus Pattern Gen (Bespoke) *(off-scope)* — original 5.
- **Statistical Zone Engine (JOAT)** · **Support Resistance Dynamic v2 (LonesomeTheBlue)**
  · **Dual MA Gradient (Gabremoku)** · **MA Suite SMA+EMA (MasterOfDesaster)** ·
  **Auto Parallel Channels HTF (TradeSymbiotic)** — new (rows 21, 24, 29, 30, 35).

### 🟡 B — Public but no-copy (CC BY-NC(-SA) → inspiration/concept-only, no code) — 15
Visible/open but **NonCommercial blocks code reuse** in a paid product. Extract the
plain-English idea only; attribute.
- Original CC-NC set (11): AngleMarket, Deviation, DynamicSwing, LiquidityThermal,
  MLRSI, NR2-NR20, Neural, Polynomial, TrendImpulse, VolumaticSupport, VolumeBubble (BigBeluga/Zeiierman/QuantAlgo).
- New (4): **Adaptive S&R Zones (BigBeluga)** · **Ranked S&R Zones (Zeiierman)** ·
  **Volumatic S/R Levels (BigBeluga)** · **Auto Channel (SciQua)** (rows 19, 20, 25, 34).

### 🔴 C — Proprietary / high-risk (LuxAlgo → description-only, never code) — 2
Treat as proprietary per founder rule regardless of the stated CC-NC tag. **Study only
the public *description/screenshots*; never read its logic into production reasoning.**
- **Support & Resistance Dynamic [LuxAlgo]** (row 22) · **Support & Resistance Pro
  Toolkit [LuxAlgo]** (row 23). Use at most as a *surface* reference (how much to show),
  not an engine source.

### ⛔ D — Exclude from production reasoning (no/unclear license, stub, empty) — 9
No license header (or stub/empty) → **must not influence production** per founder rule.
- Original none-stated (2): SmartTrader, FVG *(also a signal bot — counter-example only)*.
- New (7): **AG Pro MA Ribbon Stress Meter** · **Adaptive Trend Ribbon [Alpha Extract]**
  · **Custom EMA SMA Ribbon** · **MA.md** (stub) · **SMA Ribbon[A]** (© only, no license)
  · **Adaptive Trend Channel** · **Automatic Trendline [Metrify]** (empty) — rows 26, 27, 28, 31, 32, 33, 36.

## Consequence for the RC-1 reference cards (important)
Three EXCLUDE-bucket files were cited in `rc1-reference-library.md` cards. Their
*concepts* must be re-sourced from licensed/public equivalents — **do not** let the
unlicensed files inform production:
- Card 10 **Adaptive Trend Channel** (EXCLUDE) → use public **linear-regression channel**
  + Bucket-A channel sources instead.
- Card 12 **Adaptive Trend Ribbon** & Card 13 **AG Pro Ribbon Stress** (EXCLUDE) → use
  **MA Suite (MPL)** + **Dual MA Gradient (MPL)** + public **GMMA/ribbon** for the
  MA-spread-as-regime idea.

Net: every RC-1 lens still has a clean, licensed or public-standard concept path. No RC
capability depends on a Bucket-C or D file.

## Standing policy
Re-implement concepts from RangeClarity's own model (`rc1-truth-engine.md`); copy no
code/UI/names/colors/formulas; attribute MPL/CC sources; **LuxAlgo description-only;
unlicensed excluded.** Nothing here authorizes Pine work.

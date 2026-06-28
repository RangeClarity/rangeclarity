# RC-1 50-Case Manual Scoring Worksheet

> Open each chart on TradingView, confirm the scenario, capture the screenshot, then fill
> the same fields every time **into `labels-50-scoring-template.csv`**. **Expected answers
> are intentionally not shown here** — record what you *see*. When unsure → Unclear/Mixed,
> never Clear. Caps: `rc1-cap-thresholds-v0.md`. Manual only — no auto-capture, no Pine.

**Fill per case (record in the CSV):** `human_trend` (Clean/Mixed/Weak/Range-bound) ·
`human_location` (NearSupport/Lower/Mid/Upper/NearResistance/Above/Below) · `human_zone`
(Fresh/Tested/Weak/Insufficient) · `human_regime` (Trend/Range/Compression/Expansion/Chop)
· `human_extension` (Normal/Stretched/Extended/Severe) · `human_is_clear` (Y/N) ·
`negative_gate_applied` · `cap_applied` · `manual_state` · `manual_band` ·
`reviewer_confidence` (1–5) · `notes`. Screenshot: replace `<date>` with the bar date
(YYYYMMDD).

Chart setup once: clean candles, MAs 20/50/200 on, one ATR band (Keltner) for extension,
~150–300 bars visible, dark theme, nothing else.

---
**RC1-01** · NASDAQ:AAPL · 1D · clean_trend *(positive control)*
Look for: clean uptrend pulling back to a fresh/tested support; 20/50/200 stacked up.
Shot `RC1_01_AAPL_1D_<date>_clean_trend.png`

**RC1-02** · NASDAQ:MSFT · 1D · mid_range_poor_location
Look for: uptrend but price mid-move in a gap — no key zone near price.
Shot `RC1_02_MSFT_1D_<date>_trend_gap.png`

**RC1-03** · NYSE:KO · 1D · clean_range *(positive control)*
Look for: well-defined horizontal range, both rails tested, price mid.
Shot `RC1_03_KO_1D_<date>_clean_range.png`

**RC1-04** · NYSE:PG · 1D · clean_range *(positive control)*
Look for: clean range with price sitting at a tested rail (location + zone agree).
Shot `RC1_04_PG_1D_<date>_range_rail.png`

**RC1-05** · NASDAQ:TSLA · 1D · chop
Look for: tangled 20/50/200, overlapping candles, no clean swings, low efficiency.
Shot `RC1_05_TSLA_1D_<date>_chop.png`

**RC1-06** · NYSE:XOM · 1D · contradiction_conflict
Look for: uptrend jammed under heavy resistance (trend up vs location says blocked).
Shot `RC1_06_XOM_1D_<date>_conflict.png`

**RC1-07** · NASDAQ:NVDA · 1D · overextension
Look for: clean trend but price stretched far from the 200-MA in ATR terms.
Shot `RC1_07_NVDA_1D_<date>_extended.png`

**RC1-08** · NASDAQ:AAPL · 1W · mid_range_poor_location
Look for: all-time highs, no overhead level (price discovery upside).
Shot `RC1_08_AAPL_1W_<date>_price_discovery.png`

**RC1-09** · *operator-pick recent IPO (<6mo)* · 1D · thin_data
Look for: short history, very few confirmed pivots, no 200-MA yet.
Shot `RC1_09_<TICKER>_1D_<date>_thin_data.png`

**RC1-10** · NYSE:F · 1D · weak_zone
Look for: a level price touched only once / with no real reaction, treated as strong.
Shot `RC1_10_F_1D_<date>_weak_zone.png`

**RC1-11** · NYSE:T · 1D · weak_zone
Look for: an old level untouched ~250+ bars (stale) still drawn as important.
Shot `RC1_11_T_1D_<date>_stale_level.png`

**RC1-12** · CRYPTO:BTCUSD · 1D · volatility_expansion
Look for: volatility blow-off / range expanding fast (bands flaring).
Shot `RC1_12_BTCUSD_1D_<date>_expansion.png`

**RC1-13** · *operator-pick short-history name* · 1D · thin_data (lens missing)
Look for: recent listing with <200 bars → MA-200 unavailable.
Shot `RC1_13_<TICKER>_1D_<date>_lens_missing.png`

**RC1-14** · NYSE:GE · 1D · contradiction_conflict
Look for: MA rising while structure prints lower-highs/lower-lows (direct contradiction).
Shot `RC1_14_GE_1D_<date>_contradictory.png`

**RC1-15** · NYSE:WBA · 1D · clean_trend *(positive control, short side)*
Look for: clean DOWNtrend into a fresh resistance; MAs stacked down.
Shot `RC1_15_WBA_1D_<date>_clean_downtrend.png`

**RC1-16** · NASDAQ:AMD · 1D · broken_zone
Look for: a range breakout that failed and fell back inside (false break).
Shot `RC1_16_AMD_1D_<date>_breakout_fail.png`

**RC1-17** · NYSE:JPM · 1D · visual_dashboard_risk
Look for: two levels ~0.3% apart that should merge (near-duplicate zones).
Shot `RC1_17_JPM_1D_<date>_too_close.png`

**RC1-18** · NASDAQ:AVGO · 1D · full_agreement *(positive control — rare High Clarity)*
Look for: clean trend + at a fresh/tested zone + good location + trend regime + normal extension — all agree.
Shot `RC1_18_AVGO_1D_<date>_full_agreement.png`

**RC1-19** · NYSE:CVX · 1D · score_stability *(control — capture two adjacent bars)*
Look for: compare the last two confirmed bars; the read should not jump bands.
Shot `RC1_19_CVX_1D_<date>_hysteresis.png`

**RC1-20** · NASDAQ:INTC · 1D · chop
Look for: genuine multi-lens disagreement / directionless grind.
Shot `RC1_20_INTC_1D_<date>_disagreement.png`

**RC1-21** · AMEX:XLF · 1D · chop
Look for: sector ETF chopping sideways, MAs braided.
Shot `RC1_21_XLF_1D_<date>_chop.png`

**RC1-22** · CRYPTO:ETHUSD · 1D · chop
Look for: crypto range chop, no clean swings.
Shot `RC1_22_ETHUSD_1D_<date>_chop.png`

**RC1-23** · NYSE:PARA · 1D · chop
Look for: low-efficiency grind, no direction.
Shot `RC1_23_PARA_1D_<date>_chop.png`

**RC1-24** · NYSE:DIS · 1D · weak_zone
Look for: a single-touch resistance being treated as strong.
Shot `RC1_24_DIS_1D_<date>_weak_zone.png`

**RC1-25** · NYSE:PFE · 1D · weak_zone
Look for: a freshly drawn level with no reaction yet.
Shot `RC1_25_PFE_1D_<date>_weak_zone.png`

**RC1-26** · NASDAQ:PEP · 1D · weak_zone
Look for: multiple touches but weak/no reactions (low-quality level).
Shot `RC1_26_PEP_1D_<date>_weak_zone.png`

**RC1-27** · NASDAQ:META · 1D · broken_zone
Look for: a key support cut decisively, no reclaim.
Shot `RC1_27_META_1D_<date>_broken_zone.png`

**RC1-28** · NYSE:BA · 1D · broken_zone
Look for: resistance broken, then price fell back through it (failed).
Shot `RC1_28_BA_1D_<date>_broken_zone.png`

**RC1-29** · NASDAQ:NFLX · 1D · broken_zone
Look for: a decisive close beyond a prior key level.
Shot `RC1_29_NFLX_1D_<date>_broken_zone.png`

**RC1-30** · NASDAQ:CSCO · 1D · broken_zone
Look for: broken support whose role (now resistance?) is ambiguous.
Shot `RC1_30_CSCO_1D_<date>_broken_zone.png`

**RC1-31** · NYSE:HD · 1D · mid_range_poor_location
Look for: price floating mid-gap, no level nearby on either side.
Shot `RC1_31_HD_1D_<date>_mid_gap.png`

**RC1-32** · NYSE:LLY · 1D · mid_range_poor_location
Look for: above range, no overhead level (upside discovery).
Shot `RC1_32_LLY_1D_<date>_above_range.png`

**RC1-33** · NASDAQ:WBD · 1D · mid_range_poor_location
Look for: below range, no underfoot level (downside discovery).
Shot `RC1_33_WBD_1D_<date>_below_range.png`

**RC1-34** · NASDAQ:SMCI · 1D · overextension
Look for: parabolic move far above the 200-MA.
Shot `RC1_34_SMCI_1D_<date>_overextension.png`

**RC1-35** · NASDAQ:COIN · 1D · overextension *(severe)*
Look for: price >3 ATR from the anchor (severe stretch).
Shot `RC1_35_COIN_1D_<date>_overextension.png`

**RC1-36** · NASDAQ:PYPL · 1D · overextension
Look for: stretched far below the 200-MA (downside extension).
Shot `RC1_36_PYPL_1D_<date>_overextension.png`

**RC1-37** · NYSE:SNAP · 1D · overextension
Look for: post-earnings gap leaving price stretched from structure.
Shot `RC1_37_SNAP_1D_<date>_overextension.png`

**RC1-38** · NYSE:GM · 1D · contradiction_conflict
Look for: MA rising while LH/LL printing (contradiction).
Shot `RC1_38_GM_1D_<date>_contradiction.png`

**RC1-39** · NYSE:C · 1D · contradiction_conflict
Look for: uptrend jammed under heavy resistance (conflict).
Shot `RC1_39_C_1D_<date>_conflict.png`

**RC1-40** · NASDAQ:QQQ · 1D · contradiction_conflict
Look for: daily up vs weekly down disagreement (check the weekly too).
Shot `RC1_40_QQQ_1D_<date>_conflict.png`

**RC1-41** · NYSE:JNJ · 1D · compression
Look for: Bollinger inside Keltner squeeze, no direction.
Shot `RC1_41_JNJ_1D_<date>_compression.png`

**RC1-42** · NYSE:WMT · 1D · compression
Look for: narrow-range contraction, low ADX.
Shot `RC1_42_WMT_1D_<date>_compression.png`

**RC1-43** · NYSE:MMM · 1D · compression
Look for: bandwidth at a multi-month low, coiling.
Shot `RC1_43_MMM_1D_<date>_compression.png`

**RC1-44** · AMEX:GLD · 1D · compression
Look for: symmetrical coil, direction unclear.
Shot `RC1_44_GLD_1D_<date>_compression.png`

**RC1-45** · NYSE:VZ · 1D · compression
Look for: tight range, ADX < 15, no MA alignment.
Shot `RC1_45_VZ_1D_<date>_compression.png`

**RC1-46** · *operator-pick illiquid microcap* · 1D · thin_data
Look for: illiquid name, sparse/erratic pivots, gappy.
Shot `RC1_46_<TICKER>_1D_<date>_thin_data.png`

**RC1-47** · *operator-pick recent listing* · 1D · thin_data
Look for: recent listing with <200 bars, no MA-200.
Shot `RC1_47_<TICKER>_1D_<date>_thin_data.png`

**RC1-48** · NYSE:UNH · 1D · clean_trend *(positive control)*
Look for: clean uptrend pullback to a fresh support (different sector).
Shot `RC1_48_UNH_1D_<date>_clean_trend.png`

**RC1-49** · NYSE:SO · 1D · clean_range *(positive control)*
Look for: utility clean range, price at a tested rail.
Shot `RC1_49_SO_1D_<date>_clean_range.png`

**RC1-50** · NYSE:KMB · 1D · full_agreement *(positive control — rare High Clarity, short side)*
Look for: clean DOWNtrend with all six lenses agreeing (symmetry of RC1-18).
Shot `RC1_50_KMB_1D_<date>_full_agreement.png`

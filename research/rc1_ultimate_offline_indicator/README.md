# RC-1 Ultimate Offline Indicator (research)

Original, clean-room offline scoring engine for RangeClarity. Studies **concepts** from
public/textbook indicators and tests them on real OHLCV. **No Pine, no returns, no trading
advice, no copied/proprietary logic.**

## Law
**The score is the minimum of what structure permits, never the sum of what is present.**
No additive confluence. (Contract: `docs/research/rc1-python-scorer-v0-contract.md`.)

## Architecture (decomposed engines)
`data_loader → indicators → structure_features → {zone, regime, location, extension}_engine
→ agreement_engine → negative_first_scorer → false_high_hunter → ablation/optimizer → report`.

Scoring flow: `data gate → contradiction gate → chop gate → broken/weak-zone gate →
location gate → extension gate → agreement gate → hysteresis → final_state + audit`.
States: Insufficient · Unclear · Mixed · Clear · High Clarity. Hard rules: any cap → no
High Clarity; missing data → no number; chop/broken → never Clear/High; severe extension →
never High; contradiction → Unclear; High Clarity needs full agreement + zero caps +
persistence.

## Data (no fabrication)
`data/ohlcv/<SYM>.csv` or the sibling `../rc1_autonomous_model/data/ohlcv/` (populate via
that package's `fetch_tiingo.py`), else **synthetic fixtures for unit/smoke only**
(tagged, not evidence).

## Run
```
cd research/rc1_ultimate_offline_indicator
python3 run_indicator.py --smoke     # synthetic pipeline check
python3 run_indicator.py             # real baseline if CSVs exist (else synthetic, tagged)
```
Reports → `reports/`. **Conviction stays Red** until human labels confirm a false-high rate
(weak/structural proxies are internal consistency, not human truth).

## IP / license
Indicators implemented from public/textbook definitions (ATR, ADX/DMI, Choppiness,
Efficiency Ratio, Donchian, Keltner, regression). No proprietary/invite-only source code,
formulas, UI, names, or branding used. Concept-only where licenses are unclear.

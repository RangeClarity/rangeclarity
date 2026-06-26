# Module: Data Adapters

> Living architecture doc — **documentation only**. No behavior/scoring/Pine/payment change.
> Index: [system-map](../system-map.md) · [registry](../module-registry.md).

## Purpose
Load and **normalize** market data into one schema so the scoring core never knows the source.

## Public interface
- **Target:** `loadCandles(symbol, source, range) -> NormalizedCandles`.
- **Current:** `data_loader._find_csv(symbol, cfg)` · `data_loader._load_csv(path)` ·
  `data_loader.load_universe(cfg, symbols)` · `data_loader._synthetic(symbol, cfg)`;
  fetchers `fetch_tiingo.py`, `fetch_yfinance.py`; validator `check_data.py`.
- **Schema:** `date, open, high, low, close, volume` (lowercased, de-duped, date-sorted).

## Hidden complexity
CSV discovery precedence (this pkg `data/ohlcv` → sibling `rc1_autonomous_model/data/ohlcv` → synthetic);
column lowercasing + schema selection; dedupe/sort/reset; the synthetic regime-cycle generator (tagged
`source='synthetic'`, unit/smoke only); split-adjust consistency checks.

## Owns
Loaders · schema normalization · missing-data handling · synthetic fallback **tagging**.

## Must not own
Clarity decisions · caps · scoring · UI rendering.

## Subfunctions
`_find_csv` · `_load_csv` · `load_universe` · `_synthetic` · `check_data` validators · `fetch_tiingo` · `fetch_yfinance`.

## Dependencies
Filesystem CSVs · `config.data.local_dirs` · pandas/numpy. No live fetch inside the loader.

## Dependent modules
Core Scoring (consumes `df`/`num`) · Research Experiments · Founder Review.

## Current leaks
1. `data_loader.py` lives **inside** the scoring package (`rc1_ultimate_offline_indicator`).
2. **Duplicated** across both research packages — no single source of truth.
3. Synthetic fallback can be mistaken for real data if the `source` tag is ignored.

## Risk level
**MEDIUM.** Wrong/duplicated data corrupts research, but it is isolated from the product UI.

## Tests required
Schema test (every loader returns the identical `NormalizedCandles` columns) · synthetic-tag assertion
(real vs synthetic never confused) · `check_data` validation mandatory before a baseline run.

## Agent / skill to use
`/module-awareness Data Adapters` · `/improve-codebase-architecture` to extract `loadCandles` out of the
scoring package.

## Next approved task
None beyond this documentation until the **Core API facade is wired**; then (candidate, not yet approved)
move `data_loader` out of the scoring package behind `loadCandles`.

## Blocked work
Consolidating the two parallel `data_loader` copies — **HIGH risk, blocked** until the stable Core API exists.

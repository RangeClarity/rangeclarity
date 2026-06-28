# Agent vs Founder labels -- comparison

_Read-only assistant. Agent suggestions never change scoring; the founder's labels are the truth._

- clean_but_capped windows: **40**
- founder labels found: **15**  (sources: founder_labels.csv=absent; founder_labels_template.csv=15; founder_review_priority.csv=0)
- agent mean confidence: **0.56** (capped at 0.85 by design)
- label input used (after precedence): **founder_labels_template.csv=15** | preferred = `founder_labels_template.csv` | conflicts resolved = 0

## Agent label distribution

| label | count |
|---|---|
| true_broken | 6 |
| stale_zone_false_cap | 6 |
| normal_pullback_false_cap | 3 |
| genuinely_unclear | 25 |
| unsure | 0 |

## Founder label distribution (15 labeled)

| label | count |
|---|---|
| true_broken | 0 |
| stale_zone_false_cap | 5 |
| normal_pullback_false_cap | 3 |
| genuinely_unclear | 7 |
| unsure | 0 |

## Agreement

- matched: **15 / 15** (100%)

| symbol | date | agent | conf | founder | match |
|---|---|---|---|---|---|
| TSLA | 2023-05-30 | genuinely_unclear | 0.50 | genuinely_unclear | agree |
| MSFT | 2024-12-31 | stale_zone_false_cap | 0.69 | stale_zone_false_cap | agree |
| SPY | 2019-01-15 | genuinely_unclear | 0.48 | genuinely_unclear | agree |
| NVDA | 2022-04-18 | stale_zone_false_cap | 0.69 | stale_zone_false_cap | agree |
| META | 2026-04-14 | genuinely_unclear | 0.48 | genuinely_unclear | agree |
| AMZN | 2022-03-18 | genuinely_unclear | 0.48 | genuinely_unclear | agree |
| XOM | 2021-11-22 | stale_zone_false_cap | 0.75 | stale_zone_false_cap | agree |
| JPM | 2019-10-02 | normal_pullback_false_cap | 0.65 | normal_pullback_false_cap | agree |
| GE | 2020-02-26 | stale_zone_false_cap | 0.61 | stale_zone_false_cap | agree |
| AMD | 2019-08-06 | normal_pullback_false_cap | 0.70 | normal_pullback_false_cap | agree |
| AVGO | 2019-08-06 | genuinely_unclear | 0.45 | genuinely_unclear | agree |
| CVX | 2020-11-10 | genuinely_unclear | 0.48 | genuinely_unclear | agree |
| DIS | 2025-04-29 | genuinely_unclear | 0.48 | genuinely_unclear | agree |
| INTC | 2023-09-22 | normal_pullback_false_cap | 0.65 | normal_pullback_false_cap | agree |
| WMT | 2023-05-30 | stale_zone_false_cap | 0.60 | stale_zone_false_cap | agree |

## Confusion (rows = founder, cols = agent)

| founder \\ agent | true_broken | stale_zone_false_cap | normal_pullback_false_cap | genuinely_unclear | unsure |
|---|---|---|---|---|---|
| true_broken | 0 | 0 | 0 | 0 | 0 |
| stale_zone_false_cap | 0 | 5 | 0 | 0 | 0 |
| normal_pullback_false_cap | 0 | 0 | 3 | 0 | 0 |
| genuinely_unclear | 0 | 0 | 0 | 7 | 0 |
| unsure | 0 | 0 | 0 | 0 | 0 |

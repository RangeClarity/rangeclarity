# RC-1 Ultimate Offline Indicator — Summary

> **Data source: `mixed`** (19/20 symbols from CSV). Real CSV bars (offline). No Pine, no returns, no trading advice.

- windows: 1793 · states: {'HighClarity': 0, 'Clear': 0, 'Mixed': 742, 'Unclear': 1051, 'Insufficient': 0}

- High Clarity rarity: 0.0 (target 0.01–0.05) · Clear+ rarity: 0.0

- false-high self-flag rate: 0.0 · fatal self: 0 (must be 0)

- cap_accuracy: 1.0 · stability: 0.9977 · segment_robustness: 1.0 · objective: 0.9748

- caps fired most: ['agree3', 'broken', 'severe']

- concepts that EARN their place (ablation worsens on removal): ['-chop', '-zone', '-extension', '-hysteresis']

- concepts with NO effect here (unproven / re-test on real data): ['-location', '-agreement', '-trend']


## Conviction: **RED**. 
Synthetic and/or no human labels => internal consistency only, not a real false-high rate.


## Ablation

| ablation    |   clear_plus |   high_clarity |   false_high_self |   fatal |   stability |   objective | earns_place   |   clear_plus_delta |   stability_delta |
|:------------|-------------:|---------------:|------------------:|--------:|------------:|------------:|:--------------|-------------------:|------------------:|
| FULL        |       0      |              0 |                 0 |       0 |      0.9977 |      0.9748 |               |           nan      |          nan      |
| -chop       |       0      |              0 |                 0 |       0 |      0.9966 |      0.9747 | True          |             0      |           -0.0011 |
| -zone       |       0.0056 |              0 |                 0 |       0 |      0.9532 |      0.9697 | True          |             0.0056 |           -0.0445 |
| -location   |       0      |              0 |                 0 |       0 |      0.9977 |      0.9748 | False         |             0      |            0      |
| -extension  |       0.0006 |              0 |                 0 |       0 |      0.991  |      0.9739 | True          |             0.0006 |           -0.0067 |
| -agreement  |       0      |              0 |                 0 |       0 |      0.9977 |      0.9748 | False         |             0      |            0      |
| -hysteresis |       0      |              0 |                 0 |       0 |      0.9927 |      0.9743 | True          |             0      |           -0.005  |
| -trend      |       0      |              0 |                 0 |       0 |      0.9977 |      0.9748 | False         |             0      |            0      |


## Honesty
Without human labels the 'false-high' figure is a self-consistency proxy; a real rate needs labeled cases (labels-50 -> Reject-Probe). High Clarity stays rare by construction; this run does not validate the model.

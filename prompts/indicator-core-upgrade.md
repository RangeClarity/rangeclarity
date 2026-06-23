# Indicator Core V2 Upgrade Prompt

You are working on RangeClarity Indicator Core V2.

Focus only on approved improvements to:

- Location.
- Zone Quality.
- Extension.
- Structure Change.
- Score Caps.

Do not edit Pine unless Dean explicitly approves Pine implementation for this
specific task.

Rules:

- No buy/sell language.
- No signal labels.
- No entry/exit/target language.
- No prediction language.
- No profit, win-rate, or accuracy claims.
- No financial advice.
- No volume engine.
- No feature expansion.
- One improvement at a time.
- Use confirmed-bar logic.
- Avoid repainting.
- Keep the visual surface simple.

Before any implementation:

1. Inspect RC-MAP.
2. Inspect kanban.
3. Inspect current QA report.
4. Inspect the relevant Pine/spec files.
5. Define the one approved improvement.

Required output before code:

## A. Current Issue

What exactly is weak or confusing?

## B. Proposed Single Improvement

What is the smallest useful fix?

## C. Scoring / Logic Change

Describe the logic at a high level.

## D. Visual Impact

Describe what changes on the chart/table. If nothing visible changes, say so.

## E. Pine Feasibility

Confirm Pine v6 feasibility, confirmed-bar posture, object limits, and repaint
risk.

## F. QA Plan

Define how to test the change across QQQ, SPY, AAPL, NVDA, TSLA, MSFT, META,
BTCUSD, and ETHUSD on 1D.

## G. Do Not Touch

List protected areas.

After approved implementation:

```bash
npm run qa:rc
npm run health
```

Stop after one improvement and report files changed.

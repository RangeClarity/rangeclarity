# RangeClarity Live QA Agent — Architecture (Offline Foundation v1)

## What this is
An **internal QA bot** for the RangeClarity indicator. It reviews **indicator
quality only** — does the structure read make sense, is the dashboard coherent,
is the wording on-brand. It is **not** a trading bot. It **never** produces or
evaluates buy/sell/entry/exit advice, predictions, or profit claims.

## What it does (MVP)
Runs **offline** on fixture events (`data/qa/fixtures/sample-events.jsonl`), each
following schema `rc_live_qa.v1`. It applies deterministic rules and emits
**findings** (`data/qa/findings.jsonl`) plus a Markdown report
(`docs/qa/live-qa-report.md`).

```
sample-events.jsonl  ->  lib/qa/rules.ts  ->  findings.jsonl
                          (compliance, score, location,        +
                           zone, regime, visual, data-quality) docs/qa/live-qa-report.md
```

## Modules (lib/qa)
- `schema.ts` — `rc_live_qa.v1` event/finding types, thresholds, forbidden-word list.
- `compliance-checks.ts` — forbidden signal-like / decision wording.
- `score-checks.ts` — score/state mismatch, large score jumps, high score over weak zones.
- `location-checks.ts` — "Near X" distance sanity, state vs range-position coherence.
- `zone-checks.ts` — stale-but-strong, one-touch-strong, overlap, missing levels.
- `regime-checks.ts` — high score in chop; visual budget (rows/zones).
- `rules.ts` — orchestrator (tracks previous event per symbol+timeframe for jumps).
- `report.ts` — renders the Markdown report.

## Design principles
- **Deterministic + simple** — no ML, no randomness; same input → same findings.
- **Confirmed-bar mindset** — events represent confirmed indicator reads.
- **Severity** — `critical` (compliance / hard breaks), `warning` (likely quality
  bug), `info` (worth a look).
- **Read-only** — the bot reports; it never edits Pine or the product.

## Out of scope (deferred to later phases)
- TradingView **alert JSON** emitter (Pine side).
- **Webhook receiver** for live alerts.
- **Supabase** persistence.
- **Screenshot** automation.
- GitHub/Linear **issue** creation.
These are Phase 2+. This foundation runs entirely offline on fixtures.

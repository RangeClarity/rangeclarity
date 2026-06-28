# RangeClarity — Kanban Board (system build)

Status: planning. This board tracks the **big-system** build (indicator + brain). It complements the existing `docs/kanban.md` (S/R ticket board) rather than replacing it; `CLAUDE.md` source-of-truth hierarchy still applies. Owner types: **Claude Code**, **Codex Review**, **Manual TV Test**, **Design**, **Backend**.

Columns: Backlog → Next → In Progress → Review → Testing → Done.

---

## Done
- **RC-001 — Stabilize S/R engine to v1.5** · P0 · Claude Code · *Done.* AC: Local/Key/Strong + adaptive fallback + honest "none above"; no empty charts where structure exists.
- **RC-002 — Add optional Soft Structure Channel (v1.6)** · P0 · Claude Code · *Done (code).* AC: subtle, real-only, toggleable, S/R untouched. (Verification = RC-010.)
- **RC-003 — Preserve stable S/R baseline** · P0 · Claude Code · *Done.* AC: faithful pre-channel archive exists.
- **RC-004 — Master planning docs (vision/arch/schema/roadmap/plan/kanban/readiness/strategy)** · P0 · Claude Code · *Done.*

## Testing
- **RC-010 — TradingView compile + visual verification (v1.6)** · P0 · Manual TV Test · AC: compiles; S/R clean and channel subtle/real on the 10-symbol universe; off-switch = pure S/R; no clutter/fake channels.

## Review
- **RC-011 — Codex review: channel logic + parity readiness** · P0 · Codex Review · AC: validation/quality/state logic sound; no advice wording; flags any Pine pitfalls before schema work.

## In Progress
- *(empty — keep WIP ≤ 2 while solo)*

## Next
- **RC-020 — Freeze shared schema v0.1** · P0 · Claude Code · AC: every field defined; enums fixed; versioned; matches indicator outputs.
- **RC-021 — Map alerts → eventType + JSON alert body** · P0 · Claude Code · AC: each alertcondition maps to one event; valid JSON from a real TV alert; no buy/sell types.
- **RC-022 — Golden test vectors (8–12)** · P0 · Claude Code + Manual TV Test · AC: hand-checked input bars → expected schema rows committed under `core/fixtures/`.
- **RC-023 — rangeClarityScore v1 definition** · P1 · Claude Code + Codex Review · AC: clarity/attention score (never direction); weights documented; reproducible in fixtures.

## Backlog — Brain & web
- **RC-030 — Stack + data-provider decision** · P0 · Backend/Founder · AC: DB+hosting+data chosen; commercial licensing + cost confirmed in `decisions.md`.
- **RC-031 — DB tables: snapshots / events / watchlists / presets** · P0 · Backend · AC: schemas drafted; migrations stubbed.
- **RC-032 — Canonical core in TS + fixture runner** · P0 · Claude Code · AC: ≥1 fixture green; parity harness runs in CI.
- **RC-033 — Data adapter (EOD daily)** · P0 · Backend · AC: fetch + cache OHLCV for the universe within rate/licensing limits.
- **RC-034 — Scanner batch job (20–50 symbols)** · P0 · Claude Code/Backend · AC: writes snapshot rows; all fixtures green; spot-checks match TV.
- **RC-035 — Market Room MVP (ranked cards + filters)** · P0 · Claude Code + Design · AC: <30s to see which names are at a level; ranking sensible; no advice.
- **RC-036 — Template explanations** · P1 · Claude Code · AC: one-line, true-to-schema, non-advisory reason per card.
- **RC-037 — Watchlist CRUD + import** · P1 · Claude Code/Backend · AC: create/manage/import lists; persisted per user-list.
- **RC-038 — Daily brief per watchlist** · P1 · Claude Code · AC: top clarity + notable events, capped, with reasons.
- **RC-039 — TradingView webhook receiver (auth + dedup)** · P1 · Backend · AC: valid events stored; spoof/dupe rejected; appears in Market Room.
- **RC-040 — Hermes explanation guardrail + eval** · P1 · Claude Code · AC: no-advice eval passes; AI only phrases schema facts; template fallback.
- **RC-041 — Error logging + monitoring** · P1 · Backend · AC: server/client errors captured and reviewable.
- **RC-042 — Onboarding + feedback channel** · P1 · Design/Claude Code · AC: a new user understands the product; can send feedback.
- **RC-043 — Closed-beta gating (invite-only)** · P1 · Backend · AC: access limited to invites; indicator delivered invite-only.

## Backlog — Design / content
- **RC-050 — Market Room visual system (premium, uncluttered)** · P1 · Design · AC: matches the clean brand; no chart-style clutter.
- **RC-051 — Landing copy that explains clarity value (no advice)** · P2 · Design/Founder · AC: value clear; legally reviewed; non-advisory.
- **RC-052 — Onboarding walkthrough content** · P2 · Design · AC: first-session "aha" in <2 min.

## Backlog — Explicitly deferred (do NOT pull without approval)
- **RC-090 — MTF confluence** · P2 · — · deferred to post-beta.
- **RC-091 — Intraday scanning at scale** · P2 · — · deferred.
- **RC-092 — TradingView watchlist auto-sync / account linking** · P2 · — · manual alerts first.
- **RC-093 — Payments / public signup (M11)** · P1 · Backend/Founder · gated on validated value + provider decision (O-001).
- **RC-094 — Any RSI/MACD/VWAP/OB/FVG/liquidity feature** · P2 · — · out of product scope.

## WIP policy
Solo: keep In Progress ≤ 2. Every P0 in Next must have acceptance criteria before it starts. Manual TV Test and Codex Review are required gates for indicator + schema tickets.

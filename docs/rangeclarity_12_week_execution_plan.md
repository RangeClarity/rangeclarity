# RangeClarity — 12-Week Execution Plan

Status: planning. A realistic, quality-first 12-week path mapping the milestones (`rangeclarity_milestone_roadmap.md`) onto weeks for a **solo founder + Claude Code/Codex**. No rushed launch: weeks can slip; gates do not. Each week ends with a concrete demo.

Cadence note: weeks 1–3 are indicator/schema (founder-heavy on TradingView testing); weeks 4–10 are the brain/web (Claude Code-heavy); weeks 11–12 harden for closed beta. Public/paid beta (M11) is **beyond** this 12-week window by design.

---

### Week 1 — Stabilize the S/R core (M1)
- **Focus:** prove the current indicator compiles and is clean.
- **Tasks:** paste `rangeclarity_sr_core_v1.pine` into Pine Editor; fix any compile/runtime errors; run the 10-symbol manual test; log results.
- **Output:** compiling indicator + a test log.
- **Testing:** manual TV on BTCUSD/VRT/INOD/MELI/TSCO/NOW/NVDA/SPY/QQQ + EURUSD.
- **Decision gate:** S/R clean and stable? If not, no channel tuning yet.
- **Demo:** screen-share the indicator on 3 charts showing clean Local/Key/Strong + dashboard.

### Week 2 — Verify & tune the Soft Structure Channel (M2)
- **Focus:** channel is subtle, real-only, toggleable.
- **Tasks:** visual pass across the universe; tune parallel tolerance / width cap / min quality; confirm wedge/noise → Developing/None; confirm off-switch = pure S/R.
- **Output:** tuned channel defaults + before/after screenshots.
- **Testing:** trending (NVDA/VRT), ranging (SPY chop), messy (a wedge) charts.
- **Decision gate:** does the channel ever clutter or fake structure? Must be no.
- **Demo:** same chart with channel on vs off; a "Developing/None" example.

### Week 3 — Freeze schema + event mapping + fixtures (M3)
- **Focus:** the shared contract.
- **Tasks:** finalize `rangeclarity_shared_signal_schema.md` v0.1; map alerts → `eventType`; write the JSON alert body; draft `rangeClarityScore` v1; capture 8–12 golden fixtures (hand-checked input→expected).
- **Output:** frozen schema + fixtures + alert message spec.
- **Testing:** fire 2–3 real TV alerts; validate JSON shape.
- **Decision gate:** schema reviewed by Codex; no advice fields.
- **Demo:** a live TV alert producing a valid schema JSON payload.

### Week 4 — Brain architecture & stack decision (M4)
- **Focus:** decide, don't build.
- **Tasks:** choose DB/hosting/data provider (licensing + cost); draft tables (snapshots/events/watchlists); scaffold `core/` spec + `app/api/` stubs.
- **Output:** approved stack + schema tables + empty scaffolding.
- **Testing:** n/a (design); a tiny data-provider spike to confirm access + terms.
- **Decision gate:** data licensing acceptable for commercial use? Cost sane?
- **Demo:** architecture walkthrough + a single symbol's OHLCV fetched from the chosen provider.

### Week 5 — Canonical core in TS, parity scaffolding (M5a)
- **Focus:** port the structure math, prove parity on 1 symbol.
- **Tasks:** implement pivots→zones→score→bias in TS; wire the fixture runner; get 1–2 fixtures green.
- **Output:** TS core passing first fixtures.
- **Testing:** fixture diffs vs Pine expected.
- **Decision gate:** parity within tolerance on the first symbol?
- **Demo:** TS core printing a schema row that matches the Pine fixture.

### Week 6 — Scanner MVP over a small watchlist (M5b)
- **Focus:** many symbols → snapshot rows.
- **Tasks:** batch job over 20–50 daily symbols; write snapshots to DB; remaining fixtures green; add channel + fallback fields.
- **Output:** populated snapshots table.
- **Testing:** spot-check 5 names against the indicator in TV.
- **Decision gate:** do scanner rows match the chart? Divergences logged/closed.
- **Demo:** query the DB for "near Strong support" and get sensible names.

### Week 7 — Market Room MVP: ranked cards (M6a)
- **Focus:** make the data legible.
- **Tasks:** `rangeClarityScore` ranking; card UI (bias, nearest S/R, channel state); basic bias/level filters.
- **Output:** a Market Room page over the founder watchlist.
- **Testing:** does the ranking surface the genuinely interesting charts first?
- **Decision gate:** is the page useful in <30s? If not, tune before adding features.
- **Demo:** open Market Room, filter "near Key/Strong", scan the top 6.

### Week 8 — Market Room polish + template explanations (M6b + M9a)
- **Focus:** the "why," cleanly.
- **Tasks:** deterministic template `explanationSummary` per card; visual polish (premium, uncluttered); empty/loading/error states.
- **Output:** explained, premium Market Room.
- **Testing:** read 20 explanations for accuracy + zero advice language.
- **Decision gate:** explanations always true to the schema and non-advisory?
- **Demo:** Market Room where every top card has a one-line reason.

### Week 9 — Watchlist Radar + daily brief (M7)
- **Focus:** the recurring-use loop.
- **Tasks:** create/manage/import watchlists; per-list daily brief (top clarity + notable events); event history view.
- **Output:** watchlists + a daily brief.
- **Testing:** run the brief 3 days; check signal-to-noise.
- **Decision gate:** would the founder open this every morning? Retention hypothesis.
- **Demo:** a morning brief for a 50-name list.

### Week 10 — TradingView webhook sync (M8)
- **Focus:** live chart events into the brain.
- **Tasks:** authenticated webhook receiver; schema validation + dedup; merge events into Market Room/history.
- **Output:** working TV→web event flow.
- **Testing:** real alerts post events; bad/unauth payloads rejected; no dupes.
- **Decision gate:** is the webhook safe (auth, idempotent)?
- **Demo:** trigger a channel-break alert in TV; watch the event appear on the site.

### Week 11 — Closed-beta hardening (M10a)
- **Focus:** trustworthy for invited users.
- **Tasks:** error logging/monitoring; onboarding flow; feedback channel; invite-only gating; finish most of the readiness checklist.
- **Output:** an invitable product.
- **Testing:** a full cold run as a new user; break-it testing.
- **Decision gate:** readiness checklist mostly green?
- **Demo:** end-to-end: invite → onboard → indicator + Market Room value.

### Week 12 — Closed beta with 3–5 users + AI phrasing option (M10b + M9b)
- **Focus:** real feedback; optional LLM explanations behind the guardrail.
- **Tasks:** invite 3–5 users; collect structured feedback; optionally enable constrained LLM phrasing with a no-advice eval; triage fixes.
- **Output:** closed beta live + a prioritized feedback backlog.
- **Testing:** guardrail eval on AI text; user-reported issues.
- **Decision gate:** is value validated enough to plan M11 (paid)?
- **Demo:** a beta user's real session + their feedback summary.

---

## Standing rules across all weeks
- **Indicator stays primary and clean;** web never forces changes that clutter the chart.
- **Parity before features:** if a scanner number disagrees with the chart, fix parity before building on it.
- **No advice language** enters any surface, ever (copy reviewed weekly).
- **One demo per week;** if there's nothing to demo, the week's scope was wrong.
- **Cut, don't cram:** slip scope to the backlog rather than ship rushed.

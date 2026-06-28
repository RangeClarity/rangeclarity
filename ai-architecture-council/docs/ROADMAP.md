# Future roadmap

**v1 (MVP — this scaffold):** 3 providers (Claude Code, Codex, AntiGravity) · 5 modes · normalized schema · debate
engine (deterministic) · impartial judge · iterative rounds (≤3) · **Hermes planner** · **Linear preview + gated
create + Markdown export** · session persistence · streaming UI · weighted voting.

**v1.1 — wiring:** real provider transports · LLM "debate judge" upgrade · Linear MCP writer · React-Query/shadcn UI polish · auth.

**v2 — more seats:** Gemini, Cursor, Grok, local **Ollama** (offline council) — each just implements `run(prompt)`.

**v2.1 — smarter debate:** semantic clustering (embeddings) for consensus/disagreement · cross-examination round where agents *question* each other · confidence calibration from past sessions.

**v3 — delivery loop:** Hermes ⇄ Linear status sync (issues update back into sessions) · daily/weekly execution
queues · "blocked work" detection · dependency-aware scheduling · multi-project portfolios.

**v3.1 — memory & governance:** per-project decision log · "what did the council decide last time about X?" recall ·
weight presets per task-type · audit trail / replay of any session.

**v4 — platform:** reusable npm package (`@council/core`) · webhooks · API for other apps · self-hostable.

# AI Architecture Council

An autonomous **multi-agent consultation platform**. Given one engineering/product task, it sends the same
prompt to several expert agents (Claude Code, OpenAI Codex, AntiGravity…), normalizes every answer into a
common schema, runs a **structured debate** (consensus / disagreements / hidden risks / missing pieces), has
an impartial **judge** synthesize one decision, then **Hermes** turns that decision into an execution plan and
a **Linear** issue preview. **Nothing is executed or written to Linear without explicit user approval.**

> This is a **standalone subproject**. It does not modify RangeClarity's app, scoring, Pine, or payments.
> Hermes + Linear are first-class in the MVP (they are already part of the RangeClarity workflow).

## Pipeline
```
prompt ─▶ orchestrator ─▶ [providers run in parallel, streaming] ─▶ normalize
       ─▶ debate engine (compare fields) ─▶ synthesizer/judge (one decision + action plan)
       ─▶ Hermes planner (milestones/epics/issues) ─▶ Linear preview (gated create) | Markdown export
       ─▶ storage (full session persisted)
```

## Modules (`src/`)
`schema/` typed contracts · `providers/` pluggable agents (`run(prompt)`) · `orchestrator/` fan-out + normalize ·
`debate/` debate + rounds · `synthesizer/` impartial judge · `hermes/` plan → tasks · `linear/` preview/create/export ·
`storage/` session persistence · `config/` modes + weighted voting. The **orchestrator never knows provider internals**.

## Quickstart (after `npm install`)
```
cp .env.example .env.local
npm run dev        # Next.js app at /
```
See `docs/IMPLEMENTATION-PLAN.md` for the step-by-step build order. This repo ships the **architecture +
contracts + core algorithms**; the streaming UI wiring is scaffolded and finished per the plan.

# Debate & Consensus Algorithm

Goal: not "ask N models the same thing," but a **structured debate** that surfaces agreement, disagreement,
single-source risks, and blind spots — then one impartial decision.

## Inputs
`AgentResult[]` (each with a `NormalizedAgentResponse`: summary, recommendation, implementation_plan, risks,
assumptions, alternatives, confidence) + optional per-agent `weights`.

## Step 1 — Debate report (`src/debate/debate-engine.ts`, deterministic baseline)
For each field, compare across agents:
- **Consensus** — keyword-cluster the recommendations + plan steps; a theme is consensus when ≥ ⌈n/2⌉ agents cover it (token-overlap ≥ 0.3). *("What every agent agrees on.")*
- **Disagreements** — clusters endorsed by some-but-not-all agents; emit each agent's stance + **why** (differing assumptions/tradeoffs).
- **Hidden risks** — risks raised by **exactly one** agent (deduped by normalized text) → "raisedBy".
- **Missing pieces** — a standard-topic checklist (tests, security, rollback, performance, observability, migration, a11y, cost, docs, backward-compat, error-handling) that **no** agent mentioned anywhere.
- **Tradeoffs** — harvested from `alternatives`.

> The baseline uses only string math (no extra model call) so the pipeline always runs. A **production upgrade**
> swaps/augments this with an LLM "debate judge" that reads all answers + the baseline report and rewrites the
> sections with semantic nuance (same `DebateReport` output shape).

## Step 2 — Iterative rounds (`src/debate/rounds.ts`, optional)
- **Round 1:** every agent answers the task.
- **Round 2:** each agent receives a digest of the *others'* answers and is asked: *"State precisely what you disagree with, then revise."* (`buildDebateContext`).
- **Round 3:** consensus generation over the final round. Capped at 3 rounds.

## Step 3 — Synthesis / impartial judge (`src/synthesizer/judge.ts`)
Produces one `CouncilDecision`:
- **Recommended decision** = the recommendation with the highest **weighted confidence**, tilted toward consensus support.
- **Why it wins** = weighted-confidence aggregate + consensus backing + folded-in single-source risk mitigations.
- **Action plan** = merged/deduped plan split into Priority 1/2/3, `filesToModify` (extracted from steps), expected impact, rollback, complexity (XS–XL by step count), estimated time.
- **Retained dissent** = disagreement topics that survive the decision (never hidden).

Rules: the judge is a **separate seat** from the debaters; weights bias tie-breaks but **never silence a dissenter**;
a single unparseable agent degrades to low confidence, never breaks the run.

## Output sections (UI)
`## Consensus` · `## Disagreements` (with *why*) · `## Hidden Risks` (single-source) · `## Missing Pieces` ·
`## Recommended Decision` (with *why it wins*) — exactly as specified.

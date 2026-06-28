# Architecture

A modular, provider-agnostic pipeline. The **orchestrator never knows how a provider talks to its model** —
it depends only on the `AgentProvider` contract + the registry. Adding Gemini/Cursor/Grok/Ollama later =
implement `run(prompt)` and register it; nothing else changes.

## System diagram
```mermaid
flowchart TD
    U[User: one task + selected agents + mode + weights] --> ORCH[Orchestrator]
    subgraph Providers["/providers (pluggable, stream run(prompt))"]
      P1[Claude Code]:::p
      P2[OpenAI Codex]:::p
      P3[AntiGravity]:::p
      P4[future: Gemini / Cursor / Grok / Ollama]:::pf
    end
    ORCH -->|same prompt, parallel| P1 & P2 & P3
    P1 & P2 & P3 -->|raw stream| NORM[Normalizer → common schema]
    NORM --> RES[(AgentResult[])]
    RES --> DEB[Debate Engine\nconsensus · disagreements · hidden risks · missing pieces · tradeoffs]
    DEB -->|round&gt;1: others' answers fed back| ORCH
    DEB --> JUDGE[Synthesizer / Impartial Judge\none decision + action plan]
    JUDGE --> HERMES[Hermes Planner\nmilestones · epics · issues · subtasks · deps]
    HERMES --> PREV[Linear Preview\nissue drafts]
    PREV -->|USER APPROVAL gate| LIN[(Linear: create issues)]
    PREV -->|offline| MD2[Markdown export]
    RES & DEB & JUDGE & HERMES & PREV --> STORE[(Storage: full session)]
    classDef p fill:#14233a,stroke:#2dd4bd,color:#e6edf3;
    classDef pf fill:#1a1633,stroke:#a78bfa,color:#e6edf3,stroke-dasharray:4;
```

## Folder structure
```
ai-architecture-council/
├─ README.md  package.json  tsconfig.json  .env.example
├─ prisma/schema.prisma            # SQLite (MVP) → Postgres later
├─ src/
│  ├─ schema/    council.ts hermes.ts linear.ts        # Zod contracts (single source of truth)
│  ├─ config/    modes.ts weights.ts                   # 5 execution modes + weighted voting
│  ├─ providers/ types.ts base.ts registry.ts          # AgentProvider contract + factory
│  │             claude-code.ts codex.ts antigravity.ts
│  ├─ orchestrator/ orchestrator.ts normalize.ts       # parallel fan-out + schema coercion
│  ├─ debate/    debate-engine.ts rounds.ts            # compare fields; iterative rounds
│  ├─ synthesizer/ judge.ts                            # impartial judge → one decision
│  ├─ hermes/    hermes-planner.ts                     # decision → execution plan
│  ├─ linear/    linear-adapter.ts markdown-export.ts  # preview · gated create · export
│  └─ storage/   types.ts                              # SessionStore boundary
└─ app/  (Next.js)  page.tsx layout.tsx actions.ts
   ├─ api/consult/route.ts                             # streaming SSE
   └─ components/ AgentChips PromptBox AgentStatusPanel ResultTabs LinearPreview
```

## Data flow (one consult)
1. **Orchestrator** fans the *same* prompt to each selected provider in parallel; streams `agent-status`/`agent-token` events.
2. **Normalizer** coerces every raw answer into `NormalizedAgentResponse` (tolerant JSON extraction).
3. **Debate engine** compares fields → `DebateReport`. In iterative mode it builds round-N+1 context ("here's what others said — what do you disagree with?") and re-runs.
4. **Judge** (a *different* seat than the debaters) returns one `CouncilDecision` (recommendation + why it wins + action plan + retained dissent).
5. **Hermes** converts the decision into a `HermesPlan` (milestone → epics → issues → subtasks, with acceptance/risks/deps/owners/prompts/rollback/DoD).
6. **Linear adapter** renders a `LinearPreview` (issue drafts). **A write happens only on explicit approval** (and the `COUNCIL_ALLOW_LINEAR_WRITES` env gate). Offline → Markdown export.
7. **Storage** persists everything (prompt, all rounds, debate, decision, hermes plan, preview, timestamps, agent versions, project, branch).

## Boundaries
- The **only** thing every provider implements is `run(prompt, opts)`. The orchestrator imports the registry, never a concrete provider.
- **Schemas are the contract** between modules — every boundary passes a Zod-validated object.
- **Nothing executes and nothing is written to Linear without explicit user approval.**

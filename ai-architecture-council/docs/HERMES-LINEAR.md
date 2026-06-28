# Hermes + Linear (first-class in the MVP)

Hermes and Linear are **already part of the workflow**, so they ship in v1 — not as future ideas.

## Hermes — Project Manager / Delivery Orchestrator
Hermes **does not decide architecture**. It receives the council's `CouncilDecision` and converts it into
structured execution (`src/hermes/hermes-planner.ts` → `HermesPlan`):
- **Milestone** (title + outcome) → **Epics** (Priority 1/2/3) → **Issues** → **Subtasks**.
- Each issue carries: acceptance criteria, risks (from the debate's hidden risks), dependencies (topological),
  owner suggestion (engineering/research/product/marketing), priority, estimated complexity, a ready-to-send
  **implementation prompt** (Claude Code/Codex), rollback plan, definition of done.
- Hermes also emits `dependencyOrder`, `blockers` (from missing pieces), and a `statusSummary` for daily/weekly updates.
- **Regenerate** is a pure function of the decision — the UI "regenerate Hermes plan" re-runs `buildHermesPlan`.

## Linear — operational source of truth
`src/linear/linear-adapter.ts`:
- `buildLinearPreview(plan)` → `LinearPreview` of `LinearIssueDraft`s (pure, side-effect-free, safe to regenerate).
- Each draft maps the full **Linear issue schema**: title · description (rendered markdown) · priority(0–4) ·
  labels · project/milestone · acceptance criteria · risks · dependencies · **implementation prompt** ·
  **source council session id** · related agent opinions · rollback plan · definition of done.
- `buildIssueBody(draft)` (`markdown-export.ts`) renders the description body embedding traceability + the prompt.

## Approval gate (hard rule)
`createApprovedIssues({ preview, writer, approvedHermesKeys, allowWrites, teamId })`:
- throws unless `allowWrites` (env `COUNCIL_ALLOW_LINEAR_WRITES=true`) **AND** the UI passed explicit
  `approvedHermesKeys` (per-issue selection: *Create all* / *Create selected*).
- the `LinearWriter` is injected at the call site (Linear MCP/SDK) — the adapter stays transport-agnostic.
- **Nothing is written to Linear automatically.** If Linear is unavailable, `exportPlanMarkdown(preview)` produces
  the identical plan as Markdown.

## Workflow (after a decision)
1. Consensus engine → final recommendation. 2. Hermes → milestone/epics/issues/subtasks/AC/deps/owners/priority/complexity.
3. **User reviews** the generated execution plan (Hermes Plan + Linear Preview tabs). 4. **Only after approval** →
create issues, add labels/priorities, link back to the council session, attach implementation prompts as the body.

## Traceability
`LinearIssueDraft.sourceCouncilSessionId` + `HermesPlan.sessionId` link every issue back to the exact debate that
produced it; `relatedAgentOpinions` records which agents shaped it.

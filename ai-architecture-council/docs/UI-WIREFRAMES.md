# UI wireframes

Stack: Next.js + Tailwind + **shadcn/ui** (Button, Badge/Chip, Tabs, Card, Textarea, Slider, Dialog) + React Query.
The scaffold uses inline styles as placeholders; swap for shadcn components per IMPLEMENTATION-PLAN step 7.

```
┌────────────────────────────────────────────────────────────────────────────┐
│ AI Architecture Council                                                      │
│ Consult with [Claude Code ×] [OpenAI Codex ×] [AntiGravity ×] [+ add]        │  ← AgentChips (removable + weights)
│ ┌──────────────────────────────────────────────┐  ┌───────────────────────┐ │
│ │ Describe one engineering/product task…         │  │ Agent status          │ │
│ │                                                │  │ ● Claude Code  running│ │  ← AgentStatusPanel (live)
│ │                                                │  │ ● Codex      finished │ │
│ │ [mode ▾ planning]      [Consult the council →] │  │ ● AntiGravity waiting │ │
│ └──────────────────────────────────────────────┘  └───────────────────────┘ │
│ ── Consensus · Debate · Risks · Implementation · Hermes Plan · Linear ──────  │  ← ResultTabs (8 tabs)
│    Preview · Raw Responses · Timeline ─────────────────────────────────────   │
│ ┌──────────────────────────────────────────────────────────────────────────┐ │
│ │ (active tab content)                                                       │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────┘
```

## Tabs → data
- **Consensus** — `debate.consensus` (what every agent agrees on).
- **Debate** — `debate.disagreements` (positions + *why*) + `tradeoffs`.
- **Risks** — `debate.hiddenRisks` (single-source) + `debate.missingPieces`.
- **Implementation** — `decision.actionPlan` (Priority 1/2/3, files, impact, rollback, complexity, time).
- **Hermes Plan** — `HermesPlan` (milestone → epics → issues → subtasks; deps; blockers) + **Regenerate**.
- **Linear Preview** — `LinearPreview` drafts; actions **Create all / Create selected / Edit before creating / Cancel / Export Markdown**.
- **Raw Responses** — each agent's verbatim output (per round).
- **Timeline** — round-by-round + per-agent latency/confidence.

## States
Agent chip statuses & panel: Waiting (slate) · Running (amber) · Finished (green) · Failed (red). Weighted-voting
sliders sit under the chips (e.g. Claude 40 / Codex 40 / AntiGravity 20). Mode selector drives prompt framing only.

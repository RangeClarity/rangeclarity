# Step-by-step implementation plan

The scaffold ships **architecture + contracts + algorithms**. Build order to a running MVP:

1. **Install & init** — `npm install`; `cp .env.example .env.local`; `npm run db:generate && npm run db:push`.
2. **Verify contracts** — `npm run typecheck` (Zod schemas + modules compile). Add ESLint/Tailwind config.
3. **Wire one provider** — implement `ClaudeCodeProvider.complete` (Anthropic `/v1/messages`, streaming). Confirm a single agent returns normalized JSON. Then Codex (OpenAI Responses) + AntiGravity (OpenAI-compatible).
4. **Orchestrator smoke test** — run `runCouncil` with the 3 agents on a sample task; confirm parallel run + normalization + `all-done`.
5. **Persist** — implement a Prisma `SessionStore`; save session/results/hermes/preview; add a sessions list view.
6. **Stream to the UI** — connect `PromptBox` → `POST /api/consult`; patch `AgentStatusPanel` + Raw Responses from SSE events; on `all-done` call the server action for debate→judge→hermes→preview.
7. **shadcn/ui pass** — replace inline styles with shadcn (Tabs, Card, Badge, Button, Textarea, Slider, Dialog); add weighted-voting sliders + mode selector + rounds control.
8. **Hermes + Linear tabs** — render `HermesPlan` and `LinearPreview`; add **Regenerate Hermes plan**; wire approval buttons → `approveAndCreateLinear` (still gated). Implement the `LinearWriter` against the Linear MCP/SDK.
9. **Markdown export** — wire "Export Markdown" → `exportPlanMarkdown` (offline fallback).
10. **Iterative rounds** — expose rounds (1–3); show the Timeline tab; verify round-2 disagreement framing.
11. **Harden** — auth, rate limits, abort/cancel (AbortSignal), per-provider timeouts, error surfaces, cost tracking.

**Definition of done (MVP):** one prompt → 3 streamed agents → normalized → debate report → one decision →
Hermes plan → Linear preview, with **manual approval before any Linear write**, full session persisted, and a
Markdown export when Linear is unavailable.

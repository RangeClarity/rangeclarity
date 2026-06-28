# API contracts

All payloads are the **Zod types** in `src/schema/*` — validate at every boundary.

## Server Actions (`app/actions.ts`)
- `runCouncil(input: RunCouncilInput): Promise<CouncilSession>`
  - input: `{ prompt, mode, agentIds[], rounds?, weights?[], project?, branch? }`
  - runs orchestrate → (rounds) → debate → judge → hermes → **linear preview**. **Stops before any Linear write.**
- `approveAndCreateLinear({ sessionId, approvedHermesKeys[], previewJson }): Promise<LinearCreateResult[]>`
  - the **only** path that writes Linear; requires explicit approved keys **and** `COUNCIL_ALLOW_LINEAR_WRITES=true`.
- `regenerateHermesPlan(sessionId)` *(impl)* — pure re-run of `buildHermesPlan` from the stored decision.

## Streaming route — `POST /api/consult`
- body: `RunCouncilInput & { round? }` → **SSE** stream of `OrchestratorEvent`
  (`agent-status` · `agent-token` · `agent-done` · `all-done`). Used by the live status panel + Raw Responses tab.

## Provider contract (extension point)
```ts
interface AgentProvider {
  readonly id: string; readonly label: string;
  version(): Promise<string>;
  run(prompt: string, opts: ProviderRunOptions): AsyncIterable<ProviderChunk>;
}
```
Register in `src/providers/registry.ts`. That is the entire surface to add Gemini/Cursor/Grok/Ollama.

## Linear writer (injected)
```ts
interface LinearWriter { createIssue(input): Promise<{ id: string; url: string }>; }
```
Wired to the Linear MCP/SDK at the call site; the adapter never imports a transport.

# Streaming architecture

## Why
A consult fans out to several models that each take seconds. The UI must show **per-agent progress live**
(Waiting → Running → Finished/Failed) and stream tokens, without blocking on the slowest agent.

## How
- **Provider layer** (`AgentProvider.run`) is an `AsyncIterable<ProviderChunk>` — `status` · `token` · `done` · `error`.
- **Orchestrator** (`orchestrate()`) launches all providers concurrently and **merges** their chunks into a single
  ordered `AsyncGenerator<OrchestratorEvent>` (`agent-status` · `agent-token` · `agent-done` · `all-done`) using an
  internal queue + notify latch — slow agents never block fast ones.
- **Transport:** `app/api/consult/route.ts` wraps the generator in a `ReadableStream` and emits **SSE**
  (`text/event-stream`). Runs on the Node runtime.
- **Client:** `EventSource`/`fetch`-reader updates the right-panel statuses and Raw-Responses tab as events arrive
  (React Query mutation holds the session; streamed events patch local state). On `all-done`, the client triggers
  the (server-side) debate → judge → hermes → preview steps and reveals the tabs.

## Failure isolation
One provider throwing yields `{type:"error"}` → that agent goes `failed`; the others continue; the debate/judge
run over whatever finished. The normalizer degrades unparseable output to low-confidence rather than crashing.

## Iterative rounds over the stream
Round N completes (`all-done`) → orchestrator builds round N+1 context from the finished results and re-streams.
The Timeline tab shows round-by-round.

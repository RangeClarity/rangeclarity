import type { ExecutionMode } from "@/config/modes";
import { getProvider } from "@/providers/registry";
import type { ProviderChunk } from "@/providers/types";
import { normalize } from "./normalize";
import type { AgentResult } from "@/schema/council";

export interface OrchestrateInput {
  prompt: string;
  mode: ExecutionMode;
  agentIds: string[];
  round?: number;
  debateContextByAgent?: Record<string, string>; // round>=2: what others said
  weights?: Record<string, number>;
}
export type OrchestratorEvent =
  | { kind: "agent-status"; agentId: string; status: AgentResult["status"] }
  | { kind: "agent-token"; agentId: string; text: string }
  | { kind: "agent-done"; result: AgentResult }
  | { kind: "all-done"; results: AgentResult[] };

/** Fan out the SAME prompt to all selected providers in parallel, stream their progress,
 *  normalize each into the common schema. The orchestrator knows nothing about how any
 *  provider talks to its model — only the AgentProvider contract + the registry. */
export async function* orchestrate(input: OrchestrateInput): AsyncGenerator<OrchestratorEvent> {
  const round = input.round ?? 1;
  const queue: OrchestratorEvent[] = [];
  let pending = input.agentIds.length;
  let notify: (() => void) | null = null;
  const push = (e: OrchestratorEvent) => { queue.push(e); notify?.(); };
  const results: AgentResult[] = [];

  for (const agentId of input.agentIds) {
    const provider = getProvider(agentId);
    void (async () => {
      const base: AgentResult = {
        agentId, agentLabel: provider.label, round, status: "waiting",
        weight: input.weights?.[agentId] ?? 1, startedAt: new Date().toISOString(),
      };
      push({ kind: "agent-status", agentId, status: "running" });
      let raw = "", version = "", latencyMs = 0, error: string | undefined;
      try {
        for await (const c of provider.run(input.prompt, {
          mode: input.mode, round, debateContext: input.debateContextByAgent?.[agentId],
        }) as AsyncIterable<ProviderChunk>) {
          if (c.type === "token") push({ kind: "agent-token", agentId, text: c.text });
          else if (c.type === "done") { raw = c.raw; version = c.version; latencyMs = c.latencyMs; }
          else if (c.type === "error") error = c.message;
        }
      } catch (e) { error = e instanceof Error ? e.message : String(e); }

      const result: AgentResult = error
        ? { ...base, status: "failed", error, finishedAt: new Date().toISOString() }
        : { ...base, status: "finished", raw, agentVersion: version, latencyMs,
            normalized: normalize(raw), finishedAt: new Date().toISOString() };
      results.push(result);
      push({ kind: "agent-status", agentId, status: result.status });
      push({ kind: "agent-done", result });
      if (--pending === 0) push({ kind: "all-done", results });
    })();
  }

  // drain
  while (true) {
    if (queue.length) { const e = queue.shift()!; yield e; if (e.kind === "all-done") return; continue; }
    await new Promise<void>((r) => (notify = r));
    notify = null;
  }
}

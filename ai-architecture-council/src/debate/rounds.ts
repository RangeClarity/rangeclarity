import type { AgentResult } from "@/schema/council";

/** Build the round>=2 context each agent receives: a compact digest of what the OTHERS said.
 *  Each agent is asked to state precise disagreements, then revise. */
export function buildDebateContext(results: AgentResult[], forAgentId: string): string {
  return results
    .filter((r) => r.agentId !== forAgentId && r.normalized)
    .map((r) => {
      const x = r.normalized!;
      return `## ${r.agentLabel} (confidence ${x.confidence})
Recommendation: ${x.recommendation}
Plan: ${x.implementation_plan.slice(0, 6).join("; ")}
Risks: ${x.risks.slice(0, 4).join("; ")}`;
    })
    .join("\n\n");
}

export function contextForAllAgents(results: AgentResult[], agentIds: string[]): Record<string, string> {
  return Object.fromEntries(agentIds.map((id) => [id, buildDebateContext(results, id)]));
}

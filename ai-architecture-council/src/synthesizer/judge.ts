import type { AgentResult, CouncilDecision, DebateReport } from "@/schema/council";
import { weightedConfidence, type AgentWeight } from "@/config/weights";

/** Impartial judge. Deterministic baseline below; production swaps `judge` for an LLM call that
 *  receives all normalized answers + the DebateReport and returns the same CouncilDecision shape
 *  (see docs/DEBATE-ALGORITHM.md §Synthesis). The judge must be a DIFFERENT seat than the debaters. */
export function judge(
  results: AgentResult[],
  debate: DebateReport,
  weights: AgentWeight[],
): CouncilDecision {
  const finished = results.filter((r) => r.normalized);
  const votes = finished.map((r) => ({ agentId: r.agentId, confidence: r.normalized!.confidence }));
  const agg = Math.round(weightedConfidence(votes, weights) * 100);

  // Winner = highest weighted-confidence recommendation, tilted toward consensus support.
  const ranked = [...finished].sort((a, b) =>
    (b.normalized!.confidence * w(weights, b.agentId)) - (a.normalized!.confidence * w(weights, a.agentId)));
  const lead = ranked[0]?.normalized;

  const mergedPlan = dedupe(finished.flatMap((r) => r.normalized!.implementation_plan));
  const filesToModify = dedupe(mergedPlan.flatMap(extractFiles));

  return {
    recommendedDecision: lead?.recommendation ?? "Insufficient agent output to decide.",
    whyItWins: [
      `Highest weighted confidence (aggregate ${agg}/100).`,
      debate.consensus.length ? `Supported by consensus on: ${debate.consensus.slice(0, 3).join("; ")}.` : "",
      debate.hiddenRisks.length ? `Mitigations folded in for ${debate.hiddenRisks.length} single-source risk(s).` : "",
    ].filter(Boolean).join(" "),
    actionPlan: {
      priority1: mergedPlan.slice(0, 3),
      priority2: mergedPlan.slice(3, 6),
      priority3: mergedPlan.slice(6, 9),
      filesToModify,
      expectedImpact: lead?.summary ?? "",
      rollbackPlan: "Revert the change set on the feature branch; no schema/data migration unless an issue states otherwise.",
      estimatedComplexity: complexityOf(mergedPlan.length),
      estimatedTime: timeOf(mergedPlan.length),
    },
    confidence: agg,
    dissentRetained: debate.disagreements.map((d) => d.topic).slice(0, 5),
  };
}
const w = (ws: AgentWeight[], id: string) => ws.find((x) => x.agentId === id)?.weight ?? 1;
const dedupe = (a: string[]) => [...new Map(a.map((s) => [s.toLowerCase().trim(), s])).values()];
const extractFiles = (s: string) => [...s.matchAll(/([\w./-]+\.[a-z]{1,5})/gi)].map((m) => m[1]!);
const complexityOf = (n: number) => (n <= 2 ? "S" : n <= 5 ? "M" : n <= 8 ? "L" : "XL") as CouncilDecision["actionPlan"]["estimatedComplexity"];
const timeOf = (n: number) => (n <= 2 ? "~0.5 day" : n <= 5 ? "1–2 days" : n <= 8 ? "3–5 days" : "1–2 weeks");

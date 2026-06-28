/** Weighted voting. Weights are advisory inputs to the debate/synthesis steps — they bias
 *  tie-breaks and the confidence-weighted aggregate, they never silence a dissenting agent. */
export interface AgentWeight { agentId: string; weight: number; } // 0..1, should sum to ~1

export function normalizeWeights(weights: AgentWeight[]): AgentWeight[] {
  const total = weights.reduce((s, w) => s + Math.max(0, w.weight), 0) || 1;
  return weights.map((w) => ({ agentId: w.agentId, weight: Math.max(0, w.weight) / total }));
}

/** Confidence-weighted score for a recommendation cluster. */
export function weightedConfidence(
  votes: { agentId: string; confidence: number }[],
  weights: AgentWeight[],
): number {
  const wmap = new Map(normalizeWeights(weights).map((w) => [w.agentId, w.weight]));
  return votes.reduce((s, v) => s + (v.confidence / 100) * (wmap.get(v.agentId) ?? 1 / votes.length), 0);
}

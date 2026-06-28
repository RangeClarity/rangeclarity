import type { AgentResult, DebateReport } from "@/schema/council";

/** Deterministic baseline debate. Compares every normalized field across agents and derives
 *  consensus / disagreements / hidden risks / missing pieces / tradeoffs. A production build can
 *  layer an LLM "debate judge" on top for nuance (see docs/DEBATE-ALGORITHM.md) — this baseline
 *  guarantees the pipeline runs with zero extra model calls. */
const STANDARD_TOPICS = [
  "tests", "security", "rollback", "performance", "observability", "migration",
  "accessibility", "cost", "documentation", "backward compatibility", "error handling",
];

export function runDebate(results: AgentResult[]): DebateReport {
  const finished = results.filter((r) => r.normalized);
  const n = finished.length || 1;
  const norms = finished.map((r) => ({ id: r.agentId, ...r.normalized! }));

  // Consensus: themes whose keyword cluster appears in >= majority of agents.
  const allRecs = norms.flatMap((x) => bulletize(x.recommendation, x.implementation_plan));
  const clusters = cluster(allRecs);
  const consensus = clusters
    .filter((c) => coverage(c, norms) >= Math.ceil(n / 2))
    .map((c) => c.label);

  // Disagreements: recommendation clusters that are NOT shared, surfaced with each agent's stance.
  const disagreements = clusters
    .filter((c) => coverage(c, norms) > 0 && coverage(c, norms) < n)
    .slice(0, 6)
    .map((c) => ({
      topic: c.label,
      positions: norms.map((x) => ({ agentId: x.id, stance: x.recommendation.slice(0, 160) })),
      why: "Agents weighed different assumptions/tradeoffs; this theme is endorsed by some but not all.",
    }));

  // Hidden risks: risks raised by exactly one agent.
  const riskOwners = new Map<string, Set<string>>();
  for (const x of norms) for (const r of x.risks) {
    const k = norm(r);
    (riskOwners.get(k) ?? riskOwners.set(k, new Set()).get(k)!).add(x.id);
  }
  const hiddenRisks = [...riskOwners.entries()]
    .filter(([, owners]) => owners.size === 1)
    .map(([k, owners]) => ({ risk: original(norms, "risks", k), raisedBy: [...owners][0]! }));

  // Missing pieces: standard topics nobody addressed anywhere.
  const haystack = norms.map((x) => JSON.stringify(x).toLowerCase()).join(" ");
  const missingPieces = STANDARD_TOPICS.filter((t) => !haystack.includes(t)).map((t) => `No agent addressed: ${t}`);

  // Tradeoffs: from alternatives.
  const tradeoffs = norms.flatMap((x) => x.alternatives.slice(0, 2).map((a) => ({
    option: a, pro: "Raised as a viable alternative.", con: "Not the majority recommendation; revisit if constraints change.",
  }))).slice(0, 6);

  return { consensus, disagreements, hiddenRisks, missingPieces, tradeoffs };
}

// --- tiny text utils (no deps) ---
const STOP = new Set(["the","a","an","to","of","and","or","for","with","in","on","is","be","use","using","we","should"]);
const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();
const tokens = (s: string) => norm(s).split(/[^a-z0-9]+/).filter((t) => t.length > 2 && !STOP.has(t));
const bulletize = (rec: string, plan: string[]) => [rec, ...plan].filter(Boolean);
function cluster(items: string[]): { label: string; keys: Set<string> }[] {
  const out: { label: string; keys: Set<string> }[] = [];
  for (const it of items) {
    const ks = new Set(tokens(it));
    const hit = out.find((c) => overlap(c.keys, ks) >= 0.4);
    if (hit) ks.forEach((k) => hit.keys.add(k));
    else out.push({ label: it.slice(0, 90), keys: ks });
  }
  return out;
}
const overlap = (a: Set<string>, b: Set<string>) => {
  const inter = [...a].filter((x) => b.has(x)).length;
  return inter / Math.max(1, Math.min(a.size, b.size));
};
const coverage = (c: { keys: Set<string> }, norms: { id: string; recommendation: string; implementation_plan: string[] }[]) =>
  norms.filter((x) => overlap(c.keys, new Set(tokens([x.recommendation, ...x.implementation_plan].join(" ")))) >= 0.3).length;
const original = (norms: any[], field: string, key: string) => {
  for (const x of norms) for (const v of x[field] as string[]) if (norm(v) === key) return v;
  return key;
};

import { nanoid } from "nanoid";
import type { CouncilDecision, DebateReport } from "@/schema/council";
import type { HermesPlan, HermesIssue, Priority } from "@/schema/hermes";

/** Hermes: convert the council's DECISION into structured, executable delivery.
 *  Hermes never re-decides architecture — it only structures what the council agreed. */
export function buildHermesPlan(args: {
  sessionId: string;
  decision: CouncilDecision;
  debate: DebateReport;
  prompt: string;
}): HermesPlan {
  const { sessionId, decision, debate } = args;
  const ap = decision.actionPlan;

  const mkIssues = (steps: string[], priority: Priority, offset: number): HermesIssue[] =>
    steps.map((step, i) => {
      const key = `AC-${offset + i + 1}`;
      return {
        key,
        title: titleize(step),
        description: step,
        priority,
        labels: ["council", `complexity:${decision.actionPlan.estimatedComplexity}`],
        acceptanceCriteria: [`Implements: ${titleize(step)}`, "Passes the project's verification gate (typecheck/lint/test)"],
        risks: debate.hiddenRisks.slice(0, 2).map((r) => r.risk),
        dependencies: offset + i > 0 ? [`AC-${offset + i}`] : [],
        ownerSuggestion: ownerFor(step),
        estimatedComplexity: decision.actionPlan.estimatedComplexity,
        implementationPrompt: implPrompt(step, args.prompt),
        rollbackPlan: ap.rollbackPlan,
        definitionOfDone: ["Merged behind review", "No regression in the verification gate", "Linked back to the council session"],
        subtasks: [],
      };
    });

  const epics = [
    { key: "EP-1", title: "Priority 1 — core change", goal: ap.expectedImpact, issues: mkIssues(ap.priority1, "high", 0) },
    { key: "EP-2", title: "Priority 2 — supporting work", goal: "Hardening + follow-through", issues: mkIssues(ap.priority2, "medium", ap.priority1.length) },
    { key: "EP-3", title: "Priority 3 — nice-to-have", goal: "Polish + deferred items", issues: mkIssues(ap.priority3, "low", ap.priority1.length + ap.priority2.length) },
  ].filter((e) => e.issues.length);

  const allKeys = epics.flatMap((e) => e.issues.map((i) => i.key));
  return {
    id: nanoid(), sessionId, createdAt: new Date().toISOString(),
    milestone: { title: titleize(decision.recommendedDecision).slice(0, 80), outcome: ap.expectedImpact },
    epics, dependencyOrder: allKeys,
    blockers: debate.missingPieces.slice(0, 3),
    statusSummary: `0/${allKeys.length} issues done · est ${ap.estimatedTime} · complexity ${ap.estimatedComplexity}`,
  };
}
const titleize = (s: string) => s.replace(/^[-*\d.\s]+/, "").split(/[.;\n]/)[0]!.slice(0, 80).trim();
const ownerFor = (s: string) => /test|qa|verify/i.test(s) ? "engineering" : /research|label|baseline|model/i.test(s) ? "research" : /copy|landing|brand|content/i.test(s) ? "marketing" : "engineering";
const implPrompt = (step: string, task: string) =>
  `Implement exactly one issue from the AI Architecture Council decision.\nOriginal task: ${task}\nThis issue: ${step}\nRules: smallest safe change; run the verification gate; no unrelated edits; do not commit/push without approval.`;

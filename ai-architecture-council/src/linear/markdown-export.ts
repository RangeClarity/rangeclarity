import type { LinearIssueDraft, LinearPreview } from "@/schema/linear";

/** The exact markdown body each Linear issue carries (also the offline export when Linear is unavailable). */
export function buildIssueBody(d: LinearIssueDraft): string {
  const list = (xs: string[]) => xs.map((x) => `- ${x}`).join("\n") || "- —";
  return [
    d.description, "",
    "### Acceptance Criteria", list(d.acceptanceCriteria), "",
    "### Risks", list(d.risks), "",
    "### Dependencies", list(d.dependencies), "",
    "### Rollback Plan", d.rollbackPlan ?? "—", "",
    "### Definition of Done", list(d.definitionOfDone), "",
    "### Implementation Prompt", "```\n" + (d.implementationPrompt ?? "—") + "\n```", "",
    "---",
    `Source council session: \`${d.sourceCouncilSessionId}\``,
    d.relatedAgentOpinions.length ? `Related agent opinions: ${d.relatedAgentOpinions.join(" · ")}` : "",
  ].join("\n");
}

export function exportPlanMarkdown(preview: LinearPreview): string {
  const head = `# Execution plan (offline export)\nSession: \`${preview.sessionId}\` · ${preview.issues.length} issues\n`;
  const issues = preview.issues.map((d, i) =>
    `\n## ${i + 1}. ${d.title}  _(P${d.priority}${d.labels.length ? " · " + d.labels.join(", ") : ""})_\n\n${buildIssueBody(d)}`,
  ).join("\n");
  return head + issues + "\n";
}

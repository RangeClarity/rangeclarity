import { nanoid } from "nanoid";
import type { HermesPlan } from "@/schema/hermes";
import type { LinearIssueDraft, LinearPreview, LinearCreateResult } from "@/schema/linear";
import { buildIssueBody } from "./markdown-export";

const PRIORITY_MAP = { urgent: 1, high: 2, medium: 3, low: 4 } as const;

/** Build a Linear preview from a Hermes plan. Pure + side-effect free — safe to regenerate. */
export function buildLinearPreview(plan: HermesPlan, opts: { teamId?: string; projectId?: string; agentLabels?: string[] }): LinearPreview {
  const issues: LinearIssueDraft[] = plan.epics.flatMap((epic) =>
    epic.issues.map((i) => ({
      hermesKey: i.key,
      title: i.title,
      description: i.description,
      priority: PRIORITY_MAP[i.priority],
      labels: [...i.labels, `epic:${epic.key}`],
      projectId: opts.projectId,
      milestone: plan.milestone.title,
      acceptanceCriteria: i.acceptanceCriteria,
      risks: i.risks,
      dependencies: i.dependencies,
      implementationPrompt: i.implementationPrompt,
      sourceCouncilSessionId: plan.sessionId,
      relatedAgentOpinions: opts.agentLabels ?? [],
      rollbackPlan: i.rollbackPlan,
      definitionOfDone: i.definitionOfDone,
    })),
  );
  return { id: nanoid(), sessionId: plan.sessionId, hermesPlanId: plan.id, teamId: opts.teamId, issues, createdAt: new Date().toISOString() };
}

export interface LinearWriter {
  createIssue(input: { teamId: string; title: string; description: string; priority: number; labels: string[]; projectId?: string }): Promise<{ id: string; url: string }>;
}

/** GATED create. Throws unless explicitly allowed AND approved — nothing reaches Linear by accident.
 *  `selected` lets the UI do "Create selected". Pass a real LinearWriter (Linear MCP/SDK) at the call site. */
export async function createApprovedIssues(args: {
  preview: LinearPreview;
  writer: LinearWriter;
  approvedHermesKeys: string[];      // explicit per-issue approval from the UI
  allowWrites: boolean;              // env hard-gate (COUNCIL_ALLOW_LINEAR_WRITES)
  teamId: string;
}): Promise<LinearCreateResult[]> {
  if (!args.allowWrites) throw new Error("Linear writes disabled (COUNCIL_ALLOW_LINEAR_WRITES=false).");
  const approved = args.preview.issues.filter((i) => args.approvedHermesKeys.includes(i.hermesKey));
  const out: LinearCreateResult[] = [];
  for (const d of approved) {
    try {
      const r = await args.writer.createIssue({
        teamId: args.teamId, title: d.title, description: buildIssueBody(d),
        priority: d.priority, labels: d.labels, projectId: d.projectId,
      });
      out.push({ hermesKey: d.hermesKey, created: true, linearId: r.id, url: r.url });
    } catch (e) {
      out.push({ hermesKey: d.hermesKey, created: false, error: e instanceof Error ? e.message : String(e) });
    }
  }
  return out;
}

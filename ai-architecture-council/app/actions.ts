"use server";
import { nanoid } from "nanoid";
import type { ExecutionMode } from "@/config/modes";
import { orchestrate } from "@/orchestrator/orchestrator";
import { contextForAllAgents } from "@/debate/rounds";
import { runDebate } from "@/debate/debate-engine";
import { judge } from "@/synthesizer/judge";
import { buildHermesPlan } from "@/hermes/hermes-planner";
import { buildLinearPreview, createApprovedIssues, type LinearWriter } from "@/linear/linear-adapter";
import { normalizeWeights } from "@/config/weights";
import type { AgentResult, CouncilSession } from "@/schema/council";

export interface RunCouncilInput {
  prompt: string; mode: ExecutionMode; agentIds: string[]; rounds?: number;
  weights?: { agentId: string; weight: number }[]; project?: string; branch?: string;
}

/** End-to-end (non-streaming convenience; the route streams the same pipeline).
 *  Stops BEFORE any Linear write — returns the preview for the user to approve. */
export async function runCouncil(input: RunCouncilInput): Promise<CouncilSession> {
  const id = nanoid();
  const weights = normalizeWeights(input.weights ?? input.agentIds.map((a) => ({ agentId: a, weight: 1 })));
  const wmap = Object.fromEntries(weights.map((w) => [w.agentId, w.weight]));
  const rounds = Math.max(1, Math.min(3, input.rounds ?? 1));

  let allResults: AgentResult[] = [];
  let lastRound: AgentResult[] = [];
  for (let round = 1; round <= rounds; round++) {
    const ctx = round > 1 ? contextForAllAgents(lastRound, input.agentIds) : undefined;
    lastRound = [];
    for await (const e of orchestrate({ ...input, round, weights: wmap, debateContextByAgent: ctx })) {
      if (e.kind === "agent-done") lastRound.push(e.result);
    }
    allResults = allResults.concat(lastRound);
  }

  const debate = runDebate(lastRound);                    // debate over the final round
  const decision = judge(lastRound, debate, weights);
  const hermesPlan = buildHermesPlan({ sessionId: id, decision, debate, prompt: input.prompt });
  const linearPreview = buildLinearPreview(hermesPlan, {
    teamId: process.env.LINEAR_TEAM_ID, projectId: process.env.LINEAR_DEFAULT_PROJECT_ID,
    agentLabels: lastRound.map((r) => r.agentLabel),
  });

  const session: CouncilSession = {
    id, createdAt: new Date().toISOString(), prompt: input.prompt, mode: input.mode,
    project: input.project, branch: input.branch, agentIds: input.agentIds, weights, rounds,
    results: allResults, debate, decision,
    hermesPlanId: hermesPlan.id, linearPreviewId: linearPreview.id,
    agentVersions: Object.fromEntries(lastRound.map((r) => [r.agentId, r.agentVersion ?? ""])),
  };
  // TODO(impl): persist via SessionStore (prisma). Hermes plan + preview saved alongside. No Linear write here.
  return session;
}

/** Gated Linear creation — only callable after explicit UI approval ("Create all"/"Create selected"). */
export async function approveAndCreateLinear(args: {
  sessionId: string; approvedHermesKeys: string[]; previewJson: string;
}): Promise<unknown> {
  const preview = JSON.parse(args.previewJson);
  const writer: LinearWriter = {
    async createIssue() { throw new Error("Linear writer not wired — connect Linear MCP/SDK; see docs/HERMES-LINEAR.md"); },
  };
  return createApprovedIssues({
    preview, writer, approvedHermesKeys: args.approvedHermesKeys,
    allowWrites: process.env.COUNCIL_ALLOW_LINEAR_WRITES === "true",
    teamId: process.env.LINEAR_TEAM_ID ?? "",
  });
}

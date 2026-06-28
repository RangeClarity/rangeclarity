import { z } from "zod";
import { EXECUTION_MODES } from "@/config/modes";

/** The single common schema EVERY agent answer is normalized into. */
export const NormalizedAgentResponse = z.object({
  summary: z.string(),
  recommendation: z.string(),
  implementation_plan: z.array(z.string()).default([]),
  risks: z.array(z.string()).default([]),
  assumptions: z.array(z.string()).default([]),
  alternatives: z.array(z.string()).default([]),
  confidence: z.number().min(0).max(100),
});
export type NormalizedAgentResponse = z.infer<typeof NormalizedAgentResponse>;

export const AgentStatus = z.enum(["waiting", "running", "finished", "failed"]);
export type AgentStatus = z.infer<typeof AgentStatus>;

/** One agent's contribution to a session (one per round). */
export const AgentResult = z.object({
  agentId: z.string(),                 // "claude-code" | "codex" | "antigravity"
  agentLabel: z.string(),
  agentVersion: z.string().optional(), // captured at run time, persisted
  round: z.number().int().min(1).default(1),
  status: AgentStatus.default("waiting"),
  weight: z.number().min(0).max(1).default(1),
  raw: z.string().optional(),          // verbatim model output (Raw Responses tab)
  normalized: NormalizedAgentResponse.optional(),
  error: z.string().optional(),
  latencyMs: z.number().optional(),
  startedAt: z.string().datetime().optional(),
  finishedAt: z.string().datetime().optional(),
});
export type AgentResult = z.infer<typeof AgentResult>;

/** Output of the debate engine. */
export const DebateReport = z.object({
  consensus: z.array(z.string()),
  disagreements: z.array(z.object({ topic: z.string(), positions: z.array(z.object({ agentId: z.string(), stance: z.string() })), why: z.string() })),
  hiddenRisks: z.array(z.object({ risk: z.string(), raisedBy: z.string() })),
  missingPieces: z.array(z.string()),
  tradeoffs: z.array(z.object({ option: z.string(), pro: z.string(), con: z.string() })),
});
export type DebateReport = z.infer<typeof DebateReport>;

/** Output of the synthesizer (impartial judge). */
export const CouncilDecision = z.object({
  recommendedDecision: z.string(),
  whyItWins: z.string(),
  actionPlan: z.object({
    priority1: z.array(z.string()),
    priority2: z.array(z.string()),
    priority3: z.array(z.string()),
    filesToModify: z.array(z.string()),
    expectedImpact: z.string(),
    rollbackPlan: z.string(),
    estimatedComplexity: z.enum(["XS", "S", "M", "L", "XL"]),
    estimatedTime: z.string(),
  }),
  confidence: z.number().min(0).max(100),
  dissentRetained: z.array(z.string()).default([]), // disagreements that survive the decision
});
export type CouncilDecision = z.infer<typeof CouncilDecision>;

export const ExecutionModeSchema = z.enum(EXECUTION_MODES);

/** The full persisted session (see storage + prisma/schema). */
export const CouncilSession = z.object({
  id: z.string(),
  createdAt: z.string().datetime(),
  prompt: z.string(),
  mode: ExecutionModeSchema,
  project: z.string().optional(),       // e.g. "RangeClarity"
  branch: z.string().optional(),        // e.g. "landing-mobile-cta-polish"
  agentIds: z.array(z.string()),
  weights: z.array(z.object({ agentId: z.string(), weight: z.number() })).default([]),
  rounds: z.number().int().default(1),
  results: z.array(AgentResult).default([]),     // all rounds, all agents
  debate: DebateReport.optional(),
  decision: CouncilDecision.optional(),
  // Hermes + Linear (see their schemas)
  hermesPlanId: z.string().optional(),
  linearPreviewId: z.string().optional(),
  agentVersions: z.record(z.string(), z.string()).default({}),
});
export type CouncilSession = z.infer<typeof CouncilSession>;

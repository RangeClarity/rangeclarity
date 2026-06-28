import { z } from "zod";

/** The exact shape each generated Linear issue carries. Built from the Hermes plan;
 *  shown in the Linear Preview tab; only written to Linear after explicit approval. */
export const LinearIssueDraft = z.object({
  hermesKey: z.string(),                 // links back to HermesIssue.key
  title: z.string(),
  description: z.string(),               // rendered markdown body (see buildIssueBody)
  priority: z.number().int().min(0).max(4),  // Linear: 0 none,1 urgent,2 high,3 med,4 low
  labels: z.array(z.string()).default([]),
  projectId: z.string().optional(),
  milestone: z.string().optional(),
  acceptanceCriteria: z.array(z.string()).default([]),
  risks: z.array(z.string()).default([]),
  dependencies: z.array(z.string()).default([]),
  implementationPrompt: z.string().optional(),
  sourceCouncilSessionId: z.string(),    // traceability
  relatedAgentOpinions: z.array(z.string()).default([]),
  rollbackPlan: z.string().optional(),
  definitionOfDone: z.array(z.string()).default([]),
});
export type LinearIssueDraft = z.infer<typeof LinearIssueDraft>;

export const LinearPreview = z.object({
  id: z.string(),
  sessionId: z.string(),
  hermesPlanId: z.string(),
  teamId: z.string().optional(),
  issues: z.array(LinearIssueDraft).default([]),
  createdAt: z.string().datetime(),
});
export type LinearPreview = z.infer<typeof LinearPreview>;

/** Result of a (gated) create. */
export const LinearCreateResult = z.object({
  hermesKey: z.string(),
  created: z.boolean(),
  linearId: z.string().optional(),
  url: z.string().optional(),
  error: z.string().optional(),
});
export type LinearCreateResult = z.infer<typeof LinearCreateResult>;

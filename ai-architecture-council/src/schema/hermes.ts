import { z } from "zod";

/** Hermes converts a CouncilDecision into a structured, executable delivery plan.
 *  Hermes does NOT decide architecture — it receives the council's decision and structures execution. */
export const Priority = z.enum(["urgent", "high", "medium", "low"]);
export type Priority = z.infer<typeof Priority>;

export const HermesSubtask = z.object({
  title: z.string(),
  acceptanceCriteria: z.array(z.string()).default([]),
  estimate: z.enum(["XS", "S", "M", "L", "XL"]).default("S"),
});

export const HermesIssue = z.object({
  key: z.string(),                       // local key e.g. "AC-1" before Linear assigns an id
  title: z.string(),
  description: z.string(),
  priority: Priority,
  labels: z.array(z.string()).default([]),
  acceptanceCriteria: z.array(z.string()).default([]),
  risks: z.array(z.string()).default([]),
  dependencies: z.array(z.string()).default([]),   // other issue keys
  ownerSuggestion: z.string().optional(),          // "engineering" | "research" | "product" | "marketing"
  estimatedComplexity: z.enum(["XS", "S", "M", "L", "XL"]).default("M"),
  implementationPrompt: z.string().optional(),     // ready-to-send Claude Code / Codex prompt
  rollbackPlan: z.string().optional(),
  definitionOfDone: z.array(z.string()).default([]),
  subtasks: z.array(HermesSubtask).default([]),
});
export type HermesIssue = z.infer<typeof HermesIssue>;

export const HermesEpic = z.object({
  key: z.string(),
  title: z.string(),
  goal: z.string(),
  issues: z.array(HermesIssue).default([]),
});

export const HermesPlan = z.object({
  id: z.string(),
  sessionId: z.string(),                 // session-to-execution traceability
  createdAt: z.string().datetime(),
  milestone: z.object({ title: z.string(), outcome: z.string(), targetWindow: z.string().optional() }),
  epics: z.array(HermesEpic).default([]),
  dependencyOrder: z.array(z.string()).default([]), // topological issue-key order
  blockers: z.array(z.string()).default([]),
  statusSummary: z.string().optional(),  // for daily/weekly updates
});
export type HermesPlan = z.infer<typeof HermesPlan>;

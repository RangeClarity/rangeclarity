/** Execution modes change ONLY the prompt framing + which output sections are emphasized.
 *  The orchestration pipeline is identical across modes. */
export const EXECUTION_MODES = ["review", "planning", "implementation", "audit", "architecture"] as const;
export type ExecutionMode = (typeof EXECUTION_MODES)[number];

export const MODE_BRIEF: Record<ExecutionMode, string> = {
  review:        "Only compare opinions. Do not produce an implementation plan.",
  planning:      "Produce a concrete, ordered implementation plan.",
  implementation:"Produce prompts ready to send to a coding agent (Claude Code).",
  audit:         "Critique an existing implementation; find defects, risks, regressions.",
  architecture:  "Design the system: modules, contracts, data flow, tradeoffs.",
};

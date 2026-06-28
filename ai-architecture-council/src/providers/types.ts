import type { ExecutionMode } from "@/config/modes";

export interface ProviderRunOptions {
  mode: ExecutionMode;
  round: number;
  /** In round >= 2, the orchestrator passes the other agents' answers here. */
  debateContext?: string;
  signal?: AbortSignal;
}

export type ProviderChunk =
  | { type: "status"; status: "running" | "finished" | "failed" }
  | { type: "token"; text: string }
  | { type: "done"; raw: string; version: string; latencyMs: number }
  | { type: "error"; message: string };

/** The ONLY contract the orchestrator depends on. Adding Gemini/Cursor/Grok/Ollama later
 *  means implementing this interface and registering it — nothing else changes. */
export interface AgentProvider {
  readonly id: string;     // stable, e.g. "claude-code"
  readonly label: string;  // display, e.g. "Claude Code"
  version(): Promise<string>;
  /** Streaming run. Implementations yield tokens then a final {done} (or {error}). */
  run(prompt: string, opts: ProviderRunOptions): AsyncIterable<ProviderChunk>;
}

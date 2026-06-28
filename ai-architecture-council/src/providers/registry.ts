import type { AgentProvider } from "./types";
import { ClaudeCodeProvider } from "./claude-code";
import { CodexProvider } from "./codex";
import { AntiGravityProvider } from "./antigravity";

/** Central registry. Register a new provider here (Gemini/Cursor/Grok/Ollama) and it becomes
 *  selectable everywhere — the orchestrator and UI discover agents through this map only. */
const PROVIDERS = new Map<string, AgentProvider>(
  [new ClaudeCodeProvider(), new CodexProvider(), new AntiGravityProvider()].map((p) => [p.id, p]),
);

export function getProvider(id: string): AgentProvider {
  const p = PROVIDERS.get(id);
  if (!p) throw new Error(`Unknown provider: ${id}`);
  return p;
}
export function listProviders(): { id: string; label: string }[] {
  return [...PROVIDERS.values()].map((p) => ({ id: p.id, label: p.label }));
}
export function registerProvider(p: AgentProvider): void { PROVIDERS.set(p.id, p); }

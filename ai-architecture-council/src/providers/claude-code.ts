import { BaseProvider } from "./base";
import type { ProviderRunOptions } from "./types";

/** Claude Code provider. MVP: call the Anthropic API (or a local Claude Code bridge).
 *  Swap `complete` for the real transport; the rest of the system is unaffected. */
export class ClaudeCodeProvider extends BaseProvider {
  readonly id = "claude-code";
  readonly label = "Claude Code";
  async version() { return process.env.CLAUDE_MODEL ?? "claude-opus-4-8"; }
  protected async complete(prompt: string, _opts: ProviderRunOptions): Promise<string> {
    // TODO(impl): POST Anthropic /v1/messages with ANTHROPIC_API_KEY (or shell out to a Claude Code CLI bridge).
    // Must return verbatim text; normalization happens in the orchestrator.
    throw new Error("ClaudeCodeProvider.complete not wired — see docs/IMPLEMENTATION-PLAN.md step 3");
  }
}

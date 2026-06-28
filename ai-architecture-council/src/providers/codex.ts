import { BaseProvider } from "./base";
import type { ProviderRunOptions } from "./types";

export class CodexProvider extends BaseProvider {
  readonly id = "codex";
  readonly label = "OpenAI Codex";
  async version() { return process.env.OPENAI_MODEL ?? "gpt-5-codex"; }
  protected async complete(_prompt: string, _opts: ProviderRunOptions): Promise<string> {
    // TODO(impl): OpenAI Responses API with OPENAI_API_KEY.
    throw new Error("CodexProvider.complete not wired — see docs/IMPLEMENTATION-PLAN.md step 3");
  }
}

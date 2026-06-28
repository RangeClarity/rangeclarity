import { BaseProvider } from "./base";
import type { ProviderRunOptions } from "./types";

export class AntiGravityProvider extends BaseProvider {
  readonly id = "antigravity";
  readonly label = "AntiGravity";
  async version() { return process.env.ANTIGRAVITY_MODEL ?? "antigravity-latest"; }
  protected async complete(_prompt: string, _opts: ProviderRunOptions): Promise<string> {
    // TODO(impl): ANTIGRAVITY_BASE_URL + ANTIGRAVITY_API_KEY (OpenAI-compatible transport assumed).
    throw new Error("AntiGravityProvider.complete not wired — see docs/IMPLEMENTATION-PLAN.md step 3");
  }
}

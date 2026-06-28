import type { AgentProvider, ProviderChunk, ProviderRunOptions } from "./types";
import { MODE_BRIEF } from "@/config/modes";

/** Shared scaffolding: the system instruction that forces every agent to answer in the
 *  common schema, plus a default streaming wrapper around a single non-streaming call. */
export abstract class BaseProvider implements AgentProvider {
  abstract readonly id: string;
  abstract readonly label: string;
  abstract version(): Promise<string>;

  /** Implement the actual model call here. Return the verbatim text. */
  protected abstract complete(prompt: string, opts: ProviderRunOptions): Promise<string>;

  protected systemInstruction(opts: ProviderRunOptions): string {
    return [
      "You are an expert engineering/product advisor on an AI Architecture Council.",
      `Mode: ${opts.mode}. ${MODE_BRIEF[opts.mode]}`,
      "Respond with STRICT JSON only, matching this schema:",
      `{"summary":string,"recommendation":string,"implementation_plan":string[],`,
      `"risks":string[],"assumptions":string[],"alternatives":string[],"confidence":number(0-100)}`,
      "Be decisive and specific. Confidence reflects how sure you are, not how complex the task is.",
      opts.debateContext
        ? `\nThis is debate round ${opts.round}. Here is what the other agents said — state precisely what you DISAGREE with and why, then revise your own answer:\n${opts.debateContext}`
        : "",
    ].join("\n");
  }

  async *run(prompt: string, opts: ProviderRunOptions): AsyncIterable<ProviderChunk> {
    const started = Date.now();
    yield { type: "status", status: "running" };
    try {
      const full = `${this.systemInstruction(opts)}\n\n# TASK\n${prompt}`;
      const raw = await this.complete(full, opts);
      const version = await this.version();
      yield { type: "done", raw, version, latencyMs: Date.now() - started };
      yield { type: "status", status: "finished" };
    } catch (e) {
      yield { type: "error", message: e instanceof Error ? e.message : String(e) };
      yield { type: "status", status: "failed" };
    }
  }
}

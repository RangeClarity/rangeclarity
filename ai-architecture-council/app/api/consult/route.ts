import { orchestrate } from "@/orchestrator/orchestrator";
import type { RunCouncilInput } from "@app/actions";

export const runtime = "nodejs";

/** SSE-style streaming endpoint: emits per-agent status/tokens as they arrive, then a final
 *  "all-done". The client (React Query / EventSource) updates the right-panel statuses live.
 *  Debate + judge + hermes + linear-preview run after all-done (see app/actions.ts). */
export async function POST(req: Request) {
  const input = (await req.json()) as RunCouncilInput & { round?: number };
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (e: unknown) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(e)}\n\n`));
      try {
        for await (const ev of orchestrate({
          prompt: input.prompt, mode: input.mode, agentIds: input.agentIds, round: input.round ?? 1,
          weights: Object.fromEntries((input.weights ?? []).map((w) => [w.agentId, w.weight])),
        })) send(ev);
      } catch (e) { send({ kind: "error", message: e instanceof Error ? e.message : String(e) }); }
      controller.close();
    },
  });
  return new Response(stream, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" } });
}

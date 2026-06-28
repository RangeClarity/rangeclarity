import { NormalizedAgentResponse } from "@/schema/council";

/** Robustly coerce a model's raw text into the common schema. Tolerates code fences and
 *  prose around the JSON; falls back to a best-effort object so one bad agent never breaks the run. */
export function normalize(raw: string): NormalizedAgentResponse {
  const json = extractJson(raw);
  const parsed = NormalizedAgentResponse.safeParse(json);
  if (parsed.success) return parsed.data;
  // Best-effort fallback: keep the run alive, flag low confidence.
  return NormalizedAgentResponse.parse({
    summary: typeof json?.summary === "string" ? json.summary : raw.slice(0, 400),
    recommendation: typeof json?.recommendation === "string" ? json.recommendation : "(unparseable — see Raw Responses)",
    implementation_plan: arr(json?.implementation_plan),
    risks: arr(json?.risks),
    assumptions: arr(json?.assumptions),
    alternatives: arr(json?.alternatives),
    confidence: typeof json?.confidence === "number" ? clamp(json.confidence) : 25,
  });
}
function extractJson(raw: string): any {
  const fence = raw.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1] ?? raw;
  const start = fence.indexOf("{"), end = fence.lastIndexOf("}");
  if (start === -1 || end === -1) return {};
  try { return JSON.parse(fence.slice(start, end + 1)); } catch { return {}; }
}
const arr = (v: unknown): string[] => (Array.isArray(v) ? v.map(String) : []);
const clamp = (n: number) => Math.max(0, Math.min(100, n));

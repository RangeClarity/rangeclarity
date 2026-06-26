// Read-only helpers for the internal Command Center / Ops pages.
// Pure local file reads — no network, no execution, no writes. Server-only.
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

export function readDoc(rel: string): string | null {
  try {
    return fs.readFileSync(path.join(ROOT, rel), "utf8");
  } catch {
    return null;
  }
}

/** Path used to load a prompt's contents for a copy button (alias of readDoc). */
export const readPrompt = readDoc;

export function fileMeta(rel: string): { exists: boolean; mtime: string | null } {
  try {
    const s = fs.statSync(path.join(ROOT, rel));
    return { exists: true, mtime: s.mtime.toISOString().slice(0, 16).replace("T", " ") + "Z" };
  } catch {
    return { exists: false, mtime: null };
  }
}

/** First paragraph under a "## Heading", markdown markers stripped. */
export function docSection(md: string | null, heading: string, maxLines = 3): string | null {
  if (!md) return null;
  const lines = md.replace(/\r/g, "").split("\n");
  const idx = lines.findIndex((l) => l.trim().toLowerCase() === `## ${heading}`.toLowerCase());
  if (idx === -1) return null;
  const out: string[] = [];
  for (let i = idx + 1; i < lines.length && out.length < maxLines; i++) {
    const l = lines[i].trim();
    if (l.startsWith("## ") || l === "---") break;
    if (!l) {
      if (out.length) break;
      continue;
    }
    out.push(l);
  }
  return out.length ? out.join(" ").replace(/\*\*/g, "").replace(/[`_]/g, "") : null;
}

export interface QaSummary {
  critical: number | null;
  warning: number | null;
  info: number | null;
  events: number | null;
  productFindings: number | null;
  generated: string | null;
}

export function readQaSummary(rel = "docs/qa/live-qa-report.md"): QaSummary | null {
  const md = readDoc(rel);
  if (!md) return null;
  const count = (label: string): number | null => {
    const m = md.match(new RegExp(`\\|\\s*${label}\\s*\\|\\s*(\\d+)\\s*\\|`));
    return m ? Number(m[1]) : null;
  };
  const gen = md.match(/Generated:\s*([^\n·]+?)\s*·\s*Events:\s*(\d+)\s*·\s*Product findings:\s*(\d+)/);
  return {
    critical: count("🔴 critical"),
    warning: count("🟠 warning"),
    info: count("🔵 info"),
    events: gen ? Number(gen[2]) : null,
    productFindings: gen ? Number(gen[3]) : null,
    generated: gen ? gen[1].trim() : null,
  };
}

/** Parse "- [ ] item" / "- [x] item" / "- item" checklist lines into {done, text}. */
export function listChecklist(md: string | null): { done: boolean; text: string }[] {
  if (!md) return [];
  const out: { done: boolean; text: string }[] = [];
  for (const raw of md.replace(/\r/g, "").split("\n")) {
    const m = raw.match(/^\s*-\s*(\[( |x|X)\]\s*)?(.+)$/);
    if (!m) continue;
    const text = m[3].trim();
    if (!text || text.startsWith("_")) continue; // skip notes/italics
    out.push({ done: /x/i.test(m[2] ?? ""), text: text.replace(/\*\*/g, "") });
  }
  return out;
}

export interface RoadmapItem {
  section: string;
  status: string;
  title: string;
  note: string;
}

/** Parse a "## Section" + "- [status] Title — note" roadmap doc into items. */
export function readRoadmap(rel = "docs/ops/product-roadmap.md"): RoadmapItem[] {
  const md = readDoc(rel);
  if (!md) return [];
  const out: RoadmapItem[] = [];
  let section = "";
  for (const raw of md.replace(/\r/g, "").split("\n")) {
    const h = raw.match(/^##\s+(.+?)\s*$/);
    if (h) {
      section = h[1].trim();
      continue;
    }
    const m = raw.match(/^\s*-\s*\[([a-z-]+)\]\s*(.+)$/i);
    if (!m) continue;
    const parts = m[2].split(/\s+—\s+/);
    out.push({ section, status: m[1].toLowerCase(), title: parts[0].trim(), note: (parts[1] ?? "").trim() });
  }
  return out;
}

// ---- Neural Map (System Brain): read the structured system-map JSON (read-only). ----
export type NeuralStatus = "GREEN" | "YELLOW" | "RED" | "LOCKED";
export type NeuralRisk = "HIGH" | "MEDIUM" | "LOW";

export interface NeuralConsumer {
  name: string;
  state: string;
}

export interface NeuralModule {
  id: string;
  name: string;
  status: NeuralStatus;
  risk: NeuralRisk;
  lane: string;
  purpose: string;
  interface: string;
  owner: string;
  files: string[];
  functions: string[];
  consumers: NeuralConsumer[];
  tests: string[];
  gates: string[];
  blocked: boolean;
  blocked_reason: string;
  do_not_touch: boolean;
  do_not_touch_items: string[];
  progress: string;
  next_action: string;
  blocked_actions?: string;
  doc: string;
}

export interface NeuralMapMeta {
  name: string;
  subtitle: string;
  as_of: string;
  conviction: string;
  conviction_reason: string;
  legend: Record<string, string>;
  guardrails: string[];
  sources: string[];
  baseline: string;
  golden: string;
}

export interface NeuralEdge {
  from: string;
  to: string | null;
  type: string;
}

export interface NeuralMap {
  meta: NeuralMapMeta;
  modules: NeuralModule[];
  edges: NeuralEdge[];
  answers: Record<string, string[]>;
}

/** Read + parse the Neural Map JSON (read-only). Returns null if missing/invalid. */
export function readNeuralMap(rel = "docs/architecture/rangeclarity-neural-map.json"): NeuralMap | null {
  const raw = readDoc(rel);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as NeuralMap;
  } catch {
    return null;
  }
}

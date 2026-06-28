#!/usr/bin/env node
/**
 * rc:loop — read-only daily-loop orientation.
 *
 * Prints the RangeClarity improvement loop, the commands to run, and the current
 * status snapshot. It does NOT execute any command, run any agent, or change any
 * file. Safe to run anytime. Full process: docs/ops/continuous-improvement-loop.md
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const C = { dim: "\x1b[2m", b: "\x1b[1m", g: "\x1b[32m", c: "\x1b[36m", y: "\x1b[33m", r: "\x1b[0m" };

function section(md, heading) {
  // return the first paragraph under "## <heading>", markdown markers stripped
  const lines = md.replace(/\r/g, "").split("\n");
  const idx = lines.findIndex((l) => l.trim().toLowerCase() === `## ${heading}`.toLowerCase());
  if (idx === -1) return null;
  const out = [];
  for (let i = idx + 1; i < lines.length && out.length < 2; i++) {
    const l = lines[i].trim();
    if (l.startsWith("## ") || l === "---") break;
    if (!l) { if (out.length) break; else continue; }
    out.push(l);
  }
  return out.length ? out.join(" ").replace(/\*\*/g, "").replace(/[`_]/g, "") : null;
}

function readSafe(rel) {
  try { return readFileSync(join(ROOT, rel), "utf8"); } catch { return null; }
}

console.log(`\n${C.b}RangeClarity — Continuous Improvement Loop${C.r}`);
console.log(`${C.dim}Codex critiques · Claude fixes one · Dean approves · WIP = 1 · no auto commit/push${C.r}\n`);

console.log(`${C.c}The loop:${C.r}`);
[
  "1. Shell health        → npm run health",
  "2. Web/Mobile QA       → npm run dev, check homepage + /beta/free-access at 390/430px",
  "3. Indicator QA        → npm run qa:rc, read docs/qa/live-qa-report.md",
  "4. Codex critique      → paste prompts/codex-daily-critic.md, pick ONE issue",
  "5. Claude fix (one)    → paste prompts/claude-fix-one-issue.md",
  "6. Shell verification  → npm run health",
  "7. Dean visual approval→ npm run dev, look on mobile + desktop",
  "8. Update board        → docs/kanban.md + docs/ops/current-loop-status.md",
].forEach((s) => console.log(`   ${s}`));

const status = readSafe("docs/ops/current-loop-status.md");
console.log(`\n${C.c}Current status${C.r} ${C.dim}(docs/ops/current-loop-status.md)${C.r}`);
if (status) {
  const phase = section(status, "Current loop phase");
  const health = section(status, "Last health result");
  const top = section(status, "Current top issue");
  const next = section(status, "Next Claude task");
  console.log(`   ${C.b}Phase:${C.r}      ${phase ?? "—"}`);
  console.log(`   ${C.b}Health:${C.r}     ${health ?? "—"}`);
  console.log(`   ${C.b}Top issue:${C.r}  ${top ?? "—"}`);
  console.log(`   ${C.b}Next task:${C.r}  ${next ?? "—"}`);
} else {
  console.log(`   ${C.y}not generated yet — see docs/ops/continuous-improvement-loop.md${C.r}`);
}

console.log(`\n${C.c}Live dashboard:${C.r} npm run dev → http://localhost:3000/ops`);
console.log(`${C.dim}This script is read-only. Run the commands above yourself.${C.r}\n`);

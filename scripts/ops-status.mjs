#!/usr/bin/env node
/**
 * ops:status — read-only RangeClarity status snapshot.
 *
 * Reads the loop-status file + the Live QA report and prints a one-glance summary
 * plus a "safe to continue editing?" verdict. It does NOT run health, call any API,
 * touch git, or change any file. Pure local file reads. Overview: docs/ops/rc-ops-brain.md
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const C = { dim: "\x1b[2m", b: "\x1b[1m", g: "\x1b[32m", y: "\x1b[33m", r: "\x1b[31m", x: "\x1b[0m" };

function readSafe(rel) {
  try { return readFileSync(join(ROOT, rel), "utf8"); } catch { return null; }
}

function section(md, heading) {
  if (!md) return null;
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

function qaCount(md, label) {
  if (!md) return null;
  const m = md.match(new RegExp(`\\|\\s*${label}\\s*\\|\\s*(\\d+)\\s*\\|`));
  return m ? Number(m[1]) : null;
}

const status = readSafe("docs/ops/current-loop-status.md");
const qa = readSafe("docs/qa/live-qa-report.md");

const phase = section(status, "Current loop phase");
const health = section(status, "Last health result");
const top = section(status, "Current top issue");
const next = section(status, "Next Claude task");

const crit = qaCount(qa, "🔴 critical");
const warn = qaCount(qa, "🟠 warning");
const info = qaCount(qa, "🔵 info");
const gen = qa && qa.match(/Generated:\s*([^\n·]+?)\s*·\s*Events:\s*(\d+)\s*·\s*Product findings:\s*(\d+)/);

const trunc = (s, n) => (!s ? "—" : s.length > n ? s.slice(0, n - 1) + "…" : s);

console.log(`\n${C.b}RC Ops Status${C.x} ${C.dim}(read-only snapshot — run 'npm run health' for the real gate)${C.x}\n`);
console.log(`  ${C.b}Phase${C.x}        ${trunc(phase, 76)}`);
console.log(`  ${C.b}Last health${C.x}  ${trunc(health, 76)}`);
if (qa) {
  const cc = crit ? C.r : C.g;
  console.log(`  ${C.b}Indicator QA${C.x} ${cc}${crit ?? "?"} crit${C.x} · ${C.y}${warn ?? "?"} warn${C.x} · ${info ?? "?"} info` +
    (gen ? `  ${C.dim}(${gen[2]} events · ${gen[3]} product findings)${C.x}` : ""));
} else {
  console.log(`  ${C.b}Indicator QA${C.x} ${C.y}not generated yet — run 'npm run qa:rc'${C.x}`);
}
console.log(`  ${C.b}Top issue${C.x}    ${trunc(top, 76)}`);
console.log(`  ${C.b}Next task${C.x}    ${trunc(next, 76)}`);

// Safe-to-edit verdict
let verdict;
if (crit === null) {
  verdict = `${C.y}UNKNOWN${C.x} — QA report missing. Run: npm run health && npm run qa:rc`;
} else if (crit > 0) {
  verdict = `${C.r}CAUTION${C.x} — ${crit} product critical(s). Review docs/qa/live-qa-report.md before editing.`;
} else {
  verdict = `${C.g}LIKELY YES${C.x} — 0 product criticals. Confirm 'npm run health' is green, then continue.`;
}
console.log(`\n  ${C.b}Safe to continue editing?${C.x}  ${verdict}`);
console.log(`\n  ${C.dim}Reports: docs/qa/live-qa-report.md · docs/ops/current-loop-status.md · live console: /ops${C.x}\n`);

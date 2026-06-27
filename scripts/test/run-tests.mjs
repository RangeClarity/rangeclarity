#!/usr/bin/env node
/* RangeClarity local test gate — dependency-free (Node only). Guards the project's #1 risk:
   shipping false confidence / directive trade language. Two read-only checks:
     1) COPY GUARDRAIL — public user-facing pages must not use buy/sell/entry/exit/profit/prediction
        as DIRECTIVE language (un-negated, non-educational), and must contain no banned CTA phrases.
        Gated/experimental routes (designs except the live homepage, ops, command-center, linear-board,
        project-plan, variant-codex-section, range-command-premium) are excluded — they are not public.
     2) LABEL-SCHEMA GUARDRAIL — every founder_label in the review CSVs is one of the 5 allowed values.
   Changes no product behavior. Exits non-zero on any violation. */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const failures = [];
const fail = (m) => failures.push(m);

// ---------- check 1: copy guardrail (PUBLIC pages only) ----------
const BANNED_WORDS = ["buy", "sell", "entry", "exit", "profit", "prediction", "predict"];
const BANNED_PHRASES = ["buy now", "sell now", "guaranteed profit", "guaranteed return", "get rich"];
const NEG = /\b(no|not|never|without|neither|none|cannot|don't|doesn't|isn't|aren't|won't|does not|do not|educational|disclaimer|instead of)\b|≠/;

// exclude gated/internal/experimental; keep the live homepage (fox-brand-v1) + its lower sections
function isPublic(rel) {
  rel = rel.replace(/\\/g, "/");
  const block = ["/ops/", "/command-center/", "/linear-board/", "/project-plan/",
    "/variant-codex-section/", "/range-command-premium/"];
  if (block.some((b) => rel.includes(b))) return false;
  if (rel.includes("/designs/")) {
    return rel.includes("/designs/rangeclarity-fox-brand-v1/")
      || rel.endsWith("/premium-hero-range-command-v2/RangeCommandV2LowerSections.tsx");
  }
  return true;
}
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (![".next", "node_modules"].includes(e.name)) walk(p, out); }
    else if (e.name.endsWith(".tsx")) out.push(p);
  }
  return out;
}
function copyGuardrail() {
  const files = walk(path.join(ROOT, "app")).filter((f) => isPublic(path.relative(ROOT, f)));
  let scanned = 0, hits = 0;
  for (const f of files) {
    const raw = fs.readFileSync(f, "utf8");
    const text = raw.replace(/<[^>]+>/g, " ");      // strip JSX tags -> visible-ish text
    const low = text.toLowerCase();
    scanned++;
    for (const ph of BANNED_PHRASES) if (low.includes(ph)) { fail(`COPY: banned CTA phrase "${ph}" in ${path.relative(ROOT, f)}`); hits++; }
    for (const w of BANNED_WORDS) {
      const re = new RegExp(`\\b${w}\\b`, "gi");
      let m;
      while ((m = re.exec(text))) {
        const win = low.slice(Math.max(0, m.index - 160), m.index + 160);
        if (!NEG.test(win)) {
          fail(`COPY: directive "${w}" in ${path.relative(ROOT, f)}: …${text.slice(Math.max(0, m.index - 45), m.index + 25).replace(/\s+/g, " ").trim()}…`);
          hits++;
        }
      }
    }
  }
  console.log(`  [copy] scanned ${scanned} public app/*.tsx files — ${hits} violation(s)`);
}

// ---------- check 2: label-schema guardrail ----------
const ALLOWED = new Set(["true_broken", "stale_zone_false_cap", "normal_pullback_false_cap", "genuinely_unclear", "unsure"]);
function splitCsv(line) { const o = []; let c = "", q = false; for (let i = 0; i < line.length; i++) { const ch = line[i]; if (ch === '"') { if (q && line[i + 1] === '"') { c += '"'; i++; } else q = !q; } else if (ch === "," && !q) { o.push(c); c = ""; } else c += ch; } o.push(c); return o; }
function labelGuardrail() {
  const files = ["founder_labels_template.csv", "founder_review_priority.csv", "agent_label_suggestions.csv"]
    .map((n) => `research/reports/visual_review/${n}`);
  let checked = 0;
  for (const rel of files) {
    const p = path.join(ROOT, rel); if (!fs.existsSync(p)) continue;
    const lines = fs.readFileSync(p, "utf8").split(/\r?\n/).filter((l) => l.length);
    const li = lines[0].split(",").indexOf("founder_label");
    if (li < 0) { fail(`LABEL: ${rel} missing founder_label column`); continue; }
    for (const l of lines.slice(1)) { const v = (splitCsv(l)[li] || "").trim(); if (v) { checked++; if (!ALLOWED.has(v)) fail(`LABEL: invalid founder_label "${v}" in ${rel}`); } }
  }
  console.log(`  [label] checked ${checked} non-empty founder_label value(s) against the 5 allowed`);
}

console.log("RangeClarity test gate:");
copyGuardrail();
labelGuardrail();
if (failures.length) { console.error(`\nFAIL — ${failures.length} violation(s):`); failures.forEach((f) => console.error("  - " + f)); process.exit(1); }
console.log("\nPASS — no directive signal copy on public pages; all founder labels valid.");

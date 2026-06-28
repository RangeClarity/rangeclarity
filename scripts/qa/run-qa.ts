// RangeClarity Live QA — offline runner. Reads fixtures, applies rules,
// writes findings.jsonl + the Markdown report. Internal QA only.
import * as fs from "node:fs";
import * as path from "node:path";
import type { RcLiveQaEvent } from "../../lib/qa/schema";
import { runRules } from "../../lib/qa/rules";
import { renderReport, isSelfTest } from "../../lib/qa/report";

const ROOT = process.cwd();
const FIXTURE = path.join(ROOT, "data/qa/fixtures/sample-events.jsonl");
const FINDINGS = path.join(ROOT, "data/qa/findings.jsonl");
const REPORT = path.join(ROOT, "docs/qa/live-qa-report.md");

function readEvents(file: string): RcLiveQaEvent[] {
  const raw = fs.readFileSync(file, "utf8");
  const out: RcLiveQaEvent[] = [];
  raw.split("\n").map((l) => l.trim()).filter(Boolean).forEach((line, i) => {
    try { out.push(JSON.parse(line) as RcLiveQaEvent); }
    catch { throw new Error(`Invalid JSONL on line ${i + 1} of ${path.relative(ROOT, file)}`); }
  });
  return out;
}

function main(): void {
  const events = readEvents(FIXTURE);
  const findings = runRules(events);

  fs.mkdirSync(path.dirname(FINDINGS), { recursive: true });
  fs.writeFileSync(FINDINGS, findings.map((f) => JSON.stringify(f)).join("\n") + (findings.length ? "\n" : ""), "utf8");

  fs.mkdirSync(path.dirname(REPORT), { recursive: true });
  fs.writeFileSync(REPORT, renderReport(findings, { events: events.length, generatedAt: new Date().toISOString() }), "utf8");

  const product = findings.filter((f) => !isSelfTest(f));
  const selftest = findings.filter(isSelfTest);
  const sevOf = (list: typeof findings) => {
    const bySev: Record<string, number> = {};
    for (const f of list) bySev[f.severity] = (bySev[f.severity] ?? 0) + 1;
    return JSON.stringify(bySev);
  };
  console.log(`[qa] ${events.length} events -> ${findings.length} findings`);
  console.log(`[qa] product   (${product.length}) severity: ${sevOf(product)}`);
  console.log(`[qa] self-test (${selftest.length}) severity: ${sevOf(selftest)}`);
  if (selftest.length === 0) {
    console.warn("[qa] WARNING: negative-control self-test did not fire — a scanner rule may be weakened.");
  }
  console.log(`[qa] findings -> ${path.relative(ROOT, FINDINGS)}`);
  console.log(`[qa] report   -> ${path.relative(ROOT, REPORT)}`);
}

main();

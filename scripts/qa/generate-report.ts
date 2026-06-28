// RangeClarity Live QA — regenerate the Markdown report from findings.jsonl.
import * as fs from "node:fs";
import * as path from "node:path";
import type { Finding } from "../../lib/qa/schema";
import { renderReport } from "../../lib/qa/report";

const ROOT = process.cwd();
const FINDINGS = path.join(ROOT, "data/qa/findings.jsonl");
const REPORT = path.join(ROOT, "docs/qa/live-qa-report.md");

if (!fs.existsSync(FINDINGS)) {
  console.error(`[qa] ${path.relative(ROOT, FINDINGS)} not found — run \`npm run qa:rc\` first.`);
  process.exit(1);
}
const findings: Finding[] = fs.readFileSync(FINDINGS, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l) as Finding);
fs.writeFileSync(REPORT, renderReport(findings, { events: findings.length, generatedAt: new Date().toISOString() }), "utf8");
console.log(`[qa] report regenerated from ${findings.length} findings -> ${path.relative(ROOT, REPORT)}`);

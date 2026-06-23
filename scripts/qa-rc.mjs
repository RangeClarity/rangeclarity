import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const reportPath = resolve("docs/qa/live-qa-report.md");

if (!existsSync(reportPath)) {
  console.error("RC QA gate failed: docs/qa/live-qa-report.md is missing.");
  console.error("Create the Live QA report scaffold or run the real QA report generator before health can pass.");
  process.exit(1);
}

const report = readFileSync(reportPath, "utf8").trim();

if (report.length < 40) {
  console.error("RC QA gate failed: docs/qa/live-qa-report.md is too small to be useful.");
  process.exit(1);
}

console.log("RC QA gate passed: docs/qa/live-qa-report.md exists.");

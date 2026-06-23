import type { Metadata } from "next";
import { readDoc, readPrompt, docSection, fileMeta, readQaSummary, listChecklist, readRoadmap } from "@/lib/ops/opsData";
import CommandCenter from "./CommandCenter";

/* Internal founder Command Center. Server component: reads file-based docs at request
   time (read-only) and hands the data to the interactive client component. No execution,
   no network, no writes. robots:noindex — internal only, do not deploy publicly. */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "RangeClarity Command Center",
  description: "Internal founder workbench.",
  robots: { index: false, follow: false },
};

export default function CommandCenterPage() {
  const status = readDoc("docs/ops/current-loop-status.md");
  const qa = readQaSummary();
  const decisions = listChecklist(readDoc("docs/ops/founder-decision-queue.md"));
  const roadmap = readRoadmap();

  const reports = [
    { title: "Live QA Report", file: "docs/qa/live-qa-report.md" },
    { title: "QA Findings (jsonl)", file: "data/qa/findings.jsonl" },
    { title: "Current Loop Status", file: "docs/ops/current-loop-status.md" },
    { title: "RC Ops Brain", file: "docs/ops/rc-ops-brain.md" },
    { title: "Founder Decision Queue", file: "docs/ops/founder-decision-queue.md" },
  ].map((r) => ({ ...r, ...fileMeta(r.file) }));

  const state = {
    repo: "C:\\Users\\USER\\Claude\\Projects\\RangeClarity",
    phase: docSection(status, "Current loop phase", 1) ?? "",
    lastHealth: docSection(status, "Last health result", 1) ?? "",
    topIssue: docSection(status, "Current top issue", 1) ?? "",
    nextAction: docSection(status, "Next Claude task", 2) ?? "",
    blocked: docSection(status, "Founder decision needed", 2) ?? "",
    lastUpdated: (status?.match(/_Last updated:\s*([^_\n]+)_/)?.[1] ?? "").trim(),
  };

  const prompts = {
    codexCritic: readPrompt("prompts/codex-daily-critic.md"),
    claudeFix: readPrompt("prompts/claude-fix-one-issue.md"),
    websiteQa: readPrompt("prompts/website-mobile-qa.md"),
    deepResearch: readPrompt("prompts/deep-research-weekly.md"),
  };

  return <CommandCenter state={state} qa={qa} roadmap={roadmap} decisions={decisions} reports={reports} prompts={prompts} />;
}

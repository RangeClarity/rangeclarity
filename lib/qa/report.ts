import { type Finding, type Severity, type Category, SCHEMA_VERSION } from "./schema";

const SEV_ORDER: Severity[] = ["critical", "warning", "info"];
const SEV_ICON: Record<Severity, string> = { critical: "🔴", warning: "🟠", info: "🔵" };

export interface ReportMeta { events: number; generatedAt: string; }

// QA self-test ("negative control") events deliberately trip a rule to prove the
// scanner still fires. They are NOT product output, so they are reported in their
// own section and kept out of the product summary. Convention: symbol prefix.
const SELFTEST_PREFIX = "SELFTEST";
export function isSelfTest(f: Finding): boolean {
  return f.symbol.toUpperCase().startsWith(SELFTEST_PREFIX);
}

function severityTable(findings: Finding[], lines: string[]): void {
  lines.push("| Severity | Count |");
  lines.push("|---|---|");
  for (const s of SEV_ORDER) lines.push(`| ${SEV_ICON[s]} ${s} | ${findings.filter((f) => f.severity === s).length} |`);
  lines.push("");
}

function categoryTable(findings: Finding[], lines: string[]): void {
  const cats = Array.from(new Set(findings.map((f) => f.category))).sort() as Category[];
  if (cats.length === 0) return;
  lines.push("| Category | Count |");
  lines.push("|---|---|");
  for (const c of cats) lines.push(`| ${c} | ${findings.filter((f) => f.category === c).length} |`);
  lines.push("");
}

function findingLines(f: Finding, lines: string[]): void {
  lines.push(`- **[${f.category}] ${f.symbol} ${f.timeframe}** — ${f.message}`);
  lines.push(`  - fix: ${f.suggested_fix}`);
  lines.push(`  - rule: \`${f.rule}\` · event: \`${f.source_event_id ?? f.bar_time ?? "-"}\``);
}

export function renderReport(findings: Finding[], meta: ReportMeta): string {
  const product = findings.filter((f) => !isSelfTest(f));
  const selftest = findings.filter(isSelfTest);

  const lines: string[] = [];
  lines.push("# RangeClarity — Live QA Report");
  lines.push("");
  lines.push("> Internal indicator-quality report (`" + SCHEMA_VERSION + "`). Reviews structure/clarity only — **never** buy/sell/entry/exit advice. Offline MVP (fixtures).");
  lines.push("");
  lines.push(
    `Generated: ${meta.generatedAt} · Events: ${meta.events} · ` +
    `Product findings: ${product.length} · QA self-test findings: ${selftest.length}`,
  );
  lines.push("");

  // -- Product findings (the real signal for daily review) -------------------
  lines.push("## Product Findings");
  lines.push("");
  lines.push("Findings from real product fixtures. **This is the daily-review signal.**");
  lines.push("");
  severityTable(product, lines);
  categoryTable(product, lines);

  if (product.length === 0) {
    lines.push("✅ No product findings — all product events passed the deterministic QA rules.");
    lines.push("");
  } else {
    for (const s of SEV_ORDER) {
      const group = product.filter((f) => f.severity === s);
      if (group.length === 0) continue;
      lines.push(`### ${SEV_ICON[s]} ${s[0].toUpperCase() + s.slice(1)} (${group.length})`);
      lines.push("");
      for (const f of group) findingLines(f, lines);
      lines.push("");
    }
  }

  // -- QA self-test (negative controls) --------------------------------------
  lines.push("---");
  lines.push("");
  lines.push("## QA Self-Test (negative controls)");
  lines.push("");
  lines.push(
    "> Intentional internal test events (symbol prefix `SELFTEST`) that **must** trip a rule. " +
    "They prove the QA scanner still fires — they are **not** product output and do **not** indicate a product issue.",
  );
  lines.push("");
  if (selftest.length === 0) {
    lines.push(
      "⚠️ **Negative control did not fire.** No self-test findings were produced. " +
      "Either the self-test fixture was removed or a scanner rule has been weakened — investigate before trusting a clean product report.",
    );
    lines.push("");
  } else {
    lines.push(`✅ Scanner fired on ${selftest.length} expected self-test case(s):`);
    lines.push("");
    for (const f of selftest) findingLines(f, lines);
    lines.push("");
  }

  return lines.join("\n");
}

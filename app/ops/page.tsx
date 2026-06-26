import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import styles from "./ops.module.css";
import { CopyButton } from "./CopyButton";
import { notFound } from "next/navigation";

/* RC Ops Console — internal, read-only operating dashboard.
   Server component: reads repo files at request time and renders status, agent
   prompts, copyable commands, output links, the workflow map and decision queue.
   It NEVER executes shell commands and NEVER runs Codex/Claude. Copy-only. */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "RC Ops Console",
  description: "Internal RangeClarity operating dashboard.",
  robots: { index: false, follow: false },
};

const ROOT = process.cwd();

function readSafe(rel: string): string | null {
  try {
    return fs.readFileSync(path.join(ROOT, rel), "utf8");
  } catch {
    return null;
  }
}

function fileMeta(rel: string): { exists: boolean; mtime: string | null } {
  try {
    const s = fs.statSync(path.join(ROOT, rel));
    return { exists: true, mtime: s.mtime.toISOString().slice(0, 16).replace("T", " ") + "Z" };
  } catch {
    return { exists: false, mtime: null };
  }
}

function clean(s: string | null): string | null {
  if (!s) return s;
  return s.replace(/\*\*/g, "").replace(/[`_]/g, "").replace(/^[-•]\s*/, "").trim();
}

function truncate(s: string | null, n: number): string {
  if (!s) return "—";
  return s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s;
}

/** First paragraph under a "## Heading" in a markdown file. */
function sectionText(md: string | null, heading: string, maxLines = 3): string | null {
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
  return out.length ? clean(out.join(" ")) : null;
}

function qaCount(md: string | null, label: string): number | null {
  if (!md) return null;
  const m = md.match(new RegExp(`\\|\\s*${label}\\s*\\|\\s*(\\d+)\\s*\\|`));
  return m ? parseInt(m[1], 10) : null;
}

function healthBadge(text: string | null): { label: string; cls: string } {
  if (!text) return { label: "unknown", cls: styles.pillIdle };
  const t = text.toLowerCase();
  if (/\bgreen\b|\bpass(ed|ing)?\b|all green/.test(t)) return { label: "green", cls: styles.pillOk };
  if (/\bred\b|\bfail(ed|ing)?\b|\berror\b/.test(t)) return { label: "red", cls: styles.pillCrit };
  if (/not |⚠|unverified|must be|cannot/.test(t)) return { label: "unverified", cls: styles.pillWarn };
  return { label: "see status", cls: styles.pillIdle };
}

// ---- read sources ----
const statusMd = readSafe("docs/ops/current-loop-status.md");
const qaMd = readSafe("docs/qa/live-qa-report.md");

const phase = sectionText(statusMd, "Current loop phase", 2);
const lastHealth = sectionText(statusMd, "Last health result", 2);
const topIssue = sectionText(statusMd, "Current top issue", 2);
const nextAction = sectionText(statusMd, "Next Claude task", 3);
const lastUpdated = clean(statusMd?.match(/_Last updated:\s*([^_\n]+)_/)?.[1] ?? null);

const qaCritical = qaCount(qaMd, "🔴 critical");
const qaWarning = qaCount(qaMd, "🟠 warning");
const qaInfo = qaCount(qaMd, "🔵 info");
const qaGen = qaMd?.match(/Generated:\s*([^\n·]+?)\s*·\s*Events:\s*(\d+)\s*·\s*Product findings:\s*(\d+)/);
const health = healthBadge(lastHealth);

// ---- Ops Brain: the 5 loops (what to run, when, where output lands) ----
type Loop = { title: string; cadence: string; kind: "command" | "prompt"; run: string; purpose: string; when: string; output: string };
const LOOPS: Loop[] = [
  { title: "Daily Health", cadence: "Daily", kind: "command", run: "npm run health", purpose: "typecheck → lint → QA → build; is the project safe to edit?", when: "Start of each session", output: "terminal · docs/qa/live-qa-report.md" },
  { title: "Indicator QA", cadence: "Daily / on change", kind: "command", run: "npm run qa:rc", purpose: "Score indicator output; product findings vs self-test.", when: "After any indicator/fixture change", output: "docs/qa/live-qa-report.md · data/qa/findings.jsonl" },
  { title: "Website / Mobile QA", cadence: "On-demand", kind: "prompt", run: "prompts/website-mobile-qa.md", purpose: "Audit homepage + beta + free-access + mobile; findings + fix batch.", when: "Before shipping UI changes", output: "Findings list → one approved fix batch" },
  { title: "Codex Critic", cadence: "Daily / weekly", kind: "prompt", run: "prompts/codex-daily-critic.md", purpose: "Direction, eng risk, feature creep, next highest-leverage fix.", when: "When choosing what to do next", output: "A–G critique → one chosen issue" },
  { title: "Deep Research", cadence: "Weekly", kind: "prompt", run: "prompts/deep-research-weekly.md", purpose: "Competitors, marketplace, pricing, Pine specialists, positioning, channels.", when: "Weekly strategy block (not daily)", output: "Research brief → founder decisions" },
];

// ---- B. agents ----
type Agent = { title: string; file: string; tool: string; purpose: string; when: string; hint: string };
const AGENTS: Agent[] = [
  { title: "Codex Daily Critic", file: "prompts/codex-daily-critic.md", tool: "Codex", purpose: "Audit state and rank what matters; surface the one issue to fix.", when: "Each morning", hint: "Put the chosen issue → current-loop-status.md (Next Claude task)." },
  { title: "Claude Fix One Issue", file: "prompts/claude-fix-one-issue.md", tool: "Claude", purpose: "Implement exactly one approved issue, smallest useful change.", when: "After Dean approves one issue", hint: "Then re-run npm run health and review the diff." },
  { title: "Website / Mobile QA", file: "prompts/website-mobile-qa.md", tool: "Codex/Claude", purpose: "Audit homepage + beta flow at 390/430px; propose one safe batch.", when: "Web/mobile pass", hint: "Audit-only — no edits until you approve." },
  { title: "Indicator Core Upgrade", file: "prompts/indicator-core-upgrade.md", tool: "Claude", purpose: "Evolve the Pine engine one disciplined slice, QA-gated.", when: "Indicator work", hint: "No Pine edit until you approve the slice." },
  { title: "Feature Review", file: "prompts/codex-feature-review.md", tool: "Codex", purpose: "Pressure-test whether a feature should exist + smallest version.", when: "Before building anything new", hint: "Get the do-NOT-build list before any code." },
  { title: "Product Language QA", file: "prompts/product-language-qa.md", tool: "Codex/Claude", purpose: "Catch brand/signal wording drift; propose calm rewrites.", when: "Copy review", hint: "Pine wording flagged only, never edited here." },
  { title: "Release Readiness", file: "prompts/release-readiness.md", tool: "Codex", purpose: "Go / no-go check before charging the first beta users.", when: "Pre-release", hint: "Returns blockers + shortest path to Go." },
];

// ---- C. commands ----
const COMMANDS: { cmd: string; note: string }[] = [
  { cmd: "git status --short", note: "See what's dirty before changing anything" },
  { cmd: "npm run health", note: "typecheck → lint → qa:rc → build (the green/red gate)" },
  { cmd: "npm run ops:status", note: "Read-only status snapshot + safe-to-edit verdict" },
  { cmd: "npm run qa:rc", note: "Refresh the indicator QA report" },
  { cmd: "npm run rc:loop", note: "Print the loop + current status (read-only)" },
  { cmd: "npm run dev", note: "Run the app locally (incl. /ops)" },
  { cmd: "npm run build", note: "Production build check" },
];

// ---- D. output feed ----
const OUTPUTS: { title: string; file: string }[] = [
  { title: "Live QA Report", file: "docs/qa/live-qa-report.md" },
  { title: "Current Loop Status", file: "docs/ops/current-loop-status.md" },
  { title: "Staged Codex Prompt", file: "data/ops/latest-codex-review-prompt.md" },
  { title: "Staged Claude Fix Prompt", file: "data/ops/latest-claude-fix-prompt.md" },
  { title: "Kanban Board", file: "docs/kanban.md" },
  { title: "Master Action Plan", file: "docs/rangeclarity-master-action-plan.md" },
];

// ---- E. workflow ----
const FLOW: string[] = [
  "Shell health",
  "Codex critique",
  "Claude fixes one issue",
  "Shell verification",
  "Dean visual approval",
  "Update RC-MAP / Kanban",
];

// ---- F. decision queue ----
const DECISIONS: string[] = [
  "Approve the next fix?",
  "Ask Codex for a critique?",
  "Ask Claude to implement one issue?",
  "Run npm run health?",
  "Update RC-MAP / Kanban?",
  "Defer a proposed feature?",
];

// ---- G. do not touch ----
const DONT: string[] = [
  "No Pine edits unless explicitly approved",
  "No volume engine (volume stays 0% of RC Score)",
  "No feature expansion without a Feature Review",
  "No auto-commit / auto-push",
  "No broad redesign of the landing page",
  "No automated agent or shell execution from the browser",
];

function Pill({ label, cls }: { label: string; cls: string }) {
  return (
    <span className={`${styles.pill} ${cls}`}>
      <span className={styles.dot} aria-hidden="true" />
      {label}
    </span>
  );
}

export default function OpsConsolePage() {
  // Production gate: internal page. 404 unless explicitly enabled (see .env.example / docs/ops/command-center.md).
  if (process.env.RC_INTERNAL_PAGES_ENABLED !== "true") notFound();
  return (
    <main className={styles.wrap}>
      <div className={styles.inner}>
        {/* header */}
        <header className={styles.head}>
          <div>
            <h1 className={styles.title}>
              RC <span className={styles.g}>Ops Console</span> <span className={styles.muted}>v1</span>
            </h1>
            <p className={styles.subtitle}>internal · read-only · copy-only — nothing here runs commands or agents · <a href="/command-center" style={{ color: "var(--teal)", textDecoration: "none" }}>Command Center →</a> · <a href="/ops/neural-map" style={{ color: "var(--teal)", textDecoration: "none" }}>Neural Map →</a></p>
          </div>
          <div className={styles.headMeta}>
            status updated
            <br />
            {lastUpdated ?? "—"}
          </div>
        </header>

        {/* A. Today / Project Status */}
        <section className={styles.section} aria-label="Today and project status">
          <h2 className={styles.sectionLabel}><span className={styles.k}>A</span> Today / Project status</h2>
          <div className={styles.statStrip}>
            <div className={styles.tile} title={phase ?? undefined}>
              <div className={styles.tileLabel}>Current phase</div>
              <div className={styles.tileValue}>{truncate(phase, 70)}</div>
            </div>
            <div className={styles.tile} title={lastHealth ?? undefined}>
              <div className={styles.tileLabel}>Last health</div>
              <div className={styles.tileValue}><Pill label={health.label} cls={health.cls} /></div>
            </div>
            <div className={styles.tile} title={qaGen ? `Generated ${qaGen[1]} · ${qaGen[3]} product findings` : undefined}>
              <div className={styles.tileLabel}>Indicator QA</div>
              <div className={styles.metrics}>
                <span className={`${styles.metric} ${qaCritical ? styles.crit : styles.muted}`}>{qaCritical ?? "—"} crit</span>
                <span className={`${styles.metric} ${qaWarning ? styles.warn : styles.muted}`}>{qaWarning ?? "—"} warn</span>
                <span className={`${styles.metric} ${styles.muted}`}>{qaInfo ?? "—"} info</span>
              </div>
            </div>
            <div className={styles.tile}>
              <div className={styles.tileLabel}>QA events</div>
              <div className={styles.tileValue}>{qaGen ? `${qaGen[2]} events` : <span className={styles.muted}>not generated yet</span>}</div>
            </div>
          </div>
          <div className={styles.callout}>
            <div className={styles.calloutBox}>
              <div className={styles.calloutLabel}>Current top issue</div>
              <div className={styles.calloutText}>{topIssue ?? <span className={styles.muted}>not generated yet — run a Codex critique</span>}</div>
            </div>
            <div className={`${styles.calloutBox} ${styles.next}`}>
              <div className={styles.calloutLabel}>Next recommended action</div>
              <div className={styles.calloutText}>{nextAction ?? <span className={styles.muted}>not set — pick one issue from the critique</span>}</div>
            </div>
          </div>
        </section>

        {/* Ops Brain — the 5 loops (what to run, when, where output lands) */}
        <section className={styles.section} aria-label="Ops Brain loops">
          <h2 className={styles.sectionLabel}><span className={styles.k}>↻</span> Ops Brain — the 5 loops <span className={styles.muted}>· what to run, when, where it lands</span></h2>
          <div className={styles.grid}>
            {LOOPS.map((w) => {
              const content = w.kind === "prompt" ? readSafe(w.run) : null;
              return (
                <div key={w.title} className={`${styles.card} ${styles.agent}`}>
                  <div className={styles.agentHead}>
                    <h3 className={styles.cardTitle} style={{ margin: 0 }}>{w.title}</h3>
                    <span className={styles.agentTool}>{w.cadence}</span>
                  </div>
                  <p className={styles.agentPurpose}>{w.purpose}</p>
                  <div className={styles.agentMeta}><b>When:</b> {w.when}</div>
                  <div className={styles.agentMeta}><b>Output:</b> {w.output}</div>
                  <div className={styles.path}>{w.run}</div>
                  <div className={styles.agentRow}>
                    {w.kind === "command" ? (
                      <CopyButton text={w.run} label="Copy command" small />
                    ) : content ? (
                      <>
                        <CopyButton text={content} label="Copy prompt" small />
                        <CopyButton text={w.run} label="Copy path" small />
                      </>
                    ) : (
                      <span className={styles.warn}>prompt missing</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* B. Agent Control */}
        <section className={styles.section} aria-label="Agent control">
          <h2 className={styles.sectionLabel}><span className={styles.k}>B</span> Agent control</h2>
          <div className={styles.grid}>
            {AGENTS.map((a) => {
              const content = readSafe(a.file);
              return (
                <div key={a.file} className={`${styles.card} ${styles.agent}`}>
                  <div className={styles.agentHead}>
                    <h3 className={styles.cardTitle} style={{ margin: 0 }}>{a.title}</h3>
                    <span className={styles.agentTool}>{a.tool}</span>
                  </div>
                  <p className={styles.agentPurpose}>{a.purpose}</p>
                  <div className={styles.agentMeta}><b>When:</b> {a.when}</div>
                  <div className={styles.path}>{a.file}</div>
                  <p className={styles.agentHint}>{a.hint}</p>
                  <div className={styles.agentRow}>
                    {content ? (
                      <CopyButton text={content} label="Copy prompt" small />
                    ) : (
                      <span className={styles.warn}>prompt missing</span>
                    )}
                    <CopyButton text={a.file} label="Copy path" small />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* C & D side by side */}
        <div className={styles.grid2}>
          {/* C. Shell Command Center */}
          <section className={styles.section} aria-label="Shell command center">
            <h2 className={styles.sectionLabel}><span className={styles.k}>C</span> Shell command center <span className={styles.muted}>· copy only</span></h2>
            <div className={styles.cmdList}>
              {COMMANDS.map((c) => (
                <div key={c.cmd} className={styles.cmdRow}>
                  <div className={styles.cmdMain}>
                    <div className={styles.cmdText}>{c.cmd}</div>
                    <div className={styles.cmdNote}>{c.note}</div>
                  </div>
                  <CopyButton text={c.cmd} small />
                </div>
              ))}
            </div>
          </section>

          {/* D. Output Feed */}
          <section className={styles.section} aria-label="Output feed">
            <h2 className={styles.sectionLabel}><span className={styles.k}>D</span> Output feed</h2>
            <div className={styles.feed}>
              {OUTPUTS.map((o) => {
                const meta = fileMeta(o.file);
                return (
                  <div key={o.file} className={styles.feedRow}>
                    <div className={styles.feedMain}>
                      <div className={styles.feedTitle}>{o.title}</div>
                      <div className={styles.feedPath}>{o.file}</div>
                    </div>
                    <div className={styles.feedSide}>
                      {meta.exists ? (
                        <span className={`${styles.pill} ${styles.pillOk}`} title={meta.mtime ?? undefined}>ready</span>
                      ) : (
                        <span className={`${styles.pill} ${styles.pillWarn}`}>not yet</span>
                      )}
                      <CopyButton text={o.file} label="Copy path" small />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* E. Workflow Map */}
        <section className={styles.section} aria-label="Workflow map">
          <h2 className={styles.sectionLabel}><span className={styles.k}>E</span> Workflow map</h2>
          <div className={styles.flow}>
            {FLOW.map((step, i) => (
              <div key={step} className={styles.flowStep}>
                <div className={styles.flowNum}>{`STEP ${i + 1}`}</div>
                <div className={styles.flowText}><b>{step}</b></div>
              </div>
            ))}
          </div>
        </section>

        {/* F & G side by side */}
        <div className={styles.grid2}>
          <section className={styles.section} aria-label="Decision queue">
            <h2 className={styles.sectionLabel}><span className={styles.k}>F</span> Decision queue <span className={styles.muted}>· yours to make</span></h2>
            <div className={styles.card}>
              <ul className={styles.list}>
                {DECISIONS.map((d) => (
                  <li key={d}><span className={styles.mk} aria-hidden="true">▸</span>{d}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className={styles.section} aria-label="Do not touch now">
            <h2 className={styles.sectionLabel}><span className={styles.k}>G</span> Do not touch now</h2>
            <div className={`${styles.card} ${styles.dontCard}`}>
              <ul className={`${styles.list} ${styles.dont}`}>
                {DONT.map((d) => (
                  <li key={d}><span className={styles.mk} aria-hidden="true">✕</span>{d}</li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        <div className={styles.noteBar}>
          <b>Read-only console.</b> It copies prompts and commands to your clipboard — you run them and paste them yourself.
          It never executes shell commands and never runs Codex/Claude. Full notes: <span className={styles.path}>docs/ops/rc-ops-console.md</span>.
          Any future command-running is V2 only (whitelist · local-only · behind RC_OPS_ENABLE_COMMANDS · never git add/commit/push/reset).
        </div>
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";
import { CopyButton } from "../ops/CopyButton";
import styles from "./command-center.module.css";

/* Interactive founder workbench (V1). Local React state only — nothing is persisted,
   nothing is executed, no network. All data is read server-side and passed in as props. */

export interface CommandCenterProps {
  state: {
    repo: string;
    phase: string;
    lastHealth: string;
    topIssue: string;
    nextAction: string;
    blocked: string;
    lastUpdated: string;
  };
  qa: { critical: number | null; warning: number | null; info: number | null; events: number | null } | null;
  roadmap: { section: string; status: string; title: string; note: string }[];
  decisions: { done: boolean; text: string }[];
  reports: { title: string; file: string; exists: boolean; mtime: string | null }[];
  prompts: { codexCritic: string | null; claudeFix: string | null; websiteQa: string | null; deepResearch: string | null };
}

type Phase = "Planning" | "Build" | "QA" | "Commit" | "Research" | "Founder Review";
const PHASES: Phase[] = ["Planning", "Build", "QA", "Commit", "Research", "Founder Review"];
const WORKFLOW: Record<Phase, string[]> = {
  Planning: ["Ask Codex Daily Critic → pick exactly ONE issue", "Write the issue into current-loop-status.md (Next Claude task)", "Check founder-decision-queue.md"],
  Build: ["Ask Claude to fix the one approved issue (smallest change)", "npm run health", "Founder visual approval before moving on"],
  QA: ["npm run qa:rc", "Read live-qa-report.md (product findings only)", "npm run health"],
  Commit: ["Git Cleanup Plan: stage explicit paths (never git add -A)", "npm run health must be green first", "git commit manually — do NOT push"],
  Research: ["Run the Deep Research Weekly prompt", "Save brief → data/ops/research/<date>.md", "Move decisions → founder-decision-queue.md"],
  "Founder Review": ["Review founder-decision-queue.md", "Review live-qa-report.md + current-loop-status.md", "Approve the next single issue / decisions"],
};

type ActionKey = "health" | "ops" | "qa" | "codex" | "claudeFix" | "webqa" | "research" | "gitcleanup" | "lemon";
interface ActionDef {
  key: ActionKey;
  label: string;
  kind: "command" | "prompt" | "guide";
  body: string;
  promptKey?: keyof CommandCenterProps["prompts"];
  expected: string;
  safety: string;
  saveTo: string;
}

const GIT_CLEANUP = `cd C:\\Users\\USER\\Claude\\Projects\\RangeClarity
git status --short
npm run health                      # must be green first
git add path/one path/two           # explicit paths ONLY — never "git add -A"
git diff --cached --stat            # review exactly what is staged
git commit -m "<message>"           # do NOT push`;

const LEMON_NOTE = `# Lemon checkout is env-configured (see .env.example):
#   PAYMENT_PROVIDER=lemonsqueezy
#   LEMONSQUEEZY_API_KEY=...  LEMONSQUEEZY_STORE_ID=...  LEMONSQUEEZY_VARIANT_ID=...
# Update these in the CANONICAL repo's env / Vercel project settings.
# Never commit secrets. Verify in test mode — do NOT use a real card.`;

const ACTIONS: ActionDef[] = [
  { key: "health", label: "Run Health", kind: "command", body: "npm run health", expected: "typecheck → lint → qa:rc → build, all green.", safety: "Read-only check. If red, that red is today's first fix.", saveTo: "Terminal + docs/qa/live-qa-report.md" },
  { key: "ops", label: "Run Ops Status", kind: "command", body: "npm run ops:status", expected: "Phase / health / QA snapshot + safe-to-edit verdict.", safety: "Read-only file reads. Runs nothing else.", saveTo: "Terminal" },
  { key: "qa", label: "Run Indicator QA", kind: "command", body: "npm run qa:rc", expected: "Product findings vs self-test (target: 0 product criticals).", safety: "Do not edit Pine unless a change is explicitly approved.", saveTo: "docs/qa/live-qa-report.md · data/qa/findings.jsonl" },
  { key: "codex", label: "Ask Codex Daily Critic", kind: "prompt", promptKey: "codexCritic", body: "prompts/codex-daily-critic.md", expected: "A–G critique → the one issue to fix first.", safety: "Codex is a read-only critic. It proposes; you approve.", saveTo: "Chosen issue → docs/ops/current-loop-status.md" },
  { key: "claudeFix", label: "Ask Claude Fix One Issue", kind: "prompt", promptKey: "claudeFix", body: "prompts/claude-fix-one-issue.md", expected: "One smallest-change fix + npm run health + diff.", safety: "One issue only. No Pine unless approved. No commit/push.", saveTo: "Diff in chat → update docs/kanban.md" },
  { key: "webqa", label: "Website / Mobile QA", kind: "prompt", promptKey: "websiteQa", body: "prompts/website-mobile-qa.md", expected: "Findings (severity / file / fix) → one safe fix batch.", safety: "Audit only. Approve the batch before any edit.", saveTo: "Findings in chat → pick one batch" },
  { key: "research", label: "Deep Research Weekly", kind: "prompt", promptKey: "deepResearch", body: "prompts/deep-research-weekly.md", expected: "Competitors / pricing / positioning / channels brief.", safety: "Weekly, not daily. No API wired. Cite sources.", saveTo: "data/ops/research/<date>-<topic>.md" },
  { key: "gitcleanup", label: "Git Cleanup Plan", kind: "guide", body: GIT_CLEANUP, expected: "A reviewed, scoped staging — then a manual commit.", safety: "NEVER git add -A. NEVER push from OneDrive. Canonical repo only.", saveTo: "Local git (manual). Do NOT push." },
  { key: "lemon", label: "Update Lemon Links", kind: "guide", body: LEMON_NOTE, expected: "Checkout points to the current live links.", safety: "No real card for test purchases. Never commit secrets.", saveTo: "env / Vercel (LEMONSQUEEZY_* — not committed)" },
];

function healthPill(text: string): { label: string; cls: string } {
  const t = (text || "").toLowerCase();
  if (/\bgreen\b|\bpass/.test(t)) return { label: "green", cls: styles.ok };
  if (/\bred\b|\bfail|\berror\b/.test(t)) return { label: "red", cls: styles.crit };
  if (/not |⚠|unverified|must be|cannot/.test(t)) return { label: "unverified", cls: styles.warn };
  return { label: "see status", cls: styles.muted };
}

function roadmapChip(status: string): string {
  if (status === "done" || status === "live") return styles.ok;
  if (status === "next" || status === "in-progress") return styles.rmNext;
  if (status === "blocked") return styles.crit;
  if (status === "todo") return styles.muted;
  return styles.warn; // review · config · specced
}

export default function CommandCenter({ state, qa, roadmap, decisions, reports, prompts }: CommandCenterProps) {
  const [phase, setPhase] = useState<Phase>("Build");
  const [actionKey, setActionKey] = useState<ActionKey>("health");

  const action = ACTIONS.find((a) => a.key === actionKey) ?? ACTIONS[0];
  const copyText = action.kind === "prompt" ? prompts[action.promptKey!] ?? `(prompt file not found: ${action.body})` : action.body;
  const promptMissing = action.kind === "prompt" && !prompts[action.promptKey!];
  const hp = healthPill(state.lastHealth);
  const sections = Array.from(new Set(roadmap.map((r) => r.section)));

  const DAILY = [
    "cd C:\\Users\\USER\\Claude\\Projects\\RangeClarity",
    "git status --short",
    "npm run health",
    "npm run ops:status",
    "npm run qa:rc",
  ];

  return (
    <main className={styles.wrap}>
      <div className={styles.inner}>
        <header className={styles.head}>
          <div>
            <h1 className={styles.title}>RangeClarity <span className={styles.g}>Command Center</span> <span className={styles.muted}>v1</span></h1>
            <p className={styles.subtitle}>internal founder workbench · read-only · copy-only — the UI never runs commands · <a className={styles.opsLink} href="/ops">/ops →</a></p>
          </div>
          <span className={`${styles.pill} ${hp.cls}`}>health: {hp.label}</span>
        </header>

        <div className={styles.warnBanner}>
          ⚠ Internal control panel — no auth yet. Do not deploy this route publicly. Nothing here executes shell, calls APIs, or mutates git.
        </div>

        <div className={styles.grid2}>
          {/* 1. Project State */}
          <section className={styles.panel} aria-label="Project state">
            <h2 className={styles.panelTitle}><span className={styles.n}>1</span> Project state</h2>
            <dl className={styles.kv}>
              <dt>Canonical repo</dt><dd className={styles.path}>{state.repo}</dd>
              <dt>Phase</dt><dd>{state.phase || "—"}</dd>
              <dt>Last health</dt><dd><span className={`${styles.pill} ${hp.cls}`}>{hp.label}</span></dd>
              <dt>Latest QA</dt><dd>{qa ? (
                <span>
                  <span className={`${styles.metric} ${qa.critical ? styles.crit : styles.muted}`}>{qa.critical ?? "—"} crit</span>{" · "}
                  <span className={`${styles.metric} ${qa.warning ? styles.warn : styles.muted}`}>{qa.warning ?? "—"} warn</span>{" · "}
                  <span className={styles.muted}>{qa.info ?? "—"} info{qa.events != null ? ` (${qa.events} events)` : ""}</span>
                </span>
              ) : <span className={styles.muted}>not generated — run npm run qa:rc</span>}</dd>
              <dt>Top issue</dt><dd>{state.topIssue || <span className={styles.muted}>—</span>}</dd>
              <dt>Next action</dt><dd>{state.nextAction || <span className={styles.muted}>—</span>}</dd>
              <dt>Blocked</dt><dd>{state.blocked || <span className={styles.muted}>nothing blocking</span>}</dd>
            </dl>
          </section>

          {/* 2. Project Memory */}
          <section className={styles.panel} aria-label="Project memory">
            <h2 className={styles.panelTitle}><span className={styles.n}>2</span> Project memory</h2>
            <p className={styles.tagline}>Simple chart. Complex engine.<br />No signals. No noise. Just structure.<br />Clarity over noise.</p>
            <ul className={styles.bullets} style={{ marginTop: "0.6rem" }}>
              <li className={styles.price}><span className={styles.mk}>$</span><span>RangeClarity <b>Beta — $29/mo</b> · Pro Beta <b>— $49/mo</b></span></li>
              <li><span className={styles.mk}>✓</span><span>Allowed: structure · clarity · range · location · zones · quality · extension · context</span></li>
              <li className={styles.bad}><span className={styles.mk}>✕</span><span>Forbidden: buy/sell, entry/exit, wait, prediction, win-rate, profit, financial advice</span></li>
              <li><span className={styles.mk}>▸</span><span>Pine / TradingView indicator first; website supports beta access + onboarding</span></li>
            </ul>
            <p className={styles.feedPath} style={{ marginTop: "0.5rem" }}>source: docs/ops/project-memory.md</p>
          </section>
        </div>

        {/* 9. Product Core Roadmap */}
        <section className={styles.panel} aria-label="Product core roadmap">
          <h2 className={styles.panelTitle}><span className={styles.n}>9</span> Product core roadmap</h2>
          {roadmap.length ? sections.map((sec) => (
            <div key={sec} className={styles.rmGroup}>
              <div className={styles.rmSection}>{sec}</div>
              <ul className={styles.list}>
                {roadmap.filter((r) => r.section === sec).map((it) => (
                  <li key={it.title} className={styles.rmItem}>
                    <span className={`${styles.pill} ${roadmapChip(it.status)}`}>{it.status}</span>
                    <span><b className={styles.rmTitle}>{it.title}</b>{it.note ? <span className={styles.rmNote}> — {it.note}</span> : null}</span>
                  </li>
                ))}
              </ul>
            </div>
          )) : <p className={styles.muted}>roadmap not found — docs/ops/product-roadmap.md</p>}
          <p className={styles.feedPath} style={{ marginTop: "0.4rem" }}>source: docs/ops/product-roadmap.md</p>
        </section>

        {/* 3 + 4. Interactive: phase + next action */}
        <section className={styles.panel} aria-label="Phase and next action">
          <h2 className={styles.panelTitle}><span className={styles.n}>3</span> Phase &amp; recommended workflow</h2>
          <div className={styles.seg} role="group" aria-label="Select phase">
            {PHASES.map((p) => (
              <button key={p} type="button" className={`${styles.segBtn} ${phase === p ? styles.segOn : ""}`} aria-pressed={phase === p} onClick={() => setPhase(p)}>{p}</button>
            ))}
          </div>
          <ol className={styles.steps}>
            {WORKFLOW[phase].map((s, i) => (
              <li key={s}><span className={styles.num}>{i + 1}.</span><span>{s}</span></li>
            ))}
          </ol>

          <h2 className={styles.panelTitle} style={{ marginTop: "1.1rem" }}><span className={styles.n}>4</span> Next action</h2>
          <label htmlFor="cc-action" className={styles.feedPath}>Pick what to do next:</label>
          <select id="cc-action" className={styles.select} value={actionKey} onChange={(e) => setActionKey(e.target.value as ActionKey)}>
            {ACTIONS.map((a) => <option key={a.key} value={a.key}>{a.label}</option>)}
          </select>
          <div className={styles.detail}>
            <div className={styles.copyRow}>
              <span className={styles.kindTag}>{action.kind}</span>
              <CopyButton text={copyText} label={action.kind === "prompt" ? "Copy prompt" : "Copy command"} small />
              {promptMissing && <span className={styles.warn}>prompt file missing</span>}
            </div>
            <code className={styles.code}>{action.kind === "prompt" ? (promptMissing ? copyText : `# paste into Codex/Claude — from ${action.body}\n\n${(copyText || "").slice(0, 600)}${(copyText || "").length > 600 ? "\n…(copy for full prompt)" : ""}`) : copyText}</code>
            <div className={styles.detailRow} style={{ marginTop: "0.55rem" }}><span className={styles.lab}>Expect</span><span>{action.expected}</span></div>
            <div className={styles.detailRow}><span className={styles.lab}>Safety</span><span className={styles.safe}>{action.safety}</span></div>
            <div className={styles.detailRow}><span className={styles.lab}>Save to</span><span className={styles.path}>{action.saveTo}</span></div>
          </div>
        </section>

        {/* 5. Daily routine */}
        <section className={styles.panel} aria-label="Daily routine">
          <h2 className={styles.panelTitle}><span className={styles.n}>5</span> Daily routine</h2>
          <div className={styles.cmdList}>
            {DAILY.map((c) => (
              <div key={c} className={styles.cmdRow}>
                <span className={styles.cmdText}>{c}</span>
                <CopyButton text={c} small />
              </div>
            ))}
          </div>
        </section>

        <div className={styles.grid2}>
          {/* 6. Reports */}
          <section className={styles.panel} aria-label="Reports">
            <h2 className={styles.panelTitle}><span className={styles.n}>6</span> Reports</h2>
            <ul className={`${styles.list} ${styles.reports}`}>
              {reports.map((r) => (
                <li key={r.file}>
                  <span className={styles.mk} aria-hidden="true">▸</span>
                  <span>
                    {r.title}
                    <br /><span className={styles.feedPath}>{r.file}</span>
                  </span>
                  <span style={{ marginLeft: "auto" }} className={`${styles.pill} ${r.exists ? styles.ok : styles.warn}`}>{r.exists ? "ready" : "not yet"}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 7. Decision queue */}
          <section className={styles.panel} aria-label="Founder decision queue">
            <h2 className={styles.panelTitle}><span className={styles.n}>7</span> Founder decision queue</h2>
            <ul className={`${styles.list} ${styles.decide}`}>
              {decisions.length ? decisions.map((d, i) => (
                <li key={i}><span className={styles.mk} aria-hidden="true">{d.done ? "✓" : "▢"}</span><span>{d.text}</span></li>
              )) : <li><span className={styles.muted}>No decisions queued — see docs/ops/founder-decision-queue.md</span></li>}
            </ul>
            <p className={styles.feedPath} style={{ marginTop: "0.5rem" }}>source: docs/ops/founder-decision-queue.md</p>
          </section>
        </div>

        {/* 8. Safety */}
        <section className={`${styles.panel} ${styles.safety}`} aria-label="Safety panel">
          <h2 className={styles.panelTitle}><span className={styles.n}>8</span> Safety</h2>
          <ul className={`${styles.list} ${styles.safety}`}>
            {[
              "Do not git add -A — stage explicit paths only",
              "Do not push from the OneDrive checkout",
              "Do not expose Linear issue data publicly",
              "Do not add trading-signal / directive wording",
              "Do not touch Pine logic during web / ops work",
              "Do not use a real card for Lemon test purchases",
            ].map((s) => <li key={s}><span className={styles.mk} aria-hidden="true">✕</span><span>{s}</span></li>)}
          </ul>
        </section>

        <p className={styles.note}>
          Read-only workbench. Selectors use local React state (not persisted); copy buttons use the clipboard.
          Nothing here executes shell, calls external services, writes to Linear, or mutates git. Last status update: {state.lastUpdated || "—"}.
        </p>
      </div>
    </main>
  );
}

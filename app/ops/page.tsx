import type { Metadata } from "next";
import { notFound } from "next/navigation";
import styles from "./ops.module.css";

type ModuleStatus =
  | "active"
  | "doing"
  | "next"
  | "planned"
  | "later"
  | "parked"
  | "missing";

type SystemModule = {
  name: string;
  status: ModuleStatus;
  owner: string;
  priority: number;
  action: string;
  automation: "manual" | "assistable" | "automatable later" | "automatable now";
};

type Automation = {
  name: string;
  trigger: string;
  input: string;
  output: string;
  worthDoingNow: "now" | "later";
  priority: "high" | "medium" | "low";
};

type RoadmapBucket = {
  title: string;
  items: string[];
};

type Command = {
  label: string;
  command: string;
  state: "available" | "planned" | "document";
  note: string;
};

const modules: SystemModule[] = [
  {
    name: "RC-MAP",
    status: "active",
    owner: "Dean + Codex",
    priority: 96,
    action: "Use as source of truth before any critique or build.",
    automation: "assistable",
  },
  {
    name: "Kanban",
    status: "active",
    owner: "Dean + Claude",
    priority: 88,
    action: "Keep current work cards aligned with RC-MAP.",
    automation: "assistable",
  },
  {
    name: "Pine Indicator Core V2",
    status: "next",
    owner: "Claude + Pine specialist",
    priority: 94,
    action: "Lock spec before Pine edits.",
    automation: "manual",
  },
  {
    name: "Location Quality Kernel",
    status: "next",
    owner: "Claude + Pine specialist",
    priority: 92,
    action: "Define distance, range position, and extension states.",
    automation: "assistable",
  },
  {
    name: "Zone Quality",
    status: "next",
    owner: "Claude + Pine specialist",
    priority: 93,
    action: "Grade freshness, touch count, spacing, and stale levels.",
    automation: "assistable",
  },
  {
    name: "Extension",
    status: "next",
    owner: "Claude",
    priority: 82,
    action: "Describe stretch without advice language.",
    automation: "assistable",
  },
  {
    name: "Structure Change",
    status: "planned",
    owner: "Codex + Claude",
    priority: 86,
    action: "Keep V1 quiet: only meaningful confirmed changes.",
    automation: "automatable later",
  },
  {
    name: "Score Caps",
    status: "next",
    owner: "Claude + Pine specialist",
    priority: 95,
    action: "Prevent high scores during weak, stale, or unclear states.",
    automation: "assistable",
  },
  {
    name: "Live QA Agent",
    status: "planned",
    owner: "Codex",
    priority: 88,
    action: "Design first; build after Core V2 is stable.",
    automation: "automatable later",
  },
  {
    name: "QA Fixtures",
    status: "missing",
    owner: "Codex",
    priority: 84,
    action: "Create sample state payloads before webhook work.",
    automation: "automatable now",
  },
  {
    name: "QA Report",
    status: "missing",
    owner: "Codex + Hermes",
    priority: 82,
    action: "Generate docs/qa/live-qa-report.md once QA rules exist.",
    automation: "automatable now",
  },
  {
    name: "Landing / Waitlist",
    status: "doing",
    owner: "Claude + TypeScript",
    priority: 68,
    action: "Keep present, but do not outpace product proof.",
    automation: "assistable",
  },
  {
    name: "Payments / Pro Access",
    status: "later",
    owner: "Dean",
    priority: 54,
    action: "Manual beta access first; no payment automation yet.",
    automation: "automatable later",
  },
  {
    name: "X Content Agent",
    status: "later",
    owner: "Dean + Hermes",
    priority: 50,
    action: "Use only after approved screenshots and compliance copy.",
    automation: "automatable later",
  },
  {
    name: "Future TradingView Webhook",
    status: "later",
    owner: "Automation developer",
    priority: 62,
    action: "Wait until offline QA is useful.",
    automation: "automatable later",
  },
  {
    name: "Future Screenshot QA",
    status: "later",
    owner: "QA automation",
    priority: 58,
    action: "Defer until state QA finds meaningful issues.",
    automation: "automatable later",
  },
  {
    name: "Future Website Brain",
    status: "parked",
    owner: "Dean + product architect",
    priority: 40,
    action: "Do not build until indicator and QA loop prove daily value.",
    automation: "automatable later",
  },
];

const commands: Command[] = [
  {
    label: "Run QA",
    command: "npm run qa:rc",
    state: "planned",
    note: "Target daily command once QA scripts exist.",
  },
  {
    label: "Build QA report",
    command: "npm run qa:report",
    state: "planned",
    note: "Target report command for docs/qa/live-qa-report.md.",
  },
  {
    label: "Open QA report",
    command: "docs/qa/live-qa-report.md",
    state: "document",
    note: "Planned document; missing in current inspection.",
  },
  {
    label: "Open kanban",
    command: "docs/kanban.md",
    state: "document",
    note: "Active task board derived from RC-MAP.",
  },
  {
    label: "Open RC-MAP",
    command: "docs/rangeclarity-master-action-plan.md",
    state: "document",
    note: "Central product source of truth.",
  },
];

const automations: Automation[] = [
  {
    name: "Daily QA report",
    trigger: "Manual morning command",
    input: "QA fixtures or webhook events",
    output: "docs/qa/live-qa-report.md",
    worthDoingNow: "now",
    priority: "high",
  },
  {
    name: "Weekly roadmap summary",
    trigger: "Friday review",
    input: "RC-MAP, kanban, QA report",
    output: "Next-week priority summary",
    worthDoingNow: "now",
    priority: "medium",
  },
  {
    name: "Findings to bug list",
    trigger: "QA finding created",
    input: "data/qa/findings.jsonl",
    output: "Prioritized bug list",
    worthDoingNow: "now",
    priority: "high",
  },
  {
    name: "RC-MAP update reminder",
    trigger: "Major critique or implementation",
    input: "Decision summary",
    output: "Update checklist",
    worthDoingNow: "later",
    priority: "medium",
  },
  {
    name: "X content draft",
    trigger: "Approved screenshot",
    input: "Screenshot plus safe structure notes",
    output: "Compliance-safe draft",
    worthDoingNow: "later",
    priority: "low",
  },
  {
    name: "Beta feedback summary",
    trigger: "Weekly beta review",
    input: "User notes, chart issues, QA findings",
    output: "Themes and next fixes",
    worthDoingNow: "later",
    priority: "medium",
  },
  {
    name: "TradingView webhook ingest",
    trigger: "Confirmed Pine alert",
    input: "Pine JSON payload",
    output: "Stored QA event",
    worthDoingNow: "later",
    priority: "medium",
  },
  {
    name: "Screenshot QA",
    trigger: "Daily chart review",
    input: "Chart screenshots or URLs",
    output: "Visual QA findings",
    worthDoingNow: "later",
    priority: "low",
  },
  {
    name: "GitHub/Linear issue creation",
    trigger: "High-priority finding approved",
    input: "Finding plus owner and severity",
    output: "Draft issue",
    worthDoingNow: "later",
    priority: "low",
  },
];

const roadmapBuckets: RoadmapBucket[] = [
  {
    title: "Now",
    items: [
      "Location Quality Kernel v1",
      "QA Agent as gate",
      "Zone Quality v1",
      "Score Caps",
      "Structure Change",
    ],
  },
  {
    title: "Next",
    items: [
      "Pine JSON emitter",
      "TradingView webhook receiver",
      "20-50 ticker daily review",
      "Beta feedback loop",
    ],
  },
  {
    title: "Later",
    items: [
      "Website Brain",
      "Watchlist Radar",
      "Pro automation",
      "Screenshot QA",
      "MTF advanced mode",
    ],
  },
];

const manualAutomated = [
  {
    label: "Manual",
    text: "Dean visual approval, Pine compile checks, chart judgment, beta conversations, and final product decisions.",
  },
  {
    label: "Agent-assisted",
    text: "RC-MAP updates, specs, critique, compliance sweeps, QA rules, and daily operating summaries.",
  },
  {
    label: "Automated later",
    text: "Webhook ingest, screenshot QA, issue creation, X drafts, access workflows, and Website Brain.",
  },
];

export const metadata: Metadata = {
  title: "RC Ops - RangeClarity Operating Room",
  description:
    "Internal RangeClarity command center for project modules, daily routine, automation boundaries, and next priorities.",
};

export const dynamic = "force-dynamic";

function assertInternalPagesEnabled() {
  if (process.env.RC_INTERNAL_PAGES_ENABLED !== "true") {
    notFound();
  }
}

function statusClass(status: ModuleStatus) {
  switch (status) {
    case "active":
    case "doing":
      return styles.statusActive;
    case "next":
      return styles.statusNext;
    case "planned":
      return styles.statusPlanned;
    case "missing":
      return styles.statusMissing;
    case "parked":
      return styles.statusParked;
    default:
      return styles.statusLater;
  }
}

function commandClass(state: Command["state"]) {
  switch (state) {
    case "available":
      return styles.commandAvailable;
    case "planned":
      return styles.commandPlanned;
    default:
      return styles.commandDocument;
  }
}

export default function OpsPage() {
  assertInternalPagesEnabled();

  const nowCount = automations.filter((item) => item.worthDoingNow === "now").length;
  const missingCount = modules.filter((item) => item.status === "missing").length;

  return (
    <main className={styles.page}>
      <section className={styles.header} aria-labelledby="ops-title">
        <div>
          <p className={styles.label}>RangeClarity Operating Room</p>
          <h1 id="ops-title">RC Ops</h1>
          <p className={styles.lead}>
            Internal command center for the current product plan, agent roles,
            daily routine, automation boundaries, and the next highest-priority
            work.
          </p>
        </div>
        <aside className={styles.summaryPanel} aria-label="Operating status">
          <dl>
            <div>
              <dt>Source of truth</dt>
              <dd>RC-MAP</dd>
            </div>
            <div>
              <dt>Current stance</dt>
              <dd>Planning and QA gate</dd>
            </div>
            <div>
              <dt>Now automations</dt>
              <dd>{nowCount}</dd>
            </div>
            <div>
              <dt>Missing QA docs</dt>
              <dd>{missingCount}</dd>
            </div>
          </dl>
        </aside>
      </section>

      <section className={styles.guardrailStrip} aria-label="Guardrails">
        <span>No Pine edits here</span>
        <span>No signals</span>
        <span>No advice wording</span>
        <span>No feature expansion</span>
        <span>Simple surface, complex engine</span>
      </section>

      <section className={styles.section} aria-labelledby="map-title">
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.label}>Project System Map</p>
            <h2 id="map-title">What exists, what is next, and what stays parked</h2>
          </div>
          <p>
            Each module has an owner, priority, current action, and automation
            posture. Missing QA assets are visible because they are part of the
            next operating gap.
          </p>
        </div>
        <div className={styles.moduleGrid}>
          {modules.map((module) => (
            <article className={styles.moduleCard} key={module.name}>
              <div className={styles.cardTop}>
                <span className={`${styles.status} ${statusClass(module.status)}`}>
                  {module.status}
                </span>
                <strong>{module.priority}</strong>
              </div>
              <h3>{module.name}</h3>
              <p>{module.action}</p>
              <dl className={styles.cardMeta}>
                <div>
                  <dt>Owner</dt>
                  <dd>{module.owner}</dd>
                </div>
                <div>
                  <dt>Automation</dt>
                  <dd>{module.automation}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.splitSection} aria-labelledby="routine-title">
        <div className={styles.routinePanel}>
          <div className={styles.sectionHeadInline}>
            <p className={styles.label}>Daily Routine</p>
            <h2 id="routine-title">The operating cadence</h2>
          </div>
          <div className={styles.routineGrid}>
            <RoutineBlock
              title="Morning"
              items={[
                "Run QA: npm run qa:rc",
                "Read docs/qa/live-qa-report.md",
                "Pick top 1-3 issues",
                "Check 5-10 charts manually",
              ]}
            />
            <RoutineBlock
              title="Build Loop"
              items={[
                "Claude implements one small fix",
                "Codex reviews",
                "Dean approves visually",
                "Update RC-MAP / kanban",
              ]}
            />
            <RoutineBlock
              title="Evening"
              items={[
                "Record what changed",
                "Decide next task",
                "Prepare next prompt",
              ]}
            />
          </div>
        </div>

        <div className={styles.commandsPanel} aria-labelledby="commands-title">
          <div className={styles.sectionHeadInline}>
            <p className={styles.label}>Action Buttons / Commands</p>
            <h2 id="commands-title">Copyable operating actions</h2>
          </div>
          <div className={styles.commandList}>
            {commands.map((item) => (
              <div className={styles.commandItem} key={item.label}>
                <div>
                  <span className={`${styles.commandState} ${commandClass(item.state)}`}>
                    {item.state}
                  </span>
                  <h3>{item.label}</h3>
                  <p>{item.note}</p>
                </div>
                <code>{item.command}</code>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="automation-title">
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.label}>Automation Opportunities</p>
            <h2 id="automation-title">Automate discipline before infrastructure</h2>
          </div>
          <p>
            Only daily QA, findings to bug list, and weekly roadmap summary are
            marked now. Webhooks, screenshots, issue creation, and Website Brain
            stay later.
          </p>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Automation</th>
                <th>Trigger</th>
                <th>Input</th>
                <th>Output</th>
                <th>Worth doing now?</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              {automations.map((item) => (
                <tr key={item.name}>
                  <td>
                    <strong>{item.name}</strong>
                  </td>
                  <td>{item.trigger}</td>
                  <td>{item.input}</td>
                  <td>{item.output}</td>
                  <td>
                    <span
                      className={
                        item.worthDoingNow === "now"
                          ? styles.nowBadge
                          : styles.laterBadge
                      }
                    >
                      {item.worthDoingNow}
                    </span>
                  </td>
                  <td>{item.priority}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="priority-title">
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.label}>Priority Roadmap</p>
            <h2 id="priority-title">Now, next, later</h2>
          </div>
          <p>
            This page keeps the highest-leverage work visible without turning the
            roadmap into another backlog.
          </p>
        </div>
        <div className={styles.roadmapGrid}>
          {roadmapBuckets.map((bucket) => (
            <article className={styles.roadmapCard} key={bucket.title}>
              <h3>{bucket.title}</h3>
              <ol>
                {bucket.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="manual-title">
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.label}>Manual vs Automated</p>
            <h2 id="manual-title">Where human judgment still matters</h2>
          </div>
          <p>
            RC Ops should reduce context switching. It should not hide decisions
            inside automation before the indicator is stable.
          </p>
        </div>
        <div className={styles.boundaryGrid}>
          {manualAutomated.map((item) => (
            <article className={styles.boundaryCard} key={item.label}>
              <h3>{item.label}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function RoutineBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <article className={styles.routineBlock}>
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}

import type { Metadata } from "next";
import roadmapData from "@/data/roadmap/rc-neural-roadmap.json";
import styles from "./roadmap.module.css";

type Status = "done" | "in progress" | "next" | "later" | "blocked" | "now";

type SystemNode = {
  id: string;
  name: string;
  status: Status;
  owner: string;
  priorityScore: number;
  dependencies: string[];
  automationPotential: string;
  skillType: string;
  phase: string;
  summary: string;
};

type Phase = {
  id: string;
  name: string;
  status: Status;
  goal: string;
  primaryOwner: string;
  dependsOn: string[];
  exitCriteria: string[];
};

type RoadmapTask = {
  id: string;
  title: string;
  phase: string;
  system: string;
  status: string;
  owner: string;
  skillType: string;
  impact: number;
  productClarity: number;
  dependencyUnlock: number;
  revenueBetaValue: number;
  riskReduction: number;
  automationLeverage: number;
  effort: number;
  confidence: number;
  priorityScore: number;
  recommendedTiming: "now" | "next" | "later";
  dependencies: string[];
  whyItMatters: string;
};

type Role = {
  role: string;
  shouldDo: string;
  shouldNotDo: string;
  estimatedHours: string;
  priority: string;
  canDeanClaudeCodexHandleFirst: string;
};

type Automation = {
  name: string;
  trigger: string;
  input: string;
  output: string;
  owner: string;
  difficulty: string;
  worthDoingNow: string;
};

type RoadmapData = {
  meta: {
    title: string;
    shortName: string;
    version: string;
    updated: string;
    sourceOfTruth: string;
    purpose: string;
  };
  scoringModel: {
    formula: string;
    scale: string;
    weights: Record<string, number>;
  };
  systems: SystemNode[];
  phases: Phase[];
  tasks: RoadmapTask[];
  roles: Role[];
  automations: Automation[];
  decisionDashboard: {
    buildThisWeek: string[];
    avoidNow: string[];
    highestLeverageNextTask: string;
    blocked: string[];
    requiresFounderApproval: string[];
    claudeShouldDo: string[];
    codexShouldReview: string[];
    hermesCanAutomate: string[];
  };
};

const roadmap = roadmapData as RoadmapData;

export const metadata: Metadata = {
  title: "RC Operating Map - RangeClarity",
  description:
    "Internal RangeClarity neural roadmap for product, Pine, QA, access, marketing, automation, and feedback loops.",
};

function statusClass(status: string) {
  switch (status) {
    case "done":
      return styles.statusDone;
    case "in progress":
    case "now":
      return styles.statusProgress;
    case "next":
      return styles.statusNext;
    case "blocked":
      return styles.statusBlocked;
    default:
      return styles.statusLater;
  }
}

function timingClass(timing: string) {
  switch (timing) {
    case "now":
      return styles.timingNow;
    case "next":
      return styles.timingNext;
    default:
      return styles.timingLater;
  }
}

function scoreClass(score: number) {
  if (score >= 85) return styles.scoreHigh;
  if (score >= 72) return styles.scoreMedium;
  return styles.scoreLow;
}

const topTasks = [...roadmap.tasks]
  .sort((a, b) => b.priorityScore - a.priorityScore)
  .slice(0, 10);

export default function RoadmapPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.kicker}>RangeClarity Internal Ops</p>
          <h1>{roadmap.meta.title}</h1>
          <p className={styles.lead}>{roadmap.meta.purpose}</p>
        </div>
        <dl className={styles.metaGrid} aria-label="Roadmap metadata">
          <div>
            <dt>Version</dt>
            <dd>{roadmap.meta.version}</dd>
          </div>
          <div>
            <dt>Updated</dt>
            <dd>{roadmap.meta.updated}</dd>
          </div>
          <div>
            <dt>Authority</dt>
            <dd>{roadmap.meta.sourceOfTruth}</dd>
          </div>
          <div>
            <dt>Rule</dt>
            <dd>No signals. No noise. Just structure.</dd>
          </div>
        </dl>
      </section>

      <section className={styles.decisionBand} aria-labelledby="decision-title">
        <div>
          <p className={styles.kicker}>Decision Dashboard</p>
          <h2 id="decision-title">What moves first</h2>
          <p>{roadmap.decisionDashboard.highestLeverageNextTask}</p>
        </div>
        <div className={styles.decisionGrid}>
          <DecisionList title="Build This Week" items={roadmap.decisionDashboard.buildThisWeek} />
          <DecisionList title="Avoid Now" items={roadmap.decisionDashboard.avoidNow} warn />
          <DecisionList title="Blocked" items={roadmap.decisionDashboard.blocked} />
          <DecisionList title="Founder Approval" items={roadmap.decisionDashboard.requiresFounderApproval} />
          <DecisionList title="Claude" items={roadmap.decisionDashboard.claudeShouldDo} />
          <DecisionList title="Codex" items={roadmap.decisionDashboard.codexShouldReview} />
          <DecisionList title="Hermes" items={roadmap.decisionDashboard.hermesCanAutomate} />
        </div>
      </section>

      <section className={styles.section} aria-labelledby="system-title">
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.kicker}>Neural System Map</p>
            <h2 id="system-title">Connected operating systems</h2>
          </div>
          <p>
            The project flows from product truth to Pine, QA, access, community,
            marketing, feedback, and iteration. Dependency labels stay visible so
            future agents can see what must happen first.
          </p>
        </div>
        <div className={styles.systemMap}>
          {roadmap.systems.map((node) => (
            <article className={styles.systemNode} key={node.id}>
              <div className={styles.nodeTop}>
                <span className={`${styles.status} ${statusClass(node.status)}`}>
                  {node.status}
                </span>
                <strong className={scoreClass(node.priorityScore)}>
                  {node.priorityScore}
                </strong>
              </div>
              <h3>{node.name}</h3>
              <p>{node.summary}</p>
              <dl>
                <div>
                  <dt>Owner</dt>
                  <dd>{node.owner}</dd>
                </div>
                <div>
                  <dt>Skill</dt>
                  <dd>{node.skillType}</dd>
                </div>
                <div>
                  <dt>Automation</dt>
                  <dd>{node.automationPotential}</dd>
                </div>
                <div>
                  <dt>Depends</dt>
                  <dd>{node.dependencies.length ? node.dependencies.join(", ") : "none"}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="phase-title">
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.kicker}>Roadmap Phases</p>
            <h2 id="phase-title">Planning to implementation sequence</h2>
          </div>
          <p>
            Pine edits, payments, accounts, and automations stay behind gates.
            Each phase has explicit exit criteria.
          </p>
        </div>
        <ol className={styles.phaseRail}>
          {roadmap.phases.map((phase, index) => (
            <li className={styles.phaseItem} key={phase.id}>
              <span className={styles.phaseIndex}>{String(index).padStart(2, "0")}</span>
              <div>
                <div className={styles.phaseTitleRow}>
                  <h3>{phase.name}</h3>
                  <span className={`${styles.status} ${statusClass(phase.status)}`}>
                    {phase.status}
                  </span>
                </div>
                <p>{phase.goal}</p>
                <dl className={styles.phaseMeta}>
                  <div>
                    <dt>Owner</dt>
                    <dd>{phase.primaryOwner}</dd>
                  </div>
                  <div>
                    <dt>Depends</dt>
                    <dd>{phase.dependsOn.length ? phase.dependsOn.join(", ") : "none"}</dd>
                  </div>
                </dl>
                <ul className={styles.compactList}>
                  {phase.exitCriteria.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.section} aria-labelledby="score-title">
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.kicker}>Prioritization</p>
            <h2 id="score-title">Task scoring model</h2>
          </div>
          <p>{roadmap.scoringModel.scale}</p>
        </div>
        <div className={styles.scoreFormula}>{roadmap.scoringModel.formula}</div>
        <div className={styles.weightGrid}>
          {Object.entries(roadmap.scoringModel.weights).map(([key, value]) => (
            <div key={key}>
              <span>{key}</span>
              <strong>{value}%</strong>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="top-task-title">
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.kicker}>Top 10</p>
            <h2 id="top-task-title">Highest priority tasks</h2>
          </div>
          <p>
            Scores favor product clarity, dependency unlocks, beta value, and
            risk reduction before automation or growth.
          </p>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Task</th>
                <th>Score</th>
                <th>Timing</th>
                <th>Owner</th>
                <th>Why it matters</th>
              </tr>
            </thead>
            <tbody>
              {topTasks.map((task, index) => (
                <tr key={task.id}>
                  <td>{index + 1}</td>
                  <td>
                    <strong>{task.title}</strong>
                    <span>{task.id}</span>
                  </td>
                  <td>
                    <b className={scoreClass(task.priorityScore)}>{task.priorityScore}</b>
                  </td>
                  <td>
                    <span className={`${styles.timing} ${timingClass(task.recommendedTiming)}`}>
                      {task.recommendedTiming}
                    </span>
                  </td>
                  <td>{task.owner}</td>
                  <td>{task.whyItMatters}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="task-title">
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.kicker}>Task Table</p>
            <h2 id="task-title">Full scored backlog</h2>
          </div>
          <p>
            Every task includes effort, confidence, dependencies, skill type,
            and recommended timing.
          </p>
        </div>
        <div className={styles.taskGrid}>
          {roadmap.tasks.map((task) => (
            <article className={styles.taskCard} key={task.id}>
              <div className={styles.cardTop}>
                <span className={`${styles.timing} ${timingClass(task.recommendedTiming)}`}>
                  {task.recommendedTiming}
                </span>
                <strong className={scoreClass(task.priorityScore)}>
                  {task.priorityScore}
                </strong>
              </div>
              <h3>{task.title}</h3>
              <p>{task.whyItMatters}</p>
              <dl className={styles.taskMeta}>
                <div>
                  <dt>ID</dt>
                  <dd>{task.id}</dd>
                </div>
                <div>
                  <dt>Phase</dt>
                  <dd>{task.phase}</dd>
                </div>
                <div>
                  <dt>Owner</dt>
                  <dd>{task.owner}</dd>
                </div>
                <div>
                  <dt>Skill</dt>
                  <dd>{task.skillType}</dd>
                </div>
                <div>
                  <dt>Impact</dt>
                  <dd>{task.impact}/5</dd>
                </div>
                <div>
                  <dt>Effort</dt>
                  <dd>{task.effort}/5</dd>
                </div>
                <div>
                  <dt>Confidence</dt>
                  <dd>{task.confidence}/5</dd>
                </div>
                <div>
                  <dt>Depends</dt>
                  <dd>{task.dependencies.length ? task.dependencies.join(", ") : "none"}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="role-title">
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.kicker}>Hiring / Roles</p>
            <h2 id="role-title">Developer and freelancer recommendations</h2>
          </div>
          <p>
            Hire only where the operating map shows leverage. Dean, Claude, and
            Codex should spec first before paid work expands.
          </p>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Role</th>
                <th>Should do</th>
                <th>Should not do</th>
                <th>Hours</th>
                <th>Priority</th>
                <th>Internal first?</th>
              </tr>
            </thead>
            <tbody>
              {roadmap.roles.map((role) => (
                <tr key={role.role}>
                  <td><strong>{role.role}</strong></td>
                  <td>{role.shouldDo}</td>
                  <td>{role.shouldNotDo}</td>
                  <td>{role.estimatedHours}</td>
                  <td>{role.priority}</td>
                  <td>{role.canDeanClaudeCodexHandleFirst}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="automation-title">
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.kicker}>Automation</p>
            <h2 id="automation-title">Where automation belongs</h2>
          </div>
          <p>
            Automate QA and operating discipline first. Do not automate payments
            or access before manual beta proves the flow.
          </p>
        </div>
        <div className={styles.automationGrid}>
          {roadmap.automations.map((automation) => (
            <article className={styles.automationItem} key={automation.name}>
              <div className={styles.cardTop}>
                <span>{automation.difficulty}</span>
                <strong>{automation.worthDoingNow}</strong>
              </div>
              <h3>{automation.name}</h3>
              <dl>
                <div>
                  <dt>Trigger</dt>
                  <dd>{automation.trigger}</dd>
                </div>
                <div>
                  <dt>Input</dt>
                  <dd>{automation.input}</dd>
                </div>
                <div>
                  <dt>Output</dt>
                  <dd>{automation.output}</dd>
                </div>
                <div>
                  <dt>Owner</dt>
                  <dd>{automation.owner}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function DecisionList({
  title,
  items,
  warn = false,
}: {
  title: string;
  items: string[];
  warn?: boolean;
}) {
  return (
    <article className={warn ? styles.warnList : styles.decisionList}>
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}

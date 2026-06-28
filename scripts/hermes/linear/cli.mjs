#!/usr/bin/env node
/**
 * Hermes → Linear CLI (dependency-free, Node 20+).
 *
 * Read-only / safe:
 *   node scripts/hermes/linear/cli.mjs health       # viewer { id name email }
 *   node scripts/hermes/linear/cli.mjs teams         # list teams { id key name }
 *   node scripts/hermes/linear/cli.mjs validate      # config + connectivity check
 *   node scripts/hermes/linear/cli.mjs dry-run       # plan kanban → Linear (no writes)
 *
 * Write-capable (gated; dry-run unless LINEAR_WRITE_ENABLED=true):
 *   node scripts/hermes/linear/cli.mjs test-issue    # create one [Hermes] test issue
 *   node scripts/hermes/linear/cli.mjs sync          # sync docs/kanban.md → Linear
 *
 * Flags: --dry-run (force dry-run), --limit=N, --help
 * Never prints secrets. Never starts the live Hermes agent. Never sends Telegram.
 */

import {
  loadDotEnv,
  readConfig,
  printConfig,
  resolveWriteGate,
  findKanbanFile,
  parseKanban,
  buildIssuePayload,
  getViewer,
  getTeam,
  getProject,
  resolveTeam,
  fetchExistingByMarker,
  issueCreate,
  issueUpdate,
  resolveStateId,
  log,
  warn,
  err,
  line,
} from "./lib.mjs";
import { healthCheckLinear, listTeams } from "./client.mjs";
import { issueFromActionItem, syncActionItems } from "./hermes-integration.mjs";

function parseArgs(argv) {
  const flags = { dryRun: false, limit: Infinity, help: false };
  const positional = [];
  for (const a of argv) {
    if (a === "--dry-run") flags.dryRun = true;
    else if (a === "--help" || a === "-h") flags.help = true;
    else if (a.startsWith("--limit=")) flags.limit = Number(a.split("=")[1]) || Infinity;
    else positional.push(a);
  }
  return { command: positional[0] || "help", flags };
}

function printHelp() {
  console.log(`Hermes → Linear adapter

Usage:
  node scripts/hermes/linear/cli.mjs <command> [--dry-run] [--limit=N]

Read-only:   health | teams | validate | dry-run
Write-gated: test-issue | sync   (dry-run unless LINEAR_WRITE_ENABLED=true)

npm aliases: linear:health | linear:teams | linear:test-issue
             hermes:linear:validate | :dry-run | :sync`);
}

function requireKey(cfg, action) {
  if (cfg.apiKey) return true;
  warn(`No LINEAR_API_KEY set — cannot ${action} yet.`);
  warn("Run `bash scripts/setup-linear.sh` to store it locally (it is never shown),");
  warn("then re-run. See docs/linear-integration.md.");
  return false;
}

async function cmdHealth(cfg) {
  line();
  log("HEALTH CHECK (read-only)");
  log(`LINEAR_API_KEY: ${cfg.apiKey ? "present (hidden)" : "MISSING"}`);
  if (!requireKey(cfg, "run the health check")) return 0;
  try {
    const { viewer } = await healthCheckLinear(cfg.apiKey);
    log(`✓ HEALTHY — authenticated as ${viewer.name} <${viewer.email}> (id ${viewer.id})`);
    return 0;
  } catch (e) {
    err(`✗ UNHEALTHY — ${e.message}`);
    return 1;
  }
}

async function cmdTeams(cfg) {
  line();
  log("TEAMS (read-only)");
  if (!requireKey(cfg, "list teams")) return 0;
  try {
    const teams = await listTeams(cfg.apiKey);
    log(`Found ${teams.length} team(s):`);
    for (const t of teams) log(`  • ${t.key.padEnd(6)} ${t.name}   (id ${t.id})`);
    return 0;
  } catch (e) {
    err(`✗ ${e.message}`);
    return 1;
  }
}

async function cmdValidate(cfg) {
  line();
  log("VALIDATE (read-only)");
  printConfig(cfg);
  line();
  if (!requireKey(cfg, "reach Linear")) return 0;
  try {
    const viewer = await getViewer(cfg.apiKey);
    log(`✓ Token works. Authenticated as: ${viewer.name} <${viewer.email}>`);
  } catch (e) {
    err(`✗ Token check failed: ${e.message}`);
    return 1;
  }
  if (cfg.teamId || cfg.teamKey) {
    try {
      const team = await resolveTeam(cfg.apiKey, cfg);
      log(`✓ Team resolves: ${team.name} (key ${team.key}, id ${team.id})`);
      const full = await getTeam(cfg.apiKey, team.id);
      log(`  Workflow states: ${full.states.nodes.map((s) => s.name).join(", ")}`);
    } catch (e) {
      err(`✗ Team lookup failed: ${e.message}`);
      return 1;
    }
  } else {
    warn("• No LINEAR_TEAM_ID / LINEAR_TEAM_KEY — required before any write.");
  }
  if (cfg.projectId) {
    try {
      const p = await getProject(cfg.apiKey, cfg.projectId);
      if (p) log(`✓ Project resolves: ${p.name}`);
      else warn("• LINEAR_PROJECT_ID did not resolve (optional).");
    } catch (e) {
      warn(`• Project lookup failed (optional): ${e.message}`);
    }
  } else {
    log("• LINEAR_PROJECT_ID unset (optional — issues land in the team backlog).");
  }
  line();
  log("Validation complete.");
  return 0;
}

async function cmdTestIssue(cfg, flags) {
  line();
  log("TEST ISSUE (Hermes → Linear)");
  printConfig(cfg);
  const sample = {
    kind: "blocker",
    text: "Hermes→Linear integration test issue (safe to delete)",
    context: "Created by `linear:test-issue` to verify the pipeline end-to-end.",
    nextStep: "Confirm it appeared in Linear, then delete it.",
  };
  const issue = issueFromActionItem(sample, { source: "Hermes integration test", date: new Date().toISOString().slice(0, 10) });
  const gate = resolveWriteGate("test-issue", cfg, flags);
  line();
  log(`Write gate: ${gate.willWrite ? "OPEN (will create)" : "CLOSED (dry-run)"}`);
  for (const r of gate.reasons) log(`  - ${r}`);
  line();
  log("Planned issue:");
  log(`  title: ${issue.title}`);
  log(`  priority: ${["None", "Urgent", "High", "Medium", "Low"][issue.priority]}`);
  log("  description:");
  for (const l of issue.description.split("\n")) log(`    | ${l}`);
  line();
  if (!gate.willWrite) {
    warn("DRY-RUN — no issue was created. Set LINEAR_WRITE_ENABLED=true (and configure team) to create it.");
    return 0;
  }
  const [res] = await syncActionItems({
    apiKey: cfg.apiKey,
    items: [sample],
    meta: { source: "Hermes integration test" },
    teamId: cfg.teamId,
    teamKey: cfg.teamKey,
    projectId: cfg.projectId,
    write: true,
  });
  if (res.action === "CREATED") log(`✓ created ${res.id} — ${res.url}`);
  else if (res.action === "EXISTS") log(`• already existed: ${res.id} — ${res.url}`);
  else if (res.action === "ERROR") {
    err(`✗ ${res.error}`);
    return 1;
  }
  return 0;
}

async function loadPlan(cfg, flags) {
  const kb = await findKanbanFile();
  if (!kb) {
    err("No docs/kanban.md or docs/kanban-board.md found — nothing to sync.");
    return null;
  }
  log(`Source of truth: ${kb.rel} (HERMES_SOURCE_OF_TRUTH=${cfg.sourceOfTruth})`);
  const tickets = parseKanban(kb.content).slice(0, flags.limit);
  log(`Parsed ${tickets.length} ticket(s) from the board.`);

  let existing = new Map();
  let team = null;
  let resolvedTeamId = cfg.teamId;
  if (cfg.apiKey && (cfg.teamId || cfg.teamKey)) {
    try {
      const rt = await resolveTeam(cfg.apiKey, cfg);
      resolvedTeamId = rt.id;
      team = await getTeam(cfg.apiKey, rt.id);
      existing = await fetchExistingByMarker(cfg.apiKey, rt.id);
      log(`Team ${rt.key}/${rt.name}; existing Hermes-managed issues found: ${existing.size}.`);
    } catch (e) {
      warn(`Could not query Linear (${e.message}); planning all as CREATE.`);
    }
  } else {
    warn("No API key + team — planning all as CREATE (cannot check existing issues).");
  }

  const cfgForPayload = { ...cfg, teamId: resolvedTeamId };
  const plan = tickets.map((t) => {
    const found = existing.get(t.id);
    const stateId = resolveStateId(team, t.status);
    return {
      ticket: t,
      action: found ? "UPDATE" : "CREATE",
      existing: found || null,
      stateId,
      payload: buildIssuePayload(t, cfgForPayload, stateId),
    };
  });
  return { kb, plan };
}

function printPlan(plan) {
  line();
  log("PLANNED ACTIONS (no changes made):");
  for (const item of plan) {
    const t = item.ticket;
    const pr = ["None", "Urgent", "High", "Medium", "Low"][t.priority] || "None";
    log(`  • [${item.action}] ${item.payload.title}`);
    log(`        priority=${pr}  status=${t.status || "(none)"}  labels=${t.labels.join(", ") || "(none)"}`);
    if (item.action === "UPDATE" && item.existing) log(`        → would update ${item.existing.identifier} (${item.existing.url})`);
  }
  line();
  const creates = plan.filter((p) => p.action === "CREATE").length;
  const updates = plan.filter((p) => p.action === "UPDATE").length;
  log(`Summary: ${creates} create, ${updates} update, ${plan.length} total.`);
}

async function cmdDryRun(cfg, flags) {
  line();
  log("DRY-RUN (no writes)");
  printConfig(cfg);
  const loaded = await loadPlan(cfg, flags);
  if (!loaded) return 1;
  printPlan(loaded.plan);
  log("Dry-run only — nothing was created or updated in Linear.");
  return 0;
}

async function cmdSync(cfg, flags) {
  line();
  log("SYNC");
  printConfig(cfg);
  const gate = resolveWriteGate("sync", cfg, flags);
  line();
  log(`Write gate: ${gate.willWrite ? "OPEN (will write)" : "CLOSED (safe dry-run)"}`);
  for (const r of gate.reasons) log(`  - ${r}`);
  const loaded = await loadPlan(cfg, flags);
  if (!loaded) return 1;

  if (!gate.willWrite) {
    printPlan(loaded.plan);
    warn("Writes are disabled — fell back to DRY-RUN. Nothing changed in Linear.");
    warn("To enable real writes: set LINEAR_WRITE_ENABLED=true (and configure a team), then re-run sync.");
    return 0;
  }

  printPlan(loaded.plan);
  line();
  log("Applying changes to Linear...");
  let created = 0;
  let updated = 0;
  for (const item of loaded.plan) {
    try {
      if (item.action === "CREATE") {
        const r = await issueCreate(cfg.apiKey, item.payload);
        if (r.success) { created++; log(`  ✓ created ${r.issue.identifier} — ${r.issue.url}`); }
        else err(`  ✗ create failed for ${item.payload.title}`);
      } else {
        const updateInput = { title: item.payload.title, description: item.payload.description, priority: item.payload.priority };
        if (item.stateId) updateInput.stateId = item.stateId;
        const r = await issueUpdate(cfg.apiKey, item.existing.id, updateInput);
        if (r.success) { updated++; log(`  ✓ updated ${r.issue.identifier} — ${r.issue.url}`); }
        else err(`  ✗ update failed for ${item.existing.identifier}`);
      }
    } catch (e) {
      err(`  ✗ ${item.action} error for ${item.payload.title}: ${e.message}`);
    }
  }
  line();
  log(`Sync complete: ${created} created, ${updated} updated.`);
  return 0;
}

async function main() {
  loadDotEnv();
  const { command, flags } = parseArgs(process.argv.slice(2));
  if (flags.help || command === "help") {
    printHelp();
    return 0;
  }
  const cfg = readConfig();
  switch (command) {
    case "health":
      return cmdHealth(cfg);
    case "teams":
      return cmdTeams(cfg);
    case "validate":
      return cmdValidate(cfg);
    case "dry-run":
    case "dryrun":
      return cmdDryRun(cfg, flags);
    case "test-issue":
      return cmdTestIssue(cfg, flags);
    case "sync":
      return cmdSync(cfg, flags);
    default:
      err(`Unknown command: ${command}`);
      printHelp();
      return 2;
  }
}

main()
  .then((code) => process.exitCode = code || 0)
  .catch((e) => {
    err(`Fatal: ${e.message}`);
    process.exitCode = 1;
  });

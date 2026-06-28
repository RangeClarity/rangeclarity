/**
 * Hermes → Linear adapter — shared library (dependency-free, Node 20+ ESM).
 *
 * SAFETY MODEL (read this before changing anything):
 *  - This module NEVER prints, logs, or returns secret values. The Linear API
 *    key is only ever reported as present/absent (+ length), never its content.
 *  - Writes to Linear are GATED. A write happens only when:
 *        LINEAR_WRITE_ENABLED === "true"   (canonical switch; default off → dry-run)
 *    ...AND not explicitly braked by LINEAR_DRY_RUN=true, AND an API key + a team
 *    (LINEAR_TEAM_ID or LINEAR_TEAM_KEY) are configured. Otherwise the tool
 *    degrades to a safe DRY-RUN and explains why.
 *    (Legacy HERMES_ALLOW_LINEAR_WRITE=true is still honored as an alias.)
 *  - `.env` / `.env*.local` are gitignored; this module reads them only to
 *    populate process.env and never echoes their contents.
 *
 * Linear API: https://api.linear.app/graphql
 *   Personal API key auth header: `Authorization: <LINEAR_API_KEY>` (NO "Bearer").
 */

import { promises as fs } from "node:fs";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

export const LINEAR_GRAPHQL_URL = "https://api.linear.app/graphql";
export const MARKER_PREFIX = "hermes:kanban-id=";
const REPO_ROOT = process.cwd();

export const log = (...a) => console.log("[hermes:linear]", ...a);
export const warn = (...a) => console.warn("[hermes:linear]", ...a);
export const err = (...a) => console.error("[hermes:linear]", ...a);
export const line = () => console.log("-".repeat(64));

/** Report only the PRESENCE of a secret — never any of its characters. */
export function presence(value) {
  if (typeof value !== "string" || value.length === 0) return "MISSING";
  return `present (${value.length} chars, value hidden)`;
}

/**
 * Minimal .env loader — populates process.env WITHOUT printing values.
 * Reads .env then .env.local. Values are never logged. No-ops if files absent.
 */
export function loadDotEnv() {
  for (const file of [".env", ".env.local"]) {
    const p = path.join(REPO_ROOT, file);
    if (!existsSync(p)) continue;
    let raw;
    try {
      raw = readFileSync(p, "utf8");
    } catch {
      continue;
    }
    for (const lineStr of raw.split(/\r?\n/)) {
      const s = lineStr.trim();
      if (!s || s.startsWith("#")) continue;
      const eq = s.indexOf("=");
      if (eq === -1) continue;
      const key = s.slice(0, eq).trim();
      if (!key) continue;
      if (key in process.env && file === ".env") continue;
      let val = s.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  }
}

const isTrue = (v) => String(v ?? "").trim().toLowerCase() === "true";

export function readConfig() {
  return {
    apiKey: process.env.LINEAR_API_KEY || "",
    teamId: process.env.LINEAR_TEAM_ID || "",
    teamKey: process.env.LINEAR_TEAM_KEY || "",
    projectId: process.env.LINEAR_PROJECT_ID || "",
    writeEnabled:
      isTrue(process.env.LINEAR_WRITE_ENABLED) || isTrue(process.env.HERMES_ALLOW_LINEAR_WRITE),
    dryRunEnv: isTrue(process.env.LINEAR_DRY_RUN),
    sourceOfTruth: (process.env.HERMES_SOURCE_OF_TRUTH || "docs").trim().toLowerCase(),
  };
}

export function isWriteEnabled(cfg) {
  return Boolean(cfg.writeEnabled) && !cfg.dryRunEnv;
}

export function printConfig(cfg) {
  log("Config:");
  log(`  LINEAR_API_KEY        : ${presence(cfg.apiKey)}`);
  log(`  LINEAR_TEAM_KEY       : ${cfg.teamKey || "(unset)"}`);
  log(`  LINEAR_TEAM_ID        : ${cfg.teamId || "(unset)"}`);
  log(`  LINEAR_PROJECT_ID     : ${cfg.projectId || "(unset)"}`);
  log(`  LINEAR_WRITE_ENABLED  : ${cfg.writeEnabled}${cfg.dryRunEnv ? " (LINEAR_DRY_RUN brake ON)" : ""}`);
  log(`  HERMES_SOURCE_OF_TRUTH: ${cfg.sourceOfTruth}`);
  log(`  -> effective mode     : ${isWriteEnabled(cfg) ? "WRITE" : "DRY-RUN (no writes)"}`);
}

export function resolveWriteGate(command, cfg, flags) {
  const reasons = [];
  let willWrite = true;
  const writeCommands = new Set(["sync", "test-issue"]);
  if (!writeCommands.has(command)) {
    reasons.push(`command "${command}" never writes (read-only by design)`);
    willWrite = false;
  }
  if (flags?.dryRun) {
    reasons.push("--dry-run flag forces dry-run");
    willWrite = false;
  }
  if (!cfg.writeEnabled) {
    reasons.push("LINEAR_WRITE_ENABLED is not true");
    willWrite = false;
  }
  if (cfg.dryRunEnv) {
    reasons.push("LINEAR_DRY_RUN brake is true");
    willWrite = false;
  }
  if (!cfg.apiKey) {
    reasons.push("LINEAR_API_KEY is missing");
    willWrite = false;
  }
  if (!cfg.teamId && !cfg.teamKey) {
    reasons.push("no LINEAR_TEAM_ID or LINEAR_TEAM_KEY configured");
    willWrite = false;
  }
  if (willWrite) reasons.push("all gates open — writes ENABLED");
  return { willWrite, reasons };
}

export async function findKanbanFile() {
  for (const rel of ["docs/kanban.md", "docs/kanban-board.md"]) {
    const p = path.join(REPO_ROOT, rel);
    try {
      const content = await fs.readFile(p, "utf8");
      return { rel, path: p, content };
    } catch {
      /* try next */
    }
  }
  return null;
}

const PRIORITY_MAP = { p0: 1, p1: 2, p2: 3, p3: 4, p4: 4 };
export function mapPriority(raw) {
  if (!raw) return 0;
  const key = String(raw).trim().toLowerCase();
  if (key in PRIORITY_MAP) return PRIORITY_MAP[key];
  const n = Number(key);
  return Number.isInteger(n) && n >= 0 && n <= 4 ? n : 0;
}

export function parseKanban(markdown) {
  const tickets = [];
  const blocks = markdown.split(/^##\s+/m).slice(1);
  for (const block of blocks) {
    const nl = block.indexOf("\n");
    const heading = (nl === -1 ? block : block.slice(0, nl)).trim();
    const body = nl === -1 ? "" : block.slice(nl + 1);
    const m = heading.match(/^([A-Za-z][\w.-]*)\s*(?:[—:-]\s*)?(.*)$/);
    if (!m) continue;
    const id = m[1].trim();
    const title = (m[2] || "").trim() || id;
    if (!/^[A-Za-z]+[-.]?\d/.test(id)) continue;

    const meta = {};
    const descLines = [];
    for (const rawLine of body.split(/\r?\n/)) {
      const mm = rawLine.match(/^\s*[-*]\s*\**([A-Za-z][\w ]*?)\**\s*:\s*(.+?)\s*$/);
      if (mm && descLines.length === 0) {
        meta[mm[1].trim().toLowerCase()] = mm[2].trim();
      } else {
        descLines.push(rawLine);
      }
    }
    const description = descLines.join("\n").trim();
    const labels = (meta.labels || "").split(",").map((s) => s.trim()).filter(Boolean);

    tickets.push({
      id,
      title,
      status: meta.status || "",
      priorityRaw: meta.priority || "",
      priority: mapPriority(meta.priority),
      owner: meta.owner || "",
      estimate: meta.estimate || "",
      labels,
      description,
    });
  }
  return tickets;
}

export function buildDescription(ticket) {
  const parts = [];
  if (ticket.description) parts.push(ticket.description);
  const facts = [];
  if (ticket.owner) facts.push(`Owner: ${ticket.owner}`);
  if (ticket.estimate) facts.push(`Estimate: ${ticket.estimate}`);
  if (ticket.status) facts.push(`Kanban status: ${ticket.status}`);
  if (facts.length) parts.push(facts.join(" · "));
  parts.push(`<!-- ${MARKER_PREFIX}${ticket.id} -->`);
  return parts.join("\n\n");
}

export function buildIssuePayload(ticket, cfg, stateId) {
  const input = {
    teamId: cfg.teamId || "<resolve-from-LINEAR_TEAM_KEY>",
    title: `${ticket.id} ${ticket.title}`.trim(),
    description: buildDescription(ticket),
    priority: ticket.priority,
  };
  if (cfg.projectId) input.projectId = cfg.projectId;
  if (stateId) input.stateId = stateId;
  return input;
}

export function markerFor(id) {
  return `${MARKER_PREFIX}${id}`;
}

export async function graphql(apiKey, query, variables = {}) {
  if (!apiKey) throw new Error("graphql() called without an API key");
  const res = await fetch(LINEAR_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: apiKey,
    },
    body: JSON.stringify({ query, variables }),
  });
  let json;
  try {
    json = await res.json();
  } catch {
    throw new Error(`Linear API returned non-JSON (HTTP ${res.status})`);
  }
  if (!res.ok || json.errors) {
    const msg = json?.errors?.map((e) => e.message).join("; ") || `HTTP ${res.status}`;
    throw new Error(`Linear API error: ${msg}`);
  }
  return json.data;
}

export async function getViewer(apiKey) {
  const d = await graphql(apiKey, `query { viewer { id name email } }`);
  return d.viewer;
}

export async function getTeams(apiKey) {
  const d = await graphql(apiKey, `query { teams(first: 250) { nodes { id key name } } }`);
  return d.teams.nodes;
}

export async function getTeam(apiKey, teamId) {
  const d = await graphql(
    apiKey,
    `query($id: String!) { team(id: $id) { id key name states { nodes { id name type } } } }`,
    { id: teamId },
  );
  return d.team;
}

export async function getProject(apiKey, projectId) {
  const d = await graphql(
    apiKey,
    `query($id: String!) { project(id: $id) { id name state } }`,
    { id: projectId },
  );
  return d.project;
}

export async function resolveTeam(apiKey, { teamId, teamKey }) {
  if (teamId) {
    const t = await getTeam(apiKey, teamId);
    if (!t) throw new Error(`LINEAR_TEAM_ID "${teamId}" did not resolve to a team`);
    return { id: t.id, key: t.key, name: t.name };
  }
  if (teamKey) {
    const teams = await getTeams(apiKey);
    const match = teams.find((t) => t.key.toLowerCase() === teamKey.toLowerCase());
    if (!match) {
      throw new Error(`LINEAR_TEAM_KEY "${teamKey}" not found. Available: ${teams.map((t) => t.key).join(", ")}`);
    }
    return { id: match.id, key: match.key, name: match.name };
  }
  throw new Error("No LINEAR_TEAM_ID or LINEAR_TEAM_KEY configured");
}

export async function fetchExistingByMarker(apiKey, teamId) {
  const byId = new Map();
  let after = null;
  do {
    const d = await graphql(
      apiKey,
      `query($teamId: ID!, $after: String) {
         issues(filter: { team: { id: { eq: $teamId } } }, first: 250, after: $after) {
           nodes { id identifier title description url }
           pageInfo { hasNextPage endCursor }
         }
       }`,
      { teamId, after },
    );
    for (const n of d.issues.nodes) {
      const desc = n.description || "";
      const m = desc.match(/hermes:kanban-id=([A-Za-z][\w.-]*)/);
      if (m) byId.set(m[1], n);
    }
    after = d.issues.pageInfo.hasNextPage ? d.issues.pageInfo.endCursor : null;
  } while (after);
  return byId;
}

export async function findIssueByTitle(apiKey, teamId, title) {
  const d = await graphql(
    apiKey,
    `query($teamId: ID!, $title: String!) {
       issues(filter: { team: { id: { eq: $teamId } }, title: { eq: $title } }, first: 1) {
         nodes { id identifier title url }
       }
     }`,
    { teamId, title },
  );
  return d.issues.nodes[0] || null;
}

export async function issueCreate(apiKey, input) {
  const d = await graphql(
    apiKey,
    `mutation($input: IssueCreateInput!) { issueCreate(input: $input) { success issue { id identifier url } } }`,
    { input },
  );
  return d.issueCreate;
}

export async function issueUpdate(apiKey, id, input) {
  const d = await graphql(
    apiKey,
    `mutation($id: String!, $input: IssueUpdateInput!) { issueUpdate(id: $id, input: $input) { success issue { id identifier url } } }`,
    { id, input },
  );
  return d.issueUpdate;
}

export function resolveStateId(team, statusName) {
  if (!team?.states?.nodes || !statusName) return null;
  const want = statusName.trim().toLowerCase();
  const exact = team.states.nodes.find((s) => s.name.toLowerCase() === want);
  return exact ? exact.id : null;
}

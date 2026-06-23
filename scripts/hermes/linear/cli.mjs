#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { LinearClient } from "@linear/sdk";

const ROOT_DIR = process.cwd();
const ENV_LOCAL_PATH = path.join(ROOT_DIR, ".env.local");
const KANBAN_PATH = path.join(ROOT_DIR, "docs", "kanban.md");

const VALID_COMMANDS = new Set(["teams", "dry-run"]);
const ISSUE_LOOKUP_LIMIT = 100;

function loadEnvLocal() {
  if (!existsSync(ENV_LOCAL_PATH)) {
    return;
  }

  const content = readFileSync(ENV_LOCAL_PATH, "utf8");

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const match = line.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);

    if (!match) {
      continue;
    }

    const [, key, rawValue] = match;

    if (process.env[key] !== undefined) {
      continue;
    }

    process.env[key] = parseEnvValue(rawValue);
  }
}

function parseEnvValue(rawValue) {
  const value = rawValue.trim();

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function fail(message, exitCode = 1) {
  console.error(message);
  process.exit(exitCode);
}

function assertReadOnlyMode() {
  const writeFlag = String(process.env.LINEAR_WRITE_ENABLED ?? "")
    .trim()
    .toLowerCase();

  if (["1", "true", "yes", "on"].includes(writeFlag)) {
    fail(
      "Safety error: LINEAR_WRITE_ENABLED is enabled. This CLI only runs with Linear writes disabled.",
    );
  }
}

function requireLinearApiKey() {
  const apiKey = process.env.LINEAR_API_KEY;

  if (!apiKey) {
    fail("LINEAR_API_KEY is not configured in process env or .env.local.");
  }

  return apiKey;
}

function getLinearClient() {
  return new LinearClient({ apiKey: requireLinearApiKey() });
}

function normalizeTitle(title) {
  return title
    .toLowerCase()
    .replace(/[`*_~]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function splitMarkdownRow(row) {
  return row
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function parseKanbanBoard(markdown) {
  const lines = markdown.split(/\r?\n/);
  const headerIndex = lines.findIndex((line) => {
    const cells = splitMarkdownRow(line);
    return (
      cells.length === 4 &&
      cells[0] === "Status" &&
      cells[1] === "Card" &&
      cells[2] === "Owner" &&
      cells[3] === "Acceptance"
    );
  });

  if (headerIndex === -1) {
    fail("Could not find the kanban board table in docs/kanban.md.");
  }

  const rows = [];

  for (const line of lines.slice(headerIndex + 2)) {
    if (!line.trim().startsWith("|")) {
      break;
    }

    const cells = splitMarkdownRow(line);

    if (cells.length < 4) {
      continue;
    }

    const [status, card, owner, acceptance] = cells;

    if (!card) {
      continue;
    }

    rows.push({ status, card, owner, acceptance });
  }

  return rows;
}

function buildTeamFilter() {
  const clauses = [];

  if (process.env.LINEAR_TEAM_ID) {
    clauses.push({ team: { id: { eq: process.env.LINEAR_TEAM_ID } } });
  }

  if (process.env.LINEAR_TEAM_KEY) {
    clauses.push({ team: { key: { eq: process.env.LINEAR_TEAM_KEY } } });
  }

  if (clauses.length === 0) {
    return undefined;
  }

  if (clauses.length === 1) {
    return clauses[0];
  }

  return { and: clauses };
}

async function getExistingIssuesByTitle() {
  const filter = buildTeamFilter();

  if (!filter) {
    return { checked: false, issuesByTitle: new Map() };
  }

  const client = getLinearClient();
  const connection = await client.issues({
    filter,
    first: ISSUE_LOOKUP_LIMIT,
    includeArchived: false,
  });

  const issuesByTitle = new Map();

  for (const issue of connection.nodes) {
    issuesByTitle.set(normalizeTitle(issue.title), {
      identifier: issue.identifier,
      title: issue.title,
      url: issue.url,
    });
  }

  return { checked: true, issuesByTitle };
}

async function runTeams() {
  const client = getLinearClient();
  const connection = await client.teams({ first: 100 });

  console.log("Linear teams (read-only)");
  console.log("Name | Key | ID");

  for (const team of connection.nodes) {
    console.log(`${team.name} | ${team.key} | ${team.id}`);
  }
}

async function runDryRun() {
  if (!existsSync(KANBAN_PATH)) {
    fail("docs/kanban.md was not found.");
  }

  const cards = parseKanbanBoard(readFileSync(KANBAN_PATH, "utf8"));
  const { checked, issuesByTitle } = await getExistingIssuesByTitle();

  console.log("Hermes Linear dry-run (read-only)");
  console.log(`Source: docs/kanban.md`);
  console.log(
    checked
      ? "Linear lookup: enabled by LINEAR_TEAM_ID/LINEAR_TEAM_KEY"
      : "Linear lookup: skipped because no LINEAR_TEAM_ID or LINEAR_TEAM_KEY is configured",
  );
  console.log("");

  for (const card of cards) {
    const existing = issuesByTitle.get(normalizeTitle(card.card));
    const action = existing ? `UPDATE ${existing.identifier}` : "CREATE";

    console.log(`${action}: ${card.card}`);
    console.log(`  Status: ${card.status}`);
    console.log(`  Owner: ${card.owner}`);
    console.log(`  Acceptance: ${card.acceptance}`);

    if (existing) {
      console.log(`  Existing title: ${existing.title}`);
    }
  }

  console.log("");
  console.log("No Linear writes were performed.");
}

async function main() {
  loadEnvLocal();
  assertReadOnlyMode();

  const command = process.argv[2];

  if (!VALID_COMMANDS.has(command)) {
    fail("Usage: node scripts/hermes/linear/cli.mjs <teams|dry-run>", 2);
  }

  if (command === "teams") {
    await runTeams();
    return;
  }

  await runDryRun();
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : "Linear CLI failed.";
  fail(message);
});

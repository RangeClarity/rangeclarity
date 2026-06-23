#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import https from "node:https";
import os from "node:os";
import path from "node:path";

const ROOT_DIR = process.cwd();
const REPO_ENV_PATH = path.join(ROOT_DIR, ".env.local");
const KANBAN_PATH = path.join(ROOT_DIR, "docs", "kanban.md");
const VALID_COMMANDS = new Set(["preview", "send"]);
const SEND_CONFIRM_FLAG = "--confirm-send";

function fail(message, exitCode = 1) {
  console.error(message);
  process.exit(exitCode);
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

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) {
    return false;
  }

  const content = readFileSync(filePath, "utf8");

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

  return true;
}

function findHermesEnvPath() {
  const hermesHome =
    process.env.HERMES_HOME ||
    (process.env.LOCALAPPDATA
      ? path.join(process.env.LOCALAPPDATA, "hermes")
      : path.join(os.homedir(), "AppData", "Local", "hermes"));

  return path.join(hermesHome, ".env");
}

function loadLocalEnv() {
  loadEnvFile(REPO_ENV_PATH);
  loadEnvFile(findHermesEnvPath());
}

function assertReadOnlyLinearMode() {
  const writeFlag = String(process.env.LINEAR_WRITE_ENABLED ?? "")
    .trim()
    .toLowerCase();

  if (["1", "true", "yes", "on"].includes(writeFlag)) {
    fail(
      "Safety error: LINEAR_WRITE_ENABLED is enabled. This summary is read-only.",
    );
  }
}

function missingTelegramEnvNames() {
  const missing = [];

  if (!process.env.TELEGRAM_BOT_TOKEN) {
    missing.push("TELEGRAM_BOT_TOKEN");
  }

  if (!process.env.TELEGRAM_CHAT_ID && !process.env.TELEGRAM_HOME_CHANNEL) {
    missing.push("TELEGRAM_CHAT_ID or TELEGRAM_HOME_CHANNEL");
  }

  return missing;
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

function loadKanbanCards() {
  if (!existsSync(KANBAN_PATH)) {
    fail("docs/kanban.md was not found. Run this command from the repo root.");
  }

  return parseKanbanBoard(readFileSync(KANBAN_PATH, "utf8"));
}

function pickDailyTasks(cards) {
  const doing = cards.filter((card) => card.status.toLowerCase() === "doing");
  const ready = cards.filter((card) => card.status.toLowerCase() === "ready");
  const blocked = cards.filter((card) => card.status.toLowerCase() === "blocked");
  const now = doing[0] || ready[0] || null;
  const next = ready
    .filter((card) => !now || card.card !== now.card)
    .slice(0, 3);

  return { now, next, blocked };
}

function formatBullet(text) {
  return `* ${text}`;
}

function buildBlockers(blockedCards, missingTelegramEnv) {
  const blockers = blockedCards.map((card) =>
    `${card.card}: ${card.acceptance || "Blocked."}`,
  );

  if (!process.env.LINEAR_TEAM_ID && !process.env.LINEAR_TEAM_KEY) {
    blockers.push("Linear team filter not configured; using docs/kanban.md as primary source.");
  }

  if (missingTelegramEnv.length > 0) {
    blockers.push(`Missing Telegram env: ${missingTelegramEnv.join(", ")}`);
  }

  if (blockers.length === 0) {
    blockers.push("None.");
  }

  return blockers;
}

function buildDailyMessage(cards) {
  const { now, next, blocked } = pickDailyTasks(cards);
  const missingTelegramEnv = missingTelegramEnvNames();
  const blockers = buildBlockers(blocked, missingTelegramEnv);
  const lines = [];

  lines.push("🎯 RangeClarity Daily");
  lines.push("");
  lines.push("NOW:");
  lines.push(formatBullet(now ? now.card : "No current task selected."));
  lines.push("");
  lines.push("NEXT:");

  if (next.length > 0) {
    for (const task of next) {
      lines.push(formatBullet(task.card));
    }
  } else {
    lines.push(formatBullet("No next tasks selected."));
  }

  lines.push("");
  lines.push("BLOCKERS:");

  for (const blocker of blockers) {
    lines.push(formatBullet(blocker));
  }

  lines.push("");
  lines.push("RULE:");
  lines.push("Focus on what gets us closer to 10 beta users.");

  return lines.join("\n");
}

function sendTelegramMessage(message) {
  const missing = missingTelegramEnvNames();

  if (missing.length > 0) {
    fail(`Missing Telegram env: ${missing.join(", ")}`);
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID || process.env.TELEGRAM_HOME_CHANNEL;
  const body = new URLSearchParams({ chat_id: chatId, text: message }).toString();

  return new Promise((resolve, reject) => {
    const request = https.request(
      {
        method: "POST",
        hostname: "api.telegram.org",
        path: `/bot${token}/sendMessage`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(body),
        },
        timeout: 20_000,
      },
      (response) => {
        const chunks = [];

        response.on("data", (chunk) => chunks.push(chunk));
        response.on("end", () => {
          let payload = null;

          try {
            payload = JSON.parse(Buffer.concat(chunks).toString("utf8"));
          } catch {
            reject(new Error(`Telegram send failed with status ${response.statusCode}.`));
            return;
          }

          if (!payload?.ok) {
            reject(new Error(`Telegram send failed with status ${response.statusCode}.`));
            return;
          }

          resolve();
        });
      },
    );

    request.on("error", () => {
      reject(new Error("Telegram send failed."));
    });

    request.on("timeout", () => {
      request.destroy(new Error("Telegram send timed out."));
    });

    request.write(body);
    request.end();
  });
}

async function main() {
  loadLocalEnv();
  assertReadOnlyLinearMode();

  const [command, ...args] = process.argv.slice(2);

  if (!VALID_COMMANDS.has(command)) {
    fail("Usage: node scripts/hermes/telegram/daily-summary.mjs <preview|send --confirm-send>", 2);
  }

  const message = buildDailyMessage(loadKanbanCards());

  if (command === "preview") {
    console.log(message);
    return;
  }

  if (!args.includes(SEND_CONFIRM_FLAG)) {
    fail("Safety error: sending requires --confirm-send.", 2);
  }

  await sendTelegramMessage(message);
  console.log("Sent exactly one RangeClarity daily summary.");
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : "Daily summary failed.";
  fail(message);
});

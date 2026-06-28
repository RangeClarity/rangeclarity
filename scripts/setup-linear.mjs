#!/usr/bin/env node
/**
 * Cross-platform Linear setup (Node 20+) — no WSL / bash needed.
 *   node scripts/setup-linear.mjs       (or:  npm run linear:setup)
 *
 * Stores credentials in .env locally. The API key is read with HIDDEN input and
 * is NEVER printed, logged, echoed, or committed. Safe to re-run.
 *
 * Input is read byte-by-byte with our own buffer (not readline), so pasted or
 * fast input is never dropped or misaligned across prompts.
 */
import { existsSync, readFileSync, writeFileSync, chmodSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ENV_FILE = path.join(ROOT, ".env");
const GITIGNORE = path.join(ROOT, ".gitignore");

/* ---- race-proof line reader (raw mode when TTY; buffers leftover bytes) ---- */
const stdin = process.stdin;
let buf = "";
let pending = null; // { resolve, echo, value }
function pump() {
  if (!pending) return;
  while (buf.length) {
    const ch = buf[0];
    buf = buf.slice(1);
    if (ch === "\r" || ch === "\n") {
      if (ch === "\r" && buf[0] === "\n") buf = buf.slice(1);
      const p = pending; pending = null;
      process.stdout.write("\n");
      p.resolve(p.value);
      return;
    } else if (ch === "\u0003") { // Ctrl-C
      process.stdout.write("\n");
      cleanup();
      process.exit(130);
    } else if (ch === "\u007f" || ch === "\b") { // Backspace / Delete
      if (pending.value.length) {
        pending.value = pending.value.slice(0, -1);
        if (pending.echo) process.stdout.write("\b \b");
      }
    } else if (ch >= " ") {
      pending.value += ch;
      if (pending.echo) process.stdout.write(ch);
    }
  }
}
function onData(chunk) { buf += chunk; pump(); }
function startInput() {
  stdin.setEncoding("utf8");
  if (stdin.isTTY) stdin.setRawMode(true);
  stdin.resume();
  stdin.on("data", onData);
}
function cleanup() {
  if (stdin.isTTY) { try { stdin.setRawMode(false); } catch { /* ignore */ } }
  stdin.removeListener("data", onData);
  stdin.pause();
}
function read(prompt, echo) {
  return new Promise((resolve) => {
    process.stdout.write(prompt);
    pending = { resolve, echo, value: "" };
    pump();
  });
}
const ask = async (q) => (await read(q, true)).trim();
const askHidden = async (q) => (await read(q, false)).trim();

/* ---- .env helpers (never print values) ---- */
function loadEnv() {
  const map = new Map();
  if (existsSync(ENV_FILE)) {
    for (const l of readFileSync(ENV_FILE, "utf8").split(/\r?\n/)) {
      const s = l.trim();
      if (!s || s.startsWith("#")) continue;
      const eq = s.indexOf("=");
      if (eq > 0) map.set(s.slice(0, eq).trim(), s.slice(eq + 1));
    }
  }
  return map;
}
function lockPerms() {
  try {
    if (process.platform === "win32") {
      const user = process.env.USERNAME || process.env.USER;
      if (user) spawnSync("icacls", [ENV_FILE, "/inheritance:r", "/grant:r", `${user}:F`], { stdio: "ignore" });
    } else {
      chmodSync(ENV_FILE, 0o600);
    }
  } catch { /* best effort */ }
}
function writeEnv(map) {
  const body = [...map.entries()].map(([k, v]) => `${k}=${v}`).join("\n") + "\n";
  writeFileSync(ENV_FILE, body, { encoding: "utf8" });
  lockPerms();
}
function ensureGitignore() {
  const cur = existsSync(GITIGNORE) ? readFileSync(GITIGNORE, "utf8") : "";
  if (cur.split(/\r?\n/).some((l) => l.trim() === ".env")) { console.log("[ok] .env already in .gitignore"); return; }
  const sep = cur.length && !cur.endsWith("\n") ? "\n" : "";
  writeFileSync(GITIGNORE, cur + sep + "\n# Local secrets (added by setup-linear)\n.env\n", "utf8");
  console.log("[ok] added .env to .gitignore");
}
const validKeyShape = (k) => k && !/\s/.test(k) && k.startsWith("lin_api_");

async function main() {
  console.log("Hermes -> Linear setup (cross-platform)");
  console.log("Repo:", ROOT);
  ensureGitignore();
  if (!existsSync(ENV_FILE)) { writeFileSync(ENV_FILE, "", "utf8"); console.log("[ok] created .env"); }
  lockPerms();
  console.log("[ok] .env ready (permissions restricted)\n");

  startInput();
  const map = loadEnv();

  const key = await askHidden("Linear API key (paste it, then press Enter — input hidden): ");
  if (key) {
    map.set("LINEAR_API_KEY", key);
    console.log("[ok] stored LINEAR_API_KEY (hidden)");
    if (!validKeyShape(key)) {
      console.log("[warn] that value doesn't look like a Linear key (should start with 'lin_api_', no spaces).");
      console.log("       If you pasted a command by mistake, re-run and paste ONLY the key here.");
    }
  } else {
    console.log("[!] no key entered — leaving any existing key unchanged");
  }

  const teamKey = await ask("Linear team KEY (e.g. DEA) [enter to skip]: ");
  if (teamKey) map.set("LINEAR_TEAM_KEY", teamKey);
  const teamId = await ask("Linear team ID (UUID, optional) [enter to skip]: ");
  if (teamId) map.set("LINEAR_TEAM_ID", teamId);
  const projectId = await ask("Linear project ID (optional) [enter to skip]: ");
  if (projectId) map.set("LINEAR_PROJECT_ID", projectId);

  if (!map.has("LINEAR_WRITE_ENABLED")) map.set("LINEAR_WRITE_ENABLED", "false");
  if (!map.has("HERMES_SOURCE_OF_TRUTH")) map.set("HERMES_SOURCE_OF_TRUTH", "docs");

  cleanup();
  writeEnv(map);

  const keySet = Boolean(map.get("LINEAR_API_KEY"));
  console.log("\nDone. Summary (secrets hidden):");
  console.log(`  LINEAR_API_KEY       : ${keySet ? "set (hidden)" : "MISSING"}`);
  console.log(`  LINEAR_TEAM_KEY      : ${map.get("LINEAR_TEAM_KEY") || ""}`);
  console.log(`  LINEAR_TEAM_ID       : ${map.get("LINEAR_TEAM_ID") || ""}`);
  console.log(`  LINEAR_PROJECT_ID    : ${map.get("LINEAR_PROJECT_ID") || ""}`);
  console.log(`  LINEAR_WRITE_ENABLED : ${map.get("LINEAR_WRITE_ENABLED")}`);
  console.log("\nNext: npm run linear:health");
}

main().catch((e) => { console.error("Setup failed:", e.message); process.exitCode = 1; });

/**
 * 7-Day Free Access request store — file-based JSONL, mirrors lib/betaStore.ts.
 * Fully isolated from the paid beta flow. No payment, no TradingView API.
 * TradingView access is granted MANUALLY by a founder.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const DATA_FILE =
  process.env.FREE_ACCESS_FILE ??
  path.join(process.cwd(), ".data", "free-access-requests.jsonl");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type FreeAccessRequest = {
  id: string;
  email: string;
  tradingViewUsername: string;
  fullName?: string;
  note?: string;
  plan: "7_day_free_access";
  status: "pending_manual_tradingview_invite";
  source?: string;
  createdAt: string;
};

export type NewFreeAccessInput = {
  email: unknown;
  tradingViewUsername: unknown;
  fullName?: unknown;
  note?: unknown;
  source?: unknown;
};

export function normalizeEmail(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const email = raw.trim().toLowerCase();
  if (email.length > 254 || !EMAIL_RE.test(email)) return null;
  return email;
}

export function normalizeTvUsername(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const u = raw.trim().replace(/^@+/, "");
  if (u.length < 2 || u.length > 60) return null;
  return u;
}

function clean(raw: unknown, max: number): string | undefined {
  if (typeof raw !== "string") return undefined;
  const s = raw.trim().slice(0, max);
  return s || undefined;
}

async function readAll(): Promise<FreeAccessRequest[]> {
  try {
    const contents = await fs.readFile(DATA_FILE, "utf8");
    return contents
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => JSON.parse(l) as FreeAccessRequest);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

export type AddFreeAccessResult =
  | { status: "added"; request: FreeAccessRequest }
  | { status: "duplicate"; request: FreeAccessRequest };

/** Store a new request. Dedupes by email (prevents repeat submissions). */
export async function addFreeAccessRequest(
  input: NewFreeAccessInput,
): Promise<AddFreeAccessResult> {
  const email = normalizeEmail(input.email);
  const tradingViewUsername = normalizeTvUsername(input.tradingViewUsername);
  if (!email) throw new Error("invalid_email");
  if (!tradingViewUsername) throw new Error("invalid_tv_username");

  const rows = await readAll();
  const existing = rows.find((r) => r.email === email);
  if (existing) return { status: "duplicate", request: existing };

  const request: FreeAccessRequest = {
    id: crypto.randomUUID(),
    email,
    tradingViewUsername,
    fullName: clean(input.fullName, 120),
    note: clean(input.note, 1000),
    plan: "7_day_free_access",
    status: "pending_manual_tradingview_invite",
    source: clean(input.source, 64) ?? "free-access",
    createdAt: new Date().toISOString(),
  };

  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.appendFile(DATA_FILE, JSON.stringify(request) + "\n", "utf8");
  return { status: "added", request };
}

export function listFreeAccessRequests(): Promise<FreeAccessRequest[]> {
  return readAll();
}

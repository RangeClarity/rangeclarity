/**
 * 7-Day Free Access request store — file-based JSONL, mirrors lib/betaStore.ts.
 * Fully isolated from the paid beta flow. No payment, no TradingView API.
 * TradingView access is granted MANUALLY by a founder.
 */
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";

function getDefaultDataFile() {
  if (process.env.VERCEL || process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join(os.tmpdir(), "rangeclarity-free-access-requests.jsonl");
  }

  return path.join(process.cwd(), ".data", "free-access-requests.jsonl");
}

const DATA_FILE =
  process.env.FREE_ACCESS_FILE ??
  getDefaultDataFile();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type FreeAccessRequest = {
  id: string;
  email: string;
  tradingViewUsername: string;
  fullName?: string;
  note?: string;
  plan: "7_day_free_access";
  selectedPlan: "7_day_free_access";
  signupType: "free_access";
  status: "pending_manual_tradingview_invite";
  consentAccepted: true;
  source?: string;
  environment?: string;
  userAgent?: string;
  createdAt: string;
};

export type NewFreeAccessInput = {
  email: unknown;
  tradingViewUsername: unknown;
  fullName?: unknown;
  note?: unknown;
  consentAccepted?: unknown;
  source?: unknown;
  environment?: string;
  userAgent?: string | null;
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

export function createFreeAccessRequest(input: NewFreeAccessInput): FreeAccessRequest {
  const email = normalizeEmail(input.email);
  const tradingViewUsername = normalizeTvUsername(input.tradingViewUsername);
  if (!email) throw new Error("invalid_email");
  if (!tradingViewUsername) throw new Error("invalid_tv_username");
  if (input.consentAccepted !== true) throw new Error("missing_consent");

  return {
    id: crypto.randomUUID(),
    email,
    tradingViewUsername,
    fullName: clean(input.fullName, 120),
    note: clean(input.note, 1000),
    plan: "7_day_free_access",
    selectedPlan: "7_day_free_access",
    signupType: "free_access",
    status: "pending_manual_tradingview_invite",
    consentAccepted: true,
    source: clean(input.source, 64) ?? "free-access",
    environment: clean(input.environment, 80),
    userAgent: clean(input.userAgent, 500),
    createdAt: new Date().toISOString(),
  };
}

/** Store a new request. Dedupes by email (prevents repeat submissions). */
export async function saveFreeAccessRequest(
  request: FreeAccessRequest,
): Promise<AddFreeAccessResult> {
  const rows = await readAll();
  const existing = rows.find((r) => r.email === request.email);
  if (existing) return { status: "duplicate", request: existing };

  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.appendFile(DATA_FILE, JSON.stringify(request) + "\n", "utf8");
  return { status: "added", request };
}

export function addFreeAccessRequest(
  input: NewFreeAccessInput,
): Promise<AddFreeAccessResult> {
  return saveFreeAccessRequest(createFreeAccessRequest(input));
}

export function listFreeAccessRequests(): Promise<FreeAccessRequest[]> {
  return readAll();
}

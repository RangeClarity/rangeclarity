/**
 * Beta lead / user store — minimal, file-based (mirrors lib/waitlist.ts).
 *
 * Newline-delimited JSON in .data/. Records are UPDATED (paid, granted, revoked,
 * refunded, expired), so we read-modify-write the whole file. Fine for the first
 * cohort; swap for a hosted DB later without changing callers.
 *
 * MANUAL fulfilment + verified-access rules (founder direction):
 *  - $0 free_preview never auto-grants invite-only access (manual upgrade only).
 *  - beta_29 / pro_beta_49 can be granted access once paymentStatus = "paid"
 *    (or a founder override), and a TradingView username is always required.
 *  - Refund => access revoked. betaEndDate passed => expired / flagged for review.
 */
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import type { PaymentStatus, SelectedPlan } from "@/lib/payments/types";
import { normalizePlan } from "@/lib/payments/plans";

function getDefaultDataFile() {
  if (process.env.VERCEL || process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join(os.tmpdir(), "rangeclarity-beta-signups.jsonl");
  }

  return path.join(process.cwd(), ".data", "beta-signups.jsonl");
}

const DATA_FILE =
  process.env.BETA_SIGNUPS_FILE ??
  getDefaultDataFile();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BETA_DAYS = Number(process.env.BETA_PERIOD_DAYS ?? "30");

export type UserType =
  | "swing_trader"
  | "investor"
  | "day_trader"
  | "analyst"
  | "other";

/** Stored provider tag (aligns with the founder's spec naming). */
export type PaymentProviderTag =
  | "manual"
  | "lemon_squeezy"
  | "paddle"
  | "whop"
  | "stripe";

export type AccessStatus = "pending" | "granted" | "revoked" | "expired";

const PROVIDER_TAG: Record<string, PaymentProviderTag> = {
  manual: "manual",
  lemonsqueezy: "lemon_squeezy",
  lemon_squeezy: "lemon_squeezy",
  paddle: "paddle",
  whop: "whop",
  stripe: "stripe",
};

export function providerTag(id: string): PaymentProviderTag {
  return PROVIDER_TAG[id] ?? "manual";
}

export type BetaSignup = {
  id: string;
  name: string;
  email: string;
  tradingViewUsername: string;
  userType: UserType;
  selectedPlan: SelectedPlan;
  signupType: "paid_beta" | "free_preview";
  notes?: string;
  source?: string;
  consentAccepted: true;
  environment?: string;
  userAgent?: string;
  paymentProvider: PaymentProviderTag;
  paymentStatus: PaymentStatus;
  accessStatus: AccessStatus;
  betaStartDate?: string;
  betaEndDate?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
};

export type NewSignupInput = {
  name: string;
  email: unknown;
  tradingViewUsername: unknown;
  userType: string;
  selectedPlan?: string;
  notes?: string;
  source?: string;
  consentAccepted?: unknown;
  environment?: string;
  userAgent?: string | null;
};

export function normalizeEmail(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const email = raw.trim().toLowerCase();
  if (email.length > 254 || !EMAIL_RE.test(email)) return null;
  return email;
}

function cleanStr(raw: unknown, max: number): string {
  return typeof raw === "string" ? raw.trim().slice(0, max) : "";
}

const USER_TYPES: UserType[] = [
  "swing_trader",
  "investor",
  "day_trader",
  "analyst",
  "other",
];

function normalizeUserType(raw: unknown): UserType {
  return USER_TYPES.includes(raw as UserType) ? (raw as UserType) : "other";
}

export function normalizeTvUsername(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const u = raw.trim().replace(/^@+/, "");
  if (u.length < 2 || u.length > 60) return null;
  return u;
}

async function readAll(): Promise<BetaSignup[]> {
  try {
    const contents = await fs.readFile(DATA_FILE, "utf8");
    return contents
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => JSON.parse(l) as BetaSignup);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

async function writeAll(rows: BetaSignup[]): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  const body = rows.map((r) => JSON.stringify(r)).join("\n") + "\n";
  await fs.writeFile(DATA_FILE, body, "utf8");
}

export type AddResult =
  | { status: "added"; signup: BetaSignup }
  | { status: "duplicate"; signup: BetaSignup };

export function createBetaSignup(input: NewSignupInput): BetaSignup {
  const email = normalizeEmail(input.email);
  const tradingViewUsername = normalizeTvUsername(input.tradingViewUsername);
  const name = cleanStr(input.name, 120);
  if (!email) throw new Error("invalid_email");
  if (!tradingViewUsername) throw new Error("invalid_tv_username");
  if (!name) throw new Error("invalid_name");
  if (input.consentAccepted !== true) throw new Error("missing_consent");

  const selectedPlan = normalizePlan(input.selectedPlan);
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    name,
    email,
    tradingViewUsername,
    userType: normalizeUserType(input.userType),
    selectedPlan,
    signupType: selectedPlan === "free_preview" ? "free_preview" : "paid_beta",
    notes: cleanStr(input.notes, 1000) || undefined,
    source: cleanStr(input.source, 64) || "beta-landing",
    consentAccepted: true,
    environment: cleanStr(input.environment, 80) || undefined,
    userAgent: cleanStr(input.userAgent, 500) || undefined,
    paymentProvider: providerTag(process.env.PAYMENT_PROVIDER ?? "manual"),
    paymentStatus: "unpaid",
    accessStatus: "pending",
    createdAt: now,
    updatedAt: now,
  };
}

export async function saveBetaSignup(signup: BetaSignup): Promise<AddResult> {
  const rows = await readAll();
  const existing = rows.find((r) => r.email === signup.email);
  if (existing) return { status: "duplicate", signup: existing };

  rows.push(signup);
  await writeAll(rows);
  return { status: "added", signup };
}

/** Register a new lead/user (state: registered, unpaid, access pending). */
export function addSignup(input: NewSignupInput): Promise<AddResult> {
  return saveBetaSignup(createBetaSignup(input));
}

async function update(
  id: string,
  patch: Partial<BetaSignup>,
): Promise<BetaSignup | null> {
  const rows = await readAll();
  const i = rows.findIndex((r) => r.id === id);
  if (i === -1) return null;
  rows[i] = { ...rows[i], ...patch, updatedAt: new Date().toISOString() };
  await writeAll(rows);
  return rows[i];
}

export function findById(id: string): Promise<BetaSignup | null> {
  return readAll().then((rows) => rows.find((r) => r.id === id) ?? null);
}

export function listSignups(): Promise<BetaSignup[]> {
  return readAll();
}

export function markCheckoutPending(
  id: string,
  providerId: string,
): Promise<BetaSignup | null> {
  return update(id, { paymentStatus: "pending", paymentProvider: providerTag(providerId) });
}

export function markPaidManual(id: string): Promise<BetaSignup | null> {
  return update(id, { paymentStatus: "paid" });
}

export function markFailed(id: string): Promise<BetaSignup | null> {
  return update(id, { paymentStatus: "failed" });
}

/** Refund => payment refunded AND access revoked. */
export function markRefunded(id: string): Promise<BetaSignup | null> {
  return update(id, { paymentStatus: "refunded", accessStatus: "revoked" });
}

export type GrantResult =
  | { ok: true; signup: BetaSignup }
  | { ok: false; reason: string };

/**
 * Grant invite-only TradingView access (manual). Verified-access rules:
 *  - TradingView username is required.
 *  - Unless override, plan must be beta_29/pro_beta_49 AND paymentStatus "paid".
 *  - Sets the beta window (start = now, end = now + BETA_PERIOD_DAYS) if unset.
 */
export async function grantAccessManual(
  id: string,
  opts?: { override?: boolean },
): Promise<GrantResult | null> {
  const rows = await readAll();
  const i = rows.findIndex((r) => r.id === id);
  if (i === -1) return null;
  const s = rows[i];
  if (!s.tradingViewUsername) {
    return { ok: false, reason: "A TradingView username is required before access can be granted." };
  }
  if (!opts?.override) {
    if (s.selectedPlan === "free_preview") {
      return { ok: false, reason: "Free preview is not eligible for invite-only access. Upgrade the plan or use override." };
    }
    if (s.paymentStatus !== "paid") {
      return { ok: false, reason: "Payment is not confirmed (paymentStatus must be 'paid'). Mark paid or use override." };
    }
  }
  const now = new Date();
  const start = s.betaStartDate ?? now.toISOString();
  const end =
    s.betaEndDate ??
    new Date(now.getTime() + BETA_DAYS * 86400000).toISOString();
  rows[i] = {
    ...s,
    accessStatus: "granted",
    betaStartDate: start,
    betaEndDate: end,
    updatedAt: now.toISOString(),
  };
  await writeAll(rows);
  return { ok: true, signup: rows[i] };
}

export function revokeAccessManual(id: string): Promise<BetaSignup | null> {
  return update(id, { accessStatus: "revoked" });
}

/** Manual plan upgrade (e.g. free_preview -> beta_29). */
export function setPlan(id: string, plan: string): Promise<BetaSignup | null> {
  return update(id, { selectedPlan: normalizePlan(plan) });
}

export function setAdminNotes(id: string, notes: string): Promise<BetaSignup | null> {
  return update(id, { adminNotes: notes.slice(0, 2000) });
}

/** Sweep: any granted access whose betaEndDate has passed becomes "expired". */
export async function expireOverdue(): Promise<{ expired: number }> {
  const rows = await readAll();
  const now = Date.now();
  let expired = 0;
  for (const r of rows) {
    if (
      r.accessStatus === "granted" &&
      r.betaEndDate &&
      Date.parse(r.betaEndDate) < now
    ) {
      r.accessStatus = "expired";
      r.updatedAt = new Date().toISOString();
      expired += 1;
    }
  }
  if (expired) await writeAll(rows);
  return { expired };
}

/** True if granted but past betaEndDate (flagged for review, not yet persisted). */
export function isOverdue(s: BetaSignup): boolean {
  return (
    s.accessStatus === "granted" &&
    !!s.betaEndDate &&
    Date.parse(s.betaEndDate) < Date.now()
  );
}

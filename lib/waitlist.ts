/**
 * Waitlist persistence - intentionally minimal.
 *
 * The master plan defers any database/backend until demand proves otherwise
 * (RANGECLARITY_MASTER_PLAN.md sec.13). For the MVP landing page we persist signups
 * to a local newline-delimited JSON file. This is the single integration point:
 * to switch to a hosted form / ESP / DB later, replace `addEntry` only.
 *
 * Note: serverless filesystems (e.g. Vercel) are ephemeral/read-only at runtime.
 * `WAITLIST_FILE` lets you point at a writable location, and write failures are
 * surfaced so a hosted provider can be wired in without changing callers.
 */
import { promises as fs } from "node:fs";
import path from "node:path";

const DATA_FILE =
  process.env.WAITLIST_FILE ?? path.join(process.cwd(), ".data", "waitlist.jsonl");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type WaitlistEntry = {
  email: string;
  createdAt: string;
  source?: string;
};

export function normalizeEmail(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const email = raw.trim().toLowerCase();
  if (email.length > 254 || !EMAIL_RE.test(email)) return null;
  return email;
}

async function readAll(): Promise<WaitlistEntry[]> {
  try {
    const contents = await fs.readFile(DATA_FILE, "utf8");
    return contents
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => JSON.parse(line) as WaitlistEntry);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

export type AddResult = { status: "added" | "duplicate" };

export async function addEntry(
  email: string,
  source?: string,
): Promise<AddResult> {
  const existing = await readAll();
  if (existing.some((e) => e.email === email)) {
    return { status: "duplicate" };
  }

  const entry: WaitlistEntry = {
    email,
    createdAt: new Date().toISOString(),
    ...(source ? { source } : {}),
  };

  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.appendFile(DATA_FILE, JSON.stringify(entry) + "\n", "utf8");
  return { status: "added" };
}

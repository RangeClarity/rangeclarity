/** Private beta feedback store — append-only newline-delimited JSON in .data/. */
import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const DATA_FILE =
  process.env.BETA_FEEDBACK_FILE ??
  path.join(process.cwd(), ".data", "beta-feedback.jsonl");

export type Feedback = {
  id: string;
  signupId?: string;
  email?: string;
  rating?: number;
  clarity?: string;
  message: string;
  createdAt: string;
};

export async function addFeedback(input: {
  signupId?: string;
  email?: string;
  rating?: number;
  clarity?: string;
  message: string;
}): Promise<Feedback> {
  const fb: Feedback = {
    id: crypto.randomUUID(),
    signupId: input.signupId,
    email: input.email,
    rating: input.rating,
    clarity: input.clarity,
    message: input.message.slice(0, 4000),
    createdAt: new Date().toISOString(),
  };
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.appendFile(DATA_FILE, JSON.stringify(fb) + "\n", "utf8");
  return fb;
}

export async function listFeedback(): Promise<Feedback[]> {
  try {
    const c = await fs.readFile(DATA_FILE, "utf8");
    return c
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => JSON.parse(l) as Feedback);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

/**
 * Hermes integration — turn blockers / action items from a daily update into
 * Linear issues, safely.
 *
 *  - Title format:  [Hermes] <short action/blocker>
 *  - Description includes: Source, Date, Type, Context, Next step.
 *  - DRY-RUN by default. Real issues are created only when the caller passes
 *    write=true (derived from isWriteEnabled(config) / LINEAR_WRITE_ENABLED).
 *  - Idempotent: uses findOrCreateIssue (exact-title match) so re-runs don't
 *    duplicate an existing [Hermes] issue.
 */

import { findOrCreateIssue } from "./client.mjs";

const MAX_TITLE = 80;

const KIND_PRIORITY = { blocker: 1, decision: 2, action: 3 }; // Urgent / High / Medium

function shorten(text, n = MAX_TITLE) {
  const clean = String(text).replace(/\s+/g, " ").trim();
  return clean.length <= n ? clean : `${clean.slice(0, n - 1).trimEnd()}…`;
}

/**
 * Extract action items from a daily update.
 * Accepts either a structured object:
 *   { date, source, blockers:[], decisions:[], actions:[] }
 * or a markdown/text update, from which it reads the
 * 🚧 Blockers / 🧠 Decisions / 🎯 Today sections.
 * Returns: [{ kind, text, context, nextStep }]
 */
export function extractActionItems(update) {
  if (update && typeof update === "object" && !Array.isArray(update)) {
    const items = [];
    for (const [kind, key] of [
      ["blocker", "blockers"],
      ["decision", "decisions"],
      ["action", "actions"],
    ]) {
      for (const entry of update[key] || []) {
        if (typeof entry === "string") items.push({ kind, text: entry });
        else items.push({ kind, text: entry.text, context: entry.context, nextStep: entry.nextStep });
      }
    }
    return items.filter((i) => i.text && i.text.trim());
  }

  // Text fallback: scan sections by header keywords.
  const text = String(update || "");
  const lines = text.split(/\r?\n/);
  const items = [];
  let kind = null;
  const headerKind = (l) => {
    const s = l.toLowerCase();
    if (/blocker/.test(s)) return "blocker";
    if (/decision/.test(s)) return "decision";
    if (/today|action item|action items|🎯/.test(s)) return "action";
    if (/yesterday|✅|summary|update —|update -/.test(s)) return "skip";
    return null;
  };
  for (const raw of lines) {
    const maybe = headerKind(raw);
    // A header line is short-ish and not itself a bullet.
    if (maybe && !/^\s*[-*•\d]/.test(raw) && raw.trim().length < 60) {
      kind = maybe === "skip" ? null : maybe;
      continue;
    }
    const bullet = raw.match(/^\s*(?:[-*•]|\d+[.)])\s+(.*\S)\s*$/);
    if (bullet && kind) items.push({ kind, text: bullet[1] });
  }
  return items;
}

/** Build a Linear issue (title/description/priority) from one action item. */
export function issueFromActionItem(item, meta = {}) {
  const date = meta.date || new Date().toISOString().slice(0, 10);
  const source = meta.source || "RangeClarity daily update";
  const kindLabel = { blocker: "Blocker", decision: "Decision needed", action: "Action item" }[item.kind] || "Item";
  const nextStep =
    item.nextStep ||
    (item.kind === "decision"
      ? "Dean to decide; record the decision in docs/kanban.md."
      : item.kind === "blocker"
        ? "Unblock or escalate; track to resolution."
        : "Assign an owner and schedule.");

  const description = [
    `**Source:** ${source}`,
    `**Date:** ${date}`,
    `**Type:** ${kindLabel}`,
    "",
    "**Context:**",
    item.context ? `${item.text}\n\n${item.context}` : item.text,
    "",
    "**Next step:**",
    nextStep,
    "",
    `<!-- hermes:source=daily-update;date=${date};kind=${item.kind} -->`,
  ].join("\n");

  return {
    title: `[Hermes] ${shorten(item.text)}`,
    description,
    priority: KIND_PRIORITY[item.kind] ?? 3,
  };
}

/**
 * Sync action items to Linear. DRY-RUN unless `write === true`.
 * Returns a results array describing what was (or would be) done.
 */
export async function syncActionItems({ apiKey, items, meta = {}, teamId = "", teamKey = "", projectId = "", write = false }) {
  const results = [];
  for (const item of items) {
    const issue = issueFromActionItem(item, meta);
    if (!write) {
      results.push({ action: "PLAN", kind: item.kind, title: issue.title });
      continue;
    }
    try {
      const r = await findOrCreateIssue({
        apiKey,
        title: issue.title,
        description: issue.description,
        priority: issue.priority,
        teamId,
        teamKey,
        projectId,
        write: true,
      });
      if (r.found) results.push({ action: "EXISTS", title: issue.title, url: r.issue.url, id: r.issue.identifier });
      else if (r.created) results.push({ action: "CREATED", title: issue.title, url: r.issue.url, id: r.issue.identifier });
      else results.push({ action: "PLAN", title: issue.title });
    } catch (e) {
      results.push({ action: "ERROR", title: issue.title, error: e.message });
    }
  }
  return results;
}

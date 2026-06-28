/**
 * Linear client module — the named operations Hermes uses.
 *
 * Built on the dependency-free GraphQL helper in lib.mjs. Reads/writes only;
 * never logs the API key. Write operations require an explicit `write === true`
 * argument, which callers derive from isWriteEnabled(config) — see cli.mjs.
 */

import {
  graphql,
  getViewer,
  getTeams,
  resolveTeam,
  getProject,
  findIssueByTitle,
  issueCreate,
} from "./lib.mjs";

/** healthCheckLinear(): query viewer { id name email } — confirms the token works. */
export async function healthCheckLinear(apiKey) {
  const viewer = await getViewer(apiKey);
  return { ok: true, viewer };
}

/** listTeams(): query teams { nodes { id key name } } */
export async function listTeams(apiKey) {
  return getTeams(apiKey);
}

/** Optional: confirm a project id resolves (read-only). */
export async function checkProject(apiKey, projectId) {
  if (!projectId) return null;
  return getProject(apiKey, projectId);
}

/**
 * createLinearIssue({ title, description, priority, teamId, teamKey, projectId })
 *
 * Resolves the team (id or key), builds the IssueCreateInput, and EITHER:
 *   - write === true  → creates the issue and returns { created:true, issue }
 *   - write !== true  → returns { created:false, planned:{ teamId, input } } (dry-run)
 */
export async function createLinearIssue({
  apiKey,
  title,
  description = "",
  priority = 0,
  teamId = "",
  teamKey = "",
  projectId = "",
  write = false,
}) {
  if (!apiKey) throw new Error("createLinearIssue: missing API key");
  if (!title) throw new Error("createLinearIssue: missing title");

  const team = await resolveTeam(apiKey, { teamId, teamKey });
  const input = { teamId: team.id, title, description, priority };
  if (projectId) input.projectId = projectId;

  if (!write) {
    return { created: false, team, planned: input };
  }
  const res = await issueCreate(apiKey, input);
  if (!res.success) throw new Error(`issueCreate failed for "${title}"`);
  return { created: true, team, issue: res.issue };
}

/**
 * findOrCreateIssue(): safe — searches by exact title first (read-only). If a
 * matching issue exists, returns it without writing. Otherwise behaves like
 * createLinearIssue (still gated by `write`).
 */
export async function findOrCreateIssue(opts) {
  const { apiKey, title, teamId = "", teamKey = "" } = opts;
  const team = await resolveTeam(apiKey, { teamId, teamKey });
  const existing = await findIssueByTitle(apiKey, team.id, title);
  if (existing) {
    return { created: false, found: true, team, issue: existing };
  }
  const result = await createLinearIssue({ ...opts, teamId: team.id });
  return { ...result, found: false };
}

export { graphql };

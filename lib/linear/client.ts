import { LinearClient } from "@linear/sdk";
import type { LinearBoardIssue } from "./types";

const DEFAULT_ISSUE_LIMIT = 50;

type IssuesVariables = NonNullable<Parameters<LinearClient["issues"]>[0]>;
type IssueFilter = NonNullable<IssuesVariables["filter"]>;

class LinearConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LinearConfigurationError";
  }
}

function requireApiKey() {
  const apiKey = process.env.LINEAR_API_KEY;

  if (!apiKey) {
    throw new LinearConfigurationError(
      "LINEAR_API_KEY is not configured. Add it to .env.local to load Linear issues.",
    );
  }

  return apiKey;
}

function getLinearClient() {
  return new LinearClient({ apiKey: requireApiKey() });
}

function getIssueLimit() {
  const parsed = Number(process.env.LINEAR_ISSUE_LIMIT ?? DEFAULT_ISSUE_LIMIT);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return DEFAULT_ISSUE_LIMIT;
  }

  return Math.min(Math.floor(parsed), 100);
}

function buildIssueFilter(): IssueFilter | undefined {
  const clauses: unknown[] = [];

  if (process.env.LINEAR_PROJECT_ID) {
    clauses.push({ project: { id: { eq: process.env.LINEAR_PROJECT_ID } } });
  }

  if (process.env.LINEAR_MILESTONE_ID) {
    clauses.push({
      projectMilestone: { id: { eq: process.env.LINEAR_MILESTONE_ID } },
    });
  }

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
    return clauses[0] as IssueFilter;
  }

  return { and: clauses } as IssueFilter;
}

export function isLinearWriteEnabled() {
  return process.env.LINEAR_WRITE_ENABLED === "true";
}

export function getLinearScopeLabel() {
  if (process.env.LINEAR_PROJECT_ID) {
    return `Project ${process.env.LINEAR_PROJECT_ID}`;
  }

  if (process.env.LINEAR_MILESTONE_ID) {
    return `Milestone ${process.env.LINEAR_MILESTONE_ID}`;
  }

  if (process.env.LINEAR_TEAM_KEY) {
    return `Team ${process.env.LINEAR_TEAM_KEY}`;
  }

  if (process.env.LINEAR_TEAM_ID) {
    return `Team ${process.env.LINEAR_TEAM_ID}`;
  }

  return "All accessible issues";
}

async function mapIssue(issue: Awaited<ReturnType<LinearClient["issue"]>>) {
  const state = await issue.state;

  return {
    id: issue.id,
    identifier: issue.identifier,
    title: issue.title,
    description: issue.description ?? null,
    url: issue.url,
    dueDate: issue.dueDate ? String(issue.dueDate) : null,
    createdAt: issue.createdAt.toISOString(),
    status: state
      ? {
          id: state.id,
          name: state.name,
          type: state.type,
          color: state.color ?? null,
        }
      : null,
  } satisfies LinearBoardIssue;
}

export async function listLinearIssues() {
  const client = getLinearClient();
  const connection = await client.issues({
    filter: buildIssueFilter(),
    first: getIssueLimit(),
    includeArchived: false,
  });

  const issues = await Promise.all(connection.nodes.map(mapIssue));

  return issues.sort((a, b) => {
    if (a.dueDate && b.dueDate) {
      return a.dueDate.localeCompare(b.dueDate);
    }

    if (a.dueDate) {
      return -1;
    }

    if (b.dueDate) {
      return 1;
    }

    return b.createdAt.localeCompare(a.createdAt);
  });
}

export async function updateLinearIssueDueDate(issueId: string, dueDate: string) {
  if (!isLinearWriteEnabled()) {
    throw new LinearConfigurationError(
      "Linear writes are disabled. Set LINEAR_WRITE_ENABLED=true to update due dates.",
    );
  }

  const client = getLinearClient();
  const payload = await client.updateIssue(issueId, { dueDate });

  if (!payload.success || !payload.issue) {
    throw new Error("Linear did not confirm the issue update.");
  }

  const issue = await payload.issue;
  return mapIssue(issue);
}

export function getLinearErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Linear request failed.";
}

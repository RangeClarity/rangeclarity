"use client";

import { useMemo, useState } from "react";
import type { LinearBoardIssue, LinearBoardPayload } from "@/lib/linear/types";
import styles from "./linear-board.module.css";

type ColumnId = "overdue" | "today" | "tomorrow" | "later";

type BoardColumn = {
  id: ColumnId;
  title: string;
  targetDate: string;
  hint: string;
};

type Props = {
  initialError: string | null;
  initialIssues: LinearBoardIssue[];
  scope: string;
  writeEnabled: boolean;
};

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function getColumns(): BoardColumn[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return [
    {
      id: "overdue",
      title: "Overdue",
      targetDate: formatDate(addDays(today, -1)),
      hint: "Past due",
    },
    {
      id: "today",
      title: "Today",
      targetDate: formatDate(today),
      hint: "Due today",
    },
    {
      id: "tomorrow",
      title: "Tomorrow",
      targetDate: formatDate(addDays(today, 1)),
      hint: "Due next day",
    },
    {
      id: "later",
      title: "Later",
      targetDate: formatDate(addDays(today, 7)),
      hint: "Due in one week",
    },
  ];
}

function getColumnForIssue(issue: LinearBoardIssue, columns: BoardColumn[]) {
  const today = columns.find((column) => column.id === "today")?.targetDate;
  const tomorrow = columns.find((column) => column.id === "tomorrow")?.targetDate;

  if (!today || !tomorrow || !issue.dueDate) {
    return "later";
  }

  if (issue.dueDate < today) {
    return "overdue";
  }

  if (issue.dueDate === today) {
    return "today";
  }

  if (issue.dueDate === tomorrow) {
    return "tomorrow";
  }

  return "later";
}

function formatReadableDate(value: string | null) {
  if (!value) {
    return "No due date";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function statusClass(type: string | undefined) {
  switch (type) {
    case "completed":
      return styles.statusCompleted;
    case "started":
      return styles.statusStarted;
    case "canceled":
      return styles.statusCanceled;
    case "backlog":
    case "unstarted":
      return styles.statusTodo;
    default:
      return styles.statusDefault;
  }
}

export function DailyKanbanBoard({
  initialError,
  initialIssues,
  scope,
  writeEnabled,
}: Props) {
  const [issues, setIssues] = useState(initialIssues);
  const [draggedIssueId, setDraggedIssueId] = useState<string | null>(null);
  const [pendingIssueId, setPendingIssueId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(initialError);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const columns = useMemo(getColumns, []);

  const groupedIssues = useMemo(() => {
    return columns.reduce<Record<ColumnId, LinearBoardIssue[]>>(
      (acc, column) => {
        acc[column.id] = issues.filter(
          (issue) => getColumnForIssue(issue, columns) === column.id,
        );
        return acc;
      },
      { overdue: [], today: [], tomorrow: [], later: [] },
    );
  }, [columns, issues]);

  async function refreshIssues() {
    setIsRefreshing(true);
    setMessage(null);

    try {
      const response = await fetch("/api/linear/issues", { cache: "no-store" });
      const payload = (await response.json()) as LinearBoardPayload & {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error ?? "Could not refresh Linear issues.");
      }

      setIssues(payload.issues);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Refresh failed.");
    } finally {
      setIsRefreshing(false);
    }
  }

  async function moveIssue(issueId: string, column: BoardColumn) {
    const issue = issues.find((candidate) => candidate.id === issueId);

    if (!issue || issue.dueDate === column.targetDate) {
      return;
    }

    const previousIssues = issues;
    setPendingIssueId(issueId);
    setMessage(null);
    setIssues((current) =>
      current.map((candidate) =>
        candidate.id === issueId
          ? { ...candidate, dueDate: column.targetDate }
          : candidate,
      ),
    );

    try {
      const response = await fetch("/api/linear/issues", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issueId, dueDate: column.targetDate }),
      });
      const payload = (await response.json()) as {
        issue?: LinearBoardIssue;
        error?: string;
      };

      if (!response.ok || !payload.issue) {
        throw new Error(payload.error ?? "Linear due-date update failed.");
      }

      setIssues((current) =>
        current.map((candidate) =>
          candidate.id === issueId ? payload.issue! : candidate,
        ),
      );
    } catch (error) {
      setIssues(previousIssues);
      setMessage(error instanceof Error ? error.message : "Move failed.");
    } finally {
      setPendingIssueId(null);
    }
  }

  function handleDrop(column: BoardColumn) {
    if (!draggedIssueId) {
      return;
    }

    void moveIssue(draggedIssueId, column);
    setDraggedIssueId(null);
  }

  return (
    <section className={styles.boardWrap} aria-label="Daily Linear Kanban board">
      <div className={styles.toolbar}>
        <div>
          <span className={styles.toolbarLabel}>Source</span>
          <strong>{scope}</strong>
        </div>
        <button
          className={styles.refreshButton}
          disabled={isRefreshing}
          onClick={() => void refreshIssues()}
          type="button"
        >
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {message ? (
        <p className={styles.notice} role="status">
          {message}
        </p>
      ) : null}

      {!writeEnabled ? (
        <p className={styles.notice}>
          Dragging is active, but Linear writes require{" "}
          <code>LINEAR_WRITE_ENABLED=true</code>.
        </p>
      ) : null}

      <div className={styles.board}>
        {columns.map((column) => (
          <section
            className={styles.column}
            key={column.id}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => handleDrop(column)}
          >
            <header className={styles.columnHeader}>
              <div>
                <h2>{column.title}</h2>
                <span>{column.hint}</span>
              </div>
              <strong>{groupedIssues[column.id].length}</strong>
            </header>

            <div className={styles.cardStack}>
              {groupedIssues[column.id].map((issue) => (
                <article
                  aria-busy={pendingIssueId === issue.id}
                  className={styles.card}
                  draggable
                  key={issue.id}
                  onDragEnd={() => setDraggedIssueId(null)}
                  onDragStart={(event) => {
                    setDraggedIssueId(issue.id);
                    event.dataTransfer.effectAllowed = "move";
                    event.dataTransfer.setData("text/plain", issue.id);
                  }}
                >
                  <div className={styles.cardTop}>
                    <a href={issue.url} rel="noreferrer" target="_blank">
                      {issue.identifier}
                    </a>
                    <span
                      className={`${styles.statusPill} ${statusClass(
                        issue.status?.type,
                      )}`}
                    >
                      {issue.status?.name ?? "No status"}
                    </span>
                  </div>

                  <h3>{issue.title}</h3>

                  {issue.description ? (
                    <p className={styles.description}>{issue.description}</p>
                  ) : null}

                  <dl className={styles.cardMeta}>
                    <div>
                      <dt>Due</dt>
                      <dd>{formatReadableDate(issue.dueDate)}</dd>
                    </div>
                    <div>
                      <dt>Created</dt>
                      <dd>{formatReadableDate(issue.createdAt.slice(0, 10))}</dd>
                    </div>
                  </dl>

                  <div className={styles.moveRow} aria-label="Move issue">
                    {columns
                      .filter((target) => target.id !== column.id)
                      .map((target) => (
                        <button
                          disabled={pendingIssueId === issue.id}
                          key={target.id}
                          onClick={() => void moveIssue(issue.id, target)}
                          type="button"
                        >
                          {target.title}
                        </button>
                      ))}
                  </div>
                </article>
              ))}

              {groupedIssues[column.id].length === 0 ? (
                <div className={styles.emptyState}>No issues here.</div>
              ) : null}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import { DailyKanbanBoard } from "./DailyKanbanBoard";
import {
  getLinearErrorMessage,
  getLinearScopeLabel,
  isLinearWriteEnabled,
  listLinearIssues,
} from "@/lib/linear/client";
import type { LinearBoardIssue } from "@/lib/linear/types";
import styles from "./linear-board.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Daily Linear Board - RangeClarity",
  description: "A due-date based Linear Kanban board for daily execution.",
};

export default async function LinearBoardPage() {
  let issues: LinearBoardIssue[] = [];
  let error: string | null = null;

  try {
    issues = await listLinearIssues();
  } catch (caught) {
    error = getLinearErrorMessage(caught);
  }

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>RangeClarity Ops</p>
            <h1>Daily Linear Board</h1>
            <p className={styles.lead}>
              Issues are grouped by due date so the daily plan stays visible.
              Linear status remains on each card as the source of workflow truth.
            </p>
          </div>
          <div className={styles.metaPanel}>
            <span>Scope</span>
            <strong>{getLinearScopeLabel()}</strong>
            <span>Writes</span>
            <strong>{isLinearWriteEnabled() ? "Enabled" : "Read-only"}</strong>
          </div>
        </header>

        <DailyKanbanBoard
          initialError={error}
          initialIssues={issues}
          scope={getLinearScopeLabel()}
          writeEnabled={isLinearWriteEnabled()}
        />
      </section>
    </main>
  );
}

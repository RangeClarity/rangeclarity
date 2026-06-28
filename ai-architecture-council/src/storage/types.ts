import type { CouncilSession } from "@/schema/council";
import type { HermesPlan } from "@/schema/hermes";
import type { LinearPreview } from "@/schema/linear";

/** Persistence boundary. MVP = Prisma + SQLite (see prisma/schema.prisma); swap for Postgres later.
 *  Everything is saved: prompt, responses, debate, decision, hermes plan, linear preview, timestamps,
 *  agent versions, project, branch. */
export interface SessionStore {
  saveSession(s: CouncilSession): Promise<void>;
  getSession(id: string): Promise<CouncilSession | null>;
  listSessions(opts?: { project?: string; limit?: number }): Promise<CouncilSession[]>;
  saveHermesPlan(p: HermesPlan): Promise<void>;
  saveLinearPreview(p: LinearPreview): Promise<void>;
}

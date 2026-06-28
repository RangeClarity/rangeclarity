# Database schema

MVP = **Prisma + SQLite** (`prisma/schema.prisma`, `DATABASE_URL="file:./council.db"`). Typed Zod payloads are
stored in JSON columns so the schema (the Zod files) stays the single source of truth; swap the datasource to
Postgres for multi-user later — no code change beyond the connection string.

| Model | Key fields | Holds |
|---|---|---|
| **Session** | id, createdAt, prompt, mode, project, branch, agentIds(JSON), weights(JSON), rounds, agentVersions(JSON), debate(JSON), decision(JSON) | one consult |
| **Result** | sessionId→, agentId, agentLabel, agentVersion, round, status, weight, raw, normalized(JSON), error, latencyMs | one agent×round |
| **HermesPlan** | id, sessionId(unique)→, payload(JSON HermesPlan) | the execution plan |
| **LinearPreview** | id, sessionId(unique)→, hermesPlanId, payload(JSON drafts), created(JSON LinearCreateResult[]) | preview + post-approval results |

**Persisted (the "save everything" requirement):** original prompt · every agent response (raw + normalized, all
rounds) · debate report · decision · hermes plan · linear preview + create results · timestamps · **agent versions**
· **project** · **branch**.

**Access** is through the `SessionStore` interface (`src/storage/types.ts`) so the rest of the app never touches
Prisma directly — a JSON-file store or Postgres store can be dropped in for tests/scale.

Setup: `npm run db:generate && npm run db:push`.

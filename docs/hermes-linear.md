# Hermes → Linear integration

A small, dependency-free adapter that turns the Markdown kanban board
([`docs/kanban.md`](./kanban.md)) into Linear issues — **safely**. It defaults to
preview-only and refuses to write to Linear until you explicitly open two gates.

- Code: `scripts/hermes/linear/` (`cli.mjs` + `lib.mjs`, Node 20+, no extra deps).
- Source of truth: `docs/kanban.md` (`HERMES_SOURCE_OF_TRUTH=docs`). Linear is a
  downstream mirror; this tool never edits the kanban file.

> This adapter does **not** start the live Hermes agent and does **not** send
> Telegram messages. It only validates config and (when approved) creates/updates
> Linear issues.

---

## What it does / does not do

**Can:**
- Validate that a Linear API key works — without ever printing the key.
- Resolve and confirm the target team (and optional project).
- Parse `docs/kanban.md` into Linear issue payloads.
- Show a full **dry-run** plan of create/update actions.
- Create/update issues **only** when both safety gates are open.
- Stay idempotent: each issue carries a hidden marker `<!-- hermes:kanban-id=RC-1 -->`
  so re-runs **update** the same issue instead of duplicating it.

**Cannot / will not:**
- Print, log, or commit secrets (the key is reported only as "present/MISSING").
- Write to Linear by default (dry-run is on, writes are off).
- Delete Linear issues, or edit the kanban file.
- Start Hermes polling / the live agent, or send Telegram.
- Invent tasks — it only syncs what is written in the board.

---

## 1. Setup

1. **Create a Linear personal API key**: Linear → **Settings → Security & access →
   API → Personal API keys → Create key**. Copy it once.
2. **Store it safely** in `.env.local` (already gitignored) at the repo root — never
   in `.env.example`, never in a commit:
   ```bash
   LINEAR_API_KEY=lin_api_xxx   # real key here, in .env.local only
   LINEAR_DRY_RUN=true
   HERMES_ALLOW_LINEAR_WRITE=false
   HERMES_SOURCE_OF_TRUTH=docs
   ```
   (Alternatively, export these in the Hermes scheduled task's own environment.)
3. **Validate**:
   ```bash
   npm run hermes:linear:validate
   ```
   With no key set, this reports "not configured yet" and exits cleanly. With a key,
   it confirms who you authenticated as and lists the team's workflow states.

## 2. Required Linear token permissions

A **personal API key** acts as you, so it already has access to your teams. The key
needs to be able to:
- **read** your viewer/teams/projects/issues (used by `validate` and `dry-run`), and
- **write** issues (`issueCreate` / `issueUpdate`) — only exercised by an approved `sync`.

No admin or OAuth scopes are required for the dry-run flow. If you later switch to an
OAuth app, grant `read` and `write` (issues) scopes.

## 3. Finding the team / project IDs

Run `npm run hermes:linear:validate` once the key is set — it prints the team name,
key, and workflow states for the configured `LINEAR_TEAM_ID`. To discover IDs:

- **Team:** Linear → team → **Settings**; the team **key** (e.g. `DEA`) is shown, and
  the UUID is in the URL. You can set `LINEAR_TEAM_ID` to either the UUID or the key.
- **Project:** open the project; its id/slug is in the URL
  (`linear.app/<org>/project/<name>-<id>`).

> **This workspace (discovered read-only):** the only team is **"Dean Lich" (key
> `DEA`)**. Projects present: `Hermes Agent OS`, `Taskoza`, `FolioVantage`. There is
> **no "RangeClarity" project yet** — create one in Linear if you want RC-* issues
> grouped, then set `LINEAR_PROJECT_ID`. Until then, leave it unset and issues land in
> the `DEA` team backlog.

## 4. Dry-run flow (safe; do this first)

```bash
npm run hermes:linear:dry-run
```

- Reads `docs/kanban.md`, builds payloads, and prints a CREATE/UPDATE plan.
- If a key + team id are configured, it queries Linear (read-only) to classify each
  ticket as CREATE (new) or UPDATE (marker already exists). Without them, everything
  is shown as CREATE (planned).
- **Never writes.** Review the plan and the kanban file until the plan looks right.

## 5. Real sync flow (explicit approval required)

`sync` writes **only** when *every* gate is open:

| Gate | Safe default | Required for write |
|---|---|---|
| `HERMES_ALLOW_LINEAR_WRITE` | `false` | `true` |
| `LINEAR_DRY_RUN` | `true` | `false` |
| Command | — | `sync` (not `validate`/`dry-run`) |
| `--dry-run` flag | — | absent |
| `LINEAR_API_KEY` + `LINEAR_TEAM_ID` | — | both set |

If any gate is closed, `sync` **automatically falls back to a dry-run** and tells you
which gate stopped it. To perform a real, reviewed sync:

```bash
# in .env.local (or the task env), after reviewing the dry-run:
HERMES_ALLOW_LINEAR_WRITE=true
LINEAR_DRY_RUN=false

npm run hermes:linear:sync
```

Re-running is safe: existing Hermes-managed issues are updated in place (matched by
the hidden marker), not duplicated. Tip: `--limit=1` to sync a single ticket first.

## 6. Rollback / fallback plan

- **Disable instantly:** set `HERMES_ALLOW_LINEAR_WRITE=false` (or `LINEAR_DRY_RUN=true`).
  All writes stop immediately; the tool reverts to preview-only.
- **Source of truth stays local:** `docs/kanban.md` is authoritative. If Linear drifts
  or a sync looks wrong, the board is unaffected — fix the board and re-dry-run.
- **Undo created issues:** the tool never deletes. Cancel/trash the issues in Linear by
  hand (search the title prefix, e.g. `RC-`), or move them to a "Canceled" state.
- **Remove the integration:** delete `scripts/hermes/linear/`, the three
  `hermes:linear:*` scripts in `package.json`, and the Linear/Hermes block in
  `.env.example`. No product code depends on it.

## 7. Safety rules (enforced in code)

- The API key is sent only in the `Authorization` header and is **never** logged; the
  tool reports presence/length only.
- `.env` / `.env*.local` are gitignored; the loader reads them to populate env vars and
  never echoes their contents.
- Writes are **double-gated** (see §5) and default to off.
- `validate` and `dry-run` are strictly read-only.
- Idempotency markers prevent duplicate issues on re-sync.

## 8. Troubleshooting

- **"No LINEAR_API_KEY set"** — expected before setup; add it to `.env.local`.
- **"Linear API error: Authentication required"** — bad/expired key; recreate it.
- **"LINEAR_TEAM_ID did not resolve"** — wrong id/key, or the key's user can't see that
  team. Re-check via `validate`.
- **A ticket isn't parsed** — confirm its heading is `## <ID> — <Title>` with `<ID>`
  containing a digit (e.g. `RC-1`), and that `- key: value` lines come before the body.

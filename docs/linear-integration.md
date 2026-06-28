# Linear integration for Hermes

Connects Hermes to your Linear workspace **safely**: health/teams checks, a
blocker→issue pipeline, and a kanban sync — all **dry-run by default**, with the
API key stored locally and never printed or committed.

- Code: `scripts/hermes/linear/` — `lib.mjs` (GraphQL + config + gate),
  `client.mjs` (health/teams/createIssue/findOrCreate), `hermes-integration.mjs`
  (blocker→issue), `cli.mjs` (commands).
- Setup: `npm run linear:setup` (any OS) · `scripts/setup-linear.ps1` (PowerShell) · `scripts/setup-linear.sh` (bash/WSL/Git Bash).
- Companion: [hermes-linear.md](./hermes-linear.md) covers the `docs/kanban.md` sync in depth.

> Endpoint `https://api.linear.app/graphql`; personal-key auth header is
> `Authorization: <LINEAR_API_KEY>` (no `Bearer`).

---

## 1. Setup (key never enters chat)

Pick whichever fits your machine — all three store the key locally with **hidden
input** and never print it:

**Any OS (recommended — uses Node, which the project already requires):**
```bash
npm run linear:setup
```

**Windows PowerShell** (use this if `bash` reports "WSL has no installed distributions"):
```powershell
powershell -ExecutionPolicy Bypass -File scripts\setup-linear.ps1
```

**macOS / Linux / Git Bash / WSL:**
```bash
bash scripts/setup-linear.sh
```

Each one ensures `.env` is gitignored, creates `.env` with restricted permissions,
reads your **LINEAR_API_KEY with hidden input**, asks for team key / id / project id,
and writes `.env` **without printing the secret**. Then verify:

```bash
npm run linear:health     # confirms the key works (prints only your name/email)
npm run linear:teams      # lists teams so you can confirm the team KEY/ID
```

Prefer to do it by hand? Put the values in `.env.local` (gitignored) instead — the
tools read `.env` and `.env.local` automatically.

## 2. Environment variables

| Var | Required | Purpose |
|---|---|---|
| `LINEAR_API_KEY` | yes | Personal API key. Local only; never commit. |
| `LINEAR_TEAM_KEY` | one of key/id | Team key, e.g. `DEA` (easiest). |
| `LINEAR_TEAM_ID` | one of key/id | Team UUID (alternative to key). |
| `LINEAR_PROJECT_ID` | optional | Land issues in a project; else team backlog. |
| `LINEAR_WRITE_ENABLED` | default `false` | **The write switch.** `false` = dry-run. |
| `LINEAR_DRY_RUN` | optional | Extra brake: `true` forces dry-run even if writes are on. |
| `HERMES_SOURCE_OF_TRUTH` | default `docs` | `docs/kanban.md` is authoritative. |

Placeholders live in `.env.example`. **Real values never go in `.env.example` or git.**

## 3. Test commands

```bash
npm run linear:health        # viewer { id name email } — is the token valid?
npm run linear:teams         # teams { id key name }
npm run linear:test-issue    # builds a [Hermes] test issue; DRY-RUN unless writes enabled
npm run hermes:linear:dry-run  # preview docs/kanban.md → Linear (no writes)
```

All of the above are safe with writes disabled. `linear:health` and `linear:teams`
exit cleanly with a "not configured" message if no key is set yet.

## 4. What Hermes does with blockers / action items

`hermes-integration.mjs` turns items detected in a daily update into issues:

- **Title:** `[Hermes] <short action/blocker>`
- **Description:** `Source`, `Date`, `Type`, `Context`, `Next step`, plus a hidden
  trace marker.
- **Priority:** blocker → Urgent, decision → High, action → Medium.
- **Idempotent:** uses exact-title `findOrCreateIssue`, so re-runs don't duplicate.

It is **dry-run by default**; issues are created only when `LINEAR_WRITE_ENABLED=true`.

## 5. Real write flow (explicit, reviewed)

```bash
# 1) review first — no writes:
npm run linear:test-issue
npm run hermes:linear:dry-run

# 2) enable writes (in .env / .env.local), after reviewing:
LINEAR_WRITE_ENABLED=true

# 3) create the single test issue, confirm in Linear, then delete it:
npm run linear:test-issue

# 4) when happy, sync the board (start with one):
npm run hermes:linear:sync -- --limit=1
```

## 6. Rollback / fallback

- **Disable writes instantly:** set `LINEAR_WRITE_ENABLED=false` (or `LINEAR_DRY_RUN=true`).
  Everything reverts to preview-only.
- **Source of truth stays local:** `docs/kanban.md` is authoritative; Linear is a
  downstream mirror. Fix the board and re-dry-run.
- **Undo issues:** the tools never delete — cancel/trash created issues in Linear by
  hand (filter title prefix `[Hermes]` or `RC-`).
- **Remove the integration:** delete `scripts/hermes/`, `scripts/setup-linear.sh`, the
  `linear:*` / `hermes:linear:*` scripts in `package.json`, and the Linear block in
  `.env.example`. No product code depends on it.

## 7. Security notes

- The API key is sent only in the `Authorization` header; it is **never** printed,
  logged, or echoed (commands report presence only). `setup-linear.sh` uses hidden
  `read -s` and writes `.env` without echoing the value.
- `.env` and `.env*.local` are gitignored; `.env` is chmod `600`.
- Writes are **off by default** and require `LINEAR_WRITE_ENABLED=true`.
- The integration never starts the live Hermes agent and never sends Telegram.

## 8. Troubleshooting

- **"No LINEAR_API_KEY set"** — run `npm run linear:setup` (any OS).
- **"Authentication required"** — bad/expired key; recreate it and re-run setup.
- **"LINEAR_TEAM_KEY … not found"** — run `npm run linear:teams` to see valid keys.

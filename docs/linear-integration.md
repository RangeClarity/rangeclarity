# Hermes Linear Integration

Hermes should use Linear as the primary RangeClarity Kanban and project source of truth. Slack and Telegram stay live as delivery channels only.

Delivery targets:

- Slack: `slack:taskoza-agents`, `slack:C0BA3UD48TG`
- Telegram: `telegram:Dean`, `telegram:Columbus`

## Environment Variables

Set these in the local Hermes environment file, not in git:

```env
KANBAN_PROVIDER=linear
KANBAN_FALLBACK_PROVIDER=markdown-json
LINEAR_API_KEY=replace_with_linear_api_key
LINEAR_TEAM_ID=replace_with_linear_team_id
LINEAR_TEAM_KEY=replace_with_linear_team_key_optional
LINEAR_PROJECT_ID=replace_with_rangeclarity_project_id_optional
DRY_RUN=true
```

Use either `LINEAR_TEAM_ID` or `LINEAR_TEAM_KEY`. `LINEAR_PROJECT_ID` is optional; without it, issues are created in the selected team without a project.

Keep `DRY_RUN=true` while validating. Set `DRY_RUN=false` only when you want approved Hermes plans to create real Linear issues.

## How To Get A Linear API Key

1. Open Linear.
2. Go to workspace settings.
3. Open API or personal API keys.
4. Create a key for Hermes.
5. Paste it only into the local Hermes `.env` file.

Do not paste the key into chat, docs, commits, screenshots, or `.env.example`.

## How Hermes Uses Linear

Hermes supports these core actions:

- Create a Linear issue from a Hermes task message.
- Update a Linear issue status.
- Add a Linear issue comment.
- List recent Linear issues.
- Fall back to `docs/kanban-board.json` and `docs/kanban-board.md` when Linear is not configured.

Status mapping:

| Hermes Status | Linear Workflow Target |
|---|---|
| Backlog | Backlog |
| Planned / Next | Planned |
| In Progress | In Progress |
| Done | Done |

If the exact workflow state does not exist in Linear, Hermes picks the closest available state type and leaves a safe default when no match is found.

## Telegram Commands

Planned helper commands:

```text
/linearstatus
/linearboard
/lineartask <task title>
/linearcomment <issue id or key> <comment>
/linearupdate <issue id or key> <Backlog|Planned|In Progress|Done>
/linearplan <milestone>
/linearapprove
/linearcancel
```

`/linearplan` drafts a set of structured tickets first. Reply `APPROVE` only after reviewing. With `DRY_RUN=true`, approval still does not create real Linear issues.

## One-Shot Test

The one-shot test does not start the live Hermes agent.

```powershell
cd C:\Users\USER\AppData\Local\hermes\hermes-agent
$env:HERMES_HOME='C:\Users\USER\AppData\Local\hermes'
.\.venv\Scripts\python.exe scripts\test_linear_integration.py
```

That command validates configuration and prints safe true/false status only.

To create a real Linear smoke-test issue and comment after credentials are configured:

```powershell
cd C:\Users\USER\AppData\Local\hermes\hermes-agent
$env:HERMES_HOME='C:\Users\USER\AppData\Local\hermes'
.\.venv\Scripts\python.exe scripts\test_linear_integration.py --create
```

The `--create` form performs a real Linear write. Use it only after confirming the API key, team, and optional project target.

## Local Fallback

When `KANBAN_PROVIDER` is not `linear`, or Linear credentials are missing, Hermes writes to:

- `docs/kanban-board.json`
- `docs/kanban-board.md`

The fallback is intentionally simple so RangeClarity can keep moving even if Linear is offline or credentials are not available.

## Known Limitations

- Hermes uses a personal Linear API key for now, not OAuth or app actor mode.
- Existing Linear issues are not deleted.
- Existing Linear issues are not bulk-migrated automatically.
- Labels are included in local schema but are not created automatically in Linear.
- Slack and Telegram delivery notifications are preserved, but Linear is the project board.
- Real issue creation should stay approval-driven until the workflow is proven.

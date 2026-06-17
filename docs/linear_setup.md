# RangeClarity Linear Setup

This is the safe setup path for connecting Hermes to Linear. The goal is for
Hermes to create tickets only inside the Linear project named `RangeClarity`.

## Current State

- Real Linear ticket creation is blocked until target validation passes.
- `docs/kanban.md` remains the source of truth until Linear is synced.
- The existing Hermes planner is dry-run-first, but it previously did not
  validate the Linear project name before creation.
- The new required target guard is `LINEAR_PROJECT_NAME=RangeClarity`.

## Required Env Vars

Add these locally only. Do not commit them and do not paste values into chat.

```dotenv
LINEAR_API_KEY=replace_with_linear_api_key
LINEAR_TEAM_ID=replace_with_rangeclarity_team_id
LINEAR_PROJECT_ID=replace_with_rangeclarity_project_id
LINEAR_PROJECT_NAME=RangeClarity
LINEAR_DRY_RUN=true
```

Compatibility note: the existing Hermes planner currently checks `DRY_RUN`.
Keep `LINEAR_DRY_RUN=true` for the RangeClarity validation scripts. Before real
ticket creation, update Hermes to require both target validation and an explicit
non-dry-run approval.

## Discovery

Run discovery after adding `LINEAR_API_KEY` locally:

```powershell
$env:HERMES_HOME='C:\Users\USER\AppData\Local\hermes'
& 'C:\Users\USER\AppData\Local\hermes\hermes-agent\.venv\Scripts\python.exe' scripts\linear_discover.py
```

The script lists teams and projects returned by Linear and marks any project
named `RangeClarity` as recommended. It does not create tickets.

## Validate Target

After copying the correct team and project IDs into local env:

```powershell
$env:HERMES_HOME='C:\Users\USER\AppData\Local\hermes'
& 'C:\Users\USER\AppData\Local\hermes\hermes-agent\.venv\Scripts\python.exe' scripts\linear_validate_target.py
```

Validation passes only when:

- `LINEAR_API_KEY` exists.
- `LINEAR_TEAM_ID` resolves to a Linear team.
- `LINEAR_PROJECT_ID` resolves to a Linear project.
- The project name is exactly `RangeClarity`.
- The project belongs to the configured team.
- `LINEAR_DRY_RUN=true`.

## Dry-Run Ticket Preview

Preview the first local Kanban card as a future Linear issue:

```powershell
$env:HERMES_HOME='C:\Users\USER\AppData\Local\hermes'
& 'C:\Users\USER\AppData\Local\hermes\hermes-agent\.venv\Scripts\python.exe' scripts\linear_dry_run_ticket.py --from-kanban RC-T01
```

This script never calls Linear. It renders the issue payload shape using
placeholders like `$LINEAR_TEAM_ID` and `$LINEAR_PROJECT_ID` so real env values
are not printed.

## Before Real Linear Ticket Creation

Do not create real Linear tickets until all are true:

- `scripts\linear_validate_target.py` passes.
- `LINEAR_PROJECT_NAME=RangeClarity`.
- `LINEAR_PROJECT_ID` points to the RangeClarity project.
- `docs/kanban.md` has the cards approved for migration.
- Founder explicitly approves real ticket creation.
- Hermes creation code is guarded so issue creation requires the validated
  RangeClarity target, not only a team ID.

## Safety Rules

- Never print `LINEAR_API_KEY`.
- Never print raw `.env` values.
- Never create tickets from discovery or validation.
- Never create tickets while `LINEAR_DRY_RUN=true`.
- Keep `docs/kanban.md` as source of truth until a real Linear sync is complete.

# RangeClarity Hermes Playbook

Last updated: 2026-06-24

## Current Hermes Status

Hermes is installed locally outside this repo at:

```text
C:\Users\USER\AppData\Local\hermes
```

RangeClarity currently uses Hermes in two separate ways:

- Installed Hermes gateway and Telegram helpers live in the local Hermes directory.
- Repo-local Hermes/Linear tooling lives under `scripts/hermes/linear/`.

The Telegram bot token has been verified outside this repo, and the one-message Telegram test has worked. Do not treat that as approval to run the live gateway or send routine messages automatically.

The repo-local Linear CLI is read-only:

```text
scripts/hermes/linear/cli.mjs
```

It supports only:

- `teams`
- `dry-run`

## Safe Warp Workflows

### Hermes Linear Read-Only

Use this from the RangeClarity repo root:

```powershell
cd C:\Users\USER\OneDrive\Documents\RangeClarity
node scripts/hermes/linear/cli.mjs teams
node scripts/hermes/linear/cli.mjs dry-run
```

Purpose:

- Confirm Linear authentication.
- List accessible Linear teams.
- Parse `docs/kanban.md`.
- Preview planned Linear actions without writing.

### Hermes Telegram Chat ID Detection

This command does not send Telegram messages, but it may print chat IDs. Run it only in a private local terminal.

```powershell
C:\Users\USER\AppData\Local\hermes\hermes-agent\.venv\Scripts\python.exe C:\Users\USER\AppData\Local\hermes\hermes-agent\scripts\get_telegram_chat_id.py
```

Purpose:

- Read recent Telegram updates.
- Identify the correct chat target after a manual `/start` or setup message.

### Hermes Telegram Test

This command sends exactly one Telegram test message. Run it only after explicit approval.

```powershell
C:\Users\USER\AppData\Local\hermes\hermes-agent\.venv\Scripts\python.exe C:\Users\USER\AppData\Local\hermes\hermes-agent\scripts\test_rangeclarity_telegram.py
```

Purpose:

- Confirm the configured RangeClarity Telegram chat receives a message.

## Read-Only Commands

These commands are safe for normal diagnostics when run from the correct directory:

```powershell
cd C:\Users\USER\OneDrive\Documents\RangeClarity
node scripts/hermes/linear/cli.mjs teams
node scripts/hermes/linear/cli.mjs dry-run
```

This command is no-send but can reveal chat IDs in the terminal:

```powershell
C:\Users\USER\AppData\Local\hermes\hermes-agent\.venv\Scripts\python.exe C:\Users\USER\AppData\Local\hermes\hermes-agent\scripts\get_telegram_chat_id.py
```

Treat chat IDs as sensitive operational identifiers. Do not paste them into chat or commits.

## Commands That Send Telegram Messages

This command sends one test message:

```powershell
C:\Users\USER\AppData\Local\hermes\hermes-agent\.venv\Scripts\python.exe C:\Users\USER\AppData\Local\hermes\hermes-agent\scripts\test_rangeclarity_telegram.py
```

Any command that uses Telegram `sendMessage` also sends a message and requires explicit approval.

## Approval-Required Commands

Require explicit approval before running:

- Telegram test message commands.
- Hermes gateway start, run, restart, or live mode commands.
- Any Linear write, sync, apply, create, update, or delete command.
- Any command that sends Telegram messages.
- Any command that writes env files or rotates secrets.
- Any command that modifies Git state.
- Any command that deploys, changes payments, or changes beta access.

Examples:

```powershell
hermes gateway run
hermes gateway start
hermes gateway restart
C:\Users\USER\AppData\Local\hermes\gateway-service\Hermes_Gateway.cmd
```

## Commands Forbidden For Now

Do not run these until the operating policy is expanded:

- Live Hermes gateway as a daily default.
- Telegram remote command execution.
- Linear sync or write automation.
- Telegram-triggered Git commands.
- Telegram-triggered deploy commands.
- Telegram-triggered payment or beta access changes.
- Any background agent loop that can act without founder approval.

Forbidden command categories:

```text
sync
apply
create
update
delete
deploy
push
gateway run
gateway restart
sendMessage
```

## Telegram Operating Policy

Telegram is an approval and notification layer, not full remote control.

Allowed uses:

- Receive a daily status summary.
- Receive safe alerts.
- Approve or hold a proposed action.
- Ask for read-only status.
- Confirm that a manual test message arrived.

Not allowed yet:

- Running Git from Telegram.
- Running Linear writes from Telegram.
- Running deploys from Telegram.
- Running payment or beta access changes from Telegram.
- Letting Hermes choose and execute production actions.

Telegram messages must never contain:

- Bot tokens.
- API keys.
- Chat IDs.
- Payment secrets.
- Customer private data.
- Unreviewed production commands.

## Linear Read-Only Policy

Linear automation is read-only by default.

Current allowed commands:

```powershell
node scripts/hermes/linear/cli.mjs teams
node scripts/hermes/linear/cli.mjs dry-run
```

Current safety rules:

- `LINEAR_WRITE_ENABLED` must remain `false`.
- No Linear issue creation.
- No Linear issue updates.
- No sync command.
- No apply command.
- No mutation APIs.
- Dry runs may show planned actions only.

Future Linear writes require a separate reviewed implementation and explicit founder approval.

## Future Plan: Daily Chief Of Staff Summary

The safest next useful Hermes workflow is a no-write daily summary.

Inputs:

- Git status.
- Latest local branch and commit.
- `docs/kanban.md`.
- Linear dry-run output.
- Open founder decisions.
- Current deploy blockers.

Output:

- One concise Telegram summary.
- No secrets.
- No automatic writes.
- No automatic Git actions.
- No production mutations.

Proposed first summary sections:

- Today needs attention.
- Blockers.
- Safe next actions.
- Founder approvals needed.
- What Hermes did not do.

Initial implementation should be local and manual:

```text
Generate summary -> founder reviews -> founder approves sending -> send once
```

Only after that should recurring summaries be considered.

## Emergency Safety Rules

If anything feels wrong:

1. Do not run gateway commands.
2. Do not send Telegram messages.
3. Do not run Linear writes.
4. Do not push Git branches.
5. Do not edit env files.
6. Stop and inspect status first.

Safe first checks:

```powershell
cd C:\Users\USER\OneDrive\Documents\RangeClarity
git status
git branch --show-current
node scripts/hermes/linear/cli.mjs dry-run
```

If a secret is exposed:

- Do not paste it anywhere else.
- Rotate the token/key from the provider.
- Update the local env file only after rotation.
- Re-run only read-only verification.

Default stance:

```text
Dry-run first. Founder approval before any write. Telegram is not production control.
```

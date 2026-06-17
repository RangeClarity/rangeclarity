# RangeClarity Project Status

## Current Stage

Early validation and execution setup.

## Confirmed Assets

- RangeClarity workspace: `C:\Users\USER\OneDrive\Documents\RangeClarity`
- Landing page implementation and design docs are present.
- Hermes RangeClarity docs are present under the local Hermes agent.
- Telegram quick commands exist for plan, milestones, next actions, weekly execution, pricing, GTM, focus, and status.
- Linear planner exists in dry-run mode for ticket drafting.

## Active Product Direction

- Premium meme-fintech TradingView toolkit identity.
- Dark market command-center style.
- Core modules: Range Map Overlay, Momentum Engine, Risk Radar.
- No signal-bot hype, no profit claims, no financial advice framing.

## Highest-Leverage Next Actions

1. Make the landing page and waitlist path concrete.
2. Freeze the Starter / Range Map MVP spec.
3. Recruit the first 10 tester candidates.

## Current Blockers

- Final launch pricing needs founder decision.
- Waitlist/early-access capture destination needs to be chosen.
- Linear MCP/tool is not connected in the active Codex context, so real Linear tickets/milestones cannot be created yet.
- Linear target validation is now required before any real creation: the project must resolve to `RangeClarity` through `scripts/linear_validate_target.py`.
- The file-based Kanban at `docs/kanban.md` is the active source of truth until Linear is confirmed and synced.

## Linear Setup Commands

```powershell
$env:HERMES_HOME='C:\Users\USER\AppData\Local\hermes'
& 'C:\Users\USER\AppData\Local\hermes\hermes-agent\.venv\Scripts\python.exe' scripts\linear_discover.py
& 'C:\Users\USER\AppData\Local\hermes\hermes-agent\.venv\Scripts\python.exe' scripts\linear_validate_target.py
& 'C:\Users\USER\AppData\Local\hermes\hermes-agent\.venv\Scripts\python.exe' scripts\linear_dry_run_ticket.py --from-kanban RC-T01
```

## Founder Decision Needed

Choose the first public conversion path:

- waitlist form,
- Discord invite,
- Whop early-access page,
- or temporary manual Telegram/DM capture.

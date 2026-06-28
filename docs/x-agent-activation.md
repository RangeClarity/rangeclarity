# RangeClarity — X Agent Activation Guide

How to run the RangeClarity X/Twitter content agent in **safe draft mode**, approve posts, and (later) publish manually. The agent is **draft-only**: `scripts/generate_x_drafts.py` uses no X API and never posts. Full plan: `docs/rangeclarity_x_content_agent_plan.md`.

## TL;DR
- Generate today's drafts: `python scripts/generate_x_drafts.py`
- Output: `content/x/drafts/YYYY-MM-DD_x_drafts.md`
- Curated activation batch: `content/x/daily-drafts.md`
- Approve / track: `content/x/status.json`
- Nothing posts automatically (`ENABLE_X_PUBLISHING=false`, no X API in repo).

## 1. Generate today's post
```
python scripts/generate_x_drafts.py
```
Writes `content/x/drafts/<today>_x_drafts.md`: 3 original posts, 5 reply ideas, 2 meme prompts, 1 chart-breakdown prompt, 1 follower question, and an occasional private-beta CTA. Options: `--date YYYY-MM-DD`, `--out <dir>`.

## 2. Generate a week of drafts
```
for i in $(seq 0 6); do
  d=$(python3 -c "import datetime;print((datetime.date.today()+datetime.timedelta(days=$i)).isoformat())")
  python scripts/generate_x_drafts.py --date "$d"
done
```
Each date is deterministic, so re-running is stable.

## 3. Approve a post
1. Open the daily draft (`content/x/drafts/<date>_x_drafts.md`) or the curated `content/x/daily-drafts.md`.
2. Run every item through `content/x/approval_checklist.md`.
3. Edit freely; keep the strongest few.
4. In `content/x/status.json`, change that item's `status` from `generated` to `approved` (and set `approved_by`).

Only `approved` items are eligible to post.

## 4. Publish manually (the only supported path today)
1. Copy the approved text; attach the image for memes / before-after.
2. Post it by hand from the X app or site.
3. Record it: set `status` to `published`, add `published_at` + `url` in `content/x/status.json`, and/or log it in `content/x/posted/`.

There is no automated publishing in this repo. The generator cannot post.

## 5. Environment variables
Today: **none required** — the generator needs no keys.

For a future, human-gated publish step, these flags are documented in `.env.example` (safe defaults):
- `DRY_RUN=true` — never actually post.
- `REQUIRE_APPROVAL=true` — only `approved` items may publish.
- `ENABLE_X_PUBLISHING=false` — master off-switch; keep false until ready.

Future X API credentials (`X_API_KEY`, `X_API_SECRET`, `X_ACCESS_TOKEN`, `X_ACCESS_TOKEN_SECRET`, `X_BEARER_TOKEN`) go in the gitignored `.env`, never in the repo.

## 6. Brand guardrails (every post)
Sells clarity, not returns. Explains market structure simply. Occasional, tasteful private-beta CTA. No buy/sell, no targets, no predictions, no "win rate" / "guaranteed", no financial advice, no hype. Chart posts are anonymized and "not a call." The generator has a built-in word linter, but the human `approval_checklist.md` is the real gate.

## 7. Scheduling (manual first)
No scheduler is wired, by design. Run it manually (above). If you later want a daily cadence, keep it draft-only:
- A local cron / Task Scheduler entry that ONLY runs the generator (it cannot post). Example (daily 08:00):
  `0 8 * * * cd /path/to/RangeClarity && python scripts/generate_x_drafts.py`
- Approval and posting stay manual regardless.

Do not schedule posting until a publish step exists and is behind the flags above.

## 8. What is still missing before full automation
- No X API integration (Phase 0 today) — publishing is manual.
- No publish script — it would need: OAuth via the official X API, the three flags wired (default dry-run), one-at-a-time publish of an `approved` item, a logged record, and a documented kill switch (plan §8).
- No posting scheduler (only optional draft generation).

Until those exist **and** Dean explicitly approves live mode, the agent stays draft-only.

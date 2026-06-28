# Latest staged Codex prompt

> This file is the Codex prompt **staged for the current pass** — the thing to copy into Codex next.
> V1 does not auto-generate it; it points at the reusable template and the current focus. Refresh your
> context (git status, QA report, status file) before pasting. Reusable template: `prompts/codex-daily-critic.md`.

**Staged:** Codex Daily Critic (first full A–G critique)
**Focus this pass:** Confirm the `npm run health` baseline is green on the host, then rank the top issues
across the Fox homepage and the beta/free-access flow. Pick exactly ONE issue for Claude.

**To run:** open `prompts/codex-daily-critic.md`, copy it into Codex, and feed it `git status`, the planning
docs, `docs/qa/live-qa-report.md`, the homepage, and the beta flow. Put the chosen issue into
`docs/ops/current-loop-status.md` → *Next Claude task*.

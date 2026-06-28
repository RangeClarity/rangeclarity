# Latest staged Claude fix prompt

> This file is the Claude fix prompt **staged for the current pass** — copy it into Claude once Dean has
> approved exactly one issue. V1 does not auto-generate it. Reusable template: `prompts/claude-fix-one-issue.md`.

**Staged:** Claude Fix One Issue
**Approved issue:** _(none yet — set this from the Codex critique, section F)_

**To run:** open `prompts/claude-fix-one-issue.md`, paste the single approved issue at the top, and send it
to Claude. Claude makes the smallest change, runs `npm run health`, reports files changed, and stops for
your approval. Then update `docs/kanban.md` + `docs/ops/current-loop-status.md`.

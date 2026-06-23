# LangSmith — Future Plan (deferred, not implemented)

Where LangSmith (agent tracing / evals) would fit **later**, and why it is **not** wired up now. No SDK,
no keys, no network calls are added by this document.

## Why deferred
LangSmith instruments a **programmatic agent runtime** — code that calls models in a loop and emits traces.
RangeClarity has no such runtime today: every loop is **human-run** (you paste a prompt into Codex/Claude,
or run a local command). There is nothing to trace yet. The current lightweight observability is already in
place and sufficient for now:
- `docs/qa/live-qa-report.md` + `data/qa/findings.jsonl` — structured indicator-QA output.
- `docs/ops/current-loop-status.md` + `npm run ops:status` — where the loop is + a safe-to-edit snapshot.

## Adoption gate (when to revisit)
Adopt LangSmith **only when** we build an automated agent runner — e.g. a script/service that programmatically
calls an LLM to run the QA/critic/research loops without a human pasting prompts. At that point tracing,
versioning, and evals earn their keep. Until then it is pure overhead.

## What LangSmith would give us then
- **Tracing agent runs** — each loop execution as a run/trace tree (parent + child steps).
- **Prompt & version tracking** — which prompt file + version produced which output.
- **Evals** — score loop outputs against fixtures/rubrics (e.g. did Indicator QA catch the planted sentinel?).
- **Cost / latency** — tokens, $/run, p50/p95 latency per loop.
- **Failure analysis** — cluster failed/low-quality runs; spot regressions after a prompt change.

## Proposed event schema (design only — do NOT implement yet)
A single `rc_agent_run` event per loop execution:

| Field | Type | Notes |
|---|---|---|
| `run_id` | string | unique per execution |
| `parent_run_id` | string\|null | for sub-steps |
| `loop` | enum | `daily-health` · `indicator-qa` · `website-qa` · `codex-critic` · `deep-research` |
| `trigger` | enum | `manual` · `scheduled` (scheduled = future) |
| `actor` | enum | `human` · `codex` · `claude` |
| `prompt_name` | string | e.g. `codex-daily-critic` |
| `prompt_version` | string | git sha or semver of the prompt file |
| `model` | string\|null | once programmatic |
| `started_at` / `ended_at` | iso8601 | |
| `latency_ms` | number\|null | |
| `tokens_in` / `tokens_out` | number\|null | |
| `cost_usd` | number\|null | |
| `status` | enum | `ok` · `fail` · `partial` |
| `inputs_ref` / `outputs_ref` | string | path or hash (e.g. `docs/qa/live-qa-report.md`) |
| `findings_total` / `product_criticals` | number | reuse the QA scanner's counts |
| `human_decision` | string\|null | the one issue chosen / approved |
| `notes` | string\|null | free text |

This schema is intentionally aligned with the existing `rc_live_qa.v1` findings so a future tracer can join
QA output to agent runs without reshaping data.

## Migration sketch (future, gated on the adoption gate)
1. Build the automated agent runner (separate, approved task).
2. Emit `rc_agent_run` events locally to `data/ops/agent-runs.jsonl` first (no SDK, no network) — validate the schema.
3. Only then, if the value is proven, add the LangSmith SDK behind an env flag (`LANGSMITH_TRACING=true`), keys via env, never committed.
4. Add evals against the existing fixtures.

## Related deferral — OpenAI Deep Research API
The Deep Research API is a **future backend for the weekly research loop only** (`deep-research-playbook.md`),
never for daily health. Same gate: wire it only when manual research is proven valuable and worth automating,
behind env-guarded keys. Not added now.

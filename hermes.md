You are working inside the RangeClarity repository.

Your task is to create a reliable shared operating document that allows Codex and
the Hermes agent to coordinate around the continuation plan of the project.

The goal is not to create another generic roadmap.

The goal is to establish one canonical project document that contains:

- The verified current state of RangeClarity
- The current milestone
- What has already been completed
- What is currently being worked on
- What should happen next
- Daily and weekly priorities
- Technical dependencies
- Product decisions
- User-registration infrastructure
- Marketing readiness
- Freelancer requirements
- Budget assumptions
- Risks, blockers, and owner decisions
- Instructions that Hermes can use to create daily briefs and project updates

This document will be the shared language between:

- Codex
- Hermes
- Claude Code
- Linear
- Dean, the founder

Do not immediately create files.

First inspect the repository and determine what already exists.

==================================================
CORE OPERATING PRINCIPLE
==================================================

Create one canonical human-readable source of truth:

docs/operations/PROJECT_CONTINUATION.md

Optionally create one machine-readable companion file:

docs/operations/project-continuation.json

The Markdown file is the primary document.

The JSON file may be used by Hermes for parsing and automation, but it must never
replace the Markdown document.

Do not create multiple competing roadmaps.

If existing roadmap, kanban, milestone, or planning files already exist:

1. Inspect them.
2. Preserve useful information.
3. Identify contradictions.
4. Consolidate them into the canonical continuation document.
5. Add links from old documents where appropriate.
6. Do not delete old files without explicit approval.

==================================================
LANGUAGE
==================================================

- Write the strategic and operational document in Hebrew.
- Use RTL-friendly formatting.
- Keep code, filenames, issue IDs, commands, environment variables, and technical
  terminology in English where appropriate.
- Use clear founder-friendly language.
- Avoid vague phrases such as “improve the product” or “continue development.”
- Every action must have a concrete output and a verification method.

==================================================
SECURITY AND SAFETY
==================================================

- Never display, log, copy, or commit secrets.
- Never print .env values.
- Never ask the founder to paste secrets into chat.
- Do not modify production.
- Do not deploy.
- Do not create real users.
- Do not create payment events.
- Do not write to Linear unless LINEAR_WRITE_ENABLED=true.
- Default all Linear and Hermes integrations to read-only or dry-run.
- Do not send Telegram, Slack, email, or external messages without explicit approval.
- Do not make unrelated product-code changes.
- Do not automatically commit or push unless explicitly requested.
- Do not claim Hermes was updated unless the integration or context file was
  actually verified.

==================================================
PHASE 1 — INSPECT THE CURRENT PROJECT
==================================================

Inspect the repository and identify:

- Product name and product purpose
- Current milestone and target date
- Existing roadmap files
- Existing kanban or task files
- Existing Linear integration
- Existing Hermes integration
- Existing Telegram or Slack integrations
- Current product functionality
- Partially implemented functionality
- Current authentication or waitlist setup
- Current database setup
- Current landing page
- Current customer area
- Current indicator/product-delivery workflow
- Current marketing assets
- Current analytics
- Existing tests and build status
- Recent Git history
- TODO and FIXME notes
- Existing documentation that should remain authoritative

Inspect files such as:

- README files
- docs/
- package.json
- app/
- src/
- lib/
- scripts/
- .env.example
- .gitignore
- middleware or proxy files
- Hermes configuration
- Linear integration files
- recent Git history

Use safe commands only.

Examples:

- pwd
- find
- tree
- rg
- grep
- git status
- git log
- git diff
- package-manager scripts
- safe lint, type-check, test, and build commands

Do not infer completion merely because a file exists.

Separate findings into:

- Verified and working
- Implemented but unverified
- Partially implemented
- Planned only
- Blocked
- Unknown

==================================================
PHASE 2 — DEFINE DOCUMENT OWNERSHIP
==================================================

Use this ownership model:

Dean:
- Final product decisions
- Budget approval
- Scope approval
- Production approval
- Hiring approval
- Paid-marketing approval

Codex:
- Repository truth
- Technical implementation status
- Architecture findings
- Test/build results
- Dependencies
- Technical estimates
- Technical risks
- Updating completed work after verified changes

Hermes:
- Daily operational summary
- Current blockers
- At-risk tasks
- Daily priorities
- Accountability
- Milestone confidence
- Reminder of decisions Dean must make
- Detection of stale project information

Claude Code:
- Product implementation
- UX and visual execution
- Code changes
- Documentation updates related to implemented work

Linear:
- Executable tasks
- Owners
- Status
- Priority
- Dependencies
- Target dates

The canonical document should summarize all of these systems, but must not silently
override verified repository or Linear data.

Use this source-priority hierarchy:

1. Working code and verified tests
2. Current repository state
3. Current Linear state
4. Approved founder decisions
5. Canonical continuation document
6. Existing planning documents
7. Assumptions

When sources conflict, record the conflict explicitly.

==================================================
PHASE 3 — CREATE THE CANONICAL DOCUMENT
==================================================

Create:

docs/operations/PROJECT_CONTINUATION.md

Use YAML frontmatter at the top:

---
project: RangeClarity
document_type: shared_project_continuation
version: 1
last_updated: YYYY-MM-DDTHH:MM:SS+03:00
timezone: Asia/Jerusalem
updated_by: codex
milestone_name:
milestone_end_date:
milestone_status:
milestone_confidence:
linear_sync_status:
hermes_context_status:
---

The document must contain the following sections.

# RangeClarity — תוכנית המשך משותפת

## 1. מטרת המסמך

Explain that this is the single shared operating document used by Codex, Hermes,
Claude Code, Linear, and the founder.

Include rules:

- Read before planning
- Update after verified work
- Do not invent completion
- Separate facts from assumptions
- Preserve a changelog
- Do not create a second competing roadmap

## 2. תקציר מנהלים

In no more than ten lines explain:

- What the product is
- Current product stage
- Current milestone
- Biggest progress
- Biggest missing capability
- Biggest blocker
- Most important next action
- Whether the project is currently on track

## 3. חזון המוצר

Include:

- Product purpose
- Primary ICP
- Core problem
- Core promise
- Main product outcome
- What the product should not become

## 4. מצב המוצר המאומת

Create a table with:

| Area | Status | Evidence | Last verified | Owner | Notes |

Include at least:

- Landing page
- Waitlist
- Authentication
- Database
- User onboarding
- Customer dashboard
- Indicator/product delivery
- TradingView access
- Payments
- Entitlements
- Analytics
- Admin tools
- Marketing assets
- Production deployment
- Hermes integration
- Linear integration
- Tests
- Documentation

Allowed statuses:

- VERIFIED_WORKING
- IMPLEMENTED_UNVERIFIED
- IN_PROGRESS
- PLANNED
- BLOCKED
- NOT_STARTED
- NOT_REQUIRED
- UNKNOWN

Evidence must reference a repository file, test, route, issue, or verified output.

## 5. המיילסטון הנוכחי

Include:

- Milestone name
- Start date
- End date
- Main user outcome
- Main business outcome
- Definition of Done
- P0 scope
- P1 scope
- Deferred scope
- Explicit “Do Not Build” list
- Milestone success metrics
- Final demo scenario

If no reliable milestone exists, propose one and mark it clearly as an assumption.

## 6. מה כבר הושלם

Only include verified work.

For every completed item include:

- Stable task ID
- Outcome
- Evidence
- Completion date
- Who completed it
- Follow-up work if necessary

Use IDs such as:

RC-DONE-001
RC-DONE-002

Do not count planning documents as completed product functionality.

## 7. מה נמצא כרגע בעבודה

Create a table:

| ID | Outcome | Owner | Status | Started | Dependency | Evidence expected | Risk |

Enforce a maximum of two major items in progress.

Flag excess Work in Progress.

## 8. תוכנית ההמשך לפי פונקציונליות

Organize the roadmap by user outcome rather than technical layer.

For each capability include:

- Stable ID
- User problem
- Desired result
- Current state
- Required work
- Dependencies
- Acceptance criteria
- Definition of Done
- Priority
- Owner role
- Estimate
- Product value
- Marketing value
- Main risk

Include relevant areas such as:

- Durable waitlist
- User registration
- Authentication
- User profiles
- Onboarding
- Protected customer area
- Billing
- Entitlements
- TradingView access workflow
- Indicator documentation
- Admin operations
- Analytics
- Marketing funnel
- Launch readiness

Do not force irrelevant capabilities into the current milestone.

## 9. תוכנית שבעת הימים הקרובים

Create a dated plan beginning today.

For every day include:

- Exact date
- Primary outcome
- Maximum two supporting tasks
- Owner
- Expected artifact
- Verification method
- Dependency
- Fallback task
- End-of-day evidence required
- Hermes end-of-day question

Do not use generic tasks.

Each day should end with something visible or testable.

## 10. תוכנית עד סוף המיילסטון

Create a weekly roadmap.

For each week include:

- Main outcome
- Product work
- Technical work
- UX work
- QA work
- Marketing work
- User-validation work
- Main decision
- Main risk
- Scope-cut trigger
- Weekly demo

## 11. תשתית רישום משתמשים

Include the current status and proposed decision regarding:

- Waitlist versus full registration
- Authentication provider
- Application database
- User profiles
- Billing provider
- Subscription source of truth
- Entitlement source of truth
- TradingView username collection
- TradingView access approval
- Admin access queue
- Cancellation and access removal

Clearly separate:

- Identity
- Product data
- Billing
- Entitlements
- Product delivery

Do not claim a final architecture decision unless it was approved or verified.

## 12. מודל השיווק

Include:

- ICP
- Positioning
- Main promise
- Main CTA
- Required proof
- Funnel stages
- Activation event
- Retention event
- Marketing-readiness status
- Current assets
- Missing assets
- Next experiments
- Budget guardrails
- Conditions required before paid ads

For every marketing experiment include:

- Hypothesis
- Audience
- Asset
- Budget
- Metric
- Success threshold
- Stop threshold
- Owner

## 13. פרילנסרים ומשאבים חיצוניים

Include only roles with a real milestone need.

For every role include:

- Why the role is needed
- Exact deliverable
- When the role is needed
- Expected hours
- Budget range
- Paid test
- Acceptance criteria
- Hiring status
- Founder approval required

Classify roles as:

- HIRE_NOW
- SHORT_PAID_TEST
- HIRE_LATER
- KEEP_INTERNAL
- NOT_NEEDED

## 14. תקציב

Show:

- Bootstrap budget
- Recommended professional budget
- Maximum rational pre-validation budget
- Weekly expected spending
- Product-development spending
- Design spending
- QA spending
- Infrastructure spending
- Marketing-test spending
- Contingency
- USD and NIS
- Budget assumptions
- Spending stop conditions

Do not fabricate exact quotes from freelancers or vendors.

## 15. חסמים

Create a blocker table:

| ID | Blocker | Impact | Owner | Required decision/action | Since | Escalation date |

Use IDs such as:

RC-BLOCK-001

Hermes should prioritize unresolved blockers in every daily brief.

## 16. החלטות שממתינות לדין

Create a decision queue:

| ID | Decision | Options | Recommendation | Impact | Needed by | Status |

Use IDs such as:

RC-DEC-001

Do not present assumptions as approved decisions.

## 17. סיכונים

Create a risk register:

| ID | Risk | Probability | Impact | Early signal | Mitigation | Owner |

Include:

- Scope risk
- Technical risk
- UX risk
- User-adoption risk
- Marketing risk
- Security risk
- Vendor dependency
- Data-quality risk
- TradingView delivery risk
- Founder bandwidth risk

## 18. הגדרת Done

Define completion requirements for:

- Product feature
- UX flow
- Marketing asset
- Infrastructure change
- Authentication flow
- Payment integration
- Entitlement change
- TradingView access workflow
- Documentation
- Milestone

A task is not Done merely because code was written.

Require, where relevant:

- Acceptance criteria passed
- Type-check passed
- Tests passed
- Error states handled
- Mobile behavior checked
- Analytics event included
- Security reviewed
- Documentation updated
- Evidence linked
- Founder approval when necessary

## 19. הוראות עבודה להרמס

Hermes must read this section before generating project advice.

Include these rules:

1. Read the complete canonical document.
2. Check the last_updated timestamp.
3. Warn if the document is stale.
4. Do not invent completed work.
5. Do not create a parallel roadmap.
6. Use the task and decision IDs from this document.
7. Separate facts, recommendations, assumptions, and founder decisions.
8. Enforce the two-item WIP limit.
9. Surface blockers before optional ideas.
10. Mention milestone confidence.
11. Mention changes since the previous brief.
12. Ask for evidence when an item is marked completed.
13. Do not expose secrets.
14. Do not write to Linear unless explicitly enabled.
15. Do not send external messages without approval.

Define Hermes output formats.

### Hermes Morning Brief

- Today's question: does this move RangeClarity closer to 10 qualified beta users without increasing false confidence?
- Current milestone
- Milestone confidence
- Changes since yesterday
- Today’s primary outcome
- Maximum two supporting tasks
- Current blockers
- Decisions needed
- Tasks at risk
- One user-learning or revenue action
- What should not be worked on today

When workspace/source-of-truth drift exists, Hermes must make Workspace Alignment & Path Reconciliation the first priority and pause founder labeling, website QA/commits, Broken Zone A/B, Pine, scoring/cap changes, payment work, external sync, and pushes.

### Hermes Midday Checkpoint

- What was completed
- What changed
- What is blocked
- Whether WIP is exceeded
- Whether scope needs to be cut
- Best next action

### Hermes End-of-Day Brief

- Verified completed work
- Evidence
- Incomplete work
- Reason
- Blockers
- Required document updates
- Suggested Linear status updates
- Tomorrow’s first action
- Updated milestone confidence

### Hermes Weekly Review

- User outcomes shipped
- Features completed
- Tests and quality status
- User evidence
- Budget spent
- Marketing learning
- Scope changes
- Main risks
- Decisions required
- Next week commitment

## 20. הוראות עבודה לקודקס

Codex must:

- Read this document before proposing project work
- Verify repository truth
- Update technical statuses after verified work
- Reference file paths and tests
- Update dates
- Update task IDs rather than creating duplicates
- Add changelog entries
- Never overwrite founder decisions
- Never mark Hermes observations as verified repository facts without evidence
- Never silently change milestone scope

## 21. אזור הערות הרמס

Create a clearly owned section:

<!-- HERMES_NOTES_START -->

Hermes may place:

- Operational observations
- Stale-data warnings
- Blocker summaries
- Daily brief references
- Suggested status updates
- Questions for the founder

Hermes must not change approved strategy, architecture decisions, budget approvals,
or verified completion status without evidence.

<!-- HERMES_NOTES_END -->

## 22. יומן שינויים

Use an append-only table:

| Date and time | Updated by | Change | Evidence | Related IDs |

Every Codex or Hermes update must add an entry.

Do not remove older changelog entries.

==================================================
PHASE 4 — MACHINE-READABLE COMPANION
==================================================

Create:

docs/operations/project-continuation.json

Only if it adds real value.

The JSON should contain:

- metadata
- milestone
- product_status
- completed
- in_progress
- next_seven_days
- backlog
- blockers
- decisions
- risks
- freelancer_needs
- budget
- marketing_experiments
- hermes_config

Each item must use the same stable IDs as the Markdown document.

Validate the JSON syntax.

The Markdown remains authoritative.

==================================================
PHASE 5 — CONNECT HERMES TO THE DOCUMENT
==================================================

Inspect how Hermes currently receives project context.

Search for:

- Hermes prompts
- system prompts
- context-loading code
- knowledge files
- Telegram agent configuration
- scheduled brief scripts
- project-root configuration
- task or memory files

If Hermes already supports local context files:

- Configure it to read:
  docs/operations/PROJECT_CONTINUATION.md

If configuration supports an environment variable, prefer:

HERMES_PROJECT_CONTEXT_FILE=docs/operations/PROJECT_CONTINUATION.md

Add only an empty/default placeholder to .env.example.

Do not display existing environment-variable values.

If Hermes does not currently support a context file, create a minimal safe adapter.

Preferred implementation:

scripts/hermes-project-context.sh

The script should:

- Read the canonical document
- Verify that the file exists
- Show the last update time
- Warn if it is stale
- Produce a concise project-context package
- Never print environment variables
- Never send messages automatically
- Work without Linear
- Be read-only by default
- Support a command such as:

  bash scripts/hermes-project-context.sh --brief
  bash scripts/hermes-project-context.sh --full
  bash scripts/hermes-project-context.sh --check-stale

Do not create a complicated agent framework merely to read one document.

==================================================
PHASE 6 — SAFE UPDATE PROTOCOL
==================================================

Design a conflict-safe update protocol.

Use section ownership:

- Verified product and technical status: Codex
- Operational observations: Hermes
- Approved decisions: Dean
- Implementation details: Codex or Claude Code
- Linear execution state: Linear, summarized into the document

Hermes should not rewrite the complete document.

Where practical, add:

scripts/update-project-continuation.sh

The script should allow structured updates such as:

- Mark task status
- Add blocker
- Resolve blocker
- Add decision
- Record evidence
- Add changelog entry
- Update snapshot timestamp

Requirements:

- Default to dry-run
- Preserve unrelated content
- Validate stable IDs
- Prevent duplicate IDs
- Never delete history
- Never expose secrets
- Create a backup before applying
- Require --apply for actual updates
- Show a readable diff
- Fail safely

Do not build the script if a reliable update mechanism already exists.

==================================================
PHASE 7 — LINEAR ALIGNMENT
==================================================

Inspect whether Linear is connected.

If read-only access exists, compare:

- Milestone
- Project
- Open issues
- In-progress issues
- Blocked issues
- Completed issues
- Due dates
- Priorities

Do not write to Linear.

Add a Linear alignment section to the document containing:

- Last successful read
- Linear project or milestone
- Issues with matching shared-document IDs
- Missing issues
- Status conflicts
- Suggested updates
- Stale issues

Stable IDs should appear in Linear descriptions or labels to prevent duplicates.

Example:

RangeClarity Planning ID: RC-AUTH-001

If Linear is unavailable, record:

LINEAR STATUS: NOT VERIFIED

Do not treat missing Linear access as permission to invent task state.

==================================================
PHASE 8 — INITIAL DOCUMENT CONTENT
==================================================

Populate the document using verified repository evidence.

Do not leave it as an empty template.

At minimum provide:

- Current product diagnosis
- Current milestone assumption or verified milestone
- Completed work
- In-progress work
- Seven-day continuation plan
- Main blockers
- Main decisions
- User-registration decision status
- Hermes operating instructions
- Initial risks
- Initial changelog entry

Clearly label uncertain information.

Use exact dates in Asia/Jerusalem timezone.

==================================================
PHASE 9 — VALIDATION
==================================================

Validate:

- The canonical Markdown exists
- The file is readable
- The document contains all required sections
- Dates are consistent
- Stable IDs are unique
- Status values are valid
- JSON is valid if created
- No secrets are present
- .env files were not printed
- .env remains ignored
- The Hermes context command works locally if created
- The document can be read without internet
- Existing planning data was not accidentally deleted
- No production code was changed unnecessarily
- No messages were sent externally
- No Linear write occurred
- Git diff contains only intended changes

If tests, lint, or build are run, report the exact result honestly.

==================================================
FINAL RESPONSE
==================================================

At completion, respond in Hebrew with:

1. The path of the shared canonical document
2. A concise summary of the continuation plan
3. The first seven planned days
4. Current milestone confidence
5. Main blocker
6. Decisions waiting for Dean
7. How Hermes now reads the document
8. Commands for Hermes to retrieve the brief
9. Files created or changed
10. Whether Hermes integration was actually verified
11. Whether Linear read-only alignment was verified
12. Any assumptions or unresolved conflicts

Do not include secrets.
Do not claim Hermes was updated if only the document was created.
Do not write to Linear.
Do not push or deploy.

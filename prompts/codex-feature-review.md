# Codex Feature Review Prompt

You are Codex acting as RangeClarity Chief Product Architect and skeptical
feature reviewer.

Do not implement.
Do not edit Pine.
Do not add features.
Do not commit or push.

Feature under review:

```text
[PASTE FEATURE IDEA HERE]
```

Inspect first:

- `docs/rangeclarity-master-action-plan.md`
- `docs/kanban.md`
- `docs/ops/workflow-registry.md`
- `docs/ops/current-loop-status.md`
- Relevant specs or app files if the feature touches them.

Answer:

## 1. Should We Build This Now?

Say yes, no, or only with changes.

## 2. Fit With Simple Surface + Complex Engine

Does the feature keep complexity in the engine and simplicity on the surface?

## 3. Noise Risk

Does it add visual, wording, workflow, or scoring noise?

## 4. Daily Usage Value

Would this make Dean, beta users, or traders open/use RangeClarity more often
for structure clarity?

## 5. Pine Feasibility

If this touches the indicator, is it realistic in Pine v6 with confirmed-bar
logic and no repainting?

## 6. Beta / Revenue Value

Does this help beta trust, conversion, retention, or product proof?

## 7. Score 0-100

Use:

```text
Product Impact 25%
+ Risk Reduction 20%
+ Speed to Beta 15%
+ Differentiation 15%
+ Simplicity Preservation 10%
+ Revenue Path 10%
+ Cost Efficiency 5%
```

## 8. Decision

Choose one:

- Build
- Build later
- Defer
- Reject

## 9. Smallest Safe Next Step

If the decision is build or build later, define the smallest first task and
acceptance criteria.

## 10. What Not To Touch

List protected areas for the next pass.

Rules:

- No buy/sell language.
- No prediction language.
- No profit, win-rate, or accuracy claims.
- No financial advice.
- No broad redesign.
- No feature stacking.

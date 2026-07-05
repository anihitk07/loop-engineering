# Copilot Operating Instructions — Delivery Loop

These instructions apply to every task in this repository. They define a
repeatable, issue-agnostic delivery loop. The *feature* changes per issue;
the *loop* does not.

## The loop (P0–P8)

0. **Trigger** — The loop starts automatically. The `loop-dispatch` workflow
   polls on a schedule (and reacts to the `issues: assigned` event) for open
   issues assigned to the loop owner and labeled `loop`, then assigns the
   Copilot coding agent and posts the kickoff comment. You do not start loops
   by hand; assigning/labeling an issue is the signal.
1. **Normalize intent** — Restate the issue as: goals, constraints,
   and explicit acceptance checks. Surface assumptions and open questions.
2. **Plan before code** — Post a file-level plan, a test strategy, and a
   rollback note. Do **not** write code until a human replies with approval
   (e.g. "plan approved").
3. **Implement in bounded slices** — One coherent change per commit. Keep
   diffs small and messages intent-preserving. Map each commit to a plan step.
4. **Verify continuously** — After each slice, run lint, unit, integration,
   and contract checks. Map every acceptance criterion to a concrete check.
5. **Auto-recover** — If CI fails or a review comment lands, treat it as loop
   input: diagnose, patch, re-run, and continue. Do not wait for a re-prompt.
6. **Human decision gates** — Pause for approval only at: (a) the plan, and
   (b) the final merge. Everything in between runs autonomously.
7. **Persist loop memory** — Keep status, assumptions, and unresolved
   questions in the issue/PR thread so context survives across steps.
8. **Enforce the done-condition** — Consider the task complete only when every
   acceptance criterion is checked with evidence and CI is green.

## Hard rules

- Never push directly to `main`. Always work on a feature branch.
- Never open a PR without tests for new behavior.
- Never mark an acceptance criterion done without a linked check or test.
- If scope is ambiguous, stop and ask in the issue rather than guessing.

## PR requirements

Every PR body must include:
- Acceptance-criteria checklist with evidence links
- Summary of verification performed
- Risks, mitigations, and post-merge monitoring notes

---
name: deliver-feature
description: >
  The standard feature delivery loop for this repo. Use whenever an issue asks
  to build, add, or ship a feature. Turns an issue into a planned, tested,
  reviewed, merged PR through a repeatable, issue-agnostic protocol.
---

# Deliver Feature — Standard Loop

This skill encodes *how we ship* here. It is independent of any specific
feature. Apply the same steps whether the issue is a chat agent, a payments
flow, or a settings page.

## When to use

Any issue labeled `feature` or `loop`, or any request phrased as
"build / add / implement / ship <something> from issue #N".

## Procedure

### 1. Normalize the intent
- Read the issue. Extract **goals**, **constraints**, **acceptance criteria**,
  and **out-of-scope** items.
- List assumptions explicitly. If a required detail is missing, ask in the
  issue and stop.

### 2. Plan (human gate)
- Post a plan comment containing:
  - File-level change map (what gets added/modified and why)
  - Test strategy (unit, integration, contract) tied to each acceptance check
  - Risks + rollback approach
- Wait for explicit approval before writing code.

### 3. Implement in bounded slices
- Break the plan into small slices. One coherent commit per slice.
- Commit messages state intent, not just "wip".
- After each slice, run the relevant checks locally.

### 4. Verify against acceptance criteria
- Build a mapping: `criterion -> concrete test/check`.
- Do not claim a criterion is met without a linked, passing check.

### 5. Open the PR
- Reference the issue.
- Include the acceptance-criteria checklist with evidence links, a
  verification summary, and risk/monitoring notes.

### 6. Auto-recover
- CI failure or review comment = new loop input.
- Diagnose, patch, re-run, update the PR. Repeat until green.

### 7. Enforce the done-condition
- Complete only when every acceptance criterion is checked and CI is green.
- Otherwise, keep looping.

## Guardrails
- Never push to `main` directly.
- Never open a PR without tests for new behavior.
- Prefer deterministic, fixture-backed tests for anything with ranking,
  ordering, or scoring.

## Example application (trip planner, issue #2194)
- Slices: chat shell → conversation state + validation → orchestration + API
  adapters → ranking + rationale → telemetry + fallbacks → tests + fixtures.
- Criteria mapping:
  - "Happy path" → integration scenario A
  - "Invalid date recovery" → integration scenario B
  - "Deterministic ranking" → fixture-locked ranking test
  - "CI green" → the `loop-verify` workflow

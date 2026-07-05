# Loop Engineering for GitHub Copilot

A repository template that turns GitHub Copilot from a one-shot prompt tool into a
**repeatable delivery loop**: assign an issue, and Copilot plans, builds, tests,
fixes CI, and opens a merge-ready PR — carrying context across every step.

> 📖 Full write-up: [**Introducing Loop Engineering**](https://medium.com/@valentinaalto/introducing-loop-engineering-ac7a6098bb10?sharedUserId=valentinaalto) on Medium.

## What is loop engineering?

Most AI-assisted coding is *prompt-centric*: one prompt, one answer, and you
re-establish context for the next step. [**Loop engineering**](https://addyosmani.com/blog/loop-engineering/)
is *system-centric* — you design a recurring, verifiable workflow once and let the
agent run it. The core cycle is:

> **trigger → plan → execute → verify → persist state → repeat**

The term is community/industry vocabulary (not an official GitHub product name),
popularized by practitioners describing a shift from "writing prompts" to
"designing the loop that prompts the agent." GitHub Copilot supplies the runtime
primitives (plan mode, autopilot, fleet, skills, hooks, MCP, scheduling); this repo
supplies the committed *policy* that makes the loop repeatable and issue-agnostic.

## The primitives under `.github/`

The loop is committed to the repo as real artifacts. Each maps to a step (P0–P8)
and a Copilot mechanism. **None of them mention any specific feature** — the same
set drives any issue.

| File | Loop step | Mechanism |
|---|---|---|
| `workflows/loop-dispatch.yml` | **P0 Trigger** — polls (and reacts to `issues: assigned`) for open issues assigned to the loop owner and labeled `loop`, then hands them to Copilot | GitHub Actions (scheduler) |
| `copilot-instructions.md` | **P1–P8 protocol** + hard rules Copilot follows on every task | Custom instructions |
| `ISSUE_TEMPLATE/feature-loop.yml` | **P1 input** — forces issues into goals / constraints / acceptance criteria | Issue template |
| `skills/deliver-feature/SKILL.md` | reusable "how we ship" playbook, auto-invoked on feature issues | Skill |
| `workflows/loop-verify.yml` | **P4 verify + P8 done-condition** — lint/test/contract gate; fails PRs with unchecked criteria | GitHub Actions CI |
| `hooks/pre-pr.json` | guardrails — no push to `main`, no `--no-verify`, warn on missing tests | Copilot hooks |

Runtime steps between the artifacts — **P2 plan (human gate)**, **P3 implement in
slices** (autopilot/fleet), **P5 auto-recover**, **P7 persist memory** (issue/PR
thread via the GitHub MCP server) — are provided by Copilot itself and governed by
`copilot-instructions.md`.

## How to use this repo with GitHub Copilot

1. **Enable Actions** on the repo (Settings → Actions).
2. **Set the loop owner** (if not the repo owner): Settings → Secrets and variables
   → Actions → *Variables* → add `LOOP_OWNER` = your GitHub username.
3. **File an issue** using the *Feature (Delivery Loop)* template.
4. **Assign it to yourself and add the `loop` label.** That's the trigger — the
   `loop-dispatch` scheduler picks it up (within ~15 min, or immediately on assign)
   and hands it to the Copilot coding agent.
5. **Review the plan** Copilot posts, reply `plan approved`.
6. **Let it run.** Copilot implements in slices, runs `loop-verify`, and
   auto-recovers from CI failures and your review comments.
7. **Merge** once every acceptance criterion is checked and CI is green — the
   done-condition gate won't let the PR pass otherwise.

You intervene at exactly two points: **approve the plan** and **click merge**.
Everything in between runs on the loop.

> ⚠️ **Cost note:** autopilot and fleet increase model interactions. `loop-dispatch`
> caps new loops per cycle (`MAX_STARTS`) and continuation limits bound autonomous
> runs — keep these in place to control token spend.

## References

1. Valentina Alto — *Introducing Loop Engineering* (Medium) — https://medium.com/@valentinaalto/introducing-loop-engineering-ac7a6098bb10?sharedUserId=valentinaalto
2. Addy Osmani — *Loop Engineering* — https://addyosmani.com/blog/loop-engineering/
3. cobusgreyling/loop-engineering (patterns & scaffolding) — https://github.com/cobusgreyling/loop-engineering
4. GitHub Copilot CLI — overview — https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/overview
5. GitHub Copilot CLI — autopilot — https://docs.github.com/en/copilot/concepts/agents/copilot-cli/autopilot
6. GitHub Copilot CLI — fleet (parallel subagents) — https://docs.github.com/en/copilot/concepts/agents/copilot-cli/fleet
7. GitHub Copilot — custom instructions — https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions
8. GitHub Copilot — skills — https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills
9. GitHub Copilot — hooks — https://docs.github.com/en/copilot/concepts/agents/hooks
10. GitHub Copilot — MCP (context/tools) — https://docs.github.com/en/copilot/concepts/context/mcp
11. GitHub Copilot CLI — scheduling prompts — https://docs.github.com/en/copilot/how-tos/copilot-cli/automate-copilot-cli/schedule-prompts
12. GitHub Copilot CLI — best practices — https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-best-practices

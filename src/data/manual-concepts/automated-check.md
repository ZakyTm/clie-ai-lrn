---
id: automated-check
title: Automated Check
summary: A deterministic verification tool run locally (lints, typechecks, builds, test suites) that gives the agent binary pass/fail logs to self-correct from.
domains:
  - "Section 9 — Skills and Subagents"
related:
  - automated-review
  - human-review
  - tool-result
  - ax
sources:
  - "https://en.wikipedia.org/wiki/Software_testing"
  - "https://docs.anthropic.com/en/docs/build-with-claude/tool-use"
---

An automated check is a deterministic test or validation run in the codebase environment (such as typecheckers, test suites, and linters). It returns a binary pass/fail result with precise console logs, allowing the agent to self-correct without human intervention.

You set up automated checks when you:
*   Configure npm scripts like `npm run test` or `npm run lint`.
*   Establish git hooks to block commits if typechecks fail.
*   Setup CI/CD pipelines to run test suites on incoming branches.

---

## The Self-Correction Loop

AI models are highly responsive to diagnostic error logs. If an agent writes code that contains a syntax error, it cannot detect it using reasoning alone. Instead, it relies on automated checks:

1.  **Write**: The agent writes a code edit to a file.
2.  **Execute (Tool Call)**: The agent runs `npm run build` or `tsc --noEmit` as a tool call.
3.  **Log (Tool Result)**: The compiler returns a failure output: `src/api/auth.ts:15:23 - Type 'string' is not assignable to 'number'`.
4.  **Correct**: The model reads the file name, line number, and error message, edits the target line, and runs the compile check again.

```
Agent Edits File ──► Runs Automated Check (e.g. Typecheck) ──► Error Output ──► Model Self-Corrects
```

For this loop to work, checks must be **deterministic** (identical code must always yield the identical result). A flaky test or unstable environment poisons the self-correction loop, causing the agent to break correct code or get stuck in loop cycles.

---

## Field Applications & AX (Agent Experience)

The quality of automated checks is the single largest factor in a repository's **AX (Agent Experience)**. A project with strict TypeScript typing, instant lint checks, and fast unit tests enables the agent to catch and fix 95% of its own errors before you ever see them.

# AVOID
Do not use flaky, slow, or non-deterministic test suites as your primary agent check tool.
*   *Avoid*: Letting the agent run a 10-minute end-to-end integration test suite that fails randomly due to network latency.
*   *Write*: Configure fast, isolated unit tests (like Vitest or Jest in local paths) that return results in under 5 seconds.

# USAGE
`Developer A`: "The agent keeps shipping code with syntax bugs in its pull requests."
`Developer B`: "We don't have a typechecker or linter wired into its tool set. The model is vibing on syntax. Let's add `npm run typecheck` to the tool list so it has to pass the automated check before creating the PR."

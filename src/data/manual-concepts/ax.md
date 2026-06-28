---
id: ax
title: Agent Experience (AX)
summary: How well a codebase and its environment are set up to support autonomous agents, defined by fast deterministic checks, clean API boundaries, and low context overhead.
domains:
  - "Section 11 — Agent experience"
related:
  - dx
  - automated-check
  - agentsmd
  - context-window
sources:
  - "https://modelcontextprotocol.io"
  - "https://docs.anthropic.com/en/docs/build-with-claude/tool-use"
---

Agent Experience (AX) is the measure of how well a codebase and its environment support autonomous AI agents. When the same model runs successfully in one repository but generates bugs in another, the difference is typically **AX**, not the model.

You optimize AX whenever you:
*   Configure fast, deterministic **Automated Checks** (linters, typecheckers, tests) that return error logs as plain text.
*   Establish clean, modular code architectures where behavior is hidden behind small, predictable interfaces.
*   Keep your standing rules (`AGENTS.md`) and tool schemas lean to protect the model's **Context Window**.

---

## The Three Dimensions of AX

High-quality AX is built across three primary dimensions:

| Dimension | What Good AX Looks Like | Why It Matters for Agents |
| --------- | ----------------------- | ------------------------- |
| **Automated Checks** | Fast, stable, compile, lint, and unit test scripts. | The agent needs binary feedback and precise console trace logs to self-correct. |
| **Architecture** | Modularity, strict typing, and folders that say what they do. | The agent can read and write to specific modules without needing to read the entire repository. |
| **Free Context** | Standing files (`AGENTS.md`) kept under 60 lines. | Protects the **Attention Budget**, keeping the agent focused inside the **Smart Zone**. |

Unlike humans, agents do not benefit from graphical dashboards or tooltip autocompletes. They require errors formatted as plain, descriptive text inside the **Tool Result** payloads. If a repository has slow or unstable tests, or requires undocumented "tribal knowledge" to compile, the agent's experience (AX) is poor, and its code output will degrade.

---

## Field Applications

Engineers improve AX by adding type checkers and linters directly to their local agent setups:
*   *Configuring AX*: Verify that `npm run test` exits with non-zero codes on failure, and returns the specific file line containing the error.

# AVOID
Do not blame the model or rewrite your prompts when an agent repeatedly fails to write correct code in a messy, undocumented codebase. Fix the repository's AX instead.
*   *Avoid*: Rewriting system prompts to explain undocumented import paths.
*   *Write*: Restructure the code folders to follow standard framework rules, and add TypeScript definition files.

# USAGE
`Developer A`: "The agent writes excellent code in our backend API, but generates buggy trash in our frontend repo."
`Developer B`: "That's an AX gap. The API repo has strict TypeScript definitions and unit tests that run in 2 seconds, allowing the agent to self-correct. The frontend repo has neither, and loads a massive, bloated system brief. Let's fix the frontend's AX by setting up a fast linter."

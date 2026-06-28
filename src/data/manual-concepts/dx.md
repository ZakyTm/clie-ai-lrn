---
id: dx
title: Developer Experience (DX)
summary: The quality of the interaction between a human developer and a codebase toolchain, characterized by fast feedback, clean documentation, and ease of work.
domains:
  - "Section 10 — Human and Vibe review"
related:
  - ax
  - stateful
  - stateless
  - context-window
sources:
  - "https://en.wikipedia.org/wiki/Developer_experience"
  - "https://modelcontextprotocol.io"
---

Developer Experience (DX) is the measure of how easy, fast, and friction-free it is for a human developer to build software within a codebase and toolchain. Good DX is defined by fast compiler feedback, clear error messages, intuitive directory structures, and setup commands that work on the first run.

You optimize DX whenever you:
*   Write clear readmes explaining how to configure local environment keys.
*   Speed up your local compiler so test suites run in under 3 seconds.
*   Setup autocomplete tools and syntax highlighters for your IDE.

---

## Humans are Stateful; Agents are Stateless

The key difference between DX (for humans) and **AX (Agent Experience)** (for models) comes down to memory:

*   **Humans are Stateful**: A human developer learns the codebase once. If the folder structure is confusing or the documentation is missing, the human asks a colleague, memorizes the layout, and routes around the friction. Humans survive poor DX by accumulating experience over weeks and months.
*   **Agents are Stateless**: An agent re-learns your entire codebase from scratch in every single session. It cannot ask questions in Slack or remember yesterday's workarounds unless they are explicitly recorded in the **Environment** files (like `AGENTS.md`) and loaded into its **Context Window**.

A codebase can have decent DX (because humans have learned to tolerate the friction) but terrible AX (because the agent gets stuck on the friction every time it boots).

---

## Field Applications

While DX investments (like strict TypeScript typings and fast unit tests) improve AX automatically, some areas diverge. A beautiful onboarding dashboard helps a human engineer for their first week, but is completely invisible to an agent. The agent requires clear text files and path declarations that its file search tools can read.

# AVOID
Do not assume that because your team of human engineers is productive, your repository is automatically ready for autonomous agents.
*   *Avoid*: Relying on verbal agreements or Slack discussions to explain build rules.
*   *Write*: Document all build and validation scripts inside `package.json` or `AGENTS.md` so agents can find and run them.

# USAGE
`Developer A`: "Our codebase is easy to work in; it only takes a week for new hires to get up to speed."
`Developer B`: "That's DX. Humans can accumulate tribal knowledge over that week. The agent doesn't get a week — it starts stateless on every task. We need to check our AX separately to make sure it has the files and tools it needs to compile code on turn one."

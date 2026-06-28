---
id: afk
title: Away From Keyboard (AFK)
summary: A working pattern where the developer leaves the agent to run unattended, deferring all review to the end of the session.
domains:
  - "Section 9 — Skills and Subagents"
related:
  - human-in-the-loop
  - automated-check
  - automated-review
  - human-review
sources:
  - "https://en.wikipedia.org/wiki/Autonomic_computing"
  - "https://docs.anthropic.com/en/docs/build-with-claude/tool-use"
---

AFK (Away From Keyboard) is an agent execution pattern where the developer kicks off a task and walks away, letting the agent run autonomously in the background. It represents the ultimate throughput multiplier of AI coding: running multiple parallel agents on refactoring tasks while you sleep, eat, or focus on other design problems.

You run agents AFK whenever you:
*   Configure an agent to migrate 50 files from one syntax format to another overnight.
*   Setup a background pipeline to run security audits on repository branches.
*   Use a script in Bypass mode inside a secure **Sandbox** to resolve a list of tickets.

---

## Managing the AFK Risk

Without a human in the loop to steer, agents handle ambiguity differently. In a live chat, the agent stops and asks you questions; when running AFK, it makes a guess and keeps going. Every subsequent decision builds on that guess, which can lead to hours of coherent, completely incorrect code.

To run AFK safely, you must shift your controls to the **Before** and **After** phases:

1.  **Before (Planning)**: Write a strict **Spec** or plan on disk (e.g. `todo.md`) resolving all ambiguities and defining variables up front, leaving no gaps for the model to guess.
2.  **During (Safety)**: Lock the agent inside a **Sandbox** (Docker container) without network write access, and wire up fast **Automated Checks** (typechecks, test suites) so the agent can self-correct when code fails.
3.  **After (Review)**: The run must terminate in a reviewable format (like a git branch or a Pull Request) for **Human Review**. Never let an AFK agent merge changes directly to `main`.

```
[ Pre-run: Spec & Sandbox ] ──► [ AFK Run: Self-Correction Loop ] ──► [ Post-run: PR & Human Review ]
```

---

## Field Applications

Developers configure their terminal runners to output distinct branches for review:
*   *Shell Command*:
    ```bash
    # Run the refactoring agent on a separate git branch and push to origin when tests pass
    node agent-runner.js --branch=feature/refactor-auth --permission-mode=bypass
    ```

# AVOID
Do not run AFK agent sessions on your primary development environment with full write permissions without git commits or code isolation.
*   *Avoid*: Launching a bypass-mode agent on your raw working directory without checking in your current changes first.
*   *Write*: Verify all local modifications are committed to Git, and run the agent inside a separate container volume.

# USAGE
`Developer A`: "I'm going to let the agent refactor our logger module while I go home for the night."
`Developer B`: "Great, make sure it's running inside a Docker sandbox and has the test suite command configured. That way it can run the tests, self-correct if it breaks anything, and push a draft branch we can human-review in the morning."

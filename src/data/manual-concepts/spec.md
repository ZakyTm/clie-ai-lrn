---
id: spec
title: Spec
summary: A high-level handoff artifact (like a PRD or design doc) stored in the environment that defines a project's goals, constraints, and ticket checklist across multiple sessions.
domains:
  - "Section 7 — Secondary source"
related:
  - handoff-artifact
  - ticket
  - clearing
  - context-window
sources:
  - "https://en.wikipedia.org/wiki/Specification_(technical_standard)"
  - "https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching"
---

A spec (specification) is a durable **Handoff Artifact** that defines the goal and parameters of a multi-session project. It lives in your filesystem (or issue tracker) and coordinates the work of multiple successive chat sessions.

You create and consult specs when you:
*   Write a Product Requirements Document (PRD) to define what you are building.
*   Draft a technical Product Design Document (PDD) outlining your database and routing strategy.
*   Maintain a `plan.md` file in your repository containing a checklist of features.

---

## Why Specs Exist: Escaping the Dumb Zone

Any feature that requires more than a few turns of code editing will exceed a single model's **Smart Zone** and fill the **Context Window**. If you attempt to write a complex feature in a single session, the model will degrade, making mistakes and ignoring constraints.

The spec solves this by storing the project's source of truth outside the context window:
1.  **Goal Preservation**: The spec holds the master plan, style guides, and constraints.
2.  **Modular Sizing**: The spec breaks the work down into individual, bite-sized **Tickets** (each designed to be completed in a single fresh session).
3.  **Clean Starts**: Each new session begins by reading the spec to understand where the work stands, without inheriting the accumulated token noise of previous steps.

```
Master Spec File (on disk) ──► Session 1 (Build Ticket 1) ──► Clear
                           ──► Session 2 (Build Ticket 2) ──► Clear
                           ──► Session 3 (Build Ticket 3) ──► Done
```

---

## Field Applications

In modern agent workflows, engineers write specs (e.g. `docs/PRD.md`) containing:
*   **Context Pointers**: Direct paths to target files.
*   **Tickets Checklist**: A list of tasks marked as `[x] Complete` or `[ ] Pending`.
At the start of every session, they point the model to the spec.

# AVOID
Do not let agents start implementing a large feature without writing a spec or plan file first. Without a spec, the agent will drift, invent ad-hoc structures, and hit the context limit before finishing.
*   *Avoid*: "Write our entire user dashboard routing system."
*   *Write*: "Read our specs in `docs/PRD.md`, and write a plan to break it into three tickets."

# USAGE
`Developer A`: "We are 20 messages deep and the agent is starting to mix up routes."
`Developer B`: "We shouldn't do this in one chat. Let's write our current state into a `plan.md` spec file on disk, clear the session, and tackle the next ticket in a fresh window."

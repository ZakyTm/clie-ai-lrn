---
id: ticket
title: Ticket
summary: A granular handoff artifact that scopes a single session of work, designed to be completed before the model drifts out of the smart zone.
domains:
  - "Section 7 — Secondary source"
related:
  - spec
  - handoff-artifact
  - smart-zone
  - context
sources:
  - "https://en.wikipedia.org/wiki/Issue_tracking_system"
  - "https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching"
---

A ticket (or task ticket) is a small **Handoff Artifact** that defines the scope of work for a single conversation session. It stands alone or acts as a child task within a larger **Spec**.

You create and size tickets when you:
*   Break a large feature checklist down into specific sub-tasks.
*   Write a GitHub issue describing a bug, listing file paths and expected behaviors.
*   Coordinate parallel agents to work on independent modules at the same time.

---

## Sizing for the Smart Zone

The defining constraint of a ticket is its size: **one session**. 
*   **Too Big**: If the session enters the "dumb zone" (sloppy code, repeated mistakes) before the ticket is completed, the ticket is too large. You must split it.
*   **Too Small**: If the agent spends most of its context tokens loading compiler setups and running commands only to perform a 5-second one-line edit, the ticket is too small. You should merge it with sibling tasks.

A high-quality ticket is written for a reader with zero previous context, containing:
1.  The exact **Goal** and expected behavior.
2.  **Context Pointers** to the target files (e.g. `src/routes/user.ts`).
3.  Concrete **Acceptance Criteria** (e.g. "The route must return a 401 error if the token is missing").

```
[ Master Spec ]
    ├── Ticket 1: Build User Interface (Session 1) ──► Complete
    ├── Ticket 2: Wire Up DB Queries  (Session 2) ──► Complete
    └── Ticket 3: Write Route Tests   (Session 3) ──► Complete
```

---

## Field Applications & Parallel Runs

By breaking a feature down into independent tickets (tasks that don't block each other), you unlock parallelism. You can launch three separate agent containers simultaneously to work on three separate tickets, speeding up development.

# AVOID
Do not write vague ticket instructions that require the agent to search your entire repository or guess the file locations.
*   *Avoid*: "Fix the login route bug."
*   *Write*: "Read `src/api/login.ts` and correct the database timeout handling. The query must fail with a 500 status on connection timeouts."

# USAGE
`Developer A`: "How should we organize this migration?"
`Developer B`: "Let's list the tasks. We'll write three distinct tickets in our roadmap file. We can run a fresh session on the first ticket, verify the tests pass, clear, and move to the second."

---
id: human-in-the-loop
title: Human-in-the-loop
summary: A working pattern where the developer actively monitors, redirects, and collaborates with the agent in real time, catching mistakes before they build up.
domains:
  - "Section 9 — Skills and Subagents"
related:
  - afk
  - permission-request
  - human-review
  - vibe-coding
sources:
  - "https://en.wikipedia.org/wiki/Human-in-the-loop"
  - "https://modelcontextprotocol.io"
---

Human-in-the-loop (HITL) is a collaborative development pattern where the developer actively monitors and guides the agent's work. Instead of walking away and checking the results later, you review the agent's proposed plans, inspect its file edits mid-flight, and redirect its approach in real time.

You operate in a Human-in-the-loop pattern whenever you:
*   Use an IDE agent in "ask permissions" mode, reviewing each file write.
*   Interject in the chat: "Stop, that's the wrong directory; check the components folder instead."
*   Conduct Socratic planning interviews (**Grilling**) before letting the agent modify files.

---

## When to Stay in the Loop

Choosing between staying in the loop and leaving the agent to run unattended (**AFK**) depends on the risk and reversibility of the task:

*   **High Risk (Stay in the Loop)**: Tricky database migrations, changes to authentication logic, or deploying to production. Catching a mistake early saves hours of debugging.
*   **Low Risk (Go AFK)**: Writing repetitive unit tests, migrating simple syntax styles, or compiling documentation. These tasks can be verified later using automated checks.

```
Low Risk / Easy to Verify  ──► Run AFK (Unattended)
High Risk / Irreversible   ──► Human-in-the-Loop (Active Steering)
```

The challenge of staying in the loop is **attention overhead**. If the agent requests permission for every trivial read operation, you will get approval fatigue. A well-designed harness uses strict **Permission Modes** to auto-approve safe reads while pausing for unsafe writes.

---

## Field Applications

Developers toggle between in-the-loop and AFK states during a task:
1.  **Start (In-the-loop)**: Set up the design concept and verify the early files.
2.  **Middle (AFK)**: Once the pattern is clear, switch permissions to bypass and let the agent write the boilerplate.
3.  **End (In-the-loop)**: Review the diffs and run the test suite.

# AVOID
Do not let agents perform complex, multi-file structural changes unattended without sandboxes or checkpoints. If they go off-track in the first minute, they will spend the next hour building coherent, completely incorrect code.
*   *Avoid*: Launching a full refactoring agent on a critical module and walking away without git backups or write approvals.
*   *Write*: Stay in the loop for the first few turns to verify the model's approach, then delegate the rest.

# USAGE
`Developer A`: "Should we let the agent execute the database migration script while we go to lunch?"
`Developer B`: "No, that's too risky. Let's keep it human-in-the-loop. I want to inspect its SQL schemas and approve the migration step-by-step to make sure it doesn't drop any column constraints."

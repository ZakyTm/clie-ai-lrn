---
id: handoff-artifact
title: Handoff Artifact
summary: A persistent file written to the environment by an agent to record plans, status, and decisions, used to brief a fresh successor session.
domains:
  - "Section 7 — Secondary source"
related:
  - handoff
  - clearing
  - spec
  - ticket
sources:
  - "https://en.wikipedia.org/wiki/Artifact_(software_development)"
  - "https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching"
---

A handoff artifact is a durable file (usually a markdown document like `plan.md` or `handoff.md`) written to the filesystem by one session to serve as the brief for the next session.

Because the model is **stateless**, clearing a chat deletes all accumulated plans and decisions. Saving these choices to a file in the environment ensures they survive the reset.

You write handoff artifacts whenever you:
*   Tell an agent, "Compile a list of what you modified and write it to `done.md` before we restart."
*   Create a step-by-step checklist (`plan.md`) to guide a multi-session migration.
*   Draft specifications (specs) that multiple parallel subagents read.

---

## Anatomy of a Good Artifact

A handoff artifact is a **Secondary Source**. To be useful to a successor session that starts with zero context, it must be concrete and clear:

1.  **Concrete References**: Use exact relative file paths (e.g. `src/db/client.ts`) rather than vague statements ("the database file").
2.  **Explicit Status**: State clearly what is complete, what is currently broken, and what the immediate next step is.
3.  **Rationale**: Record *why* a decision was made (e.g., "We chose pgvector because we need local Postgres integration") so the next session doesn't waste time re-evaluating it.
4.  **Citations**: Link back to primary files or previous commit hashes.

```
Session A ──► Writes "handoff.md" to Disk ──► Session Cleared ──► Session B reads "handoff.md"
```

---

## Field Applications

### 1. Fullstack Developers (Creating Handoff prompts)
At the end of a long session, developers instruct the agent to write a handoff artifact:

*   *Prompt Example*:
    ```markdown
    We are about to clear this session. Write a handoff artifact named 'handoff_migration.md' in the project root. 
    Detail the exact files modified, the decisions made regarding the schema, and the three remaining tickets we need to run in the next session.
    ```

# AVOID
Do not use conversational chat history as your only record of design decisions. Wiping the session wipes those decisions, forcing you to re-explain them.
*   *Avoid*: Restarting a session and expecting the agent to remember the file modifications you discussed in the previous chat.
*   *Write*: Save a `plan.md` to the workspace containing the list of changes, and point the agent to it.

# USAGE
`Developer A`: "We cleared the chat to get out of the dumb zone, but now the agent is suggesting we rewrite the database keys in a different format."
`Developer B`: "We forgot to write a handoff artifact. The new session doesn't know what we decided in the previous chat. Let's write our design decisions into `plan.md` and start again."

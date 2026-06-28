---
id: session
title: Session
summary: The active span of a conversation thread, representing the sequence of user queries, tool calls, and model responses accumulated in memory.
domains:
  - "Section 2 — Model provider request"
related:
  - turn
  - clearing
  - stateful
  - context-window
sources:
  - "https://en.wikipedia.org/wiki/Session_(computer_science)"
  - "https://docs.anthropic.com/en/docs/about-claude/models"
---

A session is the active lifespan of a single chat thread. It represents the accumulated history of system prompts, user queries, tool calls, and completion outputs stored in the client harness.

You manage sessions whenever you:
*   Open a new chat tab in your browser or IDE.
*   Clear the console history to start a new coding task.
*   Configure background agent containers to run a series of tickets.

---

## Session Lifecycle

Because the model itself is **stateless**, the session exists purely on the client-side (maintained by the harness). A session passes through three phases:

1.  **Bootstrap**: The harness starts the session, loading **AGENTS.md** rules, system instructions, and initial files into the context window.
2.  **Interaction (Turns)**: The user and model exchange messages. The context grows with every turn.
3.  **Expiry/Termination**: The session ends when the user **clears** it (starting a fresh window), or when token limits trigger **Compaction**, compressing the session to free up room.

Keeping sessions short (matching one ticket per session) is the most reliable way to stay inside the **Smart Zone** and avoid **Attention Degradation**.

---

## Field Applications

In multi-agent systems, developers track session IDs in SQLite databases to serve persistent histories in web interfaces:
*   *Workflow*: User opens tab ──► Harness loads Session ID ──► Pulls history from DB ──► Serializes context array ──► Sends stateless request to API.

# AVOID
Do not stack multiple unrelated features or bug fixes into a single session. This bloats the token history, making the model sluggish and prone to mixing up parameters.
*   *Avoid*: Fixing a database timeout, refactoring a CSS header, and updating npm packages all inside the same session window.
*   *Write*: Open a fresh session for each task, using a handoff specs document to bridge files if they block each other.

# USAGE
`Developer A`: "The agent is starting to lag and is writing garbage code."
`Developer B`: "We've been in this session for three hours, and we have 120,000 tokens in the history. Let's clear the session and start a new one to refresh the context."

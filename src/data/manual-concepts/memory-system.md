---
id: memory-system
title: Memory System
summary: The client-side database or filesystem infrastructure that saves user preferences and project facts across sessions to simulate stateful continuity.
domains:
  - "Section 8 — Autocompact"
related:
  - stateful
  - clearing
  - context-pointer
  - session
sources:
  - "https://en.wikipedia.org/wiki/Dynamic_memory_allocation"
  - "https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching"
---

A memory system is an application layer in the client harness designed to persist information across separate chat sessions. Because models are **stateless**, a memory system saves facts to a local file or database during a chat and loads them back into the context window at the start of future sessions.

You interact with memory systems when:
*   An agent remembers that you prefer pnpm over npm after you clear the chat history.
*   Using Claude Code's `/memory` command to save facts about your codebase.
*   Building a custom folder of markdown notes (like `.agents/memory/`) that your agent is instructed to read.

---

## The Read/Write Paths

A memory system works in two halves:

1.  **The Write Path**: During a session, when you state a preference (e.g. "We use PostgreSQL for all databases") or the model learns a codebase rule, the harness writes this fact to a file on your disk.
2.  **The Read Path**: When you start a new session, the harness automatically loads these files (or queries their embeddings via RAG) to rebuild the model's contextual awareness.

```
Session 1: "We use Postgres" ──► [ Memory System writes to disk ]
Session 2 (Fresh): [ Reads memory file from disk ] ──► Model knows "Postgres" automatically
```

Like any stored content, memories can drift. A preference recorded six months ago may conflict with your current tech stack. To prevent memory pollution, a memory system requires manual pruning, just like your codebase.

---

## Field Applications

Developers can build a lightweight memory system manually without complex libraries:
*   *Implementation*: Create a `.agents/rules.md` file. Add a line to your system prompt: "Read the rules in `.agents/rules.md` at start to understand user preferences."

# AVOID
Do not let the memory system inline every single saved note or preference. As the number of memories grows, loading them all will bloat the context window, causing **Attention Degradation**.
*   *Avoid*: Loading 500 lines of old developer preferences into the context of every single session.
*   *Write*: Load a short index of memory keys, and let the agent query the full text of a memory using a **Context Pointer** tool only when needed.

# USAGE
`Developer A`: "How does Claude Code remember that we use Vitest instead of Jest even after we clear the chat?"
`Developer B`: "It uses a memory system. When we ran our first test, it wrote a note to its local memory file. When we start a new session, the harness reads that note and injects it into the prompt background so we don't have to explain it again."

---
id: contextual-knowledge
title: Contextual Knowledge
summary: The active facts, source code files, and logs loaded inside the model's context window that it can read directly at query time.
domains:
  - "Section 5 — Parametric knowledge"
related:
  - context
  - parametric-knowledge
  - context-window
  - rag
sources:
  - "https://en.wikipedia.org/wiki/In-context_learning_(machine_learning)"
  - "https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching"
---

Contextual knowledge (also called in-context knowledge) is the active information loaded inside the model's **context window** for the current request. It includes the user's files, RAG document search matches, compiler logs, and conversation history.

You manipulate contextual knowledge whenever you:
*   Paste your database connection class directly into a prompt.
*   Setup a RAG script to query a vector database and append matching text chunks.
*   Expose your project specifications (`AGENTS.md` or `plan.md`) to the agent loop.

---

## Read vs. Recall

Contextual knowledge behaves like an "open-book" reference, whereas **parametric knowledge** behaves like "dredged-up memory."
*   **Zero Hallucinations (Ideally)**: Because the model can read the text directly off the page in its active attention heads, it is far less likely to hallucinate facts or invent interfaces.
*   **Dynamic and Up-to-Date**: You can update contextual knowledge instantly (e.g. editing a local markdown file) without needing to retrain or fine-tune the model parameters.
*   **The Cost**: While parametric memory costs nothing to query, contextual knowledge is billed per-token in every request and consumes the model's finite **attention budget**.

---

## Overriding Parametric Memory

When a model's parametric training conflicts with your contextual files (e.g. you paste a customized API structure that differs from the public library version), the contextual knowledge wins. The model reads the new structure and follows it, though old parameters can still bleed through if the context window gets bloated.

# AVOID
Do not assume the model will remember a file's content in a new session unless you explicitly load it back into the context. 
*   *Avoid*: Expecting a new chat window to know the schema details you loaded in a previous chat yesterday.
*   *Write*: Save key files locally and use your harness to inject them as contextual knowledge at the start of every session.

# USAGE
`Developer A`: "Why did it write the DB query perfectly this time, when it was inventing table columns five minutes ago?"
`Developer B`: "Five minutes ago it was relying on parametric memory and guessing. This time, we loaded the schema file as contextual knowledge, so it just read the column names directly off the prompt."

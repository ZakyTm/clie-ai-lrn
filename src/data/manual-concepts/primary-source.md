---
id: primary-source
title: Primary Source
summary: The original, raw source of truth (e.g. active code files, terminal test logs, database rows) rather than summaries or descriptions of them.
domains:
  - "Section 6 — Attention degradation"
related:
  - secondary-source
  - filesystem
  - context
  - handoff-artifact
sources:
  - "https://en.wikipedia.org/wiki/Primary_source"
  - "https://docs.anthropic.com/en/docs/build-with-claude/tool-use"
---

A primary source is the raw, original evidence of a system's state or behavior. In AI development, this means the active code files, the actual compiler terminal printouts, or raw API response payloads — rather than documents or readmes describing them.

You load primary sources whenever you:
*   Have an agent view the source code of a function to see how it works.
*   Paste raw terminal stdout errors directly into the chat prompt.
*   Expose a database schema query output directly to the context.

---

## Precision vs. Sizing Cost

When diagnosing bugs, primary sources are the only source of truth. A readme or design document describes what the code *should* do; the code itself is what the system *actually* does. 

However, loading primary sources comes with a cost:
*   **Token Overhead**: Inlining full source code files or large logs consumes a huge amount of **input tokens** and eats into the **attention budget**.
*   **The Trade-off**: You trade space for precision. A summary (secondary source) is cheap but lossy; a primary source is expensive but complete, containing the fine details that turn out to matter.

```
Primary Source (Code / Logs) ────► 100% Accurate ────► High Sizing Cost (Tokens)
Secondary Source (Readme / Spec) ──► Lossy / Stale ───► Low Sizing Cost (Tokens)
```

---

## Field Applications

When an agent behaves incorrectly (e.g., claiming a function has certain parameters that don't exist), it is usually because it is working from a stale readme (secondary source). The fix is to direct the agent's file viewer tool to read the actual source file (primary source).

# AVOID
Do not let agents write migrations or refactors based purely on descriptions, design specs, or diagrams. Always instruct them to read the code first.
*   *Avoid*: "Refactor the database queries based on this design doc."
*   *Write*: "Read the connection files in `src/db/` and the query modules, then refactor them based on the design doc."

# USAGE
`Developer A`: "The model says our auth token expires in 1 hour, but users are getting kicked out after 15 minutes."
`Developer B`: "It read that from the old design spec. Point the agent at the actual `config.ts` code — let it work from the primary source to see what timeout parameter is actually configured."

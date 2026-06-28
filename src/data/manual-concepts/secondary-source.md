---
id: secondary-source
title: Secondary Source
summary: A compiled, lossy description or summary of a primary source (e.g. readmes, design docs, compaction summaries) that trades detail for lower token costs.
domains:
  - "Section 7 — Secondary source"
related:
  - primary-source
  - handoff-artifact
  - compaction
  - context-pointer
sources:
  - "https://en.wikipedia.org/wiki/Secondary_source"
  - "https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching"
---

A secondary source is an account or summary of a **Primary Source**, one step removed. This includes project readmes, design documentation, architectural specifications, and model-generated compaction summaries.

You load secondary sources whenever you:
*   Read a library's getting-started guide rather than reading its raw source code.
*   Expose a `plan.md` checklist summarizing previous session edits.
*   Consult database diagrams instead of querying active tables.

---

## The Trade-off: Headroom vs. Drift

Secondary sources are the foundation of **Context** management. Because the **Context Window** is finite, you cannot load every single primary source file. Secondary sources solve this by compressing information, trading fidelity for headroom:

*   **Fidelity Loss**: By design, secondary sources are lossy. The summary or documentation writer decided what was important at that time, discarding edge cases or parameters that might turn out to be critical today.
*   **Documentation Drift**: Code evolves rapidly, but documentation does not. A secondary source often describes last month's architecture with complete, outdated confidence, leading to model **Hallucinations**.

To mitigate this, a high-quality secondary source should always leave a **Context Pointer** (like a file path or URL link) back to the primary source, letting the reader follow the pointer when precision is required.

---

## Field Applications

When compiling specifications for an agent, write brief secondary summaries that explicitly cite the source file paths:
*   *Template*: "The router handles auth (see source file: `src/api/auth.ts`)."

# AVOID
Do not let agents perform refactoring work based on stale documentation templates when the source code is readily available.
*   *Avoid*: "Refactor our styling based on this readme from last year."
*   *Write*: "Verify the current CSS configurations in `src/styles/global.css`, then refactor them according to the guidelines."

# USAGE
`Developer A`: "The model claims our library supports an `onProgress` callback, but the build is failing."
`Developer B`: "It read that from the readme (secondary source), which is outdated. Let's direct the agent to read the actual TS interface declaration (primary source) to see what callbacks are actually exported."

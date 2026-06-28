---
id: agentsmd
title: AGENTS.md
summary: A project brief file loaded by the harness at startup, detailing the project overview, folder layout, commands, and constraints for coding agents.
domains:
  - "Section 8 — Autocompact"
related:
  - progressive-disclosure
  - context-pointer
  - stateless
  - memory-system
sources:
  - "https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching"
  - "https://platform.openai.com/docs/guides/prompt-caching"
---

AGENTS.md (or its harness-specific equivalents like CLAUDE.md) is a configuration file stored in the root of your project directory. The harness automatically reads this file and injects its content into the model's **Context Window** at the start of every session. It serves as the "standing brief" for any agent working on the codebase.

You edit AGENTS.md whenever you:
*   Configure the exact build and test commands for your project so the agent knows how to run them.
*   Define hard constraints (e.g. "We do not use external CSS libraries in this project").
*   Detail the folder layout and data strategy to help agents navigate the codebase.

---

## Designing an Efficient Brief

Because the model is **stateless**, the harness must reload AGENTS.md on every single request. This means everything inside the file pays a token cost *every turn*. A poorly designed, bloated brief will exhaust the model's **Attention Budget** and cause **Attention Degradation**.

Follow these guidelines to design an efficient brief:
1.  **Keep it Under 60 Lines**: Keep instructions concise, declarative, and focused.
2.  **Use Context Pointers**: Do not inline full style guides or deployment runbooks. Instead, write a one-line description and point to their files (e.g. `Style Guide: see docs/style.md`). The agent will follow the pointer and read the detail only when a task requires it.
3.  **Core Commands**: Include exact console scripts (e.g., `npm run test`, `npm run build`) to prevent the model from guessing.

```
+-------------------------------------------------------------+
|                          AGENTS.md                          |
|                                                             |
|   - Project: Educational AI Directory                       |
|   - Stack: Astro, Tailwind v4                               |
|   - Test Command: "npm run test"                            |
|   - Coding Style: see docs/style.md (Context Pointer)       |
+-------------------------------------------------------------+
```

# AVOID
Do not paste entire codebase documentation files or raw coding tutorials directly into AGENTS.md.
*   *Avoid*: Appending your full 2,000-line CSS documentation sheet into the standing brief.
*   *Write*: Save the sheet to `docs/styling.md` and add a reference line in AGENTS.md: `For styling guidelines, read docs/styling.md`.

# USAGE
`Developer A`: "The agent is starting every session with 5,000 tokens already consumed, and it's ignoring our test commands."
`Developer B`: "Someone pasted our entire API tutorial into AGENTS.md. That is consuming our token budget and diluting its focus. Let's move the tutorial to a separate documentation file and leave a context pointer behind."

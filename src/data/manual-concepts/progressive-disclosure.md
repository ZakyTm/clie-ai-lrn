---
id: progressive-disclosure
title: Progressive Disclosure
summary: The optimization technique of loading only the specific context required for the active task, hiding detailed files behind context pointers until needed.
domains:
  - "Section 8 — Autocompact"
related:
  - context-pointer
  - context
  - agentsmd
  - attention-budget
sources:
  - "https://en.wikipedia.org/wiki/Progressive_disclosure"
  - "https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching"
---

Progressive disclosure is a context optimization pattern borrowed from user interface design. Instead of loading your entire codebase, style guides, and database schemas into the prompt up front, you load only a high-level summary list, revealing detailed files via **Context Pointers** only when the active task requires them.

You implement progressive disclosure whenever you:
*   Reference your project guidelines as external files rather than pasting them in `AGENTS.md`.
*   Build an agent tool list where the model requests file reads only when triggered.
*   Setup RAG to load specific document chunks rather than the entire handbook.

---

## The Efficiency Difference

Loading everything up front is expensive. Every token in the prompt is processed in the prefill phase on *every single turn*, draining your **Attention Budget** and leading to **Attention Degradation**.

Progressive disclosure inverts this:

```
[ Always-On Context (Small) ] ──► Contains Pointers (e.g. "For DB, read docs/db.md")
                                          │
                                          ▼ (Agent matches task)
[ Tool Call: view_file ] ────────► Loads "docs/db.md" (Detail revealed only when needed)
```

The agent reads the database spec when writing database code, the deployment guide when deploying, and neither when fixing a CSS alignment bug. This preserves the **Smart Zone** and keeps your bills low.

---

## Field Applications

Engineers organize documentation folders with short, clear index files:
*   *Index file (`docs/README.md`)*: Contains links describing the contents of sibling files (e.g. `auth.md`, `router.md`, `tests.md`). The agent reads this index first, then follows the relevant link.

# AVOID
Do not paste all your project manuals, style files, and setup instructions into a single startup prompt.
*   *Avoid*: Loading a 10,000-token styling stylesheet into the system prompt of a database migration task.
*   *Write*: Leave a reference link to the stylesheet in the styling tickets, letting the model read it only when styling is modified.

# USAGE
`Developer A`: "The model is getting confused because we loaded our API specs, database schemas, and deploy runbooks all at once."
`Developer B`: "That's a context overload. Let's use progressive disclosure. We'll strip the runbooks and specs out of our main prompt, replace them with brief descriptions pointing to their files, and let the agent call the read tool only when it needs them."

---
id: autocompact
title: Autocompact
summary: Compaction triggered automatically by the client harness when context size crosses a threshold (often 80%), risking the quiet loss of task constraints.
domains:
  - "Section 8 — Autocompact"
related:
  - compaction
  - context-window
  - attention-degradation
  - handoff-artifact
sources:
  - "https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching"
  - "https://platform.openai.com/docs/guides/prompt-caching"
---

Autocompact is an automated performance feature built into some agent harnesses. When the accumulated tokens in the context window cross a specific threshold (typically 80% capacity), the harness automatically runs a summarization query, clears the history, and injects the summary back as the new starting state — without asking the user.

You interface with autocompact when:
*   Running long-running CLI agents that continue executing tasks in a loop.
*   Building chatbot platforms that must manage memory without crashing.

---

## The Autocompact Risk: Quiet Memory Loss

While autocompact prevents token overflow errors, it poses a significant development risk: **it fires at a moment you did not choose**. 

*   **The Lossy Summary**: If the threshold is crossed mid-task (e.g. halfway through a complex code refactor), the model writes its own summary. It decides which constraints to preserve, occasionally discarding crucial details (like a type requirement or user instruction).
*   **Silent Failures**: The agent carries on working with complete confidence, but has quietly forgotten a constraint you established earlier in the session. You only notice the failure when its code starts violating your specifications.

```
Session Hits 80% Token Limit ──► Autocompact Fires (Automatic Summary) ──► Crucial Constraint Lost ──► Silent Bug
```

---

## Defending Against Autocompact

To prevent autocompact from losing your decisions:
1.  **Monitor Context Indicators**: Watch the token size indicator in your console and compact manually at a natural milestone (e.g. between tasks).
2.  **Write to Disk**: Keep project requirements and decisions written inside a file on your disk (like a `plan.md` spec). No automated summary can wipe files stored on your filesystem.
3.  **Adjust Thresholds**: Configure your harness settings to increase the buffer or turn autocompact off entirely.

# AVOID
Do not rely on conversation logs to store your project's styling and API constraints during a long multi-turn session. Autocompact will eventually wipe the detailed logs, diluting the rules.
*   *Avoid*: Pasting your system rules once and assuming the agent will remember them for 100 turns.
*   *Write*: Keep global rules in `AGENTS.md` or a local file, where they are loaded fresh on every turn regardless of compaction.

# USAGE
`Developer A`: "The model suddenly started ignoring our Postgres naming conventions that we discussed in the first message."
`Developer B`: "Check the logs. Autocompact fired automatically between turns, and the generated summary lost track of those naming rules. Let's write the rules into `AGENTS.md` so they stay locked in context."

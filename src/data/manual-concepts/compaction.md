---
id: compaction
title: Compaction
summary: An in-memory session reset where the active chat history is summarized by the model, throwing away the detailed transcript to free up context window space.
domains:
  - "Section 7 — Secondary source"
related:
  - autocompact
  - handoff
  - clearing
  - context-window
sources:
  - "https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching"
  - "https://platform.openai.com/docs/guides/prompt-caching"
---

Compaction (also called memory compaction or context summarization) is an in-memory session transition. When a chat grows heavy, the harness asks the model to summarize the progress and decisions made so far, discards the detailed conversation history, and seeds a fresh session with that summary.

You trigger compaction whenever:
*   An agent console displays a notice like `Compressing session history...`.
*   You ask the model, "Summarize our progress so far, and ignore our failed attempts before we proceed."
*   A client harness dynamically truncates early turns to stay under token limits.

---

## Trading Detail for Headroom

Compaction is a **Secondary Source** generated from the primary transcript. It represents a direct engineering trade-off: **fidelity for context window headroom**.

*   **What is kept**: The core decisions, active task checklists, and target file paths.
*   **What is lost**: All conversational noise, failed code structures, and debug printouts that were cluttering the model's focus.

Some advanced harnesses attach a **Context Pointer** (a file path or commit reference) to the compaction summary, allowing the model to look up the original detailed logs if a detail was lost during the summary.

```
Long conversation history (150K tokens) ──► Summarize ──► Fresh session (2K tokens summary)
```

---

## Field Applications & Guided Compaction

To ensure critical details survive compaction, developers trigger compaction manually at natural milestones (like after a plan is settled but before writing code) and instruct the model on what to preserve:

*   *Prompt Example (Guided Compaction)*:
    ```markdown
    We are about to compact this session. Summarize the active tasks. Ensure you preserve the database schema decisions we chose in turn 5, and list the exact paths of the files we edited.
    ```

# AVOID
Do not let the model compact the session in the middle of a delicate, multi-file code refactor. The summary could lose track of half-implemented variables, resulting in broken builds.
*   *Avoid*: Compacting the history while you have compile errors or pending changes in memory.
*   *Write*: Resolve the active compilation first, verify the tests pass, then compact to start the next feature.

# USAGE
`Developer A`: "Our session is slowing down and we are near the context limit."
`Developer B`: "Let's run a compaction. We'll ask the model to summarize our API structure choices, reset the history, and start our test verification turn using that summary."

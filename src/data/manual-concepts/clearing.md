---
id: clearing
title: Clearing
summary: Ending the current conversation session and starting a fresh one with a completely empty context window to wipe out accumulated noise.
domains:
  - "Section 6 — Attention degradation"
related:
  - context-window
  - session
  - handoff
  - compaction
sources:
  - "https://en.wikipedia.org/wiki/Session_(computer_science)"
  - "https://docs.anthropic.com/en/docs/about-claude/models"
---

Clearing is the act of terminating your current chat session and starting a fresh one. This purges the context window, resetting the token count to zero and clearing all accumulated logs, code explorations, and mistakes.

You clear a session whenever you:
*   Click the "New Chat" button in Claude or ChatGPT.
*   Type `/clear` or `/reset` in an IDE agent console.
*   Restart a local agent script to start a new sub-task.

---

## Purging the Context Noise

During a long debugging session, the context window accumulates:
*   Failed code versions that didn't compile.
*   Stale build logs and error printouts.
*   Model apologies and conversational pleasantries.

Because the model is **stateless**, it re-reads this entire history of errors on *every single turn*. This noise distracts the attention heads and causes **Attention Degradation**. Clearing is the bluntest, most effective cure: it drops all history (including the noise) and starts fresh.

---

## When to Clear and How to Transition

Clearing does not mean you lose your work. The code you wrote is saved on your disk. To carry critical context (like design choices or next steps) over to the new session:
1.  **Summarize**: Have the agent write a short **Handoff Artifact** (e.g. `handoff.md`).
2.  **Clear**: Reset the session.
3.  **Bootstrap**: Start the new session by feeding it the handoff file.

```
Long Session (Bloated) ──► Write Handoff Doc ──► Clear Chat ──► Load Handoff Doc (Fresh Focus)
```

# AVOID
Do not continue prompting an agent that has fallen into a loop or has started ignoring instructions. You are wasting tokens and billing costs.
*   *Avoid*: Trying to correct an agent's recursive compile failures on turn 35.
*   *Write*: Clear the session, load only the latest error log, and prompt it again.

# USAGE
`Developer A`: "The agent is stuck in a loop, repeatedly running the same tests and suggesting the same broken edits."
`Developer B`: "The context is polluted with our previous failing iterations. Let's write a quick plan doc of where we are, clear the session, and restart in a clean window with only that plan doc."

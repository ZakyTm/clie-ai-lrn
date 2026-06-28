---
id: attention-budget
title: Attention Budget
summary: The finite mathematical capacity each token has to distribute influence across other context tokens, which dilutes as prompt length grows.
domains:
  - "Section 5 — Parametric knowledge"
related:
  - attention-relationship
  - attention-degradation
  - context-window
sources:
  - "https://arxiv.org/abs/1706.03762"
  - "https://arxiv.org/abs/2307.03172"
---

The attention budget is the finite amount of mathematical focus each token can distribute across the rest of the context. Because this budget is fixed per token and does not increase when context size grows, long prompts dilute the model's focus.

You manage the attention budget whenever you:
*   Decide whether to paste a full codebase documentation file.
*   Prune conversation logs to make an agent follow instructions more reliably.
*   Restate system constraints in multi-turn chats.

---

## Signal-to-Noise Ratio

Think of the attention budget as a room with a fixed volume limit:
1.  **Low Noise (Short Context)**: If your context is small (e.g. 5,000 tokens), your instructions are the loudest sounds in the room. The model aligns its attention heads strongly to your constraints.
2.  **High Noise (Bloated Context)**: If you append 150,000 tokens of auxiliary code, logs, and files, your instructions do not get quieter, but the room gets much louder. The model's attention budget is spread across billions of relationship pairs, diluting your instructions into background hum.

This explains "agent disobedience": if you tell an agent "always format output as JSON" at turn 1, but keep pasting large debug tracebacks, the model will eventually drift and output plain text because the attention budget for that turn-1 rule has been exhausted.

---

## Mitigating Budget Exhaustion

To protect the attention budget:
*   Keep the context window small.
*   **Clear** or **compact** the session as soon as you enter the "dumb zone."
*   Restate critical constraints directly in the current turn instead of assuming the model remembers them from Turn 1.

# AVOID
Do not stack unnecessary guidelines, files, or warnings in your system prompt. Every idle rule spends a portion of the model's attention budget, weakening the focus on active tasks.
*   *Avoid*: Appending a massive style guide containing 50 rules when you only want the agent to fix a single database timeout query.
*   *Write*: Inject only the database query file and the specific timeout constraint, keeping the budget clear.

# USAGE
`Developer A`: "The model followed my custom CSS class constraints at first, but now it's ignoring them and generating standard Tailwind styles."
`Developer B`: "We've added 100K tokens of build outputs to the chat history. The Tailwind weights in its parameters are crowding out our CSS rules because the attention budget is diluted. Let's start a fresh session with only the target CSS file."

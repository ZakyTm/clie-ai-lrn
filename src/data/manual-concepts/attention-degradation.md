---
id: attention-degradation
title: Attention Degradation
summary: The gradual decline in a model's constraint-following and reasoning performance as prompt context length increases, caused by attention budget dilution.
domains:
  - "Section 6 — Attention degradation"
related:
  - attention-budget
  - smart-zone
  - clearing
  - compaction
sources:
  - "https://arxiv.org/abs/2307.03172"
  - "https://arxiv.org/abs/2311.05232"
---

Attention degradation (also called context degradation) is the gradual decline in a model's instruction-following and recall capabilities as the prompt context grows. Nothing about the model or its parameters changes; the decline is driven entirely by context size.

You observe attention degradation when:
*   An agent that followed rules perfectly for the first 10 messages starts making sloppy syntax mistakes.
*   The model asks you to provide information you already gave earlier in the chat.
*   The assistant writes code that contradicts instructions you established at the beginning of the session.

---

## The Silent Slide

Attention degradation is dangerous because it is gradual. There is no error message, threshold, or crash. The model continues to generate text with the same confidence and fluency, but it slowly drifts from your constraints. 

```
Small Context (Sharp / Responsive) ──► Bloated Context ──► Attention Degradation (Forgetful / Sloppy)
```

Many developers make the mistake of re-pasting the ignored rules or arguing with the model inside the same chat window. This actually makes the problem worse by adding *more* tokens to the bloated context, further diluting the model's focus.

---

## Recovery Strategies

When a model's performance slips due to attention degradation, do not push through. Instead:
1.  **Clear**: Start a brand new chat session with an empty context window.
2.  **Compact**: Ask the model to summarize the decisions so far, throw away the history, and seed a fresh session with the summary.
3.  **Handoff**: Write key decisions to a local markdown file and start a fresh session that loads only that file.

# AVOID
Do not argue with a model about ignored instructions in a bloated chat session.
*   *Avoid*: "Why did you ignore my styling instructions? Write it again correctly."
*   *Write*: Close the session, clear the history, and start a fresh session with only the necessary style rules.

# USAGE
`Developer A`: "The model is starting to write code using variables that don't exist in our class definitions."
`Developer B`: "That's attention degradation. We have 50 turns of conversation history in our context window. Let's clear the session and start a new one, loading only the target class file. That will restore its focus instantly."

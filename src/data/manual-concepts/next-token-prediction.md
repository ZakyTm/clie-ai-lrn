---
id: next-token-prediction
title: Next-token Prediction
summary: The core autoregressive mechanism of generative models, calculating token probabilities and sampling one token at a time.
domains:
  - "Section 1 — The Model"
related:
  - model
  - token
  - inference
  - non-determinism
sources:
  - "https://arxiv.org/abs/2001.08361"
  - "https://en.wikipedia.org/wiki/Autoregressive_model"
---

Next-token prediction is the singular mode of operation for autoregressive language models. Given a sequence of input tokens, the model calculates a probability distribution across its entire vocabulary. A single next token is sampled from this distribution, appended to the prompt, and the entire sequence is fed back into the model to predict the next one.

This loop has critical structural consequences:
1.  **No Lookahead**: The model cannot plan sentences in advance. It commits to one token at a time. An unfortunate choice of an early token will permanently steer the rest of the generation.
2.  **Cumulative Error**: If a model makes a small logical slip early in its output, that slip becomes part of its context window, making subsequent mistakes more likely (error propagation).
3.  **Probabilistic, Not Logical**: The model generates tokens based on mathematical likelihood, not truth. This is the root cause of **hallucinations**.

### The Autoregressive Generation Loop
```
[Prompt Context] ──► Model Prefill ──► Output Probabilities ──► Sample Token
      ▲                                                              │
      └───────────────────── Append to Context ◄─────────────────────┘
```

# AVOID
Do not expect a model to output a complex plan or structure instantly. Instruct it to output its reasoning step-by-step (e.g. Chain of Thought) before outputting its final conclusion.
*   *Avoid*: "Analyze this file and immediately output the final JSON schema."
*   *Write*: "First write out your analysis of the types, list any conflicts, and then format the final output as a JSON block inside markdown."

# USAGE
`Developer A`: "Why did the agent write a whole file of buggy code after making a single typo in the first class definition?"
`Developer B`: "Because of next-token prediction. Once it outputted that typo, the typo became part of its read-only context. It had to predict tokens that were logically consistent with its own typo, leading the whole output astray."

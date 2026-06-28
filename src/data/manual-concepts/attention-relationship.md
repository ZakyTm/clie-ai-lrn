---
id: attention-relationship
title: Attention Relationship
summary: The mathematical connection computed between pairs of tokens inside the context window that represents how they influence and depend on each other.
domains:
  - "Section 5 — Parametric knowledge"
related:
  - attention-budget
  - token
  - context
  - next-token-prediction
sources:
  - "https://arxiv.org/abs/1706.03762"
  - "https://arxiv.org/abs/2307.03172"
---

An attention relationship is the computed connection between any two tokens in a prompt context. When a model processes your request, its attention heads calculate a score for how much every single token relates to every other token.

You trigger these calculations whenever the model:
*   Resolves a pronoun like "it" to a previously mentioned variable name.
*   Connects a function call on line 200 back to the interface definition on line 50.
*   Aligns your system constraints to a specific coding block.

---

## The Quadratic Scaling Reality

In a standard Transformer, attention relationships scale quadratically ($O(N^2)$) relative to prompt length. Every token must compute its relationship with *every other token* in the prompt:

*   **1,000 tokens** ──► **~1 million relationships**
*   **10,000 tokens** ──► **~100 million relationships**
*   **100,000 tokens** ──► **~10 billion relationships**

These calculations are run across dozens of separate **attention heads** simultaneously on the GPU.

Because the total pool of relationships grows so fast, the few relationships that actually matter (like your instruction matching the target code) get diluted by billions of noise pairings. This is the mathematical cause of **Attention Budget** exhaustion and **Attention Degradation**.

```
Tokens = 10x ──► Attention Relationships = 100x (Quadratic Bloat)
```

---

## Field Applications

### 1. AI Engineers (Improving Code Symbol Relationships)
AI engineers structure code files to make relationships obvious to the model, such as keeping functions small and grouping imports/types near their call sites:

*   *Code Architecture Tip*: Renaming overlapping or generic variables (e.g. changing generic `user` symbols to `dbUser` and `sessionUser`) prevents the model's attention heads from crossing relationship lines and creating bugs.

# AVOID
Do not dump unrelated code files or huge API specs into the prompt window. It forces the attention heads to calculate billions of useless relationship pairs, weakening the connections that matter for your task.
*   *Avoid*: Pasting your full server router file when you only need to modify a single API endpoint.
*   *Write*: Isolate the specific endpoint code, loading only the target route and its directly related interface definitions.

# USAGE
`Developer A`: "The agent keeps using variable structures from another file we loaded."
`Developer B`: "That file is so large it added millions of irrelevant attention relationship pairs, diluting the connections to our current code. Let's clear the old file from the context window to sharpen the model's focus."

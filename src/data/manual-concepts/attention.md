---
id: attention
title: Attention
summary: A neural network mechanism that allows a model to dynamically weigh the importance of different parts of the input when producing each output element, forming the core of the Transformer architecture.
domains:
  - "Section 1 — Fundamentals"
related:
  - context-window
  - next-token-prediction
  - training
  - attention-budget
  - attention-degradation
  - attention-relationship
sources:
  - "https://arxiv.org/abs/1706.03762"
  - "https://jalammar.github.io/illustrated-transformer/"
---

Attention is a learnable weighting mechanism that lets a model focus on relevant parts of the input sequence when generating each token. It is the fundamental building block of the Transformer architecture that powers modern LLMs.

You interact with attention when you:
*   Run any LLM inference — every layer uses attention.
*   Observe that a model correctly uses information from the beginning of a long prompt.
*   Hit context window limits — attention's memory usage grows quadratically with sequence length.

---

## How Attention Works

At a high level, attention computes a weighted sum of values, where the weights are determined by the compatibility between a query and a set of keys:

1. Each input token is projected into three vectors: **Query (Q)**, **Key (K)**, and **Value (V)**.
2. Attention scores are computed as the dot product of Q and K, scaled by the square root of the dimension.
3. A softmax converts these scores into probabilities.
4. The output is the weighted sum of the V vectors.

```
Attention(Q, K, V) = softmax(QK^T / √d_k) V
```

### Multi-Head Attention
Rather than computing a single attention score, Transformers run multiple attention "heads" in parallel, each learning to focus on different types of relationships (syntax, semantics, positional). The outputs are concatenated and projected.

### Self-Attention vs Cross-Attention
*   **Self-Attention**: Q, K, and V all come from the same sequence — captures relationships within the input.
*   **Cross-Attention**: Q comes from one sequence (e.g., decoder), K and V from another (e.g., encoder) — used for tasks like translation.

### Why It Matters
Before attention, recurrent models processed sequences one step at a time (O(n) runtime, but sequential). Attention processes all tokens in parallel (O(1) parallel steps) but requires O(n²) memory for the full attention matrix — which is what limits context windows.

# AVOID
Do not confuse the attention mechanism with the concept of "paying attention" in the psychological sense. The attention weights do not represent understanding or intent — they are learned statistical correlations.
*   *Avoid*: Interpreting attention weight visualizations as causal explanations of model behavior.
*   *Write*: Use attention interpretability techniques (attention rollout, attribution methods) that account for how information flows through layers.

# USAGE
`Engineer`: "Why does inference slow down so much with longer prompts?"
`Architect`: "It's the attention matrix — memory and compute grow as O(n²) with sequence length. Switch to a model using Flash Attention or grouped-query attention for long-context workloads."

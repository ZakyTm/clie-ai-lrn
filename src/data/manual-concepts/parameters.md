---
id: parameters
title: Parameters
summary: The internal floating-point weights and biases of a neural network, optimized during training, that define the model's behavior.
domains:
  - "Section 1 — The Model"
related:
  - model
  - training
  - inference
  - parametric-knowledge
sources:
  - "https://arxiv.org/abs/2005.14165"
  - "https://en.wikipedia.org/wiki/Parameter_(computer_programming)"
---

Parameters (also called weights and biases) are the billions of floating-point numbers stored inside a model. In a Transformer, they represent the strength of connections between attention heads and feed-forward layers. 

Everything a model "knows" globally is compiled directly into these numbers (known as **parametric knowledge**). 
*   **Frozen at Inference**: During standard API usage (inference), these parameters are read-only. 
*   **Stateless Execution**: Nothing you input, correct, or execute inside a chat session will update these parameters. The next API request starts with the exact same numbers.
*   **VRAM Impact**: The parameter count directly dictates the VRAM memory footprint required to host the model (e.g., a 7-billion parameter model stored in 16-bit precision requires ~14 GB of VRAM to load).

### Fine-Tuning vs. In-Context Learning
To update parameters, you must run a training loop (fine-tuning). To update behavior without changing parameters, you must load context.

```
Parameters (Weights)  ──► Changed via Fine-Tuning (Permanent, high latency, expensive)
Context Window (Input) ──► Changed via Prompting / RAG (Session-only, immediate, cheap)
```

# AVOID
Do not attempt to explain project-specific specifications to an agent in the hope that it will "remember" them in a new session. 
*   *Avoid*: "I explained the API change to the agent yesterday; why is it still using the old method today?"
*   *Write*: "The agent's parameters are frozen. We must inject the new API guidelines into the system prompt of every new session."

# USAGE
`Developer A`: "Can we get the model to memorize our codebase schema by fine-tuning its parameters?"
`Developer B`: "No, that's too slow and expensive. Let's keep its parameters frozen and use RAG to inject the relevant database schemas directly into its context window instead."

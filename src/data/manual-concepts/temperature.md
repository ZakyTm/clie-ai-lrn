---
id: temperature
title: Temperature
summary: A sampling parameter that controls the randomness of token selection during LLM generation, where lower values produce deterministic output and higher values produce more creative or varied results.
domains:
  - "Section 1 — Fundamentals"
related:
  - next-token-prediction
  - inference
  - non-determinism
  - output-tokens
sources:
  - "https://arxiv.org/abs/1909.05858"
  - "https://platform.openai.com/docs/guides/text-generation"
---

Temperature is a hyperparameter that scales the probability distribution over the vocabulary before sampling the next token. It controls the trade-off between predictability and creativity in the model's output.

You adjust temperature when you:
*   Set `temperature=0` for a code completion where exact correctness matters.
*   Set `temperature=0.8` for a creative writing task where variety is desired.
*   Tune it per-use-case in a production LLM application.

---

## How Temperature Works

After the model computes logits (raw scores) for every token in its vocabulary, a softmax function converts them into probabilities. Temperature modifies this softmax:

```
softmax(x_i) = exp(x_i / T) / Σ exp(x_j / T)
```

| T Value | Effect | Use Case |
|---------|--------|----------|
| 0 (argmax) | Always picks the highest-probability token | Code generation, factual lookup |
| 0.1 — 0.3 | Near-deterministic, slight variation | Classification, structured output |
| 0.5 — 0.7 | Balanced creativity | General chat, summarization |
| 0.8 — 1.0 | High variety, may diverge | Creative writing, brainstorming |
| > 1.0 | Near-uniform random | Rarely useful outside research |

A temperature of **0** collapses to greedy decoding (always pick the token with highest probability). As temperature increases, low-probability tokens become more likely to be selected, increasing output diversity but also the risk of incoherence.

### Related Parameters
*   **Top-p (nucleus sampling)**: Instead of scaling all tokens, sample only from the smallest set of tokens whose cumulative probability exceeds `p`. Often used together with temperature.
*   **Top-k**: Sample only from the `k` highest-probability tokens.

# AVOID
Do not treat temperature as the only source of randomness. The model's dropout, layer-level noise, and GPU nondeterminism also contribute.
*   *Avoid*: Expecting `temperature=0` to produce the exact same output across different model versions or hardware.
*   *Write*: Use `temperature=0` combined with `seed=N` for reproducible outputs in testing environments.

# USAGE
`QA Engineer`: "The model generates different variable names every time I run the same prompt."
`ML Engineer`: "Set temperature to 0 and fix the random seed. If you still want valid JSON output without variability, also pin the schema in the system prompt."

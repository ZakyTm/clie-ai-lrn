---
id: non-determinism
title: Non-determinism
summary: The operational characteristic where identical prompts output different token sequences due to temperature scaling, nucleus sampling, and floating-point math variations.
domains:
  - "Section 1 — The Model"
related:
  - model
  - next-token-prediction
  - inference
  - automated-check
sources:
  - "https://arxiv.org/abs/1904.09751"
  - "https://pytorch.org/docs/stable/notes/randomness.html"
---

Non-determinism means that repeating a request with the exact same inputs can yield different results. This is caused by two layers in the inference pipeline:

1.  **Sampling Parameters (Software)**: During generation, the model outputs log-odds (logits) for the vocabulary. If **Temperature** is set above `0`, or **Top-p** is less than `1.0`, the harness samples from these distributions probabilistically. A temperature of `0` makes the output highly deterministic by always selecting the most probable token.
2.  **Hardware Precision (Hardware)**: Even at temperature `0`, enterprise model serving batches multiple requests onto massive GPU clusters. Tiny floating-point rounding errors (e.g. `bfloat16` arithmetic variations) can accumulate across layers, occasionally tipping the probability distribution and changing a token choice, which alters all subsequent predictions.

### Calibration Parameters in Code
When building harnesses, adjust sampling parameters depending on your task goals:

```typescript
// For code generation, data extraction, and strict schemas (Deterministic)
const strictConfig = {
  temperature: 0.0,
  topP: 0.1
};

// For brainstorming, creative writing, and prompt diversification (Exploratory)
const creativeConfig = {
  temperature: 0.7,
  topP: 0.95
};
```

# AVOID
Do not assume a test suite that passes once guarantees agent stability.
*   *Avoid*: "I ran the agent locally and it completed the migration successfully. It is ready for production."
*   *Write*: "We must run our automated eval suite at least 20 times on this prompt config to check the pass-rate across the non-deterministic distribution."

# USAGE
`Developer A`: "We set our API temperature to 0.0, but the model still outputs a slightly different code structure every 10 runs. Why?"
`Developer B`: "That's hardware-level non-determinism. When the API provider runs our request across different GPUs in their cluster, float-rounding differences change the logits slightly. We need to write automated lint tests to enforce schema compliance rather than relying on prompt determinism."

---
id: training
title: Training
summary: The computational process of optimizing a model's parameters by exposing it to datasets and adjusting weights via backpropagation.
domains:
  - "Section 1 — The Model"
related:
  - parameters
  - model
  - inference
  - parametric-knowledge
sources:
  - "https://pytorch.org/tutorials/beginner/blitz/tensor_tutorial.html"
  - "https://arxiv.org/abs/2210.02414"
---

Training is the multi-stage, compute-heavy process that writes the model's parameters. It is done once by the model provider before release and splits into:
1.  **Pre-training**: Unsupervised exposure to trillions of tokens to learn grammar, code, and world facts (producing a base model).
2.  **Post-training (Instruction Tuning)**: Supervised Fine-Tuning (SFT) and Reinforcement Learning from Human Feedback (RLHF) to make the model helpful, conversational, and follow tools/prompts (producing an instruct model).

For app developers, training is out of reach for day-to-day modifications. If a model fails to use a custom library, the fix is prompting and context injection, not retraining.

### Training vs. Prompting Trade-offs
```
+------------------+-----------------------------+-----------------------------+
| Dimension        | Training (Fine-Tuning)      | Prompting (Context)         |
+------------------+-----------------------------+-----------------------------+
| Latency          | Static (no overhead)        | High (adds input tokens)     |
| Cost             | Expensive (GPU hours)       | Recurrent (inference bills) |
| Speed to Update  | Hours / Days                | Instant (millisecond edit)  |
| Accuracy         | High style, low facts       | High facts, variable style  |
+------------------+-----------------------------+-----------------------------+
```

# AVOID
Do not use "train" when you mean write guidelines or configure context.
*   *Avoid*: "We need to train the model to output JSON responses."
*   *Write*: "We need to update our system prompt with few-shot examples and set the response format parameter to JSON object."

# USAGE
`Developer A`: "Our model keeps hallucinating our custom API parameters. Should we start a fine-tuning training run?"
`Developer B`: "No, training is bad at memorizing exact facts. Let's load the OpenAPI specifications directly into the context window at inference time."

---
id: chain-of-thought
title: Chain-of-Thought
descriptionAr: "سلسلة الأفكار (CoT) هي تقنية في هندسة المحفزات تدفع النموذج إلى تفكيك المسألة المعقدة إلى خطوات متوسطة قبل إعطاء الإجابة النهائية. بدلاً من الإخراج المباشر، يُنتج النموذج سلسلة استدلال منطقي تشبه طريقة حل المشكلات عند الإنسان، مما يزيد دقة الإجابات خاصة في المسائل الحسابية والمنطقية."
summary: A prompt engineering technique that instructs an LLM to break down a complex problem into intermediate reasoning steps before producing the final answer, improving accuracy on multi-step tasks.
domains:
  - "Section 1 — Fundamentals"
related:
  - next-token-prediction
  - inference
  - model
  - attention-budget
sources:
  - "https://arxiv.org/abs/2201.11903"
  - "https://www.promptingguide.ai/techniques/chain-of-thought"
---

Chain-of-Thought (CoT) prompting is a technique where the model is asked to produce a series of intermediate reasoning steps before arriving at a final answer. Rather than jumping directly from question to answer, the model "shows its work" by decomposing the problem into logical sub-steps.

You use chain-of-thought when you:
*   Prompt a model with "Let's think step by step" before asking it to solve a math problem.
*   Ask an AI coding agent to outline its implementation plan before writing code.
*   Request a multi-step analysis where each reasoning stage depends on the previous one.

---

## How It Works

Standard language models predict the next token based on the preceding context. Chain-of-thought exploits this sequential nature by forcing the model to emit intermediate tokens that represent reasoning steps, which then become context for the final answer.

```
Without CoT:
  Q: "If a store sells apples at $2 each and oranges at $3 each,
      what is the total cost of 5 apples and 3 oranges?"
  A: "$19" ← might guess due to shallow pattern matching

With CoT:
  Q: "If a store sells apples at $2 each and oranges at $3 each,
      what is the total cost of 5 apples and 3 oranges?
      Let's think step by step."
  A: "Step 1: 5 apples × $2 = $10
      Step 2: 3 oranges × $3 = $9
      Step 3: $10 + $9 = $19"
```

### Variants
*   **Zero-shot CoT**: Simply appending "Let's think step by step" to the prompt — no examples needed.
*   **Few-shot CoT**: Providing 2-3 worked examples in the prompt that demonstrate the reasoning pattern.
*   **Self-Consistency CoT**: Running CoT multiple times and taking the majority answer to reduce variance.
*   **Chain-of-Thought with Tool Use**: Each reasoning step calls a tool (calculator, search) before proceeding.

# AVOID
Do not treat chain-of-thought as guaranteed factual reasoning. The model can produce plausible-sounding intermediate steps that lead to wrong conclusions (hallucinated reasoning chains).
*   *Avoid*: Trusting CoT output for safety-critical decisions without independent verification of each step.
*   *Write*: Use CoT as a reasoning scaffold but always verify critical arithmetic or logic with external tools.

# USAGE
`Dev`: "The model keeps failing at multi-hop retrieval questions."
`Tech Lead`: "Add a 'Let's think step by step' prefix to decompose the question into sub-queries. For math-heavy tasks, pipe each step through a calculator tool for verification."

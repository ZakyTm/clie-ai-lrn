---
id: inference
title: Inference
summary: The execution phase where a trained model processes input tokens to generate output tokens.
domains:
  - "Section 1 — The Model"
related:
  - model
  - parameters
  - training
  - token
sources:
  - "https://docs.nvidia.com/deeplearning/tensorrt/developer-guide/index.html"
  - "https://en.wikipedia.org/wiki/Inference"
---

Inference is the read-only phase of a model's life. Every time you ask a question or an agent requests a tool call, the client sends your prompt to a server (or local runner) which executes the parameters over the input tokens to generate the response.

Unlike training, which is a one-time capital expense, inference creates a recurring operational cost. Model providers charge per-token, separating input tokens (cheaper) and output tokens (more expensive because they must be computed sequentially).

### Optimizing Inference Latency & Cost
*   **Time to First Token (TTFT)**: The duration it takes to process the input prompt (prefill phase). This scales with input size, but can be optimized using **Prompt Caching**.
*   **Inter-Token Latency (ITL)**: The duration between output tokens (generation phase). This is bound by GPU memory bandwidth since the model must read all parameters from VRAM for *every single token* generated.
*   **Pruning**: Keeping prompts short directly reduces both TTFT and total inference costs.

# AVOID
Do not assume that executing multiple identical prompts simultaneously will share generation costs. 
*   *Avoid*: "Let's run 5 parallel agents with the same 100K token documentation block to speed up work."
*   *Write*: "We should verify if our provider supports prefix/prompt caching. Otherwise, running those 5 agents in parallel will cost 5x inference charges on the input prefill."

# USAGE
`Developer A`: "Our agent is taking 10 seconds to respond. Is it training?"
`Developer B`: "No, it's running inference. The latency is high because the context window is stuffed with 50K tokens of old git logs, making the prefill phase slow."

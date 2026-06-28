---
id: model
title: Model
summary: The compiled, frozen parameters that calculate next-token probability distributions. A model is completely stateless and pure.
domains:
  - "Section 1 — The Model"
related:
  - parameters
  - harness
  - inference
  - stateless
sources:
  - "https://arxiv.org/abs/1706.03762"
  - "https://karpathy.ai/"
---

A model is a mathematical file containing billions of floating-point weights (parameters). It acts as a stateless, pure function: it accepts a sequence of input tokens and returns a probability distribution for the next token. 

Day-to-day developers often conflate the **model** with the **harness** (the application code surrounding it). Mechanically, a model has no agency:
*   It cannot read your workspace files.
*   It cannot execute console commands.
*   It cannot remember prior requests or yesterday's conversation.
*   It has no internal timer or clock.

All apparent "agentic" capabilities are orchestrations run by the harness, which calls the model in a loop, parses its output strings, and feeds tool results back as fresh input tokens.

### Configuration in code
When setting up APIs, always select the model tier based on the task requirement (heavy planning vs fast execution):

```typescript
// Configured in a Node.js harness
const plannerModel = "claude-3-5-sonnet"; // Large parameter count, high reasoning
const parserModel = "claude-3-5-haiku";   // Smaller parameter count, low latency
```

# AVOID
Do not blame the model for failures in state preservation or loop execution. That is a harness responsibility.
*   *Avoid*: "The model forgot my previous file modifications."
*   *Write*: "The harness failed to append the file changes back into the context window for the next turn."

# USAGE
`Developer A`: "Why is this model not executing my git commit command?"
`Developer B`: "Because the model is just a stateless parameters file. You need to verify if the client harness parsed the tool call correctly and ran the child shell process on your terminal."

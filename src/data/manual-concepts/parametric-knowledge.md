---
id: parametric-knowledge
title: Parametric Knowledge
summary: The frozen world facts and coding capability compiled directly into the model's parameters during training, which cannot be modified during inference.
domains:
  - "Section 5 — Parametric knowledge"
related:
  - parameters
  - training
  - knowledge-cutoff
  - contextual-knowledge
sources:
  - "https://arxiv.org/abs/2005.14165"
  - "https://en.wikipedia.org/wiki/Parameter_(computer_programming)"
---

Parametric knowledge is the global "brain database" of a model, stored directly inside its frozen numerical parameters (weights) during training. It represents the model's global memory of grammar, programming languages, history, and standard coding practices.

You leverage parametric knowledge whenever you:
*   Ask Claude to write a standard binary search algorithm in Python.
*   Query ChatGPT about historical events or general physics principles.
*   Request translations of text from one language to another.

---

## Technical Details: The Blur of Squeezed Facts

Because a model must compress the entire internet into a fixed file (e.g. squeezing trillions of tokens of training data into a 70-billion floating-point parameters file), detail is inevitably lost.
*   **The Rare Fact Blur**: Common facts (like React syntax) are represented heavily in the parameters and reproduced flawlessly. Rare facts (like a private library API or a niche framework endpoint) blur. When the model tries to recall a blurred fact, it guesses based on similar shapes, resulting in **Hallucinations**.
*   **Frozen State**: Parametric knowledge is read-only at runtime (inference). You cannot update it or teach it a new fact during a chat.
*   **Cutoff Limitation**: It stops at the model's **Knowledge Cutoff** date.

```
Trillions of Internet Tokens ──► Squeezed into Frozen Parameters ──► Rare Facts Blur (Hallucinations)
```

---

## Overriding Parametric Memory in Prompts

To prevent a model from guessing based on its parametric memory, developers inject precise files into the context window, forcing the model to read rather than guess:

*   *Prompt Example (Overriding Stale Memory)*:
    ```markdown
    You are writing code for our project. Do NOT use the default parametric knowledge for our SDK version v2. 
    Instead, read the current v3 type definitions in the `<types>` block below to write your answer.
    
    <types>
    ${currentTypesCode}
    </types>
    ```

# AVOID
Do not expect a model to write code for your company's private APIs or internal SDKs using only its parametric memory. It will guess and write plausible-looking bugs.
*   *Avoid*: "Write a script using our company's `user-auth` library to log in a developer."
*   *Write*: "Read our `user-auth` source definitions, and use them to write a login script."

# USAGE
`Developer A`: "The model writes beautiful React code, but it keeps inventing function names for our internal project modules."
`Developer B`: "React is dense in its parametric knowledge because of millions of public examples. Our internal modules are completely missing. We need to load our modules as contextual knowledge in the prompt so it reads them instead of guessing."

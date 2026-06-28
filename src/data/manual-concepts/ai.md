---
id: ai
title: Artificial Intelligence (AI)
summary: A general term describing computer systems that perform tasks historically requiring human intelligence — like writing code, reasoning through bugs, or understanding natural language.
domains:
  - "Section 1 — The Model"
related:
  - model
  - harness
  - agent
  - token
sources:
  - "https://en.wikipedia.org/wiki/AI_effect"
  - "https://web.stanford.edu/~jmc/whatisai.html"
---

Artificial Intelligence (AI) is a broad, non-technical category for systems that can replicate human-like cognitive functions. In modern software development, you see it daily in tools like:
*   **GitHub Copilot** predicting your next lines of code as you type.
*   **Claude** generating full-stack React components from a single prompt.
*   **ChatGPT** analyzing terminal stack traces to debug runtime crashes.

Historically, "AI" is a moving target. In a phenomenon called the **AI Effect**, once a technical task is solved and standardized, it stops being called "AI" and gets renamed to its mechanical parts. For example, optical character recognition (OCR) and spelling checkers were once hailed as "artificial intelligence," but are now referred to as standard library utilities.

---

## The Technical Underpinnings

Behind the marketing, "AI" in modern software does not mean a thinking, conscious entity. Under the hood, it is constructed of precise, stateless components:

1.  **The Model**: The massive neural network containing frozen numerical **Parameters** (weights) that performs calculations.
2.  **Next-Token Prediction**: The mathematical process where the model estimates the probability of the next sub-word fragment (**Token**), samples it, appends it, and loops.
3.  **The Harness**: The surrounding application code (e.g. VS Code extensions, Python scripts) that manages API requests, stores conversational state, and triggers actions.

---

## Field Applications & How We Use It

Different developer roles interact with and manipulate "AI" using distinct patterns:

### 1. Vibe Coders (AI-Assisted Prototyping)
Developers who use natural language instructions to drive code generation. They write prompts that describe user interfaces or systems in high-level English, utilizing LLMs to quickly spit out operational boilperplate.

*   *Prompt Example*: "Create a clean, responsive Astro component for a terminal search console. Style it with custom CSS variables for automatic light/dark mode and include a simulated typing animation on load."

### 2. Fullstack Developers (System Integration)
Engineers who connect LLM APIs to traditional web backends. They focus on prompt reliability and structuring outputs into structured formats like JSON.

*   *Integration Example*: Using structured JSON schemas to ensure the model responds with parsed objects:
    ```json
    {
      "ticket_id": "BUG-101",
      "severity": "high",
      "assigned_team": "devops"
    }
    ```

### 3. AI Engineers (Agent Engineering)
Developers who build automated, looping loops where models call tools (APIs, databases) and execute code in secure sandboxes. They handle token budgets and model routing.

*   *Orchestration Example*: Designing a Python loop that feeds the output of a compiler error back to the model as input tokens, letting it self-correct in a loop until the tests pass.

# AVOID
Do not refer to the generic word "AI" when diagnosing technical issues. It conceals the root cause.
*   *Avoid*: "The AI outputted a broken SQL query."
*   *Write*: "The database schema was not loaded into the context window, causing the model to predict table columns that do not exist."

# USAGE
`Developer A`: "We need to integrate some AI into our dashboard to summarize client reports."
`Developer B`: "Got it. Let's design a Node.js harness that grabs the client's report database rows, tokenizes them, caches the system prompt to save on inference costs, and renders the output summaries in a clean Newsreader serif layout."

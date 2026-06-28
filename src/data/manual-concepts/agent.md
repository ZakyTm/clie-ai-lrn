---
id: agent
title: Agent
summary: An autonomous software system that embeds an LLM within a stateful execution loop, enabling it to call tools, interact with files, and iteratively accomplish complex goals.
domains:
  - "Section 2 — Model provider request"
related:
  - model
  - harness
  - subagent
  - agents
sources:
  - "https://lilianweng.github.io/posts/2023-06-23-agent/"
  - "https://github.com/langchain-ai/langgraph"
---

An agent is a software entity that uses a language model as its central reasoning engine. Unlike a simple text generator, an agent has **agency**: it can evaluate a goal, inspect its **Environment**, choose which **Tools** to execute, read the results, and adjust its plan dynamically until the task is complete.

You interact with an agent when you:
*   Use Claude Code to run automated repository refactoring.
*   Setup an auto-GPT bot that browses the web to aggregate research.
*   Deploy background loops to automatically audit incoming pull requests.

---

## Agent Architecture

An agent is not a single model file. It is a system composed of:
1.  **The Brain (Model)**: Exposes reasoning and generates action intents.
2.  **The Body (Harness)**: Executes the actual actions, sanitizes inputs, and feeds back logs.
3.  **The Senses (Tools)**: Connections to filesystems, compilers, and APIs.
4.  **Memory**: Active **Context** (short-term) and databases/files (long-term).

```
+-----------------------------------------------------+
|                  AGENT SYSTEM                       |
|                                                     |
|           [ Brain (LLM) ] ◄──► [ Memory ]           |
|                 │                                   |
|                 ▼ (Decides Tool Call)               |
|      [ Body (Harness) ] ──► [ Senses (Tools) ]      |
+-----------------------------------------------------+
```

# AVOID
Do not treat an agent as a human programmer who possesses global intuition. If the agent makes a mistake, it cannot correct it unless the tool results feed back the compiler errors.
*   *Avoid*: Letting an agent run without automated test commands mounted, expecting it to know if its code compiled.
*   *Write*: Always provide validation tools (linters, test suites) so the agent can self-correct when checking outputs.

# USAGE
`Developer A`: "Our agent wrote the code but didn't verify if it runs."
`Developer B`: "That's because we didn't give the agent a shell tool. It has no way to run the tests. Let's add a test runner tool to its environment so it can execute checks autonomously."

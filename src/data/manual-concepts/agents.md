---
id: agents
title: Agent Engineering
domains: ["agents"]
difficulty: advanced
summary: An architectural design pattern where an LLM is embedded within an active execution loop, enabling it to break down complex goals, invoke tools, inspect outputs, and iteratively take actions.
tags: ["agents", "tool-use", "autonomous-loops"]
sourceRepo: manual
featured: true
related: ["mcp-tooling", "prompt-engineering"]
resources:
  - id: agents-weng
    type: article
    title: "LLM Powered Autonomous Agents"
    url: "https://lilianweng.github.io/posts/2023-06-23-agent/"
    description: "Lilian Weng's seminal blog post on the components and architecture of AI agents."
    sourceRepo: manual
    tags: ["foundational", "reference"]
  - id: agents-langgraph
    type: tool
    title: "LangGraph"
    url: "https://github.com/langchain-ai/langgraph"
    description: "A library for building stateful, multi-actor applications with LLMs, ideal for agent loops."
    sourceRepo: manual
    tags: ["framework", "code"]
---

# NAME
`agents` — LLM Execution Loops

# SYNOPSIS
```
+-----------------------------------------------------------+
|                          AGENT LOOP                       |
|                                                           |
|             +---------> [ 1. PLAN / REASON ]              |
|             |                  |                          |
|             |                  v                          |
|    [ 4. OBSERVE ]      [ 2. ACT / CALL TOOL ]             |
|             ^                  |                          |
|             |                  v                          |
|             +------- [ 3. EXECUTE ENVIRONMENT ]           |
|                                                           |
+-----------------------------------------------------------+
```

# DESCRIPTION
An **AI Agent** is not a single, mystical neural network that thinks. In production, an agent is a **software loop** (typically a `while` loop) containing a language model that decides which tools to execute based on a user's instruction, runs those tools, examines the results, and decides whether to continue or finish.

While a simple LLM query is a one-shot, static operation, an agent has **agency**: it can interact with the external world (the file system, APIs, browsers) and adapt its plan as it receives new inputs.

## Core Components
A complete agent architecture typically consists of:
1. **Planning**:
   - **Deconstruction**: Breaking a large goal down into manageable sub-tasks.
   - **Reflection & Self-Correction**: Analyzing past actions, finding mistakes, and adjusting plans dynamically.
2. **Memory**:
   - **Short-term memory**: The context window containing the prompt history of the current session.
   - **Long-term memory**: External vector databases or structured files where details are saved and retrieved across sessions.
3. **Tools**:
   - External capabilities that the LLM can invoke (e.g., calculators, code execution environments, web search engines, git access).

## The Engineering Challenge
The biggest hurdle in agent engineering is **reliability**. Because LLMs are probabilistic, agent loops can get stuck in infinite execution cycles, hallucinate tool calls, or drift off-course. Designing solid agents requires setting strict maximum turn limits, implementing structured parser outputs (like JSON or Tool Call schemas), and building robust error-handling pipelines.

# SEE ALSO
`mcp-tooling`, `prompt-engineering`, `non-determinism`

---
id: subagent
title: Subagent
summary: A secondary agent spawned by a parent agent to execute a specific sub-task in a separate, isolated context window, returning a brief summary result.
domains:
  - "Section 9 — Skills and Subagents"
related:
  - agents
  - tool-call
  - tool-result
  - handoff
sources:
  - "https://arxiv.org/abs/2306.02241"
  - "https://github.com/langchain-ai/langgraph"
---

A subagent is a secondary agent spawned by a parent agent via a tool call. It runs in its own separate conversation session and context window, returning a summary report back to the parent as a tool result when finished.

You leverage subagents whenever you:
*   Use an agent that spawns background runners to search multiple files.
*   Distribute code generation tasks across parallel model queries.
*   Isolate heavy, noisy command lines (like grep searches or compiler outputs) from your main chat window.

---

## Why Subagents Exist: Context Isolation

If a parent agent attempts to search a large directory for a variable, the search tool can output hundreds of lines of code. If these logs are loaded directly into the parent's context window, they consume the **Attention Budget** and cause **Attention Degradation**.

Subagents solve this using **Context Isolation**:
1.  **Spawn (Tool Call)**: The parent triggers a tool call to spawn a subagent: `{"tool": "spawn_subagent", "prompt": "Search the repo for CSS references"}`.
2.  **Isolate**: The subagent runs the search inside its own clean context window, filtering out the noise.
3.  **Report**: The subagent compiles a concise summary of the results (a **Secondary Source**) and returns it to the parent.
4.  **Garbage Collection**: The subagent's bloated context window is discarded, keeping the parent's context clean and focused.

```
Parent Agent ──► Spawns Subagent (Separate Context) ──► Noisy Searches (Grep)
                     ▲                                      │
                     └───────── Reports Summary ◄───────────┘ (Noise discarded)
```

---

## Field Limitations

To prevent infinite loops and runaway billing cycles, subagent trees are typically constrained to **one level deep**: a parent can spawn subagents, but subagents cannot spawn further subagents. Additionally, subagents run concurrently, enabling the parent to fan out tasks across independent modules.

# AVOID
Do not use subagents to build complex, deeply nested organizational hierarchies. Deep nesting increases communication overhead, latency, and token bills.
*   *Avoid*: Exposing subagent tools that allow subagents to spawn further subagents in a loop.
*   *Write*: Keep the subagent structure flat, using them strictly for isolated, short-duration helper tasks.

# USAGE
`Developer A`: "The search results from our codebase query just consumed half of our agent's context window."
`Developer B`: "We should run the query using a subagent. The subagent will sift through the raw codebase matches in a temporary window, and return only the relevant file paths to our parent agent, keeping our main context clean."

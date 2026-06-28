---
title: Plugins
summary: A packaged bundle of tool schemas, prompts, rules, and runtime configurations that extends an AI agent's capability for a specific domain.
domains:
  - Section 3 — Agent Tooling
related:
  - mcp-tooling
  - skill
  - agent
---
In LLM systems, a **plugin** is a modular package that bundles multiple extension capabilities together so an agent can immediately execute domain-specific tasks. Rather than writing custom API integration code for every new utility, a developer installs a plugin to load tools, rules, and prompt instructions at runtime.

### Jargon Decoder: MCP vs. Skill vs. Agent vs. Plugin

AI engineering has several overlapping terms. Here is how they break down in practice:

1.  **MCP (Model Context Protocol)**:
    *   *What it is*: A transport standard protocol (JSON-RPC over stdin/stdout or SSE).
    *   *Role*: It is the hardware connector or "USB cable" between the client (IDE/Agent) and the server (database/API).
2.  **Skill**:
    *   *What it is*: A specific behavioral set of instructions (markdown guidelines or helper scripts).
    *   *Role*: It represents the "recipes" or "capabilities" the agent learns to complete a specific task (e.g. running a genomic variant search).
3.  **Agent**:
    *   *What it is*: The autonomous loop orchestrator.
    *   *Role*: The "brain" that accepts prompts, plans actions, decides which tool to call, and processes tool outputs statefully.
4.  **Plugin**:
    *   *What it is*: A packaged bundle of all the above.
    *   *Role*: The delivery container. A single plugin can bundle multiple **skills**, install executable **tool schemas** (which communicate via **MCP**), and configure **subagent** prompt definitions for a specific ecosystem.

---

### Technical Architecture Comparison

Consider an AI development workspace where we load a code-quality assistant:

*   **The Client (Agent)**: The master LLM loop managing file writes.
*   **The Plugin (chrome-devtools-plugin)**: The installer bundle containing devtools integrations.
*   **The MCP Server (chrome-devtools-mcp)**: The server interface exposing the page navigation and screenshot tools.
*   **The Skill (alphafold-fetch)**: The specialized markdown rulebook directing the agent on how to interpret protein coordinate files.

```text
  ┌────────────────────────────────────────────────────────┐
  │                   PLUGIN BUNDLE                        │
  │  ┌──────────────┐  ┌─────────────────┐  ┌───────────┐  │
  │  │  Skills /    │  │   MCP Server    │  │ Subagent  │  │
  │  │  Instructions│  │   (Tool Schemas)│  │ Prompt    │  │
  │  └──────────────┘  └────────┬────────┘  └───────────┘  │
  └─────────────────────────────┼──────────────────────────┘
                                │ (JSON-RPC Protocol)
                                ▼
                       [ AGENT RUNTIME ]
```

---

### Configuration in Code
When loading plugins into an agent frame, developers register them at startup so their endpoints are exposed to the reasoning loop:

`typescript
import { Agent } from 'antigravity-sdk';
import { ChromeDevToolsPlugin } from 'chrome-devtools-plugin';

const agent = new Agent({
  model: 'claude-3-5-sonnet',
  plugins: [
    new ChromeDevToolsPlugin({ headless: true }) // Automatically mounts MCP tools & skills
  ]
});
`

# AVOID
Do not build custom, hardcoded API clients directly inside your agent loops. Use standard plugins and MCP wrappers so they can be reused across different agent projects.
  • *Avoid*: "Let's write a custom slack client inside our agent's system prompt loop."
  • *Write*: "Let's load the standard slack MCP plugin so the agent can use generic tool calls to send messages."

# USAGE
Developer A: "I need my coding assistant to read my Notion database. Should I write a custom integration script?"
Developer B: "No, just install the Notion MCP plugin. It registers all Notion API search and retrieve endpoints as tool definitions, letting the agent call them dynamically."

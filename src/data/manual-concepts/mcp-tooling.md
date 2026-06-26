---
id: mcp-tooling
title: Model Context Protocol (MCP)
domains: ["mcp-tooling"]
difficulty: intermediate
summary: An open standard protocol designed to connect AI applications to data sources, local files, and external developer tools using a client-server architecture.
tags: ["mcp", "protocol", "tool-integration"]
sourceRepo: manual
featured: true
related: ["agents"]
resources:
  - id: mcp-official-site
    type: doc
    title: "Model Context Protocol Official Documentation"
    url: "https://modelcontextprotocol.io"
    description: "The official specifications, guides, and SDK reference for MCP created by Anthropic."
    sourceRepo: manual
    tags: ["official", "documentation"]
  - id: mcp-github-org
    type: github
    title: "MCP Git Repository"
    url: "https://github.com/modelcontextprotocol"
    description: "Source code of MCP SDKs (TypeScript, Python, Go) and reference servers."
    sourceRepo: manual
    tags: ["open-source", "code"]
---

# NAME
`MCP` — Model Context Protocol

# SYNOPSIS
```
+------------------+                   +------------------+
|                  |   MCP Protocol    |                  |
|    MCP Client    | <===============> |    MCP Server    |
| (e.g. Claude)    |   (JSON-RPC)      | (e.g. Postgres)  |
|                  |                   |                  |
+--------+---------+                   +--------+---------+
         |                                      |
         v                                      v
   Reads Prompt                            Fetches data /
   & returns to LLM                        Runs operations
```

# DESCRIPTION
The **Model Context Protocol (MCP)** is an open standard that enables developers to build secure, bidirectional connections between AI models and data sources or tools. Just as the Language Server Protocol (LSP) standardized how IDEs communicate with compiler syntax engines, MCP standardizes how AI applications connect to data sources, filesystems, and APIs.

## Core Architecture
MCP operates on a simple Client-Server model:
- **MCP Clients**: AI platforms, applications, or IDEs (like Claude Desktop, Antigravity, or custom agent setups) that want to consume tools or data.
- **MCP Servers**: Light weight helper processes that expose:
  1. **Resources**: Read-only text or binary data (e.g., database tables, local file contents, API docs).
  2. **Prompts**: Reusable prompt templates with placeholders for context.
  3. **Tools**: Executable functions that can perform side effects (e.g., editing files, running bash commands, fetching a web page).

## The Security Advantage
Before MCP, every developer wrote custom API glue code to let their AI agents call tools. These integrations were fragile and raised security risks. MCP standardizes the communication over local standard I/O (stdin/stdout) or Server-Sent Events (SSE). It allows clear scoping of permissions, sandboxing of tools, and standard log aggregation.

# SEE ALSO
`agents`, `sandbox`, `tool-call`, `tool-result`

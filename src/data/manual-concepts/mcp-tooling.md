---
id: mcp-tooling
title: Model Context Protocol (MCP)
domains:
  - "mcp-tooling"
difficulty: intermediate
summary: An open standard protocol that connects AI clients (like IDEs or chat interfaces) to external tools, databases, and data resources using a uniform client-server API structure.
tags:
  - "mcp"
  - "protocol"
  - "tool-integration"
sourceRepo: manual
featured: true
related:
  - agents
sources:
  - "https://modelcontextprotocol.io"
  - "https://github.com/modelcontextprotocol"
---

Model Context Protocol (MCP) is an open standard protocol — similar to a USB port for AI models — that enables AI clients (like IDEs or chat platforms) to safely connect to external files, databases, and APIs using a uniform, standardized client-server interface.

You use it when:
*   Connecting Claude Desktop to a local Postgres database to run queries and analyze schemas directly.
*   Integrating an IDE agent (like Antigravity) with standard GitHub tool interfaces to read issues, pull down pull requests, and commit code.
*   Linking your terminal chat tool to a web search server to fetch current news.

---

## How It Works (The Client-Server Architecture)

Before MCP, developers wrote custom API glue code to let their AI agents call tools. This was fragile and raised security risks. MCP standardizes this communication using a simple Client-Server model over standard JSON-RPC 2.0:

*   **MCP Client (e.g. Claude Desktop, IDE)**: The consumer application that hosts the LLM. It manages user requests, requests tools/resources, and aggregates outputs.
*   **MCP Server (e.g. Postgres Server, Filesystem Server)**: Lightweight background processes that connect to specific tools and databases. They expose:
    1.  **Resources**: Read-only text or binary data (e.g. local file content, database schemas).
    2.  **Tools**: Executable functions that can perform side effects (e.g. editing a file, sending an API request, compiling a project).
    3.  **Prompts**: Predefined prompt templates with placeholders for user context.

```
[ MCP Client (e.g. Claude Desktop) ] ──► JSON-RPC over stdin/stdout ──► [ MCP Server ] ──► Exposes Tools / Reads Databases
```

---

## Field Applications & Implementation

### 1. Vibe Coders (Configuring Servers)
Vibe coders configure MCP servers by adding their startup scripts into their local Claude Desktop JSON settings:

*   *Config Example (`claude_desktop_config.json`)*:
    ```json
    {
      "mcpServers": {
        "sqlite-database": {
          "command": "uvx",
          "args": ["mcp-server-sqlite", "--db-path", "~/my-data.db"]
        }
      }
    }
    ```

### 2. Fullstack & AI Engineers (Node.js Server Boilerplate)
Engineers write custom MCP servers in TypeScript or Node.js to expose internal database functions or tools directly to the agent:

*   *Code Example*:
    ```javascript
    import { Server } from "@modelcontextprotocol/sdk/server/index.js";
    import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
    
    // Initialize a new MCP Server
    const server = new Server({
      name: "custom-db-query-server",
      version: "1.0.0"
    }, {
      capabilities: { resources: {}, tools: {} }
    });
    
    // Expose a tool to the Client
    server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [{
        name: "query_database",
        description: "Executes a SQL query on our Postgres database.",
        inputSchema: { type: "object", properties: { query: { type: "string" } } }
      }]
    }));
    
    // Connect the transport channel
    const transport = new StdioServerTransport();
    await server.connect(transport);
    ```

# AVOID
Do not expose raw system shells or unconstrained write commands via MCP tools to remote AI clients. It can result in destructive file deletions or shell command injections.
*   *Avoid*: Exposing an MCP server that executes unvalidated shell strings directly on the host machine.
*   *Write*: Restrict tools to specific, validated inputs (e.g., a file writer tool that only accepts predefined extensions and sanitizes paths).

# USAGE
`Developer A`: "How do we let the IDE agent read our local MongoDB tables?"
`Developer B`: "We don't need to write custom database fetching scripts. Let's install the standard MongoDB MCP Server and configure it in our IDE settings. The agent will discover the collections, read schemas as resources, and query documents automatically."

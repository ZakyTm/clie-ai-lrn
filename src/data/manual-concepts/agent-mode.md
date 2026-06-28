---
id: agent-mode
title: Agent Mode
summary: The runtime configuration (e.g. architect, builder, interpreter) that sets the model's role instructions and restricts the tools it can access.
domains:
  - "Section 4 — Sandbox"
related:
  - permission-mode
  - agents
  - environment
sources:
  - "https://modelcontextprotocol.io"
  - "https://docs.anthropic.com/en/docs/build-with-claude/tool-use"
---

Agent mode is the configuration setting that dictates the role, permissions, and tool access scope of an agent for a specific session. Instead of running a single general-purpose prompt, developers change the agent mode depending on the phase of the development lifecycle.

You interact with agent modes when:
*   Switching your IDE assistant from "chat mode" to "refactor mode."
*   Configuring an agent to act as a read-only code reviewer instead of a writer.
*   Enabling a data-science agent to execute local scripts in a sandboxed interpreter.

---

## Standard Agent Modes

AI agent systems group instructions and tool accessibility into distinct modes:

1.  **Architect Mode**:
    *   *System Prompt*: "Focus on planning, design, and structural feedback. Do not edit files or write code."
    *   *Tools*: Read-only (view files, list directories, search web).
2.  **Builder Mode**:
    *   *System Prompt*: "Implement the approved designs. Edit code, create files, and compile projects."
    *   *Tools*: Full-write access (replace content, create file, run build commands).
3.  **Code-Interpreter Mode**:
    *   *System Prompt*: "Analyze datasets. Write Python code and execute it inside the sandbox."
    *   *Tools*: Sandbox execution (run script, print data logs).

---

## Field Applications

### 1. Fullstack Developers (Routing Tool Calls by Mode)
Developers write routing logic to disable or enable tool schemas in the model request based on the selected mode:

*   *Code Example*:
    ```javascript
    function getToolsForMode(agentMode) {
      const readTools = ["view_file", "list_dir"];
      const writeTools = ["write_to_file", "replace_file_content"];
      const executeTools = ["run_command"];
      
      switch (agentMode) {
        case "architect":
          return readTools; // Read-only
        case "builder":
          return [...readTools, ...writeTools, ...executeTools]; // Full access
        case "interpreter":
          return ["execute_python_script"]; // Isolate to Python execution
        default:
          return readTools;
      }
    }
    ```

# AVOID
Do not let your agent run in full "builder" mode when you only want it to answer a structural design question. Giving write access unnecessarily increases security risks and token overhead.
*   *Avoid*: Launching the agent with full filesystem write tools mounted when you are just querying it for general code suggestions.
*   *Write*: Use architect/read-only mode for query-focused tasks to maintain security boundaries.

# USAGE
`Developer A`: "The agent keeps rewriting my configuration files when I ask it how a library works."
`Developer B`: "You have the agent mode set to 'builder'. Switch it to 'architect' mode. That updates its system instructions to focus on planning and strips its file writer tools, so it can only explain concepts without modifying files."

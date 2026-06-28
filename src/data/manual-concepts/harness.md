---
id: harness
title: Harness
summary: The client-side application code that drives the model, parses tool calls, maintains conversation logs, and executes command operations on the local machine.
domains:
  - "Section 2 — Model provider request"
related:
  - model
  - agents
  - tool-call
  - stateful
sources:
  - "https://en.wikipedia.org/wiki/Harness_(programming)"
  - "https://modelcontextprotocol.io"
---

A harness (also called client harness or agent harness) is the application wrapper that coordinates the AI model. Because the model is a frozen, stateless parameters file, the harness must do the active work: managing user inputs, packaging them into **Context**, calling the API, intercepting **Tool Calls**, and executing the actual terminal functions or database scripts.

You build or interact with a harness whenever you:
*   Use Claude Code or GitHub Copilot in your terminal.
*   Initialize an OpenAI client package in a server script.
*   Configure the permissions and active directories for a workspace assistant.

---

## Harness Responsibilities

In an agent workflow, the harness acts as the "operating system" for the model, executing key background tasks:

1.  **Request Serialization**: Rebuilds the conversation log array and formats it as a **Model Provider Request**.
2.  **Tool call Execution**: Intercepts the model's intent payload (e.g. `{"tool": "read_file"}`), checks the **Permission Mode**, runs the file system operation locally, and sends back the **Tool Result**.
3.  **Error Handling**: If a command throws an exception, the harness catches the stack trace and feeds it back as context, allowing the model to self-correct.
4.  **Token Counting**: Evaluates prompt lengths to trigger **Compaction** before the context window overflows.

```
User Input ──► [ Stateful Harness ] ──► Compiles Context ──► Stateless Model
                      ▲                                          │
                      └───────── Runs Tool Call ◄────────────────┘
```

# AVOID
Do not assume the model has native shell execution capabilities. If a shell command runs, it is because your harness parsed the text, validated the permission, and spawned a local process.
*   *Avoid*: Blaming the model when a tool execution fails due to local path misconfigurations.
*   *Write*: Verify that your harness has correctly configured the working directory (Cwd) and access credentials.

# USAGE
`Developer A`: "The agent says it ran the tests, but the test database is completely untouched."
`Developer B`: "Check the harness console. The model generated a tool call to run the tests, but the harness threw an unhandled exception while spawning the subprocess, so the command was never actually executed."

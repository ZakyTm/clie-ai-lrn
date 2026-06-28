---
id: environment
title: Environment
summary: The boundary of directories, files, systems, databases, and network APIs that an agent can see and modify using its tools.
domains:
  - "Section 3 — Environment"
related:
  - filesystem
  - tool
  - sandbox
  - agents
sources:
  - "https://en.wikipedia.org/wiki/Execution_environment"
  - "https://modelcontextprotocol.io"
---

The environment is the operational world that surrounds an agent. It defines the boundary of what the agent can perceive and change. Without tools, an agent has no environment (it is isolated). By adding tools (like file readers, terminal executors, or database queries), you extend the environment, allowing the agent to read and write to the external system.

You shape the environment whenever you:
*   Configure the working directory (Cwd) for shell commands.
*   Setup credentials, env variables, or databases for an API script.
*   Set up docker container volumes to isolate file access.

---

## Boundaries of Perception

An agent's environment has two key dimensions:
1.  **Perception (Inputs)**: What tools can feed back to the context window (e.g. read file commands, shell logs, API results).
2.  **Action (Outputs)**: What changes the tools can write back to the system (e.g. write file commands, shell execution, database updates).

If a resource is not mounted or made accessible via a tool, it does not exist for the agent. For example, if you ask an agent to inspect a database but do not give it a SQL query tool, it has no way to see or interact with that database.

---

## Field Applications

### 1. AI Engineers (Mounting Sandbox Volumes)
Engineers restrict an agent's filesystem environment by mounting only the target project subdirectory into the execution container:

*   *Shell Configuration Example*:
    ```bash
    # Mount only the client workspace folder, keeping host files hidden
    docker run -it -v C:\Users\HP\Desktop\project:/workspace -w /workspace node-agent-runner
    ```

# AVOID
Do not let agents run in your root user environment or system-wide directory. A simple hallucination in a file writer command can destroy critical system files.
*   *Avoid*: Launching a full-access agent with write privileges inside `C:\Windows` or `/etc`.
*   *Write*: Isolate the environment by creating a dedicated workspace folder inside the project directories.

# USAGE
`Developer A`: "The agent is throwing 'file not found' errors when trying to edit our source files."
`Developer B`: "Check the tool working directory. The agent's environment was initialized at the system root directory instead of the project root, so its file read tools are looking in the wrong folder. Let's configure the harness Cwd parameter."

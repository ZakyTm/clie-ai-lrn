---
id: sandbox
title: Sandbox
summary: An isolated computing environment (container, VM, or restricted shell) that restricts the files and commands an agent can access, limiting the damage of automated actions.
domains:
  - "Section 4 — Sandbox"
related:
  - environment
  - permission-mode
  - agents
  - tool
sources:
  - "https://en.wikipedia.org/wiki/Sandbox_(computer_security)"
  - "https://github.com/docker/docker-ce"
---

A sandbox is an isolated computing environment — such as a Docker container, virtual machine, or restricted shell — where an agent's tools run. It creates a security boundary around the agent: even if the model attempts to execute destructive shell commands or download malicious code, the damage is contained inside the sandbox and cannot harm your primary operating system.

You run agents inside a sandbox whenever you:
*   Configure an AI assistant to execute code in background loops (AFK) overnight.
*   Build code interpreter platforms that run user-submitted python scripts.
*   Expose command terminal execution tools to a model.

---

## Grades of Sandbox Isolation

The depth of your security isolation dictates what permissions you can give the agent:

1.  **Restricted Shell (Low Isolation)**:
    *   *Mechanism*: Restricts command prefixes locally on your machine.
    *   *Blast Radius*: High. The agent has direct access to your local machine and environment variables. If a command runs, it can modify user documents.
2.  **Container (Medium Isolation - Recommended)**:
    *   *Mechanism*: Launches tool execution inside an ephemeral Docker container. No host credentials or keys are mounted, and the container is discarded after the task.
    *   *Blast Radius*: Low. The agent can modify container files but cannot access your primary hard drive.
3.  **VM / Cloud VM (High Isolation)**:
    *   *Mechanism*: Runs the agent on a separate virtual machine in the cloud, completely disconnected from your physical network.
    *   *Blast Radius*: Zero. Prevents kernel-level escapes from compromising your infrastructure.

```
+-------------------------------------------------------------+
|                       THE SANDBOX SHIELD                    |
|                                                             |
|   [ Agent Tool: run_command ] ──► Destructive Write (RM)     |
|                                         │                   |
|                                         ▼                   |
|   [ Ephemeral Sandbox Container ] ──X── Host Filesystem     |
|   (Damage is contained and discarded)                       |
+-------------------------------------------------------------+
```

---

## Field Applications & Sandbox Setup

### 1. AI Engineers (Launching Docker-Isolated Agent Tools)
AI engineers execute sensitive shell tools by wrapping the shell subprocess inside a Docker container:

*   *Code Example*:
    ```javascript
    import { exec } from "child_process";
    
    // Execute a command inside a temporary Docker container
    function runCommandInSandbox(command) {
      // Run command inside a secure node container with a 5-second timeout
      const dockerCmd = `docker run --rm --network none -v ./workspace:/workspace -w /workspace node:alpine timeout 5s ${command}`;
      
      exec(dockerCmd, (error, stdout, stderr) => {
        if (error) {
          return `Error: ${stderr}`;
        }
        return stdout;
      });
    }
    ```

# AVOID
Do not let agents execute write commands or shell scripts directly on your host machine without sandboxing unless you are inspecting every single prompt in Strict mode.
*   *Avoid*: Auto-approving command tool calls like `npm run test` or `python main.py` directly on your development machine.
*   *Write*: Isolate the workspace using Docker and mount directory volumes with read-only properties where possible.

# USAGE
`Developer A`: "I want to let this agent run autonomous refactoring tasks overnight while I am away."
`Developer B`: "We need to set our permission mode to bypass and launch the agent inside a docker sandbox with no internet access and no ssh credentials. If the model makes a mistake or loops, it will only nuke the container filesystem, which we can discard in the morning."

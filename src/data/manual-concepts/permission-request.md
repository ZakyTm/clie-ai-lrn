---
id: permission-request
title: Permission Request
summary: A checkpoint in an agent loop that prompts the developer for approval before executing a sensitive tool call.
domains:
  - "Section 3 — Environment"
related:
  - permission-mode
  - tool-call
  - human-in-the-loop
  - agents
sources:
  - "https://en.wikipedia.org/wiki/User_Confirmation_Pattern"
  - "https://modelcontextprotocol.io"
---

A permission request is a security gate in an agent's execution loop. When the model requests a sensitive action (like running a terminal command or writing to a file), the client harness pauses execution and prompts you to approve, modify, or reject the tool call.

You trigger permission requests when:
*   Running terminal agents that ask `Run command 'git push'? [y/N]`.
*   IDE assistants ask for permission to write modifications to a file.
*   Security configurations block network calls by default.

---

## Balancing Autonomy and Safety

Permission requests solve the security issues of agent systems. If an agent loops autonomously, it could execute destructive actions. By introducing a **Human-in-the-loop (HITL)** checkpoint, you limit the blast radius:

```
[Tool Call: delete_file] ──► Harness Pauses Loop ──► Console Prompt: "Approve?" ──► [User Types 'Y'] ──► Execution Completed
```

However, permissions introduce interruptions. If an agent asks for approval on every read-only command (e.g. listing directories or reading files), it wastes your time and slows development.

---

## Field Applications

### 1. Fullstack Developers (Implementing Approval Gates)
Developers configure permission gates in their tool execution routing scripts, bypassing prompts for safe tools (reads) and prompting for unsafe tools (writes/executes):

*   *Code Example*:
    ```javascript
    async function executeToolWithPermission(toolCall) {
      const isSensitive = ["run_command", "write_file", "delete_file"].includes(toolCall.name);
      
      if (isSensitive) {
        // Pause loop and prompt developer via terminal CLI
        const approved = await promptUserForApproval(toolCall);
        if (!approved) {
          return "Error: Action rejected by the user.";
        }
      }
      
      // Execute function locally
      return runLocalFunction(toolCall.name, toolCall.args);
    }
    ```

# AVOID
Do not auto-approve terminal shell commands or credential writes when running agents in un-sandboxed environments.
*   *Avoid*: Letting an agent run `rm -rf` commands or database drops without user confirmation on your local machine.
*   *Write*: Set permission rules that require explicit human approval for shell scripts and file creations.

# USAGE
`Developer A`: "Our agent is sitting idle, not outputting any code."
`Developer B`: "Check the terminal. It generated a tool call to run a shell command and is waiting on a permission request. You need to type 'y' in the console to let it proceed."

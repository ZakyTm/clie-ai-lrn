---
id: permission-mode
title: Permission Mode
summary: The configuration tier (Bypass, Ask, or Strict) that dictates which tool classes run automatically and which require developer approval.
domains:
  - "Section 3 — Environment"
related:
  - permission-request
  - agent-mode
  - human-in-the-loop
  - sandbox
sources:
  - "https://modelcontextprotocol.io"
  - "https://en.wikipedia.org/wiki/Access_control"
---

Permission mode is the configuration setting inside your agent harness that controls the balance between autonomy and safety. It defines which tool classes are allowed to execute automatically, and which must pause for user confirmation.

You configure permission modes when:
*   Setting up an agent to run automated refactoring tasks while you are away (AFK).
*   Configuring security policies in enterprise AI development environments.
*   Enabling read-only access for a model to index a repository schema.

---

## Standard Permission Modes

Most developer-centric agent harnesses support three primary permission modes:

| Mode | Reads (e.g. `view_file`) | Writes/Executes (e.g. `run_command`) | Use Case |
| ---- | ---------------------- | ---------------------------------- | -------- |
| **Strict (Ask)** | Prompt User | Prompt User | Safe exploration, highly sensitive files. |
| **Normal (Default)** | Auto-Execute | Prompt User | Balanced development, typical workspace tasks. |
| **Bypass (Yolo)** | Auto-Execute | Auto-Execute | Automated runs inside an isolated **Sandbox**. |

Choosing the right mode depends on trust and environment thickness:
*   **Outside a Sandbox**: Keep permissions at the default level (auto-approve reads, prompt on writes) to protect your local system.
*   **Inside a Sandbox**: Switch to Bypass (Yolo) mode so the agent can execute commands and write files without constantly interrupting you.

---

## Field Applications & Security Toggles

Fullstack engineers implement configuration flags to let developers adjust permission mode at startup:

*   *CLI Startup Example*:
    ```bash
    # Run the agent in Bypass mode for automated testing (sandbox recommended)
    node agent-harness.js --permission-mode=bypass
    
    # Run in strict mode to inspect all tool calls
    node agent-harness.js --permission-mode=strict
    ```

# AVOID
Do not run an agent in Bypass mode on your primary operating system without isolation. A simple hallucination in a write file loop or shell script could corrupt your home directory.
*   *Avoid*: Launching the agent with `--permission-mode=bypass` outside of a Docker container or virtual machine.
*   *Write*: Restrict bypass runs strictly to isolated sandboxes, keeping local terminal execution on the default "ask" mode.

# USAGE
`Developer A`: "I am tired of typing 'y' in the console every time the agent wants to check a file."
`Developer B`: "We have the permission mode set to strict. Let's switch it to the default mode, which auto-approves safe reads like file viewing, while keeping write and command execution tools locked behind user approvals."

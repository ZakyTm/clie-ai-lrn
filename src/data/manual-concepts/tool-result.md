---
id: tool-result
title: Tool Result
summary: The execution output (data or error logs) sent back to the model provider by the client harness after running a tool call.
domains:
  - "Section 3 — Environment"
related:
  - tool
  - tool-call
  - context
  - stateless
sources:
  - "https://docs.anthropic.com/en/docs/build-with-claude/tool-use"
  - "https://platform.openai.com/docs/guides/function-calling"
---

A tool result (also called tool output) is the payload returned to the model by the client harness after executing a **Tool Call**. It feeds the result of the action (e.g. file content, execution logs, API status) back into the conversation context so the model can evaluate what happened and decide its next step.

You construct tool results whenever you:
*   Feed the stdout of a compiler command back to an agent.
*   Format database rows as markdown tables for the prompt.
*   Pass a validation error traceback back to a model to help it self-correct.

---

## Closing the Loop

Because models are **stateless**, they do not "know" if a tool run succeeded unless the harness explicitly tells them. A tool result must be formatted as a specific message role (usually `tool` or `user` with a matching tool call ID) so the provider can align it with the original request:

```
[Assistant Tool Call] (ID: "call-99", Tool: "read_file")
       │
       ▼ (Harness runs read operation)
[Tool Result] (ID: "call-99", Content: "export const x = 12;")
```

If the execution failed (e.g. file not found, syntax error), you must still return a tool result containing the error traceback. This gives the model a chance to reflect, fix the arguments, and run the tool again.

---

## Field Applications

### 1. Fullstack Developers (Formatting Results)
Developers format tool responses as text strings and map them to their corresponding call IDs in the API messages array:

*   *Code Example (Node.js message composition)*:
    ```javascript
    // Constructing the message history containing the result
    const messages = [
      {
        role: "user",
        content: "What packages are installed?"
      },
      {
        role: "assistant",
        content: [
          { type: "text", text: "Let me check package.json." },
          { type: "tool_use", id: "call-123", name: "view_file", input: { path: "package.json" } }
        ]
      },
      {
        role: "user", // Or specialized 'tool' role depending on provider SDK
        content: [
          {
            type: "tool_result",
            tool_use_id: "call-123",
            content: '{"dependencies": {"astro": "^7.0.0"}}'
          }
        ]
      }
    ];
    ```

# AVOID
Do not swallow tool execution errors inside your harness. If a file fails to write, do not return a generic "Success" message to the model.
*   *Avoid*: Returning `"Success"` when a file write threw a "Permission Denied" exception.
*   *Write*: Return the exact exception message: `"Error: EACCES: permission denied, open 'config.json'"`.

# USAGE
`Developer A`: "The model keeps trying to write files but doesn't realize the directories don't exist."
`Developer B`: "Check what we are returning as the tool result. Our harness was swallowing filesystem errors and returning empty strings on failure. Let's make sure we return the actual filesystem traceback as the tool result so the model can call the mkdir tool first."

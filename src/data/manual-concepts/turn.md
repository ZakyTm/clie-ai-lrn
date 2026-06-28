---
id: turn
title: Turn
summary: A single request-response exchange in a session, composed of user input (and potential tool results) followed by the model's output.
domains:
  - "Section 2 — Model provider request"
related:
  - session
  - model-provider-request
  - tool-call
  - stateless
sources:
  - "https://en.wikipedia.org/wiki/Conversation_analysis"
  - "https://docs.anthropic.com/en/docs/build-with-claude/system-prompts"
---

A turn is a single message exchange in a conversation. It consists of the client payload sent to the API, followed by the model's generated response. 

In agent architectures, a single user prompt can trigger multiple sub-turns (e.g. the model calls a tool, the harness executes it and returns the result, the model calls another tool, and finally responds to the user).

You count turns whenever you:
*   Measure the speed and efficiency of an agent's problem-solving loop.
*   Configure maximum loops (`max_turns = 10`) in your scripting harness.
*   Calculate the token growth rate of your active chat session.

---

## Anatomy of a Multi-Step Turn

When an agent interacts with tools, a single user action translates to multiple API turns behind the scenes:

```
[ Turn 1.1 ] User: "Fix the type error in user.ts"
            ──► Model outputs: [ Tool Call: view_file "user.ts" ]
[ Turn 1.2 ] Harness returns: [ Tool Result: "export interface User {..." ]
            ──► Model outputs: [ Tool Call: replace_line "..." ]
[ Turn 1.3 ] Harness returns: [ Tool Result: "Success" ]
            ──► Model outputs: "I've fixed the type error. You're ready to compile."
```

Each sub-turn requires a network request to the provider. Because the API is **stateless**, every subsequent turn must send the accumulated history of all previous sub-turns, causing the context token size to grow step-by-step.

---

## Field Applications

AI engineers set a strict limit on the number of turns in an agent's execution loop to prevent runaway billing cycles when models fall into loops:

*   *Code Example (Loop Guardrail)*:
    ```python
    def run_agent_loop(user_task, max_turns=8):
        context = initialize_session(user_task)
        
        for turn in range(max_turns):
            response = call_model(context)
            context.append(response)
            
            if not has_tool_calls(response):
                return response # Task completed
                
            execute_and_append_tool_results(response, context)
            
        raise TimeoutError("Agent exceeded maximum turn threshold without finishing.")
    ```

# AVOID
Do not let agents loop without turn limits. If the model encounters a confusing compile error, it can run 50 turns in a minute, generating high API bills.
*   *Avoid*: Launching infinite `while True` agent loops that call write tools.
*   *Write*: Set a strict maximum turn threshold (e.g., 8 or 10 turns) to pause and prompt the developer if the task gets stuck.

# USAGE
`Developer A`: "The agent has spent 15 turns trying to fix the same syntax error."
`Developer B`: "It's stuck in a loop. Let's inspect the logs of the last turn. The tool result is returning a permission error, but the model doesn't realize it. We need to kill the session and override the path parameters."

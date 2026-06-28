---
id: agents
title: Agent Engineering
domains:
  - "agents"
difficulty: advanced
summary: An architectural design pattern where an LLM is embedded within a stateful loop, allowing it to deconstruct goals, invoke tools, inspect environment feedback, and self-correct.
tags:
  - "agents"
  - "tool-use"
  - "autonomous-loops"
sourceRepo: manual
featured: true
related:
  - mcp-tooling
  - prompt-engineering
sources:
  - "https://lilianweng.github.io/posts/2023-06-23-agent/"
  - "https://github.com/langchain-ai/langgraph"
---

An AI Agent is a software loop (like a `while` loop) that wraps a language model, enabling it to act, call external tools, inspect their outputs, and adapt its plan iteratively until it achieves a goal.

You see agents at work when:
*   An AI coding terminal (like Claude Code) reads your workspace, edits files, and runs compiler tests to fix a bug autonomously.
*   An automated browser assistant logs into a console, navigates pages, and downloads reports.
*   A support workflow reads incoming emails, categorizes issues, updates CRM tables, and drafts replies.

---

## How It Works (The Technical Layering)

While a simple LLM query is a one-shot request, an agent operates inside an active execution loop:

1.  **System Prompt (The Harness Instruction)**: The harness configures the agent with a list of tools and defines its output schema (usually tool call templates).
2.  **State Planning**: The model takes the task, writes out its reasoning steps, and decides to call a specific tool.
3.  **Tool Call Output**: The model outputs a structured string (like `{"tool": "read_file", "path": "package.json"}`).
4.  **Harness Execution**: The client harness intercepts the output, runs the corresponding function on the system (or in a secure **Sandbox**), and returns the results as a new system message.
5.  **Observation & Iteration**: The model reads the tool output, observes the errors or outputs, adjusts its plan, and decides whether to run another tool or finish.

```
Task Prompt ──► [ Reason ] ──► Tool Call Output ──► Harness Runs Tool ──► Sandbox Result ──► [ Observe ] ──► Repeat or Finish
```

---

## Field Applications & Implementation

### 1. Vibe Coders (Directing the Agent)
Vibe coders direct autonomous agents by establishing strict success guidelines and constraints:

*   *Prompt Example*:
    ```markdown
    Review the directory structure and implement the new dark theme styling in the CSS files. 
    
    CONSTRAINTS:
    - Run the dev build test using `npm run build` after every file modification.
    - If you see any CSS parsing warnings, stop and fix them immediately.
    - Output your final results only when the build successfully passes.
    ```

### 2. Fullstack & AI Engineers (The Core Execution Loop)
Engineers write stateful execution engines in Python or Node.js to coordinate the agent's turn loops:

*   *Code Example*:
    ```python
    # A simple Python agent while-loop
    context = initialize_context(user_task, tools)
    max_turns = 10
    
    for turn in range(max_turns):
        response = model.generate(context)
        context.append({"role": "assistant", "content": response})
        
        if is_tool_call(response):
            tool_name, args = parse_tool_call(response)
            result = execute_tool(tool_name, args)  # Executes command or reads DB
            context.append({"role": "system", "content": f"Tool Output: {result}"})
        else:
            print("Task Completed:", response)
            break
    ```

# AVOID
Do not let agents execute commands without setting strict guardrails, maximum loop thresholds, or permission modes. They can fall into infinite recursive billing loops or delete local files.
*   *Avoid*: Running a while-loop agent without loop counters or confirmation prompts on write operations.
*   *Write*: Implement a strict maximum turn threshold (e.g. `max_turns = 10`) and require developer approvals for write actions.

# USAGE
`Developer A`: "Our agent is running in an infinite loop, querying the same file over and over."
`Developer B`: "We need to fix its self-reflection. Let's add a turn threshold, update its system prompt to penalize repeating the same actions, and configure a sandbox that logs each tool call so we can inspect where it gets stuck."

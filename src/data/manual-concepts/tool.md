---
id: tool
title: Tool
summary: An external function or API made available to a model, defined via a JSON schema, allowing the agent loop to execute operations on the host system.
domains:
  - "Section 3 — Environment"
related:
  - tool-call
  - tool-result
  - agents
  - mcp-tooling
sources:
  - "https://docs.anthropic.com/en/docs/build-with-claude/tool-use"
  - "https://platform.openai.com/docs/guides/function-calling"
---

A tool (also called a function or capability) is an executable function exposed to an LLM by the client harness. It lets the model interact with the external world (e.g. read files, run terminal commands, query databases, or call web APIs).

You define tools whenever you:
*   Write an integration to let an agent search Google.
*   Connect a model to your custom database API.
*   Configure file readers/writers for an IDE assistant.

---

## Tool Definition via JSON Schema

AI models do not execute code natively. To tell the model that a tool exists, you must define its interface in the model request payload using a **JSON Schema**. This tells the model:
1.  The **Name** of the tool (e.g. `calculate_sum`).
2.  A **Description** of what it does (e.g. "Calculate the sum of two integers").
3.  The **Parameters** it accepts, their types, and which fields are required.

The model reads these schemas and uses them to determine when and how to call the tool.

---

## Field Applications & Schema Construction

### 1. Fullstack Developers (Defining Tool Schema in Request)
*   *Code Example*:
    ```javascript
    const toolDefinitions = [
      {
        name: "search_web",
        description: "Search the web for current information.",
        input_schema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "The search query (e.g. 'Astro framework version')."
            }
          },
          required: ["query"]
        }
      }
    ];
    ```

# AVOID
Do not write vague, generic tool descriptions. If the model doesn't understand when to use a tool or what parameters it expects, it will hallucinate invalid parameters or ignore the tool entirely.
*   *Avoid*: `description: "tool for db"`
*   *Write*: `description: "Query our Postgres database. Accepts a raw SQL read-only string. Returns matching rows as a JSON array."`

# USAGE
`Developer A`: "Our model keeps trying to query Google but we haven't given it internet access."
`Developer B`: "We need to expose a search tool. Let's write a python search function, define its JSON schema in our tool list parameter, and wire it into our agent loop so the model can call it."

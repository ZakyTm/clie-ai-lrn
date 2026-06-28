---
id: model-provider-request
title: Model Provider Request
summary: The network API payload containing prompt messages, system templates, parameters, and tool definitions sent to a model provider.
domains:
  - "Section 2 — Model provider request"
related:
  - model-provider
  - input-tokens
  - tool
  - context
sources:
  - "https://docs.anthropic.com/en/api/messages"
  - "https://platform.openai.com/docs/api-reference/chat"
---

A model provider request is the structured network payload (usually a JSON POST request) that a developer's harness sends to an LLM API endpoint (like Anthropic or OpenAI) to generate a completion.

You configure this request whenever you:
*   Write code to call Claude or GPT from your server backend.
*   Define system prompts and select a temperature parameter.
*   Pass a list of functions (tools) that your agent is allowed to invoke.

---

## Anatomy of a Request Payload

A standard request is not just a raw string of text. It is a structured JSON object containing several configuration blocks:

1.  **Model Identifier**: Tells the provider which specific parameters to load (e.g. `claude-3-5-sonnet-20241022`).
2.  **System Prompt**: The root instructions that set the agent's behavior and boundaries.
3.  **Messages Array**: The dialogue history, structured as objects with `role` (`user`, `assistant`, or `system`) and `content` fields.
4.  **Parameters**: Tuning options like `temperature`, `max_tokens`, and `response_format`.
5.  **Tools (Schemas)**: Descriptions of functions the model can call, formatted as JSON Schemas.

```
+-----------------------------------------------------------+
|               MODEL PROVIDER REQUEST PAYLOAD              |
|                                                           |
|  [Model ID] ────► "claude-3-5-sonnet"                     |
|  [System]   ────► "You are an SQL generator..."           |
|  [Messages] ────► [{"role": "user", "content": "Query"}]  |
|  [Tools]    ────► [{"name": "run_sql", "parameters":{}}]   |
+-----------------------------------------------------------+
```

---

## Field Applications

### 1. Fullstack & AI Engineers (Standard API Call)
Engineers construct this request object using the provider's SDK library:

*   *Code Example*:
    ```javascript
    const response = await client.messages.create({
      model: "claude-3-5-sonnet",
      max_tokens: 1000,
      temperature: 0.2,
      system: "You are a compiler assistant.",
      messages: [
        { role: "user", content: "Explain this type error: ..." }
      ],
      tools: [{
        name: "get_type_definition",
        description: "Fetch type information for a TS interface.",
        input_schema: { type: "object", properties: { name: { type: "string" } } }
      }]
    });
    ```

# AVOID
Do not send the raw file contents of your entire database or git history in every single request without sanitizing it. This wastes input tokens and increases your API bills.
*   *Avoid*: Appending your entire system log history directly into the messages array of every network request.
*   *Write*: Parse and filter the logs in your local client code first, sending only the relevant 50 lines of context.

# USAGE
`Developer A`: "Our API calls keep returning 400 Bad Request errors."
`Developer B`: "Check the model provider request payload structure. If you added a new tool, ensure the parameters object follows the JSON Schema spec exactly, and that you haven't exceeded the provider's token limits."

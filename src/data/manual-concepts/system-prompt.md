---
id: system-prompt
title: System Prompt
summary: The root-level instruction block in an API request that establishes the model's role, constraints, formatting rules, and tool access boundaries.
domains:
  - "Section 2 — Model provider request"
related:
  - context
  - harness
  - agentsmd
  - permission-mode
sources:
  - "https://docs.anthropic.com/en/docs/build-with-claude/system-prompts"
  - "https://platform.openai.com/docs/guides/reasoning"
---

A system prompt is the baseline configuration block injected into a model request. Unlike user messages (which change turn by turn), the system prompt acts as the standing code of conduct. It defines who the model is, what styling conventions it must follow, which tools are available, and how it must handle errors or security decisions.

You configure system prompts when:
*   Writing backend integrations to restrict Claude to outputting only valid JSON objects.
*   Building code refactoring agents that must follow project rules.
*   Enabling specific personas (e.g. Socratic reviewer, SQL debugger).

---

## The Instruction Anchor

Technically, model providers process the system prompt with highest priority, aligning the model's attention heads to the system tokens throughout the session.

A standard system prompt organizes guidelines using structured XML or Markdown blocks:
1.  **Role Definition**: "You are a senior TypeScript compiler assistant."
2.  **Constraints**: "Never edit files outside `src/components/`. Never add external dependencies."
3.  **Tool Guidelines**: "Always run `npm run lint` after modifying a file to verify formatting."
4.  **Format Constraints**: "All code must be encapsulated inside markdown blocks."

Because the system prompt is processed on every turn, it spends a portion of your **Attention Budget**. Keeping it lean and using **Progressive Disclosure** is crucial to prevent performance slips.

---

## Field Applications

### 1. Fullstack Developers (System Parameter Integration)
*   *Code Example*:
    ```javascript
    const completion = await client.messages.create({
      model: "claude-3-5-sonnet",
      system: `
        You are a database migration helper.
        CONSTRAINTS:
        - Output raw SQL queries inside \`\`\`sql blocks.
        - Do not output any conversational introduction or greetings.
      `,
      messages: [{ role: "user", content: "Add a timestamp column to the users table." }]
    });
    ```

# AVOID
Do not use conversational or polite language in system prompts. It wastes token budgets without improving instruction following.
*   *Avoid*: "Hello model, could you please act as a helpful friend and code helper for us? Thank you!"
*   *Write*: "Role: Expert software developer. Instructions: Output code directly, skipping all greetings and conversational commentary."

# USAGE
`Developer A`: "The model keeps writing pleasantries like 'Sure, I can help with that!' before every query response, which slows down our app latency."
`Developer B`: "We need to update our system prompt. Let's add a strict constraint: 'Ignore greetings. Output only raw code block formats.' That will instantly strip the conversational noise."

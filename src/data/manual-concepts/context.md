---
id: context
title: Context
summary: The combined body of system instructions, conversation logs, files, and schemas injected into the model request to guide its behavior and provide facts.
domains:
  - "Section 2 — Model provider request"
related:
  - context-window
  - stateless
  - model-provider-request
sources:
  - "https://en.wikipedia.org/wiki/In-context_learning_(machine_learning)"
  - "https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching"
---

Context (also called prompt context or session context) is the total text payload compiled by your application harness and sent in a model provider request. It is the model's active "working memory" for that specific run.

You build and structure context whenever you:
*   Write system instructions defining an agent's persona.
*   Implement RAG pipelines to insert document search results into a prompt.
*   Serialize local code files so an assistant can read them.

---

## Technical Details: In-Context Learning

Because models are **stateless** and their parameters are frozen, they cannot learn new facts permanently during a chat session. Instead, they perform **In-Context Learning**:

1.  **Reading Comprehension**: The model processes the injected files and instructions in its attention heads, using them to guide its predictions.
2.  **Context Assembly**: A standard agent harness compiles multiple data sources into a structured string before sending the request:
    ```
    System Instructions ──► Chat History ──► Retrieved Documents ──► User Message = Context Block
    ```
3.  **Vibe vs. Fact**: While parameters dictate *how* a model thinks (grammar, code style, reasoning), the context dictates *what* it thinks about (your database schema, today's date, your project specs).

---

## Field Applications & Formatting

To prevent the model from confusing system rules with user files, engineers use XML tags or clear Markdown headers to separate context areas:

### 1. Fullstack Developers (Context Tagging)
*   *Prompt Template Example*:
    ```markdown
    You are an automated code audit assistant. Analyze the source code provided in the tags below for security bugs.
    
    <source_code file="auth.ts">
    ${fileContent}
    </source_code>
    
    Output your audit report as a bulleted list.
    ```

# AVOID
Do not throw massive, unstructured blocks of text into your prompt without tags or delimiters. This leads to prompt injection or model confusion (e.g. if a file contains the text "ignore previous instructions", a model might follow the file rather than your system prompt).
*   *Avoid*: Appending raw file text directly to your prompt without wrappers.
*   *Write*: Wrap all external data inside XML tags like `<file>` or `<doc>`.

# USAGE
`Developer A`: "The model is ignoring the instructions I wrote at the top of the prompt."
`Developer B`: "That's because your documentation context block is so large it pushes the instructions out of focus. Let's place our system instructions in the dedicated `system` parameter of the request, and wrap the documentation inside clear `<context>` XML tags."

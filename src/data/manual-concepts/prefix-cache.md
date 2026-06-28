---
id: prefix-cache
title: Prefix Cache
summary: An optimization system that stores pre-processed prompt segments in GPU memory, skipping repetitive calculations for identical context prefixes.
domains:
  - "Section 2 — Model provider request"
related:
  - cache-tokens
  - input-tokens
  - model-provider
  - context-window
sources:
  - "https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching"
  - "https://platform.openai.com/docs/guides/prompt-caching"
---

Prefix caching (also known as prompt caching) is a server-side performance feature. When you send a large prompt, the provider processes the text and saves the calculated state (kv-cache) in the GPU memory. On your next request, if the beginning of your prompt matches the saved cache, the server skips the calculations, speeding up the response time and reducing your bill.

You use prefix caching whenever you build:
*   **Large-Context RAG Systems**: Re-using a massive 50K-token reference handbook across dozens of different search queries.
*   **Multi-turn Agent Sessions**: Appending new message turns to a long conversation history without paying to re-read the entire history from scratch.
*   **Complex Tool Harnesses**: Passing the exact same tool definitions and system instructions in every single message.

---

## How It Works: The Prefill Shortcut

When a model processes a prompt, it must compute the attention relationships for every token. For a 100K token prompt, this calculation is very heavy (quadratic complexity).

With prefix caching:
1.  **First Request (Cache Miss)**: You send 100,000 tokens of code context. The server processes it, runs inference, and writes the calculated activation states to GPU memory. You pay full price for the prefill.
2.  **Second Request (Cache Hit)**: You append a short question at the end. The server detects that the first 100,000 tokens are identical to the cached prefix. It loads the pre-computed state instantly, skipping the prefill calculation. 
3.  **Savings**: You receive the response in under a second (instead of 10 seconds) and pay a highly discounted rate (usually 90% cheaper) for the cached tokens.

```
Request 1: [ Massive Reference Text ] ──► Prefill Processing ──► Saved in GPU Cache
Request 2: [ Massive Reference Text ] (Loaded from Cache) + [ New Query ] ──► Fast Inference
```

---

## Field Applications & Prompt Alignment

To benefit from prefix caching, you must arrange your prompt sections from **static to dynamic**:

```
[ STATIC - Cache Friendly ] ──► [ SEMI-STATIC ] ──► [ DYNAMIC - Changes Every Time ]
(System Instructions)           (Documentation)        (User Question / Current Time)
```

### 1. AI Engineers (Configuring Anthropic Prompt Cache)
AI engineers define cache breakpoints in the request payload using the provider's SDK:

*   *Code Example*:
    ```javascript
    // Setting up prompt caching in Anthropic SDK
    const response = await client.messages.create({
      model: "claude-3-5-sonnet",
      max_tokens: 1000,
      system: "You are a senior codebase refactoring assistant.",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: massiveCodebaseContextString,
              // Instruct the provider to cache this block
              cache_control: { type: "ephemeral" }
            },
            {
              type: "text",
              text: "Find the memory leak in our database connector class."
            }
          ]
        }
      ]
    });
    ```

# AVOID
Do not insert dynamic, changing variables (like the current system timestamp, random session IDs, or changing user inputs) at the top of your prompts. This breaks the prefix alignment and invalidates the entire cache.
*   *Avoid*: Placing `Current Time: ${new Date().toISOString()}` at the very beginning of your system prompt.
*   *Write*: Move the current timestamp to the very end of your prompt, keeping the system instructions static.

# USAGE
`Developer A`: "Our prompt cache hit rate is 0%. We are paying full price for every query."
`Developer B`: "We placed a dynamic uuid parameter `session_id: abc-123` at the top of our prompt template. Because the prefix changes on every call, the cache is discarded. Let's move the session metadata to the end of the payload to preserve the prefix cache."

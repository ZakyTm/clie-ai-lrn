---
id: cache-tokens
title: Cache Tokens
summary: The portion of input tokens that matched an active prefix cache, resulting in significantly reduced bills and near-instant processing.
domains:
  - "Section 2 — Model provider request"
related:
  - prefix-cache
  - input-tokens
  - model-provider-request
sources:
  - "https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching"
  - "https://platform.openai.com/docs/guides/prompt-caching"
---

Cache tokens (often reported as "cache creation" or "cache read" tokens in API responses) are the subset of input tokens that matched an active, pre-calculated prefix cache in the provider's memory.

You track cache tokens when:
*   Building analytics dashboards to measure your application's prompt efficiency.
*   Calculating how much money you save by using multi-turn agent loops.
*   Debugging why a prompt optimization change didn't result in faster speeds.

---

## The Economics of Cache Hits

Model providers charge distinct rates for input tokens based on whether they hit or miss the cache:

1.  **Cache Creation Tokens**: If the prompt is not cached, the server processes it and writes it to memory. You pay a standard input token rate.
2.  **Cache Read Tokens**: If your prompt matches a cached prefix, you are billed at the cached rate (e.g. $0.30 per million tokens instead of $3.00, resulting in a **90% discount**).
3.  **Threshold Limits**: Providers require prompts to meet a minimum size before caching is activated (e.g. Anthropic requires at least 1,024 tokens for Sonnet, while OpenAI caches automatically in 1,024-token blocks).

---

## Field Applications & Tracking Cache Usage

### 1. Fullstack Developers (Parsing Token Metadata)
Fullstack developers inspect the API response metadata to verify that cache hits are occurring:

*   *Code Example (Parsing Anthropic Response Metadata)*:
    ```javascript
    const response = await client.messages.create({
      model: "claude-3-5-sonnet",
      max_tokens: 100,
      messages: [{ role: "user", content: "..." }]
    });
    
    // Read billing metadata
    const usage = response.usage;
    console.log("Input Tokens (Paid Full):", usage.input_tokens);
    console.log("Cached Tokens (Discounted):", usage.cache_read_input_tokens);
    console.log("Cache Creation Tokens:", usage.cache_creation_input_tokens);
    ```

# AVOID
Do not assume that cache tokens remain in memory forever. ephemerally cached prefixes expire after inactivity (usually 5 to 10 minutes).
*   *Avoid*: Expecting prompt caching to save money on a cron job that runs only once every 6 hours.
*   *Write*: Use caching for active chat sessions or real-time agent loops that query the API repeatedly within minutes.

# USAGE
`Developer A`: "Why is our billing dashboard showing $100 for today's tests when it was only $10 yesterday?"
`Developer B`: "We changed our test script to run only once every hour. Because the inactivity interval exceeds 10 minutes, the prefix cache expired between runs, meaning we had 0% cache tokens and paid full input token prices for every run. We should pack our queries closer together during test suites."

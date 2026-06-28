---
id: input-tokens
title: Input Tokens
summary: The numerical text fragments (prompts, system rules, history, and schemas) sent in a request to the model provider.
domains:
  - "Section 2 — Model provider request"
related:
  - token
  - output-tokens
  - prefix-cache
  - context-window
sources:
  - "https://docs.anthropic.com/en/api/pricing"
  - "https://openai.com/api/pricing/"
---

Input tokens (also called prompt tokens) are the raw text chunks that you send *to* the model in your request payload. This includes system prompts, conversation history, injected RAG context documents, and your current message.

You calculate input tokens when:
*   Adding up your monthly API usage bills.
*   Checking if you are about to exceed a model's active context window.
*   Optimizing RAG retrieval sizes to fit under rate limits.

---

## Technical Details: Prefill & Billing

From an engineering perspective, input tokens differ fundamentally from output tokens:

1.  **Prefill Phase (Parallel Execution)**: When the request arrives at the provider, the GPUs process all input tokens in parallel. This is highly optimized but requires high memory bandwidth.
2.  **Cost Difference**: Input tokens are significantly cheaper than output tokens (typically 3x to 5x cheaper). This is because the provider only needs to run a single parallel forward pass over the inputs, whereas outputs must be generated one token at a time in a slow sequential loop.
3.  **TPM (Tokens Per Minute) Limits**: Model providers set limits on how many input tokens your application can send per minute to prevent system congestion.

---

## Field Applications & Cost Controls

### 1. Fullstack & AI Engineers (Checking Token Sizes)
Engineers count input tokens locally using tokenizer libraries before making API requests to prevent rate limit exceptions:

*   *Code Example (Node.js)*:
    ```javascript
    import { encoding_for_model } from "@dqbd/tiktoken";
    
    function countInputTokens(text) {
      const enc = encoding_for_model("gpt-4");
      const tokens = enc.encode(text);
      enc.free(); // Free memory
      return tokens.length;
    }
    
    const tokenCount = countInputTokens("System: Be concise. User: Summarize this.");
    console.log("Tokens in request:", tokenCount);
    ```

# AVOID
Do not send huge, redundant developer guidelines or static configuration files in every single request message. It inflates your input token counts and adds massive unnecessary costs.
*   *Avoid*: Appending your entire project readme and code lint configuration files to every prompt.
*   *Write*: Keep instructions concise, and use prompt caching (prefix-caching) so you only pay for the full file list once.

# USAGE
`Developer A`: "Our API bill tripled this month, but the model outputs the same short summaries."
`Developer B`: "Check the input tokens. We are appending our entire 100K token documentation file to the prompt context on every message. We need to implement prefix-caching or RAG to retrieve only the relevant paragraphs."

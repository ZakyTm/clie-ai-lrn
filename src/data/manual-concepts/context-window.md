---
id: context-window
title: Context Window
summary: The absolute maximum token limit (capacity) that a model can process, read, and write in a single API request.
domains:
  - "Section 2 — Model provider request"
related:
  - context
  - token
  - prefix-cache
  - attention-budget
sources:
  - "https://platform.openai.com/docs/guides/window-sizes"
  - "https://docs.anthropic.com/en/docs/about-claude/models"
---

The context window is the maximum number of tokens a model can hold in its "active memory" during a single request. If your prompt history, system files, and output generation add up to more than this limit, the provider will reject the request (or truncate the oldest messages).

You manage the context window when:
*   Pasting code files into your chat sessions.
*   Designing long-running agent systems that analyze complex codebases.
*   Writing algorithms to compress conversation histories as they grow.

---

## Technical Details: Sizing and Attention Degradation

Modern frontier models support massive context windows (ranging from 128,000 to over 1,000,000 tokens). However, using the full window comes with significant engineering trade-offs:

1.  **Memory Footprint**: The memory required to process a request grows with context length. The quadratic attention cost means processing a full 200K context is slower and more expensive than a 2K context.
2.  **Attention Degradation (Lost in the Middle)**: Although a model *can* read 200,000 tokens, it does not pay equal attention to all parts of the window. Models are historically best at recalling details at the very beginning or the very end of the context, occasionally missing facts buried in the middle.
3.  **Prompt Caching Safeguard**: Large context windows are only financially practical if you use **Prefix Caching** to avoid paying full prefill costs on every query.

---

## Field Applications & Memory Truncation

When building agent loops, engineers write code to monitor context sizes and prune old messages before hitting the window limit:

### 1. AI Engineers (Sliding Window Truncation)
*   *Code Example*:
    ```python
    # Ensure our message history stays under 80,000 tokens
    def prune_context(messages, max_token_budget=80000):
        while calculate_total_tokens(messages) > max_token_budget:
            # Remove the oldest user-assistant turn (index 1 & 2, preserving system instructions)
            if len(messages) > 3:
                messages.pop(1)
                messages.pop(1)
            else:
                break
        return messages
    ```

# AVOID
Do not dump entire project folders, lockfiles, or built asset bundles into your prompt context. This wastes your token budget and degrades the model's focus.
*   *Avoid*: Uploading a raw 150,000-line `package-lock.json` file just to ask the model to update one package.
*   *Write*: Query the specific package version line locally, and pass only that single line as context.

# USAGE
`Developer A`: "Our codebase migration assistant is starting to ignore class definitions we loaded earlier in the chat."
`Developer B`: "We've exceeded 100K tokens in our conversation. Because of attention degradation, the model is losing track of facts buried in the middle of our context window. We need to clear our history or use a sliding window to keep only the relevant file structures."

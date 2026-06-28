---
id: token
title: Token
summary: The basic numerical chunk (character fragment or sub-word) that a model reads and writes, converted from text via a tokenizer.
domains:
  - "Section 1 — The Model"
related:
  - model
  - next-token-prediction
  - inference
  - context-window
sources:
  - "https://github.com/openai/tiktoken"
  - "https://huggingface.co/docs/transformers/main_classes/tokenizer"
---

A token is the basic unit of text that a model processes. LLMs do not read characters or words directly. Instead, a static utility called a **tokenizer** splits text into integers using a predefined vocabulary (usually 30,000 to 200,000 unique fragments).

*   **Rule of Thumb**: For English prose, 1 token is roughly 0.75 words (or 4 characters).
*   **The Code Penalty**: Code tokenizes much less efficiently than English prose. Common keywords like `function` or `import` compress into 1 token, but indentation spaces, unusual variable names, hashes, base64 blobs, or minified text split into many small tokens.
*   **Context Budgets**: The size of your prompts, your API bills, and your context window limits are all calculated in tokens.

### Tokenization Example
Consider how different strings decompose:
*   `"the"` ──► `1 token` (highly common)
*   `"a3f9c2"` ──► `4-5 tokens` (rare hexadecimal string)
*   `"    const x = 5;"` ──► `6 tokens` (spaces can serialize into individual tokens depending on alignment)

# AVOID
Do not copy large raw data files, minified files, or binary logs directly into your prompts. They bloat the token count without adding meaning.
*   *Avoid*: "Let's paste our 5MB minified bundle into the prompt to show it the error line."
*   *Write*: "We should extract the specific stack trace lines and only paste those, saving 99% of our token budget."

# USAGE
`Developer A`: "Why is this JSON payload costing us so many tokens?"
`Developer B`: "Because we are using long key names like `user_registration_timestamp_utc`. Every character in those keys adds to our token footprint. Let's compress the keys to short terms like `ts` before sending them to the API."

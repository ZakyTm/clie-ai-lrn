---
id: model-provider
title: Model Provider
summary: The host infrastructure that serves model inference, either via cloud-based APIs or local serving engines.
domains:
  - "Section 1 — The Model"
related:
  - model
  - inference
  - model-provider-request
  - token
sources:
  - "https://docs.anthropic.com/en/api/getting-started"
  - "https://github.com/ollama/ollama"
---

The model provider hosts the hardware and software serving the model parameters for inference. Providers are separated into two deployment archetypes:

1.  **Cloud APIs (e.g. Anthropic, OpenAI, Google)**:
    *   *Pros*: Access to frontier models (Claude Opus/Sonnet), high speed, zero hardware setup.
    *   *Cons*: Pay-per-token API bills, data leaves local networks, bound by rate limits (Requests Per Minute - RPM, Tokens Per Minute - TPM), and potential API latency spikes.
2.  **Local Runners (e.g. Ollama, Llama.cpp, LM Studio)**:
    *   *Pros*: Complete privacy, zero cost per token, offline execution.
    *   *Cons*: Constrained to smaller models (e.g. Llama-3-8B) that fit into local GPU VRAM; slow execution on standard consumer CPU RAM.

### Initializing Local vs Cloud Runtimes
A unified agent harness can support switching between providers by abstracting the API endpoint:

```javascript
// Initializing a cloud provider (Anthropic)
const cloudClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Initializing a local provider (Ollama serving Llama-3 locally)
const localClient = new OpenAI({
  baseURL: 'http://localhost:11434/v1',
  apiKey: 'ollama' // placeholder key
});
```

# AVOID
Do not hardcode API keys or cloud-specific headers inside your UI components. Keep them restricted to server-side harnesses.
*   *Avoid*: `const API_KEY = "sk-ant-..."` in a frontend page.
*   *Write*: Use environment variables like `process.env.ANTHROPIC_API_KEY` loaded dynamically at runtime.

# USAGE
`Developer A`: "Our local script is throwing connection timeouts when calling the model."
`Developer B`: "Check the model provider endpoint. If you are running locally on Ollama, make sure the service container is active on port 11434; if you are querying Anthropic, check their API status page for rate-limiting."

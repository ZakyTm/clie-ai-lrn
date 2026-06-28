---
id: stateful
title: Stateful
summary: The operational design where a client application (harness) maintains a persistent record of messages, files, and variables across multiple stateless model queries.
domains:
  - "Section 2 — Model provider request"
related:
  - stateless
  - context
  - model-provider-request
  - session
sources:
  - "https://en.wikipedia.org/wiki/Stateful_protocol"
  - "https://docs.anthropic.com/en/api/messages"
---

Stateful execution is an application design pattern. While AI models are entirely **stateless** (they remember nothing between requests), the software wrapping the model (the client harness) is **stateful** — it stores the conversation history in memory or a database, appends new messages, and compiles the entire log into the prompt context for the next request.

You interface with stateful code when you:
*   Open an IDE chat assistant that tracks your active workspace files.
*   Log into a web chatbot that keeps a sidebar listing your past conversation sessions.
*   Write multi-step agent scripts that track loop counters, file edits, and tool responses.

---

## The Stateful-Stateless Interface

The client harness acts as the "memory bridge" for the model. It translates a user's conversational experience into a sequence of stateless API requests:

```
[ Stateful Client Harness ] (Tracks history, files, variables)
      │
      ├─► Turn 1: Compiles Context ──► [ Stateless API Request ] ──► Model runs weights
      │                                                                    │
      ├─► Turn 2: Appends Turn 1   ──► [ Stateless API Request ] ◄─────────┘
```

If the stateful harness fails to track file edits or system logs, the model's awareness breaks, resulting in hallucinations or duplicated work.

---

## Field Applications

### 1. Fullstack Engineers (Stateful Session Management)
Engineers write class wrappers to maintain session state locally before formatting payloads for the API:

*   *Code Example (Python Session Wrapper)*:
    ```python
    class ChatSession:
        def __init__(self, session_id):
            self.session_id = session_id
            self.messages = [] # Persistent in-memory state
            
        def send_message(self, user_content):
            # 1. Append user message to state
            self.messages.append({"role": "user", "content": user_content})
            
            # 2. Call stateless model
            response = api_client.generate(messages=self.messages)
            
            # 3. Append assistant response to state
            self.messages.append({"role": "assistant", "content": response})
            return response
    ```

# AVOID
Do not rely on the client state to store files or data that are too large. Since every message turn appends the history, stateful harnesses can quickly hit context window limits if they are not managed.
*   *Avoid*: Loading a full database backup into the session state array.
*   *Write*: Save the database locally on disk, and use RAG to query and load only relevant subsets into the active session state.

# USAGE
`Developer A`: "Why is our chatbot forgetting what the user said three messages ago?"
`Developer B`: "Our express server is stateless and doesn't store the session. We need to mount a stateful session store (like Redis) so the handler can fetch and rebuild the message list before sending the request to the provider."

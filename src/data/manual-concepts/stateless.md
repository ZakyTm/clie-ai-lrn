---
id: stateless
title: Stateless
summary: The architectural characteristic of AI models where each API request has no memory of prior queries, requiring the client to send the entire conversation history in every call.
domains:
  - "Section 2 — Model provider request"
related:
  - model
  - context
  - stateful
  - session
sources:
  - "https://en.wikipedia.org/wiki/Stateless_protocol"
  - "https://docs.anthropic.com/en/api/messages"
---

Statelessness is the defining engineering property of LLMs. A model is a frozen file of mathematical parameters. When you send it a request, it runs a forward pass calculation and returns output tokens. Once the connection closes, the model retains absolutely no memory of your prompt, your files, or the conversation.

You manage statelessness whenever you:
*   Build a chatbot interface that needs to "remember" prior messages.
*   Write scripts to feed tool results back to an agent loop.
*   Design user session databases for web apps.

---

## The Stateless Reality

Many users believe that "the AI is learning from our chat as we talk." In reality, every single message bubble in a chat window causes your software to run a completely new API request that packages the *entire history* from the first bubble to the last.

```
Turn 1: User asks "Hi" ──► Client Request: ["Hi"] ──► Model outputs "Hello"
Turn 2: User asks "Who are you?" ──► Client Request: ["Hi", "Hello", "Who are you?"] ──► Model outputs "I am an AI..."
```

If your software failed to append the previous messages to the request, the model would treat Turn 2 as a brand new greeting, completely unaware of Turn 1.

---

## Field Applications

### 1. Fullstack Developers (Managing Chat State)
Because the API is stateless, developers must manage state in their own application database (e.g. Redis, SQLite) and serialize the array of messages for every API request:

*   *Code Example (Node.js Express backend)*:
    ```javascript
    app.post("/chat", async (req, res) => {
      const { sessionId, newMessage } = req.body;
      
      // 1. Fetch chat history from database
      const history = await db.getMessages(sessionId);
      
      // 2. Append new message to history
      history.push({ role: "user", content: newMessage });
      
      // 3. Query the stateless model provider
      const completion = await client.messages.create({
        model: "claude-3-5-haiku",
        messages: history
      });
      
      // 4. Save response to database and send to user
      await db.saveMessage(sessionId, completion.content);
      res.json({ response: completion.content });
    });
    ```

# AVOID
Do not assume that the model will "know" what you are referencing if you don't pass the previous context in your current request.
*   *Avoid*: Sending only `{"role": "user", "content": "Fix the error in that function"}` as the entire request payload after a crash occurred.
*   *Write*: Pack the compiler output, the target function code, and the error logs together into the request context.

# USAGE
`Developer A`: "Our model answers our follow-up questions by saying 'I don't have access to your previous message.' What's wrong?"
`Developer B`: "The model is stateless. We are sending only the latest message in our API request. We need to write a state manager in our code that saves all conversation turns and sends the entire message array on every call."

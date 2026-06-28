---
id: rag
title: Retrieval-Augmented Generation (RAG)
domains:
  - "rag"
  - "embeddings-vectors"
difficulty: intermediate
summary: An architectural pattern that extends a model's knowledge by retrieving relevant snippets from a local document database and injecting them into the context window at query time.
tags:
  - "rag"
  - "vector-search"
  - "context-injection"
sourceRepo: manual
featured: true
related:
  - embeddings
  - vector-databases
sources:
  - "https://arxiv.org/abs/2005.11401"
  - "https://js.langchain.com/v0.2/docs/tutorials/rag/"
---

Retrieval-Augmented Generation (RAG) is a pattern that gives an AI model "open-book" access to your local files so it can answer questions using up-to-date facts, without needing to retrain or fine-tune the model itself.

You see it in action daily when:
*   A slackbot answers customer questions using your private team chat logs.
*   An IDE agent inspects your active codebase directory to diagnose a compile error.
*   A search engine displays summaries with links directly to the source articles.

---

## How It Works (The Technical Layering)

Instead of relying solely on the model's static memory, a RAG system runs a multi-step pipeline for every user request:

1.  **Ingestion (Pre-processing)**: Your documents (PDFs, Markdown files, APIs) are sliced into short, readable paragraphs (chunks).
2.  **Embedding Generation**: Each chunk is passed to an embedding model, which translates its semantic meaning into a list of coordinates (an **Embedding**).
3.  **Vector Indexing**: These embeddings are saved inside a **Vector Database**.
4.  **Query & Retrieval**: When a user asks a question, the harness converts the question into an embedding, searches the vector database for the closest coordinate matches, and retrieves the original text chunks.
5.  **Context Injection**: The harness stuffs the retrieved text passages into the model's **Context Window**, alongside the user's original query.
6.  **Grounded Inference**: The model runs **Inference** on the combined prompt, reading the passages like an open book to generate a factually grounded answer.

```
User Query ──► [ Generate Embedding ] ──► Search Vector DB ──► Retrieve Chunks ──► Inject Context ──► LLM Inference ──► Final Answer
```

---

## Field Applications & Implementation

### 1. Vibe Coders (Formatting the Open-Book Prompt)
When building prototypes, vibe coders write custom context wrappers in prompts to force the model to adhere strictly to the loaded files:

*   *Prompt Example*:
    ```markdown
    You are a technical support assistant. Answer the user's question using ONLY the context provided below. If the answer cannot be found in the context, output "ERROR: UNKNOWN_SPECIFICATION".
    
    [CONTEXT]
    ${retrievedTextChunks}
    
    [USER_QUESTION]
    ${userQuery}
    ```

### 2. Fullstack & AI Engineers (Python Ingestion Snippet)
Engineers write ingestion scripts to connect vector databases (like `pgvector` or `Qdrant`) to the prompt generation loop:

*   *Code Example*:
    ```python
    # Simplified query and retrieval loop
    query_vector = generate_embedding(user_query)
    results = vector_db.search(query_vector, limit=3)
    
    # Compile text chunks into a single context string
    context_block = "\n\n".join([r.text for r in results])
    prompt = f"Context:\n{context_block}\n\nQuestion: {user_query}"
    
    response = model.generate(prompt)
    ```

# AVOID
Do not attempt to fine-tune model parameters just to teach it new facts or documents. It is slow and prone to hallucination.
*   *Avoid*: "Let's fine-tune Llama on our internal wiki pages so it knows our product guidelines."
*   *Write*: "Let's build a RAG pipeline to search the wiki and inject the matching guidelines into the prompt context at query time."

# USAGE
`Developer A`: "Our chatbot is hallucinating product pricing. How do we fix this?"
`Developer B`: "We need to set up a RAG pipeline. We'll index our pricing CSV inside a vector database, query it when a customer asks about costs, and inject the retrieved rates directly into the context window. That turns it into a reading comprehension task."

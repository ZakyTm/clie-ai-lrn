---
id: rag
title: Retrieval-Augmented Generation (RAG)
domains: ["rag", "embeddings-vectors"]
difficulty: intermediate
summary: A pattern that extends LLM capability by retrieving relevant document snippets from a vector database and injecting them into the prompt context at query time.
tags: ["rag", "vector-search", "context-injection"]
sourceRepo: manual
featured: true
related: ["embeddings", "vector-databases"]
resources:
  - id: rag-explainer-1
    type: article
    title: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks"
    url: "https://arxiv.org/abs/2005.11401"
    description: "The original Facebook AI Research paper introducing the RAG architecture."
    sourceRepo: manual
    tags: ["academic-paper", "foundational"]
  - id: rag-langchain-docs
    type: doc
    title: "LangChain RAG Tutorial"
    url: "https://js.langchain.com/v0.2/docs/tutorials/rag/"
    description: "Hands-on guide to building RAG applications in Node.js/TypeScript."
    sourceRepo: manual
    tags: ["tutorial", "code"]
---

# NAME
`RAG` — Retrieval-Augmented Generation

# SYNOPSIS
```
                     +-----------------------+
                     |   User Query / Input  |
                     +-----------+-----------+
                                 |
        +------------------------+------------------------+
        |                                                 |
        v                                                 v
+-------+-------+                               +---------+---------+
|   Embedding   |                               |  LLM Prompt       |
|   Generator   |                               |  Template         |
+-------+-------+                               +---------+---------+
        |                                                 ^
        v                                                 |
+-------+-------+                                         |
|  Vector DB    |--[ retrieves top-k relevant chunks ]----+
|  Search       |
+---------------+
```

# DESCRIPTION
**Retrieval-Augmented Generation (RAG)** is an architectural pattern designed to solve the two biggest limitations of Large Language Models: **knowledge cutoffs** (inability to access post-training data) and **hallucinations** (confidently generating false facts).

Instead of relying solely on the model's parametric memory, a RAG system performs a two-step process:
1. **Retrieval**: Searches an external knowledge base (usually indexed as vector embeddings in a Vector Database) using the user's query to find the most relevant text passages.
2. **Generation**: Appends the retrieved text passages as context into the prompt, instructs the LLM to answer the query *only* using the provided context, and generates the final response.

## Why it matters
Training or fine-tuning models to learn new facts is slow, expensive, and imprecise. RAG turns a factual generation problem into an open-book reading comprehension task. This guarantees that:
- Answers can be cited directly to source documents.
- Information can be updated instantly by adding or deleting files in the database, without retraining the model.
- Access controls can be enforced at the search level (e.g., preventing users from retrieving documents they don't have permission to see).

# SEE ALSO
`embeddings`, `vector-databases`, `context-window`, `lost-in-the-middle`

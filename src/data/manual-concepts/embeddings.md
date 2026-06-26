---
id: embeddings
title: Embeddings
domains: ["embeddings-vectors"]
difficulty: beginner
summary: High-dimensional vector representations of data objects (text, images, audio) that map semantic meaning into a continuous geometric space.
tags: ["embeddings", "vector-space", "semantic-similarity"]
sourceRepo: manual
featured: true
related: ["rag", "vector-databases"]
resources:
  - id: openai-embeddings-blog
    type: article
    title: "Introducing Text and Code Embeddings"
    url: "https://openai.com/index/introducing-text-and-code-embeddings/"
    description: "OpenAI's official release explaining the use cases and mechanics of dense retrieval models."
    sourceRepo: manual
    tags: ["industry-blog", "explanation"]
  - id: huggingface-sentence-transformers
    type: tool
    title: "Sentence Transformers on Hugging Face"
    url: "https://huggingface.co/sentence-transformers"
    description: "The primary Python library for generating local, high-quality sentence embeddings."
    sourceRepo: manual
    tags: ["open-source", "library"]
---

# NAME
`embeddings` — Dense Semantic Vector Mapping

# SYNOPSIS
```
"Kitten" -------------> [ 0.23, -0.45,  0.89, ... (1536 dims) ] --+
                                                                   |  (Cosine similarity is high)
"Cat" ----------------> [ 0.21, -0.42,  0.92, ... (1536 dims) ] --+

"Submarine" ----------> [ -0.78,  0.11, -0.05, ... (1536 dims) ]  (Cosine similarity is low)
```

# DESCRIPTION
An **Embedding** is a representation of an item (like a word, sentence, document, or image) as a dense vector of real numbers. The core principle of embeddings is **geometric alignment**: items that share semantic meaning are placed close to each other in the vector space, while unrelated items are mapped far apart.

## How it works
Deep neural networks are trained on massive datasets to predict context or similarities. During training, the models learn to associate words. For example, "king" and "queen" share many contexts, so their vectors will point in similar directions.

A text embedding model takes a string of text and returns a list of floats (typically 256 to 3072 dimensions).
To find how similar two pieces of text are:
1. Generate the embedding vector for each string.
2. Calculate the **cosine similarity** between the two vectors.
3. A score close to `1.0` indicates high semantic similarity (even if the strings share zero identical words, like "micro-controller" and "embedded processor").

## Applications
- **Semantic Search**: Searching by meaning rather than exact keyword matches.
- **Classification**: Grouping text or images into categories based on vector clusters.
- **Recommendations**: Finding products, articles, or code snippets that map close to the user's current vector representation.

# SEE ALSO
`rag`, `vector-databases`, `cosine-similarity`

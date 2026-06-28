---
id: embeddings
title: Embeddings
domains:
  - "embeddings-vectors"
difficulty: beginner
summary: High-dimensional coordinate lists (vectors) that represent the semantic meaning of text, images, or audio, placing related concepts close to each other in a continuous geometric space.
tags:
  - "embeddings"
  - "vector-space"
  - "semantic-similarity"
sourceRepo: manual
featured: true
related:
  - rag
  - vector-databases
sources:
  - "https://openai.com/index/introducing-text-and-code-embeddings/"
  - "https://huggingface.co/sentence-transformers"
---

An embedding is a list of decimal numbers (called a vector) representing the semantic meaning of a word, sentence, or document. The core principle of embeddings is **geometric alignment**: items that share semantic meaning are placed close to each other in this coordinate space, while unrelated items are mapped far apart.

You see embeddings in action daily when:
*   Searching a library for "automobile" and matching books containing "car" or "vehicle," even if they do not contain the exact word "automobile."
*   Filtering spam by checking if the meaning of an email maps near known phishing scripts.
*   Generating user recommendations (e.g. matching movies whose embedding vectors map close to the movies you've recently watched).

---

## How It Works (The Coordinate Alignment)

An embedding model (like OpenAI's `text-embedding-3-small` or local Hugging Face models) takes a string of text and outputs an array of floats (typically 256 to 3072 dimensions):

*   `Kitten` ──► `[ 0.23, -0.45,  0.89, ... (1536 floats) ]`
*   `Cat` ──► `[ 0.21, -0.42,  0.92, ... (1536 floats) ]`
*   `Submarine` ──► `[ -0.78,  0.11, -0.05, ... (1536 floats) ]`

Notice that `Kitten` and `Cat` have very similar coordinates, while `Submarine` is completely different. 

To determine how similar two pieces of text are, engineers calculate the angle between their coordinates (known as **Cosine Similarity**). A cosine similarity score close to `1.0` indicates high semantic similarity, even if they share zero identical words (e.g., "micro-controller" and "embedded processor").

```
Cosine Similarity = 1.0 (Same Direction / Meaning) ────► Cosine Similarity = 0.0 (Orthogonal / Unrelated)
```

---

## Field Applications & Implementation

### 1. Vibe Coders (Conceptual Mapping)
Vibe coders use embedding search to build search tools that match user questions directly to paragraphs of documentation or code snippets:

*   *Usage Flow*: Convert question to vector ──► Query database ──► Inject closest paragraph matches as context.

### 2. Fullstack & AI Engineers (Generating Local Embeddings)
Engineers use local libraries like Python's `sentence-transformers` to generate embeddings privately, quickly, and at zero cost:

*   *Code Example*:
    ```python
    from sentence_transformers import SentenceTransformer
    import numpy as np
    
    # Load a lightweight local embedding model
    model = SentenceTransformer('all-MiniLM-L6-v2')
    
    # Generate vectors (each vector is an array of 384 floats)
    vector1 = model.encode("Large language models process tokens.")
    vector2 = model.encode("Transformers read sub-word units.")
    vector3 = model.encode("Apple pie recipes require cinnamon.")
    
    # Calculate Cosine Similarity (angle between vectors)
    def cosine_similarity(v1, v2):
        return np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))
    
    print("Similarity (1 vs 2):", cosine_similarity(vector1, vector2)) # High score (~0.7)
    print("Similarity (1 vs 3):", cosine_similarity(vector1, vector3)) # Low score (~0.1)
    ```

# AVOID
Do not use simple keyword matching (like SQL `LIKE` or basic substring queries) when users are searching for conceptual topics. It fails to match synonyms or related ideas.
*   *Avoid*: Searching standard database string tables for "crashes" when a user queries "failures".
*   *Write*: Generate embeddings for the logs and query them using similarity distance to fetch all related anomalies.

# USAGE
`Developer A`: "Our search box matches nothing when users type 'reset login' if the documentation contains 'password recovery'."
`Developer B`: "That's because keyword search is blind to meaning. Let's switch to semantic search using embeddings. We'll index our documentation paragraphs as vectors, convert the user's search query to a vector, and sort results by cosine similarity. It will immediately map those synonyms together."

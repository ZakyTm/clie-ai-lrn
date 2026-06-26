---
id: vector-databases
title: Vector Databases
domains: ["embeddings-vectors", "rag"]
difficulty: intermediate
summary: Specialised database systems designed to store, index, and query high-dimensional vectors using Approximate Nearest Neighbor (ANN) algorithms.
tags: ["vector-db", "hnsw", "approximate-nearest-neighbor"]
sourceRepo: manual
featured: true
related: ["embeddings", "rag"]
resources:
  - id: pgvector-github
    type: github
    title: "pgvector"
    url: "https://github.com/pgvector/pgvector"
    description: "An open-source vector similarity search extension for PostgreSQL."
    sourceRepo: manual
    tags: ["postgres", "extension"]
  - id: qdrant-official
    type: tool
    title: "Qdrant Vector Database"
    url: "https://github.com/qdrant/qdrant"
    description: "A high-performance vector similarity search engine written in Rust."
    sourceRepo: manual
    tags: ["database", "rust"]
---

# NAME
`vector-databases` — High-Dimensional Vector Search Indexes

# SYNOPSIS
```
Query Vector  ---------> [ INDEX GRAPH (e.g. HNSW) ]
                                 |
                                 +---> Path traversal of nodes
                                 |
                                 v
                         Approximate Nearest
                         Neighbors Found
```

# DESCRIPTION
A **Vector Database** is a database designed specifically to manage high-dimensional vector embeddings. While traditional relational databases are optimized for querying structured data (like strings or integers) using indexes like B-Trees, vector databases are designed to search vectors based on their distance (or similarity) metric.

## The Core Challenge
Comparing a query vector against millions of vectors in a database using a brute-force search (linear scan) is too slow for real-time applications (complexity $O(N)$). 
Vector databases solve this by building specialized indexes that enable **Approximate Nearest Neighbor (ANN)** search. ANN indexes trade a tiny amount of recall accuracy for massive performance increases (bringing query complexity down to $O(\log N)$).

## Popular Indexing Algorithms
- **HNSW (Hierarchical Navigable Small World)**: Builds a multi-layer graph index where upper layers have fewer connections (for fast routing) and lower layers have dense connections (for precise search). This is the gold standard for latency.
- **IVF (Inverted File Index)**: Groups vectors into clusters using k-means. Queries only compare vectors in the closest cluster, reducing search space.
- **PQ (Product Quantization)**: Compresses vector dimensions to reduce memory footprint, enabling larger datasets to fit in RAM.

# SEE ALSO
`embeddings`, `rag`, `cosine-similarity`

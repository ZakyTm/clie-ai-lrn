---
id: vector-databases
title: Vector Databases
domains:
  - "embeddings-vectors"
  - "rag"
difficulty: intermediate
summary: Specialized database systems designed to store, index, and query high-dimensional vector embeddings rapidly using Approximate Nearest Neighbor (ANN) search algorithms.
tags:
  - "vector-db"
  - "hnsw"
  - "approximate-nearest-neighbor"
sourceRepo: manual
featured: true
related:
  - embeddings
  - rag
sources:
  - "https://github.com/pgvector/pgvector"
  - "https://github.com/qdrant/qdrant"
---

A vector database is a specialized database system optimized to store, index, and rapidly search through billions of high-dimensional embedding vectors using similarity math, rather than traditional exact-match B-Trees.

You use vector databases to power:
*   **Production RAG Chatbots**: Storing millions of PDF chunks and fetching the top-3 matching passages in under 50ms.
*   **Visual Search Engine**: Searching an catalog of images using an uploaded picture's embedding vector.
*   **Duplicate Detector**: Scanning database entries to find highly similar duplicate items.

---

## How It Works (The Indexing Challenge)

Traditional databases search structured data (like strings or integers) using indexes like B-Trees. But B-Trees fail when comparing high-dimensional floating-point vectors (e.g. 1536 dimensions). 

Comparing a search vector against millions of rows using brute-force search (linear scan) takes seconds — which is too slow for real-time systems. Vector databases solve this by building specialized indexes that enable **Approximate Nearest Neighbor (ANN)** search. ANN indexes trade a tiny fraction of lookup accuracy for massive speedups, bringing search latency down from $O(N)$ to $O(\log N)$.

### Key Indexing Algorithms
*   **HNSW (Hierarchical Navigable Small World)**: Creates a multi-layer graph index. Upper layers have sparse connections (for fast routing across the graph), while lower layers have dense connections (for precise local search). This is the gold standard for latency.
*   **IVF (Inverted File Index)**: Groups vectors into clusters using k-means. The query is compared only to the vectors in the closest cluster, reducing the search space.
*   **PQ (Product Quantization)**: Compresses vector dimensions to shrink their RAM footprint, allowing huge datasets to fit on single machines.

```
Query Vector ──► [ HNSW Graph Navigation (Layer 3 ──► Layer 2 ──► Layer 1) ] ──► Closest Neighbors Returned
```

---

## Field Applications & Implementation

### 1. Vibe Coders (Query Flow)
Vibe coders connect vector databases directly to AI agents using standard connection strings:

*   *Database Selection*: Use **pgvector** if you already use PostgreSQL (adds vector columns to existing tables), or dedicated databases like **Qdrant** or **Milvus** for massive, high-speed scale.

### 2. Fullstack & AI Engineers (Qdrant Python Setup)
Engineers initialize and query collections using similarity search endpoints in Python:

*   *Code Example*:
    ```python
    from qdrant_client import QdrantClient
    from qdrant_client.models import Distance, VectorParams
    
    # Initialize local client
    client = QdrantClient(path="~/qdrant_storage")
    
    # Create a vector collection (matching our 384-dimension embedding model)
    client.create_collection(
        collection_name="documentation",
        vectors_config=VectorParams(size=384, distance=Distance.COSINE)
    )
    
    # Upsert a text chunk vector
    client.upsert(
        collection_name="documentation",
        points=[{
            "id": 1,
            "vector": [0.12, -0.45, 0.89, ...], # 384 dimensions
            "payload": {"text": "Model Context Protocol connects tools."}
        }]
    )
    
    # Search for top-1 closest match
    results = client.search(
        collection_name="documentation",
        query_vector=[0.11, -0.44, 0.90, ...],
        limit=1
    )
    print("Match payload:", results[0].payload)
    ```

# AVOID
Do not load massive vector databases without configuring proper hardware limits (such as RAM allocations). Since graph indexes (HNSW) must live in RAM for fast search, memory consumption scales rapidly with dataset size.
*   *Avoid*: Loading 10M embeddings in a standard HNSW index on a tiny 4GB VM without enabling scalar quantization (compression).
*   *Write*: Configure product quantization or use memory-mapped files (mmap) on vector columns to limit RAM usage.

# USAGE
`Developer A`: "Our RAG chatbot search is taking over 3 seconds when query volume spikes."
`Developer B`: "We are using a brute-force linear search on pgvector. We need to create an HNSW index on our vector column using `CREATE INDEX ON items USING hnsw (embedding vector_cosine_ops);` to convert the search to Approximate Nearest Neighbor. That will drop search latency down to 20ms."

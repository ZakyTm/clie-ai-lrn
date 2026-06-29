# Contributing to Clie-AI-LRN (C-AI-L)

Thank you for your interest in contributing to Clie-AI-LRN! 

## Ways to Contribute

*   **Add or Improve a Concept**: Edit or add files in the `src/data/manual-concepts/` directory (Markdown files).
*   **Add Resources**: Add new high-quality reference links (articles, papers, videos) to the relevant concept file in `src/data/manual-resources/`.
*   **Report a Bug / Request a Feature**: Open a public issue in our repository.

## Branching Strategy & Workflow

*   All active feature development must target the `develop` branch. Pull requests targeted directly at `main` will be closed.
*   The `main` branch is protected and serves as our stable production branch. Cloudflare Pages automatically deploys to production when code is merged into `main`.

## Concept File Format

Each concept page in `src/data/manual-concepts/*.md` must contain the following frontmatter metadata:

```yaml
---
id: "concept-slug"                  # Unique URL slug
title: "Concept Title"
domains: ["rag", "agents"]          # Domain tags
difficulty: "beginner"              # beginner | intermediate | advanced
summary: "One or two sentence description of the concept."
tags: ["tag1", "tag2"]
sourceRepo: "manual"
lastUpdated: "2026-06-29"
featured: false
---

# Your Concept Title

Your description here...
```

## Local Development Setup

To run this project locally, follow these steps:

1.  Clone your fork of the repository:
    ```bash
    git clone https://github.com/YOUR_USERNAME/clie-ai-lrn.git
    cd clie-ai-lrn
    ```
2.  Switch to the `develop` branch:
    ```bash
    git checkout develop
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Parse content and compile JSON database tables:
    ```bash
    node scripts/parse-content.mjs
    ```
5.  Start the Astro local development server:
    ```bash
    npm run dev
    ```

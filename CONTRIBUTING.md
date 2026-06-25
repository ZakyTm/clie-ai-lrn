# Contributing to AI Engineering Hub

Thank you for your interest in contributing to the AI Engineering Hub! 

## Ways to Contribute

*   **Add a Concept**: Open an issue using the "Concept Request" template.
*   **Improve or Fix a Concept**: Submit a Pull Request editing or adding files in the `content/concepts/` directory.
*   **Add Resources**: Add new high-quality reference links (articles, papers, videos) to the relevant concept file.
*   **Report a Bug**: Open an issue using the "Bug Report" template.

## Branching Strategy & Workflow

*   All active feature development must target the `develop` branch. Pull requests targeted directly at `main` will be closed.
*   The `main` branch is protected and serves as our stable production branch. Netlify automatically deploys to production when code is merged into `main`.

## Concept File Format

Each hand-authored concept page in `content/concepts/*.mdx` must contain the following frontmatter:

```yaml
---
id: "your-concept-slug"             # unique URL slug: /knowledge/your-concept-slug
title: "Your Concept Title"
domains: ["rag", "agents"]          # from the canonical domain list
difficulty: "beginner"              # beginner | intermediate | advanced
summary: "One or two sentence description of the concept."
tags: ["tag1", "tag2"]
sourceRepo: "manual"                # use "manual" for hand-written / rewritten definitions
lastUpdated: "2026-06-25"
featured: false                     # set to true to display on the homepage grid
---

## Overview
Your concept description here...
```

## Local Development Setup

To run this project locally, follow these steps:

1.  Clone your fork of the repository:
    ```bash
    git clone https://github.com/YOUR_USERNAME/ai-engineering-hub.git
    cd ai-engineering-hub
    ```
2.  Switch to the `develop` branch:
    ```bash
    git checkout develop
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Run the content sync pipeline to fetch upstream contents:
    ```bash
    bash scripts/sync-content.sh
    ```
5.  Parse content and compile JSON data:
    ```bash
    node scripts/parse-content.mjs
    ```
6.  Start the Astro local development server:
    ```bash
    npm run dev
    ```

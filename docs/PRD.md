# Product Requirements Document (PRD)

## 1. Vision & Concept
The AI Engineering Knowledge Hub (dubbed "The Manual") is a concept-first, highly structured educational directory for AI engineers and full-stack developers. It organizes scattered AI coding patterns, tools, and foundations in a plain-English reference format, cutting through the industry jargon that ships weekly. 

This platform acts as a reference manual, reading like a Unix `man` page crossed with a physical dictionary, wrapped in a developer-focused terminal aesthetic.

## 2. Target Audience
*   Software engineers, full-stack developers, and AI engineers who are looking to understand the mechanics of building robust AI systems.
*   Developers who need a quick, authoritative, and plain-English explanation of emerging AI tooling (like Model Context Protocol, prompt caching, chunking, etc.).

## 3. Product Scope

### 3.1 Product 1: The AI Terms Dictionary (Glossary)
A living, searchable glossary containing definitions of modern AI engineering vocabulary. 
*   **Key Feature**: An interactive terminal REPL search on the homepage.
*   **Content Model**: Each term is structured like a Unix man-page with the sections: NAME, SYNOPSIS (description), DESCRIPTION (prose detail), AVOID (anti-patterns), USAGE (dialogue example), and SEE ALSO (cross-links).
*   **Legal boundary**: All terms must be rephrased in our own words and cite their canonical primary source before any public deployment.

### 3.2 Product 2: The Learning Path (Curriculum)
A structured, step-by-step roadmap that details the path to becoming an AI engineer.
*   **Key Feature**: Exposing 20 phases and 500+ practical lessons (derived from Rohit's MIT course).
*   **Progress Tracking**: Users can track their completed lessons locally in their browser.

## 4. Key Constraints & Non-Goals
*   **Zero-DB Constraint**: The site must have no backend database (e.g. no Supabase, PostgreSQL, MongoDB, or Firebase). All search and progress tracking must run entirely on the client/browser using JSON outputs compiled at build time.
*   **No Authentication**: There is no user registration or login system.
*   **Static Generation**: The site must build to static HTML files for hosting on Netlify or Cloudflare Pages, maintaining fast load times (<120ms transitions).

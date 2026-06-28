# System Architecture

## 1. System Stack & Tooling
The project is built as a static website requiring no server-side execution:
*   **Static Site Generator**: Astro `v7.x` (enforcing ESM compilation modules).
*   **CSS Utility Framework**: Tailwind CSS `v4.x` (utilizing the new Vite-native configuration plugin).
*   **Runtime Environment**: Node.js `v22.x`/`v24.x`.
*   **Markdown Processor**: `marked` (npm module used to parse markdown into safe HTML strings).

## 2. Ingestion Pipeline
The content pipeline extracts, structures, and outputs content during build time using [`scripts/parse-content.mjs`](file:///C:/Users/HP/Desktop/open%20sourse%20arg/scripts/parse-content.mjs):
1.  **Reads Manual Sources**: Parses custom markdown files with YAML frontmatter from `src/data/manual-concepts/`.
2.  **Ingests Dictionary Reference**: Reads the monolithic `README.md` from `content/upstream/dictionary-of-ai-coding/`, splits it into terms, and maps them to their respective sections. If a term slug has a manual file override, the manual version takes precedence.
3.  **Parses Curriculum Files**: Recursively walks `content/upstream/ai-engineering-from-scratch/phases/`, reads `docs/en.md` for each lesson, extracts difficulty metadata, and parses external links as resources.
4.  **Generates JSON Databases**: Outputs structured data into `src/data/`.

## 3. Data Storage & JSON Database Schema
The database consists of static JSON files under `src/data/`:

### 3.1 `terms.json`
Represents the AI Dictionary terms.
```typescript
interface Term {
  id: string;               // Unique kebab-cased slug
  title: string;            // Term title (e.g. "Context window")
  summary: string;          // 1-2 sentence synopsis
  body: string;             // Detailed description in Markdown
  avoid?: string;           // Optional anti-pattern warning
  usage?: string;           // Optional usage dialogue example
  related: string[];        // Array of related term IDs
  section: string;          // Section name (e.g. "Section 1 — The Model")
  readTimeMinutes: number;  // Computed read time
  sourceRepo: "manual" | "reference"; // Indicates if rephrased
  lastUpdated: string;      // ISO Timestamp
}
```

### 3.2 `curriculum.json`
Represents the educational roadmap.
```typescript
interface Phase {
  id: string;               // e.g. "00-setup-and-tooling"
  title: string;            // Phase title
  order: number;            // Sort order
  lessons: Lesson[];
}

interface Lesson {
  id: string;               // e.g. "lesson-dev-environment"
  title: string;            // Lesson title
  phaseId: string;          // Reference to parent Phase
  difficulty: "beginner" | "intermediate" | "advanced";
  summary: string;          // Quick overview
  body: string;             // Complete Markdown lesson text
  resources: string[];      // Array of external resource IDs
  readTimeMinutes: number;  // Estimated read time
}
```

### 3.3 `resources.json`
Represents external links.
```typescript
interface Resource {
  id: string;
  type: "github" | "article" | "video" | "paper" | "tool" | "doc";
  title: string;
  url: string;
  description?: string;
  sourceRepo: string;
  tags: string[];
  addedAt: string;
}
```

### 3.4 `build-meta.json`
```typescript
interface BuildMeta {
  lastSynced: string;
  termCount: number;
  phaseCount: number;
  lessonCount: number;
  resourceCount: number;
}
```

## 4. Static Page Compilation Flow
Astro builds the files statically into `dist/`:
*   `/` — Renders `index.astro` (Terminal REPL search console).
*   `/curriculum` — Renders the structured learning roadmap of phases and lessons.
*   `/term/[slug]` — Pre-renders a man-page detail view for each term in `terms.json` (dynamic route using `getStaticPaths`).
*   `/glossary` — Full dictionary listing by section.

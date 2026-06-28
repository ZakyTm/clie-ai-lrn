# Current State

## 1. Project Overview & Context
The project has successfully established a local MVP build of "The Manual". It operates as a local static Astro site and utilizes build-time JSON compilation to support browser-side lookup tables.

## 2. Completed Milestones (P0)
*   **Dev Ingestion Pipeline**: Ingestion script `parse-content.mjs` is fully functional and Windows-safe (CRLF stripping).
*   **Static Build Verification**: Local static compilation (`npm run build`) is fully verified, outputting 628 pages.
*   **Design & Theme**: The global stylesheet `global.css` is implemented, supporting dual-theme configurations (dark phosphor terminal and light paper dictionary) alongside self-hosted fonts.
*   **Routing Layouts**: The layouts (`Base.astro`), layout parts (`Header.astro`, `Footer.astro`, `Breadcrumb.astro`), and presentation cards are fully functional.
*   **Pass 1: Section 1 Rewrite**: Rephrased the first 9 terms of the dictionary (AI, Model, Parameters, Training, Inference, Token, Next-token prediction, Non-determinism, Model provider) in our own voice and added canonical citations.
*   **Pass 2: Sections 2-4 Rewrite**: Rephrased 20 terms covering requests, caching, statelessness, stateful harnesses, execution environments, tools, permissions, sandboxing, and failures (sycophancy, hallucination) with simplified technical structures.
*   **Pass 3: Sections 5-11 Rewrite**: Rephrased the remaining 42 terms of the dictionary covering memory compression, progressive disclosure, agent-experience (AX) design, Socratic grilling/prototyping, and vibe-coding. The reference dictionary is now 100% manually overridden and rephrased.
*   **Global Hotkey Search (CMD+K)**: Designed and integrated a glassmorphic overlay search modal accessible from anywhere on the site via Ctrl+K, Cmd+K, or Slash key, enabling instant routing to dictionary terms or curriculum lessons.
*   **Interactive Search & Progress UI**: Fixed glossary section sorting, implemented a typewriter loop that cycles 10 terms in the homepage console input, added per-phase visual progress bars, integrated a top header search icon toggle, and corrected CSS accent background fills.
*   **Homepage Symmetrical Gateway & Live Stars**: Redesigned the homepage into a balanced, clean dual-pillar gateway structure (AI Coding Dictionary and Learning Curriculum with client-side progress metrics), aligned featured concepts into a 5-column responsive ribbon, replaced the theme toggle button with a monospace CRT/PAPER badge, and wired dynamic GitHub stars fetching.
*   **Feature B (Local CLI lookup tool)**: Built and registered a local terminal executable CLI utility `man-ai` (`bin/cli.mjs`) supporting command-line concept searches, alphabetized listings (`--list`), help outputs, and retro Unix `man` page formatting with ANSI colorizations.
*   **Feature C (Developer Prompt Templates & Socratic Quiz Prompter)**: Added Socratic clipboard quiz prompt builders (`[QUIZ_ME_PROMPT 📋]`) to all 73 glossary terms and 503 curriculum lessons. Implemented a Developer Prompt Templates library under `/interview-prep` featuring copy-paste Socratic Coding Partner, Context Compactor, and Sandbox Validator instructions.
*   **Feature D (Interactive Glossary Quizzes & 'Plugin' Concept)**: Added a new glossary term `plugins` mapping the architecture differences between MCP, skills, agents, and plugins. Built a fully interactive 3-question Socratic multiple-choice quiz component for all 73 glossary terms with local storage completion checks, mastery header badges, and visual title stars.

## 3. Active Branch & Version Status
*   **Active Working Branch**: `develop` (all Phase 0 & 1 changes staged and committed).
*   **Production Branch**: `main` (protected, never commit directly).
*   **Version**: `0.2.1`.

## 4. Local Ingested Reference Repositories
The following directories are cloned inside `content/upstream/` and gitignored:
*   `content/upstream/ai-engineering-from-scratch/` — Used to parse the curriculum phases, lessons, and external links.
*   `content/upstream/dictionary-of-ai-coding/` — Ingested as the reference dictionary source inside `parse-content.mjs`.

## 5. Active Database Statistics
The build-time parser compiles content into the following counts under `src/data/`:
*   **Dictionary Terms**: **71 terms** (71 manually rewritten and rephrased with canonical sources, 0 reference terms pending rewrite).
*   **Curriculum Phases**: **20 phases** (mapped from `00-setup-and-tooling` to `19-capstone-projects`).
*   **Curriculum Lessons**: **503 lessons** (individual lessons extracted from `en.md` files).
*   **Parsed Resources**: **2,246 resources** (external references, links, and libraries extracted from curriculum documents).

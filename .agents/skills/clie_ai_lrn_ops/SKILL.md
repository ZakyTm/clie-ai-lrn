---
name: clie-ai-lrn-ops
description: Operations guide for building, compiling, and maintaining the Clie-AI-LRN static dictionary and learning curriculum.
---

# Clie-AI-LRN Operational Skill

Use this skill when modifying, maintaining, compiling, or deploying the **Clie-AI-LRN (C-AI-L)** repository. It outlines the codebase architecture, pipeline compilation steps, custom scripts, security safeguards, and deployment guidelines.

---

## 🏛️ 1. Architecture Constraints

*   **Static-First Generation**: Built entirely on **Astro** and **Tailwind CSS v4**.
*   **Zero-Database / Zero-Auth**: Absolutely no backend databases (Supabase, Postgres, Firebase, etc.) or user login systems are allowed.
*   **Local State**: All persistent interactive features (like Socratic quiz scoring and curriculum checklists) must be saved client-side using `localStorage`.

---

## ⚙️ 2. The Content Sync & Parse Pipeline

The website compiles dynamic glossary lists and phases from local files and remote repositories. The pipeline operates in two sequential stages:

```
[Remote Repositories] --(sync-content.mjs)--> [content/upstream/]
                                                    |
[src/data/manual-concepts/] --(parse-content.mjs)--> [src/data/terms.json]
                                                    |
                                              (astro build)
                                                    |
                                           [dist/ (Static Site)]
```

### 1. Ingestion / Sync Stage
Upstream curriculum sources are fetched using Node's native git subprocessing:
```bash
node ./scripts/sync-content.mjs
```
*   Clones/pulls `ai-engineering-from-scratch` (curriculum) and `dictionary-of-ai-coding` (reference concepts) into the ignored `content/upstream/` directory.

### 2. Compilation / Parse Stage
Converts markdown and metadata into clean JSON database structures:
```bash
node ./scripts/parse-content.mjs
```
*   Compiles `src/data/manual-concepts/` (highest priority) and `content/upstream/` concepts into `src/data/terms.json`, `src/data/curriculum.json`, `src/data/resources.json`, and `src/data/build-meta.json`.

### 3. Production Build
Chains everything together in one command:
```bash
npm run build
```

---

## 📚 3. Adding New Glossary Concepts

To add a new plain-English dictionary concept:
1.  Create a markdown file at `src/data/manual-concepts/your-term-slug.md`.
2.  Provide the required YAML frontmatter block:
    ```yaml
    ---
    id: "your-term-slug"
    title: "Your Term Title"
    domains: ["rag", "agents", "infrastructure"]  # Categorization tags
    difficulty: "beginner"                       # beginner | intermediate | advanced
    summary: "A brief, one-sentence description of the concept."
    tags: ["llm", "pipeline"]
    sourceRepo: "manual"
    lastUpdated: "2026-06-30"
    featured: false                              # Set true to pin on the homepage grid
    ---
    ```
3.  Include an optional `# AVOID` and `# USAGE` heading at the bottom of the file. The parser will split these automatically to populate the warning cards in the UI.

---

## 🔒 4. Git Security & Ignored Contexts

To maintain a clean, professional open-source profile, configuration files containing agent metadata or custom memories must **never** be committed to the public history.

*   **Ignored Files**: Ensure `CLAUDE.md` and `AGENTS.md` are added to your [`.gitignore`](file:///.gitignore).
*   **Emergency Untracking**: If an ignored file is accidentally tracked, run:
    ```bash
    git rm --cached CLAUDE.md AGENTS.md
    git commit -m "chore: remove untracked local guidelines from git history"
    ```

---

## ☁️ 5. Cloudflare Pages Settings

Deployments are automated through Cloudflare Pages connected to the GitHub repository:

*   **Target Branch**: `main` (builds production website) & `develop` (builds private preview URLs).
*   **Build Command**: `npm run build` (This automatically triggers the sync and parse chain before compiling the static site).
*   **Output Directory**: `dist`
*   **Environment Variable**: You must configure the environment variable `NODE_VERSION` set to `22.x` in the Cloudflare dashboard to enable modern static compilation features.
*   **Free Tier Advantages**: Pages hosts static builds with **unlimited bandwidth and visits**. There is no daily request limit.

---

## 🏷️ 6. Releases & SemVer Guidelines

Only publish a new version release on GitHub when making structural code upgrades:
*   **GitHub Release Tag**: Bump version (e.g. `v0.2.1` -> `v0.2.2`) when:
    *   Adding a new feature (like a study guide page).
    *   Fixing a software bug (like CSS layout shifting or keyboard scrolling issues).
*   **Text/Glossary Changes**: Merging glossary corrections or typos should be committed directly to `main` without generating a new GitHub Release version.

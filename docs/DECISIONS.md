# Architectural Decisions Log

## 1. Locked Decisions Log

### 1.1 Decision D-01: Two Products, Glossary First
*   **Decision**: Split the project scope into two separate products, building and launching the Glossary (Product 1) before releasing the Curriculum (Product 2).
*   **Rationale**: Focuses early development on a clear, constrained vocabulary set first. The Curriculum will subsequently build on top of the Glossary's terms.

### 1.2 Decision D-02: Bespoke Visual Identity Over Default Layouts
*   **Decision**: Styled the project like a printed dictionary crossed with a Unix `man` page under `pi.dev` terminal chrome. Reject the standard "indigo-accented Vercel/Linear documentation layout".
*   **Rationale**: Establishes a unique, hacker-focused developer appeal that aligns with the manual's technical tone.

### 1.3 Decision D-03: Separation of Ingestion Repos (Local Clones Only)
*   **Decision**: Keep cloned reference repositories inside `content/upstream/` and strictly exclude them from Git via `.gitignore`.
*   **Rationale**: Prevents accidental republishing of unlicensed third-party text (like ZakyTm's dictionary). Only hand-authored, rephrased files (stored in `src/data/manual-concepts/`) or MIT-licensed files are allowed in version control.

### 1.4 Decision D-04: Static Build Database Over Live Server Database
*   **Decision**: Ingest and compile all markdown files into static JSON database files at build time, using client-side JavaScript for search.
*   **Rationale**: Retains the zero-database, zero-auth system constraint. This keeps hosting simple, cost-free, and highly performant on CDNs (Netlify/Cloudflare).

### 1.5 Decision D-05: Bespoke Custom Layout CSS (No Tailwind)
*   **Decision**: Adopted raw CSS variables and layout classes in `global.css` for custom elements.
*   **Rationale**: A bespoke design system requires precise control over layout rules, terminal styles, and serif fonts, which utility classes tend to clutter. *(Note: Tailwind v4 was subsequently added to help build presenting pages, but the core visual tokens remain custom-configured in `global.css`.)*

### 1.6 Decision D-06: Three Fonts Selection & Layout Roles
*   **Decision**: Use `Space Grotesk` for titles, `Newsreader` (serif) for definition paragraphs, and `JetBrains Mono` for code and console labels.
*   **Rationale**: The juxtaposition of readable serif body text inside a terminal mono shell establishes a high-quality "printed handbook" aesthetic.

### 1.7 Decision D-07: Auto Light/Dark Themes & Selectors
*   **Decision**: Set up a custom `data-theme` selector with blocking theme pre-initialization scripts in the `<head>` block, referencing `localStorage` or OS media query defaults.
*   **Rationale**: Prevents a flash of light background (FOUC) when loading the site in dark mode.

### 1.8 Decision D-08: Terminal REPL Interactive Search Bar
*   **Decision**: The homepage hero is an interactive search bar structured like a shell prompt (`$ man ai/`). It uses an animated typing reveal on load and supports full arrow key suggestions navigation.
*   **Rationale**: Acts as the signature interaction hook that brings the Unix terminal theme to life.

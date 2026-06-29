<p align="center">
  <!-- Site-brand SVG monogram (C + A + I + L) — matches clie-ai-lrn.pages.dev -->
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="64" height="64" fill="none">
    <style>
      .accent { stroke: #6a9fcc; }
      .body { stroke: currentColor; }
      @media (prefers-color-scheme: dark) {
        .body { stroke: #ebe7e4; }
      }
      @media (prefers-color-scheme: light) {
        .body { stroke: #252f3d; }
      }
    </style>
    <path d="M 34 8 H 12 V 28 H 34" class="accent" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M 12 28 V 38 H 38" class="accent" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M 16 25 L 23 11 L 30 25" class="body" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M 20 20 H 26" class="body" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M 34 13 V 25" class="body" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M 31 13 H 37" class="body" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M 31 25 H 37" class="body" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</p>

<p align="center">
  <code><b>CLIE_AI_LRN</b> v0.2.1</code><br>
  <i>A structured, plain-English dictionary of AI engineering concepts<br>and a step-by-step curriculum roadmap.</i>
</p>

<p align="center">
  <a href="https://clie-ai-lrn.pages.dev"><b>[VISIT_LIVE_MANUAL]</b></a>
  &nbsp;&nbsp;
  <a href="./CONTRIBUTING.md"><b>[CONTRIBUTING]</b></a>
  &nbsp;&nbsp;
  <a href="./LICENSE"><b>[GPL-3.0]</b></a>
</p>

<br>

**`// OVERVIEW`**

An open-source, plain-English reference for AI engineering concepts — designed like a printed dictionary crossed with a Unix `man` page under a retro phosphor terminal. Ships as a static Astro site and a command-line CLI lookup tool.

- **Static site** — deploy to Cloudflare Pages, Netlify, or any static host.
- **Local CLI** — query definitions directly from your shell (`man-ai <concept>`).
- **GPL-3.0** — free and open-source, immune to commercial paywall extraction.

<br>

**`// QUICKSTART`**

```bash
git clone https://github.com/ZakyTm/clie-ai-lrn.git
cd clie-ai-lrn
npm install
node scripts/parse-content.mjs   # build the dictionary database
npm run dev                       # start dev server at localhost:4321
```

Static build for production:

```bash
npm run build                     # output in dist/
```

<br>

**`// CLI — MAN-AI`**

The entire dictionary is packaged as a local command-line tool.

```
$ man-ai <concept-slug>
$ man-ai --list
$ man-ai --help
```

```bash
npm run cli rag                   # display manual page for RAG
npm run cli subagent              # display manual page for subagents
npm run cli -- --list             # list all compiled terms
```

On an exact miss the CLI runs a fuzzy search and suggests the closest matches.

<br>

**`// FEATURES`**

- **[01] DICTIONARY GATEWAY** — symmetrical split between glossary index (`/glossary`) and curriculum roadmap (`/curriculum`).
- **[02] PROGRESS TRACKING** — per-phase checkboxes persisted in `localStorage` with real-time progress bars.
- **[03] SOCRATIC QUIZZES** — every glossary term includes a 3-question client-side validation test (conceptual, architecture, debugging). Mastery unlocks a star badge and updates global curriculum progress.
- **[04] EDIT ON GITHUB** — direct edit links on every term and lesson page for immediate crowdsourced improvements.
- **[05] THEME Toggle** — phosphor CRT (dark) and paper dictionary (light) modes with preference persistence.
- **[06] TERMINAL REPL** — live autocomplete search console on the homepage with typewriter placeholder effect.

<br>

**`// SECTIONS`**

| § | Section | Terms |
|---|---------|-------|
| 01 | The Model & Parameters | 12 |
| 02 | Tokenization & Embedding | 8 |
| 03 | Attention & Context | 7 |
| 04 | Output & Sampling | 6 |
| 05 | Parametric & Contextual Memory | 8 |
| 06 | Retrieval-Augmented Generation | 5 |
| 07 | Tools & Function Calling | 6 |
| 08 | Multi-Agent Orchestration | 7 |
| 09 | Skills, Subagents & Review | 7 |
| 10 | Performance & Quality Assurance | 7 |

<br>

**`// CONTRIBUTING`**

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full guide.

Quick summary: fork → branch from `develop` → add or edit concept files in `src/data/manual-concepts/` → PR targeting `ZakyTm:develop`.

```
┌───────────────────────────────────────────────────────────┐
│  // CONTRIBUTION_REQUIREMENTS                              │
│                                                           │
│  [01] File: src/data/manual-concepts/<slug>.md             │
│  [02] Frontmatter: id, title, domains, summary, tags       │
│  [03] Sections: body, AVOID, USAGE                         │
│  [04] Target: develop branch                               │
└───────────────────────────────────────────────────────────┘
```

<br>

**`// SUPPORT`**

Built and maintained as a public good. The creator is an independent developer dedicating full-time effort to this open-source reference library, and is open to new roles and consulting opportunities.

```
┌─────────────────────────────────────────────────────────────┐
│  // SUPPORT_THE_PROJECT                                      │
│                                                             │
│  PayPal: https://www.paypal.com/cgi-bin/webscr               │
│          ?cmd=_donations&business=zktoumiproff@gmail.com     │
│                                                             │
│  Direct: zktoumiproff@gmail.com                             │
└─────────────────────────────────────────────────────────────┘
```

<br>

**`// LICENSE`**

GNU General Public License v3.0 (or later). See [LICENSE](./LICENSE).

- **No commercial hijacking** — forks and redistributions must stay open under GPL-3.0. Cannot wrap in a proprietary paywall.
- **Dual-licensing available** — contact the author for closed-source commercial use.
- **Contributor terms** — by contributing you grant joint copyright to relicense modifications (enabling potential commercial dual-licensing to fund the project).

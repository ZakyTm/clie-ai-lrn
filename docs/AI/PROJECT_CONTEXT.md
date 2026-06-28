# AI Project Context & Agent Instructions

## 1. Project Philosophy & Vision
*   **Concept-First Directory**: The hub is designed to turn noisy, scattered AI jargon into clear, structured, and authoritative developer knowledge.
*   **The Manual Metaphor**: Explanations must read like a Unix `man` page crossed with a physical dictionary—terse, plain-English, objective, and clear.
*   **Legal Compliance**: AI agents must never stage or commit copyright-unlicensed text (specifically ZakyTm's glossary terms). Any terms pushed to Git must be rephrased and verified under `src/data/manual-concepts/`.

## 2. AI Collaboration Rules & Workflow
Before making any significant code or style changes, the AI agent must:
1.  Read `docs/CURRENT_STATE.md` to see what is built.
2.  Read `docs/ARCHITECTURE.md` to understand system data flows.
3.  Read `docs/DECISIONS.md` to prevent re-litigating locked design choices.
4.  Propose a clear, structured implementation plan in the chat window.
5.  Wait for explicit approval from the developer.
6.  Only implement changes that were approved, keeping edits focused.
7.  Update the relevant files under `docs/` (such as `docs/CURRENT_STATE.md`) after the changes are complete.

## 3. Reference Boundaries
*   Content parsing is handled strictly by `scripts/parse-content.mjs`. Do not write hardcoded content blocks inside Astro page components.
*   Local clones inside `content/upstream/` are gitignored and serve as reference data for the parser. Do not track these in version control.
*   Bespoke styling resides in `src/styles/global.css`. All new components must align with the custom typography (Space Grotesk display, Newsreader serif body, JetBrains Mono labels) and layout guidelines.

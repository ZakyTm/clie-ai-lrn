# AGENTS.md

## About the Project
An open-source educational platform that organizes and visualizes AI engineering knowledge. It acts as a plain-English concept directory ("The Manual") and learning roadmap, separated into a searchable dictionary and a structured curriculum. See [docs/PRD.md](file:///C:/Users/HP/Desktop/open%20sourse%20arg/docs/PRD.md).

## Stack & Hard Constraints
- **Core**: Astro static generator (zero-database, zero-auth).
- **Styling**: Tailwind CSS v4 + custom CSS variables.
- **Constraints**: No backend databases (no Supabase, Postgres, MongoDB, Firebase). No user authentication. No hardcoded content in UI components (content lives in `knowledge/` or is parsed by `scripts/parse-content.mjs`). See [docs/ARCHITECTURE.md](file:///C:/Users/HP/Desktop/open%20sourse%20arg/docs/ARCHITECTURE.md) and [docs/DECISIONS.md](file:///C:/Users/HP/Desktop/open%20sourse%20arg/docs/DECISIONS.md).

## Mandatory Agent Workflow
Before making any significant change to code, styling, or structures, you MUST follow this workflow:
1. **Read**: Review [docs/CURRENT_STATE.md](file:///C:/Users/HP/Desktop/open%20sourse%20arg/docs/CURRENT_STATE.md), [docs/ARCHITECTURE.md](file:///C:/Users/HP/Desktop/open%20sourse%20arg/docs/ARCHITECTURE.md), and [docs/DECISIONS.md](file:///C:/Users/HP/Desktop/open%20sourse%20arg/docs/DECISIONS.md) in that order.
2. **Propose**: Write out a clear plan describing what you intend to do.
3. **Wait**: Stop calling tools and wait for explicit approval from the developer.
4. **Implement**: Modify only what was approved, following the design system in [docs/PDD.md](file:///C:/Users/HP/Desktop/open%20sourse%20arg/docs/PDD.md).
5. **Update Docs**: Refactor [docs/CURRENT_STATE.md](file:///C:/Users/HP/Desktop/open%20sourse%20arg/docs/CURRENT_STATE.md) and other docs to reflect the new state.

See the full AI collaboration details in [docs/AI/PROJECT_CONTEXT.md](file:///C:/Users/HP/Desktop/open%20sourse%20arg/docs/AI/PROJECT_CONTEXT.md).

## Folder Structure
- `src/` — Astro layout, routing, pages, and components presentation.
- `knowledge/` — Educational content source documents (Markdown + JSON).
- `docs/` — Core project specifications, architecture, and roadmap tracking.
- `public/` — Static assets and global favicon icons.

## Development Server
When starting the dev server, use background mode:
```bash
astro dev --background
```
Manage it with `astro dev stop`, `astro dev status`, and `astro dev logs`.

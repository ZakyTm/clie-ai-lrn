---
id: context-pointer
title: Context Pointer
summary: A reference path or URL link in one document pointing to another, allowing the agent to load the detail only when the task requires it.
domains:
  - "Section 8 — Autocompact"
related:
  - progressive-disclosure
  - context
  - agentsmd
  - tool
sources:
  - "https://en.wikipedia.org/wiki/Pointer_(computer_science)"
  - "https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching"
---

A context pointer (or reference pointer) is a file path, markdown link, or symbol reference inside a prompt that tells the agent where to find detailed information. It is the core building block of **Progressive Disclosure**.

You write context pointers whenever you:
*   Reference style guides in `AGENTS.md` (e.g. `For styling rules, see docs/styling.md`).
*   Include file links in task descriptions (e.g. `Implement the interface defined in src/types/user.ts`).
*   Map a secondary summary back to its primary source (e.g. `Summary of transcript: session-123.jsonl`).

---

## Why Pointers Save Tokens

A pointer acts like a reference variable in programming: it occupies a few bytes in memory (a single line in the prompt context) but points to a huge block of data. The model only pays the cost of reading the full data when it decides to follow the pointer using a tool (like `view_file` or `read_url`).

To work effectively, a context pointer needs two parts:
1.  **A Stable Path**: An exact relative path (e.g. `src/api/auth.ts`) so the agent can load it programmatically.
2.  **A Description**: A clear explanation of *when* to follow it, matching the agent's task goals. A bare path without a description will be ignored.

```
AGENTS.md: "For API error handling, see src/errors.ts" (Context Pointer - 1 line)
                                    │
                                    ▼ (Task matches)
Agent runs tool: [ view_file src/errors.ts ] ──► Loads full file content
```

---

## Field Applications

### 1. Fullstack Developers (Structuring Pointers in Specs)
When writing checklists for an agent, engineers use explicit paths to guide the tool calls:
*   *Pointer Example*: "Configure the database credentials. Read the example setup first: `config/database.example.json`."

# AVOID
Do not use vague, descriptive pointer lines that do not include stable file paths or folders.
*   *Avoid*: "Check the database folder for details."
*   *Write*: "For database configuration settings, read the schemas in `src/db/schema.ts`."

# USAGE
`Developer A`: "The agent didn't follow the styling rules even though I mentioned them in my prompt."
`Developer B`: "You wrote 'see the styles'. That's a blind pointer. The model didn't know which file to load. Let's change the prompt to 'For styling conventions, read the class rules in `src/styles/global.css` first'. The model will immediately invoke the read tool on that path."

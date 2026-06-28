---
id: skill
title: Skill
summary: A pre-packaged, teachable capability (instructions, scripts, templates) loaded into the context window dynamically using progressive disclosure.
domains:
  - "Section 9 — Skills and Subagents"
related:
  - progressive-disclosure
  - context-pointer
  - agentsmd
  - tool
sources:
  - "https://agentskills.io"
  - "https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching"
---

A skill is a modular, pre-packaged capability designed to teach an agent how to handle a specific type of task (e.g. running database migrations, scaffolding boilerplate components, or executing deployments). 

Instead of loading all your project guides into the starting prompt up front (which wastes tokens), the harness lists only the names and short summaries of available skills, loading the full instructions dynamically only when a task matches.

You interact with skills whenever you:
*   Configure specialized instructions inside a `.agents/skills/` directory.
*   Import third-party agent packages (like standard git or database tools).
*   Structure developer runbooks so they load on demand.

---

## Anatomy of a Skill Package

Following standard specifications (such as `agentskills.io`), a skill is organized as a folder in your environment containing:

1.  **`SKILL.md` (Metadata & Instructions)**: Contains a title, description, and the step-by-step markdown instructions.
2.  **Scripts (Optional)**: Helper scripts (Bash, Python, Node) the agent is allowed to execute while running the skill.
3.  **Resources (Optional)**: Reference templates and examples the instructions cite.

### Skill Activation Flow
*   **Startup**: Harness loads: `Deploy Skill: Deploy project files to Cloudflare` (20 tokens).
*   **Trigger**: User queries: "Deploy current changes."
*   **Activation**: Harness detects the match and imports the full `deploy_runbook.md` instructions (3,000 tokens) into the context window.
*   **Result**: The agent runs the deployment successfully, without paying for the deploy instructions during daily coding chats.

---

## Field Applications

Developers write custom skills to keep their standing briefs (`AGENTS.md`) clean:
*   *File Structure*: Create `skills/deploy/SKILL.md` and save the runbook there.
*   *Standing Brief Link*: In `AGENTS.md`, write: `For deployment tasks, trigger the deploy skill`.

# AVOID
Do not inline long, task-specific instructions (like deployment tutorials or styling frameworks) directly inside your global system prompt.
*   *Avoid*: Pasting your full 50-step deployment checklist into every system prompt.
*   *Write*: Bundle the checklist as a `deploy` skill, loading it only when the user requests a deployment.

# USAGE
`Developer A`: "Our startup brief is bloated because we added deployment, database, and auth guidelines all in one file."
`Developer B`: "We need to break them into separate skills. We'll package each guideline inside a `.agents/skills/` folder. The harness will only load the summaries, fetching the full checklist tokens only when we run that specific task."

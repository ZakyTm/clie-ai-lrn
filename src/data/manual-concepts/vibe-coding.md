---
id: vibe-coding
title: Vibe Coding
summary: A working pattern where the developer accepts the agent's code modifications blindly without conducting code diff reviews, judging progress strictly by runtime behavior.
domains:
  - "Section 10 — Human and Vibe review"
related:
  - human-review
  - automated-check
  - prototyping
sources:
  - "https://x.com/karpathy/status/1886192184808149383"
---

Vibe coding is a development pattern where you focus entirely on natural language prompts, accept the generated code modifications blindly without reading the git diffs, and judge progress strictly by compiling and running the app. 

The term was coined by Andrej Karpathy in early 2025: you *"fully give in to the vibes"* and *"forget that the code even exists,"* driving application features through chat iterations.

You participate in vibe coding whenever you:
*   Build a quick prototype by prompting v0 or Lovable and clicking through the visual tabs.
*   Write one-off script macros to extract text, running them immediately without reading the lines of code.
*   Build personal landing pages, styling templates, or demo assets where security is not a concern.

---

## The Trade-off: Velocity vs. Debt

Vibe coding trades inspection for sheer speed. Reading and reviewing git diffs is the slowest step in AI-driven development. Wiping out the review step removes the bottleneck:

*   **When It Works (Low-Stakes)**: Prototypes, styling mockups, temporary data migrations, or internal dev tools where errors are cheap and easy to throw away.
*   **The Debt Risk (High-Stakes)**: Over time, vibe-coded changes accumulate into a codebase that *no human has ever read*. If behavior is the only thing checked, silent bugs like API key leaks in logs, unhandled edge cases, or memory leaks will ship to production undetected.

```
Vibe Coding ──► Skip Review ──► Maximum Speed ──► Unread Code Base (High Technical Debt)
```

In a pure vibe coding loop, you rely entirely on **Automated Checks** (typechecks, linter, tests) to guard code quality, since human verification has been removed.

---

## Field Applications

Vibe coding is excellent for **Prototyping** and exploration. It lets non-programmers or product managers build functional MVPs in minutes. But for long-lived enterprise software, vibe-coded assets must pass through **Human Review** before being merged into the master branches.

# AVOID
Do not use vibe coding for security-sensitive modules like authentication, token encryption, or database write queries.
*   *Avoid*: Accepting an agent's auth-token refresh logic without reading the git diff.
*   *Write*: Read every line of security modifications to ensure secrets aren't logged.

# USAGE
`Developer A`: "How did you build this full dashboard in 20 minutes?"
`Developer B`: "I vibe-coded it using Sonnet. I just described the charts, ran the compiler, and clicked through the pages to check the styling. I didn't read the internal React code yet, so we need to review it before pushing to staging."

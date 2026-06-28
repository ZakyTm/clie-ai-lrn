---
id: prototyping
title: Prototyping
summary: A development technique where the agent builds a quick, visual version of a feature, allowing you to react to a physical asset rather than discussing concepts in abstract text.
domains:
  - "Section 10 — Human and Vibe review"
related:
  - design-concept
  - grilling
  - vibe-coding
  - human-in-the-loop
sources:
  - "https://en.wikipedia.org/wiki/Software_prototyping"
  - "https://docs.anthropic.com/en/docs/build-with-claude/tool-use"
---

Prototyping is a high-fidelity alignment technique. When a design choice is too abstract to settle in text (e.g. how a navigation menu feels, or how a page layout responds to resizing), you instruct the agent to build a quick, throwaway visual mockup so you can test and react to it directly.

You use prototyping when you:
*   Have an agent generate a mock dashboard page to evaluate the theme and sizing.
*   Write a quick, isolated script to test if an API response format matches your schemas.
*   Iterate on interactive components using prompt loops.

---

## Moving Past Conversational Limits

While **Grilling** resolves decisions in text, conversation is low-fidelity. Some questions can only be answered by seeing and clicking through the asset:

*   **The Bottleneck**: Discussing whether a user wizard should be a single scrolling page or a three-step modal can lead to endless chat circles.
*   **The Prototype Solution**: Because agents can write code in seconds, the cost of building is near zero. You can instruct the agent to build *both* versions as quick prototypes. Clicking through them for 30 seconds resolves the decision instantly.

```
Abstract Argument ──► Prototyping (Build 2 versions) ──► Click & Evaluate ──► Instant Choice
```

Once the visual and structural design is approved, the prototype code can be refactored and moved into your main codebase, forming the baseline for your **Spec** requirements.

---

## Field Applications

In modern web development, developers use tools like Vite or codespaces to host live agent previews. They prompt:
*   *Prompt Example*: "Create a quick, isolated prototype of our chart page inside a single HTML file. Include dummy data so we can test the hover behaviors."

# AVOID
Do not spend hours arguing with an agent about how a layout should look. Have it build it, check it, and refine it.
*   *Avoid*: Writing a 1,000-word essay explaining the color balances you want.
*   *Write*: Command the agent to generate three distinct color variants, choose the best one, and iterate.

# USAGE
`Developer A`: "We can't agree on whether this sidebar menu should collapse or overlay."
`Developer B`: "Let's stop talking and have the agent prototype both layouts in a sandbox. We'll click through them on our screen and decide in five seconds."

---
id: design-concept
title: Design Concept
summary: The shared mental model of what is being built, held in common between developer and agent, separate from any physical file or code asset.
domains:
  - "Section 10 — Human and Vibe review"
related:
  - spec
  - grilling
  - prototyping
sources:
  - "https://en.wikipedia.org/wiki/Fred_Brooks"
  - "https://en.wikipedia.org/wiki/Socratic_method"
---

The design concept (a term coined by Fred Brooks in *The Design of Design*) is the shared understanding of a feature's purpose, rules, and boundaries. It is not the code, the specifications, or the prompt; it is the mental alignment held between the developer and the agent.

You develop a design concept whenever you:
*   Discuss the goals of a feature with an agent before writing code.
*   Interview the agent or answer its questions about how edge cases should behave.
*   Iterate on mockups to align your visual preferences.

---

## The Gaps of Silence

A common developer frustration is: *"The agent wrote exactly what I prompted, but it's still completely wrong."*
*   **The Cause**: The design concept was incomplete in your own head. Because you hadn't worked out all the edge cases (like how to handle partial refunds or shipping cancellations), your prompt was silent on them.
*   **The Reaction**: The agent did not stop to ask. Instead, it silently filled the gaps with its own assumptions, generating plausible-sounding code that conflicts with your actual intent.

A design concept is successfully shared when the agent begins suggesting answers or predicting edge cases exactly the way you would. Until that alignment is reached, writing a **Spec** or code is premature.

---

## Aligning the Concept

To build a solid design concept:
1.  **Grill the Plan**: Have the agent interview you Socratically to uncover hidden assumptions.
2.  **Prototype Early**: Have the agent build a quick, throwaway visual page so you can react to it.

# AVOID
Do not write specifications or code files while the approach is still vague in your own mind.
*   *Avoid*: Ordering an agent to implement a payment route when you haven't decided on the refund logic.
*   *Write*: Discuss the refund flow with the agent, agree on the edge cases, write the spec, and then implement the route.

# USAGE
`Developer A`: "The model generated a whole routing file but it handles session expiry incorrectly."
`Developer B`: "That's because we didn't establish a clear design concept. The model had to guess how to handle expired sessions. Let's discuss the session rules with the model first, write them to a plan doc, and then recreate the file."

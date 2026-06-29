# Clie-AI-LRN (C-AI-L)

```text
  ____ _     ___ _____       _     ___       _     ____  _   _ 
 / ___| |   |_ _|  ___|     / \   |_ _|     / \   |  _ \| \ | |
| |   | |    | ||  _|  ___ / _ \   | | ___ / _ \  | |_) |  \| |
| |___| |___ | || |___|___/ ___ \  | ||___/ ___ \ |  _ <| |\  |
 \____|_____|___|_____|  /_/   \_\|___|  /_/   \_\|_| \_\_| \_|
                          [ CLIE-AI-LRN v0.2.1 ]
```

An open-source, plain-English dictionary of AI engineering concepts and a step-by-step curriculum learning roadmap. Designed like a printed dictionary crossed with a Unix `man` page under a retro phosphor terminal.

*   **Live Web Manual**: Hostable statically (pre-rendered for Cloudflare Pages).
*   **Local CLI Client**: Query definitions directly from your shell command line.
*   **GPL-3.0 Protected**: Free and open-source public good, legally defended from commercial paywall exploitation.

---

## 🛠️ The Local CLI (`man-ai`)

This project packages the entire dictionary database as a local executable command line search helper. Developers can lookup definitions without opening a browser:

### Installation (Local Dev)
```bash
npm install
npm run cli -- --help
```

### Usage Examples
```bash
# Display the manual page for a specific concept
npm run cli rag
npm run cli subagent

# List all compiled dictionary terms alphabetically
npm run cli -- --list

# Get help & command parameters
npm run cli -- --help
```

If you query a concept that does not exist exactly, the CLI runs a **fuzzy search** and suggests closely matching concepts.

---

## ⚡ Key Features

*   **Symmetrical Gateway Design**: Balanced split routes between the Dictionary Index (`/glossary`) and the structured Curriculum Roadmap (`/curriculum`).
*   **Per-Phase Progress Tracking**: Dynamic checkboxes that sync check stats per curriculum phase, updating progress bars on the client browser.
*   **Interactive Socratic Quizzes**: Every glossary term features a 3-question client-side validation test (Conceptual, Architecture, Debugging). Completing quizzes logs your mastery in `localStorage`, unlocking a green star (★) badge next to the concept and updating a global curriculum progress tracker.
*   **Edit on GitHub Links**: Integrates direct edit paths (`[EDIT_ON_GITHUB ↗]`) at the foot of all terms and lessons for immediate crowdsourced improvements.

---

## ☕ Support the Creator / Donate

This project is built and maintained as a public good to make AI engineering education accessible to everyone for free. The creator of this manual is an independent developer dedicating full-time effort to establishing this open-source reference library, and is currently open to new roles and consulting opportunities.

If you find this repository valuable, please consider sponsoring or sending a donation to support the continuation of this work. Contributions help support this project, allowing for continuous updates and advanced curriculum additions.

```text
  ┌──────────────────────────────────────────────────────────┐
  │                                                          │
  │   [SUPPORT_THE_CREATOR_ON_PAYPAL_TODAY ☕]               │
  │   https://www.paypal.com/cgi-bin/webscr?cmd=_donations   │
  │   &business=zktoumiproff@gmail.com&currency_code=USD     │
  │                                                          │
  └──────────────────────────────────────────────────────────┘
```

> **Note**: Click the PayPal link above or send donations directly to the creator's address: `zktoumiproff@gmail.com`.

---

## ⚖️ GPL-3.0 Copyleft License

This repository is licensed under the **GNU GPL v3 (or later)**. 

### Why Copyleft?
*   **No Commercial Hijacking**: Unlike permissive licenses (like MIT), anyone who forks, redistributes, or modifies this manual **must** open-source their changes under the same GPL-3.0 license. You cannot wrap this content in a proprietary commercial paywall.
*   **Dual-Licensing Ready**: The author retains full copyright to the core manual. If a corporation wants to use this curriculum structure in a closed-source proprietary training platform, they must buy a commercial license directly from the author.
*   **Contributor Terms**: By contributing code or markdown definitions to this repository, you agree to grant the author joint copyright to relicense modifications (enabling potential commercial dual-licensing to fund the project).

---

## 🚀 Local Development

To run the static compiler and launch the development environment locally:

```bash
# 1. Install dependencies
npm install

# 2. Run the content database compile pipeline
node scripts/parse-content.mjs

# 3. Start the local Astro dev server
npm run dev
```

Deploying is fully static: run `npm run build` and connect your GitHub repository to **Cloudflare Pages** pointing to the output folder `dist/` with zero server database overhead.

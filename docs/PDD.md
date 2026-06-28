# Product Design Document (PDD)

## 1. Aesthetic Concept: "The Manual"
The visual identity is modeled after a printed dictionary crossed with a Unix `man` page, encased in the clean browser-terminal chrome inspired by `pi.dev`. The design is justified and content-native, stripping away shadows and unnecessary borders in favor of hairline rules (1px borders).

## 2. Typography & Font Roles
The interface utilizes three distinct typefaces to fulfill specific visual roles:
*   **Display Typography**: `Space Grotesk` (700 weight, tight tracking `-0.02em`). Used for page titles, hero headings, and key display links.
*   **Definition Body**: `Newsreader` (serif, 17px, line-height 1.7). Provides a serif "dictionary voice" for reading paragraphs, definitions, and explanations.
*   **UI & Shell**: `JetBrains Mono` (400, 500, 700 weights). Used for console inputs, badges, navigation menus, numbered sections (e.g. `§1`), code, and labels.

## 3. Color Palettes & Themes
The interface utilizes custom CSS variables to provide two clean themes with automatic theme switching based on browser settings:

### 3.1 Dark Theme (Phosphor Terminal - Default)
*   `--bg-canvas`: `#0c0e0d` (warm near-black, faint CRT green-grey)
*   `--bg-surface`: `#141715` (cards and panels)
*   `--bg-elevated`: `#1c201d` (hovers and code blocks)
*   `--border-subtle`: `#273029` (rules and dividers)
*   `--text-primary`: `#e7eae5` (clean text)
*   `--text-secondary`: `#8a9088` (muted annotations)
*   `--accent`: `#e0a33e` (phosphor amber)

### 3.2 Light Theme (Paper Dictionary)
*   `--bg-canvas`: `#f4f1e8` (warm dictionary paper)
*   `--bg-surface`: `#fbf9f2` (cards)
*   `--bg-elevated`: `#ece7da` (hover state)
*   `--border-subtle`: `#d8d2c4` (thin ink dividers)
*   `--text-primary`: `#1a1714` (ink black)
*   `--text-secondary`: `#6b655c` (muted text)
*   `--accent`: `#b5781a` (darker amber for paper contrast)

## 4. UI Shell & Key Primitives
*   **Figure Corner Frames**: Boxes and cards have a 1px border and a signature overlay of 4 absolute-positioned corner borders to replicate terminal terminal frames.
*   **Monospace Breadcrumbs**: High-level page navigation uses uppercase mono paths separated by slash marks (e.g. `INDEX / MANUAL / TERM`).
*   **Radical Simplicity**: 4px radius on cards, 8px on modal dialogs. Standard B-Tree spacing and no drop shadows except for the terminal search bar.

## 5. Homepage REPL Search Console UI
The main interaction point of the homepage is a terminal search box:
*   **Visual Title**: `man ai — interactive search console`
*   **Input Prompt**: `man ai/` with a flashing amber block cursor (`#repl-caret`).
*   **Reveal Type Effect**: Upon load, the console plays a simulated typing effect of a sample term (e.g. `context-window`) to invite search query input.
*   **Fuzzy Matching Autocomplete**: Querying instantly matches term names, summaries, or tags, presenting up to 5 suggestions in a dropdown.
*   **Keyboard Listeners**: `Up/Down` arrow keys navigate the dropdown suggestions, and `Enter` redirects the page to the highlighted term. Clicking a search suggestion redirects to it.

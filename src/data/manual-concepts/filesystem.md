---
id: filesystem
title: Filesystem
summary: The storage interface where an agent reads source documents, inspects files, and writes edits using file-operation tools.
domains:
  - "Section 3 — Environment"
related:
  - environment
  - tool
  - sandbox
  - handoff-artifact
sources:
  - "https://en.wikipedia.org/wiki/File_system"
  - "https://nodejs.org/api/fs.html"
---

The filesystem is the local storage interface (folders and files) where your agent reads code, configures setups, and writes edits. It is the primary canvas where AI coding agents perform tasks.

You connect an agent to the filesystem when:
*   Running terminal agents that write refactoring diffs.
*   Building code interpreters that read datasets from csv files.
*   Exposing project files to a model context window.

---

## File Reading & Modification Strategies

Because reading entire files can quickly blow out your **context window** budget, professional agent systems use distinct filesystem tools:

1.  **View File (Chunked)**: Reads only a specific line range of a file (e.g. lines 1 to 50) rather than the whole document.
2.  **Replace Content (Targeted)**: Overwrites a specific chunk of lines using search-and-replace matches, avoiding writing the entire file back to disk.
3.  **Path Sanitization**: Restricts the agent to a specific workspace directory, preventing it from using relative paths (e.g. `../../etc/passwd`) to read files outside the project.

---

## Field Applications & Path Guardrails

Fullstack engineers implement path validation in filesystem tools to prevent directory traversal attacks:

### 1. Fullstack Developers (Sanitizing Paths in Tools)
*   *Code Example (Node.js)*:
    ```javascript
    import path from "path";
    import fs from "fs";
    
    function safeReadFile(userPath, workspaceRoot) {
      const resolvedPath = path.resolve(workspaceRoot, userPath);
      
      // Prevent directory traversal (e.g., userPath = "../../../etc/passwd")
      if (!resolvedPath.startsWith(workspaceRoot)) {
        throw new Error("Access Denied: Path is outside the allowed workspace.");
      }
      
      return fs.readFileSync(resolvedPath, "utf-8");
    }
    ```

# AVOID
Do not let agents overwrite entire source files when they only need to modify a single line. Replacing whole files increases token consumption and can result in accidental deletions of unrelated code.
*   *Avoid*: Letting the agent write a 2,000-line file back to disk just to fix a single syntax typo.
*   *Write*: Provide a regex-matching tool or a line-specific replace utility to edit only the target code lines.

# USAGE
`Developer A`: "The agent deleted our config file because of a bad path parameter."
`Developer B`: "We need to secure our filesystem tool. Let's add path validation that blocks the agent from writing outside our active workspace folder, and configure it to write to a temp directory if we are running in untrusted mode."

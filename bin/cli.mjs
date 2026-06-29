#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const dataDir = path.resolve(__dirname, '..', 'src', 'data');
const termsPath = path.join(dataDir, 'terms.json');

// ponytail: detect terminal width for dynamic rulers
const termWidth = process.stdout.columns || 72;

// Check if terms.json exists
if (!fs.existsSync(termsPath)) {
  console.error('\n\x1b[1;31m[ERROR] Dictionary database not found!\x1b[22m');
  console.error('Please run \x1b[36mnode scripts/parse-content.mjs\x1b[39m first to build the dictionary database.\n');
  process.exit(1);
}

// Load terms
const terms = JSON.parse(fs.readFileSync(termsPath, 'utf-8'));

// Parse command line arguments
const args = process.argv.slice(2);
const query = args.join(' ').trim();

if (!query || query === '-h' || query === '--help') {
  printHelp();
  process.exit(0);
}

if (query === '-l' || query === '--list') {
  printList();
  process.exit(0);
}

// Search exact slug/id match
let matchedTerm = terms.find(t => t.id.toLowerCase() === query.toLowerCase());

// If not exact slug, check exact title
if (!matchedTerm) {
  matchedTerm = terms.find(t => t.title.toLowerCase() === query.toLowerCase());
}

if (matchedTerm) {
  printManPage(matchedTerm);
} else {
  // Try fuzzy match
  const searchResults = terms.filter(t => 
    t.title.toLowerCase().includes(query.toLowerCase()) || 
    t.summary.toLowerCase().includes(query.toLowerCase())
  );

  if (searchResults.length > 0) {
    console.log(`\n\x1b[1;33mConcept not found. Did you mean one of these?\x1b[22m`);
    searchResults.slice(0, 8).forEach(t => {
      console.log(`  \x1b[36mman-ai ${t.id}\x1b[39m \x1b[90m- ${t.title} (${t.section})\x1b[39m`);
    });
    console.log();
  } else {
    console.log(`\n\x1b[1;31mNo matching concept found for "${query}" in the manual.\x1b[22m`);
    console.log(`Run \x1b[36mman-ai --list\x1b[39m to see all compiled concepts.\n`);
  }
}

function ruler(char = '─') {
  return char.repeat(Math.min(termWidth, 72));
}

// Help documentation menu
function printHelp() {
  const w = Math.min(termWidth, 72);
  const pad = Math.max(2, Math.floor((w - 30) / 2));
  const sp = ' '.repeat(pad);

  console.log(`
${sp}\x1b[1mCAIL(1)\x1b[22m${' '.repeat(Math.max(1, w - 28 - pad*2))}\x1b[1mClie-AI-LRN Manual\x1b[22m${' '.repeat(Math.max(1, w - 28 - pad*2))}\x1b[1mCAIL(1)\x1b[22m
${' '.repeat(pad)}\x1b[90m${ruler('─')}\x1b[39m

\x1b[1;33mNAME\x1b[22m
       \x1b[1mman-ai\x1b[22m - Search and read AI engineering concepts directly in your shell

\x1b[1;33mSYNOPSIS\x1b[22m
       \x1b[1mman-ai\x1b[22m [ \x1b[4mconcept-slug\x1b[24m | \x1b[4mconcept-title\x1b[24m ]
       \x1b[1mman-ai\x1b[22m [ \x1b[1m--list\x1b[22m | \x1b[1m-l\x1b[22m ]
       \x1b[1mman-ai\x1b[22m [ \x1b[1m--help\x1b[22m | \x1b[1m-h\x1b[22m ]

\x1b[1;33mDESCRIPTION\x1b[22m
       \x1b[1mman-ai\x1b[22m  is a command-line interface helper to explore "Clie-AI-LRN". 
       It pulls rephrased concepts, stateful tools, failure modes, and architectural 
       rules, formatting them as retro Unix manual entries.

\x1b[1;33mOPTIONS\x1b[22m
       \x1b[1m-l, --list\x1b[22m
              List all compiled glossary terms alphabetically.

       \x1b[1m-h, --help\x1b[22m
              Show this help documentation.

\x1b[1;33mEXAMPLES\x1b[22m
       \x1b[36mman-ai rag\x1b[39m
              Display the manual page for Retrieval-Augmented Generation.

       \x1b[36mman-ai subagent\x1b[39m
              Display the manual page for Subagents and tool delegation.

\x1b[90m${ruler('─')}\x1b[39m
\x1b[1mClie-AI-LRN v0.2.1\x1b[22m${' '.repeat(Math.max(1, w - 52))}\x1b[1mZakyTm Repo\x1b[22m
  `);
}

// Print alphabetical list of terms
function printList() {
  const sorted = [...terms].sort((a, b) => a.title.localeCompare(b.title));
  const maxIdLen = Math.max(...sorted.map(t => t.id.length)) + 2;

  console.log(`\n\x1b[1;33mCLIE-AI-LRN - ALL COMPILED TERMS:\x1b[22m\n`);
  sorted.forEach(t => {
    console.log(`  \x1b[36m${t.id.padEnd(maxIdLen)}\x1b[39m\x1b[90m•\x1b[39m ${t.title}`);
  });
  console.log(`\n\x1b[1mTotal compiled terms: ${terms.length}\x1b[22m\n`);
}

// Format Markdown for terminal display
function formatMarkdown(md) {
  if (!md) return '';
  const lines = md.split('\n');
  // ponytail: simple line-based processing, no heavy parser
  return lines.map(line => {
    // Headers
    if (/^# /.test(line)) return `\x1b[1m${line.replace(/^# /, '')}\x1b[22m`;
    if (/^## /.test(line)) return `\x1b[1m${line.replace(/^## /, '')}\x1b[22m`;
    if (/^### /.test(line)) return `\x1b[1m${line.replace(/^### /, '')}\x1b[22m`;
    // Bold
    line = line.replace(/\*\*(.*?)\*\*/g, '\x1b[1m$1\x1b[22m')
               .replace(/__(.*?)__/g, '\x1b[1m$1\x1b[22m');
    // Inline code
    line = line.replace(/`([^`]+)`/g, '\x1b[36m$1\x1b[39m');
    // Links: [Text](URL) -> underlined Text
    line = line.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '\x1b[4m$1\x1b[24m');
    // List items
    line = line.replace(/^\s*-\s+/, '  • ')
               .replace(/^\s*\*\s+/, '  • ');
    // Blockquotes
    line = line.replace(/^>\s+(.*)$/, '  \x1b[3m| $1\x1b[23m');
    return line;
  }).join('\n');
}

// Helper to indent paragraph lines
function indentText(text, spaces = '       ') {
  if (!text) return '';
  return text.split('\n').map(line => line.trim() ? spaces + line : '').join('\n');
}

// Output manual page format
function printManPage(term) {
  const verifiedBadge = term.sourceRepo === 'manual' 
    ? '\x1b[1;32m[VERIFIED MANUAL ENTRY]\x1b[22m' 
    : '\x1b[1;31m[UNVERIFIED REFERENCE ENTRY]\x1b[22m';

  const w = Math.min(termWidth, 72);
  const pad = Math.max(2, Math.floor((w - 30) / 2));

  console.log(`
${' '.repeat(pad)}\x1b[1mCAIL(1)\x1b[22m${' '.repeat(Math.max(1, w - 28 - pad*2))}\x1b[1mClie-AI-LRN Manual\x1b[22m${' '.repeat(Math.max(1, w - 28 - pad*2))}\x1b[1mCAIL(1)\x1b[22m
${' '.repeat(pad)}\x1b[90m${ruler('─')}\x1b[39m

\x1b[1;33mNAME\x1b[22m
       \x1b[1m${term.title}\x1b[22m - ${term.summary}

\x1b[1;33mSECTION\x1b[22m
       ${term.section}   ${verifiedBadge}

\x1b[1;33mDESCRIPTION\x1b[22m
${indentText(formatMarkdown(term.body))}
${term.descriptionAr ? `
\x1b[1;33mARABIC GLOSS\x1b[22m
${indentText(term.descriptionAr)}` : ''}${term.avoid ? `
\x1b[1;31mAVOID\x1b[22m
${indentText(formatMarkdown(term.avoid))}` : ''}
${term.usage ? `
\x1b[1;36mUSAGE\x1b[22m
${indentText(formatMarkdown(term.usage))}` : ''}
${term.related && term.related.length ? `
\x1b[1;33mSEE ALSO\x1b[22m
       ${term.related.join(', ')}` : ''}

\x1b[90m${ruler('─')}\x1b[39m
\x1b[1mClie-AI-LRN v0.2.1\x1b[22m${' '.repeat(Math.max(1, w - 52))}\x1b[1mZakyTm Repo\x1b[22m
  `);
}

#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

// ---------------------------------------------------------------------------
// Non-English word lists (case-insensitive, whole-word matching)
// ---------------------------------------------------------------------------
const DUTCH_WORDS = [
  "gebruik", "wanneer", "altijd", "nooit", "bijvoorbeeld",
  "onderzoek", "documentatie", "bestand", "bestanden", "configuratie",
  "overzicht", "toevoegen", "verwijderen", "bijwerken",
];

const FRENCH_WORDS = [
  "vous", "utiliser", "toujours", "jamais", "exemple",
  "documentation", "fichier",
];

const ALL_WORDS = [
  ...DUTCH_WORDS.map((w) => ({ word: w, lang: "Dutch" })),
  ...FRENCH_WORDS.map((w) => ({ word: w, lang: "French" })),
];

// ---------------------------------------------------------------------------
// Recursively find all SKILL.md files
// ---------------------------------------------------------------------------
function findSkillFiles(dir) {
  const results = [];
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== "node_modules" && entry.name !== ".git") {
      results.push(...findSkillFiles(full));
    } else if (entry.isFile() && entry.name === "SKILL.md") {
      results.push(full);
    }
  }
  return results;
}

// ---------------------------------------------------------------------------
// Strip YAML frontmatter, return only the markdown body
// ---------------------------------------------------------------------------
function getMarkdownBody(content) {
  const match = content.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n([\s\S]*)$/);
  return match ? match[1] : content;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const root = process.argv[2] || process.cwd();
const files = findSkillFiles(root);

if (files.length === 0) {
  console.log("No SKILL.md files found.");
  process.exit(0);
}

let hasErrors = false;

for (const file of files) {
  const rel = path.relative(root, file);
  const content = fs.readFileSync(file, "utf8");
  const body = getMarkdownBody(content);
  const findings = [];

  for (const { word, lang } of ALL_WORDS) {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    const lines = body.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      if (regex.test(lines[i])) {
        findings.push({ line: i + 1, word, lang, text: lines[i].trim() });
      }
    }
  }

  if (findings.length > 0) {
    hasErrors = true;
    console.log(`\n${rel}:`);
    for (const f of findings) {
      console.log(`  L${f.line} [${f.lang}] "${f.word}" — ${f.text.substring(0, 80)}`);
    }
  }
}

if (hasErrors) {
  console.log("\nLanguage check FAILED — non-English content detected.");
  process.exit(1);
} else {
  console.log("Language check PASSED — all SKILL.md files appear to be English.");
  process.exit(0);
}

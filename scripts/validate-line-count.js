#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const MAX_LINES = 500;

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
// Main
// ---------------------------------------------------------------------------
const root = process.argv[2] || process.cwd();
const files = findSkillFiles(root);

if (files.length === 0) {
  console.log("No SKILL.md files found.");
  process.exit(0);
}

let hasErrors = false;

console.log(`Checking line count (max ${MAX_LINES}) for ${files.length} SKILL.md file(s)...\n`);

for (const file of files) {
  const rel = path.relative(root, file);
  const content = fs.readFileSync(file, "utf8");
  const lineCount = content.split(/\r?\n/).length;

  if (lineCount > MAX_LINES) {
    console.log(`  FAIL: ${rel} — ${lineCount} lines (limit: ${MAX_LINES})`);
    hasErrors = true;
  } else {
    console.log(`  OK:   ${rel} — ${lineCount} lines`);
  }
}

if (hasErrors) {
  console.log("\nLine count validation FAILED.");
  process.exit(1);
} else {
  console.log("\nAll files within line limit.");
  process.exit(0);
}

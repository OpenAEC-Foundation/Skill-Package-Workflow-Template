#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

// ---------------------------------------------------------------------------
// Recursively find all SKILL.md files under the given root
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
// Minimal YAML frontmatter parser (regex-based, no npm deps)
// Returns { raw, fields } where raw is the raw frontmatter string
// ---------------------------------------------------------------------------
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;

  const raw = match[1];
  const fields = {};
  const lines = raw.split(/\r?\n/);

  let currentKey = null;
  let currentValue = "";
  let isFolded = false;

  for (const line of lines) {
    // Top-level key (not indented)
    const keyMatch = line.match(/^([a-zA-Z_][a-zA-Z0-9_-]*):\s*(.*)/);
    if (keyMatch && !line.match(/^\s/)) {
      // Store previous key
      if (currentKey !== null) {
        fields[currentKey] = currentValue.trim();
      }
      currentKey = keyMatch[1];
      const val = keyMatch[2].trim();
      if (val === ">" || val === "|") {
        isFolded = val === ">";
        currentValue = "";
      } else {
        isFolded = false;
        // Strip surrounding quotes
        currentValue = val.replace(/^["']|["']$/g, "");
      }
    } else if (currentKey !== null && line.match(/^\s+/)) {
      // Continuation line for block scalar or multiline
      currentValue += (currentValue ? " " : "") + line.trim();
    }
  }
  // Store last key
  if (currentKey !== null) {
    fields[currentKey] = currentValue.trim();
  }

  return { raw, fields };
}

// ---------------------------------------------------------------------------
// Main validation
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
  const issues = [];

  // 1. Check YAML is parseable
  const fm = parseFrontmatter(content);
  if (!fm) {
    issues.push("No valid YAML frontmatter found (missing --- markers)");
    console.log(`\n${rel}:`);
    issues.forEach((i) => console.log(`  ERROR: ${i}`));
    hasErrors = true;
    continue;
  }

  const { raw, fields } = fm;

  // 2. Required fields
  for (const req of ["name", "description", "license"]) {
    if (!fields[req]) {
      issues.push(`Missing required field: ${req}`);
    }
  }

  // 3. name: kebab-case, max 64 chars
  if (fields.name) {
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(fields.name)) {
      issues.push(`name "${fields.name}" is not valid kebab-case`);
    }
    if (fields.name.length > 64) {
      issues.push(`name "${fields.name}" exceeds 64 characters (${fields.name.length})`);
    }
  }

  // 4. description starts with "Use when"
  if (fields.description) {
    if (!fields.description.startsWith("Use when")) {
      issues.push(`description must start with "Use when" (trigger-optimized format)`);
    }
    // 5. description contains "Keywords:"
    if (!fields.description.includes("Keywords:")) {
      issues.push(`description must contain "Keywords:" somewhere`);
    }
  }

  // 6. description uses folded block scalar >
  const descLineMatch = raw.match(/^description:\s*(.*)$/m);
  if (descLineMatch) {
    const afterColon = descLineMatch[1].trim();
    if (afterColon !== ">") {
      issues.push(`description must use folded block scalar ">" (found: "description: ${afterColon}")`);
    }
  }

  // 7. license is MIT
  if (fields.license && fields.license !== "MIT") {
    issues.push(`license must be "MIT" (found: "${fields.license}")`);
  }

  if (issues.length > 0) {
    console.log(`\n${rel}:`);
    issues.forEach((i) => console.log(`  ERROR: ${i}`));
    hasErrors = true;
  } else {
    console.log(`${rel}: OK`);
  }
}

if (hasErrors) {
  console.log("\nFrontmatter validation FAILED.");
  process.exit(1);
} else {
  console.log("\nAll frontmatter checks passed.");
  process.exit(0);
}

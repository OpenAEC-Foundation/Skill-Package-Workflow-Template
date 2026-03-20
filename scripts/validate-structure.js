#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

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

const errors = [];
const warnings = [];

// ---- Check root-level required files ----
const requiredRoot = ["CLAUDE.md", "ROADMAP.md", "README.md", "LICENSE"];
for (const name of requiredRoot) {
  const fp = path.join(root, name);
  if (!fs.existsSync(fp)) {
    errors.push(`Missing required root file: ${name}`);
  }
}

// ---- Check SKILL.md directory conventions ----
// Expected pattern: skills/source/{prefix}-{category}/{prefix}-{category}-{topic}/SKILL.md
// Using forward-slash normalized paths for pattern matching
const structurePattern = /^skills[/\\]source[/\\]([a-z0-9]+-[a-z0-9]+(?:-[a-z0-9]+)*)[/\\](\1-[a-z0-9]+(?:-[a-z0-9]+)*)[/\\]SKILL\.md$/;

for (const file of files) {
  const rel = path.relative(root, file).replace(/\\/g, "/");

  // Check if file is under skills/ at all
  if (!rel.startsWith("skills/")) {
    // SKILL.md files outside skills/ (e.g., templates/) are not subject to structure checks
    continue;
  }

  // Validate directory pattern
  const parts = rel.split("/");
  // Expected: skills / source / {prefix}-{category} / {prefix}-{category}-{topic} / SKILL.md
  if (parts.length !== 5 || parts[1] !== "source") {
    errors.push(`${rel}: Does not match expected path pattern skills/source/{prefix}-{category}/{prefix}-{category}-{topic}/SKILL.md`);
    continue;
  }

  const categoryDir = parts[2]; // e.g. "aec-core"
  const topicDir = parts[3]; // e.g. "aec-core-ifc"

  // Topic dir must start with category dir name
  if (!topicDir.startsWith(categoryDir + "-")) {
    errors.push(`${rel}: Topic directory "${topicDir}" must start with category directory name "${categoryDir}-"`);
  }

  // Check for references/ subdirectory
  const skillDir = path.dirname(file);
  const refsDir = path.join(skillDir, "references");
  if (!fs.existsSync(refsDir)) {
    warnings.push(`${rel}: Missing recommended references/ subdirectory`);
  }
}

// ---- Output ----
if (warnings.length > 0) {
  console.log("WARNINGS:");
  warnings.forEach((w) => console.log(`  WARN: ${w}`));
  console.log();
}

if (errors.length > 0) {
  console.log("ERRORS:");
  errors.forEach((e) => console.log(`  ERROR: ${e}`));
  console.log("\nStructure validation FAILED.");
  process.exit(1);
} else {
  if (warnings.length > 0) {
    console.log("Structure validation PASSED with warnings.");
  } else {
    console.log("Structure validation PASSED.");
  }
  process.exit(0);
}

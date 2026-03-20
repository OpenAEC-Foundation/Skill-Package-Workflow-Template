#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

// ---------------------------------------------------------------------------
// Recursively find all SKILL.md files under skills/
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
const skillsDir = path.join(root, "skills");

if (!fs.existsSync(skillsDir)) {
  console.log("No skills/ directory found. Skill count: 0");
  process.exit(0);
}

const files = findSkillFiles(skillsDir);

// Categorize by the category directory name (third path segment under skills/source/)
const categories = {};
for (const file of files) {
  const rel = path.relative(root, file).replace(/\\/g, "/");
  const parts = rel.split("/");
  // Expected: skills/source/{category-dir}/{topic-dir}/SKILL.md
  let cat = "uncategorized";
  if (parts.length >= 3) {
    cat = parts[2]; // e.g. "aec-core"
  }
  if (!categories[cat]) categories[cat] = 0;
  categories[cat]++;
}

// Read ROADMAP.md for comparison
let roadmapCount = null;
const roadmapPath = path.join(root, "ROADMAP.md");
if (fs.existsSync(roadmapPath)) {
  const roadmap = fs.readFileSync(roadmapPath, "utf8");
  // Look for patterns like "Total: 42 skills" or "42 skills planned"
  const countMatch = roadmap.match(/(\d+)\s*skills?\b/i);
  if (countMatch) {
    roadmapCount = parseInt(countMatch[1], 10);
  }
}

// Output summary table
console.log("=== Skill Package Count ===\n");
console.log(`Total SKILL.md files: ${files.length}\n`);

if (Object.keys(categories).length > 0) {
  console.log("Per category:");
  console.log("-".repeat(40));
  const sorted = Object.entries(categories).sort((a, b) => b[1] - a[1]);
  for (const [cat, count] of sorted) {
    console.log(`  ${cat.padEnd(30)} ${count}`);
  }
  console.log("-".repeat(40));
}

if (roadmapCount !== null) {
  console.log(`\nROADMAP.md mentions ${roadmapCount} skills.`);
  if (files.length < roadmapCount) {
    console.log(`  Progress: ${files.length}/${roadmapCount} (${Math.round((files.length / roadmapCount) * 100)}%)`);
  } else {
    console.log(`  Target reached or exceeded.`);
  }
}

// Always exit 0 — informational only
process.exit(0);

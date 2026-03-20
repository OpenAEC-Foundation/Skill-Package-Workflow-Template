#!/usr/bin/env node
"use strict";

const { execSync } = require("child_process");
const path = require("path");

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------
const PASS_THRESHOLD = 90; // minimum % to pass

const root = process.argv[2] || process.cwd();
const scriptsDir = path.dirname(process.argv[1]) || path.join(root, "scripts");

const validators = [
  { name: "Frontmatter", script: "validate-frontmatter.js" },
  { name: "Line Count", script: "validate-line-count.js" },
  { name: "Structure", script: "validate-structure.js" },
  { name: "Language", script: "validate-language.js" },
];

// ---------------------------------------------------------------------------
// Run each validator
// ---------------------------------------------------------------------------
const results = [];

for (const v of validators) {
  const scriptPath = path.join(scriptsDir, v.script);
  let output = "";
  let passed = false;

  try {
    output = execSync(`node "${scriptPath}" "${root}"`, {
      encoding: "utf8",
      timeout: 60000,
      stdio: ["pipe", "pipe", "pipe"],
    });
    passed = true;
  } catch (err) {
    output = (err.stdout || "") + (err.stderr || "");
    passed = false;
  }

  results.push({ name: v.name, passed, output: output.trim() });
}

// Run count-skills (informational, always passes)
let countOutput = "";
try {
  countOutput = execSync(`node "${path.join(scriptsDir, "count-skills.js")}" "${root}"`, {
    encoding: "utf8",
    timeout: 60000,
    stdio: ["pipe", "pipe", "pipe"],
  });
} catch (err) {
  countOutput = (err.stdout || "") + (err.stderr || "");
}

// ---------------------------------------------------------------------------
// Calculate score
// ---------------------------------------------------------------------------
const total = results.length;
const passed = results.filter((r) => r.passed).length;
const score = total > 0 ? Math.round((passed / total) * 100) : 100;

// ---------------------------------------------------------------------------
// Generate markdown report
// ---------------------------------------------------------------------------
const timestamp = new Date().toISOString().replace("T", " ").replace(/\.\d+Z$/, " UTC");

let report = "";
report += "# Skill Package Compliance Audit Report\n\n";
report += `**Generated:** ${timestamp}  \n`;
report += `**Score:** ${score}% (${passed}/${total} checks passed)  \n`;
report += `**Status:** ${score >= PASS_THRESHOLD ? "PASS" : "FAIL"}  \n`;
report += `**Threshold:** ${PASS_THRESHOLD}%\n\n`;

report += "## Validation Results\n\n";
report += "| Check | Status |\n";
report += "|-------|--------|\n";
for (const r of results) {
  report += `| ${r.name} | ${r.passed ? "PASS" : "FAIL"} |\n`;
}
report += "\n";

// Detailed output per validator
for (const r of results) {
  report += `### ${r.name}\n\n`;
  report += "```\n";
  report += r.output + "\n";
  report += "```\n\n";
}

// Skill count section
report += "## Skill Count (Informational)\n\n";
report += "```\n";
report += countOutput.trim() + "\n";
report += "```\n";

// Output to stdout
console.log(report);

// Exit code
if (score < PASS_THRESHOLD) {
  process.exit(1);
} else {
  process.exit(0);
}

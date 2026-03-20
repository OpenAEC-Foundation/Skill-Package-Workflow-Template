#!/usr/bin/env node
/**
 * generate-banner-png.js
 *
 * Renders docs/social-preview-banner.html to docs/social-preview.png
 * at exactly 1280x640 pixels using Puppeteer + local Chrome.
 *
 * Usage:
 *   node scripts/generate-banner-png.js                          # uses current repo
 *   node scripts/generate-banner-png.js /path/to/other/repo      # uses specified repo
 *
 * Or from the Workflow Template repo:
 *   node "C:/Users/Freek Heijting/Documents/GitHub/Skill-Package-Workflow-Template/scripts/generate-banner-png.js" /path/to/repo
 */

const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

async function generateBanner(repoPath) {
  const htmlPath = path.join(repoPath, "docs", "social-preview-banner.html");
  const pngPath = path.join(repoPath, "docs", "social-preview.png");

  if (!fs.existsSync(htmlPath)) {
    console.error(`ERROR: ${htmlPath} does not exist.`);
    console.error("Generate the HTML banner first, then run this script.");
    process.exit(1);
  }

  // Ensure docs/ directory exists
  const docsDir = path.join(repoPath, "docs");
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  const fileUrl = "file:///" + htmlPath.replace(/\\/g, "/");

  console.log(`Rendering: ${htmlPath}`);
  console.log(`Output:    ${pngPath}`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 640, deviceScaleFactor: 1 });
  await page.goto(fileUrl, { waitUntil: "networkidle0", timeout: 15000 });

  // Screenshot the .banner element for pixel-perfect 1280x640
  const bannerElement = await page.$(".banner");
  if (bannerElement) {
    await bannerElement.screenshot({ path: pngPath, type: "png" });
  } else {
    // Fallback: full page clip
    await page.screenshot({
      path: pngPath,
      type: "png",
      clip: { x: 0, y: 0, width: 1280, height: 640 },
    });
  }

  await browser.close();
  console.log(`Done! Banner saved to ${pngPath}`);
}

// Determine repo path from argument or current working directory
const repoPath = process.argv[2] || process.cwd();
generateBanner(path.resolve(repoPath));

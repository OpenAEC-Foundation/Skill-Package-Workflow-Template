const puppeteer = require("puppeteer");
const path = require("path");

const TOKEN = process.argv[2];
const REPO = process.argv[3];  // e.g. "OpenAEC-Foundation/PDFjs-Claude-Skill-Package"
const IMG_PATH = process.argv[4];

async function uploadSocialPreview() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  
  const page = await browser.newPage();
  
  // Login via token - GitHub accepts PAT as password with any username
  const settingsUrl = `https://github.com/${REPO}/settings`;
  
  // Set auth header for all requests
  await page.setExtraHTTPHeaders({
    'Authorization': `Bearer ${TOKEN}`
  });
  
  // Try direct navigation with auth
  const response = await page.goto(settingsUrl, { waitUntil: "networkidle2", timeout: 30000 });
  console.log(`Settings page status: ${response.status()}`);
  
  // Check if we're authenticated
  const title = await page.title();
  console.log(`Page title: ${title}`);
  
  // Check if we see the social preview section
  const content = await page.content();
  const hasSocialPreview = content.includes('social-preview') || content.includes('Social preview');
  console.log(`Has social preview section: ${hasSocialPreview}`);
  
  if (response.status() !== 200 || !hasSocialPreview) {
    // Try basic auth approach instead
    console.log("Trying basic auth...");
    await page.setExtraHTTPHeaders({});
    
    // Navigate to login
    await page.goto('https://github.com/login', { waitUntil: "networkidle2" });
    
    // Fill in credentials using token as password
    await page.type('#login_field', 'FreekHeijting');
    await page.type('#password', TOKEN);
    await page.click('[name="commit"]');
    await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 15000 }).catch(() => {});
    
    const loginTitle = await page.title();
    console.log(`After login title: ${loginTitle}`);
    
    // Now go to settings
    await page.goto(settingsUrl, { waitUntil: "networkidle2", timeout: 15000 });
    const settingsTitle = await page.title();
    console.log(`Settings title: ${settingsTitle}`);
  }
  
  await browser.close();
}

uploadSocialPreview().catch(err => {
  console.error("Error:", err.message);
  process.exit(1);
});

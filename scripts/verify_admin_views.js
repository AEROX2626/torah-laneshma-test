const { chromium } = require("playwright");
const path = require("path");

(async () => {
  const browser = await chromium.launch({ headless: true, channel: "chrome" });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const artifactsDir = "C:\\Users\\User\\.gemini\\antigravity\\brain\\65906ff0-827b-4496-b111-e1e19a8fa3af";

  console.log("Navigating to http://localhost:3001/admin/login...");
  await page.goto("http://localhost:3001/admin/login", { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(artifactsDir, "torah_admin_login_3001.png") });
  console.log("Captured torah_admin_login_3001.png");

  // Fill credentials
  await page.fill('#admin-email', 'admin@torah-laneshma.co.il');
  await page.fill('#admin-password', 'admin123456');
  await page.click('button[type="submit"]');

  await page.waitForURL('**/admin', { timeout: 10000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(artifactsDir, "torah_admin_dashboard_3001.png") });
  console.log("Captured torah_admin_dashboard_3001.png");

  // Go to visual content editor
  await page.goto("http://localhost:3001/admin/editor", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(artifactsDir, "torah_admin_editor_3001.png") });
  console.log("Captured torah_admin_editor_3001.png");

  // Go to FAQs
  await page.goto("http://localhost:3001/admin/faqs", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(artifactsDir, "torah_admin_faqs_3001.png") });
  console.log("Captured torah_admin_faqs_3001.png");

  await browser.close();
  console.log("All admin screenshots captured on port 3001!");
})();

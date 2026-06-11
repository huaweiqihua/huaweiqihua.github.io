import fs from "node:fs/promises";
import path from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { chromium, type Browser } from "playwright";
import { getSourceUrl } from "@/lib/sync/crawler";
import { detectAccessIssue } from "@/lib/sync/extraction";
import type { Platform } from "@/lib/types";

const platformArg = process.argv.find((arg) => arg.startsWith("--platform="))?.split("=")[1];
const storageArg = process.argv.find((arg) => arg.startsWith("--storage="))?.split("=")[1];

if (platformArg !== "tiktok" && platformArg !== "temu") {
  console.error("Use --platform=tiktok or --platform=temu.");
  process.exit(1);
}

const platform = platformArg as Platform;
const storagePath = storageArg ?? path.join(process.cwd(), ".auth", `${platform}.storage-state.json`);

async function launchLoginBrowser(): Promise<Browser> {
  try {
    return await chromium.launch({ channel: "chrome", headless: false });
  } catch {
    console.warn("Could not open Google Chrome through Playwright; falling back to bundled Chromium.");
    return chromium.launch({ headless: false });
  }
}

const browser = await launchLoginBrowser();
const context = await browser.newContext({
  userAgent:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
  locale: "en-US",
  viewport: { width: 1440, height: 1200 }
});
const page = await context.newPage();

await page.goto(getSourceUrl(platform), { waitUntil: "domcontentloaded", timeout: 60_000 });
console.log(`Opened ${platform} source page.`);
console.log("Log in manually in the browser window. Do not ask the script to solve CAPTCHA or verification challenges.");

const readline = createInterface({ input, output });
await readline.question("Press Enter here after the marketplace page is logged in and visible...");
readline.close();

const finalUrl = page.url();
const title = await page.title();
const bodyText = await page.locator("body").innerText({ timeout: 5_000 }).catch(() => "");
const accessIssue = detectAccessIssue({ platform, finalUrl, title, bodyText });

if (accessIssue) {
  await browser.close();
  console.error(`Cannot save ${platform} storage state yet: ${accessIssue.message}`);
  console.error(`Current page: ${finalUrl}`);
  process.exit(1);
}

await fs.mkdir(path.dirname(storagePath), { recursive: true });
await context.storageState({ path: storagePath });
await browser.close();

console.log(`Saved ${platform} storage state to ${storagePath}`);

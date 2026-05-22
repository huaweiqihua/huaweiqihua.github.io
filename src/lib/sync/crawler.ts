import type { Platform } from "@/lib/types";
import { sourceConfig } from "@/lib/sync/source-config";

export interface CrawlOptions {
  platform: Platform;
  dryRun?: boolean;
}

export interface CrawlResult {
  platform: Platform;
  sourceUrl: string;
  mode: "dry-run" | "live";
  status: "success" | "partial" | "failed";
  itemsDiscovered: number;
  message: string;
}

export function getSourceUrl(platform: Platform) {
  return platform === "tiktok" ? sourceConfig.tiktok.shopUrl : sourceConfig.temu.mallUrl;
}

export async function crawlSource(options: CrawlOptions): Promise<CrawlResult> {
  const sourceUrl = getSourceUrl(options.platform);

  if (options.dryRun) {
    return {
      platform: options.platform,
      sourceUrl,
      mode: "dry-run",
      status: "success",
      itemsDiscovered: 0,
      message: "Dry run completed without opening marketplace pages."
    };
  }

  const { chromium } = await import("playwright");
  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage({
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36"
    });
    await page.goto(sourceUrl, { waitUntil: "domcontentloaded", timeout: 45_000 });
    const title = await page.title();

    return {
      platform: options.platform,
      sourceUrl,
      mode: "live",
      status: "partial",
      itemsDiscovered: 0,
      message: `Reached source page titled "${title}". Product extraction is ready for platform-specific selectors.`
    };
  } catch (error) {
    return {
      platform: options.platform,
      sourceUrl,
      mode: "live",
      status: "failed",
      itemsDiscovered: 0,
      message: error instanceof Error ? error.message : "Unknown crawler error"
    };
  } finally {
    await browser.close();
  }
}

export async function runDrySync() {
  const [tiktok, temu] = await Promise.all([
    crawlSource({ platform: "tiktok", dryRun: true }),
    crawlSource({ platform: "temu", dryRun: true })
  ]);

  return {
    mode: "dry-run",
    results: [tiktok, temu]
  };
}

import fs from "node:fs";
import type { Platform } from "@/lib/types";
import type { BrowserContextOptions, Page } from "playwright";
import { detectAccessIssue, extractListingsFromCandidates, type AccessIssue, type CrawledListing, type PageCandidate } from "@/lib/sync/extraction";
import { sourceConfig } from "@/lib/sync/source-config";

export interface CrawlOptions {
  platform: Platform;
  dryRun?: boolean;
  storageStatePath?: string;
}

export interface CrawlResult {
  platform: Platform;
  sourceUrl: string;
  resolvedUrl?: string;
  finalUrl?: string;
  mode: "dry-run" | "live";
  status: "success" | "partial" | "failed";
  itemsDiscovered: number;
  items: CrawledListing[];
  accessIssue?: AccessIssue;
  message: string;
}

export function getSourceUrl(platform: Platform) {
  return platform === "tiktok" ? sourceConfig.tiktok.shopUrl : sourceConfig.temu.mallUrl;
}

function getConfiguredStorageState(platform: Platform, explicitPath?: string) {
  if (explicitPath) {
    return explicitPath;
  }

  const configuredPath = platform === "tiktok"
    ? process.env.TIKTOK_STORAGE_STATE_PATH ?? process.env.CRAWLER_STORAGE_STATE_PATH
    : process.env.TEMU_STORAGE_STATE_PATH ?? process.env.CRAWLER_STORAGE_STATE_PATH;

  return configuredPath ?? `.auth/${platform}.storage-state.json`;
}

function isTikTokShortLink(url: string) {
  try {
    return new URL(url).hostname === "vt.tiktok.com";
  } catch {
    return false;
  }
}

export async function resolveMarketplaceUrl(url: string) {
  if (!isTikTokShortLink(url)) {
    return { resolvedUrl: url };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    const response = await fetch(url, {
      redirect: "manual",
      signal: controller.signal,
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36"
      }
    });
    const location = response.headers.get("location");

    if (location) {
      return { resolvedUrl: new URL(location, url).toString() };
    }

    return { resolvedUrl: response.url || url };
  } catch (error) {
    return {
      resolvedUrl: url,
      accessIssue: {
        code: "shortlink_failed",
        message: error instanceof Error ? `TikTok short link could not be resolved: ${error.message}` : "TikTok short link could not be resolved."
      } satisfies AccessIssue
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function collectPageCandidates(page: Page): Promise<PageCandidate[]> {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll("a[href]")).map((anchor) => {
      const link = anchor as HTMLAnchorElement;
      const container =
        link.closest("article, li, [data-testid], [class*='product'], [class*='goods'], [class*='item'], div") ?? link;
      const image = container.querySelector("img") ?? link.querySelector("img");

      return {
        href: link.href || link.getAttribute("href") || "",
        text: link.textContent ?? "",
        imageUrl:
          image?.currentSrc ||
          image?.getAttribute("src") ||
          image?.getAttribute("data-src") ||
          image?.getAttribute("data-original") ||
          "",
        imageAlt: image?.getAttribute("alt") ?? "",
        containerText: container.textContent ?? ""
      };
    })
  );
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
      items: [],
      message: "Dry run completed without opening marketplace pages."
    };
  }

  const { chromium } = await import("playwright");
  const resolved = await resolveMarketplaceUrl(sourceUrl);
  const browser = await chromium.launch({ headless: true });

  try {
    const storageStatePath = getConfiguredStorageState(options.platform, options.storageStatePath);
    const contextOptions: BrowserContextOptions = {
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
      locale: "en-US",
      viewport: { width: 1440, height: 1200 }
    };

    if (storageStatePath && fs.existsSync(storageStatePath)) {
      contextOptions.storageState = storageStatePath;
    }

    const context = await browser.newContext(contextOptions);
    const page = await context.newPage();

    try {
      await page.goto(resolved.resolvedUrl, { waitUntil: "domcontentloaded", timeout: 45_000 });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown navigation error";
      const accessIssue =
        resolved.accessIssue ??
        detectAccessIssue({
          platform: options.platform,
          finalUrl: page.url(),
          title: "",
          bodyText: "",
          errorMessage: message
        }) ??
        undefined;

      return {
        platform: options.platform,
        sourceUrl,
        resolvedUrl: resolved.resolvedUrl,
        finalUrl: page.url(),
        mode: "live",
        status: "failed",
        itemsDiscovered: 0,
        items: [],
        accessIssue,
        message: accessIssue?.message ?? message
      };
    }

    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => undefined);
    await page.waitForTimeout(2_000);

    const title = await page.title();
    const finalUrl = page.url();
    const bodyText = await page.locator("body").innerText({ timeout: 5_000 }).catch(() => "");
    const accessIssue =
      detectAccessIssue({
        platform: options.platform,
        finalUrl,
        title,
        bodyText
      }) ?? resolved.accessIssue;

    if (accessIssue) {
      return {
        platform: options.platform,
        sourceUrl,
        resolvedUrl: resolved.resolvedUrl,
        finalUrl,
        mode: "live",
        status: "failed",
        itemsDiscovered: 0,
        items: [],
        accessIssue,
        message: accessIssue.message
      };
    }

    const candidates = await collectPageCandidates(page);
    const items = extractListingsFromCandidates({
      platform: options.platform,
      pageUrl: finalUrl,
      candidates
    });

    return {
      platform: options.platform,
      sourceUrl,
      resolvedUrl: resolved.resolvedUrl,
      finalUrl,
      mode: "live",
      status: items.length > 0 ? "success" : "partial",
      itemsDiscovered: items.length,
      items,
      message:
        items.length > 0
          ? `Extracted ${items.length} product listing${items.length === 1 ? "" : "s"} from "${title}".`
          : `Reached "${title || finalUrl}" but no product listings matched the current selectors.`
    };
  } catch (error) {
    return {
      platform: options.platform,
      sourceUrl,
      resolvedUrl: resolved.resolvedUrl,
      mode: "live",
      status: "failed",
      itemsDiscovered: 0,
      items: [],
      accessIssue: resolved.accessIssue,
      message: error instanceof Error ? error.message : "Unknown crawler error"
    };
  } finally {
    await browser.close();
  }
}

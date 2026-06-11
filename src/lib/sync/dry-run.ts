import type { Platform } from "@/lib/types";
import { sourceConfig } from "@/lib/sync/source-config";

interface DryCrawlResult {
  platform: Platform;
  sourceUrl: string;
  mode: "dry-run";
  status: "success";
  itemsDiscovered: 0;
  items: [];
  message: string;
}

function sourceUrlFor(platform: Platform) {
  return platform === "tiktok" ? sourceConfig.tiktok.shopUrl : sourceConfig.temu.mallUrl;
}

function dryResult(platform: Platform): DryCrawlResult {
  return {
    platform,
    sourceUrl: sourceUrlFor(platform),
    mode: "dry-run",
    status: "success",
    itemsDiscovered: 0,
    items: [],
    message: "Dry run completed without opening marketplace pages."
  };
}

export async function runDrySync() {
  return {
    mode: "dry-run",
    results: [dryResult("tiktok"), dryResult("temu")]
  };
}

import fs from "node:fs/promises";
import path from "node:path";
import { buildProductsFromCrawledListings, shouldPersistCatalog } from "@/lib/sync/catalog-snapshot";
import { crawlSource } from "@/lib/sync/crawler";
import { runDrySync } from "@/lib/sync/dry-run";
import type { Platform } from "@/lib/types";

const live = process.argv.includes("--live");
const writeCatalog = process.argv.includes("--write-catalog");

async function writeCatalogProducts(results: Awaited<ReturnType<typeof crawlSource>>[]) {
  if (!shouldPersistCatalog(results)) {
    return {
      written: false,
      message: "No catalog file was written because the live crawl produced no product listings."
    };
  }

  const products = buildProductsFromCrawledListings(results.flatMap((result) => result.items));
  const catalogPath = path.join(process.cwd(), "data", "catalog", "products.json");
  await fs.mkdir(path.dirname(catalogPath), { recursive: true });
  await fs.writeFile(catalogPath, `${JSON.stringify(products, null, 2)}\n`, "utf8");

  return {
    written: true,
    productCount: products.length,
    catalogPath
  };
}

if (live) {
  const platformArg = process.argv.find((arg) => arg.startsWith("--platform="));
  const platform = platformArg?.split("=")[1];

  if (platform && platform !== "tiktok" && platform !== "temu") {
    console.error("Use --platform=tiktok or --platform=temu when running --live.");
    process.exit(1);
  }

  const platforms: Platform[] = platform ? [platform as Platform] : ["tiktok", "temu"];
  const results = await Promise.all(platforms.map((sourcePlatform) => crawlSource({ platform: sourcePlatform, dryRun: false })));
  const catalogWrite = writeCatalog ? await writeCatalogProducts(results) : undefined;

  console.log(
    JSON.stringify(
      {
        mode: "live",
        results,
        catalogWrite
      },
      null,
      2
    )
  );
} else {
  const result = await runDrySync();
  console.log(JSON.stringify(result, null, 2));
}

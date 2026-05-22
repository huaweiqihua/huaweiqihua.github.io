import { crawlSource, runDrySync } from "@/lib/sync/crawler";

const live = process.argv.includes("--live");

if (live) {
  const platformArg = process.argv.find((arg) => arg.startsWith("--platform="));
  const platform = platformArg?.split("=")[1];

  if (platform !== "tiktok" && platform !== "temu") {
    console.error("Use --platform=tiktok or --platform=temu when running --live.");
    process.exit(1);
  }

  const result = await crawlSource({ platform, dryRun: false });
  console.log(JSON.stringify(result, null, 2));
} else {
  const result = await runDrySync();
  console.log(JSON.stringify(result, null, 2));
}

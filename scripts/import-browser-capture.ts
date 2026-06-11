import fs from "node:fs/promises";
import path from "node:path";
import { productsFromBrowserCapture, type BrowserCapture } from "@/lib/sync/browser-capture";

const inputArg = process.argv.find((arg) => arg.startsWith("--input="))?.split("=")[1];
const outputArg = process.argv.find((arg) => arg.startsWith("--output="))?.split("=")[1];

if (!inputArg) {
  console.error("Use --input=/absolute/or/relative/capture.json.");
  process.exit(1);
}

const inputPath = path.resolve(process.cwd(), inputArg);
const outputPath = path.resolve(process.cwd(), outputArg ?? "data/catalog/products.json");
const capture = JSON.parse(await fs.readFile(inputPath, "utf8")) as BrowserCapture;
const products = productsFromBrowserCapture(capture);

if (products.length === 0) {
  console.error("No products were found in the browser capture. The catalog was not overwritten.");
  process.exit(1);
}

await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, `${JSON.stringify(products, null, 2)}\n`, "utf8");

console.log(JSON.stringify({ importedProducts: products.length, outputPath }, null, 2));

import fs from "node:fs";
import path from "node:path";
import { sampleProducts } from "@/lib/sample-data";
import type { Product } from "@/lib/types";

const catalogPath = path.join(process.cwd(), "data", "catalog", "products.json");

function isProduct(value: unknown): value is Product {
  if (!value || typeof value !== "object") {
    return false;
  }

  const product = value as Partial<Product>;
  return (
    typeof product.id === "string" &&
    typeof product.slug === "string" &&
    typeof product.displayName === "string" &&
    typeof product.primaryImageUrl === "string" &&
    Array.isArray(product.listings) &&
    Array.isArray(product.media) &&
    Array.isArray(product.reviews)
  );
}

export function readGeneratedProducts(): Product[] {
  try {
    if (!fs.existsSync(catalogPath)) {
      return [];
    }

    const parsed = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
    return Array.isArray(parsed) ? parsed.filter(isProduct) : [];
  } catch {
    return [];
  }
}

export function getCatalogProducts() {
  const generatedProducts = readGeneratedProducts();
  return generatedProducts.length > 0 ? generatedProducts : sampleProducts;
}

export function getCatalogSourceLabel() {
  return readGeneratedProducts().length > 0 ? "generated" : "sample";
}

export { catalogPath };

import { buildProductsFromCrawledListings } from "@/lib/sync/catalog-snapshot";
import { extractListingsFromCandidates, type PageCandidate } from "@/lib/sync/extraction";
import type { Platform, Product } from "@/lib/types";

export interface BrowserCapture {
  platform: Platform;
  pageUrl: string;
  capturedAt?: string;
  candidates: PageCandidate[];
}

export function productsFromBrowserCapture(capture: BrowserCapture): Product[] {
  const hasStoreBoundary = capture.candidates.some((candidate) => typeof candidate.isStoreItem === "boolean");
  const candidates = hasStoreBoundary ? capture.candidates.filter((candidate) => candidate.isStoreItem !== false) : capture.candidates;
  const listings = extractListingsFromCandidates({
    platform: capture.platform,
    pageUrl: capture.pageUrl,
    candidates
  });

  return buildProductsFromCrawledListings(listings, capture.capturedAt);
}

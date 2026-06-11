import { normalizeTitle, scoreListingMatch } from "@/lib/sync/matcher";
import type { CrawledListing } from "@/lib/sync/extraction";
import type { Platform, PlatformListing, Product, ProductMedia, ProductReview } from "@/lib/types";

interface CrawlResultForPersistence {
  platform?: Platform;
  sourceUrl?: string;
  mode?: "dry-run" | "live";
  itemsDiscovered: number;
  status: "success" | "partial" | "failed";
  items?: CrawledListing[];
  accessIssue?: unknown;
  message?: string;
}

interface ProductGroup {
  tiktok?: CrawledListing;
  temu?: CrawledListing;
  confidenceScore?: number;
  matchReasons?: string[];
}

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 72) || "marketplace-product"
  );
}

function platformProductId(listing: CrawledListing) {
  try {
    const url = new URL(listing.productUrl);
    return url.searchParams.get("goods_id") ?? url.pathname.split("/").filter(Boolean).at(-1) ?? listing.productUrl;
  } catch {
    return listing.productUrl;
  }
}

function pickPrimaryListing(group: ProductGroup) {
  return group.tiktok ?? group.temu;
}

function makeListing(listing: CrawledListing, slug: string, capturedAt: string): PlatformListing {
  return {
    id: `listing_${slug}_${listing.platform}`,
    platform: listing.platform,
    platformProductId: platformProductId(listing),
    sourceUrl: listing.productUrl,
    canonicalUrl: listing.productUrl,
    rawTitle: listing.title,
    normalizedTitle: normalizeTitle(listing.title),
    priceAmount: listing.priceAmount,
    priceCurrency: listing.priceCurrency,
    thumbnailUrl: listing.imageUrl,
    description: listing.title,
    availability: "unknown",
    ratingAverage: listing.ratingAverage,
    reviewCount: listing.reviewCount,
    soldCount: listing.soldCount,
    lastSeenAt: capturedAt,
    lastSuccessfulCrawlAt: capturedAt
  };
}

function makeMedia(listing: CrawledListing, slug: string, sortOrder: number): ProductMedia {
  return {
    id: `media_${slug}_${listing.platform}_primary`,
    platform: listing.platform,
    platformListingId: `listing_${slug}_${listing.platform}`,
    type: "image",
    role: "primary",
    sourceUrl: listing.imageUrl,
    alt: listing.title,
    sortOrder
  };
}

function makeReviews(listing: CrawledListing, slug: string, capturedAt: string): ProductReview[] {
  return listing.reviewSnippets.map((snippet, index) => ({
    id: `review_${slug}_${listing.platform}_${index + 1}`,
    platform: listing.platform,
    platformListingId: `listing_${slug}_${listing.platform}`,
    rating: 5,
    text: snippet,
    reviewerDisplayName: `${listing.platform === "tiktok" ? "TikTok" : "Temu"} buyer`,
    reviewDate: capturedAt.slice(0, 10),
    sourceUrl: listing.productUrl,
    language: "en",
    isFeatured: index === 0,
    isHidden: false
  }));
}

function pairListings(listings: CrawledListing[]) {
  const tiktokListings = listings.filter((listing) => listing.platform === "tiktok");
  const temuListings = listings.filter((listing) => listing.platform === "temu");
  const usedTemu = new Set<CrawledListing>();
  const groups: ProductGroup[] = [];

  for (const tiktok of tiktokListings) {
    let bestMatch: { listing: CrawledListing; score: number; reasons: string[] } | null = null;

    for (const temu of temuListings) {
      if (usedTemu.has(temu)) {
        continue;
      }

      const match = scoreListingMatch({
        tiktokTitle: tiktok.title,
        temuTitle: temu.title,
        tiktokImageUrl: tiktok.imageUrl,
        temuImageUrl: temu.imageUrl,
        tiktokPrice: tiktok.priceAmount ?? undefined,
        temuPrice: temu.priceAmount ?? undefined
      });

      if (!bestMatch || match.score > bestMatch.score) {
        bestMatch = { listing: temu, score: match.score, reasons: match.reasons };
      }
    }

    if (bestMatch && bestMatch.score >= 0.65) {
      usedTemu.add(bestMatch.listing);
      groups.push({
        tiktok,
        temu: bestMatch.listing,
        confidenceScore: bestMatch.score,
        matchReasons: bestMatch.reasons
      });
    } else {
      groups.push({ tiktok });
    }
  }

  for (const temu of temuListings) {
    if (!usedTemu.has(temu)) {
      groups.push({ temu });
    }
  }

  return groups;
}

function makeSourceCue(group: ProductGroup) {
  if (group.tiktok && group.temu) {
    return "TikTok image · 2 prices";
  }

  return group.tiktok ? "TikTok only · synced" : "Temu only · synced";
}

function makeCategory(title: string) {
  return /kit|model|assembly|mecha|robot|garage|diorama/i.test(title) ? "Building Kits" : "Designer Toys";
}

function makeProduct(group: ProductGroup, capturedAt: string, usedSlugs: Set<string>): Product {
  const primary = pickPrimaryListing(group);

  if (!primary) {
    throw new Error("Cannot create a product without at least one marketplace listing.");
  }

  let slug = slugify(primary.title);
  let suffix = 2;

  while (usedSlugs.has(slug)) {
    slug = `${slugify(primary.title)}-${suffix}`;
    suffix += 1;
  }

  usedSlugs.add(slug);

  const orderedListings = [group.tiktok, group.temu].filter((listing): listing is CrawledListing => Boolean(listing));
  const listings = orderedListings.map((listing) => makeListing(listing, slug, capturedAt));
  const media = orderedListings.map((listing, index) => makeMedia(listing, slug, index + 1));
  const reviews = orderedListings.flatMap((listing) => makeReviews(listing, slug, capturedAt));
  const matchStatus = group.tiktok && group.temu ? "matched" : "single_source";
  const bestDescription = primary.title;

  return {
    id: `prod_${slug}`,
    slug,
    displayName: primary.title,
    sellingPoint: `${primary.title} with live marketplace price comparison.`,
    description: bestDescription,
    primaryImageUrl: primary.imageUrl,
    primarySource: primary.platform,
    visibility: "visible",
    matchStatus,
    category: makeCategory(primary.title),
    sourceCue: makeSourceCue(group),
    listings,
    media,
    reviews,
    match:
      group.tiktok && group.temu
        ? {
            id: `match_${slug}`,
            tiktokListingId: `listing_${slug}_tiktok`,
            temuListingId: `listing_${slug}_temu`,
            confidenceScore: group.confidenceScore ?? 0,
            matchReasons: group.matchReasons ?? [],
            status: "approved"
          }
        : undefined,
    priceHistory: listings
      .filter((listing) => listing.priceAmount !== null)
      .map((listing) => ({
        id: `price_${listing.id}_${capturedAt.slice(0, 10)}`,
        platformListingId: listing.id,
        priceAmount: listing.priceAmount ?? 0,
        priceCurrency: listing.priceCurrency,
        availability: listing.availability,
        capturedAt
      })),
    createdAt: capturedAt,
    updatedAt: capturedAt
  };
}

export function buildProductsFromCrawledListings(listings: CrawledListing[], capturedAt = new Date().toISOString()): Product[] {
  const usedSlugs = new Set<string>();
  return pairListings(listings).map((group) => makeProduct(group, capturedAt, usedSlugs));
}

export function shouldPersistCatalog(results: CrawlResultForPersistence[]) {
  const discoveredItems = results.reduce((sum, result) => sum + (result.items?.length ?? result.itemsDiscovered), 0);

  if (discoveredItems === 0) {
    return false;
  }

  return results.some((result) => result.status === "success" || result.status === "partial");
}

import { getCatalogProducts } from "@/lib/catalog-source";
import { sampleSyncErrors, sampleSyncRuns } from "@/lib/sample-data";
import type { Platform, PlatformListing, Product, ProductReview } from "@/lib/types";

interface PriceDisplayOptions {
  targetCurrency?: string;
  targetMarketLabel?: string;
}

export interface ListingPriceDisplay {
  primaryText: string;
  secondaryText: string;
  capturedText?: string;
  isTargetMarketPrice: boolean;
}

export function listProducts(products: Product[] = getCatalogProducts()) {
  return products;
}

export function listVisibleProducts(products: Product[] = getCatalogProducts()) {
  return products.filter((product) => product.visibility === "visible");
}

export function getProductBySlug(slug: string, products: Product[] = getCatalogProducts()) {
  return products.find((product) => product.slug === slug);
}

export function getBestListing(product: Product): PlatformListing {
  const availableListings = product.listings.filter((listing) => listing.priceAmount !== null);

  if (availableListings.length === 0) {
    throw new Error(`Product ${product.slug} has no priced listings`);
  }

  return availableListings.reduce((best, listing) => {
    if (listing.priceAmount === null) {
      return best;
    }

    if (best.priceAmount === null || listing.priceAmount < best.priceAmount) {
      return listing;
    }

    return best;
  });
}

export function getListing(product: Product, platform: Platform) {
  return product.listings.find((listing) => listing.platform === platform);
}

export function getTargetPriceCurrency() {
  return (process.env.NEXT_PUBLIC_TARGET_PRICE_CURRENCY || "USD").toUpperCase();
}

export function getTargetMarketLabel() {
  return process.env.NEXT_PUBLIC_TARGET_MARKET_LABEL || "US";
}

function getPlatformDisplayName(platform: Platform) {
  return platform === "tiktok" ? "TikTok" : "Temu";
}

export function formatPrice(listing: PlatformListing | undefined) {
  if (!listing || listing.priceAmount === null) {
    return "Not listed";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: listing.priceCurrency
  }).format(listing.priceAmount);
}

export function isTargetMarketPrice(
  listing: PlatformListing | undefined,
  targetCurrency = getTargetPriceCurrency()
) {
  return Boolean(
    listing &&
      listing.priceAmount !== null &&
      listing.priceCurrency.toUpperCase() === targetCurrency.toUpperCase()
  );
}

export function getBestTargetMarketListing(
  product: Product,
  targetCurrency = getTargetPriceCurrency()
) {
  const targetListings = product.listings.filter((listing) => isTargetMarketPrice(listing, targetCurrency));

  if (targetListings.length === 0) {
    return undefined;
  }

  return targetListings.reduce((best, listing) => {
    if (best.priceAmount === null || listing.priceAmount === null) {
      return best;
    }

    return listing.priceAmount < best.priceAmount ? listing : best;
  });
}

export function getPublicPriceListing(product: Product) {
  return getBestTargetMarketListing(product) ?? getBestListing(product);
}

export function getListingPriceDisplay(
  listing: PlatformListing | undefined,
  options: PriceDisplayOptions = {}
): ListingPriceDisplay {
  if (!listing || listing.priceAmount === null) {
    return {
      primaryText: "See local price",
      secondaryText: "Open marketplace for local price",
      isTargetMarketPrice: false
    };
  }

  const targetCurrency = (options.targetCurrency ?? getTargetPriceCurrency()).toUpperCase();
  const targetMarketLabel = options.targetMarketLabel ?? getTargetMarketLabel();
  const platformName = getPlatformDisplayName(listing.platform);

  if (isTargetMarketPrice(listing, targetCurrency)) {
    return {
      primaryText: formatPrice(listing),
      secondaryText: `From ${platformName}`,
      isTargetMarketPrice: true
    };
  }

  return {
    primaryText: "See local price",
    secondaryText: `Open ${platformName} for ${targetMarketLabel} price`,
    capturedText: `Captured ${listing.priceCurrency.toUpperCase()} price: ${formatPrice(listing)}`,
    isTargetMarketPrice: false
  };
}

export function getRatingAverage(product: Product) {
  const ratings = product.listings
    .map((listing) => listing.ratingAverage)
    .filter((rating): rating is number => typeof rating === "number");

  if (ratings.length === 0) {
    return null;
  }

  const total = ratings.reduce((sum, rating) => sum + rating, 0);
  return Number((total / ratings.length).toFixed(1));
}

export function getReviewCount(product: Product) {
  return product.listings.reduce((sum, listing) => sum + listing.reviewCount, 0);
}

export function getSoldCount(product: Product) {
  return product.listings.reduce((sum, listing) => sum + (listing.soldCount ?? 0), 0);
}

export function getReviewHighlights(product: Product, limit = 3): ProductReview[] {
  return product.reviews
    .filter((review) => !review.isHidden)
    .sort((left, right) => {
      if (left.isFeatured !== right.isFeatured) {
        return left.isFeatured ? -1 : 1;
      }

      return right.rating - left.rating;
    })
    .slice(0, limit)
    .map((review) => ({
      ...review,
      text: review.curatedText ?? review.text
    }));
}

export function listPendingMatches(products: Product[] = getCatalogProducts()) {
  return products.filter((product) => product.match?.status === "pending");
}

export function getDashboardStats(products: Product[] = getCatalogProducts()) {
  const visibleProducts = listVisibleProducts(products);
  const matchedProducts = products.filter((product) => product.matchStatus === "matched");
  const pendingMatches = listPendingMatches(products);
  const featuredReviews = products.flatMap((product) => getReviewHighlights(product, 10));

  return {
    visibleProductCount: visibleProducts.length,
    matchedProductCount: matchedProducts.length,
    pendingMatchCount: pendingMatches.length,
    featuredReviewCount: featuredReviews.length,
    syncErrorCount: sampleSyncErrors.length,
    lastSyncStatus: sampleSyncRuns[0]?.status ?? "failed"
  };
}

export function getPrimaryMedia(product: Product) {
  return (
    product.media.find((item) => item.role === "primary" && item.platform === product.primarySource) ??
    product.media.find((item) => item.role === "primary") ??
    null
  );
}

export function listSyncRuns() {
  return sampleSyncRuns;
}

export function listSyncErrors() {
  return sampleSyncErrors;
}

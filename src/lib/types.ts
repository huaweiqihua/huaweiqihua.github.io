export type Platform = "tiktok" | "temu";

export type ProductVisibility = "visible" | "hidden" | "draft";

export type MatchStatus = "matched" | "single_source" | "pending_review";

export type ListingAvailability = "in_stock" | "out_of_stock" | "unknown";

export type MediaRole = "primary" | "gallery" | "promo_video" | "test_video";

export type MediaType = "image" | "video" | "embed";

export type MatchReviewStatus = "pending" | "approved" | "rejected";

export interface PlatformListing {
  id: string;
  platform: Platform;
  platformProductId: string;
  sourceUrl: string;
  canonicalUrl: string;
  rawTitle: string;
  normalizedTitle: string;
  priceAmount: number | null;
  priceCurrency: string;
  thumbnailUrl: string;
  description: string;
  availability: ListingAvailability;
  ratingAverage: number | null;
  reviewCount: number;
  soldCount?: number;
  lastSeenAt: string;
  lastSuccessfulCrawlAt: string;
}

export interface ProductMedia {
  id: string;
  platform: Platform;
  platformListingId: string;
  type: MediaType;
  role: MediaRole;
  sourceUrl: string;
  cachedUrl?: string;
  alt: string;
  sortOrder: number;
}

export interface ProductReview {
  id: string;
  platform: Platform;
  platformListingId: string;
  rating: number;
  text: string;
  reviewerDisplayName: string;
  reviewDate: string;
  sourceUrl: string;
  language: string;
  isFeatured: boolean;
  isHidden: boolean;
  curatedText?: string;
}

export interface ProductMatch {
  id: string;
  tiktokListingId?: string;
  temuListingId?: string;
  confidenceScore: number;
  matchReasons: string[];
  status: MatchReviewStatus;
}

export interface PriceHistoryPoint {
  id: string;
  platformListingId: string;
  priceAmount: number;
  priceCurrency: string;
  availability: ListingAvailability;
  capturedAt: string;
}

export interface Product {
  id: string;
  slug: string;
  displayName: string;
  sellingPoint: string;
  description: string;
  primaryImageUrl: string;
  primarySource: Platform | "manual";
  visibility: ProductVisibility;
  matchStatus: MatchStatus;
  category: string;
  sourceCue: string;
  listings: PlatformListing[];
  media: ProductMedia[];
  reviews: ProductReview[];
  match?: ProductMatch;
  priceHistory: PriceHistoryPoint[];
  createdAt: string;
  updatedAt: string;
}

export interface SyncRun {
  id: string;
  platform: Platform;
  sourceUrl: string;
  status: "success" | "partial" | "failed";
  startedAt: string;
  finishedAt: string;
  itemsDiscovered: number;
  itemsUpdated: number;
  reviewsDiscovered: number;
  errorCount: number;
}

export interface SyncError {
  id: string;
  syncRunId: string;
  platform: Platform;
  url: string;
  stage: "listing" | "detail" | "media" | "reviews";
  errorCode: string;
  message: string;
  screenshotUrl?: string;
  createdAt: string;
}

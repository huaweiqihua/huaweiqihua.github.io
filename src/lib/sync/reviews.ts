import type { Platform, ProductReview } from "@/lib/types";

interface RawReview {
  id?: string;
  platform: Platform;
  platformListingId: string;
  rating?: number | null;
  text?: string | null;
  reviewerDisplayName?: string | null;
  reviewDate?: string | null;
  sourceUrl: string;
  language?: string | null;
}

export function normalizeReviewText(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

export function normalizePublicReview(raw: RawReview): ProductReview | null {
  const normalizedText = normalizeReviewText(raw.text ?? "");

  if (!normalizedText || !raw.rating) {
    return null;
  }

  return {
    id: raw.id ?? `${raw.platform}-${raw.platformListingId}-${Buffer.from(normalizedText).toString("base64url").slice(0, 12)}`,
    platform: raw.platform,
    platformListingId: raw.platformListingId,
    rating: Math.max(1, Math.min(5, raw.rating)),
    text: normalizedText,
    reviewerDisplayName: normalizeReviewText(raw.reviewerDisplayName ?? "Verified buyer"),
    reviewDate: raw.reviewDate ?? new Date().toISOString().slice(0, 10),
    sourceUrl: raw.sourceUrl,
    language: raw.language ?? "en",
    isFeatured: raw.rating >= 5,
    isHidden: false
  };
}

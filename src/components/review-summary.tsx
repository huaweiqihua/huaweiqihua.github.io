import { Star } from "lucide-react";
import type { ProductReview } from "@/lib/types";

interface ReviewSummaryProps {
  rating: number | null;
  reviewCount: number;
  soldCount?: number;
  reviews: ProductReview[];
  compact?: boolean;
}

export function ReviewSummary({ rating, reviewCount, soldCount = 0, reviews, compact = false }: ReviewSummaryProps) {
  if (!rating && reviewCount === 0 && soldCount === 0 && reviews.length === 0) {
    return null;
  }

  const secondaryText =
    reviewCount > 0
      ? `${reviewCount.toLocaleString("en-US")} reviews`
      : soldCount > 0
        ? `${soldCount.toLocaleString("en-US")} sold`
        : "Review highlights";
  const labelText = rating ? `${rating.toFixed(1)} / 5` : soldCount > 0 ? "Temu sales" : "Reviews";

  return (
    <section
      className={
        compact
          ? "flex items-center gap-1 text-xs text-[#cfd7e6]"
          : "rounded-lg border border-white/10 bg-white/[0.05] p-5"
      }
      aria-label="Review summary"
    >
      <div className="flex items-center gap-2">
        <Star className="h-4 w-4 fill-[#ccff3f] text-[#ccff3f]" aria-hidden="true" />
        <span className={compact ? "font-bold" : "text-lg font-black text-[#f8f4ea]"}>
          {labelText}
        </span>
        <span className="text-[#9da7b8]">{secondaryText}</span>
      </div>
      {!compact && reviews.length > 0 ? (
        <div className="mt-4">
          <h2 className="text-base font-black text-[#f8f4ea]">Review highlights</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {reviews.map((review) => (
              <figure key={review.id} className="rounded-lg border border-white/10 bg-[#07080d]/60 p-4">
                <blockquote className="text-sm leading-6 text-[#dfe6f2]">"{review.text}"</blockquote>
                <figcaption className="mt-3 text-xs font-semibold text-[#9da7b8]">
                  {review.reviewerDisplayName} · {review.platform === "tiktok" ? "TikTok Shop" : "Temu"}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

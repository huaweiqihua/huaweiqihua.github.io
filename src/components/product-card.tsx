import Link from "next/link";
import { getBestListing, getRatingAverage, getReviewCount, getSoldCount } from "@/lib/catalog";
import type { Product } from "@/lib/types";
import { ReviewSummary } from "@/components/review-summary";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const bestListing = getBestListing(product);
  const rating = getRatingAverage(product);
  const reviewCount = getReviewCount(product);
  const soldCount = getSoldCount(product);

  return (
    <article className="group overflow-hidden rounded-lg border border-white/10 bg-[#10131d]/90 transition duration-200 hover:-translate-y-1 hover:border-[#ccff3f]/70">
      <Link href={`/products/${product.slug}`} className="block" aria-label={`View ${product.displayName}`}>
        <div className="relative aspect-square overflow-hidden bg-[#171b28]">
          <img
            src={product.primaryImageUrl}
            alt={product.displayName}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
          <div className="absolute left-2 right-2 top-2 flex items-start justify-between gap-2">
            <span className="rounded-md bg-[#ccff3f] px-2 py-1 text-[11px] font-black text-[#07080d]">
              {product.primarySource === "tiktok" ? "TikTok image" : "Temu image"}
            </span>
            <span className="rounded-md border border-white/15 bg-[#07080d]/80 px-2 py-1 text-[11px] font-bold text-white">
              {product.listings.length} {product.listings.length === 1 ? "price" : "prices"}
            </span>
          </div>
        </div>
      </Link>
      <div className="p-4">
        <div className="mb-3">
          <ReviewSummary rating={rating} reviewCount={reviewCount} soldCount={soldCount} reviews={[]} compact />
        </div>
        <h2 className="min-h-10 text-base font-black leading-5 text-[#f8f4ea]">{product.displayName}</h2>
        <p className="mt-2 min-h-12 text-sm leading-6 text-[#9da7b8]">{product.sellingPoint}</p>
        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xl font-black text-[#f8f4ea]">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: bestListing.priceCurrency
              }).format(bestListing.priceAmount ?? 0)}
            </p>
            <p className="text-xs font-semibold text-[#9da7b8]">
              From {bestListing.platform === "tiktok" ? "TikTok" : "Temu"}
            </p>
          </div>
          <Link
            href={`/products/${product.slug}`}
            className="rounded-lg bg-[#35d7ff] px-3 py-2 text-sm font-black text-[#071018]"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}

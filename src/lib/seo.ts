import { getRatingAverage, getReviewCount, getReviewHighlights, isTargetMarketPrice } from "@/lib/catalog";
import type { Product } from "@/lib/types";

export function getSiteUrl() {
  const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  try {
    return new URL(rawUrl.endsWith("/") ? rawUrl : `${rawUrl}/`);
  } catch {
    return new URL("http://localhost:3000/");
  }
}

export function absoluteUrl(pathname: string) {
  return new URL(pathname, getSiteUrl()).toString();
}

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function productImages(product: Product) {
  return unique([
    product.primaryImageUrl,
    ...product.media.filter((media) => media.type === "image").map((media) => media.sourceUrl)
  ]);
}

export function createProductJsonLd(product: Product) {
  const rating = getRatingAverage(product);
  const reviewCount = getReviewCount(product);
  const offers = product.listings.map((listing) => {
    const offer: Record<string, unknown> = {
      "@type": "Offer",
      url: listing.canonicalUrl,
      availability:
        listing.availability === "out_of_stock" ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: listing.platform === "tiktok" ? "TikTok Shop" : "Temu"
      }
    };

    if (isTargetMarketPrice(listing)) {
      offer.price = listing.priceAmount?.toFixed(2);
      offer.priceCurrency = listing.priceCurrency;
    }

    return offer;
  });
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.displayName,
    image: productImages(product),
    description: product.description || product.sellingPoint,
    sku: product.id,
    category: product.category,
    url: absoluteUrl(`/products/${product.slug}`),
    offers: offers.length > 1 ? offers : (offers[0] ?? {
      "@type": "Offer",
      url: absoluteUrl(`/products/${product.slug}`),
      availability: "https://schema.org/InStock"
    })
  };

  if (rating !== null && reviewCount > 0) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: rating.toFixed(1),
      reviewCount
    };
  }

  const reviews = getReviewHighlights(product, 3);

  if (reviews.length > 0) {
    jsonLd.review = reviews.map((review) => ({
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating,
        bestRating: 5
      },
      author: {
        "@type": "Person",
        name: review.reviewerDisplayName
      },
      reviewBody: review.text
    }));
  }

  return jsonLd;
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

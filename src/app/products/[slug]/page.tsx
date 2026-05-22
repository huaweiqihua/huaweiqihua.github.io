import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Play } from "lucide-react";
import { ReviewSummary } from "@/components/review-summary";
import { SiteHeader } from "@/components/site-header";
import {
  formatPrice,
  getListing,
  getProductBySlug,
  getRatingAverage,
  getReviewCount,
  getReviewHighlights
} from "@/lib/catalog";
import { sampleProducts } from "@/lib/sample-data";
import type { PlatformListing, Product } from "@/lib/types";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return sampleProducts.filter((product) => product.visibility === "visible").map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product not found"
    };
  }

  return {
    title: product.displayName,
    description: product.sellingPoint,
    openGraph: {
      title: product.displayName,
      description: product.sellingPoint,
      images: [product.primaryImageUrl]
    }
  };
}

function MarketplaceCard({ listing }: { listing: PlatformListing | undefined }) {
  if (!listing) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
        <p className="text-sm font-bold text-[#9da7b8]">Not listed on this marketplace yet.</p>
      </div>
    );
  }

  const platformName = listing.platform === "tiktok" ? "TikTok Shop" : "Temu";

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.05] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-[#f8f4ea]">{platformName}</h2>
          <p className="mt-1 text-xs font-semibold text-[#9da7b8]">
            Updated {new Date(listing.lastSuccessfulCrawlAt).toLocaleDateString("en-US")}
          </p>
        </div>
        <p className="text-2xl font-black text-[#f8f4ea]">{formatPrice(listing)}</p>
      </div>
      <a
        href={listing.canonicalUrl}
        className={
          listing.platform === "tiktok"
            ? "mt-4 flex h-11 items-center justify-center gap-2 rounded-lg bg-[#ff4b87] text-sm font-black text-white"
            : "mt-4 flex h-11 items-center justify-center gap-2 rounded-lg bg-[#ffb24a] text-sm font-black text-[#17100a]"
        }
      >
        Buy on {listing.platform === "tiktok" ? "TikTok" : "Temu"}
        <ExternalLink className="h-4 w-4" aria-hidden="true" />
      </a>
    </div>
  );
}

function VideoPanel({ product }: { product: Product }) {
  const videos = product.media.filter((media) => media.type === "embed" || media.type === "video");

  if (videos.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-white/15 bg-white/[0.03] p-5 text-sm leading-6 text-[#9da7b8]">
        TikTok video will appear here after the next successful media crawl.
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {videos.map((video) => (
        <a
          key={video.id}
          href={video.sourceUrl}
          className="flex min-h-36 items-center justify-center rounded-lg border border-white/10 bg-[linear-gradient(135deg,rgba(255,75,135,.28),rgba(53,215,255,.14))] p-5 text-center text-sm font-black text-white"
        >
          <span className="flex items-center gap-2">
            <Play className="h-5 w-5 fill-white" aria-hidden="true" />
            {video.role === "promo_video" ? "TikTok promo video" : "Build/test clip"}
          </span>
        </a>
      ))}
    </div>
  );
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product || product.visibility !== "visible") {
    notFound();
  }

  const tiktokListing = getListing(product, "tiktok");
  const temuListing = getListing(product, "temu");
  const rating = getRatingAverage(product);
  const reviewCount = getReviewCount(product);
  const highlights = getReviewHighlights(product);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#07080d_0%,#0e111a_52%,#07080d_100%)] text-[#f8f4ea]">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#9da7b8] hover:text-white">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to drops
        </Link>
        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,.95fr)]">
          <div>
            <div className="overflow-hidden rounded-lg border border-white/10 bg-[#10131d]">
              <img src={product.primaryImageUrl} alt={product.displayName} className="aspect-square w-full object-cover" />
            </div>
            <div className="mt-4">
              <VideoPanel product={product} />
            </div>
          </div>
          <div className="space-y-5">
            <div>
              <p className="text-xs font-black uppercase text-[#ccff3f]">{product.sourceCue}</p>
              <h1 className="mt-2 text-4xl font-black leading-none tracking-normal text-[#f8f4ea] sm:text-6xl">
                {product.displayName}
              </h1>
              <p className="mt-4 text-lg leading-8 text-[#dbe3ef]">{product.sellingPoint}</p>
            </div>
            <ReviewSummary rating={rating} reviewCount={reviewCount} reviews={highlights} />
            <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
              <h2 className="text-lg font-black text-[#f8f4ea]">TikTok product detail</h2>
              <p className="mt-3 text-sm leading-7 text-[#b8c2d4]">{product.description}</p>
            </section>
            <div className="grid gap-4 md:grid-cols-2">
              <MarketplaceCard listing={tiktokListing} />
              <MarketplaceCard listing={temuListing} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

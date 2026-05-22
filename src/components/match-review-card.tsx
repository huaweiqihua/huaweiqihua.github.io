import type { Product } from "@/lib/types";
import { formatPrice, getListing } from "@/lib/catalog";

export function MatchReviewCard({ product }: { product: Product }) {
  const tiktok = getListing(product, "tiktok");
  const temu = getListing(product, "temu");
  const confidence = Math.round((product.match?.confidenceScore ?? 0) * 100);

  return (
    <article className="rounded-lg border border-[#dfe4ec] bg-white">
      <div className="grid gap-0 lg:grid-cols-[1fr_1fr_220px]">
        <section className="border-b border-[#dfe4ec] p-4 lg:border-b-0 lg:border-r">
          <p className="text-xs font-black uppercase text-[#687082]">TikTok source</p>
          <div className="mt-3 flex gap-3">
            <img src={product.primaryImageUrl} alt="" className="h-16 w-16 rounded-lg object-cover" />
            <div>
              <h2 className="font-black">{tiktok?.rawTitle ?? product.displayName}</h2>
              <p className="mt-1 text-sm text-[#687082]">{formatPrice(tiktok)}</p>
            </div>
          </div>
        </section>
        <section className="border-b border-[#dfe4ec] p-4 lg:border-b-0 lg:border-r">
          <p className="text-xs font-black uppercase text-[#687082]">Temu candidate</p>
          <div className="mt-3 flex gap-3">
            <img src={temu?.thumbnailUrl ?? product.primaryImageUrl} alt="" className="h-16 w-16 rounded-lg object-cover" />
            <div>
              <h2 className="font-black">{temu?.rawTitle ?? "No Temu candidate"}</h2>
              <p className="mt-1 text-sm text-[#687082]">{formatPrice(temu)}</p>
            </div>
          </div>
        </section>
        <section className="p-4">
          <p className="text-xs font-black uppercase text-[#687082]">Decision</p>
          <p className="mt-2 text-4xl font-black">{confidence}%</p>
          <p className="mt-1 text-xs text-[#687082]">{product.match?.matchReasons.join(", ")}</p>
          <div className="mt-4 grid gap-2">
            <button type="button" className="h-10 rounded-lg bg-[#ccff3f] text-sm font-black text-[#141821]">
              Approve match
            </button>
            <button type="button" className="h-10 rounded-lg border border-[#dfe4ec] text-sm font-black text-[#384152]">
              Reject
            </button>
          </div>
        </section>
      </div>
    </article>
  );
}

import type { Product } from "@/lib/types";
import { getReviewHighlights } from "@/lib/catalog";

export function ReviewCurationTable({ products }: { products: Product[] }) {
  const rows = products.flatMap((product) =>
    getReviewHighlights(product, 10).map((review) => ({
      product,
      review
    }))
  );

  return (
    <div className="overflow-hidden rounded-lg border border-[#dfe4ec] bg-white">
      <table className="w-full min-w-[760px] border-collapse text-left text-sm">
        <thead className="bg-[#eef2f7] text-xs font-black uppercase text-[#687082]">
          <tr>
            <th className="px-4 py-3">Product</th>
            <th className="px-4 py-3">Source</th>
            <th className="px-4 py-3">Review</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr className="border-t border-[#dfe4ec]">
              <td colSpan={4} className="px-4 py-8 text-center text-sm font-bold text-[#687082]">
                No review snippets available yet. Import authenticated TikTok or Temu detail captures to populate
                review curation.
              </td>
            </tr>
          ) : (
            rows.map(({ product, review }) => (
              <tr key={review.id} className="border-t border-[#dfe4ec]">
                <td className="px-4 py-3 font-bold">{product.displayName}</td>
                <td className="px-4 py-3 text-[#687082]">{review.platform === "tiktok" ? "TikTok Shop" : "Temu"}</td>
                <td className="px-4 py-3 text-[#384152]">{review.text}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button type="button" className="rounded-lg bg-[#141821] px-3 py-2 text-xs font-black text-white">
                      Feature review
                    </button>
                    <button type="button" className="rounded-lg border border-[#dfe4ec] px-3 py-2 text-xs font-black">
                      Hide review
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

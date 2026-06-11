import { AdminShell } from "@/components/admin-shell";
import { MatchReviewCard } from "@/components/match-review-card";
import { listProducts } from "@/lib/catalog";

export default function AdminMatchesPage() {
  const candidates = listProducts().filter((product) => product.match);

  return (
    <AdminShell title="Match Review" eyebrow="TikTok + Temu pairing">
      <div className="grid gap-4">
        {candidates.length > 0 ? (
          candidates.map((product) => <MatchReviewCard key={product.id} product={product} />)
        ) : (
          <div className="rounded-lg border border-dashed border-[#c9d1dd] bg-white p-6">
            <h2 className="text-lg font-black text-[#141821]">No match candidates yet.</h2>
            <p className="mt-2 text-sm leading-6 text-[#687082]">
              TikTok and Temu products that need manual pairing will appear here after both sources are synced.
            </p>
          </div>
        )}
      </div>
    </AdminShell>
  );
}

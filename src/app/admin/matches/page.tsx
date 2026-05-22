import { AdminShell } from "@/components/admin-shell";
import { MatchReviewCard } from "@/components/match-review-card";
import { sampleProducts } from "@/lib/sample-data";

export default function AdminMatchesPage() {
  const candidates = sampleProducts.filter((product) => product.match);

  return (
    <AdminShell title="Match Review" eyebrow="TikTok + Temu pairing">
      <div className="grid gap-4">
        {candidates.map((product) => (
          <MatchReviewCard key={product.id} product={product} />
        ))}
      </div>
    </AdminShell>
  );
}

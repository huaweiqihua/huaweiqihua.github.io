import { AdminShell } from "@/components/admin-shell";
import { ReviewCurationTable } from "@/components/review-curation-table";
import { listVisibleProducts } from "@/lib/catalog";

export default function AdminReviewsPage() {
  return (
    <AdminShell title="Reviews" eyebrow="Trust module curation">
      <ReviewCurationTable products={listVisibleProducts()} />
    </AdminShell>
  );
}

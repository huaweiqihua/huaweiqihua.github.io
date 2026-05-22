import { AdminShell } from "@/components/admin-shell";
import { AdminStatCard } from "@/components/admin-stat-card";
import { getDashboardStats, listPendingMatches, listSyncErrors, listVisibleProducts } from "@/lib/catalog";

export default function AdminDashboardPage() {
  const stats = getDashboardStats();
  const pendingMatches = listPendingMatches();
  const syncErrors = listSyncErrors();

  return (
    <AdminShell title="Admin Dashboard" eyebrow="Operations">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="Visible products" value={stats.visibleProductCount} note="Shown on the public storefront." />
        <AdminStatCard label="Matched products" value={stats.matchedProductCount} note="Approved or pending cross-platform pairs." />
        <AdminStatCard label="Pending matches" value={stats.pendingMatchCount} note="Needs owner review before merge." />
        <AdminStatCard label="Sync errors" value={stats.syncErrorCount} note="Crawler warnings from the latest run." />
      </div>
      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <section className="rounded-lg border border-[#dfe4ec] bg-white p-5">
          <h2 className="text-lg font-black">Needs attention</h2>
          <ul className="mt-4 grid gap-3 text-sm text-[#384152]">
            {pendingMatches.map((product) => (
              <li key={product.id} className="rounded-lg bg-[#f4f6f8] p-3">
                {product.displayName} · {Math.round((product.match?.confidenceScore ?? 0) * 100)}% match confidence
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-lg border border-[#dfe4ec] bg-white p-5">
          <h2 className="text-lg font-black">Latest crawler notes</h2>
          <ul className="mt-4 grid gap-3 text-sm text-[#384152]">
            {syncErrors.map((error) => (
              <li key={error.id} className="rounded-lg bg-[#f4f6f8] p-3">
                {error.errorCode}: {error.message}
              </li>
            ))}
          </ul>
        </section>
      </div>
      <p className="mt-6 text-sm text-[#687082]">{listVisibleProducts().length} products are currently available to shoppers.</p>
    </AdminShell>
  );
}

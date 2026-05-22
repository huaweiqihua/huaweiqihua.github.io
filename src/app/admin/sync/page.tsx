import { AdminShell } from "@/components/admin-shell";
import { listSyncErrors, listSyncRuns } from "@/lib/catalog";

export default function AdminSyncPage() {
  const runs = listSyncRuns();
  const errors = listSyncErrors();

  return (
    <AdminShell title="Sync Logs" eyebrow="Crawler health">
      <div className="mb-4 flex justify-end">
        <button type="button" className="h-10 rounded-lg bg-[#ccff3f] px-4 text-sm font-black text-[#141821]">
          Run sync
        </button>
      </div>
      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <section className="rounded-lg border border-[#dfe4ec] bg-white p-5">
          <h2 className="text-lg font-black">Recent runs</h2>
          <div className="mt-4 grid gap-3">
            {runs.map((run) => (
              <div key={run.id} className="rounded-lg bg-[#f4f6f8] p-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <strong>{run.platform === "tiktok" ? "TikTok Shop" : "Temu"}</strong>
                  <span className="rounded-md bg-white px-2 py-1 text-xs font-black">{run.status}</span>
                </div>
                <p className="mt-2 text-[#687082]">
                  {run.itemsUpdated} updated · {run.reviewsDiscovered} reviews · {run.errorCount} errors
                </p>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-lg border border-[#dfe4ec] bg-white p-5">
          <h2 className="text-lg font-black">Errors</h2>
          <div className="mt-4 grid gap-3">
            {errors.map((error) => (
              <div key={error.id} className="rounded-lg bg-[#fff7ed] p-3 text-sm">
                <strong>{error.errorCode}</strong>
                <p className="mt-1 text-[#684b24]">{error.message}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}

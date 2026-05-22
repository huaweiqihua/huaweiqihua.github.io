import { AdminShell } from "@/components/admin-shell";
import { formatPrice, getBestListing, listVisibleProducts } from "@/lib/catalog";

export default function AdminProductsPage() {
  const products = listVisibleProducts();

  return (
    <AdminShell title="Products" eyebrow="Catalog management">
      <div className="grid gap-3">
        {products.map((product) => (
          <article key={product.id} className="grid gap-4 rounded-lg border border-[#dfe4ec] bg-white p-4 lg:grid-cols-[72px_1fr_auto] lg:items-center">
            <img src={product.primaryImageUrl} alt="" className="h-18 w-18 rounded-lg object-cover" />
            <div>
              <h2 className="font-black">{product.displayName}</h2>
              <p className="mt-1 text-sm text-[#687082]">{product.sellingPoint}</p>
              <p className="mt-2 text-xs font-bold text-[#384152]">
                {product.sourceCue} · Best price {formatPrice(getBestListing(product))}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end">
              <button type="button" className="rounded-lg border border-[#dfe4ec] px-3 py-2 text-xs font-black">
                Edit selling point
              </button>
              <button type="button" className="rounded-lg bg-[#141821] px-3 py-2 text-xs font-black text-white">
                Hide
              </button>
            </div>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}

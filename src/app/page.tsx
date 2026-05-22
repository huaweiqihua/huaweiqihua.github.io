import { FilterBar } from "@/components/filter-bar";
import { Hero } from "@/components/hero";
import { ProductCard } from "@/components/product-card";
import { SiteHeader } from "@/components/site-header";
import { listVisibleProducts } from "@/lib/catalog";

export default function HomePage() {
  const products = listVisibleProducts();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#07080d_0%,#0e111a_48%,#07080d_100%)] text-[#f8f4ea]">
      <SiteHeader />
      <Hero />
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <FilterBar />
        <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase text-[#ccff3f]">Latest synced products</p>
            <h2 className="mt-2 text-3xl font-black tracking-normal text-[#f8f4ea]">Build-ready drops</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-[#9da7b8]">
            Public pages stay simple: product image, name, selling point, rating, best visible price, and a View
            button.
          </p>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}

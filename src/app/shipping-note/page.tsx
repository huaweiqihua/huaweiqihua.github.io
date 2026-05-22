import { SiteHeader } from "@/components/site-header";

export default function ShippingNotePage() {
  return (
    <main className="min-h-screen bg-[#07080d] text-[#f8f4ea]">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-xs font-black uppercase text-[#ccff3f]">Shipping note</p>
        <h1 className="mt-3 text-5xl font-black leading-none tracking-normal">Marketplace checkout stays on TikTok or Temu.</h1>
        <p className="mt-6 text-lg leading-8 text-[#b8c2d4]">
          ModelVault does not process payments or shipping. Prices and links are synchronized daily when crawling is
          successful, but final availability, shipping cost, taxes, and return rules are confirmed on the original
          marketplace.
        </p>
      </section>
    </main>
  );
}

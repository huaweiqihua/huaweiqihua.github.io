import { SiteHeader } from "@/components/site-header";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#07080d] text-[#f8f4ea]">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-xs font-black uppercase text-[#ccff3f]">About ModelVault</p>
        <h1 className="mt-3 text-5xl font-black leading-none tracking-normal">A cleaner shelf for model and toy drops.</h1>
        <p className="mt-6 text-lg leading-8 text-[#b8c2d4]">
          ModelVault is a discovery and price-comparison storefront for model kits, figures, and designer toys. Products
          are synchronized from TikTok Shop and Temu, then linked back to the original marketplace for purchase.
        </p>
      </section>
    </main>
  );
}

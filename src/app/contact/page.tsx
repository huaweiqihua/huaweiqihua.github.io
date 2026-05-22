import { SiteHeader } from "@/components/site-header";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#07080d] text-[#f8f4ea]">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-xs font-black uppercase text-[#ccff3f]">Contact</p>
        <h1 className="mt-3 text-5xl font-black leading-none tracking-normal">Questions about a listed drop?</h1>
        <p className="mt-6 text-lg leading-8 text-[#b8c2d4]">
          This site helps shoppers discover products and compare marketplace links. For checkout, shipping, returns, and
          order support, use the TikTok Shop or Temu product page where the purchase is completed.
        </p>
      </section>
    </main>
  );
}

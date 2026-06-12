import { describe, expect, it } from "vitest";
import AdminLayout, { metadata as adminMetadata } from "@/app/admin/layout";
import ProductPage, { generateMetadata } from "@/app/products/[slug]/page";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { listVisibleProducts } from "@/lib/catalog";
import { createProductJsonLd } from "@/lib/seo";
import { render, screen } from "@testing-library/react";

describe("SEO technical layer", () => {
  it("publishes a sitemap with public product URLs and no admin URLs", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);
    const firstProduct = listVisibleProducts()[0];

    expect(urls).toContain("http://localhost:3000/");
    expect(urls).toContain(`http://localhost:3000/products/${firstProduct.slug}`);
    expect(urls.some((url) => url.includes("/admin"))).toBe(false);
  });

  it("publishes robots rules that allow public pages and block private surfaces", () => {
    const rules = robots();

    expect(rules.sitemap).toBe("http://localhost:3000/sitemap.xml");
    expect(rules.rules).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          userAgent: "*",
          allow: "/",
          disallow: expect.arrayContaining(["/admin", "/admin/", "/api"])
        })
      ])
    );
  });

  it("adds canonical product metadata", async () => {
    const firstProduct = listVisibleProducts()[0];
    const metadata = await generateMetadata({ params: Promise.resolve({ slug: firstProduct.slug }) });

    expect(metadata.alternates).toMatchObject({
      canonical: `/products/${firstProduct.slug}`
    });
    expect(metadata.openGraph).toMatchObject({
      url: `/products/${firstProduct.slug}`
    });
  });

  it("renders Product JSON-LD on product detail pages", async () => {
    const firstProduct = listVisibleProducts()[0];
    const { container } = render(await ProductPage({ params: Promise.resolve({ slug: firstProduct.slug }) }));
    const jsonLd = container.querySelector('script[type="application/ld+json"]');

    expect(screen.getByRole("heading", { name: firstProduct.displayName })).toBeInTheDocument();
    expect(jsonLd).not.toBeNull();
    expect(JSON.parse(jsonLd?.textContent ?? "{}")).toMatchObject({
      "@context": "https://schema.org",
      "@type": "Product",
      name: firstProduct.displayName,
      image: expect.arrayContaining([firstProduct.primaryImageUrl])
    });
  });

  it("omits aggregate ratings when review data is not available", () => {
    const firstProduct = listVisibleProducts()[0];
    const jsonLd = createProductJsonLd({ ...firstProduct, reviews: [] });

    expect(jsonLd.aggregateRating).toBeUndefined();
  });

  it("publishes USD captured prices as US product offer prices", () => {
    const firstProduct = listVisibleProducts()[0];
    const jsonLd = createProductJsonLd(firstProduct);
    const firstListing = firstProduct.listings[0];

    expect(jsonLd.offers).toMatchObject({
      "@type": "Offer",
      url: firstListing.canonicalUrl,
      price: firstListing.priceAmount?.toFixed(2),
      priceCurrency: "USD"
    });
  });

  it("does not publish non-US captured prices as US product offer prices", () => {
    const firstProduct = listVisibleProducts()[0];
    const jsonLd = createProductJsonLd({
      ...firstProduct,
      listings: firstProduct.listings.map((listing) => ({
        ...listing,
        priceAmount: 27.49,
        priceCurrency: "GBP"
      }))
    });

    expect((jsonLd.offers as Record<string, unknown>).price).toBeUndefined();
    expect((jsonLd.offers as Record<string, unknown>).priceCurrency).toBeUndefined();
  });

  it("marks the admin section as noindex", () => {
    render(<AdminLayout><div>Admin child</div></AdminLayout>);

    expect(screen.getByText("Admin child")).toBeInTheDocument();
    expect(adminMetadata.robots).toMatchObject({
      index: false,
      follow: false
    });
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";
import ProductPage, { generateMetadata } from "@/app/products/[slug]/page";
import { listVisibleProducts } from "@/lib/catalog";

describe("public storefront pages", () => {
  it("renders a simple public product grid without admin-only language", () => {
    const products = listVisibleProducts();

    render(<HomePage />);

    expect(screen.getByRole("heading", { name: /model kits and toy drops/i })).toBeInTheDocument();
    expect(screen.getByText(products[0].displayName)).toBeInTheDocument();
    expect(screen.getAllByText(/TikTok image|Temu image/i).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /view/i }).length).toBeGreaterThanOrEqual(products.length);
    expect(screen.getAllByText(/see local price/i).length).toBeGreaterThan(0);
    expect(screen.queryByText("£27.49")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /admin/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/match confidence/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/sync error/i)).not.toBeInTheDocument();
  });

  it("renders marketplace price links and trust signals on product detail", async () => {
    const product = listVisibleProducts()[0];

    render(await ProductPage({ params: Promise.resolve({ slug: product.slug }) }));

    expect(screen.getByRole("heading", { name: product.displayName })).toBeInTheDocument();
    for (const listing of product.listings) {
      expect(screen.getByRole("link", { name: new RegExp(`buy on ${listing.platform}`, "i") })).toHaveAttribute(
        "href",
        listing.canonicalUrl
      );
    }
    expect(screen.getAllByText(/see local price/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/captured gbp price/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/review summary/i)).toBeInTheDocument();
  });

  it("generates product metadata from catalog data", async () => {
    const product = listVisibleProducts()[0];

    await expect(generateMetadata({ params: Promise.resolve({ slug: product.slug }) })).resolves.toMatchObject({
      title: product.displayName
    });
  });
});

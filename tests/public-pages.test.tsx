import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";
import ProductPage, { generateMetadata } from "@/app/products/[slug]/page";

describe("public storefront pages", () => {
  it("renders a simple public product grid without admin-only language", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { name: /model kits and toy drops/i })).toBeInTheDocument();
    expect(screen.getByText("Cyber Mecha Assembly Kit")).toBeInTheDocument();
    expect(screen.getByText("Street Vinyl Pilot Figure")).toBeInTheDocument();
    expect(screen.getAllByText(/TikTok image/i).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /view/i }).length).toBeGreaterThan(4);
    expect(screen.queryByText(/match confidence/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/sync error/i)).not.toBeInTheDocument();
  });

  it("renders marketplace price links and review highlights on product detail", () => {
    render(<ProductPage params={{ slug: "street-vinyl-pilot-figure" }} />);

    expect(screen.getByRole("heading", { name: "Street Vinyl Pilot Figure" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /buy on tiktok/i })).toHaveAttribute("href", expect.stringContaining("tiktok"));
    expect(screen.getByRole("link", { name: /buy on temu/i })).toHaveAttribute("href", expect.stringContaining("temu"));
    expect(screen.getByText(/review highlights/i)).toBeInTheDocument();
    expect(screen.getByText(/paint is clean/i)).toBeInTheDocument();
  });

  it("generates product metadata from catalog data", async () => {
    await expect(generateMetadata({ params: { slug: "cyber-mecha-assembly-kit" } })).resolves.toMatchObject({
      title: "Cyber Mecha Assembly Kit"
    });
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AdminDashboardPage from "@/app/admin/page";
import AdminMatchesPage from "@/app/admin/matches/page";
import AdminProductsPage from "@/app/admin/products/page";
import AdminReviewsPage from "@/app/admin/reviews/page";
import AdminSyncPage from "@/app/admin/sync/page";
import { ReviewCurationTable } from "@/components/review-curation-table";
import { listProducts } from "@/lib/catalog";
import { sampleProducts } from "@/lib/sample-data";

describe("admin pages", () => {
  it("renders dashboard metrics for sync and review operations", () => {
    render(<AdminDashboardPage />);

    expect(screen.getByRole("heading", { name: /admin dashboard/i })).toBeInTheDocument();
    expect(screen.getByText(/visible products/i)).toBeInTheDocument();
    expect(screen.getByText(/pending matches/i)).toBeInTheDocument();
    expect(screen.getByText(/sync errors/i)).toBeInTheDocument();
  });

  it("renders product management controls", () => {
    render(<AdminProductsPage />);

    expect(screen.getByRole("heading", { name: /products/i })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /hide/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: /edit selling point/i }).length).toBeGreaterThan(0);
  });

  it("renders match review approval controls", () => {
    const hasMatchCandidates = listProducts().some((product) => product.match);

    render(<AdminMatchesPage />);

    expect(screen.getByRole("heading", { name: /match review/i })).toBeInTheDocument();
    if (hasMatchCandidates) {
      expect(screen.getAllByRole("button", { name: /approve match/i }).length).toBeGreaterThan(0);
      expect(screen.getAllByRole("button", { name: /reject/i }).length).toBeGreaterThan(0);
    } else {
      expect(screen.getByText(/no match candidates yet/i)).toBeInTheDocument();
    }
  });

  it("renders review curation controls", () => {
    render(<ReviewCurationTable products={sampleProducts.slice(0, 1)} />);

    expect(screen.getAllByRole("button", { name: /feature review/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: /hide review/i }).length).toBeGreaterThan(0);
  });

  it("renders an empty review curation state when no review snippets are available", () => {
    const productsWithoutReviews = listProducts().map((product) => ({ ...product, reviews: [] }));

    render(<ReviewCurationTable products={productsWithoutReviews} />);

    expect(screen.getByText(/no review snippets available yet/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /feature review/i })).not.toBeInTheDocument();
  });

  it("renders the review admin page", () => {
    render(<AdminReviewsPage />);

    expect(screen.getByRole("heading", { name: /reviews/i })).toBeInTheDocument();
  });

  it("renders sync logs and run control", () => {
    render(<AdminSyncPage />);

    expect(screen.getByRole("heading", { name: /sync logs/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /run sync/i })).toBeInTheDocument();
    expect(screen.getByText(/VIDEO_EMBED_BLOCKED/i)).toBeInTheDocument();
  });
});

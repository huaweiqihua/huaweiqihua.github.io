import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AdminDashboardPage from "@/app/admin/page";
import AdminMatchesPage from "@/app/admin/matches/page";
import AdminProductsPage from "@/app/admin/products/page";
import AdminReviewsPage from "@/app/admin/reviews/page";
import AdminSyncPage from "@/app/admin/sync/page";

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
    render(<AdminMatchesPage />);

    expect(screen.getByRole("heading", { name: /match review/i })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /approve match/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: /reject/i }).length).toBeGreaterThan(0);
  });

  it("renders review curation controls", () => {
    render(<AdminReviewsPage />);

    expect(screen.getByRole("heading", { name: /reviews/i })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /feature review/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: /hide review/i }).length).toBeGreaterThan(0);
  });

  it("renders sync logs and run control", () => {
    render(<AdminSyncPage />);

    expect(screen.getByRole("heading", { name: /sync logs/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /run sync/i })).toBeInTheDocument();
    expect(screen.getByText(/VIDEO_EMBED_BLOCKED/i)).toBeInTheDocument();
  });
});

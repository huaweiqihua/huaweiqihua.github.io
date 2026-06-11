import { describe, expect, it } from "vitest";
import {
  getBestListing,
  getListingPriceDisplay,
  getProductBySlug,
  getReviewHighlights,
  listVisibleProducts
} from "@/lib/catalog";
import { sampleProducts } from "@/lib/sample-data";
import type { PlatformListing } from "@/lib/types";

describe("catalog helpers", () => {
  it("lists only visible products", () => {
    expect(listVisibleProducts(sampleProducts).every((product) => product.visibility === "visible")).toBe(true);
  });

  it("uses the lowest available marketplace price as best listing", () => {
    const product = getProductBySlug("cyber-mecha-assembly-kit", sampleProducts);

    expect(product).toBeDefined();
    expect(getBestListing(product!).platform).toBe("tiktok");
  });

  it("keeps TikTok media as primary when a product is matched", () => {
    const product = getProductBySlug("transparent-armor-robot", sampleProducts);

    expect(product?.primarySource).toBe("tiktok");
    expect(product?.media.find((item) => item.role === "primary")?.platform).toBe("tiktok");
  });

  it("returns curated positive review highlights before uncurated reviews", () => {
    const product = getProductBySlug("street-vinyl-pilot-figure", sampleProducts);
    const highlights = getReviewHighlights(product!, 2);

    expect(highlights).toHaveLength(2);
    expect(highlights[0].isFeatured).toBe(true);
    expect(highlights[0].text).toContain("paint");
  });

  it("does not present non-USD captures as US-local prices", () => {
    const listing: PlatformListing = {
      ...sampleProducts[0].listings[0],
      platform: "temu",
      priceAmount: 27.49,
      priceCurrency: "GBP"
    };

    expect(getListingPriceDisplay(listing, { targetCurrency: "USD", targetMarketLabel: "US" })).toMatchObject({
      primaryText: "See local price",
      secondaryText: "Open Temu for US price",
      capturedText: "Captured GBP price: £27.49",
      isTargetMarketPrice: false
    });
  });
});

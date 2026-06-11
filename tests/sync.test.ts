import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/sync/run/route";
import { productsFromBrowserCapture } from "@/lib/sync/browser-capture";
import { buildProductsFromCrawledListings, shouldPersistCatalog } from "@/lib/sync/catalog-snapshot";
import { detectAccessIssue, extractListingsFromCandidates } from "@/lib/sync/extraction";
import { normalizeReviewText } from "@/lib/sync/reviews";
import { scoreListingMatch, normalizeTitle } from "@/lib/sync/matcher";
import { sourceConfig } from "@/lib/sync/source-config";

describe("sync helpers", () => {
  it("normalizes product titles for cross-platform matching", () => {
    expect(normalizeTitle("Cyber Mecha Assembly Kit - Display Stand!!!")).toBe("cyber mecha model kit display stand");
  });

  it("scores similar TikTok and Temu titles higher than unrelated titles", () => {
    const strong = scoreListingMatch({
      tiktokTitle: "Transparent Armor Robot Model Kit",
      temuTitle: "Clear Armor Robot Assembly Kit",
      tiktokImageUrl: "https://cdn.example.com/robot.jpg",
      temuImageUrl: "https://cdn.example.com/robot.jpg",
      tiktokPrice: 34.9,
      temuPrice: 31.1
    });
    const weak = scoreListingMatch({
      tiktokTitle: "Transparent Armor Robot Model Kit",
      temuTitle: "Blind Box Creature Pack",
      tiktokImageUrl: "https://cdn.example.com/robot.jpg",
      temuImageUrl: "https://cdn.example.com/blind-box.jpg",
      tiktokPrice: 34.9,
      temuPrice: 12.99
    });

    expect(strong.score).toBeGreaterThan(0.65);
    expect(strong.score).toBeGreaterThan(weak.score);
    expect(strong.reasons).toContain("shared title tokens");
  });

  it("normalizes public review text without inventing content", () => {
    expect(normalizeReviewText("  The paint is clean!!!\n\nLooks great.  ")).toBe("The paint is clean!!! Looks great.");
  });

  it("keeps configured source URLs for TikTok and Temu", () => {
    expect(sourceConfig.tiktok.shopUrl).toContain("vt.tiktok.com");
    expect(sourceConfig.temu.mallUrl).toContain("mall_id=634418218007252");
  });

  it("detects marketplace login walls before replacing catalog data", () => {
    const issue = detectAccessIssue({
      platform: "temu",
      finalUrl: "https://www.temu.com/login.html?from=mall.html",
      title: "Temu | Login",
      bodyText: "Sign in / Register\nPlease enter your email address"
    });

    expect(issue?.code).toBe("auth_required");
    expect(issue?.message).toContain("Temu");
  });

  it("extracts marketplace listings from page candidates", () => {
    const listings = extractListingsFromCandidates({
      platform: "temu",
      pageUrl: "https://www.temu.com/mall.html?mall_id=634418218007252",
      candidates: [
        {
          href: "https://www.temu.com/goods.html?goods_id=601099999",
          text: "  ",
          imageUrl: "https://img.kwcdn.com/product/robot.jpg",
          imageAlt: "Transparent Armor Robot Model Kit",
          containerText: "Transparent Armor Robot Model Kit\n$31.10\n4.8\n127 sold"
        }
      ]
    });

    expect(listings).toHaveLength(1);
    expect(listings[0]).toMatchObject({
      platform: "temu",
      title: "Transparent Armor Robot Model Kit",
      priceAmount: 31.1,
      priceCurrency: "USD",
      productUrl: "https://www.temu.com/goods.html?goods_id=601099999",
      imageUrl: "https://img.kwcdn.com/product/robot.jpg"
    });
  });

  it("extracts Temu UK product URLs and GBP prices from browser captures", () => {
    const listings = extractListingsFromCandidates({
      platform: "temu",
      pageUrl: "https://www.temu.com/mall.html?mall_id=634418218007252",
      candidates: [
        {
          href: "https://www.temu.com/uk/official--steel-round-table-knights-white-reaper-model-g-601100046045961.html",
          text: "Official SNAA Steel Scythe.Kai Round Table Knights White Reaper Assembly Model£27.491.2K+sold",
          imageUrl: "https://img.kwcdn.com/product/fancy/reaper.jpg",
          imageAlt: "Official SNAA Steel Scythe.Kai Round Table Knights White Reaper Assembly Model",
          containerText: "Official SNAA Steel Scythe.Kai Round Table Knights White Reaper Assembly Model£27.491.2K+sold"
        }
      ]
    });

    expect(listings).toHaveLength(1);
    expect(listings[0]).toMatchObject({
      productUrl: "https://www.temu.com/uk/official--steel-round-table-knights-white-reaper-model-g-601100046045961.html",
      priceAmount: 27.49,
      priceCurrency: "GBP",
      ratingAverage: null,
      reviewCount: 0,
      soldCount: 1200
    });
  });

  it("does not treat product scale or set quantities as ratings", () => {
    const listings = extractListingsFromCandidates({
      platform: "temu",
      pageUrl: "https://www.temu.com/mall.html?mall_id=634418218007252",
      candidates: [
        {
          href: "https://www.temu.com/uk/set-of-3-mecha-model-kit-g-601102480182526.html",
          text: "[Set of 3] Mecha Model Kit 1/100 Scale£21.56487sold",
          imageUrl: "https://img.kwcdn.com/product/fancy/set.jpg",
          imageAlt: "[Set of 3] Mecha Model Kit 1/100 Scale",
          containerText: "[Set of 3] Mecha Model Kit 1/100 Scale£21.56487sold"
        }
      ]
    });

    expect(listings[0]).toMatchObject({
      ratingAverage: null,
      soldCount: 487
    });
  });

  it("builds storefront products from real crawled listings with TikTok media preferred", () => {
    const products = buildProductsFromCrawledListings([
      {
        platform: "tiktok",
        title: "Transparent Armor Robot Model Kit",
        productUrl: "https://www.tiktok.com/shop/pdp/transparent-armor-robot/1",
        imageUrl: "https://cdn.tiktok.com/robot-main.jpg",
        priceAmount: 34.9,
        priceCurrency: "USD",
        ratingAverage: 4.9,
        reviewCount: 88,
        reviewSnippets: ["Looks amazing with a small LED behind the stand."]
      },
      {
        platform: "temu",
        title: "Transparent Armor Robot Assembly Kit",
        productUrl: "https://www.temu.com/goods.html?goods_id=601099999",
        imageUrl: "https://cdn.temu.com/robot-main.jpg",
        priceAmount: 31.1,
        priceCurrency: "USD",
        ratingAverage: 4.7,
        reviewCount: 51,
        reviewSnippets: []
      }
    ]);

    expect(products).toHaveLength(1);
    expect(products[0].primarySource).toBe("tiktok");
    expect(products[0].primaryImageUrl).toBe("https://cdn.tiktok.com/robot-main.jpg");
    expect(products[0].listings.map((listing) => listing.platform).sort()).toEqual(["temu", "tiktok"]);
    expect(products[0].reviews[0].text).toContain("Looks amazing");
  });

  it("does not persist an empty catalog when every live crawl needs login or is blocked", () => {
    expect(
      shouldPersistCatalog([
        {
          platform: "temu",
          sourceUrl: sourceConfig.temu.mallUrl,
          mode: "live",
          status: "failed",
          itemsDiscovered: 0,
          message: "Temu login required",
          accessIssue: { code: "auth_required", message: "Temu login required" },
          items: []
        }
      ])
    ).toBe(false);
  });

  it("converts a default Chrome browser capture into storefront products", () => {
    const products = productsFromBrowserCapture({
      platform: "temu",
      pageUrl: "https://www.temu.com/mall.html?mall_id=634418218007252",
      capturedAt: "2026-06-11T00:00:00.000Z",
      candidates: [
        {
          href: "https://www.temu.com/goods.html?goods_id=601099999",
          text: "",
          imageUrl: "https://img.kwcdn.com/product/garage.jpg",
          imageAlt: "Mini Garage Diorama Set",
          containerText: "Mini Garage Diorama Set $22.70 4.8 rating"
        }
      ]
    });

    expect(products).toHaveLength(1);
    expect(products[0]).toMatchObject({
      displayName: "Mini Garage Diorama Set",
      primarySource: "temu",
      primaryImageUrl: "https://img.kwcdn.com/product/garage.jpg"
    });
  });

  it("ignores browser capture candidates after the Temu store boundary", () => {
    const products = productsFromBrowserCapture({
      platform: "temu",
      pageUrl: "https://www.temu.com/mall.html?mall_id=634418218007252",
      capturedAt: "2026-06-11T00:00:00.000Z",
      candidates: [
        {
          href: "https://www.temu.com/uk/store-mecha-g-601100000000001.html",
          text: "Store Mecha Kit£21.00120sold",
          imageUrl: "https://img.kwcdn.com/product/store.jpg",
          imageAlt: "Store Mecha Kit",
          containerText: "Store Mecha Kit£21.00120sold",
          isStoreItem: true
        },
        {
          href: "https://www.temu.com/uk/recommended-figure-g-601100000000002.html",
          text: "Recommended Figure£9.992K+sold",
          imageUrl: "https://img.kwcdn.com/product/recommended.jpg",
          imageAlt: "Recommended Figure",
          containerText: "Recommended Figure£9.992K+sold",
          isStoreItem: false
        }
      ]
    });

    expect(products).toHaveLength(1);
    expect(products[0].displayName).toBe("Store Mecha Kit");
  });

  it("rejects sync API calls without the configured secret", async () => {
    const response = await POST(new Request("http://localhost/api/sync/run", { method: "POST" }));

    expect(response.status).toBe(401);
  });

  it("accepts sync API calls with the configured secret", async () => {
    process.env.SYNC_SECRET = "test-secret";
    const response = await POST(
      new Request("http://localhost/api/sync/run", {
        method: "POST",
        headers: { authorization: "Bearer test-secret" }
      })
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.mode).toBe("dry-run");
  });
});

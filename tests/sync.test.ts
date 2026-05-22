import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/sync/run/route";
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

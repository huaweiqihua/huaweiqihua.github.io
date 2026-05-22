export const sourceConfig = {
  tiktok: {
    shopUrl: process.env.TIKTOK_SHOP_URL ?? "https://vt.tiktok.com/ZTBLdpypN/?page=TikTokShop"
  },
  temu: {
    mallUrl: process.env.TEMU_MALL_URL ?? "https://www.temu.com/mall.html?mall_id=634418218007252"
  }
} as const;

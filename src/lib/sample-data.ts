import type { Product, SyncError, SyncRun } from "@/lib/types";

const now = "2026-05-23T00:00:00.000Z";

function listingUrl(platform: "tiktok" | "temu", slug: string) {
  return platform === "tiktok"
    ? `https://www.tiktok.com/shop/pdp/${slug}`
    : `https://www.temu.com/goods.html?goods_id=${slug}`;
}

export const sampleProducts: Product[] = [
  {
    id: "prod_cyber_mecha",
    slug: "cyber-mecha-assembly-kit",
    displayName: "Cyber Mecha Assembly Kit",
    sellingPoint: "Snap-fit armor, display stand, metallic decals, and shelf-ready articulation.",
    description:
      "A bold mecha kit for builders who want a fast assembly experience with high-impact display value. TikTok media is used as the primary product story, with Temu shown as the comparison listing.",
    primaryImageUrl:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80",
    primarySource: "tiktok",
    visibility: "visible",
    matchStatus: "matched",
    category: "Building Kits",
    sourceCue: "TikTok image · 2 prices",
    listings: [
      {
        id: "listing_cyber_tiktok",
        platform: "tiktok",
        platformProductId: "tt-cyber-mecha",
        sourceUrl: listingUrl("tiktok", "tt-cyber-mecha"),
        canonicalUrl: listingUrl("tiktok", "tt-cyber-mecha"),
        rawTitle: "Cyber Mecha Assembly Kit with Display Stand",
        normalizedTitle: "cyber mecha assembly kit display stand",
        priceAmount: 28.9,
        priceCurrency: "USD",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80",
        description: "Snap-fit armor kit with promo video and test-build footage.",
        availability: "in_stock",
        ratingAverage: 4.8,
        reviewCount: 1248,
        lastSeenAt: now,
        lastSuccessfulCrawlAt: now
      },
      {
        id: "listing_cyber_temu",
        platform: "temu",
        platformProductId: "tm-cyber-mecha",
        sourceUrl: listingUrl("temu", "tm-cyber-mecha"),
        canonicalUrl: listingUrl("temu", "tm-cyber-mecha"),
        rawTitle: "Mecha Robot Model Kit Stand Included",
        normalizedTitle: "mecha robot model kit stand included",
        priceAmount: 32.49,
        priceCurrency: "USD",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80",
        description: "Temu comparison listing for the same kit.",
        availability: "in_stock",
        ratingAverage: 4.6,
        reviewCount: 842,
        lastSeenAt: now,
        lastSuccessfulCrawlAt: now
      }
    ],
    media: [
      {
        id: "media_cyber_primary",
        platform: "tiktok",
        platformListingId: "listing_cyber_tiktok",
        type: "image",
        role: "primary",
        sourceUrl:
          "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80",
        alt: "Cyber mecha model kit product image",
        sortOrder: 1
      },
      {
        id: "media_cyber_video",
        platform: "tiktok",
        platformListingId: "listing_cyber_tiktok",
        type: "embed",
        role: "promo_video",
        sourceUrl: "https://www.tiktok.com/@shop/video/cyber-mecha-demo",
        alt: "TikTok promotional build video",
        sortOrder: 2
      }
    ],
    reviews: [
      {
        id: "review_cyber_1",
        platform: "tiktok",
        platformListingId: "listing_cyber_tiktok",
        rating: 5,
        text: "The armor pieces clicked together cleanly and the finished kit looks great under desk lights.",
        reviewerDisplayName: "A. Builder",
        reviewDate: "2026-05-10",
        sourceUrl: listingUrl("tiktok", "tt-cyber-mecha"),
        language: "en",
        isFeatured: true,
        isHidden: false
      },
      {
        id: "review_cyber_2",
        platform: "temu",
        platformListingId: "listing_cyber_temu",
        rating: 5,
        text: "Good value for the size. The decals make it look more premium than expected.",
        reviewerDisplayName: "M. Rivera",
        reviewDate: "2026-04-28",
        sourceUrl: listingUrl("temu", "tm-cyber-mecha"),
        language: "en",
        isFeatured: false,
        isHidden: false
      }
    ],
    match: {
      id: "match_cyber",
      tiktokListingId: "listing_cyber_tiktok",
      temuListingId: "listing_cyber_temu",
      confidenceScore: 0.96,
      matchReasons: ["similar title", "same primary image", "close kit description"],
      status: "approved"
    },
    priceHistory: [
      {
        id: "price_cyber_tiktok_1",
        platformListingId: "listing_cyber_tiktok",
        priceAmount: 28.9,
        priceCurrency: "USD",
        availability: "in_stock",
        capturedAt: now
      }
    ],
    createdAt: now,
    updatedAt: now
  },
  {
    id: "prod_street_vinyl",
    slug: "street-vinyl-pilot-figure",
    displayName: "Street Vinyl Pilot Figure",
    sellingPoint: "A bright desk-scale collectible with a bold streetwear colorway.",
    description:
      "A compact vinyl figure for display shelves and creator desk setups. Temu is currently lower, while TikTok remains the primary media source.",
    primaryImageUrl:
      "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=1200&q=80",
    primarySource: "tiktok",
    visibility: "visible",
    matchStatus: "matched",
    category: "Designer Toys",
    sourceCue: "TikTok image · Temu lower",
    listings: [
      {
        id: "listing_vinyl_tiktok",
        platform: "tiktok",
        platformProductId: "tt-vinyl-pilot",
        sourceUrl: listingUrl("tiktok", "tt-vinyl-pilot"),
        canonicalUrl: listingUrl("tiktok", "tt-vinyl-pilot"),
        rawTitle: "Street Vinyl Pilot Figure Collectible",
        normalizedTitle: "street vinyl pilot figure collectible",
        priceAmount: 18.2,
        priceCurrency: "USD",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=600&q=80",
        description: "TikTok listing with product showcase video.",
        availability: "in_stock",
        ratingAverage: 4.9,
        reviewCount: 531,
        lastSeenAt: now,
        lastSuccessfulCrawlAt: now
      },
      {
        id: "listing_vinyl_temu",
        platform: "temu",
        platformProductId: "tm-vinyl-pilot",
        sourceUrl: listingUrl("temu", "tm-vinyl-pilot"),
        canonicalUrl: listingUrl("temu", "tm-vinyl-pilot"),
        rawTitle: "Designer Toy Pilot Vinyl Figure",
        normalizedTitle: "designer toy pilot vinyl figure",
        priceAmount: 16.4,
        priceCurrency: "USD",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=600&q=80",
        description: "Temu listing with lower current price.",
        availability: "in_stock",
        ratingAverage: 4.7,
        reviewCount: 409,
        lastSeenAt: now,
        lastSuccessfulCrawlAt: now
      }
    ],
    media: [
      {
        id: "media_vinyl_primary",
        platform: "tiktok",
        platformListingId: "listing_vinyl_tiktok",
        type: "image",
        role: "primary",
        sourceUrl:
          "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=1200&q=80",
        alt: "Street vinyl pilot collectible figure",
        sortOrder: 1
      },
      {
        id: "media_vinyl_test_video",
        platform: "tiktok",
        platformListingId: "listing_vinyl_tiktok",
        type: "embed",
        role: "test_video",
        sourceUrl: "https://www.tiktok.com/@shop/video/vinyl-pilot-spin",
        alt: "TikTok 360 degree figure test video",
        sortOrder: 2
      }
    ],
    reviews: [
      {
        id: "review_vinyl_1",
        platform: "tiktok",
        platformListingId: "listing_vinyl_tiktok",
        rating: 5,
        text: "The paint is cleaner than I expected and the colors really pop on a black shelf.",
        reviewerDisplayName: "DeskToyFan",
        reviewDate: "2026-05-14",
        sourceUrl: listingUrl("tiktok", "tt-vinyl-pilot"),
        language: "en",
        isFeatured: true,
        isHidden: false,
        curatedText: "The paint is clean and the colors pop on a black shelf."
      },
      {
        id: "review_vinyl_2",
        platform: "temu",
        platformListingId: "listing_vinyl_temu",
        rating: 5,
        text: "Packed well, no scratches, and the face print is centered.",
        reviewerDisplayName: "J. Stone",
        reviewDate: "2026-05-01",
        sourceUrl: listingUrl("temu", "tm-vinyl-pilot"),
        language: "en",
        isFeatured: false,
        isHidden: false
      }
    ],
    match: {
      id: "match_vinyl",
      tiktokListingId: "listing_vinyl_tiktok",
      temuListingId: "listing_vinyl_temu",
      confidenceScore: 0.89,
      matchReasons: ["shared figure keywords", "similar image", "same scale"],
      status: "approved"
    },
    priceHistory: [],
    createdAt: now,
    updatedAt: now
  },
  {
    id: "prod_diorama",
    slug: "mini-garage-diorama-set",
    displayName: "Mini Garage Diorama Set",
    sellingPoint: "Build a compact garage scene for figures, cars, and mecha accessories.",
    description:
      "A TikTok-only scene kit with useful display props and printed panels. The product stays visible while the matcher searches for a Temu equivalent.",
    primaryImageUrl:
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=1200&q=80",
    primarySource: "tiktok",
    visibility: "visible",
    matchStatus: "single_source",
    category: "Diorama",
    sourceCue: "TikTok only · Video",
    listings: [
      {
        id: "listing_diorama_tiktok",
        platform: "tiktok",
        platformProductId: "tt-mini-garage",
        sourceUrl: listingUrl("tiktok", "tt-mini-garage"),
        canonicalUrl: listingUrl("tiktok", "tt-mini-garage"),
        rawTitle: "Mini Garage Diorama Set for Display Figures",
        normalizedTitle: "mini garage diorama set display figures",
        priceAmount: 22.7,
        priceCurrency: "USD",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=600&q=80",
        description: "TikTok-only product with build test video.",
        availability: "in_stock",
        ratingAverage: 4.5,
        reviewCount: 206,
        lastSeenAt: now,
        lastSuccessfulCrawlAt: now
      }
    ],
    media: [
      {
        id: "media_diorama_primary",
        platform: "tiktok",
        platformListingId: "listing_diorama_tiktok",
        type: "image",
        role: "primary",
        sourceUrl:
          "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=1200&q=80",
        alt: "Mini garage diorama set",
        sortOrder: 1
      }
    ],
    reviews: [
      {
        id: "review_diorama_1",
        platform: "tiktok",
        platformListingId: "listing_diorama_tiktok",
        rating: 5,
        text: "The printed walls make small figures look much more expensive in photos.",
        reviewerDisplayName: "ShelfScene",
        reviewDate: "2026-05-09",
        sourceUrl: listingUrl("tiktok", "tt-mini-garage"),
        language: "en",
        isFeatured: true,
        isHidden: false
      }
    ],
    priceHistory: [],
    createdAt: now,
    updatedAt: now
  },
  {
    id: "prod_transparent_robot",
    slug: "transparent-armor-robot",
    displayName: "Transparent Armor Robot",
    sellingPoint: "Clear armor panels, articulated inner frame, and light-piping display effects.",
    description:
      "A matched robot kit that defaults to TikTok images and videos while surfacing Temu's lower current price.",
    primaryImageUrl:
      "https://images.unsplash.com/photo-1617791160505-6f00504e3519?auto=format&fit=crop&w=1200&q=80",
    primarySource: "tiktok",
    visibility: "visible",
    matchStatus: "matched",
    category: "Building Kits",
    sourceCue: "TikTok image · 2 prices",
    listings: [
      {
        id: "listing_clear_robot_tiktok",
        platform: "tiktok",
        platformProductId: "tt-clear-robot",
        sourceUrl: listingUrl("tiktok", "tt-clear-robot"),
        canonicalUrl: listingUrl("tiktok", "tt-clear-robot"),
        rawTitle: "Transparent Armor Robot Model Kit",
        normalizedTitle: "transparent armor robot model kit",
        priceAmount: 34.9,
        priceCurrency: "USD",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1617791160505-6f00504e3519?auto=format&fit=crop&w=600&q=80",
        description: "TikTok robot kit listing with clear armor detail.",
        availability: "in_stock",
        ratingAverage: 4.8,
        reviewCount: 907,
        lastSeenAt: now,
        lastSuccessfulCrawlAt: now
      },
      {
        id: "listing_clear_robot_temu",
        platform: "temu",
        platformProductId: "tm-clear-robot",
        sourceUrl: listingUrl("temu", "tm-clear-robot"),
        canonicalUrl: listingUrl("temu", "tm-clear-robot"),
        rawTitle: "Clear Armor Robot Assembly Kit",
        normalizedTitle: "clear armor robot assembly kit",
        priceAmount: 31.1,
        priceCurrency: "USD",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1617791160505-6f00504e3519?auto=format&fit=crop&w=600&q=80",
        description: "Temu lower-price matched listing.",
        availability: "in_stock",
        ratingAverage: 4.6,
        reviewCount: 633,
        lastSeenAt: now,
        lastSuccessfulCrawlAt: now
      }
    ],
    media: [
      {
        id: "media_clear_robot_primary",
        platform: "tiktok",
        platformListingId: "listing_clear_robot_tiktok",
        type: "image",
        role: "primary",
        sourceUrl:
          "https://images.unsplash.com/photo-1617791160505-6f00504e3519?auto=format&fit=crop&w=1200&q=80",
        alt: "Transparent armor robot kit",
        sortOrder: 1
      }
    ],
    reviews: [
      {
        id: "review_clear_robot_1",
        platform: "tiktok",
        platformListingId: "listing_clear_robot_tiktok",
        rating: 5,
        text: "The clear parts look amazing with a small LED behind the display stand.",
        reviewerDisplayName: "MechaLight",
        reviewDate: "2026-05-12",
        sourceUrl: listingUrl("tiktok", "tt-clear-robot"),
        language: "en",
        isFeatured: true,
        isHidden: false
      }
    ],
    match: {
      id: "match_clear_robot",
      tiktokListingId: "listing_clear_robot_tiktok",
      temuListingId: "listing_clear_robot_temu",
      confidenceScore: 0.93,
      matchReasons: ["same transparent robot keywords", "close image match", "same category"],
      status: "approved"
    },
    priceHistory: [],
    createdAt: now,
    updatedAt: now
  },
  {
    id: "prod_blind_box",
    slug: "blind-box-creature-pack",
    displayName: "Blind Box Creature Pack",
    sellingPoint: "Six mystery minis for desks, shelves, and giftable toy displays.",
    description: "A Temu-only product that remains clearly labeled until a TikTok listing is discovered.",
    primaryImageUrl:
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1200&q=80",
    primarySource: "temu",
    visibility: "visible",
    matchStatus: "single_source",
    category: "Designer Toys",
    sourceCue: "Temu only · New",
    listings: [
      {
        id: "listing_blind_box_temu",
        platform: "temu",
        platformProductId: "tm-blind-creature",
        sourceUrl: listingUrl("temu", "tm-blind-creature"),
        canonicalUrl: listingUrl("temu", "tm-blind-creature"),
        rawTitle: "Blind Box Creature Pack Six Mini Toys",
        normalizedTitle: "blind box creature pack six mini toys",
        priceAmount: 12.99,
        priceCurrency: "USD",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80",
        description: "Temu-only blind box listing.",
        availability: "in_stock",
        ratingAverage: 4.4,
        reviewCount: 329,
        lastSeenAt: now,
        lastSuccessfulCrawlAt: now
      }
    ],
    media: [
      {
        id: "media_blind_box_primary",
        platform: "temu",
        platformListingId: "listing_blind_box_temu",
        type: "image",
        role: "primary",
        sourceUrl:
          "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1200&q=80",
        alt: "Blind box creature toy pack",
        sortOrder: 1
      }
    ],
    reviews: [
      {
        id: "review_blind_box_1",
        platform: "temu",
        platformListingId: "listing_blind_box_temu",
        rating: 5,
        text: "Cute variety and the tiny accessories are better than expected.",
        reviewerDisplayName: "MiniCollector",
        reviewDate: "2026-04-22",
        sourceUrl: listingUrl("temu", "tm-blind-creature"),
        language: "en",
        isFeatured: true,
        isHidden: false
      }
    ],
    priceHistory: [],
    createdAt: now,
    updatedAt: now
  },
  {
    id: "prod_space_carrier",
    slug: "space-carrier-model-kit",
    displayName: "Space Carrier Model Kit",
    sellingPoint: "Long-form build with panel lines, display base, and starship silhouette.",
    description: "A display-grade sci-fi carrier kit with TikTok build clips and matched marketplace pricing.",
    primaryImageUrl:
      "https://images.unsplash.com/photo-1608278047522-58806a6ac85b?auto=format&fit=crop&w=1200&q=80",
    primarySource: "tiktok",
    visibility: "visible",
    matchStatus: "matched",
    category: "Building Kits",
    sourceCue: "TikTok image · 2 prices",
    listings: [
      {
        id: "listing_carrier_tiktok",
        platform: "tiktok",
        platformProductId: "tt-space-carrier",
        sourceUrl: listingUrl("tiktok", "tt-space-carrier"),
        canonicalUrl: listingUrl("tiktok", "tt-space-carrier"),
        rawTitle: "Space Carrier Model Kit Large Build",
        normalizedTitle: "space carrier model kit large build",
        priceAmount: 44.8,
        priceCurrency: "USD",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1608278047522-58806a6ac85b?auto=format&fit=crop&w=600&q=80",
        description: "TikTok starship kit with build montage.",
        availability: "in_stock",
        ratingAverage: 4.7,
        reviewCount: 415,
        lastSeenAt: now,
        lastSuccessfulCrawlAt: now
      },
      {
        id: "listing_carrier_temu",
        platform: "temu",
        platformProductId: "tm-space-carrier",
        sourceUrl: listingUrl("temu", "tm-space-carrier"),
        canonicalUrl: listingUrl("temu", "tm-space-carrier"),
        rawTitle: "Sci Fi Space Ship Carrier Assembly Model",
        normalizedTitle: "sci fi space ship carrier assembly model",
        priceAmount: 47.2,
        priceCurrency: "USD",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1608278047522-58806a6ac85b?auto=format&fit=crop&w=600&q=80",
        description: "Temu comparison listing.",
        availability: "in_stock",
        ratingAverage: 4.5,
        reviewCount: 278,
        lastSeenAt: now,
        lastSuccessfulCrawlAt: now
      }
    ],
    media: [
      {
        id: "media_carrier_primary",
        platform: "tiktok",
        platformListingId: "listing_carrier_tiktok",
        type: "image",
        role: "primary",
        sourceUrl:
          "https://images.unsplash.com/photo-1608278047522-58806a6ac85b?auto=format&fit=crop&w=1200&q=80",
        alt: "Space carrier model kit",
        sortOrder: 1
      }
    ],
    reviews: [
      {
        id: "review_carrier_1",
        platform: "tiktok",
        platformListingId: "listing_carrier_tiktok",
        rating: 5,
        text: "Took a weekend to build and the panel lines make it look like a premium kit.",
        reviewerDisplayName: "OrbitBuilder",
        reviewDate: "2026-05-08",
        sourceUrl: listingUrl("tiktok", "tt-space-carrier"),
        language: "en",
        isFeatured: true,
        isHidden: false
      }
    ],
    match: {
      id: "match_carrier",
      tiktokListingId: "listing_carrier_tiktok",
      temuListingId: "listing_carrier_temu",
      confidenceScore: 0.97,
      matchReasons: ["same ship type", "similar listing photos", "close product dimensions"],
      status: "approved"
    },
    priceHistory: [],
    createdAt: now,
    updatedAt: now
  },
  {
    id: "prod_chrome_mask",
    slug: "chrome-mask-display-bust",
    displayName: "Chrome Mask Display Bust",
    sellingPoint: "Metallic mask finish for a compact high-impact collection centerpiece.",
    description: "A matched display bust where Temu is currently lower and TikTok provides stronger video content.",
    primaryImageUrl:
      "https://images.unsplash.com/photo-1563901935883-cb61f5d49be4?auto=format&fit=crop&w=1200&q=80",
    primarySource: "tiktok",
    visibility: "visible",
    matchStatus: "matched",
    category: "Designer Toys",
    sourceCue: "TikTok image · Temu lower",
    listings: [
      {
        id: "listing_mask_tiktok",
        platform: "tiktok",
        platformProductId: "tt-chrome-mask",
        sourceUrl: listingUrl("tiktok", "tt-chrome-mask"),
        canonicalUrl: listingUrl("tiktok", "tt-chrome-mask"),
        rawTitle: "Chrome Mask Display Bust",
        normalizedTitle: "chrome mask display bust",
        priceAmount: 23,
        priceCurrency: "USD",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1563901935883-cb61f5d49be4?auto=format&fit=crop&w=600&q=80",
        description: "TikTok display bust product.",
        availability: "in_stock",
        ratingAverage: 4.6,
        reviewCount: 198,
        lastSeenAt: now,
        lastSuccessfulCrawlAt: now
      },
      {
        id: "listing_mask_temu",
        platform: "temu",
        platformProductId: "tm-chrome-mask",
        sourceUrl: listingUrl("temu", "tm-chrome-mask"),
        canonicalUrl: listingUrl("temu", "tm-chrome-mask"),
        rawTitle: "Metal Mask Collectible Bust",
        normalizedTitle: "metal mask collectible bust",
        priceAmount: 19.5,
        priceCurrency: "USD",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1563901935883-cb61f5d49be4?auto=format&fit=crop&w=600&q=80",
        description: "Temu lower-price bust listing.",
        availability: "in_stock",
        ratingAverage: 4.4,
        reviewCount: 154,
        lastSeenAt: now,
        lastSuccessfulCrawlAt: now
      }
    ],
    media: [
      {
        id: "media_mask_primary",
        platform: "tiktok",
        platformListingId: "listing_mask_tiktok",
        type: "image",
        role: "primary",
        sourceUrl:
          "https://images.unsplash.com/photo-1563901935883-cb61f5d49be4?auto=format&fit=crop&w=1200&q=80",
        alt: "Chrome mask display bust",
        sortOrder: 1
      }
    ],
    reviews: [
      {
        id: "review_mask_1",
        platform: "tiktok",
        platformListingId: "listing_mask_tiktok",
        rating: 5,
        text: "The chrome finish catches light nicely and looks great next to black figures.",
        reviewerDisplayName: "DisplayCase",
        reviewDate: "2026-04-30",
        sourceUrl: listingUrl("tiktok", "tt-chrome-mask"),
        language: "en",
        isFeatured: true,
        isHidden: false
      }
    ],
    match: {
      id: "match_mask",
      tiktokListingId: "listing_mask_tiktok",
      temuListingId: "listing_mask_temu",
      confidenceScore: 0.84,
      matchReasons: ["shared mask bust keywords", "similar metallic finish"],
      status: "pending"
    },
    priceHistory: [],
    createdAt: now,
    updatedAt: now
  },
  {
    id: "prod_retro_bot",
    slug: "retro-bot-desk-figure",
    displayName: "Retro Bot Desk Figure",
    sellingPoint: "Compact poseable desk toy with neon accent colors and a playful silhouette.",
    description: "A small matched figure suited for quick gift purchases and impulse collector browsing.",
    primaryImageUrl:
      "https://images.unsplash.com/photo-1578950435899-d1c1bf932607?auto=format&fit=crop&w=1200&q=80",
    primarySource: "tiktok",
    visibility: "visible",
    matchStatus: "matched",
    category: "Designer Toys",
    sourceCue: "TikTok image · 2 prices",
    listings: [
      {
        id: "listing_retro_bot_tiktok",
        platform: "tiktok",
        platformProductId: "tt-retro-bot",
        sourceUrl: listingUrl("tiktok", "tt-retro-bot"),
        canonicalUrl: listingUrl("tiktok", "tt-retro-bot"),
        rawTitle: "Retro Bot Desk Figure Neon Toy",
        normalizedTitle: "retro bot desk figure neon toy",
        priceAmount: 15.2,
        priceCurrency: "USD",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1578950435899-d1c1bf932607?auto=format&fit=crop&w=600&q=80",
        description: "TikTok small figure listing.",
        availability: "in_stock",
        ratingAverage: 4.7,
        reviewCount: 311,
        lastSeenAt: now,
        lastSuccessfulCrawlAt: now
      },
      {
        id: "listing_retro_bot_temu",
        platform: "temu",
        platformProductId: "tm-retro-bot",
        sourceUrl: listingUrl("temu", "tm-retro-bot"),
        canonicalUrl: listingUrl("temu", "tm-retro-bot"),
        rawTitle: "Poseable Retro Robot Desk Toy",
        normalizedTitle: "poseable retro robot desk toy",
        priceAmount: 17.99,
        priceCurrency: "USD",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1578950435899-d1c1bf932607?auto=format&fit=crop&w=600&q=80",
        description: "Temu comparison listing.",
        availability: "in_stock",
        ratingAverage: 4.5,
        reviewCount: 205,
        lastSeenAt: now,
        lastSuccessfulCrawlAt: now
      }
    ],
    media: [
      {
        id: "media_retro_bot_primary",
        platform: "tiktok",
        platformListingId: "listing_retro_bot_tiktok",
        type: "image",
        role: "primary",
        sourceUrl:
          "https://images.unsplash.com/photo-1578950435899-d1c1bf932607?auto=format&fit=crop&w=1200&q=80",
        alt: "Retro bot desk figure",
        sortOrder: 1
      }
    ],
    reviews: [
      {
        id: "review_retro_bot_1",
        platform: "tiktok",
        platformListingId: "listing_retro_bot_tiktok",
        rating: 5,
        text: "Small but sturdy, and the poseable arms make it fun to keep near my monitor.",
        reviewerDisplayName: "PixelShelf",
        reviewDate: "2026-05-06",
        sourceUrl: listingUrl("tiktok", "tt-retro-bot"),
        language: "en",
        isFeatured: true,
        isHidden: false
      }
    ],
    match: {
      id: "match_retro_bot",
      tiktokListingId: "listing_retro_bot_tiktok",
      temuListingId: "listing_retro_bot_temu",
      confidenceScore: 0.92,
      matchReasons: ["same robot desk toy title", "similar poseable figure"],
      status: "approved"
    },
    priceHistory: [],
    createdAt: now,
    updatedAt: now
  },
  {
    id: "prod_hidden_draft",
    slug: "unapproved-samurai-frame",
    displayName: "Unapproved Samurai Frame",
    sellingPoint: "Hidden pending product used to prove public filtering.",
    description: "This product is intentionally hidden from the public catalog.",
    primaryImageUrl:
      "https://images.unsplash.com/photo-1608889476518-738c9b1dcb40?auto=format&fit=crop&w=1200&q=80",
    primarySource: "tiktok",
    visibility: "hidden",
    matchStatus: "pending_review",
    category: "Building Kits",
    sourceCue: "Needs review",
    listings: [],
    media: [],
    reviews: [],
    priceHistory: [],
    createdAt: now,
    updatedAt: now
  }
];

export const sampleSyncRuns: SyncRun[] = [
  {
    id: "sync_tiktok_latest",
    platform: "tiktok",
    sourceUrl: "https://vt.tiktok.com/ZTBLdpypN/?page=TikTokShop",
    status: "partial",
    startedAt: "2026-05-23T03:05:00.000Z",
    finishedAt: "2026-05-23T03:09:00.000Z",
    itemsDiscovered: 98,
    itemsUpdated: 86,
    reviewsDiscovered: 421,
    errorCount: 2
  },
  {
    id: "sync_temu_latest",
    platform: "temu",
    sourceUrl: "https://www.temu.com/mall.html?mall_id=634418218007252",
    status: "success",
    startedAt: "2026-05-23T03:12:00.000Z",
    finishedAt: "2026-05-23T03:17:00.000Z",
    itemsDiscovered: 76,
    itemsUpdated: 71,
    reviewsDiscovered: 388,
    errorCount: 0
  }
];

export const sampleSyncErrors: SyncError[] = [
  {
    id: "sync_error_video_1",
    syncRunId: "sync_tiktok_latest",
    platform: "tiktok",
    url: "https://www.tiktok.com/shop/pdp/tt-hidden-video",
    stage: "media",
    errorCode: "VIDEO_EMBED_BLOCKED",
    message: "TikTok video embed was not retrievable; product can fall back to outbound video link.",
    createdAt: "2026-05-23T03:08:00.000Z"
  },
  {
    id: "sync_error_reviews_1",
    syncRunId: "sync_tiktok_latest",
    platform: "tiktok",
    url: "https://www.tiktok.com/shop/pdp/tt-review-page",
    stage: "reviews",
    errorCode: "REVIEWS_TRUNCATED",
    message: "Only rating summary was visible without login; review snippets were skipped.",
    createdAt: "2026-05-23T03:08:30.000Z"
  }
];

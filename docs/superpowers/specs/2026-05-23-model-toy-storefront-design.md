# Model/Toy Storefront Design

## Summary

Build an English, overseas-facing product discovery and price-comparison storefront for model kits, figures, and designer toys. The site does not process checkout. It displays products synchronized daily from the owner's TikTok Shop and Temu mall pages, then sends buyers to the original marketplace product pages.

Confirmed source pages:

- TikTok Shop: `https://vt.tiktok.com/ZTBLdpypN/?page=TikTokShop`
- Temu mall: `https://www.temu.com/mall.html?mall_id=634418218007252`

The first version prioritizes fast launch with a hosted web app, managed database, private admin, and an independent crawler/sync job. The crawler remains separable so it can later move to a VPS or more persistent browser environment if TikTok or Temu blocking becomes frequent.

## Goals

- Publish a polished English storefront for model-kit and toy shoppers.
- Show product cards with 1:1 product images, names, selling points, best visible price, and a direct detail-page entry.
- Use TikTok product images, detail content, and videos by default when a product is matched across TikTok and Temu.
- Show TikTok and Temu prices and outbound purchase links on product detail pages.
- Display product rating/review information, including automatically captured public reviews where available and admin-curated highlights.
- Run daily product and price synchronization from the provided TikTok and Temu pages.
- Suggest cross-platform product matches automatically, while allowing admin approval and correction.
- Keep public shopper pages simple and move sync/matching complexity into a private admin.
- Deploy the first version with low maintenance overhead.

## Non-Goals For Version 1

- No cart.
- No onsite checkout or payment processing.
- No customer accounts.
- No comments, wishlists, or user-generated reviews on this site.
- No full order tracking or after-sales system.
- No multilingual UI.
- No guarantee of real-time inventory.
- No official TikTok or Temu API integration unless platform credentials become available later.

## Users

### Shopper

An overseas English-speaking buyer looking for model kits, figures, designer toys, or related collectibles. They browse, compare marketplace prices, inspect TikTok media and reviews, then buy on TikTok Shop or Temu.

### Admin

The store owner. The admin reviews crawler results, approves or rejects product matches, edits selling points, hides products, curates review highlights, and monitors sync health.

## Product Experience

### Public Home Page

The home page is a simple shopping surface, not an operations dashboard.

It includes:

- Brand navigation.
- Strong first-screen visual hero suitable for model kits and designer toys.
- Search box.
- Category filters such as Building Kits, Designer Toys, Best Deal, and TikTok Video.
- Product grid.

Each product card includes:

- 1:1 image.
- Product name.
- Short selling point.
- Best visible price or "from" price.
- Lightweight source cue such as TikTok image, two prices, TikTok only, Temu only, or video.
- `View` button linking to the product detail page.

The public home page does not show match confidence, sync logs, crawler errors, or admin review states.

### Product Detail Page

The detail page focuses on the selected public product.

It includes:

- TikTok-priority main image when TikTok and Temu listings are matched.
- Product name and admin-editable selling point.
- TikTok-sourced product detail copy when available.
- Promotional or test videos from TikTok when available.
- Rating summary and review highlights.
- TikTok price, currency, last updated time, and outbound purchase link.
- Temu price, currency, last updated time, and outbound purchase link when matched.
- Clear handling for TikTok-only or Temu-only products.

Purchase buttons always navigate to the corresponding marketplace product detail page. Checkout, shipping, returns, and order support remain on TikTok or Temu.

### Review Display

Version 1 includes positive review display.

The system should attempt to capture publicly visible review data from TikTok and Temu product pages, including:

- Average rating.
- Review count.
- Public review snippets when visible and technically retrievable.
- Review source platform.
- Review date or relative recency when available.

The public product detail page should show a concise trust module:

- Rating summary, such as `4.8 / 5`.
- Review count, such as `1,248 reviews`.
- A small set of positive review highlights.
- Source labels, such as TikTok Shop or Temu.

The admin can curate or edit highlighted review snippets. If crawling snippets fails, the detail page can still show rating/count if available, or hide the review module if no reliable review data exists.

The site should not create fake reviews. Admin-written review highlights must be based on actual platform reviews or removed from the public product page.

### Private Admin

The admin is login-only.

Admin areas:

- Dashboard: latest sync status, successful products, failed products, new listings, price changes, pending matches, and review-crawl failures.
- Products: public product records with visibility, selling point, main image, linked marketplace listings, rating summary, and review highlights.
- Match Review: TikTok listing on one side, Temu candidate on the other, match score and reasons, with Approve, Reject, and Merge Manually actions.
- Reviews: captured reviews by product and platform, with controls to feature, hide, or edit review highlights.
- Sync Logs: crawl runs, errors, duration, source page, and failure details.

Admin decisions must be durable. Daily sync must not overwrite manual edits, hidden status, approved matches, rejected matches, or curated review highlights.

## Data Sources And Sync

The first version starts from page crawling because official API access is not available.

Source mode:

- TikTok source is the provided short TikTok Shop link.
- Temu source is the provided Temu mall link.
- Both are treated as dynamic web pages that may require browser automation.

Crawler behavior:

- Run once per day by default.
- Use Playwright for dynamic rendering.
- Crawl store listing pages to discover product URLs, titles, prices, thumbnails, and platform IDs when available.
- Crawl product detail pages for richer description, images, video references, rating/review data, and current price.
- Store raw source payload or selected snapshots when useful for debugging.
- Never delete existing public products solely because a crawl failed.
- Preserve previous good data when a platform blocks, changes markup, asks for CAPTCHA, or fails to load.
- Record sync failures in admin logs.

Crawler constraints:

- TikTok and Temu may change markup, require login, rate limit, block automation, or use anti-bot challenges.
- If blocking becomes frequent, move crawler execution to a VPS or persistent browser environment while keeping the web app and database unchanged.
- Image caching should use legally and technically safe caching. If hotlinking fails or is unstable, cache allowed product images in object storage.
- Video display should prefer embeddable or linkable TikTok content. If direct embedding is blocked, show a preview or link to the original TikTok content.

## Matching Rules

All platform listings are stored first as independent source listings.

The matcher generates candidate product matches using:

- Title similarity.
- Image similarity.
- Price range.
- Shared model names, series names, scale, color, piece count, or other specification keywords.

Match outcomes:

- Approved: TikTok and Temu listings represent the same public product.
- Rejected: candidate pair is known not to match.
- Pending: needs admin review.
- Auto-suggested: generated by the matcher but not yet confirmed.

For version 1, even high-confidence matches should be reviewable in admin. Public visibility should favor conservative behavior to avoid merging similar but different products.

When a match is approved:

- Public product uses TikTok main image by default.
- Public product uses TikTok detail copy by default.
- Public product uses TikTok videos by default.
- Detail page shows both TikTok and Temu marketplace prices and purchase links.
- Home page may show best current price.

If a product exists on only one platform:

- It can still be shown publicly if visible and approved.
- It displays only the available marketplace purchase link.
- Source cues should be clear but not distracting.

## Data Model

### `products`

Public product entity.

Fields:

- `id`
- `slug`
- `display_name`
- `selling_point`
- `description`
- `primary_image_url`
- `primary_source`, usually `tiktok`, `temu`, or `manual`
- `visibility`, such as `visible`, `hidden`, or `draft`
- `match_status`, such as `single_source`, `matched`, or `pending_review`
- `best_price_amount`
- `best_price_currency`
- `rating_average`
- `review_count`
- `created_at`
- `updated_at`

### `platform_listings`

Marketplace-specific listing.

Fields:

- `id`
- `platform`, either `tiktok` or `temu`
- `platform_product_id`
- `source_url`
- `canonical_url`
- `raw_title`
- `normalized_title`
- `price_amount`
- `price_currency`
- `thumbnail_url`
- `description`
- `availability`
- `rating_average`
- `review_count`
- `last_seen_at`
- `last_successful_crawl_at`
- `created_at`
- `updated_at`

### `product_matches`

Relationship between platform listings.

Fields:

- `id`
- `product_id`
- `tiktok_listing_id`
- `temu_listing_id`
- `confidence_score`
- `match_reasons`
- `status`, such as `pending`, `approved`, or `rejected`
- `reviewed_by`
- `reviewed_at`
- `created_at`
- `updated_at`

### `product_media`

Images and videos used by public pages.

Fields:

- `id`
- `product_id`
- `platform_listing_id`
- `media_type`, such as `image`, `video`, or `embed`
- `source_url`
- `cached_url`
- `role`, such as `primary`, `gallery`, `promo_video`, or `test_video`
- `sort_order`
- `created_at`

### `product_reviews`

Captured or curated review data.

Fields:

- `id`
- `product_id`
- `platform_listing_id`
- `platform`
- `rating`
- `review_text`
- `reviewer_display_name`
- `review_date`
- `source_url`
- `language`
- `is_featured`
- `is_hidden`
- `curated_text`
- `created_at`
- `updated_at`

### `price_history`

Daily price snapshots.

Fields:

- `id`
- `platform_listing_id`
- `price_amount`
- `price_currency`
- `availability`
- `captured_at`

### `sync_runs`

One crawler execution.

Fields:

- `id`
- `platform`
- `source_url`
- `status`, such as `success`, `partial`, or `failed`
- `started_at`
- `finished_at`
- `items_discovered`
- `items_updated`
- `reviews_discovered`
- `error_count`

### `sync_errors`

Per-error crawl diagnostics.

Fields:

- `id`
- `sync_run_id`
- `platform`
- `url`
- `stage`, such as `listing`, `detail`, `media`, or `reviews`
- `error_code`
- `message`
- `screenshot_url`
- `created_at`

### `admin_edits`

Audit trail for manual changes.

Fields:

- `id`
- `entity_type`
- `entity_id`
- `field_name`
- `old_value`
- `new_value`
- `edited_by`
- `created_at`

## Technical Architecture

### Web App

- Next.js with TypeScript.
- Public routes for home, product list, product detail, and basic information pages.
- Admin routes under a private authenticated area.
- Server-side or incremental rendering for product pages to support SEO.
- Structured metadata for product pages, Open Graph images, and sitemap generation.

### Database And Auth

- Supabase Postgres for application data.
- Supabase Auth for admin login.
- Row-level security should prevent public access to admin-only tables and mutation APIs.
- Admin APIs must require authenticated admin sessions.

### Storage

- Supabase Storage or compatible object storage for cached product images, crawler screenshots, and optional review/media assets.

### Crawler And Worker

- Playwright-based crawler.
- Independent cron worker, not tightly coupled to the web request lifecycle.
- Daily scheduled sync for TikTok and Temu.
- The crawler writes platform listings, product media, reviews, price history, and sync logs into Postgres.
- The crawler can later move to a VPS without changing public web routes.

### Deployment

- Deploy Next.js app on Vercel or a similar managed host.
- Use Supabase for database, auth, and storage.
- Use a separate cron/worker host for Playwright crawler. The initial implementation can use a simple worker deployment; if browser automation is unreliable there, migrate only the crawler to VPS.
- Configure environment variables for Supabase credentials, admin settings, and crawler schedule.

## MVP Acceptance Criteria

- Public home page renders an English model/toy storefront with a responsive product grid and 1:1 product images.
- Public product detail page displays product media, selling point, marketplace prices, purchase links, and review summary/highlights when available.
- TikTok + Temu matched products use TikTok image/detail/video as the default public presentation.
- TikTok-only and Temu-only products can be displayed without broken price/link sections.
- Admin can log in.
- Admin can view products, hide products, edit selling points, approve/reject matches, and curate review highlights.
- Daily sync can run and record success or failure for TikTok and Temu.
- Sync failure does not delete or blank existing public product data.
- Price history is recorded when prices are successfully crawled.
- Review crawl data is stored when available and can be featured or hidden in admin.
- Product pages include basic SEO metadata and Open Graph image.

## Open Risks

- TikTok and Temu page crawling may break due to anti-bot controls, CAPTCHA, login requirements, region-specific content, or markup changes.
- Public review snippets may not always be available, may be truncated, or may require login.
- Direct video embedding from TikTok may be blocked. The fallback is a preview or outbound TikTok link.
- Marketplace prices and inventory may differ by viewer region or login state, so the site should show last-updated time and avoid promising guaranteed real-time availability.
- Product image caching must respect platform constraints and should be revisited if either platform blocks or disallows direct reuse.

## Confirmed Design Decisions

- English overseas-facing site.
- Source access starts from public/store pages, not official APIs.
- Use automatic match suggestions with admin confirmation.
- Include a private admin in version 1.
- Keep public pages simple; do not expose crawler or matching internals.
- No cart and no onsite payment in version 1.
- Use hosted app architecture first, with crawler migration path to VPS.
- Include positive review display in version 1 using automatic public review capture plus admin curation.

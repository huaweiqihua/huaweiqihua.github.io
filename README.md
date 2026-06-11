# ModelVault

English storefront for model kits, figures, and designer toy drops synced from TikTok Shop and Temu. The site is a discovery and price-comparison experience: shoppers browse products here, then buy on the original marketplace.

## What Is Included

- Public home page with 1:1 product cards.
- Public product detail pages with TikTok-priority media, videos, review highlights, and TikTok/Temu purchase links.
- Private admin screens for products, match review, review curation, and sync logs.
- Typed sample catalog for local fallback mode.
- Playwright crawler with login-wall detection, TikTok short-link handling, DOM extraction, and generated catalog output.
- Supabase/Postgres schema for production data.

## Local Setup

This environment may not have a global package manager. The project expects pnpm, but npm also works if available.

```bash
pnpm install
pnpm dev
```

Run tests and production build:

```bash
pnpm test
pnpm build
```

Run crawler dry-run:

```bash
pnpm sync
```

Run a live crawler smoke test for one platform:

```bash
pnpm sync -- --live --platform=tiktok
pnpm sync -- --live --platform=temu
```

Run a live crawl for both platforms and replace the local generated catalog only if real product listings are extracted:

```bash
pnpm sync -- --live --write-catalog
```

The app reads `data/catalog/products.json` first. If that file is empty, it falls back to the local sample catalog so the UI remains browsable during development. Failed, blocked, or login-only crawls do not overwrite the generated catalog.

If a platform requires login, save a Playwright browser session after manually logging in:

```bash
pnpm sync:login -- --platform=tiktok
pnpm sync:login -- --platform=temu
```

This writes `.auth/tiktok.storage-state.json` or `.auth/temu.storage-state.json`, which live sync can reuse through `TIKTOK_STORAGE_STATE_PATH` and `TEMU_STORAGE_STATE_PATH`. The script opens a normal browser window; complete any CAPTCHA, verification, or login steps yourself.
When Google Chrome is installed, the login helper opens Chrome through Playwright. It still uses an isolated automation profile instead of your daily Chrome profile, so it can save only the marketplace session needed by the crawler.

Live crawling may fail if TikTok or Temu blocks automated browser access, asks for login, changes page markup, or serves region-specific content. A failed crawl should not delete existing product data.

## Environment Variables

Copy `.env.example` to `.env.local` for local development.

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: public Supabase anon key.
- `NEXT_PUBLIC_TARGET_MARKET_LABEL`: public shopper market label, defaults to `US`.
- `NEXT_PUBLIC_TARGET_PRICE_CURRENCY`: public shopper price currency, defaults to `USD`.
- `SUPABASE_SERVICE_ROLE_KEY`: service role key for crawler/admin writes.
- `SYNC_SECRET`: bearer token required by `/api/sync/run`.
- `TIKTOK_SHOP_URL`: TikTok Shop source URL.
- `TEMU_MALL_URL`: Temu mall source URL.
- `TIKTOK_STORAGE_STATE_PATH`: optional Playwright storage-state file for logged-in TikTok sync.
- `TEMU_STORAGE_STATE_PATH`: optional Playwright storage-state file for logged-in Temu sync.

Marketplace prices are region-specific. The public storefront only treats listings in `NEXT_PUBLIC_TARGET_PRICE_CURRENCY`
as local shopper prices. Other captured currencies are shown as captured reference prices on detail pages and are omitted
from Product JSON-LD offer prices to avoid presenting a UK/EU capture as a US price.

## Supabase

Apply `supabase/schema.sql` in the Supabase SQL editor or via the Supabase CLI. The schema includes products, marketplace listings, matches, media, reviews, price history, sync runs, sync errors, and admin edit audit records.

The schema enables row-level security and public read policies for visible products, visible product media, visible product listings, and non-hidden reviews. Admin write policies should be narrowed to the final production admin user or role before launch.

## Deployment

Recommended first-version deployment:

- Vercel for the Next.js app.
- Supabase for Postgres, Auth, and Storage.
- A separate cron worker for Playwright sync.

Set the environment variables in Vercel and the worker host. Configure a daily cron to call:

```bash
curl -X POST "$SITE_URL/api/sync/run" \
  -H "Authorization: Bearer $SYNC_SECRET"
```

The current API endpoint runs dry-run mode. Wire it to a persistent worker or queue before enabling live marketplace crawling in production.

## Crawler Migration Path

Keep the web app and database stable. If hosted cron cannot reliably crawl TikTok or Temu, move only the crawler process to a VPS or persistent browser environment. The crawler should continue writing the same `platform_listings`, `product_reviews`, `price_history`, `sync_runs`, and `sync_errors` records.

## Important Boundaries

- No onsite cart.
- No onsite checkout.
- No fake reviews.
- Public pages do not expose match confidence or crawler internals.
- Prices and review snippets are only as fresh as the last successful crawl.

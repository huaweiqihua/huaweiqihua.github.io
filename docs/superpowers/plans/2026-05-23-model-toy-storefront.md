# Model/Toy Storefront Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a deployable English storefront for model kits/designer toys with public product pages, private admin screens, daily TikTok/Temu sync scaffolding, matching, review highlights, and deployment documentation.

**Architecture:** Use a Next.js TypeScript app with file-based public and admin routes, a typed in-memory repository for MVP/local mode, Supabase-ready schema SQL, and a standalone Playwright crawler package boundary. Public pages stay simple; admin pages expose matching, sync, and review controls. The crawler is independent so it can move from hosted cron to VPS later.

**Tech Stack:** Next.js, TypeScript, Tailwind CSS, Vitest, Testing Library, Playwright, Supabase/Postgres schema, Vercel-compatible environment configuration.

---

## File Structure

- `package.json`: scripts and dependencies.
- `next.config.ts`: Next.js config.
- `tsconfig.json`: TypeScript config.
- `vitest.config.ts`: unit/component test config.
- `postcss.config.mjs`: Tailwind/PostCSS config.
- `src/app/layout.tsx`: root metadata and global shell.
- `src/app/page.tsx`: public home page.
- `src/app/products/[slug]/page.tsx`: public product detail page.
- `src/app/admin/page.tsx`: admin dashboard.
- `src/app/admin/products/page.tsx`: admin product management.
- `src/app/admin/matches/page.tsx`: match review UI.
- `src/app/admin/reviews/page.tsx`: review curation UI.
- `src/app/admin/sync/page.tsx`: sync logs UI.
- `src/app/about/page.tsx`, `src/app/contact/page.tsx`, `src/app/shipping-note/page.tsx`: basic information pages.
- `src/app/api/sync/run/route.ts`: protected endpoint stub for triggering sync.
- `src/components/*`: reusable storefront/admin components.
- `src/lib/types.ts`: domain types.
- `src/lib/sample-data.ts`: local seed data matching the approved spec.
- `src/lib/catalog.ts`: derived product queries and matching helpers.
- `src/lib/sync/*`: crawler abstractions, source config, matching, and review normalization.
- `src/styles/globals.css`: global Tailwind styles and design tokens.
- `supabase/schema.sql`: Postgres schema matching the design spec.
- `scripts/sync.ts`: local crawler runner entrypoint.
- `tests/*`: unit and component tests.
- `README.md`: setup, local dev, crawler, and deployment instructions.
- `.env.example`: required environment variables.

---

### Task 1: Scaffold Next.js And Test Harness

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `postcss.config.mjs`
- Create: `src/styles/globals.css`
- Create: `src/app/layout.tsx`

- [ ] **Step 1: Create project metadata and scripts**

Create `package.json` with scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest",
    "sync": "tsx scripts/sync.ts"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run:

```bash
npm install next react react-dom @supabase/supabase-js playwright tsx
npm install -D typescript @types/node @types/react @types/react-dom tailwindcss @tailwindcss/postcss vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom lucide-react
```

- [ ] **Step 3: Add TypeScript, Next, Vitest, Tailwind, and root layout files**

Use strict TypeScript, app directory routes, Vitest jsdom environment, and import `src/styles/globals.css` from `src/app/layout.tsx`.

- [ ] **Step 4: Verify scaffold**

Run:

```bash
npm test
npm run build
```

Expected: no tests yet or passing tests, and a successful build once routes exist in later tasks. If build fails because no pages exist yet, continue after creating Task 3 pages and rerun.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json next.config.ts tsconfig.json vitest.config.ts postcss.config.mjs src
git commit -m "chore: scaffold storefront app"
```

### Task 2: Domain Types, Sample Data, And Catalog Helpers

**Files:**
- Create: `src/lib/types.ts`
- Create: `src/lib/sample-data.ts`
- Create: `src/lib/catalog.ts`
- Create: `tests/catalog.test.ts`

- [ ] **Step 1: Write failing catalog tests**

Test behaviors:

```ts
import { describe, expect, it } from "vitest";
import { getBestListing, getProductBySlug, listVisibleProducts } from "@/lib/catalog";
import { sampleProducts } from "@/lib/sample-data";

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
});
```

- [ ] **Step 2: Run tests to verify RED**

Run:

```bash
npm test -- tests/catalog.test.ts
```

Expected: FAIL because `src/lib/catalog.ts` does not exist.

- [ ] **Step 3: Implement types, sample data, and helpers**

Define product, listing, media, review, match, and sync types. Seed at least 8 visible model/toy products, including matched, TikTok-only, and Temu-only cases with rating/review data.

- [ ] **Step 4: Run tests to verify GREEN**

Run:

```bash
npm test -- tests/catalog.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib tests/catalog.test.ts
git commit -m "feat: add typed catalog data"
```

### Task 3: Public Storefront UI

**Files:**
- Create: `src/components/site-header.tsx`
- Create: `src/components/hero.tsx`
- Create: `src/components/product-card.tsx`
- Create: `src/components/filter-bar.tsx`
- Create: `src/components/review-summary.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/products/[slug]/page.tsx`
- Create: `tests/public-pages.test.tsx`

- [ ] **Step 1: Write failing component/page tests**

Test that home renders product cards with 1:1 media labels, and detail renders TikTok/Temu purchase links plus review highlights.

- [ ] **Step 2: Run tests to verify RED**

Run:

```bash
npm test -- tests/public-pages.test.tsx
```

Expected: FAIL because public components do not exist.

- [ ] **Step 3: Implement public UI**

Build an English public home page and product detail page. Product cards show image, name, selling point, best price, source cue, rating count, and `View`. Detail pages show product media, videos, review trust module, marketplace price cards, and outbound purchase buttons.

- [ ] **Step 4: Run tests to verify GREEN**

Run:

```bash
npm test -- tests/public-pages.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components src/app tests/public-pages.test.tsx
git commit -m "feat: build public storefront pages"
```

### Task 4: Private Admin Screens

**Files:**
- Create: `src/components/admin-shell.tsx`
- Create: `src/components/admin-stat-card.tsx`
- Create: `src/components/match-review-card.tsx`
- Create: `src/components/review-curation-table.tsx`
- Create: `src/app/admin/page.tsx`
- Create: `src/app/admin/products/page.tsx`
- Create: `src/app/admin/matches/page.tsx`
- Create: `src/app/admin/reviews/page.tsx`
- Create: `src/app/admin/sync/page.tsx`
- Create: `tests/admin-pages.test.tsx`

- [ ] **Step 1: Write failing admin tests**

Test that admin pages render dashboard metrics, pending match controls, product visibility controls, review curation controls, and sync logs.

- [ ] **Step 2: Run tests to verify RED**

Run:

```bash
npm test -- tests/admin-pages.test.tsx
```

Expected: FAIL because admin components/routes do not exist.

- [ ] **Step 3: Implement admin screens**

Build static-but-data-driven admin pages using sample data. Include visible controls for future mutation wiring: Hide, Edit Selling Point, Approve Match, Reject, Feature Review, Hide Review, and Run Sync.

- [ ] **Step 4: Run tests to verify GREEN**

Run:

```bash
npm test -- tests/admin-pages.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components src/app/admin tests/admin-pages.test.tsx
git commit -m "feat: add admin review screens"
```

### Task 5: Sync, Matching, Reviews, And API Boundary

**Files:**
- Create: `src/lib/sync/source-config.ts`
- Create: `src/lib/sync/matcher.ts`
- Create: `src/lib/sync/reviews.ts`
- Create: `src/lib/sync/crawler.ts`
- Create: `src/app/api/sync/run/route.ts`
- Create: `scripts/sync.ts`
- Create: `tests/sync.test.ts`

- [ ] **Step 1: Write failing sync tests**

Test title normalization, match scoring, review normalization, and protected sync endpoint behavior.

- [ ] **Step 2: Run tests to verify RED**

Run:

```bash
npm test -- tests/sync.test.ts
```

Expected: FAIL because sync modules do not exist.

- [ ] **Step 3: Implement sync modules**

Implement deterministic helpers for matching and review normalization. Add a Playwright crawler interface with source URLs for TikTok and Temu and safe fallback logging. Add a local `scripts/sync.ts` runner that can execute in dry-run mode without platform credentials.

- [ ] **Step 4: Run tests to verify GREEN**

Run:

```bash
npm test -- tests/sync.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/sync src/app/api/sync scripts tests/sync.test.ts
git commit -m "feat: add sync and matching boundary"
```

### Task 6: Supabase Schema And Environment Docs

**Files:**
- Create: `supabase/schema.sql`
- Create: `.env.example`
- Create: `README.md`
- Create: `src/app/about/page.tsx`
- Create: `src/app/contact/page.tsx`
- Create: `src/app/shipping-note/page.tsx`

- [ ] **Step 1: Add Supabase schema**

Create SQL tables matching the design spec: `products`, `platform_listings`, `product_matches`, `product_media`, `product_reviews`, `price_history`, `sync_runs`, `sync_errors`, and `admin_edits`.

- [ ] **Step 2: Add environment template**

Document variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SYNC_SECRET`, `TIKTOK_SHOP_URL`, `TEMU_MALL_URL`.

- [ ] **Step 3: Add info pages and README**

Explain local setup, dev server, tests, sync dry run, Supabase setup, Vercel deploy, and crawler VPS migration path.

- [ ] **Step 4: Verify docs and build**

Run:

```bash
npm test
npm run build
```

Expected: all tests pass and build succeeds.

- [ ] **Step 5: Commit**

```bash
git add supabase .env.example README.md src/app/about src/app/contact src/app/shipping-note
git commit -m "docs: add deployment and database setup"
```

### Task 7: Browser Verification And Polish

**Files:**
- Modify as needed based on visual verification.

- [ ] **Step 1: Run full verification**

Run:

```bash
npm test
npm run build
```

Expected: all tests pass and production build succeeds.

- [ ] **Step 2: Start local app**

Run:

```bash
npm run dev
```

Open the local URL in the in-app browser.

- [ ] **Step 3: Verify public pages**

Check desktop and mobile widths for home and product detail pages. Confirm no overlapping text, product images are 1:1, links are visible, reviews display, and public pages do not expose admin sync/match internals.

- [ ] **Step 4: Verify admin pages**

Check dashboard, products, matches, reviews, and sync screens. Confirm operational controls are visually separate from public shopping pages.

- [ ] **Step 5: Fix visual or build issues**

Make tightly scoped fixes, then rerun:

```bash
npm test
npm run build
```

- [ ] **Step 6: Final commit**

```bash
git add .
git commit -m "chore: polish storefront implementation"
```

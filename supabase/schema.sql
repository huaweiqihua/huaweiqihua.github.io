create extension if not exists pgcrypto;

create type platform_name as enum ('tiktok', 'temu');
create type product_visibility as enum ('visible', 'hidden', 'draft');
create type match_status as enum ('matched', 'single_source', 'pending_review');
create type match_review_status as enum ('pending', 'approved', 'rejected');
create type listing_availability as enum ('in_stock', 'out_of_stock', 'unknown');
create type sync_status as enum ('success', 'partial', 'failed');

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  display_name text not null,
  selling_point text not null default '',
  description text not null default '',
  primary_image_url text not null default '',
  primary_source text not null default 'manual',
  visibility product_visibility not null default 'draft',
  match_status match_status not null default 'single_source',
  category text not null default 'Uncategorized',
  source_cue text not null default '',
  best_price_amount numeric(12, 2),
  best_price_currency text not null default 'USD',
  rating_average numeric(3, 2),
  review_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.platform_listings (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete set null,
  platform platform_name not null,
  platform_product_id text not null,
  source_url text not null,
  canonical_url text not null,
  raw_title text not null,
  normalized_title text not null,
  price_amount numeric(12, 2),
  price_currency text not null default 'USD',
  thumbnail_url text not null default '',
  description text not null default '',
  availability listing_availability not null default 'unknown',
  rating_average numeric(3, 2),
  review_count integer not null default 0,
  last_seen_at timestamptz,
  last_successful_crawl_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (platform, platform_product_id)
);

create table public.product_matches (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  tiktok_listing_id uuid references public.platform_listings(id) on delete cascade,
  temu_listing_id uuid references public.platform_listings(id) on delete cascade,
  confidence_score numeric(4, 3) not null default 0,
  match_reasons jsonb not null default '[]'::jsonb,
  status match_review_status not null default 'pending',
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_media (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  platform_listing_id uuid references public.platform_listings(id) on delete set null,
  media_type text not null check (media_type in ('image', 'video', 'embed')),
  source_url text not null,
  cached_url text,
  role text not null check (role in ('primary', 'gallery', 'promo_video', 'test_video')),
  alt text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  platform_listing_id uuid references public.platform_listings(id) on delete set null,
  platform platform_name not null,
  rating integer not null check (rating between 1 and 5),
  review_text text not null,
  reviewer_display_name text not null default 'Verified buyer',
  review_date date,
  source_url text not null,
  language text not null default 'en',
  is_featured boolean not null default false,
  is_hidden boolean not null default false,
  curated_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.price_history (
  id uuid primary key default gen_random_uuid(),
  platform_listing_id uuid references public.platform_listings(id) on delete cascade,
  price_amount numeric(12, 2) not null,
  price_currency text not null default 'USD',
  availability listing_availability not null default 'unknown',
  captured_at timestamptz not null default now()
);

create table public.sync_runs (
  id uuid primary key default gen_random_uuid(),
  platform platform_name not null,
  source_url text not null,
  status sync_status not null,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  items_discovered integer not null default 0,
  items_updated integer not null default 0,
  reviews_discovered integer not null default 0,
  error_count integer not null default 0
);

create table public.sync_errors (
  id uuid primary key default gen_random_uuid(),
  sync_run_id uuid references public.sync_runs(id) on delete cascade,
  platform platform_name not null,
  url text not null,
  stage text not null check (stage in ('listing', 'detail', 'media', 'reviews')),
  error_code text not null,
  message text not null,
  screenshot_url text,
  created_at timestamptz not null default now()
);

create table public.admin_edits (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  field_name text not null,
  old_value jsonb,
  new_value jsonb,
  edited_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index products_visibility_idx on public.products (visibility);
create index platform_listings_product_idx on public.platform_listings (product_id);
create index platform_listings_platform_idx on public.platform_listings (platform);
create index product_matches_status_idx on public.product_matches (status);
create index product_reviews_product_idx on public.product_reviews (product_id);
create index price_history_listing_idx on public.price_history (platform_listing_id, captured_at desc);
create index sync_runs_platform_started_idx on public.sync_runs (platform, started_at desc);

alter table public.products enable row level security;
alter table public.platform_listings enable row level security;
alter table public.product_matches enable row level security;
alter table public.product_media enable row level security;
alter table public.product_reviews enable row level security;
alter table public.price_history enable row level security;
alter table public.sync_runs enable row level security;
alter table public.sync_errors enable row level security;
alter table public.admin_edits enable row level security;

create policy "Public can read visible products"
  on public.products for select
  using (visibility = 'visible');

create policy "Public can read visible product listings"
  on public.platform_listings for select
  using (
    product_id in (
      select id from public.products where visibility = 'visible'
    )
  );

create policy "Public can read visible product media"
  on public.product_media for select
  using (
    product_id in (
      select id from public.products where visibility = 'visible'
    )
  );

create policy "Public can read visible product reviews"
  on public.product_reviews for select
  using (
    is_hidden = false
    and product_id in (
      select id from public.products where visibility = 'visible'
    )
  );

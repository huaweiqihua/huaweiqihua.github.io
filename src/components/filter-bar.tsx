const filters = ["All", "Building Kits", "Designer Toys", "Best Deal", "TikTok Video"];

export function FilterBar() {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(220px,1fr)_auto] lg:items-center">
      <label className="sr-only" htmlFor="catalog-search">
        Search products
      </label>
      <input
        id="catalog-search"
        className="h-12 w-full rounded-lg border border-white/10 bg-white/[0.06] px-4 text-sm text-[#f8f4ea] outline-none transition placeholder:text-[#8d96a8] focus:border-[#35d7ff]"
        placeholder="Search mecha, vinyl figure, diorama, blind box..."
      />
      <div className="flex flex-wrap gap-2 lg:justify-end" aria-label="Product filters">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            className={
              filter === "All"
                ? "h-11 rounded-lg bg-white px-3 text-sm font-black text-[#07080d]"
                : "h-11 rounded-lg border border-white/10 bg-white/[0.05] px-3 text-sm font-semibold text-[#e9eef7]"
            }
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
}

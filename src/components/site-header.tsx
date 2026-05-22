import Link from "next/link";

const navItems = [
  { href: "/", label: "New Drops" },
  { href: "/#price-drops", label: "Price Drops" },
  { href: "/#categories", label: "Categories" },
  { href: "/about", label: "About" }
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#07080d]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="ModelVault home">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[conic-gradient(from_130deg,#ccff3f,#35d7ff,#ff4b87,#ccff3f)] text-sm font-black text-[#07080d]">
            MV
          </span>
          <span className="min-w-0">
            <span className="block text-lg font-black leading-none text-[#f8f4ea]">ModelVault</span>
            <span className="mt-1 hidden text-xs text-[#9da7b8] sm:block">TikTok + Temu toy drops</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-2 md:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-[#e9eef7] transition hover:border-white/25 hover:bg-white/10"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/admin" className="rounded-lg bg-[#ccff3f] px-3 py-2 text-sm font-black text-[#07080d]">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}

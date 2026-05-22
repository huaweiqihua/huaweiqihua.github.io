import Link from "next/link";
import type { ReactNode } from "react";

const adminLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/matches", label: "Match Review" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/sync", label: "Sync Logs" }
];

export function AdminShell({ title, eyebrow, children }: { title: string; eyebrow: string; children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[#f4f6f8] text-[#141821]">
      <div className="grid min-h-screen lg:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="border-r border-[#dfe4ec] bg-white px-4 py-5">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#141821] text-sm font-black text-[#ccff3f]">
              MV
            </span>
            <span>
              <span className="block font-black">ModelVault</span>
              <span className="text-xs font-semibold text-[#687082]">Private admin</span>
            </span>
          </Link>
          <nav className="mt-8 grid gap-2" aria-label="Admin navigation">
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-bold text-[#384152] transition hover:bg-[#eef2f7]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
        <section className="min-w-0 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase text-[#687082]">{eyebrow}</p>
              <h1 className="mt-1 text-3xl font-black tracking-normal text-[#141821]">{title}</h1>
            </div>
            <div className="rounded-lg border border-[#dfe4ec] bg-white px-3 py-2 text-xs font-bold text-[#687082]">
              Login-only area · Supabase Auth ready
            </div>
          </div>
          {children}
        </section>
      </div>
    </main>
  );
}

import type { ReactNode } from "react";

export function AdminStatCard({ label, value, note }: { label: string; value: ReactNode; note: string }) {
  return (
    <div className="rounded-lg border border-[#dfe4ec] bg-white p-5">
      <p className="text-xs font-black uppercase text-[#687082]">{label}</p>
      <div className="mt-3 text-3xl font-black text-[#141821]">{value}</div>
      <p className="mt-2 text-sm leading-6 text-[#687082]">{note}</p>
    </div>
  );
}

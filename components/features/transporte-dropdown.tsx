"use client";

import { useState } from "react";
import Link from "next/link";

type Sub = { id: string; name: string; slug: string; icon: string | null; count: number };

export function TransporteDropdown({ parent, subs }: { parent: { icon: string | null; _count: { profiles: number } }; subs: Sub[] }) {
  const [open, setOpen] = useState(false);
  const totalCount = subs.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="col-span-2">
      <button
        onClick={() => setOpen(!open)}
        className={`relative overflow-hidden rounded-2xl p-6 text-center border bg-white shadow-sm w-full active:scale-[0.98] transition-all ${open ? "border-[#F8C927] shadow-md" : "border-gray-100"}`}
      >
        <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full bg-[#F8C927]/10" />
        <div className="flex items-center justify-center gap-3">
          <span className="text-4xl drop-shadow-sm">{parent.icon}</span>
          <div className="text-left">
            <div className="text-[15px] font-extrabold text-[#1A1D2E]">Transporte</div>
            <div className="text-[11px] text-gray-400 font-medium">{totalCount} profesional{totalCount !== 1 ? "es" : ""}</div>
          </div>
          <svg
            width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", marginLeft: 8 }}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </button>

      {open && (
        <div className="grid grid-cols-2 gap-2.5 mt-2.5 animate-in">
          {subs.map((sub) => (
            <Link
              key={sub.id}
              href={`/app/buscar?category=${sub.slug}`}
              className="relative overflow-hidden rounded-xl p-4 text-center border border-gray-100 bg-white shadow-sm active:scale-[0.97] transition-transform"
            >
              <div className="text-2xl mb-1.5">{sub.icon}</div>
              <div className="text-[13px] font-bold text-[#1A1D2E]">{sub.name}</div>
              <div className="text-[10px] text-gray-400 mt-0.5">{sub.count}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
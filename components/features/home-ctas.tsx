"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BudgetRequestForm } from "@/components/features/budget-request-form";

export function HomeCTAs() {
  const [showBudget, setShowBudget] = useState(false);
  const router = useRouter();

  return (
    <>
      <div className="flex flex-col gap-2.5 mt-5 relative z-10">
        {/* CTA 1: Budget request */}
        <button
          onClick={() => setShowBudget(true)}
          className="w-full py-4 rounded-2xl bg-[#F8C927] text-[#1A1D2E] font-extrabold text-[15px] shadow-lg shadow-[#F8C927]/25 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/>
            <path d="M14 2v6h6"/>
            <path d="M12 18v-6"/>
            <path d="m9 15 3-3 3 3"/>
          </svg>
          Pedí tu presupuesto
          <span className="text-[11px] font-semibold opacity-70 ml-1">(recibí varias propuestas)</span>
        </button>

        {/* CTA 2: Join as professional */}
        <button
          onClick={() => router.push("/registro")}
          className="w-full py-3.5 rounded-2xl bg-white/10 border-2 border-[#F8C927]/40 text-[#F8C927] font-extrabold text-[14px] backdrop-blur-sm active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <line x1="19" x2="19" y1="8" y2="14"/>
            <line x1="22" x2="16" y1="11" y2="11"/>
          </svg>
          ¿Sos prestador? ¡Sumate a OficiosGo!
        </button>
      </div>

      {/* Budget form modal */}
      {showBudget && <BudgetRequestForm onClose={() => setShowBudget(false)} />}
    </>
  );
}
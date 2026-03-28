"use client";
import { useState } from "react";
export function UpgradePlan({ currentTier, professionalName }: { currentTier: string; professionalName: string }) {
  const [expanded, setExpanded] = useState(false);
  const whatsappMsg = (plan: string) => encodeURIComponent(`Hola, soy ${professionalName} de OficiosGo. Quiero contratar el plan ${plan}.`);
  if (currentTier === "PREMIUM") {
    return (
      <div className="p-5 rounded-2xl text-white" style={{ background: "linear-gradient(135deg, #0F1120, #1E2035)" }}>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[15px] font-extrabold">Plan Premium ★</h2>
          <span className="px-2.5 py-1 rounded-full bg-[#F8C927] text-[#1A1D2E] text-[9px] font-extrabold uppercase">Activo</span>
        </div>
        <p className="text-[12px] text-gray-400">Tu perfil aparece destacado en todas las búsquedas.</p>
        <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-white/10">
          <div className="text-center"><div className="text-[#F8C927] text-lg font-black">1°</div><div className="text-[10px] text-gray-400">En búsquedas</div></div>
          <div className="text-center"><div className="text-[#F8C927] text-lg font-black">★</div><div className="text-[10px] text-gray-400">Badge Premium</div></div>
          <div className="text-center"><div className="text-[#F8C927] text-lg font-black">3x</div><div className="text-[10px] text-gray-400">Más contactos</div></div>
        </div>
      </div>
    );
  }
  const plans = [
    { name: "Standard", price: "$2.990", period: "/mes", current: currentTier === "STANDARD", features: ["Top 10 en búsquedas", "Badge Standard", "Perfil destacado"], popular: false },
    { name: "Premium", price: "$4.990", period: "/mes", current: false, features: ["Top 3 en búsquedas", "Badge ★ Premium", "3x más contactos", "Prioridad en presupuestos"], popular: true },
  ];
  return (
    <div className="p-5 rounded-2xl text-white" style={{ background: "linear-gradient(135deg, #0F1120, #1E2035)" }}>
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-[15px] font-extrabold">{currentTier === "STANDARD" ? "Plan Standard" : "Plan Gratuito"}</h2>
        <button onClick={() => setExpanded(!expanded)} className="text-[11px] font-bold text-[#F8C927]">{expanded ? "Cerrar" : "Mejorar plan"}</button>
      </div>
      <p className="text-[12px] text-gray-400 mb-3">{currentTier === "FREE" ? "Los clientes ven primero a quienes tienen Premium" : "Pasá a Premium para máxima visibilidad"}</p>
      {!expanded && currentTier === "FREE" && (<button onClick={() => setExpanded(true)} className="w-full py-3 rounded-xl bg-[#F8C927] text-[#1A1D2E] font-extrabold text-sm active:scale-[0.98] transition-transform">Ver planes disponibles</button>)}
      {expanded && (<div className="space-y-3 mt-3">{plans.map((plan) => (<div key={plan.name} className={`relative rounded-xl border ${plan.popular ? "border-[#F8C927]/50 bg-white/[0.06]" : "border-white/10 bg-white/[0.03]"} p-4`}>{plan.popular && (<span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-[#F8C927] text-[#1A1D2E] text-[9px] font-extrabold uppercase">Recomendado</span>)}<div className="flex items-center justify-between mb-2"><div><span className="text-[14px] font-extrabold text-white">{plan.name}</span>{plan.current && <span className="ml-2 text-[9px] font-bold text-green-400">Actual</span>}</div><div className="text-right"><span className="text-[20px] font-black text-[#F8C927]">{plan.price}</span><span className="text-[11px] text-gray-400">{plan.period}</span></div></div><div className="space-y-1.5 mb-3">{plan.features.map((f) => (<div key={f} className="flex items-center gap-2 text-[12px] text-gray-300"><span className="text-[#F8C927] text-[10px]">✓</span>{f}</div>))}</div>{!plan.current && (<a href={`https://wa.me/5493534127410?text=${whatsappMsg(plan.name)}`} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-lg ${plan.popular ? "bg-[#F8C927] text-[#1A1D2E]" : "bg-white/10 text-white"} text-[13px] font-extrabold active:scale-[0.98] transition-transform`}>Contratar {plan.name}</a>)}</div>))}<p className="text-center text-[10px] text-gray-500">Sin permanencia · Cancelás cuando quieras</p></div>)}
    </div>
  );
}
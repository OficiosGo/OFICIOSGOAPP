"use client";

import { useState, useEffect } from "react";

type Category = { id: string; name: string; slug: string; icon: string | null };

type Step = "form" | "sending" | "success";

export function BudgetRequestForm({ onClose }: { onClose: () => void }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [step, setStep] = useState<Step>("form");
  const [error, setError] = useState("");
  const [notifiedCount, setNotifiedCount] = useState(0);
  const [waLinks, setWaLinks] = useState<{ name: string; waLink: string }[]>([]);
  const [form, setForm] = useState({
    categoryId: "",
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    description: "",
  });

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.data || []));
  }, []);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async () => {
    setError("");

    if (!form.categoryId || !form.clientName || !form.clientPhone || !form.description) {
      setError("Completá todos los campos obligatorios");
      return;
    }
    if (form.description.length < 10) {
      setError("Describí con más detalle qué necesitás (mínimo 10 caracteres)");
      return;
    }

    setStep("sending");

    try {
      const res = await fetch("/api/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al enviar");
        setStep("form");
        return;
      }

      setNotifiedCount(data.data.totalNotified);
      setWaLinks(data.data.notifications.map((n: { name: string; waLink: string }) => ({
        name: n.name,
        waLink: n.waLink,
      })));
      setStep("success");
    } catch {
      setError("Error de conexión");
      setStep("form");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-[430px] max-h-[90vh] bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-black text-[#1A1D2E]">
            {step === "success" ? "¡Listo!" : "Pedí tu presupuesto"}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <div className="px-5 py-4 overflow-y-auto" style={{ maxHeight: "calc(90vh - 60px)" }}>
          {/* ── FORM STEP ── */}
          {step === "form" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 leading-relaxed">
                Contanos qué necesitás y le avisamos a todos los profesionales de esa categoría. Recibís varias propuestas y elegís la mejor.
              </p>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-[#1A1D2E] mb-1.5">¿Qué servicio necesitás? *</label>
                <select
                  value={form.categoryId}
                  onChange={set("categoryId")}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#F8C927] focus:ring-2 focus:ring-[#F8C927]/20 bg-white"
                >
                  <option value="">Elegí una categoría</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1A1D2E] mb-1.5">Describí qué necesitás *</label>
                <textarea
                  value={form.description}
                  onChange={set("description")}
                  rows={3}
                  placeholder="Ej: Necesito arreglar una pérdida en el baño, el caño de abajo del lavamanos gotea..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#F8C927] focus:ring-2 focus:ring-[#F8C927]/20 resize-none"
                />
                <div className="text-right text-[10px] text-gray-400 mt-0.5">{form.description.length}/1000</div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1A1D2E] mb-1.5">Tu nombre *</label>
                <input
                  value={form.clientName}
                  onChange={set("clientName")}
                  placeholder="Juan Pérez"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#F8C927] focus:ring-2 focus:ring-[#F8C927]/20"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1A1D2E] mb-1.5">Tu teléfono / WhatsApp *</label>
                <input
                  value={form.clientPhone}
                  onChange={set("clientPhone")}
                  placeholder="3534112233"
                  type="tel"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#F8C927] focus:ring-2 focus:ring-[#F8C927]/20"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1A1D2E] mb-1.5">Email <span className="text-gray-400 font-normal">(opcional)</span></label>
                <input
                  value={form.clientEmail}
                  onChange={set("clientEmail")}
                  placeholder="tu@email.com"
                  type="email"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#F8C927] focus:ring-2 focus:ring-[#F8C927]/20"
                />
              </div>

              <button
                onClick={handleSubmit}
                className="w-full py-4 rounded-2xl bg-[#F8C927] text-[#1A1D2E] font-extrabold text-[15px] shadow-lg shadow-[#F8C927]/20 active:scale-[0.98] transition-transform mt-2"
              >
                Enviar pedido de presupuesto
              </button>

              <p className="text-[11px] text-gray-400 text-center">
                Tu pedido se enviará a todos los profesionales de la categoría elegida
              </p>
            </div>
          )}

          {/* ── SENDING STEP ── */}
          {step === "sending" && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-[#F8C927] border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-sm font-semibold text-[#1A1D2E]">Enviando a los profesionales...</p>
              <p className="text-xs text-gray-400 mt-1">Esto toma solo un segundo</p>
            </div>
          )}

          {/* ── SUCCESS STEP ── */}
          {step === "success" && (
            <div className="space-y-5 pb-4">
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
                <h3 className="text-xl font-black text-[#1A1D2E]">¡Pedido enviado!</h3>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  Se notificó a <strong className="text-[#1A1D2E]">{notifiedCount} profesionales</strong> de tu pedido.
                  Te van a contactar por WhatsApp con sus propuestas.
                </p>
              </div>

              {/* WhatsApp links to contact pros directly */}
              {waLinks.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                    También podés contactarlos directo:
                  </p>
                  <div className="space-y-2">
                    {waLinks.slice(0, 5).map((pro) => (
                      <a
                        key={pro.name}
                        href={pro.waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-100"
                      >
                        <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-[#1A1D2E] truncate">{pro.name}</div>
                          <div className="text-[11px] text-green-600">Enviar WhatsApp directo</div>
                        </div>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={onClose}
                className="w-full py-3.5 rounded-xl bg-[#1A1D2E] text-[#F8C927] font-bold text-sm"
              >
                Cerrar
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
      `}</style>
    </div>
  );
}
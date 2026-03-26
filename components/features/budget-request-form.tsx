"use client";

import { useState, useEffect } from "react";

type Category = { id: string; name: string; slug: string; icon: string | null };
type Step = "form" | "sending" | "success";
type FormFields = {
  categoryId: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  description: string;
};

// ─── Íconos inline reutilizables ───────────────────────────────────────────
const IconClose = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5" strokeLinecap="round">
    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
  </svg>
);
const IconCheck = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
const IconWA = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);
const IconChevron = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

// ─── Trust badge strip ──────────────────────────────────────────────────────
const TrustStrip = () => (
  <div className="flex items-center justify-center gap-4 py-3 px-4 bg-amber-50 rounded-xl border border-amber-100">
    {[
      { icon: "⚡", text: "Respuesta en minutos" },
      { icon: "✅", text: "Profesionales verificados" },
      { icon: "🆓", text: "Sin costo para vos" },
    ].map(({ icon, text }) => (
      <div key={text} className="flex flex-col items-center gap-0.5 text-center">
        <span className="text-base leading-none">{icon}</span>
        <span className="text-[10px] font-semibold text-amber-800 leading-tight">{text}</span>
      </div>
    ))}
  </div>
);

// ─── Input/Textarea wrapper ─────────────────────────────────────────────────
const fieldClass =
  "w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#F8C927] focus:ring-2 focus:ring-[#F8C927]/20 bg-white transition-shadow placeholder:text-gray-400";

export function BudgetRequestForm({ onClose }: { onClose: () => void }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [step, setStep] = useState<Step>("form");
  const [error, setError] = useState("");
  const [notifiedCount, setNotifiedCount] = useState(0);
  const [waLinks, setWaLinks] = useState<{ name: string; waLink: string }[]>([]);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [form, setForm] = useState<FormFields>({
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

  // Bloquea scroll del body mientras el modal está abierto
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const setField = (key: keyof FormFields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async () => {
    setError("");
    if (!form.clientName.trim()) { setError("Ingresá tu nombre para continuar"); return; }
    if (!form.categoryId) { setError("Elegí el servicio que necesitás"); return; }
    if (!form.clientPhone.trim()) { setError("Ingresá tu WhatsApp para que puedan contactarte"); return; }
    if (form.description.length < 10) { setError("Contanos un poco más sobre qué necesitás (mínimo 10 caracteres)"); return; }
    if (!acceptedTerms) { setError("Aceptá los términos para continuar"); return; }

    setStep("sending");
    try {
      const res = await fetch("/api/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Ocurrió un error, intentá de nuevo"); setStep("form"); return; }
      setNotifiedCount(data.data.totalNotified);
      setWaLinks(
        data.data.notifications.map((n: { name: string; waLink: string }) => ({
          name: n.name,
          waLink: n.waLink,
        }))
      );
      setStep("success");
    } catch {
      setError("Sin conexión. Revisá tu internet e intentá de nuevo.");
      setStep("form");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative w-full max-w-[430px] bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden animate-slide-up shadow-2xl"
        style={{ maxHeight: "calc(100dvh - 32px)" }}
      >
        {/* Header sticky */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-5 py-4 flex items-center justify-between z-10">
          <div>
            <h2 id="modal-title" className="text-lg font-black text-[#1A1D2E] leading-tight">
              {step === "success" ? "¡Ya está todo listo! 🎉" : "Recibí presupuestos gratis"}
            </h2>
            {step === "form" && (
              <p className="text-xs text-gray-400 mt-0.5">
                Villa María · Te contactan en minutos
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors shrink-0"
          >
            <IconClose />
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="overflow-y-auto overscroll-contain px-5 py-4 pb-safe"
          style={{ maxHeight: "calc(100dvh - 32px - 64px)" }}>

          {/* ── PASO: FORM ─────────────────────────────────────────── */}
          {step === "form" && (
            <div className="space-y-4">
              <TrustStrip />

              {error && (
                <div role="alert" className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100 flex items-start gap-2">
                  <span className="text-base leading-none mt-0.5">⚠️</span>
                  {error}
                </div>
              )}

              {/* 1. Nombre — primera pregunta fácil, crea momentum */}
              <div>
                <label htmlFor="clientName" className="block text-sm font-semibold text-[#1A1D2E] mb-1.5">
                  Tu nombre *
                </label>
                <input
                  id="clientName"
                  value={form.clientName}
                  onChange={setField("clientName")}
                  placeholder="Ej: Lucía García"
                  autoComplete="name"
                  className={fieldClass}
                />
              </div>

              {/* 2. Servicio */}
              <div>
                <label htmlFor="categoryId" className="block text-sm font-semibold text-[#1A1D2E] mb-1.5">
                  ¿Qué servicio necesitás? *
                </label>
                <select
                  id="categoryId"
                  value={form.categoryId}
                  onChange={setField("categoryId")}
                  className={`${fieldClass} cursor-pointer`}
                >
                  <option value="">Elegí una categoría</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.icon} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Descripción */}
              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-[#1A1D2E] mb-1.5">
                  Describí qué necesitás *
                  <span className="text-gray-400 font-normal ml-1 text-xs">(cuanto más detalle, mejor presupuesto)</span>
                </label>
                <textarea
                  id="description"
                  value={form.description}
                  onChange={setField("description")}
                  rows={3}
                  placeholder="Ej: Tengo una pérdida en el baño, el caño debajo del lavatorio gotea hace 2 días..."
                  className={`${fieldClass} resize-none`}
                />
                <div className="flex justify-between mt-0.5">
                  <span className="text-[10px] text-gray-400">Más detalle = mejores propuestas</span>
                  <span className={`text-[10px] ${form.description.length > 900 ? "text-red-400" : "text-gray-400"}`}>
                    {form.description.length}/1000
                  </span>
                </div>
              </div>

              {/* 4. Teléfono */}
              <div>
                <label htmlFor="clientPhone" className="block text-sm font-semibold text-[#1A1D2E] mb-1.5">
                  Tu WhatsApp *
                  <span className="text-gray-400 font-normal ml-1 text-xs">los profesionales te van a escribir acá</span>
                </label>
                <input
                  id="clientPhone"
                  value={form.clientPhone}
                  onChange={setField("clientPhone")}
                  placeholder="5493535698990"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  className={fieldClass}
                />
              </div>

              {/* 5. Email — opcional, al final para no asustar */}
              <div>
                <label htmlFor="clientEmail" className="block text-sm font-semibold text-[#1A1D2E] mb-1.5">
                  Email{" "}
                  <span className="text-gray-400 font-normal text-xs">(opcional — para recibir el resumen)</span>
                </label>
                <input
                  id="clientEmail"
                  value={form.clientEmail}
                  onChange={setField("clientEmail")}
                  placeholder="tu@email.com"
                  type="email"
                  autoComplete="email"
                  className={fieldClass}
                />
              </div>

              {/* Términos — simplificados */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-[#F8C927] shrink-0 cursor-pointer"
                />
                <span className="text-xs text-gray-500 leading-relaxed">
                  Acepto los{" "}
                  <a href="/terminos" target="_blank" className="text-[#1A1D2E] font-semibold underline underline-offset-2">
                    Términos
                  </a>{" "}
                  y la{" "}
                  <a href="/privacidad" target="_blank" className="text-[#1A1D2E] font-semibold underline underline-offset-2">
                    Política de Privacidad
                  </a>
                  . OficiosGo! actúa como nexo y no se responsabiliza por los servicios contratados.
                </span>
              </label>

              {/* CTA principal */}
              <button
                onClick={handleSubmit}
                className="w-full py-4 rounded-2xl bg-[#F8C927] text-[#1A1D2E] font-extrabold text-[15px] shadow-lg shadow-[#F8C927]/30 active:scale-[0.98] hover:bg-[#f0c020] transition-all mt-1"
              >
                Quiero recibir presupuestos gratis →
              </button>

              <p className="text-center text-[11px] text-gray-400 pb-2">
                🔒 Tus datos son privados y no se comparten sin tu consentimiento
              </p>
            </div>
          )}

          {/* ── PASO: ENVIANDO ─────────────────────────────────────── */}
          {step === "sending" && (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="w-12 h-12 border-4 border-[#F8C927] border-t-transparent rounded-full animate-spin" />
              <div className="text-center">
                <p className="text-sm font-bold text-[#1A1D2E]">Buscando los mejores profesionales...</p>
                <p className="text-xs text-gray-400 mt-1">Estamos notificando a todos los disponibles en Villa María</p>
              </div>
            </div>
          )}

          {/* ── PASO: ÉXITO ────────────────────────────────────────── */}
          {step === "success" && (
            <div className="space-y-5 pb-4">
              {/* Hero de éxito */}
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-100 flex items-center justify-center mx-auto mb-3">
                  <IconCheck />
                </div>
                <h3 className="text-xl font-black text-[#1A1D2E]">
                  Pedido enviado a {notifiedCount} {notifiedCount === 1 ? "profesional" : "profesionales"}
                </h3>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  En breve van a escribirte por WhatsApp con sus presupuestos.{" "}
                  <strong className="text-[#1A1D2E]">Compará y elegí el que más te convenga.</strong>
                </p>
              </div>

              {/* Qué esperar ahora */}
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                <p className="text-xs font-bold text-amber-900 mb-2">¿Qué pasa ahora?</p>
                <ol className="space-y-1.5">
                  {[
                    "Los profesionales ven tu pedido",
                    "Los interesados te escriben por WhatsApp",
                    "Vos elegís con quién seguir",
                  ].map((step, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-amber-800">
                      <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center justify-center shrink-0 text-[10px]">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Links directos a WA */}
              {waLinks.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2.5">
                    O escribilos vos directamente:
                  </p>
                  <div className="space-y-2">
                    {waLinks.slice(0, 5).map((pro) => (
                      <a
                        key={pro.name}
                        href={pro.waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-100 hover:bg-green-100 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
                          <IconWA />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-[#1A1D2E] truncate">{pro.name}</div>
                          <div className="text-[11px] text-green-600 font-medium">Escribir por WhatsApp</div>
                        </div>
                        <IconChevron />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={onClose}
                className="w-full py-3.5 rounded-xl bg-[#1A1D2E] text-[#F8C927] font-bold text-sm hover:bg-[#2d3147] transition-colors"
              >
                Volver al inicio
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.25s cubic-bezier(0.22, 1, 0.36, 1); }
        .pb-safe { padding-bottom: env(safe-area-inset-bottom, 16px); }
      `}</style>
    </div>
  );
}
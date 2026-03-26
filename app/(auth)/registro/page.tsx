"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Category = { id: string; name: string; slug: string; icon: string | null };

export default function RegisterPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [step, setStep] = useState(1);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [form, setForm] = useState({
    name: "",
    dni: "",
    birthDay: "",
    birthMonth: "",
    birthYear: "",
    email: "",
    password: "",
    phone: "",
    categoryId: "",
    city: "Villa María",
    urgencias24hs: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/categories").then((r) => r.json()).then((d) => setCategories(d.data || []));
  }, []);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 70 }, (_, i) => currentYear - 18 - i);

  const getBirthDate = () => {
    if (form.birthDay && form.birthMonth && form.birthYear) {
      return `${form.birthYear}-${form.birthMonth.padStart(2, "0")}-${form.birthDay.padStart(2, "0")}`;
    }
    return "";
  };

  const validateStep1 = () => {
    if (!form.name || form.name.length < 2) { setError("Ingresá tu nombre completo"); return false; }
    if (!form.dni || form.dni.length < 7 || !/^\d+$/.test(form.dni)) { setError("DNI inválido — solo números, sin puntos"); return false; }
    if (!form.birthDay || !form.birthMonth || !form.birthYear) { setError("Completá tu fecha de nacimiento"); return false; }
    return true;
  };

  const validateStep2 = () => {
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) { setError("Email inválido"); return false; }
    if (!form.password || form.password.length < 6) { setError("La contraseña debe tener al menos 6 caracteres"); return false; }
    if (form.password !== confirmPassword) { setError("Las contraseñas no coinciden"); return false; }
    if (!form.phone || form.phone.length < 8) { setError("Ingresá un teléfono válido"); return false; }
    return true;
  };

  const nextStep = () => {
    setError("");
    if (step === 1 && validateStep1()) setStep(2);
    if (step === 2 && validateStep2()) setStep(3);
  };

  const handleSubmit = async () => {
    setError("");
    if (!form.categoryId) { setError("Seleccioná tu oficio"); return; }
    if (!acceptedTerms) { setError("Debés aceptar los términos y condiciones"); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, birthDate: getBirthDate() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Error al registrar"); return; }
      router.push("/app/dashboard");
      router.refresh();
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const stepTitles = ["Datos personales", "Cuenta y contacto", "Tu oficio"];
  const selectStyle: React.CSSProperties = { width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid #E5E7EB", fontSize: 14, outline: "none", background: "#fff", boxSizing: "border-box", appearance: "none", WebkitAppearance: "none" };
  const inputStyle: React.CSSProperties = { width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid #E5E7EB", fontSize: 14, outline: "none", boxSizing: "border-box" };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 600, color: "#1A1D2E", marginBottom: 6 };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #1A1D2E 0%, #252839 40%, #F5F5F7 40%)" }}>
      <div style={{ padding: "16px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-white.svg" alt="OficiosGo!" style={{ height: 36, width: "auto" }} />
          </Link>
          <Link href="/login" style={{ fontSize: 13, fontWeight: 700, color: "#F8C927", textDecoration: "none" }}>
            Ya tengo cuenta
          </Link>
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 20, marginBottom: 16 }}>
          {[1, 2, 3].map((s) => (
            <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: s <= step ? "#F8C927" : "rgba(255,255,255,0.15)", transition: "background 0.3s" }} />
          ))}
        </div>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 12 }}>Paso {step} de 3 — {stepTitles[step - 1]}</p>
      </div>

      <div style={{ margin: "0 16px", background: "#fff", borderRadius: 24, padding: "28px 24px", boxShadow: "0 8px 32px rgba(0,0,0,0.08)", minHeight: 400 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: "#1A1D2E", marginBottom: 4 }}>
          {step === 1 ? "¿Quién sos?" : step === 2 ? "Tu cuenta" : "¿Qué hacés?"}
        </h1>
        <p style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 20 }}>
          {step === 1 ? "Necesitamos verificar tu identidad" : step === 2 ? "Datos para ingresar y que te contacten" : "Elegí tu oficio y empezá a recibir clientes"}
        </p>

        {error && (
          <div style={{ padding: "10px 14px", borderRadius: 12, background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", fontSize: 13, fontWeight: 500, marginBottom: 16 }}>
            {error}
          </div>
        )}

        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={labelStyle}>Nombre completo *</label>
              <input value={form.name} onChange={set("name")} placeholder="Juan Pérez" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>DNI *</label>
              <input value={form.dni} onChange={set("dni")} placeholder="12345678" maxLength={8} inputMode="numeric" style={inputStyle} />
              <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>Sin puntos ni espacios</p>
            </div>
            <div>
              <label style={labelStyle}>Fecha de nacimiento *</label>
              <div style={{ display: "flex", gap: 8 }}>
                <select value={form.birthDay} onChange={set("birthDay")} style={{ ...selectStyle, flex: "0 0 28%" }}>
                  <option value="">Día</option>
                  {days.map((d) => (
                    <option key={d} value={String(d)}>{d}</option>
                  ))}
                </select>
                <select value={form.birthMonth} onChange={set("birthMonth")} style={{ ...selectStyle, flex: "1 1 auto" }}>
                  <option value="">Mes</option>
                  {months.map((m, i) => (
                    <option key={m} value={String(i + 1)}>{m}</option>
                  ))}
                </select>
                <select value={form.birthYear} onChange={set("birthYear")} style={{ ...selectStyle, flex: "0 0 30%" }}>
                  <option value="">Año</option>
                  {years.map((y) => (
                    <option key={y} value={String(y)}>{y}</option>
                  ))}
                </select>
              </div>
              <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>Debés ser mayor de 18 años</p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={labelStyle}>Email *</label>
              <input type="email" value={form.email} onChange={set("email")} placeholder="tu@email.com" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Contraseña *</label>
              <input type="password" value={form.password} onChange={set("password")} placeholder="Mínimo 6 caracteres" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Repetí la contraseña *</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repetí tu contraseña" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Teléfono / WhatsApp *</label>
              <input value={form.phone} onChange={set("phone")} placeholder="5493535698990" inputMode="numeric" style={inputStyle} />
              <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>Los clientes te contactarán por este número</p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={labelStyle}>Oficio *</label>
              <select value={form.categoryId} onChange={set("categoryId")} style={selectStyle}>
                <option value="">Seleccioná tu oficio</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Ciudad *</label>
              <input value={form.city} onChange={set("city")} style={inputStyle} />
            </div>

            <label style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 14, cursor: "pointer", border: form.urgencias24hs ? "2px solid #EF4444" : "1px solid #E5E7EB", background: form.urgencias24hs ? "#FEF2F2" : "#fff", transition: "all 0.2s" }}>
              <div style={{ width: 44, height: 26, borderRadius: 13, background: form.urgencias24hs ? "#EF4444" : "#D1D5DB", padding: 2, flexShrink: 0, transition: "background 0.2s" }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.2)", transform: form.urgencias24hs ? "translateX(18px)" : "translateX(0)", transition: "transform 0.2s" }} />
              </div>
              <input type="checkbox" checked={form.urgencias24hs} onChange={(e) => setForm(f => ({ ...f, urgencias24hs: e.target.checked }))} style={{ display: "none" }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: form.urgencias24hs ? "#DC2626" : "#1A1D2E" }}>🚨 Atiendo urgencias 24hs</div>
                <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>Se muestra destacado en tu perfil y en búsquedas</div>
              </div>
            </label>

            <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", marginTop: 4, padding: "12px 14px", borderRadius: 14, border: "1px solid #E5E7EB", background: acceptedTerms ? "#F0FDF4" : "#fff", transition: "all 0.2s" }}>
              <input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} style={{ marginTop: 2, width: 18, height: 18, accentColor: "#F8C927", flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.6 }}>
                Al hacer clic en &quot;Crear mi perfil&quot;, declaro que soy mayor de edad y acepto los{" "}
                <a href="/terminos" target="_blank" style={{ color: "#5C80BC", fontWeight: 600, textDecoration: "underline" }}>Términos y Condiciones</a>{" "}
                y la{" "}
                <a href="/privacidad" target="_blank" style={{ color: "#5C80BC", fontWeight: 600, textDecoration: "underline" }}>Política de Privacidad</a>{" "}
                de OficiosGo!. Comprendo y acepto que la plataforma actúa únicamente como un nexo de conexión y no se responsabiliza por la ejecución, calidad o seguridad de los servicios contratados, ni por el comportamiento de los usuarios.
              </span>
            </label>
          </div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          {step > 1 && (
            <button onClick={() => { setError(""); setStep(step - 1); }} style={{ flex: "0 0 auto", padding: "14px 20px", borderRadius: 14, border: "1px solid #E5E7EB", background: "#fff", fontSize: 14, fontWeight: 700, color: "#6B7280", cursor: "pointer" }}>
              ← Atrás
            </button>
          )}
          {step < 3 ? (
            <button onClick={nextStep} style={{ flex: 1, padding: "14px 20px", borderRadius: 14, border: "none", background: "#F8C927", fontSize: 15, fontWeight: 800, color: "#1A1D2E", cursor: "pointer" }}>
              Continuar →
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading} style={{ flex: 1, padding: "14px 20px", borderRadius: 14, border: "none", background: "#1A1D2E", fontSize: 15, fontWeight: 800, color: "#F8C927", cursor: "pointer", opacity: loading ? 0.6 : 1 }}>
              {loading ? "Creando cuenta..." : "Crear mi perfil profesional"}
            </button>
          )}
        </div>
      </div>

      <div style={{ textAlign: "center", padding: "20px 0 32px" }}>
        <span style={{ fontSize: 13, color: "#9CA3AF" }}>¿Ya tenés cuenta? </span>
        <Link href="/login" style={{ fontSize: 13, fontWeight: 700, color: "#5C80BC", textDecoration: "none" }}>Iniciá sesión</Link>
      </div>
    </div>
  );
}
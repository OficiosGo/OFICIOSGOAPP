import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "OficiosGo! - Profesionales de oficios en Villa María";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "linear-gradient(135deg, #0F1120 0%, #1A1D2E 50%, #252839 100%)", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "#F8C927", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", fontWeight: 900, color: "#0F1120" }}>Go</div>
          <div style={{ fontSize: "36px", fontWeight: 900, color: "white" }}>OficiosGo!</div>
        </div>
        <div style={{ fontSize: "52px", fontWeight: 900, color: "white", lineHeight: 1.1, marginBottom: "16px", textAlign: "center" }}>Profesionales de oficios en <span style={{ color: "#F8C927" }}>Villa María</span></div>
        <div style={{ fontSize: "22px", color: "#9CA3AF", textAlign: "center" }}>Electricistas, plomeros, pintores, carpinteros y más. Verificados, con opiniones reales.</div>
        <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
          {["⚡ Electricista", "🔧 Plomero", "🎨 Pintor", "🔥 Gasista"].map((cat) => (
            <div key={cat} style={{ padding: "8px 16px", borderRadius: "12px", background: "rgba(248,201,39,0.15)", border: "1px solid rgba(248,201,39,0.3)", color: "#F8C927", fontSize: "16px", fontWeight: 700 }}>{cat}</div>
          ))}
        </div>
        <div style={{ marginTop: "32px", fontSize: "18px", color: "#6B7280", fontWeight: 600 }}>oficiosgo.com</div>
      </div>
    ),
    { ...size }
  );
}
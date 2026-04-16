"use client";

import { trackContact } from "@/server/actions/profile.actions";

type Props = {
  profileId: string;
  whatsapp: string | null;
  phone: string | null;
  name: string;
  variant?: "default" | "sticky";
};

/* ── Helpers ─────────────────────────────────────────────────── */

/** Detect if running as installed PWA (standalone / twa) */
function isStandalonePWA(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: window-controls-overlay)").matches ||
    (window.navigator as any).standalone === true // iOS Safari
  );
}

/**
 * Sanitize Argentine phone for wa.me link.
 * Accepts: "3534123456", "543534123456", "5493534123456", "+5493534123456"
 * Always returns: "549XXXXXXXXXX" (country + 9 + 10-digit mobile)
 */
function buildWhatsAppURL(raw: string, name: string): string {
  const digits = raw.replace(/\D/g, "");

  let normalized: string;
  if (digits.startsWith("549") && digits.length === 13) {
    // Already perfect: 549 + 10 digits
    normalized = digits;
  } else if (digits.startsWith("54") && digits.length === 12) {
    // 54 + 10 digits → insert 9 for mobile
    normalized = "549" + digits.slice(2);
  } else if (digits.length === 10) {
    // Local 10-digit → prepend 549
    normalized = "549" + digits;
  } else {
    // Fallback: use as-is with 54 prefix
    normalized = digits.startsWith("54") ? digits : "54" + digits;
  }

  const text = encodeURIComponent(`Hola ${name}, te contacto desde OficiosGo!`);
  return `https://wa.me/${normalized}?text=${text}`;
}

function buildTelURL(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("54")) return `tel:+${digits}`;
  return `tel:+54${digits}`;
}

/* ── Component ───────────────────────────────────────────────── */

export function ContactButtons({
  profileId,
  whatsapp,
  phone,
  name,
  variant = "default",
}: Props) {

  const handleWhatsApp = () => {
    if (!whatsapp) return;

    // Fire-and-forget: never block navigation
    trackContact(profileId).catch(() => {});

    const url = buildWhatsAppURL(whatsapp, name);

    // PWA standalone mode: window.open("_blank") is silently blocked.
    // Use location.href which works everywhere.
    if (isStandalonePWA()) {
      window.location.href = url;
    } else {
      // In browser: try new tab, fallback to same window
      const w = window.open(url, "_blank", "noopener,noreferrer");
      if (!w) window.location.href = url;
    }
  };

  const handlePhone = () => {
    if (!phone) return;
    trackContact(profileId).catch(() => {});
    window.location.href = buildTelURL(phone);
  };

  /* ── SVG Icons (shared) ──────────────────────────────────── */
  const WhatsAppIcon = ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );

  const PhoneIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );

  /* ── Sticky variant ──────────────────────────────────────── */
  if (variant === "sticky") {
    return (
      <div className="flex gap-2">
        {whatsapp && (
          <button
            onClick={handleWhatsApp}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] active:bg-[#17a850] text-white font-extrabold text-[14px] transition-colors shadow-lg shadow-green-500/25 min-h-[48px]"
          >
            <WhatsAppIcon />
            Contactar por WhatsApp
          </button>
        )}
        {phone && (
          <button
            onClick={handlePhone}
            aria-label="Llamar por teléfono"
            className="w-12 h-12 shrink-0 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-[#1A1D2E] hover:bg-gray-50 active:bg-gray-100 transition-colors shadow-sm min-h-[48px]"
          >
            <PhoneIcon />
          </button>
        )}
      </div>
    );
  }

  /* ── Default variant ─────────────────────────────────────── */
  return (
    <div className="flex gap-3 flex-wrap">
      {whatsapp && (
        <button
          onClick={handleWhatsApp}
          className="flex-1 min-w-[200px] flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] active:bg-[#17a850] text-white font-bold text-[15px] transition-colors shadow-lg shadow-green-500/20 min-h-[48px]"
        >
          <WhatsAppIcon size={20} />
          Contactar por WhatsApp
        </button>
      )}
      {phone && (
        <button
          onClick={handlePhone}
          className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gray-100 text-[#1A1D2E] font-bold border border-gray-200 hover:bg-gray-200 active:bg-gray-300 transition-colors min-h-[48px]"
        >
          <PhoneIcon />
          Llamar
        </button>
      )}
    </div>
  );
}
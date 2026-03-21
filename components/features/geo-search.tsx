"use client";

import { useEffect, useState } from "react";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useRouter, useSearchParams } from "next/navigation";

export function GeoSearchButton() {
  const { position, loading, error, request } = useGeolocation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [active, setActive] = useState(false);

  // Check if geo is already in URL
  useEffect(() => {
    setActive(searchParams.has("lat") && searchParams.has("lng"));
  }, [searchParams]);

  // When position changes and user activated geo, update URL
  useEffect(() => {
    if (position && active) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("lat", position.latitude.toFixed(6));
      params.set("lng", position.longitude.toFixed(6));
      params.delete("page"); // Reset pagination
      router.push(`/app/buscar?${params.toString()}`);
    }
  }, [position, active]);

  const handleToggle = () => {
    if (active) {
      // Turn off geo
      setActive(false);
      const params = new URLSearchParams(searchParams.toString());
      params.delete("lat");
      params.delete("lng");
      params.delete("radius");
      router.push(`/app/buscar?${params.toString()}`);
    } else {
      // Turn on geo
      setActive(true);
      if (position) {
        // Already have position, just update URL
        const params = new URLSearchParams(searchParams.toString());
        params.set("lat", position.latitude.toFixed(6));
        params.set("lng", position.longitude.toFixed(6));
        params.delete("page");
        router.push(`/app/buscar?${params.toString()}`);
      } else {
        request();
      }
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
        active
          ? "bg-[#F8C927] text-[#1A1D2E] shadow-md shadow-[#F8C927]/20"
          : "bg-white/10 text-white border border-white/15 hover:bg-white/20"
      }`}
    >
      {loading ? (
        <>
          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Ubicando...
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
          </svg>
          {active ? "Cerca de mí ✓" : "Cerca de mí"}
        </>
      )}
    </button>
  );
}

/**
 * Distance badge shown on professional cards when geo search is active
 */
export function DistanceBadge({ distance }: { distance: number | null | undefined }) {
  if (distance == null) return null;

  const text = distance < 1
    ? `${Math.round(distance * 1000)} m`
    : `${distance.toFixed(1)} km`;

  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#7A9263]">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="#7A9263" opacity="0.7">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
      </svg>
      a {text}
    </span>
  );
}

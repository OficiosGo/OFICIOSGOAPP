"use client";

import { useState, useEffect, useCallback } from "react";

type GeoPosition = {
  latitude: number;
  longitude: number;
};

type GeoState = {
  position: GeoPosition | null;
  loading: boolean;
  error: string | null;
  request: () => void;
};

const STORAGE_KEY = "oficiosgo-geo";
const MAX_AGE_MS = 1000 * 60 * 30; // 30 minutes cache

function getCached(): GeoPosition | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const { latitude, longitude, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > MAX_AGE_MS) return null;
    return { latitude, longitude };
  } catch {
    return null;
  }
}

function setCache(pos: GeoPosition) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...pos, timestamp: Date.now() })
    );
  } catch {
    // localStorage not available
  }
}

export function useGeolocation(): GeoState {
  const [position, setPosition] = useState<GeoPosition | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Try cached on mount
  useEffect(() => {
    const cached = getCached();
    if (cached) setPosition(cached);
  }, []);

  const request = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setError("Geolocalización no disponible");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (result) => {
        const pos = {
          latitude: result.coords.latitude,
          longitude: result.coords.longitude,
        };
        setPosition(pos);
        setCache(pos);
        setLoading(false);
      },
      (err) => {
        setLoading(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError("Permiso de ubicación denegado");
            break;
          case err.POSITION_UNAVAILABLE:
            setError("Ubicación no disponible");
            break;
          case err.TIMEOUT:
            setError("Tiempo de espera agotado");
            break;
          default:
            setError("Error al obtener ubicación");
        }
      },
      {
        enableHighAccuracy: false, // Faster, good enough for city-level
        timeout: 8000,
        maximumAge: MAX_AGE_MS,
      }
    );
  }, []);

  return { position, loading, error, request };
}

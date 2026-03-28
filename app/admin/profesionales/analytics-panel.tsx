"use client";

import { useState, useEffect } from "react";

type Stats = {
  today: number;
  yesterday: number;
  week: number;
  byPage: Array<{ page: string; count: number }>;
  hourly: Array<{ hour: number; count: number }>;
};

const PAGE_LABELS: Record<string, string> = {
  "/app": "Inicio",
  "/app/buscar": "Servicios",
  "/": "Landing",
  "/login": "Login",
  "/registro": "Registro",
  "/app/pedidos": "Pedidos",
  "/app/dashboard": "Dashboard",
};

export function AnalyticsPanel() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = () => {
    fetch("/api/analytics/stats")
      .then((r) => r.json())
      .then((d) => { setStats(d); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="p-4 rounded-2xl bg-white border border-gray-100 animate-pulse">
        <div className="h-4 bg-gray-100 rounded w-32 mb-4" />
        <div className="grid grid-cols-3 gap-3">
          <div className="h-20 bg-gray-50 rounded-xl" />
          <div className="h-20 bg-gray-50 rounded-xl" />
          <div className="h-20 bg-gray-50 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const change = stats.yesterday > 0
    ? Math.round(((stats.today - stats.yesterday) / stats.yesterday) * 100)
    : stats.today > 0 ? 100 : 0;

  const maxHourly = Math.max(...(stats.hourly.map((h) => h.count)), 1);

  return (
    <div className="space-y-3">
      {/* Live indicator */}
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Analíticas en vivo</h2>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] text-green-600 font-semibold">Tiempo real</span>
        </div>
      </div>

      {/* Main metrics */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 rounded-xl bg-white border border-gray-100 shadow-sm text-center">
          <div className="text-2xl font-black text-[#1A1D2E]">{stats.today}</div>
          <div className="text-[9px] text-gray-400 font-medium">Hoy</div>
          {change !== 0 && (
            <div className={`text-[10px] font-bold mt-0.5 ${change > 0 ? "text-green-600" : "text-red-500"}`}>
              {change > 0 ? "↑" : "↓"} {Math.abs(change)}%
            </div>
          )}
        </div>
        <div className="p-3 rounded-xl bg-white border border-gray-100 shadow-sm text-center">
          <div className="text-2xl font-black text-[#1A1D2E]">{stats.yesterday}</div>
          <div className="text-[9px] text-gray-400 font-medium">Ayer</div>
        </div>
        <div className="p-3 rounded-xl bg-white border border-gray-100 shadow-sm text-center">
          <div className="text-2xl font-black text-[#1A1D2E]">{stats.week}</div>
          <div className="text-[9px] text-gray-400 font-medium">Últimos 7 días</div>
        </div>
      </div>

      {/* Hourly chart */}
      {stats.hourly.length > 0 && (
        <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
          <h3 className="text-[12px] font-bold text-[#1A1D2E] mb-3">Visitas por hora (hoy)</h3>
          <div className="flex items-end gap-[3px] h-16">
            {Array.from({ length: 24 }, (_, i) => {
              const data = stats.hourly.find((h) => h.hour === i);
              const count = data?.count || 0;
              const height = count > 0 ? Math.max((count / maxHourly) * 100, 8) : 4;
              const isNow = new Date().getHours() === i;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-0.5" title={`${i}:00 - ${count} visitas`}>
                  <div
                    className={`w-full rounded-sm transition-all ${isNow ? "bg-[#F8C927]" : count > 0 ? "bg-[#5C80BC]" : "bg-gray-100"}`}
                    style={{ height: `${height}%` }}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[8px] text-gray-300">00</span>
            <span className="text-[8px] text-gray-300">06</span>
            <span className="text-[8px] text-gray-300">12</span>
            <span className="text-[8px] text-gray-300">18</span>
            <span className="text-[8px] text-gray-300">23</span>
          </div>
        </div>
      )}

      {/* Top pages */}
      {stats.byPage.length > 0 && (
        <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
          <h3 className="text-[12px] font-bold text-[#1A1D2E] mb-2">Páginas más visitadas (hoy)</h3>
          <div className="space-y-1.5">
            {stats.byPage.slice(0, 6).map((p) => {
              const label = PAGE_LABELS[p.page] || p.page;
              const width = Math.max((p.count / stats.byPage[0].count) * 100, 8);
              return (
                <div key={p.page} className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-600 font-medium w-20 truncate">{label}</span>
                  <div className="flex-1 h-4 bg-gray-50 rounded-full overflow-hidden">
                    <div className="h-full bg-[#F8C927]/30 rounded-full" style={{ width: `${width}%` }} />
                  </div>
                  <span className="text-[11px] font-bold text-[#1A1D2E] w-8 text-right">{p.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Refresh button */}
      <button onClick={fetchStats} className="w-full py-2 rounded-lg bg-gray-50 border border-gray-100 text-[11px] font-semibold text-gray-400 active:scale-[0.98] transition-transform">
        Actualizar datos
      </button>
    </div>
  );
}
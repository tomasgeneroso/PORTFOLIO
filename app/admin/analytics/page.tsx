"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useRouter } from "next/navigation";
import { AnalyticsDashboardSkeleton } from "@/components/Loading/AnalyticsSkeleton";

interface AnalyticsStats {
  overview: {
    totalVisits: number;
    uniqueVisitors: number;
    firstTimeVisitors: number;
    returningVisitors: number;
    conversionRate: string;
  };
  today: {
    visits: number;
    uniqueVisitors: number;
    cvDownloads: number;
    contactForms: number;
    githubClicks: number;
    linkedinClicks: number;
  };
  events: {
    cvDownloads: number;
    contactForms: number;
    githubClicks: number;
    linkedinClicks: number;
  };
  eventCounts: Array<{ _id: string; count: number }>;
  topReferrers: Array<{ _id: string; count: number }>;
  topCountries: Array<{ _id: { country: string; countryCode: string }; count: number }>;
  topCities: Array<{ _id: { city: string; country: string }; count: number }>;
  hourlyActivity: Array<{ _id: number; count: number }>;
}

const countryFlag = (code: string) => {
  try {
    return code.toUpperCase().replace(/./g, (c) =>
      String.fromCodePoint(127397 + c.charCodeAt(0))
    );
  } catch {
    return "🌐";
  }
};

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const { getConnectionStatus } = useAnalytics();
  const router = useRouter();

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics/stats?days=${days}`);
      const data = await response.json();
      if (data.success) setStats(data.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  if (loading) return <AnalyticsDashboardSkeleton />;
  if (!stats) return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <p>No hay datos disponibles</p>
    </div>
  );

  // Métricas calculadas
  const avgPerDay = days > 0 ? Math.round(stats.overview.totalVisits / days) : 0;
  const peakHour = stats.hourlyActivity.length > 0
    ? stats.hourlyActivity.reduce((a, b) => a.count > b.count ? a : b)._id
    : null;
  const totalSocialClicks = stats.events.githubClicks + stats.events.linkedinClicks;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">

      {/* Header */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Analytics Dashboard</h1>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getConnectionStatus() ? "bg-green-500" : "bg-red-500"}`} />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {getConnectionStatus() ? "Conectado a MongoDB" : "Offline"}
            </span>
          </div>
        </div>

        <div className="flex gap-2 items-center flex-wrap">
          <button
            onClick={() => router.push("/admin/planner")}
            className="px-4 py-2 rounded-lg bg-[#3D2548] text-[#C9A8D8] hover:bg-[#4D3558] transition-colors border border-[#5D4568] flex items-center gap-2 text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Planning
          </button>
          <div className="flex gap-1">
            {[7, 30, 90].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  days === d
                    ? "bg-primary text-white"
                    : "bg-amber-100 dark:bg-[#3D2548] hover:bg-amber-200 dark:hover:bg-[#4D3558] text-gray-700 dark:text-gray-300"
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors border border-red-300 dark:border-red-700"
            title="Cerrar sesión"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>

      {/* Hoy */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-xl p-6 mb-8 text-white">
        <h2 className="text-lg font-semibold mb-4 opacity-90">Actividad de hoy</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <TodayCard label="Visitas" value={stats.today.visits} />
          <TodayCard label="CVs descargados" value={stats.today.cvDownloads} />
          <TodayCard label="Formularios" value={stats.today.contactForms} />
          <TodayCard label="Clics sociales" value={stats.today.githubClicks + stats.today.linkedinClicks} />
        </div>
      </div>

      {/* Período */}
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">
        Últimos {days} días
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Visitas totales" value={stats.overview.totalVisits} sub={`~${avgPerDay}/día`} />
        <StatCard label="Visitantes únicos" value={stats.overview.uniqueVisitors} />
        <StatCard label="Visitantes recurrentes" value={stats.overview.returningVisitors} sub={`${stats.overview.firstTimeVisitors} nuevos`} />
        <StatCard label="Hora pico" value={peakHour !== null ? `${peakHour}:00h` : "—"} />
      </div>

      {/* Acciones del período */}
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">
        Acciones — últimos {days} días
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <ActionCard label="CV Downloads" value={stats.events.cvDownloads} color="border-blue-500" />
        <ActionCard label="Formularios enviados" value={stats.events.contactForms} color="border-green-500" />
        <ActionCard label="Clics GitHub" value={stats.events.githubClicks} color="border-gray-500" />
        <ActionCard label="Clics LinkedIn" value={stats.events.linkedinClicks} color="border-sky-500" />
      </div>

      {/* Distribución + Referrers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Panel title="Distribución de eventos">
          {stats.eventCounts.length > 0 ? (
            <div className="space-y-3">
              {stats.eventCounts.map((event) => {
                const max = Math.max(...stats.eventCounts.map((e) => e.count));
                const pct = max > 0 ? (event.count / max) * 100 : 0;
                return (
                  <div key={event._id}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm capitalize text-gray-700 dark:text-gray-300">
                        {event._id.replace(/_/g, " ")}
                      </span>
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{event.count}</span>
                    </div>
                    <div className="w-full bg-amber-200 dark:bg-[#4D3558] rounded-full h-1.5">
                      <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : <Empty />}
        </Panel>

        <Panel title="Top Referrers">
          {stats.topReferrers.length > 0 ? (
            <div className="space-y-2">
              {stats.topReferrers.map((ref, i) => (
                <div key={ref._id} className="flex items-center justify-between p-3 bg-amber-100 dark:bg-[#4D3558] rounded-lg">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-bold text-gray-400 w-5">#{i + 1}</span>
                    <span className="text-sm truncate text-gray-700 dark:text-gray-300">
                      {ref._id || "Directo"}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 ml-2">{ref.count}</span>
                </div>
              ))}
            </div>
          ) : <Empty text="Sin referrers registrados" />}
        </Panel>
      </div>

      {/* Geografía */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Panel title="🌍 Países">
          {stats.topCountries.length > 0 ? (
            <div className="space-y-2">
              {stats.topCountries.map((c, i) => (
                <div key={c._id.countryCode} className="flex items-center justify-between p-3 bg-amber-100 dark:bg-[#4D3558] rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-400 w-5">#{i + 1}</span>
                    <span className="text-xl">{countryFlag(c._id.countryCode)}</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{c._id.country}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{c.count}</span>
                </div>
              ))}
            </div>
          ) : <Empty />}
        </Panel>

        <Panel title="🏙️ Ciudades">
          {stats.topCities.length > 0 ? (
            <div className="space-y-2">
              {stats.topCities.map((c, i) => (
                <div key={`${c._id.city}-${i}`} className="flex items-center justify-between p-3 bg-amber-100 dark:bg-[#4D3558] rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-400 w-5">#{i + 1}</span>
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{c._id.city}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{c._id.country}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{c.count}</span>
                </div>
              ))}
            </div>
          ) : <Empty />}
        </Panel>
      </div>
    </div>
  );
}

// Sub-components
const TodayCard = ({ label, value }: { label: string; value: number }) => (
  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
    <p className="text-xs opacity-80 mb-1">{label}</p>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);

const StatCard = ({ label, value, sub }: { label: string; value: number | string; sub?: string }) => (
  <div className="bg-amber-50 dark:bg-[#3D2548] rounded-xl p-5 border border-amber-200 dark:border-[#4D3558] shadow-sm">
    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{label}</p>
    <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
    {sub && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{sub}</p>}
  </div>
);

const ActionCard = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className={`bg-amber-50 dark:bg-[#3D2548] rounded-xl p-5 border-l-4 ${color} shadow-sm`}>
    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{label}</p>
    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
  </div>
);

const Panel = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-amber-50 dark:bg-[#3D2548] rounded-xl p-6 border border-amber-200 dark:border-[#4D3558] shadow-sm">
    <h2 className="text-base font-semibold mb-4 text-gray-800 dark:text-gray-100">{title}</h2>
    {children}
  </div>
);

const Empty = ({ text = "Sin datos disponibles" }: { text?: string }) => (
  <p className="text-gray-500 dark:text-gray-400 text-center py-6 text-sm">{text}</p>
);

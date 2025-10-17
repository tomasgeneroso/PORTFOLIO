// app/admin/analytics/page.tsx
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
  topCountries: Array<{
    _id: { country: string; countryCode: string };
    count: number;
  }>;
  topCities: Array<{
    _id: { city: string; country: string };
    count: number;
  }>;
  hourlyActivity: Array<{ _id: number; count: number }>;
}

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
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  }, [days]);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return <AnalyticsDashboardSkeleton />;
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <p>No hay datos disponibles</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                getConnectionStatus() ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {getConnectionStatus() ? "Conectado a MongoDB" : "Offline"}
            </span>
          </div>
        </div>

        {/* Time Range Selector and Logout */}
        <div className="flex gap-3 items-center">
          <div className="flex gap-2">
            {[7, 30, 90].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  days === d
                    ? "bg-primary text-white"
                    : "bg-amber-100 dark:bg-[#3D2548] hover:bg-amber-200 dark:hover:bg-[#4D3558] text-gray-700 dark:text-gray-300"
                }`}
              >
                {d} días
              </button>
            ))}
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors border border-red-300 dark:border-red-700"
            title="Cerrar sesión"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Today's Activity - Destacado */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-xl p-6 mb-8 text-white">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span>📊</span> Actividad de Hoy
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <p className="text-sm opacity-90 mb-1">Visitas</p>
            <p className="text-3xl font-bold">{stats.today.visits}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <p className="text-sm opacity-90 mb-1">Únicos</p>
            <p className="text-3xl font-bold">{stats.today.uniqueVisitors}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <p className="text-sm opacity-90 mb-1">CV</p>
            <p className="text-3xl font-bold">{stats.today.cvDownloads}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <p className="text-sm opacity-90 mb-1">Forms</p>
            <p className="text-3xl font-bold">{stats.today.contactForms}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <p className="text-sm opacity-90 mb-1">GitHub</p>
            <p className="text-3xl font-bold">{stats.today.githubClicks}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <p className="text-sm opacity-90 mb-1">LinkedIn</p>
            <p className="text-3xl font-bold">{stats.today.linkedinClicks}</p>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Visitas Totales"
          value={stats.overview.totalVisits}
          icon="👥"
        />
        <StatsCard
          title="Visitantes Únicos"
          value={stats.overview.uniqueVisitors}
          icon="👤"
        />
        <StatsCard
          title="Nuevos Visitantes"
          value={stats.overview.firstTimeVisitors}
          icon="🆕"
          subtitle={`${stats.overview.returningVisitors} recurrentes`}
        />
        <StatsCard
          title="Tasa de Conversión"
          value={stats.overview.conversionRate}
          icon="📈"
        />
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <EventCard
          title="CV Downloads"
          value={stats.events.cvDownloads}
          color="blue"
        />
        <EventCard
          title="Formularios"
          value={stats.events.contactForms}
          color="green"
        />
        <EventCard
          title="Clicks GitHub"
          value={stats.events.githubClicks}
          color="purple"
        />
        <EventCard
          title="Clicks LinkedIn"
          value={stats.events.linkedinClicks}
          color="blue"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event Distribution */}
        <div className="bg-amber-50 dark:bg-[#3D2548] rounded-lg shadow-lg p-6 border border-amber-200 dark:border-[#4D3558]">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            Distribución de Eventos
          </h2>
          <div className="space-y-3">
            {stats.eventCounts.map((event) => (
              <div
                key={event._id}
                className="flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium capitalize text-gray-700 dark:text-gray-300">
                      {event._id.replace(/_/g, " ")}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{event.count}</span>
                  </div>
                  <div className="w-full bg-amber-200 dark:bg-[#4D3558] rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{
                        width: `${
                          (event.count /
                            Math.max(
                              ...stats.eventCounts.map((e) => e.count)
                            )) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Referrers */}
        <div className="bg-amber-50 dark:bg-[#3D2548] rounded-lg shadow-lg p-6 border border-amber-200 dark:border-[#4D3558]">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Top Referrers</h2>
          <div className="space-y-3">
            {stats.topReferrers.length > 0 ? (
              stats.topReferrers.map((referrer, index) => (
                <div
                  key={referrer._id}
                  className="flex items-center justify-between p-3 bg-amber-100 dark:bg-[#4D3558] rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-400">
                      #{index + 1}
                    </span>
                    <span className="text-sm truncate max-w-xs text-gray-700 dark:text-gray-300">
                      {referrer._id || "Direct"}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    {referrer.count}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No hay referrers registrados
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Location Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Top Countries */}
        <div className="bg-amber-50 dark:bg-[#3D2548] rounded-lg shadow-lg p-6 border border-amber-200 dark:border-[#4D3558]">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <span>🌍</span> Países
          </h2>
          <div className="space-y-3">
            {stats.topCountries && stats.topCountries.length > 0 ? (
              stats.topCountries.map((country, index) => (
                <div
                  key={country._id.countryCode}
                  className="flex items-center justify-between p-3 bg-amber-100 dark:bg-[#4D3558] rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-400">
                      #{index + 1}
                    </span>
                    <span className="text-2xl">
                      {country._id.countryCode === "US" && "🇺🇸"}
                      {country._id.countryCode === "MX" && "🇲🇽"}
                      {country._id.countryCode === "ES" && "🇪🇸"}
                      {country._id.countryCode === "AR" && "🇦🇷"}
                      {country._id.countryCode === "CO" && "🇨🇴"}
                      {country._id.countryCode === "CL" && "🇨🇱"}
                      {country._id.countryCode === "PE" && "🇵🇪"}
                      {country._id.countryCode === "VE" && "🇻🇪"}
                      {!["US", "MX", "ES", "AR", "CO", "CL", "PE", "VE"].includes(country._id.countryCode) && "🌐"}
                    </span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {country._id.country}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    {country.count}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No hay datos de ubicación disponibles
              </p>
            )}
          </div>
        </div>

        {/* Top Cities */}
        <div className="bg-amber-50 dark:bg-[#3D2548] rounded-lg shadow-lg p-6 border border-amber-200 dark:border-[#4D3558]">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <span>🏙️</span> Ciudades
          </h2>
          <div className="space-y-3">
            {stats.topCities && stats.topCities.length > 0 ? (
              stats.topCities.map((city, index) => (
                <div
                  key={`${city._id.city}-${city._id.country}`}
                  className="flex items-center justify-between p-3 bg-amber-100 dark:bg-[#4D3558] rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-400">
                      #{index + 1}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {city._id.city}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {city._id.country}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    {city.count}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No hay datos de ciudades disponibles
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="mt-8 text-center">
        <button
          onClick={fetchStats}
          className="px-6 py-3 bg-amber-100 dark:bg-[#3D2548] text-gray-700 dark:text-gray-300 rounded-lg hover:bg-amber-200 dark:hover:bg-[#4D3558] transition-colors border border-amber-200 dark:border-[#4D3558]"
        >
          Actualizar Datos
        </button>
      </div>
    </div>
  );
}

// Components
const StatsCard: React.FC<{
  title: string;
  value: number | string;
  icon: string;
  subtitle?: string;
}> = ({ title, value, icon, subtitle }) => (
  <div className="bg-amber-50 dark:bg-[#3D2548] rounded-lg shadow-lg p-6 border border-amber-200 dark:border-[#4D3558]">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
        {title}
      </h3>
      <span className="text-2xl">{icon}</span>
    </div>
    <p className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-1">{value}</p>
    {subtitle && (
      <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
    )}
  </div>
);

const EventCard: React.FC<{
  title: string;
  value: number;
  color: string;
}> = ({ title, value, color }) => {
  const colorClasses = {
    blue: "border-blue-500",
    green: "border-green-500",
    purple: "border-purple-500",
    red: "border-red-500",
  };

  return (
    <div
      className={`bg-amber-50 dark:bg-[#3D2548] rounded-lg shadow-lg p-6 border-l-4 ${colorClasses[color as keyof typeof colorClasses]}`}
    >
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
        {title}
      </h3>
      <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
    </div>
  );
};

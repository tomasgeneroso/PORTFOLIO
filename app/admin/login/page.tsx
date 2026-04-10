"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        router.push("/admin/analytics");
      } else {
        setError("Usuario o contraseña incorrectos");
      }
    } catch (err) {
      setError("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1025] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#3D2548] border border-[#5D4568] mb-4">
            <svg className="w-8 h-8 text-[#C9A8D8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-100">
            Admin
          </h1>
          <p className="text-sm text-[#9B8BA3] mt-1">
            Ingresa tus credenciales
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="block text-xs font-medium text-[#9B8BA3] mb-1.5 uppercase tracking-wider"
            >
              Usuario
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-[#3D2548]
                bg-[#2a1d35] text-gray-100 placeholder-[#6B5B73]
                focus:outline-none focus:ring-2 focus:ring-[#7C5C8F] focus:border-transparent
                transition-all duration-200"
              placeholder="tu usuario"
              required
              autoFocus
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-medium text-[#9B8BA3] mb-1.5 uppercase tracking-wider"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-[#3D2548]
                bg-[#2a1d35] text-gray-100 placeholder-[#6B5B73]
                focus:outline-none focus:ring-2 focus:ring-[#7C5C8F] focus:border-transparent
                transition-all duration-200"
              placeholder="tu contraseña"
              required
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-900/20 border border-red-800/40">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-lg font-medium
              bg-[#7C5C8F] text-white
              hover:bg-[#8D6BA0]
              focus:outline-none focus:ring-2 focus:ring-[#7C5C8F] focus:ring-offset-2 focus:ring-offset-[#1a1025]
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                Verificando...
              </span>
            ) : (
              "Iniciar Sesión"
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm text-[#6B5B73] hover:text-[#C9A8D8] transition-colors"
          >
            ← Volver al portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}

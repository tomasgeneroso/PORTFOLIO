"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStatus, setForgotStatus] = useState<"idle" | "sent" | "error">("idle");
  const [forgotLoading, setForgotLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        router.push("/admin/analytics");
      } else {
        setError("Usuario o contraseña incorrectos");
      }
    } catch {
      setError("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const [forgotError, setForgotError] = useState("");

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotStatus("idle");
    setForgotError("");

    try {
      const res = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setForgotError(data.error || `Error ${res.status}`);
        setForgotStatus("error");
      } else {
        setForgotStatus("sent");
      }
    } catch {
      setForgotStatus("error");
      setForgotError("No se pudo conectar al servidor.");
    } finally {
      setForgotLoading(false);
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
          <h1 className="text-2xl font-bold text-gray-100">Admin</h1>
          <p className="text-sm text-[#9B8BA3] mt-1">
            {forgotMode ? "Recuperar acceso" : "Ingresa tus credenciales"}
          </p>
        </div>

        {!forgotMode ? (
          <>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="username" className="block text-xs font-medium text-[#9B8BA3] mb-1.5 uppercase tracking-wider">
                  Usuario
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[#3D2548] bg-[#2a1d35] text-gray-100 placeholder-[#6B5B73] focus:outline-none focus:ring-2 focus:ring-[#7C5C8F] focus:border-transparent transition-all duration-200"
                  placeholder="tu usuario"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-medium text-[#9B8BA3] mb-1.5 uppercase tracking-wider">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[#3D2548] bg-[#2a1d35] text-gray-100 placeholder-[#6B5B73] focus:outline-none focus:ring-2 focus:ring-[#7C5C8F] focus:border-transparent transition-all duration-200"
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
                className="w-full py-3 px-4 rounded-lg font-medium bg-[#7C5C8F] text-white hover:bg-[#8D6BA0] focus:outline-none focus:ring-2 focus:ring-[#7C5C8F] focus:ring-offset-2 focus:ring-offset-[#1a1025] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                    Verificando...
                  </span>
                ) : "Iniciar Sesión"}
              </button>
            </form>

            <div className="mt-5 text-center">
              <button
                onClick={() => setForgotMode(true)}
                className="text-sm text-[#7C5C8F] hover:text-[#C9A8D8] transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </>
        ) : (
          <>
            {forgotStatus === "sent" ? (
              <div className="text-center py-4">
                <div className="text-3xl mb-3">📧</div>
                <p className="text-gray-100 font-medium">Revisá tu email</p>
                <p className="text-[#9B8BA3] text-sm mt-2">Enviamos un enlace de acceso válido por 15 minutos.</p>
                <button
                  onClick={() => { setForgotMode(false); setForgotStatus("idle"); }}
                  className="mt-6 text-sm text-[#7C5C8F] hover:text-[#C9A8D8] transition-colors"
                >
                  ← Volver al login
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgot} className="space-y-5">
                <div>
                  <label htmlFor="forgot-email" className="block text-xs font-medium text-[#9B8BA3] mb-1.5 uppercase tracking-wider">
                    Email del administrador
                  </label>
                  <input
                    type="email"
                    id="forgot-email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-[#3D2548] bg-[#2a1d35] text-gray-100 placeholder-[#6B5B73] focus:outline-none focus:ring-2 focus:ring-[#7C5C8F] focus:border-transparent transition-all duration-200"
                    placeholder="tu@email.com"
                    required
                    autoFocus
                  />
                </div>

                {forgotStatus === "error" && (
                  <div className="p-3 rounded-lg bg-red-900/20 border border-red-800/40">
                    <p className="text-sm text-red-400">{forgotError || "Error al enviar. Intentá de nuevo."}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3 px-4 rounded-lg font-medium bg-[#7C5C8F] text-white hover:bg-[#8D6BA0] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {forgotLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                      Enviando...
                    </span>
                  ) : "Enviar enlace de acceso"}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setForgotMode(false)}
                    className="text-sm text-[#6B5B73] hover:text-[#C9A8D8] transition-colors"
                  >
                    ← Volver al login
                  </button>
                </div>
              </form>
            )}
          </>
        )}

        {!forgotMode && (
          <div className="mt-8 text-center">
            <Link href="/" className="text-sm text-[#6B5B73] hover:text-[#C9A8D8] transition-colors">
              ← Volver al portfolio
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

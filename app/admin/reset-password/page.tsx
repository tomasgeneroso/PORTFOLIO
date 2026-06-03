"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ResetContent() {
  const [status, setStatus] = useState<"loading" | "form" | "error">("loading");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  useEffect(() => {
    if (!token) { setStatus("error"); return; }
    fetch(`/api/admin/forgot-password?token=${token}`)
      .then(r => r.json())
      .then(d => setStatus(d.valid ? "form" : "error"))
      .catch(() => setStatus("error"));
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setSaveError("Las contraseñas no coinciden"); return; }
    setSaving(true);
    setSaveError("");
    try {
      const res = await fetch("/api/admin/forgot-password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setSaveError(data.error || "Error al guardar"); }
      else { router.push("/admin/analytics"); }
    } catch { setSaveError("Error de red"); }
    finally { setSaving(false); }
  };

  if (status === "loading") return (
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#7C5C8F] border-t-white mx-auto mb-4" />
      <p className="text-[#9B8BA3]">Verificando enlace...</p>
    </div>
  );

  if (status === "error") return (
    <div className="text-center">
      <div className="text-4xl mb-4">❌</div>
      <p className="text-gray-100 font-medium">Enlace inválido o expirado</p>
      <p className="text-[#9B8BA3] text-sm mt-2">El enlace dura 15 minutos.</p>
      <button
        onClick={() => router.push("/admin/login")}
        className="mt-6 px-6 py-2 rounded-lg bg-[#7C5C8F] text-white text-sm hover:bg-[#8D6BA0] transition-colors"
      >
        Volver al login
      </button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="text-center mb-2">
        <div className="text-3xl mb-2">🔑</div>
        <h2 className="text-gray-100 font-semibold text-lg">Nueva contraseña</h2>
        <p className="text-[#9B8BA3] text-sm mt-1">Elegí una nueva contraseña para acceder al panel.</p>
      </div>
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Nueva contraseña (mín. 6 caracteres)"
        required
        autoFocus
        className="w-full px-4 py-3 rounded-lg border border-[#3D2548] bg-[#2a1d35] text-gray-100 placeholder-[#6B5B73] focus:outline-none focus:ring-2 focus:ring-[#7C5C8F] focus:border-transparent"
      />
      <input
        type="password"
        value={confirm}
        onChange={e => setConfirm(e.target.value)}
        placeholder="Confirmar contraseña"
        required
        className="w-full px-4 py-3 rounded-lg border border-[#3D2548] bg-[#2a1d35] text-gray-100 placeholder-[#6B5B73] focus:outline-none focus:ring-2 focus:ring-[#7C5C8F] focus:border-transparent"
      />
      {saveError && (
        <div className="p-3 rounded-lg bg-red-900/20 border border-red-800/40">
          <p className="text-sm text-red-400">{saveError}</p>
        </div>
      )}
      <button
        type="submit"
        disabled={saving}
        className="w-full py-3 px-4 rounded-lg font-medium bg-[#7C5C8F] text-white hover:bg-[#8D6BA0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {saving ? "Guardando..." : "Guardar contraseña y entrar"}
      </button>
    </form>
  );
}

export default function ResetPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1025] px-4">
      <div className="w-full max-w-sm">
        <Suspense fallback={
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#7C5C8F] border-t-white mx-auto mb-4" />
            <p className="text-[#9B8BA3]">Cargando...</p>
          </div>
        }>
          <ResetContent />
        </Suspense>
      </div>
    </div>
  );
}

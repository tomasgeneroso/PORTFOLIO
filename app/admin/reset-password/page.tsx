"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ResetContent() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) { setStatus("error"); return; }

    fetch(`/api/admin/forgot-password?token=${token}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.valid) {
          setStatus("success");
          setTimeout(() => router.push("/admin/analytics"), 1500);
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, [searchParams, router]);

  return (
    <div className="text-center">
      {status === "loading" && (
        <>
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#7C5C8F] border-t-white mx-auto mb-4" />
          <p className="text-[#9B8BA3]">Verificando enlace...</p>
        </>
      )}
      {status === "success" && (
        <>
          <div className="text-4xl mb-4">✅</div>
          <p className="text-gray-100 font-medium">Acceso concedido</p>
          <p className="text-[#9B8BA3] text-sm mt-1">Redirigiendo al dashboard...</p>
        </>
      )}
      {status === "error" && (
        <>
          <div className="text-4xl mb-4">❌</div>
          <p className="text-gray-100 font-medium">Enlace inválido o expirado</p>
          <p className="text-[#9B8BA3] text-sm mt-2">El enlace dura 15 minutos.</p>
          <button
            onClick={() => router.push("/admin/login")}
            className="mt-6 px-6 py-2 rounded-lg bg-[#7C5C8F] text-white text-sm hover:bg-[#8D6BA0] transition-colors"
          >
            Volver al login
          </button>
        </>
      )}
    </div>
  );
}

export default function ResetPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1025] px-4">
      <Suspense fallback={
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#7C5C8F] border-t-white mx-auto mb-4" />
          <p className="text-[#9B8BA3]">Cargando...</p>
        </div>
      }>
        <ResetContent />
      </Suspense>
    </div>
  );
}

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Proteger rutas de admin
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Permitir acceso a la página de login sin autenticación
    if (request.nextUrl.pathname === "/admin/login") {
      return NextResponse.next();
    }

    // Verificar cookie de autenticación
    const authCookie = request.cookies.get("admin-auth");

    if (!authCookie || authCookie.value !== "authenticated") {
      // Redirigir a login si no está autenticado
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};

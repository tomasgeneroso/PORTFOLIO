import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Proteger rutas de admin
  const path = request.nextUrl.pathname;

  if (path.startsWith("/api/admin")) {
    // El callback de Google OAuth viene de un redirect cross-site, sin cookie
    if (path === "/api/admin/planner/calendar/callback") return NextResponse.next();
    const authCookie = request.cookies.get("admin-auth");
    if (!authCookie || authCookie.value !== "authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } else if (path.startsWith("/admin")) {
    if (path === "/admin/login" || path === "/admin/reset-password") return NextResponse.next();
    const authCookie = request.cookies.get("admin-auth");
    if (!authCookie || authCookie.value !== "authenticated") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

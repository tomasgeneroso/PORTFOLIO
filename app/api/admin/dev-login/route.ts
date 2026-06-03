import { NextResponse } from "next/server";

// Solo funciona en desarrollo local — en producción devuelve 404
export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const response = NextResponse.redirect(new URL("http://localhost:3000/admin/analytics"));

  response.cookies.set("admin-auth", "authenticated", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });

  return response;
}

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import { getOrCreateSettings } from "@/models/planner";

const hash = (s: string) => crypto.createHash("sha256").update(s).digest("hex");

const SESSION_COOKIE = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 365,
  path: "/",
};

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    await connectDB();
    const s = await getOrCreateSettings();

    let valid = false;

    if (s.adminPassword) {
      // Contraseña guardada en MongoDB (tiene precedencia)
      valid = username === process.env.ADMIN_USER && s.adminPassword === hash(password);
    } else {
      // Fallback a env vars
      valid = username === process.env.ADMIN_USER && password === process.env.ADMIN_PASSWORD;
    }

    if (valid) {
      const response = NextResponse.json({ success: true }, { status: 200 });
      response.cookies.set("admin-auth", "authenticated", SESSION_COOKIE);
      return response;
    }

    return NextResponse.json({ success: false }, { status: 401 });
  } catch (error) {
    console.error("Error en autenticación:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

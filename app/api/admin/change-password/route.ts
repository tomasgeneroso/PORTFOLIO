import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import { getOrCreateSettings } from "@/models/planner";

const hash = (s: string) => crypto.createHash("sha256").update(s).digest("hex");
const isAuth = (req: NextRequest) => req.cookies.get("admin-auth")?.value === "authenticated";

export async function POST(req: NextRequest) {
  if (!isAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { current, next } = await req.json();
  if (!current || !next) return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
  if (next.length < 6) return NextResponse.json({ error: "Mínimo 6 caracteres" }, { status: 400 });

  await connectDB();
  const s = await getOrCreateSettings();

  // Verificar contraseña actual
  let currentValid = false;
  if (s.adminPassword) {
    currentValid = s.adminPassword === hash(current);
  } else {
    currentValid = current === process.env.ADMIN_PASSWORD;
  }

  if (!currentValid) return NextResponse.json({ error: "Contraseña actual incorrecta" }, { status: 400 });

  s.adminPassword = hash(next);
  await s.save();

  return NextResponse.json({ ok: true });
}

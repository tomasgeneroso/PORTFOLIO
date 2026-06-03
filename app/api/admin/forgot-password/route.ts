import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import { getOrCreateSettings } from "@/models/planner";
import mongoose from "mongoose";

const SESSION_COOKIE = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 365,
  path: "/",
};

const hashPwd = (s: string) => crypto.createHash("sha256").update(s).digest("hex");

async function getTokensCollection() {
  await connectDB();
  return mongoose.connection.db!.collection("admin_reset_tokens");
}

// Solicitar reset → manda email
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    const adminEmail = process.env.GMAIL_USER || "";
    if (!adminEmail || email !== adminEmail) {
      return NextResponse.json({ success: true });
    }

    const col = await getTokensCollection();
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 15 * 60 * 1000);

    await col.deleteMany({ type: "admin_reset" });
    await col.insertOne({ type: "admin_reset", token, expiry });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://tomasgeneroso.site";
    const resetUrl = `${baseUrl}/admin/reset-password?token=${token}`;

    const s = await getOrCreateSettings();
    const { smtp } = s;
    const smtpUser = smtp.user || process.env.GMAIL_USER || "";
    const smtpPass = smtp.pass || process.env.GMAIL_APP_PASSWORD || "";

    if (!smtpUser || !smtpPass) {
      return NextResponse.json({ success: false, error: "SMTP no configurado en Planner → Configuración" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: smtp.host || "smtp.gmail.com",
      port: smtp.port || 587,
      secure: smtp.host ? smtp.secure : false,
      auth: { user: smtpUser, pass: smtpPass },
    });

    await transporter.sendMail({
      from: `"Portfolio Admin" <${smtpUser}>`,
      to: adminEmail,
      subject: "Restablecer acceso - Admin Portfolio",
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #3D2548;">Restablecer acceso</h2>
          <p>Hacé clic en el enlace para cambiar tu contraseña. Expira en <strong>15 minutos</strong>.</p>
          <a href="${resetUrl}" style="display:inline-block; margin: 16px 0; padding: 12px 24px; background: #7C5C8F; color: white; border-radius: 8px; text-decoration: none; font-weight: bold;">
            Cambiar contraseña
          </a>
          <p style="color: #999; font-size: 13px;">Si no solicitaste esto, ignorá este email.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[ForgotPassword] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Validar token (sin consumirlo)
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.json({ valid: false });

  try {
    const col = await getTokensCollection();
    const doc = await col.findOne({ type: "admin_reset", token });
    if (!doc || new Date() > new Date(doc.expiry)) {
      await col.deleteOne({ token });
      return NextResponse.json({ valid: false });
    }
    return NextResponse.json({ valid: true });
  } catch {
    return NextResponse.json({ valid: false });
  }
}

// Aplicar nueva contraseña + loguear (consume el token)
export async function PATCH(request: NextRequest) {
  try {
    const { token, password } = await request.json();
    if (!token || !password) return NextResponse.json({ ok: false, error: "Faltan datos" }, { status: 400 });
    if (password.length < 6) return NextResponse.json({ ok: false, error: "Mínimo 6 caracteres" }, { status: 400 });

    const col = await getTokensCollection();
    const doc = await col.findOne({ type: "admin_reset", token });

    if (!doc || new Date() > new Date(doc.expiry)) {
      await col.deleteOne({ token });
      return NextResponse.json({ ok: false, error: "Token inválido o expirado" }, { status: 400 });
    }

    await col.deleteOne({ token });

    await connectDB();
    const s = await getOrCreateSettings();
    s.adminPassword = hashPwd(password);
    await s.save();

    const response = NextResponse.json({ ok: true });
    response.cookies.set("admin-auth", "authenticated", SESSION_COOKIE);
    return response;
  } catch (error: any) {
    console.error("[ForgotPassword PATCH] Error:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import { getOrCreateSettings } from "@/models/planner";
import mongoose from "mongoose";

async function getTokensCollection() {
  await connectDB();
  return mongoose.connection.db!.collection("admin_reset_tokens");
}

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
    const smtpHost = smtp.host || "smtp.gmail.com";
    const smtpPort = smtp.port || 587;
    const smtpSecure = smtp.host ? smtp.secure : false;
    const smtpUser = smtp.user || process.env.GMAIL_USER || "";
    const smtpPass = smtp.pass || process.env.GMAIL_APP_PASSWORD || "";

    if (!smtpUser || !smtpPass) {
      return NextResponse.json({ success: false, error: "SMTP no configurado en Planner → Configuración" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: { user: smtpUser, pass: smtpPass },
    });

    await transporter.sendMail({
      from: `"Portfolio Admin" <${smtpUser}>`,
      to: adminEmail,
      subject: "Restablecer acceso - Admin Portfolio",
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #3D2548;">Restablecer acceso</h2>
          <p>Hacé clic en el siguiente enlace para acceder al panel de administración. El enlace expira en <strong>15 minutos</strong>.</p>
          <a href="${resetUrl}" style="display:inline-block; margin: 16px 0; padding: 12px 24px; background: #7C5C8F; color: white; border-radius: 8px; text-decoration: none; font-weight: bold;">
            Acceder al panel
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

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ valid: false });
  }

  try {
    const col = await getTokensCollection();
    const doc = await col.findOne({ type: "admin_reset", token });

    if (!doc || new Date() > new Date(doc.expiry)) {
      await col.deleteOne({ token });
      return NextResponse.json({ valid: false });
    }

    await col.deleteOne({ token });

    const response = NextResponse.json({ valid: true });
    response.cookies.set("admin-auth", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[ForgotPassword GET] Error:", error);
    return NextResponse.json({ valid: false });
  }
}

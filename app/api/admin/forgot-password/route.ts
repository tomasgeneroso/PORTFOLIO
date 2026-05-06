import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";

// Token en memoria (válido 15 minutos)
const tokens = new Map<string, number>();

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (email !== process.env.GMAIL_USER) {
      // Respuesta genérica para no revelar si el email existe
      return NextResponse.json({ success: true });
    }

    const token = crypto.randomBytes(32).toString("hex");
    tokens.set(token, Date.now() + 15 * 60 * 1000);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://tomasgeneroso.site";
    const resetUrl = `${baseUrl}/admin/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Portfolio Admin" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: "Restablecer contraseña - Admin Portfolio",
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #3D2548;">Restablecer contraseña</h2>
          <p>Hacé clic en el siguiente enlace para acceder al panel de administración. El enlace expira en <strong>15 minutos</strong>.</p>
          <a href="${resetUrl}" style="display:inline-block; margin: 16px 0; padding: 12px 24px; background: #7C5C8F; color: white; border-radius: 8px; text-decoration: none; font-weight: bold;">
            Acceder al panel
          </a>
          <p style="color: #999; font-size: 13px;">Si no solicitaste esto, ignorá este email.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ForgotPassword] Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ valid: false });
  }

  const expiry = tokens.get(token);
  if (!expiry || Date.now() > expiry) {
    tokens.delete(token);
    return NextResponse.json({ valid: false });
  }

  // Token válido: crear sesión y eliminar token
  tokens.delete(token);

  const response = NextResponse.json({ valid: true });
  response.cookies.set("admin-auth", "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24,
    path: "/",
  });

  return response;
}

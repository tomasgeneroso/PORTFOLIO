import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getOrCreateSettings } from "@/models/planner";
import nodemailer from "nodemailer";

const isAuth = (req: NextRequest) => req.cookies.get("admin-auth")?.value === "authenticated";

export async function POST(req: NextRequest) {
  if (!isAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const body = await req.json();
  const s = await getOrCreateSettings();
  const { smtp } = s;

  // Fallback a las variables de entorno si SMTP no está configurado en settings
  const smtpHost = smtp.host || "smtp.gmail.com";
  const smtpPort = smtp.port || 465;
  const smtpSecure = smtp.host ? smtp.secure : true;
  const smtpUser = smtp.user || process.env.GMAIL_USER || "";
  const smtpPass = smtp.pass || process.env.GMAIL_APP_PASSWORD || "";

  if (!smtpUser || !smtpPass) {
    return NextResponse.json({ error: "SMTP no configurado. Agrega GMAIL_USER y GMAIL_APP_PASSWORD en Vercel." }, { status: 400 });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: { user: smtpUser, pass: smtpPass },
    });

    if (body.action === "test") {
      await transporter.verify();
      return NextResponse.json({ ok: true });
    }

    if (body.action === "send") {
      await transporter.sendMail({
        from: smtp.user,
        to: body.to,
        subject: body.subject,
        text: body.bodyText,
        html: `<p>${body.bodyText.replace(/\n/g, "<br>")}</p>`,
      });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getOrCreateSettings } from "@/models/planner";
import nodemailer from "nodemailer";

const isAuth = (req: NextRequest) => req.cookies.get("admin-auth")?.value === "authenticated";

export async function POST(req: NextRequest) {
  if (!isAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();

  const { to, subject, body, pdfBase64, pdfName } = await req.json();
  if (!to || !subject || !body) return NextResponse.json({ error: "Faltan campos obligatorios." }, { status: 400 });

  const s = await getOrCreateSettings();
  const { smtp } = s;

  const smtpHost = smtp.host || "smtp.gmail.com";
  const smtpPort = smtp.port || 465;
  const smtpSecure = smtp.host ? smtp.secure : true;
  const smtpUser = smtp.user || process.env.GMAIL_USER || "";
  const smtpPass = smtp.pass || process.env.GMAIL_APP_PASSWORD || "";

  if (!smtpUser || !smtpPass) {
    return NextResponse.json({ error: "SMTP no configurado. Ve a Configuración en el Planner." }, { status: 400 });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: { user: smtpUser, pass: smtpPass },
    });

    const attachments = pdfBase64 && pdfName
      ? [{ filename: pdfName, content: pdfBase64, encoding: "base64" as const }]
      : [];

    await transporter.sendMail({
      from: smtpUser,
      to,
      subject,
      text: body,
      html: `<p>${body.replace(/\n/g, "<br>")}</p>`,
      attachments,
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

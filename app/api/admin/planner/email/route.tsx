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

  if (!smtp.host || !smtp.user || !smtp.pass) {
    return NextResponse.json({ error: "SMTP no configurado. Ve a Configuración." }, { status: 400 });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: { user: smtp.user, pass: smtp.pass },
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

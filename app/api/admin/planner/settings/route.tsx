import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getOrCreateSettings } from "@/models/planner";

const isAuth = (req: NextRequest) => req.cookies.get("admin-auth")?.value === "authenticated";

export async function GET(req: NextRequest) {
  if (!isAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const s = await getOrCreateSettings();
  const safe = s.toObject();
  if (safe.smtp?.pass) safe.smtp.pass = "••••••••";
  return NextResponse.json(safe);
}

export async function PUT(req: NextRequest) {
  if (!isAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const body = await req.json();
  const s = await getOrCreateSettings();

  if (body.myEmail !== undefined) s.myEmail = body.myEmail;
  if (body.smtp) {
    s.smtp = {
      host: body.smtp.host ?? s.smtp.host,
      port: body.smtp.port ?? s.smtp.port,
      secure: body.smtp.secure ?? s.smtp.secure,
      user: body.smtp.user ?? s.smtp.user,
      pass: body.smtp.pass === "••••••••" ? s.smtp.pass : (body.smtp.pass ?? s.smtp.pass),
    };
  }
  if (body.googleCalendar) {
    s.googleCalendar = {
      clientId: body.googleCalendar.clientId ?? s.googleCalendar.clientId,
      clientSecret: body.googleCalendar.clientSecret ?? s.googleCalendar.clientSecret,
      redirectUri: body.googleCalendar.redirectUri ?? s.googleCalendar.redirectUri,
      refreshToken: body.googleCalendar.refreshToken ?? s.googleCalendar.refreshToken,
      accessToken: body.googleCalendar.accessToken ?? s.googleCalendar.accessToken,
      tokenExpiry: body.googleCalendar.tokenExpiry ?? s.googleCalendar.tokenExpiry,
    };
  }
  await s.save();
  return NextResponse.json({ ok: true });
}

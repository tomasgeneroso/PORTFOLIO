import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getOrCreateSettings } from "@/models/planner";
import { google } from "googleapis";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) return NextResponse.redirect(new URL("/admin/planner?cal=error", req.url));

  try {
    await connectDB();
    const s = await getOrCreateSettings();
    const gc = s.googleCalendar;
    const client = new google.auth.OAuth2(gc.clientId, gc.clientSecret, gc.redirectUri);
    const { tokens } = await client.getToken(code);
    s.googleCalendar.refreshToken = tokens.refresh_token || gc.refreshToken;
    s.googleCalendar.accessToken = tokens.access_token || "";
    s.googleCalendar.tokenExpiry = tokens.expiry_date || null;
    await s.save();
    return NextResponse.redirect(new URL("/admin/planner?cal=ok", req.url));
  } catch (err: any) {
    return NextResponse.redirect(new URL(`/admin/planner?cal=error`, req.url));
  }
}

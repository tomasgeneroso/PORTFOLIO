import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getOrCreateSettings } from "@/models/planner";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) return NextResponse.redirect(new URL("/admin/planner?cal=error", req.url));

  try {
    await connectDB();
    const s = await getOrCreateSettings();
    const gc = s.googleCalendar;

    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: gc.clientId,
        client_secret: gc.clientSecret,
        redirect_uri: gc.redirectUri,
        code,
        grant_type: "authorization_code",
      }),
    });
    const tokens = await res.json();
    if (!res.ok) throw new Error(tokens.error_description || "Failed to exchange code");

    s.googleCalendar.refreshToken = tokens.refresh_token || gc.refreshToken;
    s.googleCalendar.accessToken = tokens.access_token || "";
    s.googleCalendar.tokenExpiry = tokens.expiry_date || (tokens.expires_in ? Date.now() + tokens.expires_in * 1000 : null);
    await s.save();
    return NextResponse.redirect(new URL("/admin/planner?cal=ok", req.url));
  } catch {
    return NextResponse.redirect(new URL("/admin/planner?cal=error", req.url));
  }
}

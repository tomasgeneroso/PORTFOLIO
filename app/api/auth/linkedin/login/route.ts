// app/api/auth/linkedin/login/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const CLIENT_ID = process.env.CLIENT_ID_LINKEDIN!;
  const REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI!;
  
  if (!CLIENT_ID || !REDIRECT_URI) {
    return NextResponse.json(
      { error: "Missing LinkedIn configuration" },
      { status: 500 }
    );
  }

  const state = Math.random().toString(36).substring(7);
  const scope = encodeURIComponent("openid profile email");
  
  const authUrl =
    `https://www.linkedin.com/oauth/v2/authorization` +
    `?response_type=code` +
    `&client_id=${CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&state=${state}` +
    `&scope=${scope}`;

  return NextResponse.redirect(authUrl);
}
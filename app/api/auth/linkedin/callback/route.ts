// app/api/auth/linkedin/callback/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  if (error) {
    console.error("LinkedIn OAuth error:", error, errorDescription);
    return NextResponse.redirect(new URL(`/?error=${error}`, request.url));
  }

  if (!code) {
    return NextResponse.json({ error: "Missing authorization code" }, { status: 400 });
  }

  const CLIENT_ID = process.env.CLIENT_ID_LINKEDIN!;
  const CLIENT_SECRET = process.env.CLIENT_SECRET_LINKEDIN!;
  const REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI!;

  try {
    const tokenResponse = await fetch(
      "https://www.linkedin.com/oauth/v2/accessToken",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code: code,
          redirect_uri: REDIRECT_URI,
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("Token error:", tokenData);
      return NextResponse.json(
        { error: "Failed to get access token", details: tokenData },
        { status: 500 }
      );
    }

    const accessToken = tokenData.access_token;
    const expiresIn = tokenData.expires_in;

    const response = NextResponse.redirect(new URL("/?auth=success", request.url));

    response.cookies.set("linkedin_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: expiresIn,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Callback error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
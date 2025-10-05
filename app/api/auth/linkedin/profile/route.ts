// app/api/auth/linkedin/profile/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("linkedin_token")?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userInfoRes = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!userInfoRes.ok) {
      const errorText = await userInfoRes.text();
      console.error("LinkedIn API error:", errorText);
      
      if (userInfoRes.status === 401) {
        const response = NextResponse.json({ error: "Token expired" }, { status: 401 });
        response.cookies.delete("linkedin_token");
        return response;
      }

      return NextResponse.json(
        { error: "Failed to fetch user info", details: errorText },
        { status: userInfoRes.status }
      );
    }

    const userInfo = await userInfoRes.json();

    return NextResponse.json({
      id: userInfo.sub,
      name: userInfo.name,
      given_name: userInfo.given_name,
      family_name: userInfo.family_name,
      email: userInfo.email,
      email_verified: userInfo.email_verified,
      picture: userInfo.picture,
      locale: userInfo.locale,
    });
  } catch (error) {
    console.error("Profile API error:", error);
    return NextResponse.json({ error: "Error al obtener datos de LinkedIn" }, { status: 500 });
  }
}
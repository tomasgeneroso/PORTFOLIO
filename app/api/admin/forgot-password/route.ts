import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

async function getTokensCollection() {
  await connectDB();
  return mongoose.connection.db!.collection("admin_reset_tokens");
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    const adminEmail = process.env.GMAIL_USER || "";
    if (!adminEmail || email !== adminEmail) {
      return NextResponse.json({ success: true });
    }

    const col = await getTokensCollection();
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 15 * 60 * 1000);

    await col.deleteMany({ type: "admin_reset" });
    await col.insertOne({ type: "admin_reset", token, expiry });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://tomasgeneroso.site";
    const resetUrl = `${baseUrl}/admin/reset-password?token=${token}`;

    // Devuelve el link directamente — no depende de SMTP
    return NextResponse.json({ success: true, resetUrl });
  } catch (error: any) {
    console.error("[ForgotPassword] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ valid: false });
  }

  try {
    const col = await getTokensCollection();
    const doc = await col.findOne({ type: "admin_reset", token });

    if (!doc || new Date() > new Date(doc.expiry)) {
      await col.deleteOne({ token });
      return NextResponse.json({ valid: false });
    }

    await col.deleteOne({ token });

    const response = NextResponse.json({ valid: true });
    response.cookies.set("admin-auth", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[ForgotPassword GET] Error:", error);
    return NextResponse.json({ valid: false });
  }
}

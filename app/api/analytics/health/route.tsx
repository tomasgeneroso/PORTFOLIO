import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json(
      { success: true, status: "connected" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error conectando a MongoDB:", error);
    return NextResponse.json(
      {
        success: false,
        status: "disconnected",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 503 }
    );
  }
}

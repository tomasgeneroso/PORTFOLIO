import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Analytics from "@/models/analytics";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Agregar metadata del servidor
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const eventData = {
      ...body,
      ip,
      createdAt: new Date(),
    };

    const analytics = await Analytics.create(eventData);

    return NextResponse.json(
      {
        success: true,
        message: "Evento registrado",
        id: analytics._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error guardando evento de analytics:", error);
    return NextResponse.json(
      { success: false, error: "Error al guardar evento" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Analytics from "@/models/analytics";
import { getLocationFromIP } from "@/lib/geolocation";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Obtener IP del cliente
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Obtener ubicación de la IP
    const location = await getLocationFromIP(ip);

    const eventData = {
      ...body,
      ip,
      location: location || undefined,
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

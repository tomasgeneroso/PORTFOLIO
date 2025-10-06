import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Analytics from "@/models/analytics";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { events } = await request.json();

    if (!Array.isArray(events) || events.length === 0) {
      return NextResponse.json(
        { success: false, error: "No hay eventos para procesar" },
        { status: 400 }
      );
    }

    // Agregar IP a cada evento
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const eventsWithMetadata = events.map((event) => ({
      ...event,
      ip,
      createdAt: new Date(),
    }));

    // Insertar todos los eventos de una vez
    const result = await Analytics.insertMany(eventsWithMetadata);

    return NextResponse.json(
      {
        success: true,
        message: `${result.length} eventos sincronizados`,
        count: result.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error guardando lote de analytics:", error);
    return NextResponse.json(
      { success: false, error: "Error al guardar eventos" },
      { status: 500 }
    );
  }
}

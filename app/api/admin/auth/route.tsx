import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Verificar usuario y contraseña
    if (username === process.env.ADMIN_USER && password === process.env.ADMIN_KEY) {
      // Crear la respuesta con cookie
      const response = NextResponse.json(
        { success: true, message: "Autenticación exitosa" },
        { status: 200 }
      );

      // Establecer cookie segura
      // La cookie expira en 24 horas
      response.cookies.set("admin-auth", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 24 horas
        path: "/",
      });

      return response;
    } else {
      return NextResponse.json(
        { success: false, message: "Contraseña incorrecta" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error en autenticación:", error);
    return NextResponse.json(
      { success: false, message: "Error en el servidor" },
      { status: 500 }
    );
  }
}

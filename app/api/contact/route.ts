import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const { senderEmail, subject, message } = await request.json();

    if (!senderEmail || !subject || !message) {
      return NextResponse.json({ success: false, message: "Faltan campos requeridos" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: senderEmail,
      subject: `[Portfolio] ${subject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px;">
          <h2 style="color: #3D2548;">Nuevo mensaje desde tu portfolio</h2>
          <p><strong>De:</strong> ${senderEmail}</p>
          <p><strong>Asunto:</strong> ${subject}</p>
          <hr style="border-color: #eee;" />
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: "Mensaje enviado correctamente" });
  } catch (error) {
    console.error("Error enviando email:", error);
    return NextResponse.json({ success: false, message: "Error al enviar el mensaje" }, { status: 500 });
  }
}

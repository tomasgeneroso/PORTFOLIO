import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { PlannerTask, getOrCreateSettings } from "@/models/planner";
import nodemailer from "nodemailer";

export async function GET(req: NextRequest) {
  // Verificar que viene de Vercel Cron (o llamada interna autorizada)
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  // Buscar tareas con email programado, no enviado, y cuyo scheduledAt ya pasó
  const now = new Date();
  const tasks = await PlannerTask.find({
    "emailNotification.sent": false,
    "emailNotification.scheduledAt": { $lte: now.toISOString() },
  });

  if (tasks.length === 0) {
    return NextResponse.json({ sent: 0 });
  }

  const s = await getOrCreateSettings();
  const smtp = s.smtp;

  const transporter = nodemailer.createTransport({
    host: smtp.host || "smtp.gmail.com",
    port: smtp.port || 465,
    secure: smtp.host ? smtp.secure : true,
    auth: {
      user: smtp.user || process.env.GMAIL_USER || "",
      pass: smtp.pass || process.env.GMAIL_APP_PASSWORD || "",
    },
  });

  let sent = 0;
  for (const task of tasks) {
    const notif = task.emailNotification;
    if (!notif?.recipient) continue;

    try {
      await transporter.sendMail({
        from: smtp.user || process.env.GMAIL_USER,
        to: notif.recipient,
        subject: `Recordatorio: ${task.title}`,
        html: `
          <div style="font-family:sans-serif;max-width:500px">
            <h2 style="color:#3D2548">Recordatorio de tarea</h2>
            <p><strong>${task.title}</strong></p>
            ${notif.message ? `<p>${notif.message}</p>` : ""}
            ${task.dueDate ? `<p>Fecha límite: <strong>${new Date(task.dueDate).toLocaleString("es-ES")}</strong></p>` : ""}
          </div>
        `,
      });

      task.emailNotification.sent = true;
      task.emailNotification.sentAt = new Date().toISOString();
      await task.save();
      sent++;
    } catch (err: any) {
      console.error(`[Cron] Error enviando email para tarea ${task.id}:`, err.message);
    }
  }

  return NextResponse.json({ sent, total: tasks.length });
}

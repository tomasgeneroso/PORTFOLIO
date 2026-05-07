import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getOrCreateSettings, PlannerTask, PlannerProject } from "@/models/planner";
import { google } from "googleapis";
import crypto from "crypto";

const isAuth = (req: NextRequest) => req.cookies.get("admin-auth")?.value === "authenticated";

// Mapea un color hex al colorId más cercano de Google Calendar (1-11)
function hexToCalendarColorId(hex: string): string {
  const colors: Record<string, string> = {
    "#a4bdfc": "1", "#7ae7bf": "2", "#dbadff": "3", "#ff887c": "4",
    "#fbd75b": "5", "#ffb878": "6", "#46d6db": "7", "#e1e1e1": "8",
    "#5484ed": "9", "#51b749": "10", "#dc2127": "11",
  };
  // Encontrar el color más cercano por distancia euclidiana en RGB
  const r1 = parseInt(hex.slice(1, 3), 16);
  const g1 = parseInt(hex.slice(3, 5), 16);
  const b1 = parseInt(hex.slice(5, 7), 16);
  let closest = "9";
  let minDist = Infinity;
  for (const [h, id] of Object.entries(colors)) {
    const r2 = parseInt(h.slice(1, 3), 16);
    const g2 = parseInt(h.slice(3, 5), 16);
    const b2 = parseInt(h.slice(5, 7), 16);
    const dist = Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
    if (dist < minDist) { minDist = dist; closest = id; }
  }
  return closest;
}

function getOAuthClient(gc: any) {
  const client = new google.auth.OAuth2(gc.clientId, gc.clientSecret, gc.redirectUri);
  if (gc.refreshToken) client.setCredentials({ refresh_token: gc.refreshToken, access_token: gc.accessToken });
  return client;
}

// GET?action=status | GET?action=auth-url
export async function GET(req: NextRequest) {
  if (!isAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const action = req.nextUrl.searchParams.get("action");
  const s = await getOrCreateSettings();
  const gc = s.googleCalendar;

  if (action === "status") {
    return NextResponse.json({ connected: !!gc.refreshToken });
  }

  if (action === "auth-url") {
    if (!gc.clientId || !gc.clientSecret) {
      return NextResponse.json({ error: "Configura Client ID y Client Secret primero." }, { status: 400 });
    }
    const url = getOAuthClient(gc).generateAuthUrl({
      access_type: "offline",
      scope: ["https://www.googleapis.com/auth/calendar"],
      prompt: "consent",
    });
    return NextResponse.json({ url });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

// POST: create event
export async function POST(req: NextRequest) {
  if (!isAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const body = await req.json();
  const s = await getOrCreateSettings();

  // 1. Crear evento en Google Calendar
  let calEvent: any;
  try {
    const calendar = google.calendar({ version: "v3", auth: getOAuthClient(s.googleCalendar) });

    // Reminders: array de minutos antes del evento
    const reminderMinutes: number[] = Array.isArray(body.reminders) ? body.reminders : [];
    const reminderOverrides = reminderMinutes.flatMap((m: number) => [
      { method: "popup", minutes: m },
      { method: "email", minutes: m },
    ]);

    // Color del proyecto para el evento
    let colorId: string | undefined;
    if (body.projectColor) {
      colorId = hexToCalendarColorId(body.projectColor);
    }

    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: {
        summary: body.title,
        description: body.description || "",
        start: { dateTime: body.start },
        end: { dateTime: body.end || new Date(new Date(body.start).getTime() + 3600000).toISOString() },
        colorId,
        reminders: reminderOverrides.length > 0
          ? { useDefault: false, overrides: reminderOverrides }
          : { useDefault: true },
      },
    });
    calEvent = response.data;
  } catch (err: any) {
    console.error("[Calendar] Error creando evento:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  // 2. Crear o vincular tarea en el planner (independiente del paso anterior)
  let newTask = null;
  try {
    if (body.taskId) {
      await PlannerTask.findOneAndUpdate(
        { id: body.taskId },
        { calendarEventId: calEvent.id, updatedAt: new Date().toISOString() }
      );
    } else if (body.projectId) {
      const count = await PlannerTask.countDocuments({ column: "Backlog", projectId: body.projectId, deletedAt: null });
      const project = await PlannerProject.findOne({ id: body.projectId }).lean() as any;
      const taskId = crypto.randomUUID();
      const now = new Date().toISOString();
      const taskData = {
        id: taskId,
        projectId: body.projectId,
        title: body.title,
        description: body.description || "",
        column: "Backlog",
        color: project?.color || "#67e8f9",
        dueDate: body.start || null,
        calendarEventId: calEvent.id,
        deletedAt: null,
        order: count,
        photos: [],
        emailNotification: null,
        createdAt: now,
        updatedAt: now,
      };
      await PlannerTask.create(taskData);
      newTask = taskData;
    }
  } catch (err: any) {
    console.error("[Calendar] Error creando tarea en planner:", err.message);
    // No fallamos el request — el evento de Calendar ya fue creado
  }

  return NextResponse.json({ event: calEvent, task: newTask });
}

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getOrCreateSettings, PlannerTask } from "@/models/planner";
import { google } from "googleapis";
import crypto from "crypto";

const isAuth = (req: NextRequest) => req.cookies.get("admin-auth")?.value === "authenticated";

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
    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: {
        summary: body.title,
        description: body.description || "",
        start: { dateTime: body.start },
        end: { dateTime: body.end || new Date(new Date(body.start).getTime() + 3600000).toISOString() },
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
      const count = await PlannerTask.countDocuments({ column: "Backlog", projectId: body.projectId });
      newTask = await PlannerTask.create({
        id: crypto.randomUUID(),
        projectId: body.projectId,
        title: body.title,
        description: body.description || "",
        column: "Backlog",
        color: "#67e8f9",
        dueDate: body.start || null,
        calendarEventId: calEvent.id,
        order: count,
        photos: [],
        emailNotification: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      newTask = newTask.toObject();
    }
  } catch (err: any) {
    console.error("[Calendar] Error creando tarea en planner:", err.message);
    // No fallamos el request — el evento de Calendar ya fue creado
  }

  return NextResponse.json({ event: calEvent, task: newTask });
}

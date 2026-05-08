import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getOrCreateSettings, PlannerTask, PlannerProject } from "@/models/planner";
import crypto from "crypto";

const isAuth = (req: NextRequest) => req.cookies.get("admin-auth")?.value === "authenticated";

function hexToCalendarColorId(hex: string): string {
  const colors: Record<string, string> = {
    "#a4bdfc": "1", "#7ae7bf": "2", "#dbadff": "3", "#ff887c": "4",
    "#fbd75b": "5", "#ffb878": "6", "#46d6db": "7", "#e1e1e1": "8",
    "#5484ed": "9", "#51b749": "10", "#dc2127": "11",
  };
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

async function getAccessToken(gc: any): Promise<string> {
  if (gc.accessToken && gc.tokenExpiry && Date.now() < gc.tokenExpiry - 60000) {
    return gc.accessToken;
  }
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: gc.clientId,
      client_secret: gc.clientSecret,
      refresh_token: gc.refreshToken,
      grant_type: "refresh_token",
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || "Failed to refresh token");
  return data.access_token;
}

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
    const params = new URLSearchParams({
      client_id: gc.clientId,
      redirect_uri: gc.redirectUri,
      response_type: "code",
      scope: "https://www.googleapis.com/auth/calendar",
      access_type: "offline",
      prompt: "consent",
    });
    return NextResponse.json({ url: `https://accounts.google.com/o/oauth2/v2/auth?${params}` });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

export async function POST(req: NextRequest) {
  if (!isAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const body = await req.json();
  const s = await getOrCreateSettings();

  let calEvent: any;
  try {
    const accessToken = await getAccessToken(s.googleCalendar);

    const reminderMinutes: number[] = Array.isArray(body.reminders) ? body.reminders : [];
    const reminderOverrides = reminderMinutes.flatMap((m: number) => [
      { method: "popup", minutes: m },
      { method: "email", minutes: m },
    ]);

    const eventBody: any = {
      summary: body.title,
      description: body.description || "",
      start: { dateTime: body.start },
      end: { dateTime: body.end || new Date(new Date(body.start).getTime() + 3600000).toISOString() },
      reminders: reminderOverrides.length > 0
        ? { useDefault: false, overrides: reminderOverrides }
        : { useDefault: true },
    };
    if (body.projectColor) eventBody.colorId = hexToCalendarColorId(body.projectColor);

    const res = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify(eventBody),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || "Error creating calendar event");
    calEvent = data;
  } catch (err: any) {
    console.error("[Calendar] Error creando evento:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

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
  }

  return NextResponse.json({ event: calEvent, task: newTask });
}

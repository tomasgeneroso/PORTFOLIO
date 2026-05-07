import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { PlannerTask } from "@/models/planner";
import crypto from "crypto";

const isAuth = (req: NextRequest) => req.cookies.get("admin-auth")?.value === "authenticated";

export async function GET(req: NextRequest) {
  if (!isAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();

  const projectId = req.nextUrl.searchParams.get("projectId");
  const includeDeleted = req.nextUrl.searchParams.get("deleted") === "true";

  // Auto-purge tasks deleted more than 30 days ago
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  await PlannerTask.deleteMany({ deletedAt: { $ne: null, $lt: thirtyDaysAgo } });

  const baseFilter = projectId ? { projectId } : {};

  if (includeDeleted) {
    const tasks = await PlannerTask.find({ ...baseFilter, deletedAt: { $ne: null } }).lean();
    return NextResponse.json(tasks);
  }

  const tasks = await PlannerTask.find({ ...baseFilter, deletedAt: null }).lean();
  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  if (!isAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const body = await req.json();
  const count = await PlannerTask.countDocuments({ column: body.column, projectId: body.projectId, deletedAt: null });
  const task = await PlannerTask.create({
    id: crypto.randomUUID(),
    projectId: body.projectId,
    title: body.title,
    description: body.description || "",
    column: body.column || "Backlog",
    photos: [],
    dueDate: body.dueDate || null,
    emailNotification: body.emailNotification || null,
    calendarEventId: null,
    deletedAt: null,
    order: count,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return NextResponse.json(task);
}

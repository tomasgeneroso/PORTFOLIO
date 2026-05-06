import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { PlannerProject } from "@/models/planner";
import crypto from "crypto";

function isAuth(req: NextRequest) {
  return req.cookies.get("admin-auth")?.value === "authenticated";
}

export async function GET(req: NextRequest) {
  if (!isAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const projects = await PlannerProject.find().lean();
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  if (!isAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const body = await req.json();
  const project = await PlannerProject.create({
    id: crypto.randomUUID(),
    name: body.name,
    color: body.color || "#6366f1",
    columns: body.columns || ["Backlog", "En Proceso", "Revisar", "Terminado"],
  });
  return NextResponse.json(project);
}

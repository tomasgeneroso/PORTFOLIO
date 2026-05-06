import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { PlannerProject, PlannerTask } from "@/models/planner";

const isAuth = (req: NextRequest) => req.cookies.get("admin-auth")?.value === "authenticated";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const body = await req.json();
  const project = await PlannerProject.findOneAndUpdate({ id: params.id }, body, { new: true });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(project);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  await PlannerProject.deleteOne({ id: params.id });
  await PlannerTask.deleteMany({ projectId: params.id });
  return NextResponse.json({ ok: true });
}

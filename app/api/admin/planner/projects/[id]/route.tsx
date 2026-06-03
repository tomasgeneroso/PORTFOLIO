import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { PlannerProject, PlannerTask } from "@/models/planner";

const isAuth = (req: NextRequest) => req.cookies.get("admin-auth")?.value === "authenticated";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const { id } = await params;
  const body = await req.json();

  if (Array.isArray(body.columns)) {
    const current = await PlannerProject.findOne({ id }).lean() as any;
    if (current) {
      const removed = (current.columns as string[]).filter((c: string) => !body.columns.includes(c));
      if (removed.length > 0) {
        const fallback = body.columns[0] || "Backlog";
        await PlannerTask.updateMany(
          { projectId: id, column: { $in: removed }, deletedAt: null },
          { column: fallback }
        );
      }
    }
  }

  const project = await PlannerProject.findOneAndUpdate({ id }, body, { new: true });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(project);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const { id } = await params;
  await PlannerProject.deleteOne({ id });
  await PlannerTask.deleteMany({ projectId: id });
  return NextResponse.json({ ok: true });
}

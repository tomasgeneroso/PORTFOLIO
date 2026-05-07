import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { PlannerTask } from "@/models/planner";
import crypto from "crypto";

const isAuth = (req: NextRequest) => req.cookies.get("admin-auth")?.value === "authenticated";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const body = await req.json();
  const task = await PlannerTask.findOneAndUpdate(
    { id: params.id },
    { ...body, updatedAt: new Date().toISOString() },
    { new: true }
  );
  if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(task);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  // Soft delete — se purga automáticamente a los 30 días
  await PlannerTask.findOneAndUpdate(
    { id: params.id },
    { deletedAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  );
  return NextResponse.json({ ok: true });
}

// PATCH: addPhotos or removePhoto
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const body = await req.json();
  const task = await PlannerTask.findOne({ id: params.id });
  if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (body.action === "addPhotos") {
    const newPhotos = (body.photos as Array<{ dataUrl: string; name: string }>).map(p => ({
      id: crypto.randomUUID(),
      dataUrl: p.dataUrl,
      name: p.name,
    }));
    task.photos = [...task.photos, ...newPhotos];
  } else if (body.action === "removePhoto") {
    task.photos = task.photos.filter((p: any) => p.id !== body.photoId);
  } else {
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  task.updatedAt = new Date().toISOString();
  await task.save();
  return NextResponse.json(task);
}

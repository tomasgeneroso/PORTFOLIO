/* eslint-disable @next/next/no-img-element */
"use client";

import React, { Suspense, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// ===== TYPES =====
interface Photo { id: string; dataUrl: string; name: string; }
interface EmailNotif { recipient: string; message: string; scheduledAt: string | null; sent: boolean; sentAt: string | null; }
interface Task {
  id: string; projectId: string; title: string; description: string;
  column: string; color: string | null; photos: Photo[]; dueDate: string | null;
  emailNotification: EmailNotif | null; calendarEventId: string | null;
  order: number; deletedAt: string | null; createdAt: string; updatedAt: string;
}
interface Project { id: string; name: string; color: string; columns: string[]; }
interface Settings {
  myEmail: string;
  smtp: { host: string; port: number; secure: boolean; user: string; pass: string };
  googleCalendar: { clientId: string; clientSecret: string; redirectUri: string; refreshToken: string; accessToken: string };
}

// ===== API =====
const api = {
  async get(url: string) {
    const r = await fetch(url);
    if (!r.ok) { const e = await r.json().catch(() => ({})); throw new Error(e.error || r.statusText); }
    return r.json();
  },
  async post(url: string, data: any) {
    const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (!r.ok) { const e = await r.json().catch(() => ({})); throw new Error(e.error || r.statusText); }
    return r.json();
  },
  async put(url: string, data: any) {
    const r = await fetch(url, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (!r.ok) { const e = await r.json().catch(() => ({})); throw new Error(e.error || r.statusText); }
    return r.json();
  },
  async patch(url: string, data: any) {
    const r = await fetch(url, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (!r.ok) { const e = await r.json().catch(() => ({})); throw new Error(e.error || r.statusText); }
    return r.json();
  },
  async del(url: string) {
    const r = await fetch(url, { method: "DELETE" });
    if (!r.ok) { const e = await r.json().catch(() => ({})); throw new Error(e.error || r.statusText); }
    return r.json();
  },
};

// ===== TOAST =====
function useToast() {
  const [toasts, setToasts] = useState<Array<{ id: number; msg: string; type: string }>>([]);
  const show = useCallback((msg: string, type = "info") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);
  return { toasts, show };
}

// ===== COMPRESS PHOTO (client-side) =====
function compressImage(file: File): Promise<{ dataUrl: string; name: string }> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 1200;
        let w = img.width, h = img.height;
        if (w > MAX) { h = (h * MAX) / w; w = MAX; }
        if (h > MAX) { w = (w * MAX) / h; h = MAX; }
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
        resolve({ dataUrl: canvas.toDataURL("image/jpeg", 0.8), name: file.name });
      };
      img.src = e.target!.result as string;
    };
    reader.readAsDataURL(file);
  });
}

// ===== COLUMN COLORS =====
const COL_COLORS: Record<string, string> = {
  "Backlog": "#94a3b8",
  "En Proceso": "#6366f1",
  "Revisar": "#f59e0b",
  "Terminado": "#22c55e",
};
const getColColor = (name: string) => COL_COLORS[name] || "#a78bfa";

// ===== DROPPABLE COLUMN WRAPPER =====
function DroppableColumn({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className={`flex-1 overflow-y-auto p-2 space-y-2 min-h-[80px] rounded-lg transition-colors ${isOver ? "bg-[#6366f1]/10" : ""}`}>
      {children}
    </div>
  );
}

// ===== SORTABLE CARD =====
function SortableCard({ task, onClick }: { task: Task; onClick: () => void }) {
  const { listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.35 : 1 };
  const due = task.dueDate ? new Date(task.dueDate) : null;
  const overdue = due && due < new Date() && task.column !== "Terminado";

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        borderLeftColor: task.color ?? undefined,
        borderLeftWidth: task.color ? "3px" : undefined,
      }}
      className="bg-[#2D1B3D] border border-[#3D2548] rounded-xl p-3 hover:border-[#6366f1] hover:shadow-lg hover:shadow-purple-900/30 transition-all group"
    >
      {/* Drag handle */}
      <div
        {...listeners}
        className="flex items-center mb-2 cursor-grab active:cursor-grabbing touch-none"
      >
        <svg className="w-3 h-3 text-[#4D3558] group-hover:text-[#6366f1] transition-colors" viewBox="0 0 10 16" fill="currentColor">
          <circle cx="2" cy="2" r="1.5"/><circle cx="8" cy="2" r="1.5"/>
          <circle cx="2" cy="8" r="1.5"/><circle cx="8" cy="8" r="1.5"/>
          <circle cx="2" cy="14" r="1.5"/><circle cx="8" cy="14" r="1.5"/>
        </svg>
      </div>

      {/* Click to edit */}
      <div onClick={onClick} className="cursor-pointer select-none">
        <p className="text-sm font-semibold text-gray-100 mb-1 leading-snug">{task.title}</p>
        {task.description && (
          <p className="text-xs text-[#9B8BA3] mb-2 line-clamp-2 leading-relaxed">{task.description}</p>
        )}
        {due && (
          <p className={`text-xs mb-2 flex items-center gap-1 ${overdue ? "text-red-400 font-medium" : "text-[#9B8BA3]"}`}>
            📅 {due.toLocaleDateString("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
          </p>
        )}
        {task.photos.length > 0 && (
          <div className="flex gap-1 mb-2 flex-wrap">
            {task.photos.slice(0, 4).map(p => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={p.id} src={p.dataUrl} alt="" className="w-10 h-10 rounded-lg object-cover border border-[#4D3558]" />
            ))}
            {task.photos.length > 4 && <span className="text-xs text-[#9B8BA3] self-center">+{task.photos.length - 4}</span>}
          </div>
        )}
        <div className="flex gap-2 flex-wrap">
          {task.emailNotification && <span className="text-xs text-[#9B8BA3] bg-[#3D2548] px-2 py-0.5 rounded-full">{task.emailNotification.sent ? "📧✓" : "📧"}</span>}
          {task.calendarEventId && <span className="text-xs text-[#9B8BA3] bg-[#3D2548] px-2 py-0.5 rounded-full">📅</span>}
        </div>
      </div>
    </div>
  );
}

// ===== HOME DRAGGABLE CARD =====
function HomeDraggableCard({ task, project, onClick }: { task: Task; project: Project; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id, data: { task, projectId: project.id } });
  const style = { transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined, opacity: isDragging ? 0.35 : 1, zIndex: isDragging ? 50 : undefined };
  const due = task.dueDate ? new Date(task.dueDate) : null;
  const overdue = due && due < new Date();

  return (
    <div ref={setNodeRef} style={style} className="relative">
      {/* Drag handle */}
      <div {...attributes} {...listeners} className="absolute top-2 right-2 cursor-grab active:cursor-grabbing touch-none p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10" onClick={e => e.stopPropagation()}>
        <svg className="w-3 h-3 text-[#4D3558]" viewBox="0 0 10 16" fill="currentColor">
          <circle cx="2" cy="2" r="1.5"/><circle cx="8" cy="2" r="1.5"/>
          <circle cx="2" cy="8" r="1.5"/><circle cx="8" cy="8" r="1.5"/>
          <circle cx="2" cy="14" r="1.5"/><circle cx="8" cy="14" r="1.5"/>
        </svg>
      </div>
      <div
        onClick={onClick}
        className="bg-[#1E1230] border border-[#2D1B3D] rounded-xl p-3 cursor-pointer hover:border-[#6366f1] hover:shadow-lg hover:shadow-purple-900/20 transition-all group"
        style={task.color ? { borderLeftColor: task.color, borderLeftWidth: "3px" } : {}}
      >
        <p className="text-sm font-semibold text-gray-100 mb-1 leading-snug pr-5">{task.title}</p>
        {task.description && <p className="text-xs text-[#9B8BA3] line-clamp-2 mb-2">{task.description}</p>}
        {due && (
          <p className={`text-xs flex items-center gap-1 ${overdue ? "text-red-400 font-medium" : "text-[#9B8BA3]"}`}>
            📅 {due.toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
            {overdue && " · Vencida"}
          </p>
        )}
        {task.calendarEventId && <span className="text-[10px] text-[#9B8BA3] bg-[#2D1B3D] px-1.5 py-0.5 rounded-full mt-1 inline-block">📅</span>}
      </div>
    </div>
  );
}

// ===== HOME DROP ZONE =====
function HomeDropZone({ projectId, children }: { projectId: string; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: `home-proj:${projectId}` });
  return (
    <div ref={setNodeRef} className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 min-h-[80px] rounded-xl p-2 transition-colors ${isOver ? "bg-[#6366f1]/10 ring-1 ring-[#6366f1]/40" : ""}`}>
      {children}
    </div>
  );
}

// ===== MAIN COMPONENT =====
export default function PlannerPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent" /></div>}>
      <PlannerContent />
    </Suspense>
  );
}

function PlannerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toasts, show: toast } = useToast();

  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [deletedTasks, setDeletedTasks] = useState<Task[]>([]);
  const [showDeleted, setShowDeleted] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [homeMode, setHomeMode] = useState(true);
  const [allBacklogTasks, setAllBacklogTasks] = useState<Task[]>([]);
  const [homeDraggingTask, setHomeDraggingTask] = useState<Task | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [calConnected, setCalConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [taskModal, setTaskModal] = useState<{ open: boolean; task: Partial<Task> | null; isNew: boolean }>({ open: false, task: null, isNew: true });
  const [settingsModal, setSettingsModal] = useState(false);
  const [calModal, setCalModal] = useState<{ open: boolean; taskId?: string }>({ open: false });
  const [newProjectModal, setNewProjectModal] = useState(false);
  const [editProjectModal, setEditProjectModal] = useState(false);
  const [editProjectForm, setEditProjectForm] = useState({ name: "", color: "#6366f1" });
  const [lightbox, setLightbox] = useState<{ open: boolean; photos: Photo[]; idx: number }>({ open: false, photos: [], idx: 0 });

  // Form state
  const [taskForm, setTaskForm] = useState({ title: "", description: "", column: "Backlog", dueDate: "", emailEnabled: false, emailTo: "", emailMsg: "", emailSchedule: "", calReminders: [] as number[] });
  const [settingsForm, setSettingsForm] = useState({ myEmail: "", smtpHost: "", smtpPort: 587, smtpSecure: false, smtpUser: "", smtpPass: "", gcClientId: "", gcClientSecret: "", gcRedirectUri: "" });
  const [calForm, setCalForm] = useState({ title: "", description: "", start: "", end: "", reminders: [] as number[] });
  const [newProjectForm, setNewProjectForm] = useState({ name: "", color: "#6366f1" });
  const [pendingPhotos, setPendingPhotos] = useState<Photo[]>([]);
  const [smtpTestResult, setSmtpTestResult] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // DnD
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  // Load initial data
  useEffect(() => {
    async function load() {
      try {
        const [projs, sett] = await Promise.all([
          api.get("/api/admin/planner/projects"),
          api.get("/api/admin/planner/settings"),
        ]);
        setProjects(projs);
        setSettings(sett);
        loadSettingsForm(sett);
        const calStat = await api.get("/api/admin/planner/calendar?action=status");
        setCalConnected(calStat.connected);

        await loadHomeView();
      } catch (e: any) { toast(e.message, "error"); }
      finally { setLoading(false); }
    }
    load();

    // Handle calendar OAuth callback
    const cal = searchParams.get("cal");
    if (cal === "ok") toast("Google Calendar conectado correctamente", "success");
    if (cal === "error") toast("Error al conectar Google Calendar", "error");
  }, [searchParams, toast]);

  const loadSettingsForm = (s: any) => {
    setSettingsForm({
      myEmail: s.myEmail || "",
      smtpHost: s.smtp?.host || "",
      smtpPort: s.smtp?.port || 587,
      smtpSecure: s.smtp?.secure || false,
      smtpUser: s.smtp?.user || "",
      smtpPass: s.smtp?.pass || "",
      gcClientId: s.googleCalendar?.clientId || "",
      gcClientSecret: s.googleCalendar?.clientSecret || "",
      gcRedirectUri: s.googleCalendar?.redirectUri || (typeof window !== "undefined" ? `${window.location.origin}/api/admin/planner/calendar/callback` : ""),
    });
  };

  const loadHomeView = async () => {
    try {
      const all: Task[] = await api.get("/api/admin/planner/tasks");
      setAllBacklogTasks(all.filter((t: Task) => t.column === "Backlog" && !t.deletedAt));
    } catch (e: any) {
      toast("Error cargando home: " + e.message, "error");
    }
  };

  const handleHomeDragEnd = async (e: DragEndEvent) => {
    setHomeDraggingTask(null);
    const { active, over } = e;
    if (!over) return;

    const overId = String(over.id);
    if (!overId.startsWith("home-proj:")) return;

    const targetProjectId = overId.replace("home-proj:", "");
    const task = active.data.current?.task as Task;
    if (!task || task.projectId === targetProjectId) return;

    // Actualizar estado local inmediatamente
    setAllBacklogTasks(prev => prev.map(t =>
      t.id === task.id ? { ...t, projectId: targetProjectId } : t
    ));

    // Obtener color del proyecto destino para actualizar la card
    const targetProject = projects.find(p => p.id === targetProjectId);

    try {
      await api.put(`/api/admin/planner/tasks/${task.id}`, {
        projectId: targetProjectId,
        color: targetProject?.color || task.color,
      });
      toast(`Tarea movida a ${targetProject?.name || "otro proyecto"}`, "success");
    } catch (err: any) {
      // Revertir si falla
      setAllBacklogTasks(prev => prev.map(t =>
        t.id === task.id ? { ...t, projectId: task.projectId } : t
      ));
      toast(err.message, "error");
    }
  };

  const selectProject = async (project: Project) => {
    setHomeMode(false);
    setCurrentProject(project);
    setSidebarOpen(false);
    const [active, deleted] = await Promise.all([
      api.get(`/api/admin/planner/tasks?projectId=${project.id}`),
      api.get(`/api/admin/planner/tasks?projectId=${project.id}&deleted=true`),
    ]);
    setTasks(active);
    setDeletedTasks(deleted);
  };

  // ===== TASK MODAL =====
  const openNewTask = (col = "Backlog") => {
    setTaskForm({ title: "", description: "", column: col, dueDate: "", emailEnabled: false, emailTo: settings?.myEmail || "", emailMsg: "", emailSchedule: "", calReminders: [] });
    setPendingPhotos([]);
    setTaskModal({ open: true, task: null, isNew: true });
  };

  const openEditTask = (task: Task) => {
    const en = !!task.emailNotification;
    setTaskForm({
      title: task.title,
      description: task.description,
      column: task.column,
      dueDate: task.dueDate ? task.dueDate.slice(0, 16) : "",
      emailEnabled: en,
      emailTo: task.emailNotification?.recipient || settings?.myEmail || "",
      emailMsg: task.emailNotification?.message || "",
      emailSchedule: task.emailNotification?.scheduledAt ? task.emailNotification.scheduledAt.slice(0, 16) : "",
      calReminders: [],
    });
    setPendingPhotos([]);
    setTaskModal({ open: true, task, isNew: false });
  };

  const saveTask = async () => {
    if (!taskForm.title.trim()) { toast("El título es obligatorio", "error"); return; }
    const emailNotification = taskForm.emailEnabled ? {
      recipient: taskForm.emailTo,
      message: taskForm.emailMsg,
      scheduledAt: taskForm.emailSchedule ? new Date(taskForm.emailSchedule).toISOString() : null,
      sent: false, sentAt: null,
    } : null;

    const data = { title: taskForm.title, description: taskForm.description, column: taskForm.column, dueDate: taskForm.dueDate || null, emailNotification, projectId: currentProject!.id };

    try {
      let saved: Task;
      if (taskModal.isNew) {
        saved = await api.post("/api/admin/planner/tasks", data);
      } else {
        saved = await api.put(`/api/admin/planner/tasks/${(taskModal.task as Task).id}`, data);
      }

      if (pendingPhotos.length > 0) {
        saved = await api.patch(`/api/admin/planner/tasks/${saved.id}`, { action: "addPhotos", photos: pendingPhotos });
      }

      setTasks(prev => taskModal.isNew ? [...prev, saved] : prev.map(t => t.id === saved.id ? saved : t));
      setTaskModal({ open: false, task: null, isNew: true });
      toast(taskModal.isNew ? "Tarea creada" : "Tarea actualizada", "success");
    } catch (e: any) { toast(e.message, "error"); }
  };

  const deleteTask = async () => {
    const task = taskModal.task as Task;
    if (!task?.id || !confirm("¿Mover esta tarea a Eliminados?")) return;
    try {
      await api.del(`/api/admin/planner/tasks/${task.id}`);
      const deletedTask = { ...task, deletedAt: new Date().toISOString() };
      setTasks(prev => prev.filter(t => t.id !== task.id));
      setDeletedTasks(prev => [deletedTask, ...prev]);
      setTaskModal({ open: false, task: null, isNew: true });
      toast("Tarea movida a Eliminados (se borra en 30 días)", "info");
    } catch (e: any) { toast(e.message, "error"); }
  };

  const handlePhotoSelect = async (files: FileList | null) => {
    if (!files) return;
    const compressedRaw = await Promise.all(Array.from(files).map(compressImage));
    const compressed: Photo[] = compressedRaw.map(p => ({ ...p, id: Math.random().toString(36).slice(2) }));
    const task = taskModal.task as Task;

    if (!taskModal.isNew && task?.id) {
      try {
        const updated = await api.patch(`/api/admin/planner/tasks/${task.id}`, { action: "addPhotos", photos: compressed });
        setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
        setTaskModal(m => ({ ...m, task: updated }));
        toast("Fotos subidas", "success");
      } catch (e: any) { toast(e.message, "error"); }
    } else {
      setPendingPhotos(prev => [...prev, ...compressed]);
    }
  };

  const removePhoto = async (photoId: string) => {
    const task = taskModal.task as Task;
    if (!taskModal.isNew && task?.id) {
      try {
        const updated = await api.patch(`/api/admin/planner/tasks/${task.id}`, { action: "removePhoto", photoId });
        setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
        setTaskModal(m => ({ ...m, task: updated }));
      } catch (e: any) { toast(e.message, "error"); }
    } else {
      setPendingPhotos(prev => prev.filter(p => p.id !== photoId));
    }
  };

  const sendEmailNow = async () => {
    if (!taskForm.emailTo) { toast("Ingresa un destinatario", "error"); return; }
    try {
      await api.post("/api/admin/planner/email", { action: "send", to: taskForm.emailTo, subject: `Recordatorio: ${taskForm.title}`, bodyText: taskForm.emailMsg || `Recordatorio: ${taskForm.title}` });
      toast("Email enviado", "success");
    } catch (e: any) { toast(e.message, "error"); }
  };

  // ===== DND =====
  const handleDragStart = (e: DragStartEvent) => {
    setActiveTask(tasks.find(t => t.id === e.active.id) || null);
  };

  const handleDragEnd = async (e: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = e;
    if (!over) return;

    const draggedTask = tasks.find(t => t.id === active.id);
    if (!draggedTask) return;

    // over.id is either "col:ColumnName" (DroppableColumn) or a task id
    const overId = String(over.id);
    const targetCol = overId.startsWith("col:")
      ? overId.slice(4)
      : tasks.find(t => t.id === overId)?.column ?? draggedTask.column;

    if (targetCol === draggedTask.column && active.id === over.id) return;

    setTasks(prev => prev.map(t => t.id === active.id ? { ...t, column: targetCol } : t));

    try {
      await api.put(`/api/admin/planner/tasks/${active.id}`, { column: targetCol });
    } catch { toast("Error al mover tarea", "error"); }
  };

  // ===== SETTINGS =====
  const saveSettings = async () => {
    try {
      await api.put("/api/admin/planner/settings", {
        myEmail: settingsForm.myEmail,
        smtp: { host: settingsForm.smtpHost, port: settingsForm.smtpPort, secure: settingsForm.smtpSecure, user: settingsForm.smtpUser, pass: settingsForm.smtpPass },
        googleCalendar: { clientId: settingsForm.gcClientId, clientSecret: settingsForm.gcClientSecret, redirectUri: settingsForm.gcRedirectUri || `${window.location.origin}/api/admin/planner/calendar/callback` },
      });
      toast("Configuración guardada", "success");
      setSettingsModal(false);
    } catch (e: any) { toast(e.message, "error"); }
  };

  const testSmtp = async () => {
    setSmtpTestResult("⏳ Probando...");
    try {
      await api.put("/api/admin/planner/settings", { smtp: { host: settingsForm.smtpHost, port: settingsForm.smtpPort, secure: settingsForm.smtpSecure, user: settingsForm.smtpUser, pass: settingsForm.smtpPass } });
      await api.post("/api/admin/planner/email", { action: "test" });
      setSmtpTestResult("✅ Conexión exitosa");
    } catch (e: any) { setSmtpTestResult(`❌ ${e.message}`); }
  };

  const connectGoogle = async () => {
    try {
      await api.put("/api/admin/planner/settings", { googleCalendar: { clientId: settingsForm.gcClientId, clientSecret: settingsForm.gcClientSecret, redirectUri: settingsForm.gcRedirectUri || `${window.location.origin}/api/admin/planner/calendar/callback` } });
      const { url } = await api.get("/api/admin/planner/calendar?action=auth-url");
      window.open(url, "_blank");
    } catch (e: any) { toast(e.message, "error"); }
  };

  // ===== CALENDAR =====
  const createCalEvent = async () => {
    if (!calForm.title || !calForm.start) { toast("Título y fecha son obligatorios", "error"); return; }
    try {
      const result = await api.post("/api/admin/planner/calendar", {
        title: calForm.title,
        description: calForm.description,
        start: new Date(calForm.start).toISOString(),
        end: calForm.end ? new Date(calForm.end).toISOString() : null,
        taskId: calModal.taskId,
        projectId: currentProject?.id,
        projectColor: currentProject?.color,
        reminders: calForm.reminders,
      });

      if (calModal.taskId) {
        setTasks(prev => prev.map(t => t.id === calModal.taskId ? { ...t, calendarEventId: result.event.id } : t));
        setTaskModal(m => m.task ? { ...m, task: { ...m.task, calendarEventId: result.event.id } } : m);
      } else if (result.task) {
        setTasks(prev => [...prev, result.task]);
        toast("Card creada en Backlog", "success");
      } else if (!calModal.taskId && !result.task) {
        toast("Evento creado, pero no se pudo crear la card (seleccioná un proyecto)", "info");
      }

      setCalModal({ open: false });
      toast("Evento creado en Google Calendar", "success");
    } catch (e: any) { toast(e.message, "error"); }
  };

  // ===== NEW PROJECT =====
  const createProject = async () => {
    if (!newProjectForm.name.trim()) { toast("El nombre es obligatorio", "error"); return; }
    try {
      const proj = await api.post("/api/admin/planner/projects", newProjectForm);
      setProjects(prev => [...prev, proj]);
      setNewProjectModal(false);
      await selectProject(proj);
      toast("Proyecto creado", "success");
    } catch (e: any) { toast(e.message, "error"); }
  };

  // ===== EDIT PROJECT =====
  const openEditProject = (p: Project) => {
    setEditProjectForm({ name: p.name, color: p.color });
    setEditProjectModal(true);
  };

  const updateProject = async () => {
    if (!currentProject) return;
    if (!editProjectForm.name.trim()) { toast("El nombre es obligatorio", "error"); return; }
    try {
      const updated = await api.put(`/api/admin/planner/projects/${currentProject.id}`, editProjectForm);
      setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
      setCurrentProject(updated);
      setEditProjectModal(false);
      toast("Proyecto actualizado", "success");
    } catch (e: any) { toast(e.message, "error"); }
  };

  const deleteProject = async () => {
    if (!currentProject || !confirm(`¿Eliminar "${currentProject.name}" y todas sus tareas?`)) return;
    try {
      await api.del(`/api/admin/planner/projects/${currentProject.id}`);
      const remaining = projects.filter(p => p.id !== currentProject.id);
      setProjects(remaining);
      setEditProjectModal(false);
      if (remaining.length > 0) await selectProject(remaining[0]);
      else { setCurrentProject(null); setTasks([]); }
      toast("Proyecto eliminado", "info");
    } catch (e: any) { toast(e.message, "error"); }
  };

  // ===== PHOTOS FOR TASK MODAL =====
  const currentTaskPhotos = (() => {
    if (!taskModal.task) return pendingPhotos;
    const existingPhotos = (taskModal.task as Task).photos || [];
    return taskModal.isNew ? pendingPhotos : [...existingPhotos, ...pendingPhotos];
  })();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1a1025]">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#9B8BA3] text-sm">Cargando Planner...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#1a1025] overflow-hidden text-gray-100">
      {/* Mobile sidebar backdrop */}
      <div
        className={`md:hidden fixed inset-0 bg-black/50 z-20 transition-opacity duration-300 ${sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* SIDEBAR */}
      <aside className={`fixed md:relative inset-y-0 left-0 z-30 w-64 md:w-52 flex-shrink-0 bg-[#120D1E] border-r border-[#2D1B3D] flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <div className="p-4 border-b border-[#2D1B3D]">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">⚡</span>
            <span className="font-bold text-base tracking-tight">Planner</span>
          </div>
          <button
            onClick={() => { setHomeMode(true); setCurrentProject(null); loadHomeView(); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold mb-2 transition-all border ${
              homeMode
                ? "bg-[#6366f1] border-[#6366f1] text-white shadow-lg shadow-indigo-900/30"
                : "border-[#3D2548] text-gray-300 hover:bg-[#2D1B3D] hover:border-[#6366f1] hover:text-white"
            }`}
          >
            🏠 Home
          </button>
          <button onClick={() => setNewProjectModal(true)} className="w-full py-2 px-3 text-xs font-medium text-[#9B8BA3] border border-dashed border-[#3D2548] rounded-lg hover:border-[#6366f1] hover:text-[#C9A8D8] transition-colors text-left">
            + Nuevo proyecto
          </button>
        </div>
        <nav className="flex-1 p-2 overflow-y-auto">
          {projects.map(p => (
            <div key={p.id} className={`group flex items-center gap-1 rounded-lg mb-1 transition-all ${currentProject?.id === p.id ? "bg-[#2D1B3D]" : "hover:bg-[#2D1B3D]/60"}`}>
              <button onClick={() => selectProject(p)} className={`flex-1 flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-left ${currentProject?.id === p.id ? "text-white" : "text-[#9B8BA3] group-hover:text-gray-200"}`}>
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
                {p.name}
              </button>
              <button
                onClick={() => { selectProject(p); openEditProject(p); }}
                className="opacity-0 group-hover:opacity-100 p-1.5 mr-1 rounded text-[#9B8BA3] hover:text-[#C9A8D8] transition-all"
                title="Editar proyecto"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>
          ))}
        </nav>
        <div className="p-2 border-t border-[#2D1B3D] space-y-1">
          <button onClick={() => { loadSettingsForm(settings); setSettingsModal(true); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-[#9B8BA3] hover:bg-[#2D1B3D] hover:text-gray-200 transition-colors">
            ⚙️ Configuración
          </button>
          <button onClick={() => router.push("/admin/analytics")} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-[#9B8BA3] hover:bg-[#2D1B3D] hover:text-gray-200 transition-colors">
            📊 Analytics
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TOPBAR */}
        <header className="h-14 flex-shrink-0 bg-[#120D1E] border-b border-[#2D1B3D] flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(v => !v)}
              className="md:hidden p-1.5 rounded-lg text-[#9B8BA3] hover:bg-[#2D1B3D] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="font-bold text-base truncate max-w-[160px] sm:max-w-none">{homeMode ? "Planner" : currentProject?.name || "Planner"}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { setCalForm({ title: "", description: "", start: "", end: "", reminders: [] }); setCalModal({ open: true }); }} className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg border border-[#3D2548] text-[#9B8BA3] hover:border-[#6366f1] hover:text-[#C9A8D8] transition-colors">
              <span>📅</span><span className="hidden sm:inline">Google Calendar</span>
            </button>
            {!homeMode && currentProject && (
              <button onClick={() => openNewTask()} className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white transition-colors">
                <span>+</span><span className="hidden sm:inline ml-0.5">Nueva tarea</span>
              </button>
            )}
          </div>
        </header>

        {/* HOME DASHBOARD */}
        {homeMode ? (
          <DndContext
            sensors={sensors}
            onDragStart={e => setHomeDraggingTask(e.active.data.current?.task ?? null)}
            onDragEnd={handleHomeDragEnd}
            onDragCancel={() => setHomeDraggingTask(null)}
          >
            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-100">Backlog general</h2>
                  <p className="text-xs text-[#9B8BA3] mt-1">{allBacklogTasks.length} tarea{allBacklogTasks.length !== 1 ? "s" : ""} pendiente{allBacklogTasks.length !== 1 ? "s" : ""}</p>
                </div>
                <button onClick={loadHomeView} className="text-xs text-[#9B8BA3] hover:text-[#C9A8D8] transition-colors flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Actualizar
                </button>
              </div>

              {allBacklogTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-[#9B8BA3]">
                  <div className="text-5xl mb-3">🎉</div>
                  <p className="font-medium">Sin tareas en Backlog</p>
                  <p className="text-xs mt-1 opacity-60">Todo está al día</p>
                </div>
              ) : (
                <>
                  {projects.map(proj => {
                    const projTasks = allBacklogTasks.filter(t => t.projectId === proj.id);
                    // Mostrar todos los proyectos como drop zone aunque estén vacíos
                    return (
                      <div key={proj.id} className="mb-8">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: proj.color }} />
                          <h3 className="text-sm font-semibold text-gray-200">{proj.name}</h3>
                          <span className="text-xs text-[#9B8BA3] bg-[#2D1B3D] px-1.5 py-0.5 rounded-full">{projTasks.length}</span>
                          <button onClick={() => selectProject(proj)} className="ml-auto text-[10px] text-[#6B5B73] hover:text-[#C9A8D8] transition-colors">
                            Ver tablero →
                          </button>
                        </div>
                        <HomeDropZone projectId={proj.id}>
                          {projTasks.sort((a, b) => a.order - b.order).map(task => (
                            <HomeDraggableCard
                              key={task.id}
                              task={task}
                              project={proj}
                              onClick={() => { selectProject(proj); setTimeout(() => openEditTask(task), 100); }}
                            />
                          ))}
                          {projTasks.length === 0 && (
                            <div className="col-span-full flex items-center justify-center h-16 border border-dashed border-[#2D1B3D] rounded-xl text-[#4D3568] text-xs">
                              Soltá aquí para mover a este proyecto
                            </div>
                          )}
                        </HomeDropZone>
                      </div>
                    );
                  })}
                </>
              )}
            </div>

            <DragOverlay>
              {homeDraggingTask && (
                <div className="bg-[#2D1B3D] border border-[#6366f1] rounded-xl p-3 shadow-2xl shadow-purple-900/50 rotate-1 opacity-95 w-56">
                  <p className="text-sm font-semibold text-gray-100">{homeDraggingTask.title}</p>
                </div>
              )}
            </DragOverlay>
          </DndContext>
        ) : null}

        {/* BOARD */}
        {!homeMode && currentProject ? (
          <>
          <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex-1 flex gap-3 p-4 overflow-x-auto overflow-y-hidden">
              {currentProject.columns.map(col => {
                const colTasks = tasks.filter(t => t.column === col).sort((a, b) => a.order - b.order);
                const color = getColColor(col);
                return (
                  <div key={col} className="flex-shrink-0 w-64 flex flex-col bg-[#1E1230] rounded-xl border border-[#2D1B3D] max-h-full">
                    <div className="flex items-center justify-between px-3 py-2.5 border-b border-[#2D1B3D] flex-shrink-0" style={{ borderLeft: `3px solid ${color}`, borderRadius: "0.75rem 0.75rem 0 0" }}>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-300">{col}</span>
                        <span className="text-xs text-[#9B8BA3] bg-[#2D1B3D] px-1.5 py-0.5 rounded-full">{colTasks.length}</span>
                      </div>
                      <button onClick={() => openNewTask(col)} className="w-6 h-6 flex items-center justify-center rounded-md text-[#9B8BA3] hover:bg-[#2D1B3D] hover:text-white transition-colors text-base leading-none">+</button>
                    </div>
                    <SortableContext items={colTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                      <DroppableColumn id={`col:${col}`}>
                        {colTasks.map(task => (
                          <SortableCard key={task.id} task={task} onClick={() => openEditTask(task)} />
                        ))}
                      </DroppableColumn>
                    </SortableContext>
                  </div>
                );
              })}
            </div>
            <DragOverlay>
              {activeTask && (
                <div className="bg-[#2D1B3D] border border-[#6366f1] rounded-xl p-3 shadow-2xl shadow-purple-900/50 rotate-2 opacity-90">
                  <p className="text-sm font-semibold text-gray-100">{activeTask.title}</p>
                </div>
              )}
            </DragOverlay>
          </DndContext>
          {/* SECCIÓN ELIMINADOS */}
          {currentProject && (
            <div className="flex-shrink-0 border-t border-[#2D1B3D] mx-4 mb-4">
              <button
                onClick={() => setShowDeleted(v => !v)}
                className="flex items-center gap-2 w-full py-3 text-xs text-[#6B5B73] hover:text-[#9B8BA3] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`w-3.5 h-3.5 transition-transform ${showDeleted ? "rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span>Eliminados</span>
                <span className="bg-[#2D1B3D] px-1.5 py-0.5 rounded-full">{deletedTasks.length}</span>
                {deletedTasks.length > 0 && <span className="text-[10px] opacity-60 ml-1">· se borran a los 30 días</span>}
              </button>
              {showDeleted && (
                deletedTasks.length === 0 ? (
                  <p className="text-xs text-[#4D3568] pb-4 pl-5">No hay tareas eliminadas</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 pb-4">
                    {deletedTasks.map(task => {
                      const daysLeft = task.deletedAt
                        ? Math.max(0, 30 - Math.floor((Date.now() - new Date(task.deletedAt).getTime()) / 86400000))
                        : 30;
                      return (
                        <div key={task.id} className="bg-[#1E1230] border border-[#2D1B3D] rounded-xl p-3 opacity-60">
                          <p className="text-xs font-medium text-gray-300 line-clamp-2 mb-1">{task.title}</p>
                          <p className="text-[10px] text-[#6B5B73]">Se borra en {daysLeft}d</p>
                        </div>
                      );
                    })}
                  </div>
                )
              )}
            </div>
          )}
          </>
        ) : !homeMode ? (
          <div className="flex-1 flex items-center justify-center text-[#9B8BA3] flex-col gap-3">
            <div className="text-5xl">🎯</div>
            <p className="font-medium">Selecciona un proyecto</p>
          </div>
        ) : null}
      </div>

      {/* ===== MODAL: TAREA ===== */}
      {taskModal.open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4" onClick={e => { if (e.target === e.currentTarget) setTaskModal({ open: false, task: null, isNew: true }); }}>
          <div className="bg-[#1E1230] border-t sm:border border-[#3D2548] rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[92vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#3D2548] flex-shrink-0">
              <h2 className="font-bold text-base">{taskModal.isNew ? "Nueva tarea" : "Editar tarea"}</h2>
              <button onClick={() => setTaskModal({ open: false, task: null, isNew: true })} className="w-7 h-7 rounded-lg bg-[#2D1B3D] hover:bg-red-900/40 text-[#9B8BA3] hover:text-red-400 flex items-center justify-center text-sm transition-colors">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-[#9B8BA3] uppercase tracking-wider mb-1.5">Título *</label>
                  <input value={taskForm.title} onChange={e => setTaskForm(f => ({ ...f, title: e.target.value }))} placeholder="Nombre de la tarea" onKeyDown={e => e.key === "Enter" && e.ctrlKey && saveTask()} className="w-full px-3 py-2 bg-[#2D1B3D] border border-[#3D2548] rounded-lg text-sm focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]/30 text-gray-100 placeholder-[#5D4568]" />
                </div>
                <div className="sm:w-40">
                  <label className="block text-xs font-semibold text-[#9B8BA3] uppercase tracking-wider mb-1.5">Columna</label>
                  <select value={taskForm.column} onChange={e => setTaskForm(f => ({ ...f, column: e.target.value }))} className="w-full px-3 py-2 bg-[#2D1B3D] border border-[#3D2548] rounded-lg text-sm focus:outline-none focus:border-[#6366f1] text-gray-100">
                    {currentProject?.columns.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#9B8BA3] uppercase tracking-wider mb-1.5">Descripción</label>
                <textarea value={taskForm.description} onChange={e => setTaskForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Descripción detallada..." className="w-full px-3 py-2 bg-[#2D1B3D] border border-[#3D2548] rounded-lg text-sm focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]/30 text-gray-100 placeholder-[#5D4568] resize-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#9B8BA3] uppercase tracking-wider mb-1.5">Fecha límite</label>
                <input type="datetime-local" value={taskForm.dueDate} onChange={e => setTaskForm(f => ({ ...f, dueDate: e.target.value }))} className="px-3 py-2 bg-[#2D1B3D] border border-[#3D2548] rounded-lg text-sm focus:outline-none focus:border-[#6366f1] text-gray-100 [color-scheme:dark]" />
              </div>

              {/* FOTOS */}
              <div>
                <label className="block text-xs font-semibold text-[#9B8BA3] uppercase tracking-wider mb-1.5">Fotos adjuntas</label>
                <div className="flex flex-wrap gap-2">
                  {currentTaskPhotos.map((p, idx) => (
                    <div key={p.id || idx} className="relative group">
                      <img src={p.dataUrl} alt="" onClick={() => setLightbox({ open: true, photos: currentTaskPhotos, idx })} className="w-16 h-16 rounded-xl object-cover border border-[#3D2548] cursor-pointer hover:opacity-80 transition-opacity" />
                      <button onClick={() => removePhoto(p.id)} className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-600 hover:bg-red-500 rounded-full text-white text-[9px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                    </div>
                  ))}
                  <label className="w-16 h-16 border-2 border-dashed border-[#3D2548] hover:border-[#6366f1] rounded-xl flex flex-col items-center justify-center cursor-pointer text-[#9B8BA3] hover:text-[#C9A8D8] transition-colors text-xs text-center">
                    <span className="text-lg leading-none">+</span>
                    <span>Foto</span>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={e => handlePhotoSelect(e.target.files)} />
                  </label>
                </div>
              </div>

              {/* CALENDAR */}
              <div className="border border-[#3D2548] rounded-xl p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">📅 Google Calendar</h3>
                  <button onClick={() => { const t = taskModal.task as Task; setCalForm({ title: taskForm.title, description: taskForm.description, start: taskForm.dueDate, end: "", reminders: taskForm.calReminders }); setCalModal({ open: true, taskId: t?.id }); }} className="text-xs px-2.5 py-1 rounded-lg border border-[#3D2548] hover:border-[#6366f1] text-[#9B8BA3] hover:text-[#C9A8D8] transition-colors">
                    Crear evento
                  </button>
                </div>
                {(taskModal.task as Task)?.calendarEventId && <p className="text-xs text-green-400">✅ Evento vinculado</p>}
                <div>
                  <p className="text-xs text-[#9B8BA3] mb-2">Avisos antes del evento</p>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: "2h", minutes: 120 },
                      { label: "5h", minutes: 300 },
                      { label: "12h", minutes: 720 },
                      { label: "1 día", minutes: 1440 },
                      { label: "2 días", minutes: 2880 },
                      { label: "5 días", minutes: 7200 },
                    ].map(({ label, minutes }) => {
                      const active = taskForm.calReminders.includes(minutes);
                      return (
                        <button
                          key={minutes}
                          type="button"
                          onClick={() => setTaskForm(f => ({
                            ...f,
                            calReminders: active
                              ? f.calReminders.filter(m => m !== minutes)
                              : [...f.calReminders, minutes],
                          }))}
                          className={`px-2.5 py-1 text-xs rounded-lg border transition-colors ${
                            active
                              ? "bg-[#6366f1] border-[#6366f1] text-white"
                              : "border-[#3D2548] text-[#9B8BA3] hover:border-[#6366f1] hover:text-[#C9A8D8]"
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* EMAIL */}
              <div className="border border-[#3D2548] rounded-xl p-3">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold">📧 Notificación por email</h3>
                  <button onClick={() => setTaskForm(f => ({ ...f, emailEnabled: !f.emailEnabled }))} className={`w-9 h-5 rounded-full transition-colors relative ${taskForm.emailEnabled ? "bg-[#6366f1]" : "bg-[#3D2548]"}`}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${taskForm.emailEnabled ? "translate-x-4" : "translate-x-0.5"}`} />
                  </button>
                </div>
                {taskForm.emailEnabled && (
                  <div className="space-y-2.5">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="flex-1">
                        <label className="block text-xs text-[#9B8BA3] mb-1">Destinatario</label>
                        <input type="email" value={taskForm.emailTo} onChange={e => setTaskForm(f => ({ ...f, emailTo: e.target.value }))} placeholder="correo@ejemplo.com" className="w-full px-3 py-1.5 bg-[#2D1B3D] border border-[#3D2548] rounded-lg text-sm focus:outline-none focus:border-[#6366f1] text-gray-100 placeholder-[#5D4568]" />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-[#9B8BA3] mb-1">Programar envío</label>
                        <input type="datetime-local" value={taskForm.emailSchedule} onChange={e => setTaskForm(f => ({ ...f, emailSchedule: e.target.value }))} className="w-full px-3 py-1.5 bg-[#2D1B3D] border border-[#3D2548] rounded-lg text-sm focus:outline-none focus:border-[#6366f1] text-gray-100 [color-scheme:dark]" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-[#9B8BA3] mb-1">Mensaje</label>
                      <textarea value={taskForm.emailMsg} onChange={e => setTaskForm(f => ({ ...f, emailMsg: e.target.value }))} rows={2} placeholder="Mensaje del recordatorio..." className="w-full px-3 py-1.5 bg-[#2D1B3D] border border-[#3D2548] rounded-lg text-sm focus:outline-none focus:border-[#6366f1] text-gray-100 placeholder-[#5D4568] resize-none" />
                    </div>
                    <button onClick={sendEmailNow} className="text-xs px-3 py-1.5 rounded-lg border border-[#3D2548] hover:border-[#6366f1] text-[#9B8BA3] hover:text-[#C9A8D8] transition-colors">
                      Enviar ahora
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between px-5 py-4 border-t border-[#3D2548] flex-shrink-0">
              {!taskModal.isNew ? (
                <button onClick={deleteTask} className="px-4 py-2 text-xs font-medium rounded-lg bg-red-900/30 hover:bg-red-900/50 border border-red-800/40 text-red-400 transition-colors">Eliminar</button>
              ) : <div />}
              <div className="flex gap-2">
                <button onClick={() => setTaskModal({ open: false, task: null, isNew: true })} className="px-4 py-2 text-xs font-medium rounded-lg border border-[#3D2548] text-[#9B8BA3] hover:text-gray-200 hover:border-[#5D4568] transition-colors">Cancelar</button>
                <button onClick={saveTask} className="px-4 py-2 text-xs font-medium rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white transition-colors">Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL: CALENDAR ===== */}
      {calModal.open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4" onClick={e => { if (e.target === e.currentTarget) setCalModal({ open: false }); }}>
          <div className="bg-[#1E1230] border-t sm:border border-[#3D2548] rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#3D2548]">
              <h2 className="font-bold text-base">📅 Crear evento en Google Calendar</h2>
              <button onClick={() => setCalModal({ open: false })} className="w-7 h-7 rounded-lg bg-[#2D1B3D] hover:bg-red-900/40 text-[#9B8BA3] hover:text-red-400 flex items-center justify-center text-sm transition-colors">✕</button>
            </div>
            <div className="p-5 space-y-3">
              {!calConnected && <div className="p-3 rounded-lg bg-amber-900/20 border border-amber-800/40 text-amber-400 text-xs">⚠️ Google Calendar no está conectado. Ve a Configuración.</div>}
              <div>
                <label className="block text-xs text-[#9B8BA3] mb-1">Título *</label>
                <input value={calForm.title} onChange={e => setCalForm(f => ({ ...f, title: e.target.value }))} placeholder="Título del evento" className="w-full px-3 py-2 bg-[#2D1B3D] border border-[#3D2548] rounded-lg text-sm focus:outline-none focus:border-[#6366f1] text-gray-100 placeholder-[#5D4568]" />
              </div>
              <div>
                <label className="block text-xs text-[#9B8BA3] mb-1">Descripción</label>
                <textarea value={calForm.description} onChange={e => setCalForm(f => ({ ...f, description: e.target.value }))} rows={2} className="w-full px-3 py-2 bg-[#2D1B3D] border border-[#3D2548] rounded-lg text-sm focus:outline-none focus:border-[#6366f1] text-gray-100 resize-none" />
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1">
                  <label className="block text-xs text-[#9B8BA3] mb-1">Inicio *</label>
                  <input type="datetime-local" value={calForm.start} onChange={e => setCalForm(f => ({ ...f, start: e.target.value }))} className="w-full px-3 py-2 bg-[#2D1B3D] border border-[#3D2548] rounded-lg text-sm focus:outline-none focus:border-[#6366f1] text-gray-100 [color-scheme:dark]" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-[#9B8BA3] mb-1">Fin</label>
                  <input type="datetime-local" value={calForm.end} onChange={e => setCalForm(f => ({ ...f, end: e.target.value }))} className="w-full px-3 py-2 bg-[#2D1B3D] border border-[#3D2548] rounded-lg text-sm focus:outline-none focus:border-[#6366f1] text-gray-100 [color-scheme:dark]" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-[#9B8BA3] mb-2">Avisos</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "2h", minutes: 120 },
                    { label: "5h", minutes: 300 },
                    { label: "12h", minutes: 720 },
                    { label: "1 día", minutes: 1440 },
                    { label: "2 días", minutes: 2880 },
                    { label: "5 días", minutes: 7200 },
                  ].map(({ label, minutes }) => {
                    const active = calForm.reminders.includes(minutes);
                    return (
                      <button
                        key={minutes}
                        type="button"
                        onClick={() => setCalForm(f => ({
                          ...f,
                          reminders: active
                            ? f.reminders.filter(m => m !== minutes)
                            : [...f.reminders, minutes],
                        }))}
                        className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                          active
                            ? "bg-[#6366f1] border-[#6366f1] text-white"
                            : "border-[#3D2548] text-[#9B8BA3] hover:border-[#6366f1] hover:text-[#C9A8D8]"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-5 pb-5">
              <button onClick={() => setCalModal({ open: false })} className="px-4 py-2 text-xs font-medium rounded-lg border border-[#3D2548] text-[#9B8BA3] hover:text-gray-200 transition-colors">Cancelar</button>
              <button onClick={createCalEvent} className="px-4 py-2 text-xs font-medium rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white transition-colors">Crear evento</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL: CONFIGURACIÓN ===== */}
      {settingsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4" onClick={e => { if (e.target === e.currentTarget) setSettingsModal(false); }}>
          <div className="bg-[#1E1230] border-t sm:border border-[#3D2548] rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[92vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#3D2548] flex-shrink-0">
              <h2 className="font-bold text-base">⚙️ Configuración</h2>
              <button onClick={() => setSettingsModal(false)} className="w-7 h-7 rounded-lg bg-[#2D1B3D] hover:bg-red-900/40 text-[#9B8BA3] hover:text-red-400 flex items-center justify-center text-sm transition-colors">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Mi info */}
              <section>
                <h3 className="text-sm font-bold mb-3 text-gray-200">👤 Mi información</h3>
                <div>
                  <label className="block text-xs text-[#9B8BA3] mb-1">Mi correo (remitente y destinatario por defecto)</label>
                  <input type="email" value={settingsForm.myEmail} onChange={e => setSettingsForm(f => ({ ...f, myEmail: e.target.value }))} placeholder="mi@correo.com" className="w-full px-3 py-2 bg-[#2D1B3D] border border-[#3D2548] rounded-lg text-sm focus:outline-none focus:border-[#6366f1] text-gray-100 placeholder-[#5D4568]" />
                </div>
              </section>
              {/* SMTP */}
              <section className="border-t border-[#2D1B3D] pt-5">
                <h3 className="text-sm font-bold mb-1 text-gray-200">📧 Configuración SMTP</h3>
                <p className="text-xs text-[#9B8BA3] mb-3">Para Gmail: host <code className="bg-[#2D1B3D] px-1 rounded text-purple-300">smtp.gmail.com</code>, puerto <code className="bg-[#2D1B3D] px-1 rounded text-purple-300">587</code>, SSL desactivado. Usa una Contraseña de App.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-[#9B8BA3] mb-1">Servidor SMTP</label>
                    <input value={settingsForm.smtpHost} onChange={e => setSettingsForm(f => ({ ...f, smtpHost: e.target.value }))} placeholder="smtp.gmail.com" className="w-full px-3 py-2 bg-[#2D1B3D] border border-[#3D2548] rounded-lg text-sm focus:outline-none focus:border-[#6366f1] text-gray-100 placeholder-[#5D4568]" />
                  </div>
                  <div>
                    <label className="block text-xs text-[#9B8BA3] mb-1">Puerto</label>
                    <input type="number" value={settingsForm.smtpPort} onChange={e => setSettingsForm(f => ({ ...f, smtpPort: Number(e.target.value) }))} className="w-full px-3 py-2 bg-[#2D1B3D] border border-[#3D2548] rounded-lg text-sm focus:outline-none focus:border-[#6366f1] text-gray-100" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                  <div>
                    <label className="block text-xs text-[#9B8BA3] mb-1">Usuario (email)</label>
                    <input value={settingsForm.smtpUser} onChange={e => setSettingsForm(f => ({ ...f, smtpUser: e.target.value }))} placeholder="usuario@gmail.com" className="w-full px-3 py-2 bg-[#2D1B3D] border border-[#3D2548] rounded-lg text-sm focus:outline-none focus:border-[#6366f1] text-gray-100 placeholder-[#5D4568]" />
                  </div>
                  <div>
                    <label className="block text-xs text-[#9B8BA3] mb-1">Contraseña / App Password</label>
                    <input type="password" value={settingsForm.smtpPass} onChange={e => setSettingsForm(f => ({ ...f, smtpPass: e.target.value }))} placeholder="••••••••••••" className="w-full px-3 py-2 bg-[#2D1B3D] border border-[#3D2548] rounded-lg text-sm focus:outline-none focus:border-[#6366f1] text-gray-100 placeholder-[#5D4568]" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs text-[#9B8BA3] cursor-pointer">
                    <input type="checkbox" checked={settingsForm.smtpSecure} onChange={e => setSettingsForm(f => ({ ...f, smtpSecure: e.target.checked }))} className="rounded" />
                    SSL/TLS
                  </label>
                  <button onClick={testSmtp} className="px-3 py-1.5 text-xs rounded-lg border border-[#3D2548] hover:border-[#6366f1] text-[#9B8BA3] hover:text-[#C9A8D8] transition-colors">Probar conexión</button>
                  {smtpTestResult && <span className="text-xs">{smtpTestResult}</span>}
                </div>
              </section>
              {/* Google Calendar */}
              <section className="border-t border-[#2D1B3D] pt-5">
                <h3 className="text-sm font-bold mb-1 text-gray-200">📅 Google Calendar</h3>
                <p className="text-xs text-[#9B8BA3] mb-3">
                  En Google Cloud Console, activa Calendar API y crea credenciales OAuth 2.0 con redirect URI:<br />
                  <code className="bg-[#2D1B3D] px-1 rounded text-purple-300 text-xs break-all">{typeof window !== "undefined" ? `${window.location.origin}/api/admin/planner/calendar/callback` : "/api/admin/planner/calendar/callback"}</code>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                  <div>
                    <label className="block text-xs text-[#9B8BA3] mb-1">Client ID</label>
                    <input value={settingsForm.gcClientId} onChange={e => setSettingsForm(f => ({ ...f, gcClientId: e.target.value }))} placeholder="xxxx.apps.googleusercontent.com" className="w-full px-3 py-2 bg-[#2D1B3D] border border-[#3D2548] rounded-lg text-sm focus:outline-none focus:border-[#6366f1] text-gray-100 placeholder-[#5D4568]" />
                  </div>
                  <div>
                    <label className="block text-xs text-[#9B8BA3] mb-1">Client Secret</label>
                    <input type="password" value={settingsForm.gcClientSecret} onChange={e => setSettingsForm(f => ({ ...f, gcClientSecret: e.target.value }))} placeholder="••••••••" className="w-full px-3 py-2 bg-[#2D1B3D] border border-[#3D2548] rounded-lg text-sm focus:outline-none focus:border-[#6366f1] text-gray-100 placeholder-[#5D4568]" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${calConnected ? "bg-green-900/30 text-green-400 border border-green-800/40" : "bg-red-900/20 text-red-400 border border-red-800/30"}`}>{calConnected ? "✅ Conectado" : "❌ No conectado"}</span>
                  <button onClick={connectGoogle} className="px-3 py-1.5 text-xs rounded-lg border border-[#3D2548] hover:border-[#6366f1] text-[#9B8BA3] hover:text-[#C9A8D8] transition-colors">Conectar con Google</button>
                </div>
              </section>
            </div>
            <div className="flex justify-end gap-2 px-5 py-4 border-t border-[#3D2548] flex-shrink-0">
              <button onClick={() => setSettingsModal(false)} className="px-4 py-2 text-xs font-medium rounded-lg border border-[#3D2548] text-[#9B8BA3] hover:text-gray-200 transition-colors">Cancelar</button>
              <button onClick={saveSettings} className="px-4 py-2 text-xs font-medium rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white transition-colors">Guardar configuración</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL: EDITAR PROYECTO ===== */}
      {editProjectModal && currentProject && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4" onClick={e => { if (e.target === e.currentTarget) setEditProjectModal(false); }}>
          <div className="bg-[#1E1230] border-t sm:border border-[#3D2548] rounded-t-2xl sm:rounded-2xl w-full sm:max-w-sm shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#3D2548]">
              <h2 className="font-bold text-base">Editar proyecto</h2>
              <button onClick={() => setEditProjectModal(false)} className="w-7 h-7 rounded-lg bg-[#2D1B3D] hover:bg-red-900/40 text-[#9B8BA3] hover:text-red-400 flex items-center justify-center text-sm transition-colors">✕</button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label className="block text-xs text-[#9B8BA3] mb-1">Nombre *</label>
                <input
                  value={editProjectForm.name}
                  onChange={e => setEditProjectForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Nombre del proyecto"
                  onKeyDown={e => e.key === "Enter" && updateProject()}
                  className="w-full px-3 py-2 bg-[#2D1B3D] border border-[#3D2548] rounded-lg text-sm focus:outline-none focus:border-[#6366f1] text-gray-100 placeholder-[#5D4568]"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs text-[#9B8BA3] mb-1">Color</label>
                <input
                  type="color"
                  value={editProjectForm.color}
                  onChange={e => setEditProjectForm(f => ({ ...f, color: e.target.value }))}
                  className="w-12 h-9 rounded-lg cursor-pointer border border-[#3D2548] bg-transparent p-1"
                />
              </div>
            </div>
            <div className="flex items-center justify-between px-5 pb-5">
              <button onClick={deleteProject} className="px-4 py-2 text-xs font-medium rounded-lg bg-red-900/30 hover:bg-red-900/50 border border-red-800/40 text-red-400 transition-colors">
                Eliminar proyecto
              </button>
              <div className="flex gap-2">
                <button onClick={() => setEditProjectModal(false)} className="px-4 py-2 text-xs font-medium rounded-lg border border-[#3D2548] text-[#9B8BA3] hover:text-gray-200 transition-colors">Cancelar</button>
                <button onClick={updateProject} className="px-4 py-2 text-xs font-medium rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white transition-colors">Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL: NUEVO PROYECTO ===== */}
      {newProjectModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4" onClick={e => { if (e.target === e.currentTarget) setNewProjectModal(false); }}>
          <div className="bg-[#1E1230] border-t sm:border border-[#3D2548] rounded-t-2xl sm:rounded-2xl w-full sm:max-w-sm shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#3D2548]">
              <h2 className="font-bold text-base">Nuevo proyecto</h2>
              <button onClick={() => setNewProjectModal(false)} className="w-7 h-7 rounded-lg bg-[#2D1B3D] hover:bg-red-900/40 text-[#9B8BA3] hover:text-red-400 flex items-center justify-center text-sm transition-colors">✕</button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label className="block text-xs text-[#9B8BA3] mb-1">Nombre *</label>
                <input value={newProjectForm.name} onChange={e => setNewProjectForm(f => ({ ...f, name: e.target.value }))} placeholder="Mi proyecto" onKeyDown={e => e.key === "Enter" && createProject()} className="w-full px-3 py-2 bg-[#2D1B3D] border border-[#3D2548] rounded-lg text-sm focus:outline-none focus:border-[#6366f1] text-gray-100 placeholder-[#5D4568]" />
              </div>
              <div>
                <label className="block text-xs text-[#9B8BA3] mb-1">Color</label>
                <input type="color" value={newProjectForm.color} onChange={e => setNewProjectForm(f => ({ ...f, color: e.target.value }))} className="w-12 h-9 rounded-lg cursor-pointer border border-[#3D2548] bg-transparent p-1" />
              </div>
            </div>
            <div className="flex justify-end gap-2 px-5 pb-5">
              <button onClick={() => setNewProjectModal(false)} className="px-4 py-2 text-xs font-medium rounded-lg border border-[#3D2548] text-[#9B8BA3] hover:text-gray-200 transition-colors">Cancelar</button>
              <button onClick={createProject} className="px-4 py-2 text-xs font-medium rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white transition-colors">Crear</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== LIGHTBOX ===== */}
      {lightbox.open && (
        <div className="fixed inset-0 bg-black/92 z-[60] flex items-center justify-center" onClick={() => setLightbox(l => ({ ...l, open: false }))}>
          <button onClick={e => { e.stopPropagation(); setLightbox(l => ({ ...l, idx: (l.idx - 1 + l.photos.length) % l.photos.length })); }} className="fixed left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 text-white text-2xl flex items-center justify-center z-10">‹</button>
          <img src={lightbox.photos[lightbox.idx]?.dataUrl} alt="" className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl" onClick={e => e.stopPropagation()} />
          <button onClick={e => { e.stopPropagation(); setLightbox(l => ({ ...l, idx: (l.idx + 1) % l.photos.length })); }} className="fixed right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 text-white text-2xl flex items-center justify-center z-10">›</button>
          <p className="fixed bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm">{lightbox.idx + 1} / {lightbox.photos.length}</p>
          <button onClick={() => setLightbox(l => ({ ...l, open: false }))} className="fixed top-4 right-4 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center">✕</button>
        </div>
      )}

      {/* ===== TOASTS ===== */}
      <div className="fixed bottom-5 right-5 flex flex-col gap-2 z-[70]">
        {toasts.map(t => (
          <div key={t.id} className={`px-4 py-3 rounded-xl text-sm font-medium shadow-2xl animate-in slide-in-from-right-5 ${t.type === "success" ? "bg-green-900 text-green-100 border border-green-700" : t.type === "error" ? "bg-red-900 text-red-100 border border-red-700" : "bg-[#2D1B3D] text-gray-100 border border-[#3D2548]"}`}>
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  );
}

import mongoose, { Schema, Document } from "mongoose";

// ===== TYPES =====
export interface PlannerPhoto {
  id: string;
  dataUrl: string;
  name: string;
}

export interface EmailNotification {
  recipient: string;
  message: string;
  scheduledAt: string | null;
  sent: boolean;
  sentAt: string | null;
}

export interface IPlannerProject extends Document {
  id: string;
  name: string;
  color: string;
  columns: string[];
}

export interface IPlannerTask extends Document {
  id: string;
  projectId: string;
  title: string;
  description: string;
  column: string;
  color: string | null;
  photos: PlannerPhoto[];
  dueDate: string | null;
  emailNotification: EmailNotification | null;
  calendarEventId: string | null;
  order: number;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IPlannerSettings extends Document {
  adminPassword: string;
  myEmail: string;
  smtp: {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
  };
  googleCalendar: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    refreshToken: string;
    accessToken: string;
    tokenExpiry: number | null;
  };
}

// ===== SCHEMAS =====
const PlannerProjectSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  color: { type: String, default: "#6366f1" },
  columns: { type: [String], default: ["Backlog", "En Proceso", "Revisar", "Terminado"] },
});

const PlannerTaskSchema = new Schema({
  id: { type: String, required: true, unique: true },
  projectId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  column: { type: String, default: "Backlog" },
  photos: [{
    id: String,
    dataUrl: String,
    name: String,
  }],
  dueDate: { type: String, default: null },
  emailNotification: {
    type: {
      recipient: String,
      message: String,
      scheduledAt: { type: String, default: null },
      sent: { type: Boolean, default: false },
      sentAt: { type: String, default: null },
    },
    default: null,
  },
  color: { type: String, default: null },
  deletedAt: { type: String, default: null },
  calendarEventId: { type: String, default: null },
  order: { type: Number, default: 0 },
  createdAt: { type: String, default: () => new Date().toISOString() },
  updatedAt: { type: String, default: () => new Date().toISOString() },
});

const PlannerSettingsSchema = new Schema({
  adminPassword: { type: String, default: "" }, // SHA-256 hash; vacío = usar env var ADMIN_PASSWORD
  myEmail: { type: String, default: "" },
  smtp: {
    host: { type: String, default: "" },
    port: { type: Number, default: 587 },
    secure: { type: Boolean, default: false },
    user: { type: String, default: "" },
    pass: { type: String, default: "" },
  },
  googleCalendar: {
    clientId: { type: String, default: "" },
    clientSecret: { type: String, default: "" },
    redirectUri: { type: String, default: "" },
    refreshToken: { type: String, default: "" },
    accessToken: { type: String, default: "" },
    tokenExpiry: { type: Number, default: null },
  },
});

// ===== MODELS =====
export const PlannerProject =
  mongoose.models.PlannerProject ||
  mongoose.model<IPlannerProject>("PlannerProject", PlannerProjectSchema);

export const PlannerTask =
  mongoose.models.PlannerTask ||
  mongoose.model<IPlannerTask>("PlannerTask", PlannerTaskSchema);

export const PlannerSettings =
  mongoose.models.PlannerSettings ||
  mongoose.model<IPlannerSettings>("PlannerSettings", PlannerSettingsSchema);

// Helper to get or create singleton settings
export async function getOrCreateSettings(): Promise<IPlannerSettings> {
  let settings = await PlannerSettings.findOne();
  if (!settings) {
    settings = await PlannerSettings.create({});
  }
  return settings;
}

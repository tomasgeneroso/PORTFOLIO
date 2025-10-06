import mongoose from "mongoose";

const AnalyticsSchema = new mongoose.Schema({
  event: {
    type: String,
    required: true,
    index: true,
  },
  timestamp: {
    type: Number,
    required: true,
    index: true,
  },
  sessionId: {
    type: String,
    required: true,
    index: true,
  },
  userAgent: String,
  referrer: String,
  ip: String,
  location: {
    country: String,
    countryCode: String,
    region: String,
    city: String,
    latitude: Number,
    longitude: Number,
    timezone: String,
  },
  data: mongoose.Schema.Types.Mixed,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 7776000, // 90 días (opcional: auto-eliminar datos antiguos)
  },
});

// Índices compuestos para consultas comunes
AnalyticsSchema.index({ event: 1, timestamp: -1 });
AnalyticsSchema.index({ sessionId: 1, timestamp: -1 });

export default mongoose.models.Analytics ||
  mongoose.model("Analytics", AnalyticsSchema);

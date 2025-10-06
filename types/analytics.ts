export interface AnalyticsEvent {
  event: string;
  timestamp: number;
  sessionId: string;
  userAgent?: string;
  referrer?: string;
  isFirstVisit?: boolean;
  data?: any;
}

export interface AnalyticsConfig {
  syncInterval: number; // milliseconds
  maxRetries: number;
  batchSize: number;
}

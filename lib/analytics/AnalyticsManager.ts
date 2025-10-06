import { AnalyticsEvent, AnalyticsConfig } from "@/types/analytics";

class AnalyticsManager {
  private static instance: AnalyticsManager;
  private isMongoConnected: boolean = false;
  private sessionId: string;
  private config: AnalyticsConfig;
  private syncTimer: NodeJS.Timeout | null = null;
  private pendingEvents: AnalyticsEvent[] = [];

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.config = {
      syncInterval: 30000, // 30 segundos
      maxRetries: 3,
      batchSize: 10,
    };
    this.initializeConnection();
    this.startAutoSync();
  }

  public static getInstance(): AnalyticsManager {
    if (!AnalyticsManager.instance) {
      AnalyticsManager.instance = new AnalyticsManager();
    }
    return AnalyticsManager.instance;
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private async initializeConnection(): Promise<void> {
    if (typeof window === "undefined") return;

    // Verificar estado de MongoDB
    try {
      const response = await fetch("/api/analytics/health", {
        method: "GET",
      });
      this.isMongoConnected = response.ok;
      
      // Si MongoDB está disponible, sincronizar eventos pendientes
      if (this.isMongoConnected) {
        await this.syncPendingEvents();
      }
    } catch (error) {
      this.isMongoConnected = false;
      console.warn("MongoDB no disponible, usando localStorage");
    }

    // Monitorear cambios de conexión
    window.addEventListener("online", () => this.handleReconnection());
  }

  private async handleReconnection(): Promise<void> {
    await this.initializeConnection();
  }

  private startAutoSync(): void {
    if (this.syncTimer) return;

    this.syncTimer = setInterval(async () => {
      if (this.isMongoConnected) {
        await this.syncPendingEvents();
      }
    }, this.config.syncInterval);
  }

  private stopAutoSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
  }

  private async syncPendingEvents(): Promise<void> {
    const stored = this.getStoredEvents();
    if (stored.length === 0) return;

    try {
      // Enviar en lotes
      for (let i = 0; i < stored.length; i += this.config.batchSize) {
        const batch = stored.slice(i, i + this.config.batchSize);
        await this.sendBatchToMongo(batch);
        
        // Eliminar eventos sincronizados del localStorage
        this.removeStoredEvents(batch);
      }
    } catch (error) {
      console.error("Error sincronizando eventos:", error);
    }
  }

  private async sendBatchToMongo(events: AnalyticsEvent[]): Promise<void> {
    const response = await fetch("/api/analytics/batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ events }),
    });

    if (!response.ok) {
      throw new Error("Error enviando lote de eventos");
    }
  }

  private getStoredEvents(): AnalyticsEvent[] {
    if (typeof window === "undefined") return [];
    
    const stored = localStorage.getItem("analytics_pending");
    return stored ? JSON.parse(stored) : [];
  }

  private removeStoredEvents(events: AnalyticsEvent[]): void {
    const stored = this.getStoredEvents();
    const eventIds = new Set(events.map(e => `${e.event}-${e.timestamp}`));
    
    const remaining = stored.filter(
      e => !eventIds.has(`${e.event}-${e.timestamp}`)
    );
    
    localStorage.setItem("analytics_pending", JSON.stringify(remaining));
  }

  private saveToLocal(event: AnalyticsEvent): void {
    if (typeof window === "undefined") return;

    const stored = this.getStoredEvents();
    stored.push(event);
    localStorage.setItem("analytics_pending", JSON.stringify(stored));
  }

  public async trackEvent(
    eventName: string,
    data?: any
  ): Promise<void> {
    const event: AnalyticsEvent = {
      event: eventName,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      data,
    };

    if (this.isMongoConnected) {
      try {
        await fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(event),
        });
      } catch (error) {
        // Si falla, guardar en localStorage
        this.saveToLocal(event);
        this.isMongoConnected = false;
      }
    } else {
      this.saveToLocal(event);
    }
  }

  public getConnectionStatus(): boolean {
    return this.isMongoConnected;
  }

  public async forceSync(): Promise<void> {
    await this.syncPendingEvents();
  }

  public destroy(): void {
    this.stopAutoSync();
  }
}

export default AnalyticsManager;
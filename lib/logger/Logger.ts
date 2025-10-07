/**
 * Sistema de Logging centralizado para el portfolio
 * Captura eventos, errores y métricas importantes
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  userAgent?: string;
  url?: string;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private maxLogs = 100;
  private endpoint = '/api/logs';

  private constructor() {
    if (typeof window !== 'undefined') {
      this.setupErrorHandlers();
    }
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Configura manejadores globales de errores
   */
  private setupErrorHandlers() {
    // Capturar errores no manejados
    window.addEventListener('error', (event) => {
      this.error('Unhandled Error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.stack,
      });
    });

    // Capturar promesas rechazadas
    window.addEventListener('unhandledrejection', (event) => {
      this.error('Unhandled Promise Rejection', {
        reason: event.reason,
        promise: event.promise,
      });
    });
  }

  /**
   * Log de información general
   */
  info(message: string, data?: any) {
    this.log('info', message, data);
  }

  /**
   * Log de advertencias
   */
  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  /**
   * Log de errores
   */
  error(message: string, data?: any) {
    this.log('error', message, data);

    // Enviar errores críticos inmediatamente
    if (typeof window !== 'undefined') {
      this.sendLogsToServer([this.logs[this.logs.length - 1]]);
    }
  }

  /**
   * Log de depuración (solo en desarrollo)
   */
  debug(message: string, data?: any) {
    if (process.env.NODE_ENV === 'development') {
      this.log('debug', message, data);
    }
  }

  /**
   * Método privado para crear logs
   */
  private log(level: LogLevel, message: string, data?: any) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    };

    this.logs.push(entry);

    // Mantener solo los últimos N logs en memoria
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Log en consola en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console[level === 'debug' ? 'log' : level](`[${level.toUpperCase()}] ${message}`, data);
    }
  }

  /**
   * Enviar logs al servidor
   */
  private async sendLogsToServer(logs: LogEntry[]) {
    try {
      await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ logs }),
      });
    } catch (error) {
      console.error('Failed to send logs to server:', error);
    }
  }

  /**
   * Obtener todos los logs almacenados
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Limpiar logs
   */
  clearLogs() {
    this.logs = [];
  }

  /**
   * Sincronizar logs pendientes con el servidor
   */
  async sync() {
    if (this.logs.length > 0) {
      await this.sendLogsToServer(this.logs);
      this.clearLogs();
    }
  }
}

export default Logger;

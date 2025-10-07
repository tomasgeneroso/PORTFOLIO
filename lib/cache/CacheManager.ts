/**
 * Sistema de caché para reducir llamadas API y mejorar rendimiento
 * Soporta caché en memoria y localStorage
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live en milisegundos
}

class CacheManager {
  private static instance: CacheManager;
  private memoryCache: Map<string, CacheEntry<any>>;
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos

  private constructor() {
    this.memoryCache = new Map();
    this.startCleanupInterval();
  }

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  /**
   * Limpieza periódica de caché expirada
   */
  private startCleanupInterval() {
    setInterval(() => {
      this.cleanup();
    }, 60 * 1000); // Cada minuto
  }

  /**
   * Limpiar entradas expiradas
   */
  private cleanup() {
    const now = Date.now();

    // Limpiar memoria
    for (const [key, entry] of this.memoryCache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.memoryCache.delete(key);
      }
    }

    // Limpiar localStorage
    if (typeof window !== 'undefined') {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('cache_')) {
          try {
            const stored = localStorage.getItem(key);
            if (stored) {
              const entry: CacheEntry<any> = JSON.parse(stored);
              if (now - entry.timestamp > entry.ttl) {
                localStorage.removeItem(key);
              }
            }
          } catch (error) {
            // Remover entradas corruptas
            if (key) localStorage.removeItem(key);
          }
        }
      }
    }
  }

  /**
   * Guardar en caché (memoria y localStorage)
   */
  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL, persistent: boolean = false): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
    };

    // Guardar en memoria
    this.memoryCache.set(key, entry);

    // Guardar en localStorage si es persistente
    if (persistent && typeof window !== 'undefined') {
      try {
        localStorage.setItem(`cache_${key}`, JSON.stringify(entry));
      } catch (error) {
        console.warn('Failed to save to localStorage:', error);
      }
    }
  }

  /**
   * Obtener de caché
   */
  get<T>(key: string): T | null {
    const now = Date.now();

    // Intentar obtener de memoria primero
    const memEntry = this.memoryCache.get(key);
    if (memEntry && now - memEntry.timestamp <= memEntry.ttl) {
      return memEntry.data as T;
    }

    // Intentar obtener de localStorage
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`cache_${key}`);
        if (stored) {
          const entry: CacheEntry<T> = JSON.parse(stored);
          if (now - entry.timestamp <= entry.ttl) {
            // Restaurar a memoria
            this.memoryCache.set(key, entry);
            return entry.data;
          } else {
            // Expirado, remover
            localStorage.removeItem(`cache_${key}`);
          }
        }
      } catch (error) {
        console.warn('Failed to read from localStorage:', error);
      }
    }

    return null;
  }

  /**
   * Verificar si existe en caché y no ha expirado
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Eliminar entrada específica
   */
  delete(key: string): void {
    this.memoryCache.delete(key);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`cache_${key}`);
    }
  }

  /**
   * Limpiar toda la caché
   */
  clear(): void {
    this.memoryCache.clear();
    if (typeof window !== 'undefined') {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key?.startsWith('cache_')) {
          localStorage.removeItem(key);
        }
      }
    }
  }

  /**
   * Wrapper para fetch con caché automático
   */
  async fetchWithCache<T>(
    url: string,
    options?: RequestInit,
    cacheOptions?: {
      ttl?: number;
      persistent?: boolean;
      forceRefresh?: boolean;
    }
  ): Promise<T> {
    const cacheKey = `fetch_${url}_${JSON.stringify(options || {})}`;

    // Si no forzamos refresh, intentar obtener de caché
    if (!cacheOptions?.forceRefresh) {
      const cached = this.get<T>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    // Hacer fetch
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Guardar en caché
    this.set(
      cacheKey,
      data,
      cacheOptions?.ttl || this.DEFAULT_TTL,
      cacheOptions?.persistent || false
    );

    return data;
  }

  /**
   * Obtener estadísticas de caché
   */
  getStats() {
    return {
      memoryEntries: this.memoryCache.size,
      localStorageEntries: typeof window !== 'undefined'
        ? Object.keys(localStorage).filter(key => key.startsWith('cache_')).length
        : 0,
    };
  }
}

export default CacheManager;

interface GeolocationData {
  country: string;
  countryCode: string;
  region: string;
  city: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

// Cache para evitar llamadas repetidas a la API para la misma IP
const geoCache = new Map<string, GeolocationData>();

export async function getLocationFromIP(
  ip: string
): Promise<GeolocationData | null> {
  // No procesar IPs locales o desconocidas
  if (
    !ip ||
    ip === "unknown" ||
    ip === "::1" ||
    ip === "127.0.0.1" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.") ||
    ip.startsWith("172.")
  ) {
    return null;
  }

  // Verificar cache
  if (geoCache.has(ip)) {
    return geoCache.get(ip)!;
  }

  try {
    // Usar ip-api.com (gratuito, sin API key necesaria)
    // Límite: 45 requests por minuto
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,region,city,lat,lon,timezone`, {
      next: { revalidate: 86400 }, // Cache por 24 horas
    });

    if (!response.ok) {
      console.error(`Error fetching geolocation for IP ${ip}`);
      return null;
    }

    const data = await response.json();

    if (data.status === "success") {
      const locationData: GeolocationData = {
        country: data.country || "Unknown",
        countryCode: data.countryCode || "XX",
        region: data.region || "Unknown",
        city: data.city || "Unknown",
        latitude: data.lat || 0,
        longitude: data.lon || 0,
        timezone: data.timezone || "UTC",
      };

      // Guardar en cache
      geoCache.set(ip, locationData);

      return locationData;
    }

    return null;
  } catch (error) {
    console.error("Error obteniendo geolocalización:", error);
    return null;
  }
}

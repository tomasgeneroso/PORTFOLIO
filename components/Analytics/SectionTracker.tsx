"use client";

import { useEffect, useRef } from 'react';
import AnalyticsManager from '@/lib/analytics/AnalyticsManager';

interface SectionTrackerProps {
  sectionId: string;
  sectionName: string;
  children: React.ReactNode;
  threshold?: number; // Tiempo mínimo en segundos para considerar "visitado"
}

/**
 * Componente para rastrear tiempo de visualización de secciones
 * Detecta cuando una sección es visible y por cuánto tiempo
 */
export function SectionTracker({
  sectionId,
  sectionName,
  children,
  threshold = 7
}: SectionTrackerProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const startTimeRef = useRef<number | null>(null);
  const analytics = AnalyticsManager.getInstance();
  const hasTrackedSignificantTime = useRef(false);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Sección visible - iniciar contador
            startTimeRef.current = Date.now();

            analytics.trackEvent('section_view', {
              sectionId,
              sectionName,
            });
          } else {
            // Sección ya no visible - calcular tiempo
            if (startTimeRef.current) {
              const timeSpent = (Date.now() - startTimeRef.current) / 1000; // segundos

              analytics.trackEvent('section_exit', {
                sectionId,
                sectionName,
                timeSpent,
              });

              // Trackear secciones con +7 segundos
              if (timeSpent >= threshold && !hasTrackedSignificantTime.current) {
                analytics.trackEvent('section_significant_time', {
                  sectionId,
                  sectionName,
                  timeSpent,
                });
                hasTrackedSignificantTime.current = true;
              }

              startTimeRef.current = null;
            }
          }
        });
      },
      {
        threshold: 0.5, // 50% de la sección visible
        rootMargin: '0px',
      }
    );

    observer.observe(element);

    // Cleanup
    return () => {
      observer.disconnect();

      // Trackear tiempo al desmontar si la sección aún estaba visible
      if (startTimeRef.current) {
        const timeSpent = (Date.now() - startTimeRef.current) / 1000;
        analytics.trackEvent('section_exit', {
          sectionId,
          sectionName,
          timeSpent,
          unmounted: true,
        });
      }
    };
  }, [sectionId, sectionName, threshold, analytics]);

  return (
    <section ref={sectionRef} id={sectionId}>
      {children}
    </section>
  );
}

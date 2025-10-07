/**
 * Componentes de Skeleton Loaders para mejorar UX durante cargas
 */

interface SkeletonProps {
  className?: string;
}

/**
 * Skeleton base con animación de shimmer
 */
export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded ${className}`}
      style={{
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s ease-in-out infinite',
      }}
    />
  );
}

/**
 * Skeleton para tarjetas de proyectos
 */
export function ProjectCardSkeleton() {
  return (
    <div className="w-full max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Imagen */}
      <Skeleton className="h-48 w-full" />

      <div className="p-6">
        {/* Título */}
        <Skeleton className="h-6 w-3/4 mb-4" />

        {/* Descripción */}
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-2" />
        <Skeleton className="h-4 w-4/6 mb-4" />

        {/* Tags */}
        <div className="flex gap-2 flex-wrap">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton para sección de skills
 */
export function SkillsSkeleton() {
  return (
    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-8 py-6 px-4">
      {Array.from({ length: 16 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center">
          {/* Ícono */}
          <Skeleton className="w-20 h-20 md:w-24 md:h-24 rounded-lg mb-3" />
          {/* Barra de progreso */}
          <Skeleton className="w-full h-2 rounded-full" />
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton para tarjeta de experiencia
 */
export function ExperienceCardSkeleton() {
  return (
    <div className="relative border-l-2 border-gray-300 dark:border-gray-600 pl-8 pb-8">
      {/* Círculo timeline */}
      <div className="absolute left-0 top-0 -translate-x-1/2">
        <Skeleton className="w-4 h-4 rounded-full" />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        {/* Fecha */}
        <Skeleton className="h-4 w-32 mb-4" />

        {/* Título */}
        <Skeleton className="h-6 w-3/4 mb-3" />

        {/* Empresa */}
        <Skeleton className="h-5 w-1/2 mb-4" />

        {/* Descripción */}
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-2" />
        <Skeleton className="h-4 w-4/6 mb-4" />

        {/* Tecnologías */}
        <div className="flex gap-2 flex-wrap">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-18" />
          <Skeleton className="h-6 w-22" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton para lista de testimonios
 */
export function TestimonialSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="flex items-center mb-4">
        {/* Avatar */}
        <Skeleton className="w-12 h-12 rounded-full mr-4" />
        <div className="flex-1">
          {/* Nombre */}
          <Skeleton className="h-5 w-32 mb-2" />
          {/* Rol */}
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      {/* Testimonio */}
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}

/**
 * Loading spinner
 */
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizeClasses[size]} border-gray-300 border-t-blue-500 rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}

/**
 * Loading overlay para toda la página
 */
export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium">
          Loading...
        </p>
      </div>
    </div>
  );
}

/**
 * Skeleton genérico para texto
 */
export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
        />
      ))}
    </div>
  );
}

// Añadir keyframes de shimmer al CSS global si no existe
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }
  `;
  document.head.appendChild(style);
}

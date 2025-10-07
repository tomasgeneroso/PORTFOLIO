"use client";

import { motion, useInView, Variants } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface SectionRevealProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale';
  delay?: number;
  duration?: number;
  className?: string;
}

/**
 * Componente para animaciones discretas al hacer scroll
 * Anima secciones cuando entran en el viewport
 */
export function SectionReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  className = '',
}: SectionRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true, // Solo animar una vez
    margin: '-100px', // Trigger antes de que sea completamente visible
  });

  const variants: Variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 50 : direction === 'down' ? -50 : 0,
      x: direction === 'left' ? 50 : direction === 'right' ? -50 : 0,
      scale: direction === 'scale' ? 0.8 : 1,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: {
        duration,
        delay,
        ease: [0.25, 0.4, 0.25, 1], // Curva de easing suave
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Animación de "float" sutil para elementos
 */
export function FloatingElement({
  children,
  duration = 3,
  className = '',
}: {
  children: ReactNode;
  duration?: number;
  className?: string;
}) {
  return (
    <motion.div
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Animación stagger para listas
 */
export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  className = '',
}: {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Item individual para StaggerContainer
 */
export function StaggerItem({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}

/**
 * Animación de "highlight" al hacer scroll a una sección
 */
export function SectionHighlight({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0.95 }}
      animate={
        isInView
          ? {
              scale: [0.95, 1.02, 1],
            }
          : { scale: 0.95 }
      }
      transition={{
        duration: 0.8,
        ease: 'easeOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

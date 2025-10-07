"use client";

import { useEffect, useState } from 'react';

/**
 * Componente para manejar la instalación del PWA
 * Registra el service worker y muestra prompt de instalación
 */
export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    // Registrar Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[PWA] Service Worker registered:', registration);

          // Verificar actualizaciones cada hora
          setInterval(() => {
            registration.update();
          }, 60 * 60 * 1000);
        })
        .catch((error) => {
          console.error('[PWA] Service Worker registration failed:', error);
        });
    }

    // Capturar evento de instalación
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Detectar si ya está instalado
    window.addEventListener('appinstalled', () => {
      console.log('[PWA] App installed successfully');
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    console.log(`[PWA] User response: ${outcome}`);
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Guardar en localStorage para no mostrar por 7 días
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // No mostrar si fue dismisseado recientemente
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const weekInMs = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - dismissedTime < weekInMs) {
        setShowInstallPrompt(false);
      }
    }
  }, []);

  if (!showInstallPrompt) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg shadow-2xl p-4 z-50 animate-slide-up"
      role="dialog"
      aria-labelledby="pwa-install-title"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 id="pwa-install-title" className="font-bold text-lg mb-2">
            Install Portfolio App
          </h3>
          <p className="text-sm opacity-90 mb-3">
            Get quick access to my portfolio with offline support!
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleInstallClick}
              className="bg-white text-purple-600 px-4 py-2 rounded-md font-semibold text-sm hover:bg-opacity-90 transition"
              aria-label="Install app"
            >
              Install
            </button>
            <button
              onClick={handleDismiss}
              className="bg-transparent border border-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-white hover:bg-opacity-10 transition"
              aria-label="Dismiss install prompt"
            >
              Not Now
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="ml-2 text-white opacity-70 hover:opacity-100 transition"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

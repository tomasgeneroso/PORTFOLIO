import React, { useState, useEffect } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";

export const ConnectionIndicator: React.FC = () => {
  const { getConnectionStatus, forceSync } = useAnalytics();
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const checkStatus = setInterval(() => {
      setIsConnected(getConnectionStatus());
    }, 5000);

    return () => clearInterval(checkStatus);
  }, [getConnectionStatus]);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await forceSync();
    } finally {
      setIsSyncing(false);
    }
  };

  // Only show in development mode
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-3 flex items-center gap-2">
      <div
        className={`w-3 h-3 rounded-full ${
          isConnected ? "bg-green-500" : "bg-yellow-500"
        } animate-pulse`}
      />
      <span className="text-sm">{isConnected ? "Conectado" : "Offline"}</span>
      {!isConnected && (
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="ml-2 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isSyncing ? "Sincronizando..." : "Sincronizar"}
        </button>
      )}
    </div>
  );
};

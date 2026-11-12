"use client";

import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

export function OfflineBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  if (!offline) return null;

  return (
    <div className="offline-banner fixed inset-x-0 top-14 z-30 flex items-center justify-center gap-2 border-b border-accent/25 bg-accent/10 px-4 py-1.5 text-[11px] text-fg/90 backdrop-blur">
      <WifiOff className="h-3.5 w-3.5 shrink-0 text-accent" />
      Sin conexión. El contenido ya visitado sigue disponible.
    </div>
  );
}

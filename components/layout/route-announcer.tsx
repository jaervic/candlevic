"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Anuncia los cambios de ruta a lectores de pantalla. Next.js no mueve el foco
 * ni anuncia la nueva página en navegaciones de cliente.
 */
export function RouteAnnouncer() {
  const pathname = usePathname();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const title = document.title.split(" · ")[0] || document.title;
      setMessage(`Página cargada: ${title}`);
    }, 150);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return (
    <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
      {message}
    </p>
  );
}

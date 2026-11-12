"use client";

import { useEffect, useState } from "react";
import { Download, RefreshCw, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const INSTALL_KEY = "candlevic:install-dismissed:v1";

export function PwaRegister() {
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      setDismissed(localStorage.getItem(INSTALL_KEY) === "1");
    } catch {
      setDismissed(false);
    }

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;

    const onPrompt = (event: Event) => {
      event.preventDefault();
      if (!standalone) setInstallEvent(event as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setInstallEvent(null);

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);

    let timer: number | undefined;
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      timer = window.setTimeout(async () => {
        try {
          const registration = await navigator.serviceWorker.register("/sw.js");
          if (registration.waiting) setWaiting(registration.waiting);
          registration.addEventListener("updatefound", () => {
            const worker = registration.installing;
            worker?.addEventListener("statechange", () => {
              if (
                worker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                setWaiting(worker);
              }
            });
          });
        } catch {
          /* sin soporte o sin conexión */
        }
      }, 2500);
    }

    return () => {
      if (timer) window.clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  function applyUpdate() {
    if (!waiting) return;
    waiting.postMessage("SKIP_WAITING");
    window.setTimeout(() => window.location.reload(), 350);
  }

  async function install() {
    if (!installEvent) return;
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice.outcome === "accepted") setInstallEvent(null);
  }

  function dismissInstall() {
    setInstallEvent(null);
    setDismissed(true);
    try {
      localStorage.setItem(INSTALL_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  if (!waiting && (!installEvent || dismissed)) return null;

  return (
    <div className="fixed inset-x-0 bottom-20 z-50 flex flex-col items-center gap-2 px-4 md:bottom-6">
      {waiting && (
        <div className="flex w-full max-w-md items-center gap-3 rounded-2xl border border-accent/30 bg-surface p-3 shadow-xl">
          <RefreshCw className="h-4 w-4 shrink-0 text-accent" />
          <p className="min-w-0 flex-1 text-[11.5px] leading-snug">
            Hay una nueva versión de Candlevic.
          </p>
          <button
            type="button"
            onClick={applyUpdate}
            className="rounded-lg bg-accent px-2.5 py-1.5 text-[11px] font-medium text-on-accent"
          >
            Actualizar
          </button>
        </div>
      )}

      {installEvent && !dismissed && (
        <div className="flex w-full max-w-md items-center gap-3 rounded-2xl border border-line bg-surface p-3 shadow-xl">
          <Download className="h-4 w-4 shrink-0 text-accent" />
          <div className="min-w-0 flex-1">
            <p className="text-[11.5px] font-medium">Instala Candlevic</p>
            <p className="text-[10px] text-faint">
              Acceso rápido y lectura sin conexión.
            </p>
          </div>
          <button
            type="button"
            onClick={install}
            className="rounded-lg bg-accent px-2.5 py-1.5 text-[11px] font-medium text-on-accent"
          >
            Instalar
          </button>
          <button
            type="button"
            onClick={dismissInstall}
            aria-label="Ahora no"
            className="rounded-lg p-1.5 text-faint transition-colors hover:text-fg"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

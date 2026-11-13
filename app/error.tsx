"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, RotateCcw } from "lucide-react";
import { track } from "@/lib/analytics";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
    track("app_error", { digest: error.digest ?? "" });
  }, [error]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-down/25 bg-down/10 text-down">
        <AlertTriangle className="h-6 w-6" />
      </span>
      <h1 className="mt-4 text-xl font-semibold">Algo se rompió por aquí</h1>
      <p className="mt-2 text-[13px] leading-relaxed text-muted">
        La página no pudo cargarse. Tu progreso sigue guardado en este
        dispositivo. Prueba a reintentar o vuelve a la ruta.
      </p>
      {error.digest && (
        <p className="num mt-2 text-[10px] text-faint">
          Referencia: {error.digest}
        </p>
      )}
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-on-accent"
        >
          <RotateCcw className="h-4 w-4" /> Reintentar
        </button>
        <Link
          href="/aprender"
          className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-medium text-fg"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a la ruta
        </Link>
      </div>
    </div>
  );
}

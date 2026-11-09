"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, CircleCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/lib/progress";

export function LessonActions({
  slug,
  next,
  prev,
}: {
  slug: string;
  next: { slug: string; title: string } | null;
  prev: { slug: string; title: string } | null;
}) {
  const entry = useProgress((s) => s.lessons[slug]);
  const start = useProgress((s) => s.start);
  const complete = useProgress((s) => s.complete);

  useEffect(() => {
    start(slug);
  }, [slug, start]);

  const done = entry?.status === "completed";

  return (
    <div className="mt-8 space-y-4 border-t border-line pt-5">
      <div className="rounded-2xl border border-line bg-surface p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[13px] font-medium">
              {done ? "Lección completada" : "¿Ya lo tienes?"}
            </p>
            <p className="mt-0.5 text-[11px] text-muted">
              {entry?.quizScore != null
                ? `Mejor resultado en los quizzes: ${entry.quizScore}%`
                : "Complétala para sumar XP y avanzar en tu ruta."}
            </p>
          </div>
          <Button
            variant={done ? "secondary" : "primary"}
            size="sm"
            onClick={() => complete(slug, entry?.quizScore)}
            disabled={done}
          >
            {done ? (
              <>
                <Check className="h-4 w-4" /> Completada
              </>
            ) : (
              <>
                <CircleCheck className="h-4 w-4" /> Completar
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex items-stretch gap-2">
        {prev ? (
          <Link
            href={`/aprender/${prev.slug}`}
            className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-line bg-surface p-3 transition-colors hover:border-line-strong"
          >
            <ArrowLeft className="h-4 w-4 shrink-0 text-faint" />
            <span className="min-w-0">
              <span className="block text-[9px] uppercase tracking-wider text-faint">
                Anterior
              </span>
              <span className="block truncate text-[12px] text-fg/90">{prev.title}</span>
            </span>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
        {next && (
          <Link
            href={`/aprender/${next.slug}`}
            className="flex min-w-0 flex-1 items-center justify-end gap-2 rounded-xl border border-accent/25 bg-accent/10 p-3 text-right transition-colors hover:bg-accent/15"
          >
            <span className="min-w-0">
              <span className="block text-[9px] uppercase tracking-wider text-accent">
                Siguiente
              </span>
              <span className="block truncate text-[12px] text-fg">{next.title}</span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-accent" />
          </Link>
        )}
      </div>

      <p className="flex items-center gap-1.5 text-[10px] text-faint">
        <Clock className="h-3 w-3" />
        El progreso se guarda en este dispositivo. Crea un código en{" "}
        <Link href="/progreso" className="text-muted underline-offset-4 hover:underline">
          Progreso
        </Link>
        .
      </p>
    </div>
  );
}

"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Clock } from "lucide-react";
import type { LearningPath } from "@/content/rutas";
import { PathIcon } from "@/components/learn/path-icon";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import { useHydrated } from "@/lib/use-hydrated";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

type PathLesson = {
  slug: string;
  title: string;
  summary: string;
  minutes: number;
};

export function PathDetail({
  path,
  lessons,
  minutes,
}: {
  path: LearningPath;
  lessons: PathLesson[];
  minutes: number;
}) {
  const hydrated = useHydrated();
  const progress = useProgress((state) => state.lessons);
  const done = hydrated
    ? lessons.filter((lesson) => progress[lesson.slug]?.status === "completed")
        .length
    : 0;
  const total = lessons.length;
  const complete = done === total;
  const next =
    lessons.find((lesson) => progress[lesson.slug]?.status !== "completed") ??
    lessons[0];
  const pct = Math.round((done / Math.max(total, 1)) * 100);

  return (
    <article className="mx-auto max-w-3xl">
      <Link
        href="/aprender/rutas"
        className="mb-3 inline-flex items-center gap-1.5 text-[11px] text-faint hover:text-muted"
      >
        <ArrowLeft className="h-3 w-3" /> Rutas guiadas
      </Link>

      <header>
        <div className="flex items-start gap-3">
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border"
            style={{
              borderColor: `${path.accent}33`,
              backgroundColor: `${path.accent}14`,
              color: path.accent,
            }}
          >
            <PathIcon icon={path.icon} className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge tone="accent">Ruta guiada</Badge>
              <Badge tone="outline">{path.level}</Badge>
              <span className="inline-flex items-center gap-1 text-[10px] text-faint">
                <Clock className="h-3 w-3" /> {minutes} min
              </span>
            </div>
            <h1 className="mt-1.5 text-2xl font-semibold leading-tight tracking-tight">
              {path.name}
            </h1>
            <p className="mt-1 text-[13.5px] font-medium text-muted">
              {path.tagline}
            </p>
          </div>
        </div>
        <p className="mt-3 text-[13px] leading-relaxed text-fg/90">
          {path.description}
        </p>
      </header>

      <section className="mt-5 rounded-2xl border border-line bg-surface p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-faint">
              Tu progreso
            </p>
            <p className="num mt-0.5 text-[15px] font-semibold">
              {hydrated ? done : 0} / {total} lecciones
            </p>
          </div>
          <Link
            href={`/aprender/${next.slug}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-[12px] font-medium text-on-accent transition-opacity hover:opacity-90"
          >
            {complete ? "Repasar la ruta" : done > 0 ? "Continuar" : "Empezar"}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <ProgressBar value={pct} className="mt-3" />
        <p className="mt-2 text-[10.5px] leading-relaxed text-faint">
          {complete
            ? "Ruta completada. Vuelve cuando quieras: el repaso espaciado también cuenta."
            : `Siguiente: ${next.title}. Puedes saltar lecciones, pero el orden está pensado para que cada una apoye a la anterior.`}
        </p>
      </section>

      {path.outcomes.length > 0 && (
        <section className="mt-4">
          <h2 className="text-[13px] font-semibold">Al terminar sabrás</h2>
          <ul className="mt-2 grid gap-1.5 sm:grid-cols-3">
            {path.outcomes.map((outcome) => (
              <li
                key={outcome}
                className="rounded-xl border border-line bg-surface p-3 text-[11px] leading-relaxed text-fg/90"
              >
                <span className="mb-1 block h-1 w-6 rounded-full bg-accent" />
                {outcome}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-5">
        <div className="mb-2 flex items-end justify-between gap-2">
          <h2 className="text-[13px] font-semibold">Lecciones en orden</h2>
          <span className="text-[10px] text-faint">
            {total} pasos · {minutes} min
          </span>
        </div>
        <ol className="overflow-hidden rounded-2xl border border-line bg-surface">
          {lessons.map((lesson, index) => {
            const completed =
              hydrated && progress[lesson.slug]?.status === "completed";
            return (
              <li key={lesson.slug}>
                <Link
                  href={`/aprender/${lesson.slug}`}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-2/60",
                    index > 0 && "border-t border-line/70",
                  )}
                >
                  <span
                    className={cn(
                      "num flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[11px]",
                      completed
                        ? "border-up/25 bg-up/10 text-up"
                        : "border-line bg-surface-2 text-muted",
                    )}
                  >
                    {completed ? <Check className="h-3.5 w-3.5" /> : index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "text-[13px] font-medium leading-snug",
                        completed ? "text-muted" : "text-fg",
                      )}
                    >
                      {lesson.title}
                    </p>
                    <p className="mt-0.5 line-clamp-1 text-[11px] text-faint">
                      {lesson.summary}
                    </p>
                  </div>
                  <span className="hidden shrink-0 items-center gap-1 text-[10px] text-faint sm:flex">
                    <Clock className="h-3 w-3" /> {lesson.minutes} min
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-faint" />
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      <p className="mt-4 rounded-xl border border-line bg-surface p-3 text-[10.5px] leading-relaxed text-faint">
        Esta ruta es una recomendación de orden, no una obligación ni una señal
        de inversión. Puedes adaptarla a tu nivel y a tu tiempo. El progreso se
        guarda en este dispositivo.
      </p>
    </article>
  );
}

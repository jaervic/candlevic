"use client";

import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import type { LearningPath } from "@/content/rutas";
import { PathIcon } from "@/components/learn/path-icon";
import { ProgressBar } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useHydrated } from "@/lib/use-hydrated";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

type PathSummary = LearningPath & { minutes: number };

export function PathList({ paths }: { paths: PathSummary[] }) {
  const hydrated = useHydrated();
  const lessons = useProgress((state) => state.lessons);

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {paths.map((path) => {
        const done = hydrated
          ? path.lessons.filter(
              (slug) => lessons[slug]?.status === "completed",
            ).length
          : 0;
        const total = path.lessons.length;
        const next =
          path.lessons.find(
            (slug) => lessons[slug]?.status !== "completed",
          ) ?? path.lessons[0];
        const complete = done === total;

        return (
          <article
            key={path.slug}
            className="relative overflow-hidden rounded-2xl border border-line bg-surface"
          >
            <span
              className="absolute inset-x-0 top-0 h-0.5"
              style={{ backgroundColor: path.accent }}
            />

            <Link
              href={`/aprender/rutas/${path.slug}`}
              className="block p-4 transition-colors hover:bg-surface-2/40"
            >
              <div className="flex items-start gap-3">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
                  style={{
                    borderColor: `${path.accent}33`,
                    backgroundColor: `${path.accent}14`,
                    color: path.accent,
                  }}
                >
                  <PathIcon icon={path.icon} className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge tone="outline">{path.level}</Badge>
                    <span className="inline-flex items-center gap-1 text-[10px] text-faint">
                      <Clock className="h-3 w-3" /> {path.minutes} min
                    </span>
                    {complete && <Badge tone="up">completada</Badge>}
                  </div>
                  <h2 className="mt-1 text-[15px] font-semibold leading-tight">
                    {path.name}
                  </h2>
                  <p className="mt-0.5 text-[11.5px] leading-relaxed text-muted">
                    {path.tagline}
                  </p>
                </div>
              </div>

              <p className="mt-3 line-clamp-2 text-[11px] leading-relaxed text-faint">
                {path.description}
              </p>

              <div className="mt-3 flex items-center gap-2">
                <ProgressBar value={done} max={total} className="max-w-[180px]" />
                <span className="num text-[10px] text-faint">
                  {hydrated ? done : 0}/{total} lecciones
                </span>
              </div>
            </Link>

            <div className="flex items-center justify-between gap-2 border-t border-line/70 px-4 py-2.5">
              <span className="text-[10px] text-faint">
                {complete
                  ? "Puedes repasarla cuando quieras"
                  : `${total - done} pendientes`}
              </span>
              <Link
                href={`/aprender/${next}`}
                className={cn(
                  "inline-flex items-center gap-1 text-[11px] font-medium",
                  complete ? "text-muted hover:text-fg" : "text-accent",
                )}
              >
                {complete ? "Repasar" : done > 0 ? "Continuar" : "Empezar"}
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}

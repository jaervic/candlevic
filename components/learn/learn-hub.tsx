"use client";

import Link from "next/link";
import { Check, ChevronRight, Circle, Clock } from "lucide-react";
import { ProgressBar } from "@/components/ui/progress";
import { ModuleIcon } from "@/components/module-icon";
import { cn } from "@/lib/utils";
import { useHydrated } from "@/lib/use-hydrated";
import { useProgress } from "@/lib/progress";
import type { CourseModule } from "@/content/modulos";

type HubLesson = {
  slug: string;
  title: string;
  summary: string;
  minutes: number;
  level: string;
};

export function LearnHub({
  modules,
}: {
  modules: { module: CourseModule; lessons: HubLesson[] }[];
}) {
  const hydrated = useHydrated();
  const lessons = useProgress((s) => s.lessons);

  return (
    <div className="space-y-6">
      {modules.map(({ module, lessons: moduleLessons }, moduleIndex) => {
        const done = moduleLessons.filter(
          (l) => lessons[l.slug]?.status === "completed",
        ).length;
        const pct = Math.round((done / Math.max(moduleLessons.length, 1)) * 100);

        return (
          <section key={module.id} id={module.id} className="scroll-mt-20">
            <div className="mb-3 flex items-start gap-3">
              <span
                className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
                style={{
                  borderColor: `${module.accent}33`,
                  backgroundColor: `${module.accent}14`,
                  color: module.accent,
                }}
              >
                <ModuleIcon name={module.icon} className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="num text-[10px] uppercase tracking-widest text-faint">
                    Módulo {moduleIndex + 1}
                  </span>
                  {done === moduleLessons.length && moduleLessons.length > 0 && (
                    <span className="rounded-full bg-up/10 px-1.5 py-0.5 text-[9px] font-medium text-up">
                      completado
                    </span>
                  )}
                </div>
                <h2 className="text-[15px] font-semibold leading-tight">
                  {module.title}
                </h2>
                <p className="mt-0.5 text-[12px] leading-snug text-muted">
                  {module.description}
                </p>
                {moduleLessons.length > 0 ? (
                  <div className="mt-2 flex items-center gap-2">
                    <ProgressBar value={pct} className="max-w-[180px]" />
                    <span className="num text-[10px] text-faint">
                      {hydrated ? done : 0}/{moduleLessons.length}
                    </span>
                  </div>
                ) : (
                  <p className="mt-2 text-[10px] uppercase tracking-wider text-faint">
                    En preparación
                  </p>
                )}
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-line bg-surface">
              {moduleLessons.length === 0 && (
                <p className="px-4 py-3 text-[12px] text-faint">
                  Lecciones en preparación.
                </p>
              )}
              {moduleLessons.map((lesson, i) => {
                const completed =
                  hydrated && lessons[lesson.slug]?.status === "completed";
                return (
                  <Link
                    key={lesson.slug}
                    href={`/aprender/${lesson.slug}`}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-2/60",
                      i > 0 && "border-t border-line/70",
                    )}
                  >
                    {completed ? (
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-up/15 text-up">
                        <Check className="h-3 w-3" />
                      </span>
                    ) : (
                      <Circle className="h-5 w-5 shrink-0 text-faint/60" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          "line-clamp-2 text-[13.5px] font-medium leading-snug",
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
                      <Clock className="h-3 w-3" />
                      {lesson.minutes} min
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-faint" />
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

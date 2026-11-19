"use client";

import Link from "next/link";
import {
  ArrowRight,
  Check,
  Circle,
  Flame,
  FlaskConical,
  GraduationCap,
  Library,
  Newspaper,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProgressBar, ProgressRing } from "@/components/ui/progress";
import { ModuleIcon } from "@/components/module-icon";
import { cn } from "@/lib/utils";
import { useHydrated } from "@/lib/use-hydrated";
import {
  completedCount,
  levelFromXp,
  totalXp,
  useProgress,
} from "@/lib/progress";
import type { CourseModule } from "@/content/modulos";
import { ReviewCard } from "./review-card";

export type DashboardLesson = {
  slug: string;
  title: string;
  summary: string;
  minutes: number;
};

export type DashboardModule = {
  module: CourseModule;
  lessons: DashboardLesson[];
};

const CHECKLIST = [
  { id: "que-es-invertir", label: "Entiende qué estás comprando", href: "/aprender/que-es-invertir" },
  { id: "ordenes", label: "Aprende a usar los tipos de orden", href: "/aprender/ordenes" },
  { id: "velas", label: "Lee tu primera vela japonesa", href: "/aprender/velas" },
  { id: "tendencia", label: "Identifica una tendencia", href: "/aprender/tendencia" },
  { id: "soporte-resistencia", label: "Marca un soporte y una resistencia", href: "/aprender/soporte-resistencia" },
  { id: "stop-loss", label: "Calcula tu riesgo antes de entrar", href: "/aprender/stop-loss" },
  { id: "ratio-riesgo-beneficio", label: "Comprueba tu ratio R:B", href: "/aprender/ratio-riesgo-beneficio" },
];

export function Dashboard({
  modules,
  totalLessons,
}: {
  modules: DashboardModule[];
  totalLessons: number;
}) {
  const hydrated = useHydrated();
  const lessons = useProgress((s) => s.lessons);
  const streak = useProgress((s) => s.streak.current);
  const profile = useProgress((s) => s.profile);
  const savedCode = useProgress((s) => s.savedCode);

  const xp = hydrated ? totalXp(lessons) : 0;
  const completed = hydrated ? completedCount(lessons) : 0;
  const level = levelFromXp(xp);
  const overall = Math.round((completed / Math.max(totalLessons, 1)) * 100);

  const flat = modules.flatMap((m) => m.lessons);
  const catalog = modules.flatMap(({ module, lessons: moduleLessons }) =>
    moduleLessons.map((lesson) => ({
      slug: lesson.slug,
      title: lesson.title,
      module: module.title,
    })),
  );
  const nextLesson =
    flat.find((lesson) => lessons[lesson.slug]?.status !== "completed") ??
    flat[0];

  const checklist = CHECKLIST.map((item) => ({
    ...item,
    done: lessons[item.id]?.status === "completed",
  }));
  const extraDone = [
    { label: "Haz el test ¿Qué trader eres?", done: Boolean(profile) },
    { label: "Completa 5 lecciones", done: completed >= 5 },
    { label: "Crea tu código de guardado", done: Boolean(savedCode) },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-[1.15fr_0.85fr] md:items-start">
      <div className="min-w-0 space-y-4">
      <section className="animate-fade-up surface-glow relative overflow-hidden rounded-3xl border border-line p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Badge tone="accent" className="mb-2">
              <Sparkles className="h-3 w-3" /> Gratis y sin registro
            </Badge>
            <h1 className="text-[24px] font-semibold leading-tight tracking-tight sm:text-[26px]">
              Aprende trading
              <br />
              viendo velas
            </h1>
            <p className="mt-2 max-w-sm text-[13.5px] leading-relaxed text-muted">
              Lecciones cortas, gráficos reales y práctica guiada. Sin señales y
              sin promesas: solo criterio.
            </p>
          </div>

          <ProgressRing
            value={hydrated ? level.progress : 0}
            size={72}
            stroke={6}
            label="Progreso de nivel"
          >
            <div className="text-center">
              <p className="num text-[15px] font-semibold leading-none">
                {hydrated ? level.level : 1}
              </p>
              <p className="text-[9px] uppercase tracking-widest text-faint">nivel</p>
            </div>
          </ProgressRing>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface/70 px-2.5 py-1.5 text-[12px] text-muted">
            <Flame className="h-3.5 w-3.5 text-accent" />
            <span className="num text-fg">{hydrated ? streak : 0}</span> días de racha
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface/70 px-2.5 py-1.5 text-[12px] text-muted">
            <Zap className="h-3.5 w-3.5 text-info" />
            <span className="num text-fg">{xp}</span> XP
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface/70 px-2.5 py-1.5 text-[12px] text-muted">
            <GraduationCap className="h-3.5 w-3.5 text-up" />
            <span className="num text-fg">{completed}</span>/{totalLessons} lecciones
          </span>
        </div>

        <div className="mt-4">
          <div className="mb-1.5 flex justify-between text-[10px] text-faint">
            <span>Progreso total</span>
            <span className="num">{overall}%</span>
          </div>
          <ProgressBar value={overall} label="Progreso total" />
        </div>
      </section>

      {nextLesson && (
        <Link
          href={`/aprender/${nextLesson.slug}`}
          className="group flex items-center gap-3 rounded-2xl border border-accent/25 bg-accent/10 p-4 transition-colors hover:bg-accent/15"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-on-accent">
            <ArrowRight className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-wider text-accent">
              {completed === 0 ? "Empieza por aquí" : "Continúa donde lo dejaste"}
            </p>
            <p className="truncate text-[14px] font-medium">{nextLesson.title}</p>
            <p className="text-[12px] text-muted">{nextLesson.minutes} min de lectura</p>
          </div>
        </Link>
      )}
      <ReviewCard catalog={catalog} />
      </div>

      <section className="order-3 min-w-0 rounded-2xl border border-line bg-surface p-4 md:order-none">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-accent" />
            <h2 className="text-sm font-semibold">Ruta del principiante</h2>
          </div>
          <span className="num text-[12px] text-faint">
            {checklist.filter((c) => c.done).length}/{checklist.length + extraDone.length}
          </span>
        </div>

        <ul className="space-y-1.5">
          {checklist.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className="flex items-center gap-2.5 rounded-lg px-1.5 py-2 text-[13px] transition-colors hover:bg-surface-2"
              >
                {item.done ? (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-up/15 text-up">
                    <Check className="h-3 w-3" />
                  </span>
                ) : (
                  <Circle className="h-4 w-4 text-faint" />
                )}
                <span className={cn(item.done ? "text-muted line-through" : "text-fg/90")}>
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
          {extraDone.map((item) => (
            <li
              key={item.label}
              className="flex items-center gap-2.5 px-1.5 py-2 text-[13px]"
            >
              {item.done ? (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-up/15 text-up">
                  <Check className="h-3 w-3" />
                </span>
              ) : (
                <Circle className="h-4 w-4 text-faint" />
              )}
              <span className={cn(item.done ? "text-muted line-through" : "text-fg/90")}>
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="order-2 min-w-0 md:order-none md:col-span-2">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-sm font-semibold">Módulos</h2>
          <Link href="/aprender" className="text-[12px] text-muted hover:text-fg">
            Ver todos
          </Link>
        </div>

        <div className="grid gap-2.5 md:grid-cols-2">
          {modules.map(({ module, lessons: moduleLessons }) => {
            const done = moduleLessons.filter(
              (l) => lessons[l.slug]?.status === "completed",
            ).length;
            const pct = Math.round((done / Math.max(moduleLessons.length, 1)) * 100);
            const next = moduleLessons.find(
              (lesson) => lessons[lesson.slug]?.status !== "completed",
            );
            return (
              <Link
                key={module.id}
                href={`/aprender#${module.id}`}
                className="group flex flex-col rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-line-strong hover:bg-surface-2/60"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="module-accent-icon flex h-8 w-8 items-center justify-center rounded-lg border"
                    style={{
                      borderColor: `${module.accent}33`,
                      backgroundColor: `${module.accent}14`,
                      color: module.accent,
                    }}
                  >
                    <ModuleIcon name={module.icon} className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-medium">{module.title}</p>
                    <p className="text-[12px] text-muted">
                      {moduleLessons.length === 0
                        ? "Próximamente"
                        : `${done}/${moduleLessons.length} lecciones`}
                    </p>
                  </div>
                  {pct === 100 && moduleLessons.length > 0 && (
                    <Badge tone="up">Hecho</Badge>
                  )}
                </div>
                {next ? (
                  <p className="mt-2 line-clamp-1 text-[12px] text-muted">
                    Siguiente:{" "}
                    <span className="text-fg/90">{next.title}</span>
                  </p>
                ) : (
                  moduleLessons.length > 0 && (
                    <p className="mt-2 text-[12px] text-muted">
                      Módulo completado. Puedes repasarlo cuando quieras.
                    </p>
                  )
                )}
                {moduleLessons.length > 0 && (
                  <div className="mt-auto flex items-center gap-2 pt-3">
                    <ProgressBar
                      value={pct}
                      className="flex-1"
                      label={`Progreso del módulo ${module.title}`}
                    />
                    <span className="num text-[10px] text-faint">{pct}%</span>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </section>


      <section className="order-4 grid grid-cols-2 gap-2.5 md:order-none md:col-span-2 md:grid-cols-4">
        {[
          { href: "/radar", label: "Radar de mercado", icon: Newspaper, tone: "text-info" },
          { href: "/lab", label: "Laboratorio", icon: FlaskConical, tone: "text-up" },
          { href: "/test", label: "¿Qué trader eres?", icon: Sparkles, tone: "text-accent" },
          { href: "/aprender/biblioteca", label: "Biblioteca", icon: Library, tone: "text-fg" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-2.5 rounded-2xl border border-line bg-surface p-3.5 text-[12.5px] transition-colors hover:border-line-strong hover:bg-surface-2/60"
          >
            <item.icon className={cn("h-4 w-4", item.tone)} />
            {item.label}
          </Link>
        ))}
      </section>
      </div>

    </div>
  );
}

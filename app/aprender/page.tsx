import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { LearnHub } from "@/components/learn/learn-hub";
import { LearnTabs } from "@/components/learn/learn-tabs";
import { getModulesWithLessons } from "@/lib/content";

export const metadata = {
  alternates: { canonical: "/aprender" },
  title: "Aprender",
  description:
    "Ruta completa de aprendizaje: mentalidad, fundamentos, estilos de trading, gráficos, análisis técnico y gestión de riesgo.",
};

export default function AprenderPage() {
  const modules = getModulesWithLessons();

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[10px] uppercase tracking-[0.16em] text-accent">
          Currículo
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Aprender</h1>
        <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-muted">
          Diez módulos, de cero a un proceso con riesgo controlado. Cada lección
          incluye gráficos reales y un ejercicio.
        </p>
      </header>

      <LearnTabs active="/aprender" />

      <Link
        href="/aprender/rutas"
        className="flex items-center gap-3 rounded-2xl border border-info/25 bg-info/10 p-4 transition-colors hover:bg-info/15"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-info/25 bg-info/10 text-info">
          <Compass className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[10px] uppercase tracking-wider text-info">
            ¿No sabes por dónde empezar?
          </span>
          <span className="block text-[14px] font-medium">Rutas guiadas</span>
          <span className="block text-[11px] text-muted">
            Cuatro itinerarios con orden recomendado y progreso
          </span>
        </span>
        <ArrowRight className="h-4 w-4 shrink-0 text-info" />
      </Link>

      <LearnHub
        modules={modules.map(({ module, lessons }) => ({
          module,
          lessons: lessons.map((lesson) => ({
            slug: lesson.meta.slug,
            title: lesson.meta.title,
            summary: lesson.meta.summary,
            minutes: lesson.meta.minutes,
            level: lesson.meta.level,
          })),
        }))}
      />
    </div>
  );
}

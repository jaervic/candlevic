import Link from "next/link";
import { LearnHub } from "@/components/learn/learn-hub";
import { getModulesWithLessons } from "@/lib/content";

export const metadata = {
  title: "Aprender",
  description:
    "Ruta completa de aprendizaje: mentalidad, fundamentos, estilos de trading, gráficos, análisis técnico y gestión de riesgo.",
};

const TABS = [
  { href: "/aprender", label: "Ruta" },
  { href: "/aprender/estudios", label: "Estudios" },
  { href: "/aprender/biblioteca", label: "Biblioteca" },
  { href: "/aprender/glosario", label: "Glosario" },
];

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
          Nueve módulos, de cero a un proceso con riesgo controlado. Cada lección
          incluye gráficos reales y un ejercicio.
        </p>
      </header>

      <nav className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1 pb-1">
        {TABS.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={
              tab.href === "/aprender"
                ? "shrink-0 rounded-lg bg-surface-2 px-3 py-1.5 text-[12px] font-medium text-fg"
                : "shrink-0 rounded-lg px-3 py-1.5 text-[12px] text-muted transition-colors hover:bg-surface-2/60 hover:text-fg"
            }
          >
            {tab.label}
          </Link>
        ))}
      </nav>

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

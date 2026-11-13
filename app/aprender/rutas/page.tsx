import { Compass } from "lucide-react";
import { LEARNING_PATHS } from "@/content/rutas";
import { getLesson } from "@/lib/content";
import { LearnTabs } from "@/components/learn/learn-tabs";
import { PathList } from "@/components/learn/path-list";

export const metadata = {
  title: "Rutas guiadas",
  description:
    "Cuatro itinerarios con orden recomendado para empezar desde cero, gestionar el riesgo, leer gráficos o entender cripto.",
  alternates: { canonical: "/aprender/rutas" },
};

export default function RutasPage() {
  const paths = LEARNING_PATHS.map((path) => ({
    ...path,
    minutes: path.lessons.reduce(
      (sum, slug) => sum + (getLesson(slug)?.meta.minutes ?? 0),
      0,
    ),
  }));

  return (
    <div className="space-y-5">
      <header>
        <p className="text-[10px] uppercase tracking-[0.16em] text-accent">
          Aprender
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Rutas guiadas
        </h1>
        <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-muted">
          Cuatro itinerarios con un orden recomendado. Elige por dónde empezar
          según tu objetivo, no según la lección que más te llame.
        </p>
      </header>

      <LearnTabs active="/aprender/rutas" />

      <div className="flex items-start gap-2 rounded-xl border border-info/20 bg-info/5 p-3">
        <Compass className="mt-0.5 h-3.5 w-3.5 shrink-0 text-info" />
        <p className="text-[11px] leading-relaxed text-muted">
          <span className="font-medium text-fg">No son caminos cerrados.</span>{" "}
          Puedes saltar lecciones o combinar rutas. El orden está pensado para
          que cada idea apoye a la siguiente.
        </p>
      </div>

      <PathList paths={paths} />

      <p className="rounded-xl border border-line bg-surface p-3 text-[10.5px] leading-relaxed text-faint">
        El progreso de cada ruta se calcula con las lecciones que ya has
        completado en Aprender. No necesitas apuntarte ni crear una cuenta.
      </p>
    </div>
  );
}

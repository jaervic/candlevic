import { ProgressPanel } from "@/components/progress/progress-panel";
import { Disclaimer } from "@/components/disclaimer";
import { getLessons } from "@/lib/content";

export const metadata = {
  title: "Progreso",
  description:
    "Tu progreso, logros y respaldo cifrado. Sin registro y sin email.",
};

export default function ProgresoPage() {
  const lessonSlugs = getLessons().map((lesson) => lesson.meta.slug);

  return (
    <div className="space-y-8">
      <ProgressPanel lessonSlugs={lessonSlugs} />
      <footer className="border-t border-line pt-4">
        <Disclaimer />
      </footer>
    </div>
  );
}

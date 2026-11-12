import { ProgressPanel } from "@/components/progress/progress-panel";
import { getLessons, getModulesWithLessons } from "@/lib/content";

export const metadata = {
  alternates: { canonical: "/progreso" },
  title: "Progreso",
  description:
    "Tu progreso, logros y respaldo cifrado. Sin registro y sin email.",
};

export default function ProgresoPage() {
  const lessonSlugs = getLessons().map((lesson) => lesson.meta.slug);
  const modules = getModulesWithLessons().map(({ module, lessons }) => ({
    module: {
      id: module.id,
      title: module.title,
      accent: module.accent,
    },
    lessons: lessons.map((lesson) => ({
      slug: lesson.meta.slug,
      title: lesson.meta.title,
    })),
  }));

  return (
    <div className="space-y-8">
      <ProgressPanel lessonSlugs={lessonSlugs} modules={modules} />
    </div>
  );
}

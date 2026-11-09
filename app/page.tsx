import { Dashboard } from "@/components/dashboard/dashboard";
import { Disclaimer } from "@/components/disclaimer";
import { getModulesWithLessons, getLessons } from "@/lib/content";

export default function HomePage() {
  const modules = getModulesWithLessons();
  const totalLessons = getLessons().length;

  return (
    <div className="space-y-8">
      <Dashboard
        totalLessons={totalLessons}
        modules={modules.map(({ module, lessons }) => ({
          module,
          lessons: lessons.map((lesson) => ({
            slug: lesson.meta.slug,
            title: lesson.meta.title,
            summary: lesson.meta.summary,
            minutes: lesson.meta.minutes,
          })),
        }))}
      />
      <footer className="border-t border-line pt-5">
        <Disclaimer />
      </footer>
    </div>
  );
}

import { Dashboard } from "@/components/dashboard/dashboard";
import { getModulesWithLessons, getLessons } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export const metadata = {
  alternates: { canonical: "/" },
};

const COURSE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Candlevic — Aprende trading viendo velas",
  description:
    "Curso gratuito de trading de acciones y cripto: fundamentos, análisis técnico, riesgo, psicología y práctica con datos reales.",
  provider: {
    "@type": "Organization",
    name: "Candlevic",
    url: SITE_URL,
  },
  isAccessibleForFree: true,
  inLanguage: "es",
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "online",
  },
};

export default function HomePage() {
  const modules = getModulesWithLessons();
  const totalLessons = getLessons().length;

  return (
    <div className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(COURSE_JSON_LD) }}
      />
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
    </div>
  );
}

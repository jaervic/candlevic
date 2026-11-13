import { notFound } from "next/navigation";
import { getLearningPath, LEARNING_PATHS } from "@/content/rutas";
import { getLesson } from "@/lib/content";
import { PathDetail } from "@/components/learn/path-detail";

type Params = { slug: string };

export function generateStaticParams() {
  return LEARNING_PATHS.map((path) => ({ slug: path.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const path = getLearningPath(slug);
  if (!path) return { title: "Ruta no encontrada" };
  return {
    title: `${path.name} — Ruta guiada`,
    description: path.description,
    alternates: { canonical: `/aprender/rutas/${slug}` },
  };
}

export default async function RutaPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const path = getLearningPath(slug);
  if (!path) notFound();

  const lessons = path.lessons
    .map((lessonSlug) => getLesson(lessonSlug))
    .filter((lesson): lesson is NonNullable<typeof lesson> => Boolean(lesson))
    .map((lesson) => ({
      slug: lesson.meta.slug,
      title: lesson.meta.title,
      summary: lesson.meta.summary,
      minutes: lesson.meta.minutes,
    }));

  const minutes = lessons.reduce((sum, lesson) => sum + lesson.minutes, 0);

  return <PathDetail path={path} lessons={lessons} minutes={minutes} />;
}

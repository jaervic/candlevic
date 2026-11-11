import type { Confidence, LessonProgress } from "./progress";

export type ReviewCatalogItem = {
  slug: string;
  title: string;
  module: string;
};

export type ReviewItem = ReviewCatalogItem & {
  score?: number;
  days: number;
  interval: number;
  overdue: number;
  confidence?: Confidence;
};

const DAY = 86_400_000;

/**
 * Repaso espaciado a nivel de lección.
 * Cuanto peor fue el quiz (o menos confianza), antes vuelve a aparecer.
 */
export function getReviewQueue(
  lessons: Record<string, LessonProgress>,
  confidence: Record<string, Confidence>,
  catalog: ReviewCatalogItem[],
  now = Date.now(),
): ReviewItem[] {
  const items: ReviewItem[] = [];

  for (const lesson of catalog) {
    const progress = lessons[lesson.slug];
    if (!progress || progress.status !== "completed") continue;

    const days = (now - progress.at) / DAY;
    const score = progress.quizScore;
    const base = score == null ? 2 : score >= 90 ? 7 : score >= 70 ? 4 : 2;
    const level = confidence[lesson.slug];
    const interval =
      level === "low" ? 1 : base;
    const overdue = days - interval;

    if (overdue >= 0) {
      items.push({
        ...lesson,
        score,
        days,
        interval,
        overdue,
        confidence: level,
      });
    }
  }

  return items.sort(
    (a, b) => b.overdue - a.overdue || (a.score ?? 0) - (b.score ?? 0),
  );
}

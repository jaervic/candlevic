import { describe, expect, it } from "vitest";
import { getReviewQueue } from "./review";
import type { Confidence, LessonProgress } from "./progress";

const NOW = new Date("2026-11-10T12:00:00Z").getTime();
const DAY = 86_400_000;

const catalog = [
  { slug: "a", title: "A", module: "m1" },
  { slug: "b", title: "B", module: "m1" },
  { slug: "c", title: "C", module: "m2" },
  { slug: "d", title: "D", module: "m2" },
];

const lessons: Record<string, LessonProgress> = {
  a: { status: "completed", quizScore: 100, at: NOW - 8 * DAY },
  b: { status: "completed", quizScore: 50, at: NOW - 2 * DAY },
  c: { status: "completed", quizScore: 90, at: NOW - 1 * DAY },
  d: { status: "started", at: NOW - 10 * DAY },
};

const confidence: Record<string, Confidence> = { c: "low" };

describe("getReviewQueue", () => {
  it("incluye lecciones cuyo intervalo ha vencido", () => {
    const queue = getReviewQueue(lessons, confidence, catalog, NOW);
    expect(queue.map((item) => item.slug)).toContain("a");
    expect(queue.map((item) => item.slug)).toContain("b");
  });

  it("no incluye lecciones empezadas sin completar", () => {
    const queue = getReviewQueue(lessons, confidence, catalog, NOW);
    expect(queue.map((item) => item.slug)).not.toContain("d");
  });

  it("adelanta el repaso si la confianza fue baja", () => {
    const queue = getReviewQueue(lessons, confidence, catalog, NOW);
    const c = queue.find((item) => item.slug === "c");
    expect(c).toBeDefined();
    expect(c?.interval).toBeLessThan(7);
  });

  it("ordena primero lo más atrasado", () => {
    const queue = getReviewQueue(lessons, confidence, catalog, NOW);
    expect(queue[0].slug).toBe("a");
  });
});
